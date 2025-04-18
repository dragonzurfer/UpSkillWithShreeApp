'use client';

import React, { useState, useEffect, useCallback } from 'react';

// Define the basic interfaces needed
interface Question {
  ID: number;
  Description: string;
  CorrectAnswer: string;
  AnswerChoices?: string;
  Hint?: string;
  Explanation?: string;
  Tags?: Array<{ ID: number; Name: string }>;
}

interface QuestionPaper {
  ID: number;
  Title: string;
  Description: string;
  Metadata?: Record<string, any>;
  Questions: Question[];
  CreatedAt: string;
  UpdatedAt: string;
}

// Props for the component
interface QuestionPaperManagementProps {
  BACKEND_URL: string | undefined;
  getAuthHeaders: (includeContentType?: boolean) => Record<string, string> | null;
  parseError: (response: Response) => Promise<string>;
  primaryButtonClass: string;
  secondaryButtonClass: string;
  dangerButtonClass: string;
  inputClass: string;
  ErrorMessage: React.FC<{ children: React.ReactNode }>;
  LoadingIndicator: React.FC<{ children: React.ReactNode }>;
  InfoMessage?: React.FC<{ children: React.ReactNode }>;
  EmptyTableMessage: React.FC<{ colSpan: number; children: React.ReactNode }>;
  TableContainer: React.FC<{ children: React.ReactNode }>;
  questions: Question[];
}

