// src/hooks/useAuthenticatedFetch.ts
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { fetchWithAuth, fetchJsonWithAuth } from '@/utils/api';

interface UseAuthenticatedFetchResult<T> {
  data: T | null;
  error: string | null;
  isLoading: boolean;
}

export function useAuthenticatedFetch<T = any>(
  apiPath: string | null // Allow null to conditionally disable fetching
): UseAuthenticatedFetchResult<T> {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false); // Start as false, set true when fetch begins

  useEffect(() => {
    // Only proceed if apiPath is provided and session is potentially ready
    if (!apiPath || status === 'loading') {
      // If path is null or session is loading, do nothing or reset state
       if (!apiPath) {
          setData(null);
          setError(null);
          setIsLoading(false);
       }
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      setData(null); // Reset data on new fetch

      if (status === 'unauthenticated') {
        console.log("useAuthenticatedFetch: User unauthenticated, redirecting...");
        router.push('/api/auth/signin');
        // No need to set error, redirect handles it
        setIsLoading(false);
        return;
      }

      if (status === 'authenticated' && session?.idToken) {
        const backendUrl = process.env.NEXT_PUBLIC_GO_BACKEND_URL;
        if (!backendUrl) {
          console.error("NEXT_PUBLIC_GO_BACKEND_URL environment variable not set.");
          setError("Backend URL not configured.");
          setIsLoading(false);
          return;
        }

        try {
          // Construct the full API URL including the /v1/api prefix
          const fullApiPath = `/v1/api${apiPath}`;
          console.log(`useAuthenticatedFetch: Fetching ${fullApiPath}`);

          // Use fetchJsonWithAuth which safely handles JSON parsing
          const responseData = await fetchJsonWithAuth<T>(`${backendUrl}${fullApiPath}`, {
            headers: {
              'Authorization': `Bearer ${session.idToken}`,
            },
            cache: 'no-store', // Default to no-store for dynamic data
          });

          setData(responseData);
          setError(null); // Clear error on success
        } catch (err) {
          console.error(`useAuthenticatedFetch: Failed to fetch ${apiPath}:`, err);
          setError(err instanceof Error ? err.message : "An unknown error occurred");
          setData(null);
        } finally {
          setIsLoading(false);
        }
      }
      // If status is still 'loading' here, the effect will re-run when it changes.
    };

    fetchData();

    // Dependencies: re-run if session status, token, path, or router changes
  }, [apiPath, session, status, router]);

  return { data, error, isLoading };
} 