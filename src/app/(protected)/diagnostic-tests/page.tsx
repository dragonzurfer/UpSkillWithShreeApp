// src/app/(protected)/diagnostic-tests/page.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { fetchWithAuth, fetchJsonWithAuth } from '@/utils/api';

// Define interfaces
interface QuestionPaper {
  ID: number;
  Title: string;
  Description: string;
  Metadata: Record<string, any>;
  Questions: Array<{ ID: number }>;
  CreatedAt: string;
  UpdatedAt: string;
}

interface Response {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: null | string;
  userId: number;
  User: {
    ID: number;
    CreatedAt: string;
    UpdatedAt: string;
    DeletedAt: null | string;
    GoogleUserID: string;
    Email: string;
    Name: string;
    Picture: string;
    IsAdmin: boolean;
  };
  questionPaperId: number;
  QuestionPaper: {
    ID: number;
    Title: string;
    Description: string;
    Metadata: null | Record<string, any>;
    Questions: null | Array<any>;
  };
  Answers: null | Array<any>;
}

export default function DiagnosticTestsPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const BACKEND_URL = process.env.NEXT_PUBLIC_GO_BACKEND_URL;

  // State
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [questionPapers, setQuestionPapers] = useState<QuestionPaper[]>([]);
  const [userResponses, setUserResponses] = useState<Response[]>([]);
  const [activeTab, setActiveTab] = useState<'available' | 'completed'>('available');
  const [expandedPapers, setExpandedPapers] = useState<Record<string, boolean>>({});

  // Fixed CTA button text
  const ctaText = "Start Diagnostic Now";

  // Helper function to get auth headers
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

  // Fetch question papers and user responses
  useEffect(() => {
    if (!BACKEND_URL || status !== 'authenticated') return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const headers = getAuthHeaders(false);
        if (!headers) {
          setError("Authentication required to view tests.");
          setLoading(false); // Stop loading if not authenticated
          return;
        }

        // Use fetchJsonWithAuth to safely handle JSON parsing
        try {
          const papersData = await fetchJsonWithAuth<QuestionPaper[]>(`${BACKEND_URL}/v1/api/papers`, {
            headers,
            cache: 'no-store' // Ensure fresh data
          });
          
          setQuestionPapers(papersData || []);
        } catch (papersError) {
          console.error("Error fetching papers:", papersError);
          setError(papersError instanceof Error ? papersError.message : 'Failed to fetch tests');
          // Continue to try to fetch responses
        }

        // Try to fetch responses separately so one failure doesn't affect the other
        try {
          const responsesData = await fetchJsonWithAuth<Response[]>(`${BACKEND_URL}/v1/api/responses/me`, {
            headers,
            cache: 'no-store' // Ensure fresh data
          });
          
          setUserResponses(responsesData || []);
        } catch (responsesError) {
          console.warn("Error fetching responses:", responsesError);
          // Just set empty responses but don't fail the whole page
          setUserResponses([]);
        }
      } catch (err) {
        console.error("Error fetching diagnostic tests data:", err);
        setError(err instanceof Error ? err.message : 'An error occurred while fetching tests.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [BACKEND_URL, getAuthHeaders, status]); // Depend on status to refetch if auth changes

  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch (e) {
      console.error("Error formatting date:", e);
      return 'Invalid Date';
    }
  };

  // Get completed test IDs
  const completedTestIds = new Set(userResponses.map(response => response.questionPaperId));

  // Show all papers in available tests (don't filter out completed ones)
  const availablePapers = questionPapers;

  // Group responses by question paper for the completed tab
  const responsesByPaper = userResponses.reduce((acc, response) => {
    // Fix property naming to match the API response format
    const paperId = response.questionPaperId;
    
    // Extract title from the nested QuestionPaper object
    const paperTitle = response.QuestionPaper?.Title || 'Test Title Unavailable';

    if (!acc[paperId]) {
      acc[paperId] = {
        paperTitle: paperTitle,
        responses: [],
      };
    }
    acc[paperId].responses.push(response);
    // Sort responses within each paper group by date (newest first)
    acc[paperId].responses.sort((a, b) => new Date(b.CreatedAt).getTime() - new Date(a.CreatedAt).getTime());
    return acc;
  }, {} as Record<number, { paperTitle: string; responses: Response[] }>);

  // Toggle function to expand/collapse paper attempts
  const togglePaperExpanded = (paperId: string) => {
    setExpandedPapers(prev => ({
      ...prev,
      [paperId]: !prev[paperId]
    }));
  };

  // Display loading state
  if (status === 'loading' || (status === 'authenticated' && loading)) {
    return (
      <div className="container mx-auto p-4 flex justify-center items-center min-h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p>Loading tests...</p>
        </div>
      </div>
    );
  }

  // Display error state
  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    );
  }

  // Handle unauthenticated state
  if (status !== 'authenticated') {
     return (
      <div className="container mx-auto p-4 text-center">
        <p className="text-gray-600">Please log in to view diagnostic tests.</p>
        {/* Optional: Add a login button */}
      </div>
    );
  }


  return (
    <div className="container mx-auto px-6 py-10 max-w-7xl">
      <div className="relative mb-16">
        <div className="absolute inset-x-0 top-1/2 h-0.5 bg-gradient-to-r from-transparent via-gray-200 to-transparent transform -translate-y-1/2"></div>
        <h1 className="relative z-10 text-4xl font-semibold tracking-tight text-gray-900 bg-white inline-block pr-6">Diagnostic Tests</h1>
      </div>
      
      {/* Tabs - Enhanced for better visibility of active tab */}
      <div className="border-b border-gray-200 mb-10 flex justify-between items-end">
        <nav className="flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('available')}
            className={`py-4 px-3 border-b-[3px] font-medium transition-all relative ${
              activeTab === 'available'
                ? 'border-indigo-500 text-indigo-600 text-lg font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-indigo-500'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 text-base'
            }`}
            aria-current={activeTab === 'available' ? 'page' : undefined}
          >
            Available Tests ({availablePapers.length})
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`py-4 px-3 border-b-[3px] font-medium transition-all relative ${
              activeTab === 'completed'
                ? 'border-indigo-500 text-indigo-600 text-lg font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-indigo-500'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 text-base'
            }`}
            aria-current={activeTab === 'completed' ? 'page' : undefined}
          >
            Completed Tests ({Object.keys(responsesByPaper).length})
          </button>
        </nav>
      </div>
      
      {/* Background pattern */}
      <div className="absolute inset-0 bg-white bg-opacity-70 z-[-1] overflow-hidden">
        <div className="absolute inset-0 opacity-[0.02]" style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }}></div>
      </div>
      
      {/* Available Tests */}
      {activeTab === 'available' && (
        <div className="transition-opacity duration-300 ease-in-out">
          {availablePapers.length === 0 && questionPapers.length > 0 ? (
            <div className="text-center bg-gray-50 p-8 rounded-lg shadow-sm">
              <p className="text-gray-600 text-lg">You have completed all available tests!</p>
            </div>
          ) : availablePapers.length === 0 && questionPapers.length === 0 ? (
             <div className="text-center bg-gray-50 p-8 rounded-lg shadow-sm">
              <p className="text-gray-600 text-lg">No diagnostic tests are available at this time.</p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {availablePapers.map((paper) => (
                <div key={paper.ID} 
                  className="bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-100 shadow-xl shadow-indigo-100/10 
                  overflow-hidden hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 ease-out flex flex-col relative"
                  style={{ minHeight: "28rem" }}
                >
                  {/* Accent line at top */}
                  <div className="h-1 w-full bg-gradient-to-r from-indigo-500 to-purple-500"></div>
                  
                  <div className="p-8 flex-grow overflow-hidden">
                    {/* Improved title styling */}
                    <h2 className="text-2xl font-semibold tracking-tight mb-2 text-gray-900 line-clamp-2">{paper.Title}</h2>
                    <p className="text-gray-500 mb-5 line-clamp-2 text-sm">{paper.Description}</p>
                    
                    {/* Company tags with distinct colors and better spacing */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      <span className="px-2.5 py-1.5 bg-[#4285F4]/10 text-[#4285F4] text-xs font-medium rounded-full border border-[#4285F4]/20 flex items-center space-x-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#4285F4] inline-block"></span>
                        <span>Google</span>
                      </span>
                      <span className="px-2.5 py-1.5 bg-[#1877F2]/10 text-[#1877F2] text-xs font-medium rounded-full border border-[#1877F2]/20 flex items-center space-x-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#1877F2] inline-block"></span>
                        <span>Meta</span>
                      </span>
                      <span className="px-2.5 py-1.5 bg-[#FF9900]/10 text-[#FF9900] text-xs font-medium rounded-full border border-[#FF9900]/20 flex items-center space-x-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FF9900] inline-block"></span>
                        <span>Amazon</span>
                      </span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-500 mb-6 space-x-6">
                      <span className="flex items-center space-x-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                        </svg>
                        <span className="font-medium">{paper.Questions?.length ?? 'N/A'}</span> Questions
                      </span>
                      {paper.Metadata?.timeLimit && (
                        <span className="flex items-center space-x-2">
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="font-medium">{paper.Metadata.timeLimit}</span>
                        </span>
                      )}
                    </div>
                    
                    {/* Condensed price display */}
                    <div className="mb-4 inline-flex items-center bg-green-50 px-3 py-1.5 rounded-full">
                      <span className="font-bold text-green-600 text-lg">₹499</span>
                      <span className="line-through text-gray-400 text-xs ml-2">₹999</span>
                    </div>
                  </div>
                  <div className="p-8 pt-0 mt-auto">
                     {/* Enhanced button with gradient and icon */}
                     <Link
                      href={`/diagnostic-tests/${paper.ID}/start`}
                      className={`block w-full text-center px-5 py-3.5 font-medium text-white rounded-xl 
                      transition-all duration-300 bg-gradient-to-r from-green-500 to-emerald-600 
                      hover:from-green-600 hover:to-emerald-700 hover:shadow-lg 
                      hover:shadow-green-500/20 hover:scale-[1.02] 
                      focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 
                      flex items-center justify-center space-x-2`}
                      aria-label={completedTestIds.has(paper.ID) 
                        ? `Retake ${paper.Title} test` 
                        : `Start ${paper.Title} diagnostic test now for ₹499 today`}
                    >
                      {completedTestIds.has(paper.ID) ? (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                          <span>Retake Test</span>
                        </>
                      ) : (
                        <>
                          <span>₹499 Today</span>
                          <span className="mx-1">•</span>
                          <span>Start Test</span>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </>
                      )}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      
      {/* Completed Tests */}
      {activeTab === 'completed' && (
         <div className="transition-opacity duration-300 ease-in-out">
          {Object.keys(responsesByPaper).length === 0 ? (
            <div className="text-center bg-gray-50 p-8 rounded-lg shadow-sm">
              <p className="text-gray-500 text-lg">You haven't completed any tests yet.</p>
            </div>
          ) : (
            <div className="space-y-8">
              {Object.entries(responsesByPaper).map(([paperId, data]) => (
                <div key={paperId} className="bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-100 shadow-xl shadow-indigo-100/10 overflow-hidden hover:shadow-2xl transition-all duration-300">
                   <div className="p-8 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                     <h2 className="text-2xl font-semibold tracking-tight mb-2 sm:mb-0 text-gray-900">{data.paperTitle}</h2>
                     {/* Consistent CTA button styling */}
                     <Link
                       href={`/diagnostic-tests/${paperId}/start`}
                       className="px-4 py-2 mt-2 sm:mt-0 text-sm rounded-xl transition-all duration-300 
                       bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 
                       text-white hover:shadow-lg hover:shadow-green-500/20 hover:scale-[1.02] 
                       flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                       aria-label={`Retake ${data.paperTitle} test`}
                     >
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                       </svg>
                       <span>Retake Test</span>
                     </Link>
                   </div>
                  <div className="p-8">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-md font-medium text-gray-700">Your Attempts:</h3>
                      {data.responses.length > 1 && (
                        <button 
                          onClick={() => togglePaperExpanded(paperId)}
                          className="text-sm text-indigo-600 hover:text-indigo-800 transition-colors flex items-center space-x-2 
                          focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-md px-2 py-1 hover:bg-indigo-50"
                          aria-expanded={expandedPapers[paperId] ? 'true' : 'false'}
                        >
                          <span>{expandedPapers[paperId] ? 'Hide' : 'Show all'} ({data.responses.length}) attempts</span>
                          <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform ${expandedPapers[paperId] ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                      )}
                    </div>
                    <ul className="space-y-4">
                      {/* Show only latest attempt if not expanded */}
                      {data.responses
                        .slice(0, expandedPapers[paperId] ? data.responses.length : 1)
                        .map((response, index) => (
                        <li key={response.ID} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 
                        bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200 
                        hover:shadow-md transition-all duration-300">
                          <div className="mb-2 sm:mb-0">
                            <span className="block font-medium text-gray-800">
                              {expandedPapers[paperId] ? `Attempt ${data.responses.length - index}` : 'Latest Attempt'}
                            </span>
                            <span className="text-sm text-gray-500 flex items-center mt-1">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              Completed on: {formatDate(response.CreatedAt)}
                            </span>
                          </div>
                          <div>
                            <Link
                              href={`/diagnostic-tests/${response.questionPaperId}/results/${response.ID}`}
                              className="inline-flex items-center px-4 py-2 text-sm rounded-xl 
                              transition-all duration-300 bg-white border border-blue-400 text-blue-600 
                              hover:bg-blue-50 hover:border-blue-500 hover:shadow-md hover:shadow-blue-100/50 
                              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 space-x-2"
                              aria-label={`View results for ${data.paperTitle} attempt ${expandedPapers[paperId] ? data.responses.length - index : 'latest'}`}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                              </svg>
                              <span>View Results</span>
                            </Link>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}