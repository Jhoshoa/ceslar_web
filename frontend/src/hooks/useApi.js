import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for API calls with loading and error states
 */
export const useApi = (apiFunction, immediate = true, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiFunction(...args);
      setData(result.data || result);
      return result;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'An error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiFunction]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, dependencies);

  return { data, loading, error, execute, setData };
};

/**
 * Hook for paginated API calls
 */
export const usePaginatedApi = (apiFunction, initialParams = {}) => {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [params, setParams] = useState(initialParams);

  const fetchData = useCallback(async (newParams = {}) => {
    setLoading(true);
    setError(null);
    try {
      const mergedParams = { ...params, ...newParams };
      const result = await apiFunction(mergedParams);
      setData(result.data);
      if (result.pagination) {
        setPagination(result.pagination);
      }
      return result;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'An error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiFunction, params]);

  const goToPage = (page) => {
    setParams(prev => ({ ...prev, page }));
    fetchData({ page });
  };

  const updateParams = (newParams) => {
    setParams(prev => ({ ...prev, ...newParams }));
    fetchData(newParams);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    data,
    pagination,
    loading,
    error,
    fetchData,
    goToPage,
    updateParams,
    setParams,
  };
};

export default useApi;
