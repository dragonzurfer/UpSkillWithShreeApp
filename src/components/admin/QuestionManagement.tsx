import React, { useState, useEffect, useCallback, useMemo } from 'react';

// Define interfaces (can be moved to a types file)
interface Tag {
    ID: number;
    Name: string;
    // Add other fields if needed
}

interface Material {
    ID: number;
    URL: string;
    Description: string;
    // Add other fields if needed
}

interface Question {
    ID: number;
    Description: string;
    CorrectAnswer: string;
    AnswerChoices: string[];
    Hint: string | null;
    Explanation: string | null;
    Tags: Tag[];
    Materials: Material[];
    CreatedAt: string;
    UpdatedAt: string;
    Type: 'multiple_choice' | 'text' | string;
}

// Props expected by the component
interface QuestionManagementProps {
    BACKEND_URL?: string;
    getAuthHeaders: (includeContentType?: boolean) => Record<string, string> | null;
    parseError: (response: Response) => Promise<string>;
    tags: Tag[]; // All available tags
    materials: Material[]; // All available materials
    // Styling props
    baseButtonClass: string;
    primaryButtonClass: string;
    secondaryButtonClass: string;
    dangerButtonClass: string;
    inputClass: string;
    ErrorMessage: React.FC<{ children: React.ReactNode }>;
    LoadingIndicator: React.FC<{ children: React.ReactNode }>;
    EmptyTableMessage: React.FC<{ colSpan: number; children: React.ReactNode }>;
    TableContainer: React.FC<{ children: React.ReactNode }>;
}

