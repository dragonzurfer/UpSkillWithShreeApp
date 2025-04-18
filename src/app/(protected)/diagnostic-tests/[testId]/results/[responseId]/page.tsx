'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

// Define interfaces based on backend models
interface Tag { // <-- Add Tag interface
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: string | null;
  Name: string;
}

interface Question {
  ID: number;
  Description: string;
  CorrectAnswer: string;
  AnswerChoices: string | string[] | null;
  Hint: string;
  Explanation: string;
  Tags: Tag[]; // <-- Add Tags property
  // Type might be useful too, but not strictly needed for this request
  Type: string;
  Materials: any; // Assuming Materials could be anything or null
}

interface QuestionResponse {
  ID: number;
  ResponseID: number; // Renamed from responseId for consistency
  QuestionID: number; // Renamed from questionId for consistency
  answer: string;
  Question: Question;
}

interface Response {
  ID: number;
  UserID: number; // Renamed from userId for consistency
  QuestionPaperID: number; // Renamed from questionPaperId for consistency
  QuestionPaper: {
    ID: number;
    Title: string;
    Description: string;
    Metadata: Record<string, any> | null; // Allow null
  };
  Answers: QuestionResponse[];
  CreatedAt: string;
  // Include User if needed, based on the initial JSON sample
  User: {
    ID: number;
    Name: string;
    // Add other user fields if available/needed
  };
  // Add other fields from the initial JSON sample if needed
  UpdatedAt: string;
  DeletedAt: string | null;
}


