import { useState, useEffect, useCallback } from 'react';
import { fetchListData, fetchSingleEntry } from '../../services/listService';
import sessionService from '../../services/sessionService';

const useArticleData = (listName) => {
  const [articles, setArticles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const ITEMS_PER_PAGE = 12;

  const fetchArticles = useCallback(async (pageNumber) => {
    if (!hasMore) return;
    
    setLoading(true);
    setError(null);
    try {
      const searchConditions = sessionService.getSearchConditions(listName) || {};
      const response = await fetchListData(listName, searchConditions, ITEMS_PER_PAGE, pageNumber * ITEMS_PER_PAGE);
      
      if (response.data.length < ITEMS_PER_PAGE) {
        setHasMore(false);
      }

      setArticles(prevArticles => [...prevArticles, ...response.data]);
      setPage(pageNumber);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [listName, hasMore]);

  const fetchArticleDetails = useCallback(async (id) => {
    try {
      return await fetchSingleEntry(listName, id);
    } catch (err) {
      console.error('Error fetching article details:', err);
      return null;
    }
  }, [listName]);

  const getNextArticle = useCallback(async () => {
    if (currentIndex >= articles.length) {
      if (hasMore) {
        await fetchArticles(page + 1);
      } else {
        return null;
      }
    }

    if (currentIndex < articles.length) {
      const article = articles[currentIndex];
      const details = await fetchArticleDetails(article.sys_information_id);
      setCurrentIndex(prevIndex => prevIndex + 1);
      return details;
    }

    return null;
  }, [articles, currentIndex, fetchArticleDetails, hasMore, fetchArticles, page]);

  useEffect(() => {
    fetchArticles(0);
  }, [fetchArticles]);

  return { getNextArticle, loading, error };
};

export default useArticleData;