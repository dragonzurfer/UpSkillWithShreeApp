'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import TagManagement from '@/components/admin/TagManagement';       // Import TagManagement
import MaterialManagement from '@/components/admin/MaterialManagement'; // Import MaterialManagement
import QuestionManagement from '@/components/admin/QuestionManagement'; // Import QuestionManagement
import QuestionPaperManagement from '@/components/admin/QuestionPaperManagement'; // Import QuestionPaperManagement

// Helper to parse errors from Fetch API Response
async function parseError(response: Response): Promise<string> {
    try {
        const data = await response.json();
        return data.error || data.message || response.statusText;
    } catch (e) {
        return response.statusText;
    }
}

// Shared Interface (or move to a types file)
interface Tag {
  ID: number;
  Name: string;
  CreatedAt: string;
  UpdatedAt: string;
}

// Define Material Interface (adjust based on actual API response)
interface Material {
    ID: number;
    URL: string;
    Description: string;
    MetaTags: string[]; // Assuming backend sends as array
    Tags: Tag[]; // Assuming backend sends associated tags
    CreatedAt: string;
    UpdatedAt: string;
}

// Define QuestionPaper Interface
interface QuestionPaper {
    ID: number;
    Title: string;
    Description: string;
    Metadata: any; // Using any for JSON type
    Questions: {
        ID: number;
        Description: string;
        CorrectAnswer: string;
    }[];
    CreatedAt: string;
    UpdatedAt: string;
}

