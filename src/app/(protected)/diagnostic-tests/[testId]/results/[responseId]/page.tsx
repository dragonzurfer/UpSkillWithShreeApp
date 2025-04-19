'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

// Define interfaces based on backend models
interface Tag {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: string | null;
  Name: string;
}

interface Material {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: string | null;
  URL: string;
  MetaTags: string;
  Description: string;
  Tags: Tag[] | null;
  Questions: any[] | null;
}

interface Question {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: string | null;
  Description: string;
  CorrectAnswer: string;
  AnswerChoices: string | string[] | null;
  Hint: string;
  Explanation: string;
  Tags: Tag[];
  Type: string;
  Materials: Material[] | null;
}

interface QuestionResponse {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: string | null;
  responseId: number;
  Response: any; // Contains circular reference
  questionId: number;
  Question: Question;
  answer: string;
}

interface User {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: string | null;
  GoogleUserID: string;
  Email: string;
  Name: string;
  Picture: string;
  IsAdmin: boolean;
  Orders: any[] | null;
}

interface QuestionPaper {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: string | null;
  Title: string;
  Description: string;
  Metadata: Record<string, any> | null;
  Questions: Question[] | null;
}

interface TopicScore {
  [key: string]: string; // e.g. "arrays": "1/1"
}

interface DifficultyScore {
  [key: string]: string; // e.g. "medium": "1/1"
}

interface Response {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: string | null;
  userId: number;
  User: User;
  questionPaperId: number;
  QuestionPaper: QuestionPaper;
  Answers: QuestionResponse[];
  totalCorrectAnswers: number;
  totalIncorrectAnswers: number;
  weightedScore: number;
  topicWiseScore: TopicScore[];
  difficultyWiseScore: DifficultyScore[];
  preparationAdvice: string;
  resources: any[];
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
        if (!headers) {
          setError("Authentication failed or session expired.");
          setLoading(false);
          return;
        }

        const res = await fetch(`${BACKEND_URL}/v1/api/responses/${responseId}`, {
          headers,
          cache: 'no-store'
        });

        if (!res.ok) {
          if (res.status === 401 || res.status === 403) {
            throw new Error(`Authorization failed: ${res.statusText}`);
          }
          if (res.status === 404) {
            throw new Error(`Results not found (ID: ${responseId}).`);
          }
          throw new Error(`Failed to fetch response: ${res.status} ${res.statusText}`);
        }

        const data: Response = await res.json();

        if (!data || !data.Answers || !data.QuestionPaper) {
            throw new Error("Received invalid data format from server.");
        }

        setResponse(data);