const QuestionManagement: React.FC<QuestionManagementProps> = ({ 
    BACKEND_URL,
    getAuthHeaders,
    parseError,
    tags: allTags, 
    materials: allMaterials,
    baseButtonClass,
    primaryButtonClass,
    secondaryButtonClass,
    dangerButtonClass,
    inputClass,
    ErrorMessage,
    LoadingIndicator,
    EmptyTableMessage,
    TableContainer 
}) => {

    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [modalError, setModalError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [currentQuestion, setCurrentQuestion] = useState<Partial<Question> | null>(null);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [newChoice, setNewChoice] = useState<string>('');
    const [tagSearchQuery, setTagSearchQuery] = useState<string>('');

    // --- API Calls --- 

    const fetchQuestions = useCallback(async () => {
        if (!BACKEND_URL) return;
        const headers = getAuthHeaders(false);
        if (!headers) {
            setError("Authentication required.");
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${BACKEND_URL}/v1/api/questions`, { 
                method: 'GET', 
                headers, 
                cache: 'no-store' 
            });
            if (!response.ok) throw new Error(await parseError(response));
            const data = await response.json();
            // Ensure AnswerChoices is always an array
            const formattedQuestions = (data || []).map((q: any) => ({
                ...q,
                AnswerChoices: Array.isArray(q.AnswerChoices) 
                                ? q.AnswerChoices 
                                : typeof q.AnswerChoices === 'string' 
                                    ? q.AnswerChoices.split(',').map((s: string) => s.trim()).filter(Boolean) 
                                    : [], // Default to empty array if not array or string
                // Ensure Tags and Materials are arrays too, just in case
                Tags: Array.isArray(q.Tags) ? q.Tags : [],
                Materials: Array.isArray(q.Materials) ? q.Materials : [],
                // Default to text type if not specified
                Type: q.Type || 'text'
            }));
            setQuestions(formattedQuestions);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Error fetching questions');
            setQuestions([]);
        } finally {
            setLoading(false);
        }
    }, [BACKEND_URL, getAuthHeaders, parseError]);

    useEffect(() => {
        fetchQuestions();
    }, [fetchQuestions]);

    // --- Modal Handling --- 

    const openModal = (question: Question | null = null) => {
        setCurrentQuestion(question 
            ? { ...question } 
            : { 
                Description: '', 
                CorrectAnswer: '', 
                AnswerChoices: [], 
                Hint: '', 
                Explanation: '', 
                Tags: [], 
                Materials: [],
                Type: 'multiple_choice' // Default to multiple choice for new questions
            });
        setModalError(null);
        setNewChoice('');
        setTagSearchQuery('');
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentQuestion(null);
        setModalError(null);
        setNewChoice('');
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        if (!currentQuestion) return;
        const { name, value } = e.target;
        setCurrentQuestion({ ...currentQuestion, [name]: value });
    };

    // Add a new answer choice
    const handleAddChoice = () => {
        if (!currentQuestion || !newChoice.trim()) return;
        
        const choices = [...(currentQuestion.AnswerChoices || []), newChoice.trim()];
        setCurrentQuestion({ ...currentQuestion, AnswerChoices: choices });
        setNewChoice('');
    };

    // Remove an answer choice
    const handleRemoveChoice = (index: number) => {
        if (!currentQuestion) return;
        
        const choices = [...(currentQuestion.AnswerChoices || [])];
        choices.splice(index, 1);
        
        // If we're removing the correct answer, reset it
        if (currentQuestion.CorrectAnswer === currentQuestion.AnswerChoices?.[index]) {
            setCurrentQuestion({ 
                ...currentQuestion, 
                AnswerChoices: choices,
                CorrectAnswer: '' 
            });
        } else {
            setCurrentQuestion({ ...currentQuestion, AnswerChoices: choices });
        }
    };

    // Set an option as the correct answer
    const handleSetCorrectAnswer = (choice: string) => {
        if (!currentQuestion) return;
        setCurrentQuestion({ ...currentQuestion, CorrectAnswer: choice });
    };

    // Legacy method for backward compatibility
    const handleAnswerChoicesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!currentQuestion) return;
        const choices = e.target.value.split(',').map(choice => choice.trim()).filter(Boolean);
        setCurrentQuestion({ ...currentQuestion, AnswerChoices: choices });
    };

    // --- Save/Update/Delete --- 

    const handleSave = async () => {
        if (!currentQuestion || !BACKEND_URL) return;
        const headers = getAuthHeaders();
        if (!headers) {
            setModalError("Authentication required.");
            return;
        }

        // Validate multiple choice questions have choices and a correct answer
        if (currentQuestion.Type === 'multiple_choice') {
            if ((currentQuestion.AnswerChoices?.length || 0) < 2) {
                setModalError("Multiple choice questions must have at least 2 answer choices.");
                return;
            }
            
            if (!currentQuestion.CorrectAnswer) {
                setModalError("Please select a correct answer for this multiple choice question.");
                return;
            }
            
            if (!currentQuestion.AnswerChoices?.includes(currentQuestion.CorrectAnswer)) {
                setModalError("The correct answer must be one of the answer choices.");
                return;
            }
        }

        setIsSaving(true);
        setModalError(null);

        const isUpdating = currentQuestion.ID !== undefined;
        const url = isUpdating 
            ? `${BACKEND_URL}/v1/api/questions/${currentQuestion.ID}`
            : `${BACKEND_URL}/v1/api/questions`;
        const method = isUpdating ? 'PUT' : 'POST';

        // Prepare payload (ensure fields are correct)
        const payload: any = {
            Description: currentQuestion.Description,
            CorrectAnswer: currentQuestion.CorrectAnswer,
            AnswerChoices: currentQuestion.AnswerChoices || [],
            Hint: currentQuestion.Hint || null,
            Explanation: currentQuestion.Explanation || null,
            Type: currentQuestion.Type,
            // Tags and Materials are handled separately after create/update
        };

        try {
            const response = await fetch(url, {
                method,
                headers,
                body: JSON.stringify(payload),
            });

            if (!response.ok) throw new Error(await parseError(response));
            
            const savedQuestion = await response.json();
            const questionId = savedQuestion.ID;

            // --- Handle Tag Associations --- 
            const currentTagIds = currentQuestion.Tags?.map(t => t.ID) || [];
            const originalTagIds = isUpdating ? (questions.find(q => q.ID === currentQuestion.ID)?.Tags || []).map(t => t.ID) : [];
            
            const tagsToAdd = currentTagIds.filter(id => !originalTagIds.includes(id));
            const tagsToRemove = originalTagIds.filter(id => !currentTagIds.includes(id));

            for (const tagId of tagsToAdd) {
                await associateItem(questionId, tagId, 'tags');
            }
            for (const tagId of tagsToRemove) {
                await disassociateItem(questionId, tagId, 'tags');
            }

            // --- Handle Material Associations --- 
            const currentMaterialIds = currentQuestion.Materials?.map(m => m.ID) || [];
            const originalMaterialIds = isUpdating ? (questions.find(q => q.ID === currentQuestion.ID)?.Materials || []).map(m => m.ID) : [];
            
            const materialsToAdd = currentMaterialIds.filter(id => !originalMaterialIds.includes(id));
            const materialsToRemove = originalMaterialIds.filter(id => !currentMaterialIds.includes(id));

            for (const materialId of materialsToAdd) {
                await associateItem(questionId, materialId, 'materials');
            }
            for (const materialId of materialsToRemove) {
                await disassociateItem(questionId, materialId, 'materials');
            }

            // --- Finalize --- 
            await fetchQuestions(); // Re-fetch to update the list
            closeModal();

        } catch (e) {
            setModalError(e instanceof Error ? e.message : 'Failed to save question');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!BACKEND_URL || !window.confirm('Are you sure you want to delete this question?')) return;
        const headers = getAuthHeaders(false);
        if (!headers) {
            setError("Authentication required.");
            return;
        }

        setError(null);
        try {
            const response = await fetch(`${BACKEND_URL}/v1/api/questions/${id}`, {
                method: 'DELETE',
                headers,
            });
            if (!response.ok && response.status !== 204) throw new Error(await parseError(response)); // 204 No Content is also OK
            await fetchQuestions(); // Re-fetch
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Failed to delete question');
        }
    };

    // --- Association Helpers --- 

    const associateItem = async (questionId: number, itemId: number, type: 'tags' | 'materials') => {
        if (!BACKEND_URL) return;
        const headers = getAuthHeaders(false);
        if (!headers) return;
        try {
            const response = await fetch(`${BACKEND_URL}/v1/api/questions/${questionId}/${type}/${itemId}/add`, {
                method: 'POST',
                headers,
            });
            if (!response.ok) console.error(`Failed to add ${type} ${itemId} to question ${questionId}: ${await parseError(response)}`);
        } catch (e) {
            console.error(`Error adding ${type} ${itemId} to question ${questionId}:`, e);
        }
    };

    const disassociateItem = async (questionId: number, itemId: number, type: 'tags' | 'materials') => {
        if (!BACKEND_URL) return;
        const headers = getAuthHeaders(false);
        if (!headers) return;
        try {
            const response = await fetch(`${BACKEND_URL}/v1/api/questions/${questionId}/${type}/${itemId}/remove`, {
                method: 'POST',
                headers,
            });
            if (!response.ok && response.status !== 204) console.error(`Failed to remove ${type} ${itemId} from question ${questionId}: ${await parseError(response)}`);
        } catch (e) {
            console.error(`Error removing ${type} ${itemId} from question ${questionId}:`, e);
        }
    };

    const handleTagSelectionChange = (tagId: number, isSelected: boolean) => {
        if (!currentQuestion) return;
        const currentTags = currentQuestion.Tags || [];
        let updatedTags;
        if (isSelected) {
            const tagToAdd = allTags.find(t => t.ID === tagId);
            if (tagToAdd && !currentTags.some(t => t.ID === tagId)) {
                updatedTags = [...currentTags, tagToAdd];
            } else {
                updatedTags = currentTags;
            }
        } else {
            updatedTags = currentTags.filter(t => t.ID !== tagId);
        }
        setCurrentQuestion({ ...currentQuestion, Tags: updatedTags });
    };

    const handleMaterialSelectionChange = (materialId: number, isSelected: boolean) => {
        if (!currentQuestion) return;
        const currentMaterials = currentQuestion.Materials || [];
        let updatedMaterials;
        if (isSelected) {
            const materialToAdd = allMaterials.find(m => m.ID === materialId);
            if (materialToAdd && !currentMaterials.some(m => m.ID === materialId)) {
                updatedMaterials = [...currentMaterials, materialToAdd];
            } else {
                updatedMaterials = currentMaterials;
            }
        } else {
            updatedMaterials = currentMaterials.filter(m => m.ID !== materialId);
        }
        setCurrentQuestion({ ...currentQuestion, Materials: updatedMaterials });
    };

    // Filter tags based on search query
    const filteredTags = useMemo(() => {
        if (!tagSearchQuery.trim()) return allTags;
        return allTags.filter(tag => 
            tag.Name.toLowerCase().includes(tagSearchQuery.toLowerCase())
        );
    }, [allTags, tagSearchQuery]);

    // --- Memoized Lists for Performance --- 
    const sortedQuestions = useMemo(() => 
        [...questions].sort((a, b) => new Date(b.CreatedAt).getTime() - new Date(a.CreatedAt).getTime()), 
    [questions]);

    // --- Render Logic --- 
    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold">Question Management</h2>
            <div className="flex justify-end">
                <button onClick={() => openModal()} className={primaryButtonClass}>
                    Add New Question
                </button>
            </div>

            {error && <ErrorMessage>{error}</ErrorMessage>}

            <TableContainer>
                <thead className="bg-gray-50 sticky top-0 z-10">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Answer</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Choices</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tags</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {loading ? (
                        <tr><td colSpan={6}><LoadingIndicator>Loading questions...</LoadingIndicator></td></tr>
                    ) : sortedQuestions.length === 0 ? (
                        <EmptyTableMessage colSpan={6}>No questions found.</EmptyTableMessage>
                    ) : (
                        sortedQuestions.map((q) => (
                            <tr key={q.ID}>
                                <td className="px-6 py-4 whitespace-pre-wrap text-sm text-gray-900 max-w-xs truncate">{q.Description}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <span className={`px-2 py-1 rounded-full text-xs ${q.Type === 'multiple_choice' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                                        {q.Type === 'multiple_choice' ? 'Multiple Choice' : 'Text Input'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{q.CorrectAnswer}</td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    {q.Type === 'multiple_choice' ? (
                                        <ul className="list-disc list-inside">
                                            {(q.AnswerChoices || []).map((choice, idx) => (
                                                <li key={idx} className={choice === q.CorrectAnswer ? 'font-medium text-green-600' : ''}>
                                                    {choice}
                                                    {choice === q.CorrectAnswer && ' ✓'}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <span className="italic text-gray-400">None</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    <div className="flex flex-wrap gap-1">
                                        {q.Tags.map(tag => (
                                            <span key={tag.ID} className="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-800">{tag.Name}</span>
                                        ))}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                    <button onClick={() => openModal(q)} className={secondaryButtonClass}>Edit</button>
                                    <button onClick={() => handleDelete(q.ID)} className={dangerButtonClass}>Delete</button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </TableContainer>

            {/* --- Add/Edit Modal --- */}
            {isModalOpen && currentQuestion && (
                <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-600 bg-opacity-75 transition-opacity" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        {/* Background overlay */} 
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>
                        {/* Modal panel */} 
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
                                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <div className="sm:flex sm:items-start">
                                        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                            <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                                                {currentQuestion.ID ? 'Edit Question' : 'Add New Question'}
                                            </h3>
                                            <div className="mt-4 space-y-4">
                                                {modalError && <ErrorMessage>{modalError}</ErrorMessage>}
                                                
                                                <div>
                                                    <label htmlFor="Type" className="block text-sm font-medium text-gray-700">Question Type</label>
                                                    <select
                                                        id="Type"
                                                        name="Type"
                                                        className={inputClass}
                                                        value={currentQuestion.Type || 'multiple_choice'}
                                                        onChange={handleInputChange}
                                                        disabled={isSaving}
                                                    >
                                                        <option value="multiple_choice">Multiple Choice</option>
                                                        <option value="text">Text Input</option>
                                                    </select>
                                                </div>
                                                
                                                <div>
                                                    <label htmlFor="Description" className="block text-sm font-medium text-gray-700">Description</label>
                                                    <textarea
                                                        id="Description"
                                                        name="Description"
                                                        rows={3}
                                                        className={inputClass}
                                                        value={currentQuestion.Description || ''}
                                                        onChange={handleInputChange}
                                                        required
                                                        disabled={isSaving}
                                                    />
                                                </div>

                                                {currentQuestion.Type === 'multiple_choice' ? (
                                                    <>
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-2">Answer Choices</label>
                                                            <div className="space-y-2 mb-2">
                                                                {(currentQuestion.AnswerChoices || []).map((choice, idx) => (
                                                                    <div key={idx} className="flex items-center space-x-2">
                                                                        <input
                                                                            type="radio"
                                                                            id={`choice-${idx}`}
                                                                            name="CorrectAnswer"
                                                                            value={choice}
                                                                            checked={currentQuestion.CorrectAnswer === choice}
                                                                            onChange={() => handleSetCorrectAnswer(choice)}
                                                                            className="h-4 w-4"
                                                                            disabled={isSaving}
                                                                        />
                                                                        <label htmlFor={`choice-${idx}`} className="flex-1 text-sm">{choice}</label>
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => handleRemoveChoice(idx)}
                                                                            className="text-red-500 hover:text-red-700"
                                                                            disabled={isSaving}
                                                                        >
                                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                                            </svg>
                                                                        </button>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                            <div className="flex space-x-2">
                                                                <input
                                                                    type="text"
                                                                    className={inputClass}
                                                                    value={newChoice}
                                                                    onChange={(e) => setNewChoice(e.target.value)}
                                                                    placeholder="New answer choice"
                                                                    disabled={isSaving}
                                                                />
                                                                <button
                                                                    type="button"
                                                                    onClick={handleAddChoice}
                                                                    className={baseButtonClass}
                                                                    disabled={!newChoice.trim() || isSaving}
                                                                >
                                                                    Add
                                                                </button>
                                                            </div>
                                                            {!currentQuestion.AnswerChoices || currentQuestion.AnswerChoices.length === 0 ? (
                                                                <p className="text-sm text-yellow-600 mt-1">
                                                                    Please add at least 2 answer choices.
                                                                </p>
                                                            ) : !currentQuestion.CorrectAnswer && (
                                                                <p className="text-sm text-yellow-600 mt-1">
                                                                    Please select a correct answer.
                                                                </p>
                                                            )}
                                                        </div>
                                                    </>
                                                ) : (
                                                    <div>
                                                        <label htmlFor="CorrectAnswer" className="block text-sm font-medium text-gray-700">Correct Answer</label>
                                                        <input
                                                            type="text"
                                                            id="CorrectAnswer"
                                                            name="CorrectAnswer"
                                                            className={inputClass}
                                                            value={currentQuestion.CorrectAnswer || ''}
                                                            onChange={handleInputChange}
                                                            required
                                                            disabled={isSaving}
                                                        />
                                                    </div>
                                                )}

                                                <div>
                                                    <label htmlFor="Hint" className="block text-sm font-medium text-gray-700">Hint (Optional)</label>
                                                    <input
                                                        type="text"
                                                        id="Hint"
                                                        name="Hint"
                                                        className={inputClass}
                                                        value={currentQuestion.Hint || ''}
                                                        onChange={handleInputChange}
                                                        disabled={isSaving}
                                                    />
                                                </div>

                                                <div>
                                                    <label htmlFor="Explanation" className="block text-sm font-medium text-gray-700">Explanation (Optional)</label>
                                                    <textarea
                                                        id="Explanation"
                                                        name="Explanation"
                                                        rows={2}
                                                        className={inputClass}
                                                        value={currentQuestion.Explanation || ''}
                                                        onChange={handleInputChange}
                                                        disabled={isSaving}
                                                    />
                                                </div>

                                                {/* Tag Selection */}
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                                                    <div className="mb-2">
                                                        <input 
                                                            type="text" 
                                                            className={inputClass}
                                                            placeholder="Search tags..."
                                                            value={tagSearchQuery}
                                                            onChange={(e) => setTagSearchQuery(e.target.value)}
                                                            disabled={isSaving}
                                                        />
                                                    </div>
                                                    <div className="max-h-32 overflow-y-auto border border-gray-300 rounded-md p-2 space-y-1">
                                                        {filteredTags.length === 0 && <p className="text-xs text-gray-500">No tags found.</p>}
                                                        {filteredTags.map(tag => (
                                                            <div key={tag.ID} className="flex items-center">
                                                                <input
                                                                    id={`tag-${tag.ID}`}
                                                                    type="checkbox"
                                                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded mr-2 disabled:opacity-50"
                                                                    checked={currentQuestion.Tags?.some(t => t.ID === tag.ID) || false}
                                                                    onChange={(e) => handleTagSelectionChange(tag.ID, e.target.checked)}
                                                                    disabled={isSaving}
                                                                />
                                                                <label htmlFor={`tag-${tag.ID}`} className="text-sm text-gray-700">{tag.Name}</label>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Material Selection */}
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Materials</label>
                                                    <div className="max-h-32 overflow-y-auto border border-gray-300 rounded-md p-2 space-y-1">
                                                        {allMaterials.length === 0 && <p className="text-xs text-gray-500">No materials available.</p>}
                                                        {allMaterials.map(material => (
                                                            <div key={material.ID} className="flex items-center">
                                                                <input
                                                                    id={`material-${material.ID}`}
                                                                    type="checkbox"
                                                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded mr-2 disabled:opacity-50"
                                                                    checked={currentQuestion.Materials?.some(m => m.ID === material.ID) || false}
                                                                    onChange={(e) => handleMaterialSelectionChange(material.ID, e.target.checked)}
                                                                    disabled={isSaving}
                                                                />
                                                                <label htmlFor={`material-${material.ID}`} className="text-sm text-gray-700 truncate" title={material.Description}>{material.URL}</label>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                    <button 
                                        type="submit"
                                        className={`${primaryButtonClass} w-full sm:ml-3 sm:w-auto`}
                                        disabled={isSaving}
                                    >
                                        {isSaving ? 'Saving...' : 'Save Question'}
                                    </button>
                                    <button 
                                        type="button" 
                                        onClick={closeModal} 
                                        className={`${secondaryButtonClass} mt-3 w-full sm:mt-0 sm:w-auto`}
                                        disabled={isSaving}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default QuestionManagement; 