'use client';

import React, { useState, useEffect, useCallback } from 'react';

// --- Interfaces (can be shared or redefined) ---
interface Tag {
  ID: number;
  Name: string;
  CreatedAt: string;
  UpdatedAt: string;
}

// --- Prop Types ---
interface TagManagementProps {
  BACKEND_URL: string | undefined;
  getAuthHeaders: (includeContentType?: boolean) => Record<string, string> | null;
  parseError: (response: Response) => Promise<string>;
  // Styling props
  baseButtonClass: string;
  primaryButtonClass: string;
  secondaryButtonClass: string;
  dangerButtonClass: string;
  inputClass: string;
  ErrorMessage: React.FC<{ children: React.ReactNode }>;
  LoadingIndicator: React.FC<{ children: React.ReactNode }>;
  EmptyTableMessage: React.FC<{ colSpan: number; children: React.ReactNode }>;
}

// --- Component ---
const TagManagement: React.FC<TagManagementProps> = ({
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
}) => {
  // --- State for Tags ---
  const [tags, setTags] = useState<Tag[]>([]);
  const [loadingTags, setLoadingTags] = useState<boolean>(false);
  const [tagError, setTagError] = useState<string | null>(null);
  const [isTagModalOpen, setIsTagModalOpen] = useState<boolean>(false);
  const [currentTag, setCurrentTag] = useState<Partial<Tag> | null>(null);
  const [tagName, setTagName] = useState<string>('');

  // --- Tag CRUD Functions ---
  const fetchTags = useCallback(async () => {
    if (!BACKEND_URL) return;
    const headers = getAuthHeaders(false);
    if (!headers) {
      setTagError("Authentication required to fetch tags.");
      return;
    }
    setLoadingTags(true);
    setTagError(null);
    try {
      const url = `${BACKEND_URL}/v1/api/tags`;
      const response = await fetch(url, { method: 'GET', headers, cache: 'no-store' });
      if (!response.ok) throw new Error(await parseError(response));
      const data = await response.json();
      setTags(data || []);
    } catch (e) {
      setTagError(e instanceof Error ? e.message : 'Error fetching tags');
      setTags([]);
    } finally {
      setLoadingTags(false);
    }
  }, [BACKEND_URL, getAuthHeaders, parseError]);

  // Initial fetch
  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  // Handlers for Tag Modal
  const handleOpenTagModal = (tag: Partial<Tag> | null = null) => {
    setCurrentTag(tag);
    setTagName(tag?.Name || '');
    setIsTagModalOpen(true);
    setTagError(null);
  };

  const handleCloseTagModal = () => {
    setIsTagModalOpen(false);
    setCurrentTag(null);
    setTagName('');
    setTagError(null);
  };

  // Handle Save Tag (Create/Update)
  const handleSaveTag = useCallback(async () => {
    if (!tagName.trim() || !BACKEND_URL) {
      setTagError("Tag name cannot be empty or backend URL not configured.");
      return;
    }
    const headers = getAuthHeaders();
    if (!headers) {
      setTagError("Authentication required.");
      return;
    }
    setTagError(null);
    setLoadingTags(true);
    const method = currentTag?.ID ? 'PUT' : 'POST';
    const url = currentTag?.ID
      ? `${BACKEND_URL}/v1/api/tags/${currentTag.ID}`
      : `${BACKEND_URL}/v1/api/tags`;
    const body = JSON.stringify({ Name: tagName });
    try {
      const response = await fetch(url, {
        method: method,
        headers: headers,
        body: body,
      });
      if (!response.ok) throw new Error(await parseError(response));
      handleCloseTagModal();
      await fetchTags(); // Refresh the list
    } catch (e) {
      console.error("Failed to save tag:", e);
      setTagError(e instanceof Error ? e.message : 'An unknown error occurred while saving the tag');
    } finally {
      setLoadingTags(false);
    }
  }, [BACKEND_URL, getAuthHeaders, parseError, tagName, currentTag, fetchTags]);

  // Handle Delete Tag
  const handleDeleteTag = useCallback(async (id: number) => {
    if (!confirm('Are you sure you want to delete this tag?')) return;
    if (!BACKEND_URL) {
      setTagError("Backend URL not configured.");
      return;
    }
    const headers = getAuthHeaders(false);
    if (!headers) {
      setTagError("Authentication required.");
      return;
    }
    setLoadingTags(true);
    setTagError(null);
    try {
      const url = `${BACKEND_URL}/v1/api/tags/${id}`;
      const response = await fetch(url, {
        method: 'DELETE',
        headers: headers,
      });
      if (!response.ok) throw new Error(await parseError(response));
      await fetchTags(); // Refresh the list
    } catch (e) {
      console.error("Failed to delete tag:", e);
      setTagError(e instanceof Error ? e.message : 'An unknown error occurred while deleting the tag');
    } finally {
      setLoadingTags(false);
    }
  }, [BACKEND_URL, getAuthHeaders, parseError, fetchTags]);

  // --- Render Logic ---
  return (
    <section className="bg-white shadow rounded-lg p-4 md:p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Manage Tags</h2>
        <button onClick={() => handleOpenTagModal()} className={primaryButtonClass}>Add New Tag</button>
      </div>
      {!isTagModalOpen && tagError && <ErrorMessage>{tagError}</ErrorMessage>}
      {loadingTags && <LoadingIndicator>Loading tags...</LoadingIndicator>}
      {!loadingTags && (
        <div className="overflow-x-auto">
          <div className="max-h-[400px] overflow-y-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Updated At</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tags.length > 0 ? (
                  tags.map((tag) => (
                    <tr key={tag.ID} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{tag.ID}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{tag.Name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{new Date(tag.CreatedAt).toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{new Date(tag.UpdatedAt).toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button onClick={() => handleOpenTagModal(tag)} disabled={loadingTags} className={secondaryButtonClass}>Edit</button>
                        <button onClick={() => handleDeleteTag(tag.ID)} disabled={loadingTags} className={dangerButtonClass}>Delete</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <EmptyTableMessage colSpan={5}>No tags found.</EmptyTableMessage>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tag Modal */}
      {isTagModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <div className="relative mx-auto p-6 border w-full max-w-md shadow-lg rounded-md bg-white space-y-4">
            <h2 className="text-lg font-medium leading-6 text-gray-900">{currentTag?.ID ? 'Edit Tag' : 'Create New Tag'}</h2>
            {tagError && <ErrorMessage>{tagError}</ErrorMessage>} {/* Show error inside modal */}
            <div>
              <label htmlFor="tagName" className="block text-sm font-medium text-gray-700 mb-1">Name:</label>
              <input id="tagName" type="text" value={tagName} onChange={(e) => setTagName(e.target.value)} required className={inputClass} disabled={loadingTags} />
            </div>
            <div className="flex justify-end space-x-3">
              <button onClick={handleCloseTagModal} disabled={loadingTags} className={secondaryButtonClass}>Cancel</button>
              <button onClick={handleSaveTag} disabled={loadingTags || !tagName.trim()} className={primaryButtonClass}>
                {loadingTags ? 'Saving...' : 'Save Tag'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default TagManagement; 