        // Calculate score
        if (data.totalCorrectAnswers !== undefined && data.totalIncorrectAnswers !== undefined) {
          const total = data.totalCorrectAnswers + data.totalIncorrectAnswers;
          const correct = data.totalCorrectAnswers;
          // Calculate actual accuracy percentage separately
          const accuracyPercentage = total > 0 ? Math.round((correct / total) * 100) : 0;
            
          // Set score state with correct accuracy percentage
          setScore({ correct, total, percentage: accuracyPercentage }); 
        } else if (data.Answers && data.Answers.length > 0) {
          // Fallback calculation
          const total = data.Answers.length;
          const correct = data.Answers.filter(
            (ans: QuestionResponse) =>
              ans.Question && ans.Question.CorrectAnswer &&
              ans.answer?.trim().toLowerCase() === ans.Question.CorrectAnswer.trim().toLowerCase()
          ).length;
          const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
          setScore({ correct, total, percentage });
        } else {
          setScore({ correct: 0, total: 0, percentage: 0 });
        }
      } catch (err) {
        console.error("Error fetching results:", err);
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

  // Helper function to render SVG gauge
  const renderGauge = (percentage: number, label: string, value: string | number, colorClass: string, baseColorClass: string = 'text-gray-200') => {
    // Ensure percentage is between 0-100
    const normalizedPercentage = Math.min(Math.max(percentage, 0), 100);
    
    const radius = 50;
    const circumference = 2 * Math.PI * radius * 0.75; // 270 degree arc
    const offset = circumference - (normalizedPercentage / 100) * circumference;
    const rotation = -135; // Start angle

    return (
      <div className="text-center">
        <div className="relative h-32 w-32">
          <svg className="w-full h-full" viewBox="0 0 120 120">
            {/* Base arc */}
            <circle
              className={baseColorClass}
              strokeWidth="10"
              stroke="currentColor"
              fill="transparent"
              r={radius}
              cx="60"
              cy="60"
              strokeDasharray={`${circumference} ${circumference}`}
              strokeDashoffset="0"
              transform={`rotate(${rotation} 60 60)`}
            />
            {/* Value arc */}
            <circle
              className={colorClass}
              strokeWidth="10"
              stroke="currentColor"
              fill="transparent"
              r={radius}
              cx="60"
              cy="60"
              strokeDasharray={`${circumference} ${circumference}`}
              strokeDashoffset={offset}
              transform={`rotate(${rotation} 60 60)`}
              style={{ transition: 'stroke-dashoffset 0.5s ease-in-out' }}
              strokeLinecap="round"
            />
            {/* Center text */}
            <text x="60" y="60" textAnchor="middle" dy=".3em" className="text-3xl font-bold fill-current text-gray-700">
              {value}
            </text>
            <text x="60" y="80" textAnchor="middle" className="text-sm fill-current text-gray-500">
              {label}
            </text>
          </svg>
        </div>
      </div>
    );
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
    <div className="container mx-auto p-4 max-w-5xl">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-6">DSA Test Results</h1>
      </div>

      {/* Main results summary */}
      <div className="bg-white shadow-md rounded-lg p-8 mb-8">
        <div className="flex flex-wrap justify-around items-center gap-8">
          {/* Accuracy */}
          {renderGauge(score.percentage, 'Accuracy', `${score.percentage}%`, 'text-blue-500', 'text-blue-100')}

          {/* Weighted Score - ensure we're passing a percentage value */}
          {renderGauge(
            Math.min(response.weightedScore, 100), // Ensure it's treated as a percentage (0-100)
            'Weighted S', 
            response.weightedScore, 
            'text-gray-700', 
            'text-gray-200'
          )}

          {/* Ready for Interview */}
          {response.weightedScore >= 85 && (
            <div className="text-center">
              <div className="bg-green-100 text-green-800 px-5 py-3 rounded-lg shadow-sm">
                <p className="text-lg font-medium">Ready for Interview</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Topic and Difficulty Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Topic Breakdown */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Topic Breakdown</h2>
          
          {response.topicWiseScore && response.topicWiseScore.map((topic, index) => {
            const topicName = Object.keys(topic)[0];
            const scoreText = topic[topicName];
            const [correct, total] = scoreText.split('/').map(Number);
            const percentage = Math.round((correct / total) * 100);
            
            return (
              <div key={index} className="mb-4">
                <div className="flex justify-between mb-1">
                  <span className="text-base font-medium">{topicName.charAt(0).toUpperCase() + topicName.slice(1)}: {scoreText}</span>
                  <span className="text-sm font-medium text-gray-600">({percentage}%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${percentage}%` }}></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Difficulty Breakdown */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Difficulty Breakdown</h2>
          
          <div className="space-y-2">
            {response.difficultyWiseScore && response.difficultyWiseScore.map((diff, index) => {
              const difficultyName = Object.keys(diff)[0];
              const scoreText = diff[difficultyName];
              // Ensure scoreText is valid before splitting
              if (typeof scoreText !== 'string' || !scoreText.includes('/')) {
                  console.warn("Invalid difficulty score format:", scoreText);
                  return <div key={index} className="text-red-500">Invalid difficulty data</div>; // Or handle differently
              }
              const [correct, total] = scoreText.split('/').map(Number);
              // Add check for NaN after map and division by zero
              const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
              if (isNaN(correct) || isNaN(total) || isNaN(percentage)) {
                console.warn("NaN detected in difficulty calculation:", { scoreText, correct, total, percentage });
                 return <div key={index} className="text-red-500">Calculation error</div>;
              }
              const colors = ['text-blue-600', 'text-green-600', 'text-orange-500'];
              const bgColors = ['bg-blue-400', 'bg-green-400', 'bg-orange-400']; // Adjusted for visibility

              return (
                <div key={index} className="flex items-center justify-between">
                   <div className="flex items-center">
                    <span className={`h-3 w-3 rounded-full ${bgColors[index % bgColors.length]} mr-2 flex-shrink-0`}></span>
                    <span className={`${colors[index % colors.length]} font-medium mr-2`}>
                      {difficultyName.charAt(0).toUpperCase() + difficultyName.slice(1)}:
                    </span>
                    <span className="text-gray-600">{scoreText}</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-700">{percentage}%</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Preparation Advice */}
      <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-6 mb-8">
        <div className="flex items-start">
          <div className="flex-shrink-0 mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">Preparation Advice</h2>
            <p className="text-gray-800">{response.preparationAdvice}</p>
          </div>
        </div>
      </div>

      {/* Resources & Next Steps -> Renamed to Question Review */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Question Review</h2>
        {response.Answers && response.Answers.length > 0 ? (
          <div className="space-y-6"> {/* Added container for spacing */}
            {response.Answers.map((answerDetail, index) => {
              const question = answerDetail.Question;
              if (!question) {
                console.warn(`Missing question data for answer at index ${index}`);
                return <p key={`missing-${index}`}>Missing question data for review (Index: {index}).</p>;
              }

              const userAnswer = answerDetail.answer;
              const correctAnswer = question.CorrectAnswer;
              // Ensure case-insensitivity and trim whitespace for comparison
              const isCorrect = userAnswer?.trim().toLowerCase() === correctAnswer?.trim().toLowerCase();
              const tags = question.Tags?.map(tag => tag.Name).join(', ') || 'General';

              return (
                <div key={answerDetail.ID || `question-${index}`} className="border-b border-gray-200 pb-6 last:border-b-0"> {/* Added border between questions */}
                  {/* Question Header */}
                  <div className="flex items-center mb-3 flex-wrap"> {/* Added flex-wrap */}
                    <span className={`${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} px-3 py-1 rounded-md mr-3 font-medium whitespace-nowrap`}> {/* Added whitespace-nowrap */}
                      {`Q${index + 1}: ${isCorrect ? 'Correct' : 'Incorrect'}`}
                    </span>
                    <span className="font-semibold mr-2" title={question.Description}>
                      {question.Description || `Question ID: ${question.ID}`}
                    </span>
                    <span className="text-gray-500 text-sm">({tags})</span>
                  </div>

                  {/* Answer display */}
                  <div className="mb-4 pl-4 border-l-4 border-gray-200">
                    <p className="mb-1 text-gray-700"><span className="font-medium">Your Answer:</span> {userAnswer || <span className="italic text-gray-500">Not Answered</span>}</p>
                    <p className="text-gray-700"><span className="font-medium">Correct Answer:</span> {correctAnswer}</p>
                  </div>

                  {/* Explanation & Materials */}
                  {(question.Explanation || (question.Materials && question.Materials.length > 0)) && (
                    <div className="space-y-3 mt-4 bg-gray-50 p-4 rounded-md">
                      {question.Explanation && (
                        <div>
                          <h3 className="font-medium mb-1 text-gray-800">Explanation</h3>
                          <p className="text-gray-600">{question.Explanation}</p>
                        </div>
                      )}
                      {question.Materials && question.Materials.length > 0 && (
                         <div>
                           <h3 className="font-medium mb-2 text-gray-800">Related Materials</h3>
                           <ul className="list-disc list-inside space-y-1">
                           {question.Materials.map((material, idx) => (
                             <li key={idx}>
                                <a
                                  href={material.URL}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-500 hover:underline hover:text-blue-700"
                                >
                                  {material.Description || material.URL}
                                </a>
                              </li>
                           ))}
                           </ul>
                         </div>
                      )}
                    </div>
                  )}
                  {!question.Explanation && (!question.Materials || question.Materials.length === 0) && (
                     <p className="text-gray-500 italic mt-2">No explanation or materials available for this question.</p>
                   )}
                </div>
              );
            })}
          </div>
        ) : (
          <p>No question details available for review.</p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4 mb-8">
        <button
          onClick={() => router.push(`/diagnostic-tests/${testId}/start`)}
          className="px-5 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition duration-150 ease-in-out"
        >
          Retake Test
        </button>
        
        <button
          onClick={() => router.push('/diagnostic-tests')}
          className="px-5 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-150 ease-in-out"
        >
          Try Another
        </button>
      </div>
    </div>
  );
}