import { useState, useEffect, useCallback, useMemo } from "react";
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const useApi = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const memoizedUrl = useMemo(() => url, [url]);
  const memoizedOptions = useMemo(() => options, [options]);

  const getToken = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token");
    }
    return null;
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    const token = getToken();
    try {
      const response = await fetch(`${BASE_URL}${memoizedUrl}`, {
        ...memoizedOptions,
        headers: {
          ...memoizedOptions.headers,
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch data");
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [memoizedUrl, memoizedOptions]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, reload: fetchData };
};
