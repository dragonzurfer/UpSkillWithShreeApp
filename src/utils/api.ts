import { signIn } from 'next-auth/react';

/**
 * Wrapper around fetch that handles authentication errors
 * Automatically redirects to sign-in if session expired
 */
export async function fetchWithAuth(
  url: string, 
  options: RequestInit = {}
): Promise<Response> {
  const response = await fetch(url, options);

  // If unauthorized, try to sign in again
  if (response.status === 401) {
    console.log('Session expired. Redirecting to login...');
    
    // Get current path for redirect after login
    const callbackUrl = window.location.href;
    
    // Redirect to sign in page
    await signIn('google', { callbackUrl });
    
    // This code won't execute if signIn redirects, but it's here as a fallback
    throw new Error('Unauthorized - Session expired');
  }

  return response;
}

/**
 * Helper function to fetch JSON data with authentication handling
 */
export async function fetchJsonWithAuth<T>(
  url: string, 
  options: RequestInit = {}
): Promise<T> {
  const response = await fetchWithAuth(url, options);
  
  if (!response.ok) {
    try {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`API Error: ${response.status} - ${errorData.message || response.statusText}`);
    } catch (e) {
      throw new Error(`API Error: ${response.status} - ${response.statusText}`);
    }
  }
  
  // Safe JSON parsing
  try {
    // Check if response has content
    const text = await response.text();
    if (!text || text.trim() === '') {
      console.warn('API returned empty response');
      return {} as T;
    }
    
    // Parse the JSON
    return JSON.parse(text) as T;
  } catch (error) {
    console.error('Error parsing JSON response:', error);
    throw new Error('Invalid JSON response from server');
  }
} 