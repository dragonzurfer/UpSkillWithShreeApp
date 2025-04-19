'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { load, Cashfree } from "@cashfreepayments/cashfree-js"; // Import load and Cashfree type

// Define the interfaces based on the backend models
interface Question {
  ID: number;
  Description: string;
  CorrectAnswer: string;
  AnswerChoices: string; // Serialized array of strings
  Hint: string;
  Explanation: string;
  Type: 'multiple_choice' | 'text' | string;
}

interface QuestionPaper {
  ID: number;
  Title: string;
  Description: string;
  Metadata: Record<string, any>;
  Questions: Question[];
}

interface QuestionResponse {
  QuestionID: number;
  Answer: string;
}

// Interface for 402 Payment Required Error Response
interface PaymentRequiredError {
  error: string;
  productId: number;
  productName: string;
  cost: number;
  currency: string;
}

// Interface for Payment Session Response (expecting session ID now)
interface PaymentSessionResponse {
  paymentSessionId: string;
  order_id: string; // Assuming order_id might still be returned
  // payment_link is no longer needed here
}

export default function StartTestPage() {
  const params = useParams();
  const testId = params.testId as string;
  const router = useRouter();
  const { data: session, status } = useSession();
  const BACKEND_URL = process.env.NEXT_PUBLIC_GO_BACKEND_URL;

  // State for the test
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [questionPaper, setQuestionPaper] = useState<QuestionPaper | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<Map<number, string>>(new Map());
  const [submitting, setSubmitting] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // State for payment flow
  const [paymentRequired, setPaymentRequired] = useState(false);
  const [paymentProductId, setPaymentProductId] = useState<number | null>(null);
  const [paymentDetails, setPaymentDetails] = useState<PaymentRequiredError | null>(null);
  const [initiatingPayment, setInitiatingPayment] = useState(false);
  const [paymentInitiationError, setPaymentInitiationError] = useState<string | null>(null);

  // Ref or State to hold the initialized Cashfree instance
  const [cashfree, setCashfree] = useState<Cashfree | null>(null);

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

  // Fetch the question paper
  useEffect(() => {
    if (!BACKEND_URL || status !== 'authenticated') return;
    
    const fetchQuestionPaper = async () => {
      setLoading(true);
      setError(null);
      setPaymentRequired(false); // Reset payment state on each fetch
      setPaymentProductId(null);
      setPaymentDetails(null);
      try {
        const headers = getAuthHeaders(false);
        if (!headers) {
          setError("Authentication required to take this test.");
          setLoading(false);
          return;
        }

        const response = await fetch(`${BACKEND_URL}/v1/api/papers/${testId}`, {
          headers,
          cache: 'no-store'
        });

        // Handle Payment Required specifically
        if (response.status === 402) {
          const paymentInfo: PaymentRequiredError = await response.json();
          setPaymentRequired(true);
          setPaymentProductId(paymentInfo.productId);
          setPaymentDetails(paymentInfo);
          setError(`Payment required for this test: ${paymentInfo.productName} (${paymentInfo.cost} ${paymentInfo.currency})`);
          setLoading(false);
          return; // Stop processing, wait for user to initiate payment
        }

        if (!response.ok) {
          throw new Error(`Failed to fetch test: ${response.statusText}`);
        }

        const data = await response.json();
        
        // Initialize the question paper
        setQuestionPaper(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred while fetching the test');
        setPaymentRequired(false); // Ensure payment state is false if another error occurs
      } finally {
        setLoading(false);
      }
    };

    fetchQuestionPaper();
  }, [BACKEND_URL, getAuthHeaders, testId, status]);

  // Initialize Cashfree SDK
  useEffect(() => {
    const initializeSDK = async () => {
      try {
        const cfInstance = await load({
          mode: process.env.NEXT_PUBLIC_CASHFREE_MODE === 'production' ? "production" : "sandbox" // Use env var for mode
        });
        setCashfree(cfInstance);
      } catch (error) {
        console.error("Error initializing Cashfree SDK:", error);
        setPaymentInitiationError("Could not initialize payment gateway. Please try again later.");
      }
    };
    initializeSDK();
  }, []);

  // Handle answer changes
  const handleAnswerChange = (questionId: number, answer: string) => {
    setResponses(prev => {
      const newResponses = new Map(prev);
      newResponses.set(questionId, answer);
      return newResponses;
    });
    // Clear any submit errors when user changes answers
    setSubmitError(null);
  };

  // Navigate to the next question
  const handleNextQuestion = () => {
    if (!questionPaper || currentQuestionIndex >= questionPaper.Questions.length - 1) return;
    setCurrentQuestionIndex(prev => prev + 1);
    setSubmitError(null);
  };

  // Navigate to the previous question
  const handlePrevQuestion = () => {
    if (currentQuestionIndex <= 0) return;
    setCurrentQuestionIndex(prev => prev - 1);
    setSubmitError(null);
  };

  // Check if current question is answered
  const isCurrentQuestionAnswered = (): boolean => {
    if (!questionPaper) return false;
    const currentQuestion = questionPaper.Questions[currentQuestionIndex];
    return responses.has(currentQuestion.ID) && responses.get(currentQuestion.ID) !== '';
  };

  // Validate responses before submitting
  const validateResponses = (): boolean => {
    if (!questionPaper) return false;
    
    // Check if there are any unanswered multiple choice questions
    const unansweredMultipleChoice = questionPaper.Questions.filter(q => 
      q.Type === 'multiple_choice' && (!responses.has(q.ID) || !responses.get(q.ID))
    );
    
    if (unansweredMultipleChoice.length > 0) {
      setSubmitError(`Please answer all multiple choice questions. You have ${unansweredMultipleChoice.length} unanswered.`);
      
      // Navigate to the first unanswered multiple choice question
      if (unansweredMultipleChoice.length > 0) {
        const firstUnansweredIndex = questionPaper.Questions.findIndex(
          q => q.ID === unansweredMultipleChoice[0].ID
        );
        if (firstUnansweredIndex !== -1) {
          setCurrentQuestionIndex(firstUnansweredIndex);
        }
      }
      
      return false;
    }
    
    return true;
  };

  // Submit the test
  const handleTestSubmit = async () => {
    if (!questionPaper || !BACKEND_URL) return;
    
    // Validate responses first
    if (!validateResponses()) {
      return;
    }
    
    setSubmitting(true);
    setError(null);
    setSubmitError(null);
    
    try {
      const headers = getAuthHeaders();
      if (!headers) {
        setError("Authentication required to submit this test.");
        return;
      }

      // Prepare question responses
      const questionResponses: QuestionResponse[] = [];
      questionPaper.Questions.forEach(question => {
        questionResponses.push({
          QuestionID: question.ID,
          Answer: responses.get(question.ID) || ""
        });
      });

      // Submit the response
      const response = await fetch(`${BACKEND_URL}/v1/api/responses`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          QuestionPaperID: questionPaper.ID,
          Answers: questionResponses
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to submit test: ${response.statusText}`);
      }

      // Set test as completed
      setTestCompleted(true);
      
      // Get the response ID
      const data = await response.json();
      
      // Redirect to results page after successful submission
      setTimeout(() => {
        router.push(`/diagnostic-tests/${testId}/results/${data.ID}`);
      }, 1500);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while submitting the test');
    } finally {
      setSubmitting(false);
    }
  };

  // Parse and render answer choices
  const renderAnswerChoices = (question: Question) => {
    // Always check if it's explicitly a multiple choice question
    if (question.Type === 'multiple_choice') {
      try {
        // Parse answer choices from string if needed
        const choices = typeof question.AnswerChoices === 'string' 
          ? JSON.parse(question.AnswerChoices) 
          : Array.isArray(question.AnswerChoices) 
            ? question.AnswerChoices 
            : [];
        
        if (!Array.isArray(choices) || choices.length === 0) {
          throw new Error('Invalid answer choices');
        }
        
        return (
          <div className="space-y-3 mt-4">
            {choices.map((choice, idx) => (
              <label 
                key={idx} 
                className={`flex items-start p-4 border rounded-lg cursor-pointer transition-colors ${
                  responses.get(question.ID) === choice 
                    ? 'bg-indigo-50 border-indigo-300' 
                    : 'hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  name={`question-${question.ID}`}
                  value={choice}
                  checked={responses.get(question.ID) === choice}
                  onChange={() => handleAnswerChange(question.ID, choice)}
                  className="mt-1 mr-3 h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                />
                <span className="text-gray-800">{choice}</span>
              </label>
            ))}
            
            {!responses.has(question.ID) && (
              <p className="text-amber-600 text-sm mt-2">
                Please select an answer for this question.
              </p>
            )}
          </div>
        );
      } catch (e) {
        console.error("Error parsing multiple choice options:", e);
        // Fallback to text input
        return renderTextInput(question);
      }
    }
    
    // Default to text input for non-multiple choice or fallback
    return renderTextInput(question);
  };
  
  // Render text input for free-form answers
  const renderTextInput = (question: Question) => {
    return (
      <textarea
        value={responses.get(question.ID) || ''}
        onChange={(e) => handleAnswerChange(question.ID, e.target.value)}
        className="w-full p-3 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 mt-2"
        rows={4}
        placeholder="Enter your answer here..."
      />
    );
  };

  // Calculate progress percentage
  const calculateProgress = (): number => {
    if (!questionPaper || questionPaper.Questions.length === 0) return 0;
    return (responses.size / questionPaper.Questions.length) * 100;
  };

  // Initiate payment process using Cashfree SDK
  const handleInitiatePayment = async () => {
    if (!paymentProductId || !BACKEND_URL || !cashfree) {
      setPaymentInitiationError(
        !cashfree 
        ? "Payment gateway is not initialized. Please wait or refresh." 
        : "Missing payment details or configuration."
      );
      return;
    }
    
    setInitiatingPayment(true);
    setPaymentInitiationError(null);
    
    try {
      // Get headers including Content-Type for the POST request
      const headers = getAuthHeaders(true); // Ensure Content-Type is included
      if (!headers) {
        setPaymentInitiationError("Authentication required to initiate payment.");
        setInitiatingPayment(false);
        return;
      }
      
      // Get the current URL
      const redirectUrl = window.location.href;

      // 1. Fetch the paymentSessionId from your backend, sending redirectUrl
      console.log("Fetching payment session ID from:", `${BACKEND_URL}/v1/api/payment/session/product/${paymentProductId}`);
      const response = await fetch(`${BACKEND_URL}/v1/api/payment/session/product/${paymentProductId}`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ redirectUrl: redirectUrl }) // Send current URL in body
      });
      
      console.log("Received response status:", response.status);

      if (!response.ok) {
        let errorBody = "Failed to read error response body";
        try {
          errorBody = await response.text(); // Try reading as text first
          console.error("Error response body:", errorBody);
          const errorData = JSON.parse(errorBody); // Then try parsing as JSON
          throw new Error(errorData.message || `Failed to get payment session: ${response.statusText}`);
        } catch (parseError) {
          console.error("Could not parse error response as JSON:", parseError);
          // Use the raw text or a generic message if JSON parsing failed
          throw new Error(errorBody.substring(0, 100) || `Failed to get payment session: ${response.statusText}`); 
        }
      }
      
      console.log("Attempting to parse response JSON...");
      const paymentSession: PaymentSessionResponse = await response.json();
      
      // Log the actual response from the backend for debugging
      console.log("Successfully parsed payment session data:", paymentSession);
      
      if (!paymentSession.paymentSessionId) {
        console.error("paymentSessionId key not found in response:", paymentSession);
        throw new Error("Payment session ID key not found in the response object.");
      }
      
      // 2. Use the session ID to trigger Cashfree checkout
      console.log("Initializing Cashfree checkout with session ID:", paymentSession.paymentSessionId);
      const checkoutOptions = {
        paymentSessionId: paymentSession.paymentSessionId,
      };
      
      cashfree.checkout(checkoutOptions); 
      console.log("Cashfree checkout initiated."); // Log after calling checkout
      // Cashfree SDK handles the redirection internally
      
      // Setting state back might happen after redirect, depending on timing
      // setInitiatingPayment(false); 
      
    } catch (err) {
      console.error("Payment Initiation Error [Caught]:", err);
      setPaymentInitiationError(err instanceof Error ? err.message : 'An error occurred during payment initiation.');
      setInitiatingPayment(false);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="container mx-auto p-4 flex justify-center items-center min-h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p>Loading test...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className={`border rounded-lg p-4 mb-4 ${paymentRequired ? 'bg-yellow-50 border-yellow-200 text-yellow-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
          <h2 className="font-semibold text-lg mb-2">{paymentRequired ? 'Payment Required' : 'Error'}</h2>
          <p>{error}</p>
          {paymentRequired && paymentDetails && (
            <div className="mt-4">
              <p><strong>Product:</strong> {paymentDetails.productName}</p>
              <p><strong>Cost:</strong> {paymentDetails.cost} {paymentDetails.currency}</p>
              
              {paymentInitiationError && (
                <p className="text-red-600 mt-2 font-medium">Payment Error: {paymentInitiationError}</p>
              )}
              
              <button 
                onClick={handleInitiatePayment}
                disabled={initiatingPayment || !cashfree} // Disable if SDK not loaded
                className={`mt-4 px-4 py-2 rounded-md text-white ${initiatingPayment || !cashfree ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                title={!cashfree ? "Payment gateway loading..." : undefined}
              >
                {initiatingPayment ? 'Processing Payment...' : 'Proceed to Payment'}
              </button>
            </div>
          )}
        </div>
        {!paymentRequired && (
          <button 
            onClick={() => router.back()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Go Back
          </button>
        )}
      </div>
    );
  }

  // Show test completed state
  if (testCompleted) {
    return (
      <div className="container mx-auto p-4 flex justify-center items-center min-h-[50vh]">
        <div className="text-center">
          <div className="mb-4 text-green-500">
            <svg className="h-16 w-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">Test Completed!</h2>
          <p className="text-gray-600 mb-4">Your answers have been submitted successfully.</p>
          <p className="text-gray-500">Redirecting to results page...</p>
        </div>
      </div>
    );
  }

  // If there's no question paper or no questions
  if (!questionPaper || questionPaper.Questions.length === 0) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg p-4 mb-4">
          <h2 className="font-semibold text-lg mb-2">No Questions Available</h2>
          <p>This test does not contain any questions.</p>
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

  // Get the current question
  const currentQuestion = questionPaper.Questions[currentQuestionIndex];

  // Render the test interface
  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold mb-2 md:mb-0">{questionPaper.Title}</h1>
        <div className="flex items-center">
          <span className="text-sm text-gray-600 mr-4">
            Question {currentQuestionIndex + 1} of {questionPaper.Questions.length}
          </span>
          <div className="w-32 bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-indigo-600 h-2.5 rounded-full" 
              style={{ width: `${calculateProgress()}%` }}
            ></div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        {submitError && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{submitError}</span>
          </div>
        )}
        
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-3">Question {currentQuestionIndex + 1}</h2>
          <div className="flex items-center gap-2">
            <p className="text-gray-800">{currentQuestion.Description}</p>
            {currentQuestion.Type === 'multiple_choice' && (
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                Multiple Choice
              </span>
            )}
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="text-md font-medium mb-2">Your Answer:</h3>
          {renderAnswerChoices(currentQuestion)}
        </div>
        
        <div className="flex justify-between">
          <button 
            onClick={handlePrevQuestion}
            disabled={currentQuestionIndex === 0}
            className={`px-4 py-2 rounded-md ${
              currentQuestionIndex === 0 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Previous
          </button>
          
          {currentQuestionIndex < questionPaper.Questions.length - 1 ? (
            <button 
              onClick={handleNextQuestion}
              className={`px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 ${
                currentQuestion.Type === 'multiple_choice' && !isCurrentQuestionAnswered() 
                  ? 'opacity-90' 
                  : ''
              }`}
            >
              Next
              {currentQuestion.Type === 'multiple_choice' && !isCurrentQuestionAnswered() && (
                <span className="ml-1 text-xs">⚠️</span>
              )}
            </button>
          ) : (
            <button 
              onClick={handleTestSubmit}
              disabled={submitting}
              className={`px-4 py-2 rounded-md ${
                submitting 
                  ? 'bg-green-400 cursor-not-allowed' 
                  : 'bg-green-600 hover:bg-green-700'
              } text-white`}
            >
              {submitting ? 'Submitting...' : 'Submit Test'}
            </button>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12 gap-2 mt-6">
        {questionPaper.Questions.map((q, index) => {
          let bgColor = 'bg-gray-200';
          if (responses.has(q.ID)) bgColor = 'bg-green-500';
          if (index === currentQuestionIndex) bgColor = 'bg-indigo-600';
          
          // Add warning indicator for unanswered multiple choice questions
          const isMultipleChoiceUnanswered = q.Type === 'multiple_choice' && !responses.has(q.ID);
          
          return (
            <button
              key={q.ID}
              onClick={() => setCurrentQuestionIndex(index)}
              className={`${bgColor} text-white rounded-full w-10 h-10 flex items-center justify-center text-sm font-medium hover:opacity-90 relative`}
            >
              {index + 1}
              {isMultipleChoiceUnanswered && (
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-amber-400 rounded-full flex items-center justify-center text-xs">
                  !
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
} 