// Main Admin Dashboard Page Component
const AdminDashboardPage: React.FC = () => {
  const { data: session, status } = useSession();
  const BACKEND_URL = process.env.NEXT_PUBLIC_GO_BACKEND_URL;

  // State for all tags (needed by MaterialManagement & QuestionManagement)
  const [tags, setTags] = useState<Tag[]>([]);
  const [loadingAllTags, setLoadingAllTags] = useState<boolean>(false);
  const [fetchAllTagsError, setFetchAllTagsError] = useState<string | null>(null);

  // State for all materials (needed by QuestionManagement)
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loadingAllMaterials, setLoadingAllMaterials] = useState<boolean>(false);
  const [fetchAllMaterialsError, setFetchAllMaterialsError] = useState<string | null>(null);

  // State for all questions (needed by QuestionPaperManagement)
  const [questions, setQuestions] = useState<any[]>([]);
  const [loadingAllQuestions, setLoadingAllQuestions] = useState<boolean>(false);
  const [fetchAllQuestionsError, setFetchAllQuestionsError] = useState<string | null>(null);

  // Helper function to get headers (passed down)
  const getAuthHeaders = useCallback((includeContentType = true): Record<string, string> | null => {
    if (status !== 'authenticated' || !session?.idToken) return null;
    const headers: Record<string, string> = {
      'Authorization': `Bearer ${session.idToken}`,
    };
    if (includeContentType) {
      headers['Content-Type'] = 'application/json';
    }
    return headers;
  }, [session, status]);

  // Fetch all tags (for MaterialManagement)
  const fetchAllTags = useCallback(async () => {
      if (!BACKEND_URL || status !== 'authenticated') return;
      const headers = getAuthHeaders(false);
      if (!headers) {
          setFetchAllTagsError("Authentication required to fetch tags.");
          return;
      }
      setLoadingAllTags(true);
      setFetchAllTagsError(null);
      try {
          const url = `${BACKEND_URL}/v1/api/tags`;
          const response = await fetch(url, { method: 'GET', headers, cache: 'no-store' });
          if (!response.ok) throw new Error(await parseError(response));
          const data = await response.json();
          setTags(data || []);
      } catch (e) {
          setFetchAllTagsError(e instanceof Error ? e.message : 'Error fetching tags');
          setTags([]);
      } finally {
          setLoadingAllTags(false);
      }
  }, [BACKEND_URL, getAuthHeaders, status]);

  // Fetch all materials (for QuestionManagement)
  const fetchAllMaterials = useCallback(async () => {
      if (!BACKEND_URL || status !== 'authenticated') return;
      const headers = getAuthHeaders(false);
      if (!headers) {
          setFetchAllMaterialsError("Authentication required to fetch materials.");
          return;
      }
      setLoadingAllMaterials(true);
      setFetchAllMaterialsError(null);
      try {
          const url = `${BACKEND_URL}/v1/api/materials`; // Assuming this is the endpoint
          const response = await fetch(url, { method: 'GET', headers, cache: 'no-store' });
          if (!response.ok) throw new Error(await parseError(response));
          const data = await response.json();
          setMaterials(data || []);
      } catch (e) {
          setFetchAllMaterialsError(e instanceof Error ? e.message : 'Error fetching materials');
          setMaterials([]);
      } finally {
          setLoadingAllMaterials(false);
      }
  }, [BACKEND_URL, getAuthHeaders, status]);

  // Fetch all questions (for QuestionPaperManagement)
  const fetchAllQuestions = useCallback(async () => {
      if (!BACKEND_URL || status !== 'authenticated') return;
      const headers = getAuthHeaders(false);
      if (!headers) {
          setFetchAllQuestionsError("Authentication required to fetch questions.");
          return;
      }
      setLoadingAllQuestions(true);
      setFetchAllQuestionsError(null);
      try {
          const url = `${BACKEND_URL}/v1/api/questions`;
          const response = await fetch(url, { method: 'GET', headers, cache: 'no-store' });
          if (!response.ok) throw new Error(await parseError(response));
          const data = await response.json();
          setQuestions(data || []);
      } catch (e) {
          setFetchAllQuestionsError(e instanceof Error ? e.message : 'Error fetching questions');
          setQuestions([]);
      } finally {
          setLoadingAllQuestions(false);
      }
  }, [BACKEND_URL, getAuthHeaders, status]);

  // Fetch tags and materials when authenticated
  useEffect(() => {
      if (status === 'authenticated') {
          fetchAllTags();
          fetchAllMaterials();
          fetchAllQuestions();
      } else {
          setTags([]);
          setMaterials([]);
          setQuestions([]);
      }
  }, [status, fetchAllTags, fetchAllMaterials, fetchAllQuestions]);

  // --- Render Logic ---
  if (status === 'loading') {
    return <div className="p-4">Loading session...</div>;
  }

  // --- Shared Styling Components & Classes (Passed Down) ---
  const baseButtonClass = "px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition ease-in-out duration-150";
  const primaryButtonClass = `${baseButtonClass} bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500`;
  const secondaryButtonClass = `${baseButtonClass} bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-500`;
  const dangerButtonClass = `${baseButtonClass} bg-red-600 text-white hover:bg-red-700 focus:ring-red-500`;
  const inputClass = "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:opacity-50 disabled:bg-gray-100";

  const ErrorMessage: React.FC<{ children: React.ReactNode }> = ({ children }) => (
      <p className="text-red-600 bg-red-100 border border-red-400 p-3 rounded mb-4 text-sm">Error: {children}</p>
  );
  const InfoMessage: React.FC<{ children: React.ReactNode }> = ({ children }) => (
       <p className="text-yellow-700 bg-yellow-100 border border-yellow-400 p-3 rounded mb-4 text-sm">{children}</p>
  );
  const LoadingIndicator: React.FC<{ children: React.ReactNode }> = ({ children }) => (
      <p className="text-gray-600 py-4 text-center">{children}</p>
  );
  const TableContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="shadow border-b border-gray-200 sm:rounded-lg overflow-x-auto">
      <div className="max-h-[600px] overflow-y-auto">
        <table className="min-w-full divide-y divide-gray-200">
          {children}
        </table>
      </div>
    </div>
  );
  const EmptyTableMessage: React.FC<{ colSpan: number; children: React.ReactNode }> = ({ colSpan, children }) => (
        <tr><td colSpan={colSpan} className="px-6 py-4 text-center text-sm text-gray-500">{children}</td></tr>
   );

  // Props to pass down to child components
  const sharedProps = {
      BACKEND_URL,
      getAuthHeaders,
      parseError,
      baseButtonClass,
      primaryButtonClass,
      secondaryButtonClass,
      dangerButtonClass,
      inputClass,
      ErrorMessage,
      LoadingIndicator,
      EmptyTableMessage,
      TableContainer,
  };

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Admin Dashboard</h1>

      {/* Display general status messages */} 
      {status === 'unauthenticated' && <InfoMessage>Please log in to view admin content.</InfoMessage>}
      {!BACKEND_URL && <ErrorMessage>Backend URL not configured.</ErrorMessage>}
      {fetchAllTagsError && <ErrorMessage>Failed to load initial tag data: {fetchAllTagsError}</ErrorMessage>}
      {fetchAllMaterialsError && <ErrorMessage>Failed to load initial material data: {fetchAllMaterialsError}</ErrorMessage>}
      {fetchAllQuestionsError && <ErrorMessage>Failed to load initial question data: {fetchAllQuestionsError}</ErrorMessage>}

      {/* Render Management Sections only when authenticated and URL is available */}
      {status === 'authenticated' && BACKEND_URL && (
        <>
          {/* --- Tag Management Section --- */}
          <TagManagement {...sharedProps} />

          {/* --- Material Management Section --- */}
          <MaterialManagement 
            {...sharedProps} 
            tags={tags} // Pass fetched tags
          />

          {/* --- Question Management Section --- */}
          <QuestionManagement
            {...sharedProps}
            tags={tags} // Pass fetched tags
            materials={materials} // Pass fetched materials
          />

          {/* --- Question Paper Management Section --- */}
          <QuestionPaperManagement
            {...sharedProps}
            questions={questions} // Pass fetched questions
          />

          {/* Add other admin sections here (e.g., Users) */}
        </>
      )}

    </div>
  );
};

export default AdminDashboardPage; 