export default function ResultsPage() {
  const params = useParams();
  const testId = params.testId as string;
  const responseId = params.responseId as string;
  const router = useRouter();
  const { data: session, status } = useSession();
  const BACKEND_URL = process.env.NEXT_PUBLIC_GO_BACKEND_URL;

  // State
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<Response | null>(null);
  const [score, setScore] = useState<{ correct: number; total: number; percentage: number }>({
    correct: 0,
    total: 0,
    percentage: 0
  });

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

  // Fetch the response data
  useEffect(() => {
    // Prevent fetch if responseId is not available yet or auth is pending
    if (!responseId || !BACKEND_URL || status === 'loading') return;

    // Handle unauthenticated state explicitly after loading
    if (status !== 'authenticated') {
        setError("Authentication required to view these results.");
        setLoading(false);
        return;
    }

    const fetchResponse = async () => {
      setLoading(true);
      setError(null);
      try {
        const headers = getAuthHeaders(false);
        // This check is technically redundant now due to the status check above, but good practice
        if (!headers) {
          setError("Authentication failed or session expired.");
          setLoading(false); // Ensure loading stops
          return;
        }

        const res = await fetch(`${BACKEND_URL}/v1/api/responses/${responseId}`, {
          headers,
          cache: 'no-store' // Ensure fresh data
        });

        if (!res.ok) {
          // Provide more specific error messages if possible
          if (res.status === 401 || res.status === 403) {
            throw new Error(`Authorization failed: ${res.statusText}`);
          }
          if (res.status === 404) {
            throw new Error(`Results not found (ID: ${responseId}).`);
          }
          throw new Error(`Failed to fetch response: ${res.status} ${res.statusText}`);
        }

        const data: Response = await res.json(); // Assert the type

        // Validate the structure slightly (optional but helpful)
        if (!data || !data.Answers || !data.QuestionPaper) {
            throw new Error("Received invalid data format from server.");
        }

        setResponse(data);

        // Calculate score
        if (data.Answers && data.Answers.length > 0) {
          const total = data.Answers.length;
          // Ensure Question and CorrectAnswer exist before comparing
          const correct = data.Answers.filter(
            (ans: QuestionResponse) =>
              ans.Question && ans.Question.CorrectAnswer && // Add null checks
              ans.answer?.trim().toLowerCase() === ans.Question.CorrectAnswer.trim().toLowerCase()
          ).length;
          const percentage = total > 0 ? Math.round((correct / total) * 100) : 0; // Avoid division by zero
          setScore({ correct, total, percentage });
        } else {
          setScore({ correct: 0, total: 0, percentage: 0 }); // Handle case with no answers
        }
      } catch (err) {
        console.error("Error fetching results:", err); // Log the actual error
        setError(err instanceof Error ? err.message : 'An unknown error occurred while fetching the results');
      } finally {
        setLoading(false);
      }
    };

    fetchResponse();
  }, [BACKEND_URL, getAuthHeaders, responseId, status]); // Add status to dependencies

  // Parse answer choices
  const parseAnswerChoices = (choicesInput: string | string[] | null | undefined): string[] => {
    // 1. Handle null or undefined input
    if (choicesInput == null) { // Checks for both null and undefined
      return [];
    }

    // 2. Handle if it's already an array
    if (Array.isArray(choicesInput)) {
      // Optional but recommended: Validate it's an array of strings
      if (choicesInput.every(item => typeof item === 'string')) {
        return choicesInput as string[];
      } else {
        console.warn("Received AnswerChoices as an array, but it contains non-string elements:", choicesInput);
        // Return empty array or filter out non-strings, depending on desired behavior
        return [];
      }
    }

    // 3. Handle if it's a string (the original logic)
    if (typeof choicesInput === 'string') {
      const trimmedInput = choicesInput.trim();
      // Handle empty string after trimming
      if (trimmedInput === '') {
        return [];
      }
      // Basic check if it looks like a JSON array before attempting parse
      if (!trimmedInput.startsWith('[')) {
          console.warn("Received AnswerChoices as a string, but it doesn't look like a JSON array:", choicesInput);
          // Depending on requirements, you might return [] or try parsing anyway
          // Let's try parsing, and the catch block will handle errors.
      }
      try {
        const parsed = JSON.parse(trimmedInput);
        // Validate the parsed result
        if (Array.isArray(parsed) && parsed.every(item => typeof item === 'string')) {
          return parsed as string[];
        } else {
          console.warn("Parsed AnswerChoices string, but the result is not an array of strings:", parsed);
          return [];
        }
      } catch (e) {
        console.error("Failed to parse AnswerChoices string:", e, "Raw string:", choicesInput);
        return []; // Return empty array on parsing error
      }
    }

    // 4. Handle any other unexpected types
    console.warn("Received AnswerChoices with unexpected type:", typeof choicesInput, choicesInput);
    return [];
  };


  // Display loading state
  if (loading) {
    return (
      <div className="container mx-auto p-4 flex justify-center items-center min-h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p>Loading test results...</p>
        </div>
      </div>
    );
  }

  // Display error state
  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-4">
          <h2 className="font-semibold text-lg mb-2">Error Loading Results</h2>
          <p>{error}</p>
        </div>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Go Back
        </button>
      </div>
    );
  }

  // Display not found state
  if (!response) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg p-4 mb-4">
          <h2 className="font-semibold text-lg mb-2">Results Not Found</h2>
          <p>The requested results could not be found or you do not have permission to access them.</p>
        </div>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Go Back
        </button>
      </div>
    );
  }

  // Format date
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      // Check if date is valid before formatting
      if (isNaN(date.getTime())) {
        return "Invalid Date";
      }
      return date.toLocaleString();
    } catch (e) {
        return "Invalid Date";
    }
  };


  return (
    <div className="container mx-auto p-4 max-w-4xl"> {/* Constrain width for readability */}
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{response.QuestionPaper.Title} - Results</h1>
        <p className="text-gray-600">
          Completed on {formatDate(response.CreatedAt)}
        </p>
        {/* Display user info if available */}
        {response.User && response.User.Name && (
            <p className="text-gray-600 text-sm mt-1">Taken by: {response.User.Name}</p>
        )}
      </div>

      {/* Score Summary */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Score Summary</h2>

        <div className="flex flex-col sm:flex-row sm:justify-between items-center gap-6">
          <div className="text-center">
            <div className="text-5xl font-bold text-indigo-600">{score.percentage}%</div>
            <div className="text-sm text-gray-500 mt-1">Overall Score</div>
          </div>

          <div className="flex space-x-6 sm:space-x-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{score.correct}</div>
              <div className="text-sm text-gray-500">Correct</div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{score.total - score.correct}</div>
              <div className="text-sm text-gray-500">Incorrect</div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold">{score.total}</div>
              <div className="text-sm text-gray-500">Total Questions</div>
            </div>
          </div>
        </div>

        {/* Passing indicator */}
        {response.QuestionPaper.Metadata?.passingScore != null && ( // Check for non-null/undefined
          <div className="mt-6 pt-4 border-t">
            <div className={`flex items-center ${
              score.percentage >= response.QuestionPaper.Metadata.passingScore
              ? 'text-green-600'
              : 'text-red-600'
            }`}>
              <div className="mr-2">
                {score.percentage >= response.QuestionPaper.Metadata.passingScore ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
              </div>
              <span className="font-medium">
                {score.percentage >= response.QuestionPaper.Metadata.passingScore
                  ? 'Passed'
                  : 'Failed'
                } (Minimum passing score: {response.QuestionPaper.Metadata.passingScore}%)
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Detailed Question Review */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-6">Question Review</h2>

        <div className="space-y-8">
          {response.Answers.map((answer: QuestionResponse, index: number) => {
            // Handle potential missing Question data gracefully
            if (!answer.Question) {
              return (
                <div key={answer.ID || index} className="border-b pb-6 last:border-b-0 text-red-600">
                  Error: Question data is missing for this answer.
                </div>
              );
            }

            const isCorrect = answer.Question.CorrectAnswer &&
                              answer.answer?.trim().toLowerCase() === answer.Question.CorrectAnswer.trim().toLowerCase();
            const answerChoices = parseAnswerChoices(answer.Question.AnswerChoices);

            return (
              <div key={answer.ID} className="border-b pb-6 last:border-b-0">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-lg font-semibold text-gray-700">Question {index + 1}</span>
                  {isCorrect ? (
                    <span className="px-3 py-1 text-sm font-medium bg-green-100 text-green-800 rounded-full">Correct</span>
                  ) : (
                    <span className="px-3 py-1 text-sm font-medium bg-red-100 text-red-800 rounded-full">Incorrect</span>
                  )}
                </div>

                {/* Question Description */}
                <p className="text-md text-gray-800 mb-3">{answer.Question.Description}</p>

                {/* --- TAGS DISPLAY --- */}
                {answer.Question.Tags && answer.Question.Tags.length > 0 && (
                  <div className="mb-4 flex flex-wrap gap-2">
                    {answer.Question.Tags.map((tag) => (
                      <span
                        key={tag.ID}
                        className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full"
                      >
                        {tag.Name}
                      </span>
                    ))}
                  </div>
                )}
                {/* --- END TAGS DISPLAY --- */}


                {/* Answer Choices or Direct Answer */}
                {answerChoices.length > 0 ? (
                  <div className="space-y-2 mb-4">
                    {answerChoices.map((choice, idx) => {
                      const isUserAnswer = choice === answer.answer;
                      const isCorrectChoice = choice === answer.Question.CorrectAnswer;
                      let bgColor = 'bg-white';
                      let borderColor = 'border-gray-300';
                      let textColor = 'text-gray-900';

                      if (isCorrectChoice) {
                        bgColor = 'bg-green-50';
                        borderColor = 'border-green-400';
                        textColor = 'text-green-900';
                      } else if (isUserAnswer && !isCorrect) {
                        bgColor = 'bg-red-50';
                        borderColor = 'border-red-400';
                        textColor = 'text-red-900';
                      }

                      return (
                        <div
                          key={idx}
                          className={`p-3 border rounded-lg ${bgColor} ${borderColor} ${textColor}`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="flex-1">{choice}</span>
                            {/* Indicators */}
                            {isCorrectChoice && (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                            {isUserAnswer && !isCorrect && (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            )}
                            {isUserAnswer && isCorrect && (
                               <span className="text-xs text-gray-500 ml-2">(Your Answer)</span>
                            )}
                             {!isUserAnswer && !isCorrectChoice && isCorrect && choice === answer.answer && (
                               <span className="text-xs text-gray-500 ml-2">(Your Answer)</span>
                             )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  // Handle non-multiple choice questions (e.g., text input)
                  <div className="mb-4 space-y-3">
                     <div>
                       <span className="text-sm font-medium text-gray-600">Your Answer:</span>
                       <div className={`p-3 border rounded-lg mt-1 ${isCorrect ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'}`}>
                         {answer.answer || <span className="text-gray-400 italic">No answer provided</span>}
                       </div>
                     </div>
                     {!isCorrect && (
                       <div>
                         <span className="text-sm font-medium text-gray-600">Correct Answer:</span>
                         <div className="p-3 border rounded-lg mt-1 bg-green-50 border-green-300">
                           {answer.Question.CorrectAnswer}
                         </div>
                       </div>
                     )}
                   </div>
                )}

                {/* Explanation */}
                {answer.Question.Explanation && (
                  <div className="mt-4">
                    <h4 className="text-sm font-semibold mb-1 text-gray-700">Explanation:</h4>
                    <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600">
                      {answer.Question.Explanation}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex flex-col sm:flex-row justify-between gap-4">
        <button
          onClick={() => router.push('/diagnostic-tests')} // Adjust path if needed
          className="px-5 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition duration-150 ease-in-out"
        >
          Back to Tests List
        </button>

        {/* Conditionally show retake button based on testId */}
        {testId && (
             <button
               onClick={() => router.push(`/diagnostic-tests/${testId}/start`)}
               className="px-5 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-150 ease-in-out"
             >
               Retake Test
             </button>
        )}
      </div>
    </div>
  );
}