const QuestionPaperManagement: React.FC<QuestionPaperManagementProps> = ({
  BACKEND_URL,
  getAuthHeaders,
  parseError,
  primaryButtonClass,
  secondaryButtonClass,
  dangerButtonClass,
  inputClass,
  ErrorMessage,
  LoadingIndicator,
  EmptyTableMessage,
  TableContainer,
  questions,
}) => {
  // State for question papers
  const [papers, setPapers] = useState<QuestionPaper[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // State for create/edit form
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentPaper, setCurrentPaper] = useState<Partial<QuestionPaper>>({
    Title: '',
    Description: '',
    Metadata: {},
    Questions: [],
  });

  // State for Metadata JSON editor
  const [metadataJson, setMetadataJson] = useState<string>('{}');
  const [metadataError, setMetadataError] = useState<string | null>(null);

  // State for question assignment
  const [selectedPaperId, setSelectedPaperId] = useState<number | null>(null);
  const [availableQuestions, setAvailableQuestions] = useState<Question[]>([]);
  const [loadingAvailableQuestions, setLoadingAvailableQuestions] = useState<boolean>(false);

  // Fetch all question papers
  const fetchPapers = useCallback(async () => {
    const headers = getAuthHeaders(false);
    if (!headers) return;

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BACKEND_URL}/v1/api/papers`, {
        method: 'GET',
        headers,
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error(await parseError(response));
      }

      const data = await response.json();
      setPapers(data || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to fetch question papers');
    } finally {
      setLoading(false);
    }
  }, [BACKEND_URL, getAuthHeaders, parseError]);

  // Fetch available questions for a paper
  const fetchAvailableQuestions = useCallback(async (paperId: number) => {
    const headers = getAuthHeaders(false);
    if (!headers) return;

    setLoadingAvailableQuestions(true);
    try {
      const response = await fetch(`${BACKEND_URL}/v1/api/papers/${paperId}/questions/available`, {
        method: 'GET',
        headers,
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error(await parseError(response));
      }

      const data = await response.json();
      setAvailableQuestions(data || []);
    } catch (e) {
      console.error('Failed to fetch available questions:', e);
      setAvailableQuestions([]);
    } finally {
      setLoadingAvailableQuestions(false);
    }
  }, [BACKEND_URL, getAuthHeaders, parseError]);

  // Handle creating a new question paper
  const handleCreatePaper = async () => {
    const headers = getAuthHeaders();
    if (!headers) return;

    // Validate metadata JSON
    let metadata = {};
    try {
      metadata = JSON.parse(metadataJson);
    } catch (e) {
      setMetadataError('Invalid JSON format');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BACKEND_URL}/v1/api/papers`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          Title: currentPaper.Title,
          Description: currentPaper.Description,
          Metadata: metadata,
        }),
      });

      if (!response.ok) {
        throw new Error(await parseError(response));
      }

      // Reset form and fetch updated list
      setIsCreating(false);
      setCurrentPaper({ Title: '', Description: '', Metadata: {}, Questions: [] });
      setMetadataJson('{}');
      setMetadataError(null);
      await fetchPapers();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to create question paper');
    } finally {
      setLoading(false);
    }
  };

  // Handle updating a question paper
  const handleUpdatePaper = async () => {
    if (!currentPaper.ID) return;
    
    // Validate metadata JSON
    let metadata = {};
    try {
      metadata = JSON.parse(metadataJson);
    } catch (e) {
      setMetadataError('Invalid JSON format');
      return;
    }
    
    const headers = getAuthHeaders();
    if (!headers) return;

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BACKEND_URL}/v1/api/papers/${currentPaper.ID}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          Title: currentPaper.Title,
          Description: currentPaper.Description,
          Metadata: metadata,
        }),
      });

      if (!response.ok) {
        throw new Error(await parseError(response));
      }

      // Reset form and fetch updated list
      setIsEditing(false);
      setCurrentPaper({ Title: '', Description: '', Metadata: {}, Questions: [] });
      setMetadataJson('{}');
      setMetadataError(null);
      await fetchPapers();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to update question paper');
    } finally {
      setLoading(false);
    }
  };

  // Handle deleting a question paper
  const handleDeletePaper = async (id: number) => {
    if (!confirm('Are you sure you want to delete this question paper?')) return;
    
    const headers = getAuthHeaders();
    if (!headers) return;

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BACKEND_URL}/v1/api/papers/${id}`, {
        method: 'DELETE',
        headers,
      });

      if (!response.ok) {
        throw new Error(await parseError(response));
      }

      await fetchPapers();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to delete question paper');
    } finally {
      setLoading(false);
    }
  };

  // Handle adding a question to a paper
  const handleAddQuestionToPaper = async (paperId: number, questionId: number) => {
    const headers = getAuthHeaders();
    if (!headers) return;

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BACKEND_URL}/v1/api/papers/${paperId}/questions/${questionId}/add`, {
        method: 'POST',
        headers,
      });

      if (!response.ok) {
        throw new Error(await parseError(response));
      }

      // Refresh available questions and paper list
      await fetchAvailableQuestions(paperId);
      await fetchPapers();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to add question to paper');
    } finally {
      setLoading(false);
    }
  };

  // Handle removing a question from a paper
  const handleRemoveQuestionFromPaper = async (paperId: number, questionId: number) => {
    const headers = getAuthHeaders();
    if (!headers) return;

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BACKEND_URL}/v1/api/papers/${paperId}/questions/${questionId}/remove`, {
        method: 'POST',
        headers,
      });

      if (!response.ok) {
        throw new Error(await parseError(response));
      }

      // Refresh available questions and paper list
      await fetchAvailableQuestions(paperId);
      await fetchPapers();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to remove question from paper');
    } finally {
      setLoading(false);
    }
  };

  // Load question papers on initial render
  useEffect(() => {
    fetchPapers();
  }, [fetchPapers]);

  // Edit paper handler
  const handleEditPaper = (paper: QuestionPaper) => {
    setCurrentPaper(paper);
    setIsEditing(true);
    setIsCreating(false);
    
    // Set metadata JSON string
    try {
      setMetadataJson(JSON.stringify(paper.Metadata || {}, null, 2));
      setMetadataError(null);
    } catch (e) {
      setMetadataJson('{}');
      setMetadataError('Failed to parse metadata');
    }
  };

  // Handle opening question management for a paper
  const handleManageQuestions = (paperId: number) => {
    setSelectedPaperId(paperId);
    fetchAvailableQuestions(paperId);
  };

  // Current paper's questions
  const currentPaperQuestions = selectedPaperId 
    ? papers.find(p => p.ID === selectedPaperId)?.Questions || []
    : [];

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-8">
      <h2 className="text-xl font-semibold mb-4">Question Paper Management</h2>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}

      {/* Create/Edit Form */}
      {(isCreating || isEditing) && (
        <form onSubmit={(e) => {
          e.preventDefault();
          isEditing ? handleUpdatePaper() : handleCreatePaper();
        }} className="mb-6 p-4 border rounded">
          <h3 className="text-lg font-medium mb-4">
            {isEditing ? 'Edit Question Paper' : 'Create New Question Paper'}
          </h3>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              value={currentPaper.Title || ''}
              onChange={(e) => setCurrentPaper({ ...currentPaper, Title: e.target.value })}
              className={inputClass}
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={currentPaper.Description || ''}
              onChange={(e) => setCurrentPaper({ ...currentPaper, Description: e.target.value })}
              className={inputClass}
              rows={3}
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Metadata (JSON)
              {metadataError && <span className="text-red-500 text-xs ml-2">{metadataError}</span>}
            </label>
            <textarea
              value={metadataJson}
              onChange={(e) => {
                setMetadataJson(e.target.value);
                // Clear error when user starts typing
                if (metadataError) setMetadataError(null);
              }}
              onBlur={() => {
                // Validate JSON on blur
                try {
                  JSON.parse(metadataJson);
                  setMetadataError(null);
                } catch (e) {
                  setMetadataError('Invalid JSON format');
                }
              }}
              className={`${inputClass} ${metadataError ? 'border-red-500' : ''}`}
              rows={5}
              placeholder='{"example": "value"}'
            />
            <p className="text-xs text-gray-500 mt-1">
              Use this field for additional paper settings like time limit, passing score, etc.
            </p>
          </div>
          
          <div className="flex justify-end space-x-2">
            <button 
              type="button" 
              onClick={() => {
                setIsCreating(false);
                setIsEditing(false);
                setCurrentPaper({ Title: '', Description: '', Metadata: {}, Questions: [] });
                setMetadataJson('{}');
                setMetadataError(null);
              }}
              className={secondaryButtonClass}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className={primaryButtonClass}
              disabled={loading || !!metadataError}
            >
              {loading ? 'Saving...' : (isEditing ? 'Update' : 'Create')}
            </button>
          </div>
        </form>
      )}

      {/* Create Button (only show if not already creating/editing) */}
      {!isCreating && !isEditing && !selectedPaperId && (
        <button 
          onClick={() => {
            setIsCreating(true);
            setIsEditing(false);
            setCurrentPaper({ Title: '', Description: '', Metadata: {}, Questions: [] });
            setMetadataJson('{}');
            setMetadataError(null);
          }}
          className={`${primaryButtonClass} mb-4`}
        >
          Create New Question Paper
        </button>
      )}

      {/* Question Management Interface (when a paper is selected) */}
      {selectedPaperId && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">
              Managing Questions for: {papers.find(p => p.ID === selectedPaperId)?.Title}
            </h3>
            <button 
              onClick={() => setSelectedPaperId(null)}
              className={secondaryButtonClass}
            >
              Back to Papers List
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Current Questions */}
            <div className="border rounded p-4">
              <h4 className="font-medium mb-2">Current Questions ({currentPaperQuestions.length})</h4>
              {currentPaperQuestions.length === 0 ? (
                <p className="text-gray-500 text-sm">No questions added to this paper yet.</p>
              ) : (
                <div className="max-h-96 overflow-y-auto">
                  <ul className="divide-y">
                    {currentPaperQuestions.map(question => (
                      <li key={question.ID} className="py-3">
                        <div className="flex justify-between">
                          <div className="pr-4 flex-1">
                            <p className="text-sm font-medium mb-1">{question.Description}</p>
                            <p className="text-xs text-gray-500 mb-1">
                              <span className="font-semibold">Answer:</span> {question.CorrectAnswer}
                            </p>
                            {question.Tags && question.Tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {question.Tags.map(tag => (
                                  <span 
                                    key={tag.ID} 
                                    className="px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full"
                                  >
                                    {tag.Name}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                          <button 
                            onClick={() => handleRemoveQuestionFromPaper(selectedPaperId, question.ID)}
                            className="text-red-500 text-xs px-2 py-1 h-8 border border-red-300 rounded hover:bg-red-50 self-start"
                            disabled={loading}
                          >
                            Remove
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Available Questions */}
            <div className="border rounded p-4">
              <h4 className="font-medium mb-2">Available Questions ({availableQuestions.length})</h4>
              {loadingAvailableQuestions ? (
                <LoadingIndicator>Loading available questions...</LoadingIndicator>
              ) : availableQuestions.length === 0 ? (
                <p className="text-gray-500 text-sm">No more questions available to add.</p>
              ) : (
                <div className="max-h-96 overflow-y-auto">
                  <ul className="divide-y">
                    {availableQuestions.map(question => (
                      <li key={question.ID} className="py-3">
                        <div className="flex justify-between">
                          <div className="pr-4 flex-1">
                            <p className="text-sm font-medium mb-1">{question.Description}</p>
                            <p className="text-xs text-gray-500 mb-1">
                              <span className="font-semibold">Answer:</span> {question.CorrectAnswer}
                            </p>
                            {question.Tags && question.Tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {question.Tags.map(tag => (
                                  <span 
                                    key={tag.ID} 
                                    className="px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full"
                                  >
                                    {tag.Name}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                          <button 
                            onClick={() => handleAddQuestionToPaper(selectedPaperId, question.ID)}
                            className="text-green-500 text-xs px-2 py-1 h-8 border border-green-300 rounded hover:bg-green-50 self-start"
                            disabled={loading}
                          >
                            Add
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Papers List */}
      {!selectedPaperId && (
        <>
          {loading && !isCreating && !isEditing ? (
            <LoadingIndicator>Loading question papers...</LoadingIndicator>
          ) : (
            <TableContainer>
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Questions</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Metadata</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {papers.length === 0 ? (
                  <EmptyTableMessage colSpan={4}>No question papers found</EmptyTableMessage>
                ) : (
                  papers.map((paper) => (
                    <tr key={paper.ID}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{paper.Title}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{paper.Description}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className="font-medium">{paper.Questions?.length || 0}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {paper.Metadata && Object.keys(paper.Metadata).length > 0 && (
                          <span className="ml-2 text-xs px-2 py-0.5 bg-gray-100 rounded-full">
                            Has metadata
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleManageQuestions(paper.ID)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            Manage Questions
                          </button>
                          <button
                            onClick={() => handleEditPaper(paper)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeletePaper(paper.ID)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </TableContainer>
          )}
        </>
      )}
    </div>
  );
};

export default QuestionPaperManagement; 