import { useState, useEffect, useCallback } from 'react';
import type { Article } from '@/data/articles';
import { fetchArticles, createArticle, updateArticle, deleteArticle } from '../services/articleService';

export function useArticleSync() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastSync, setLastSync] = useState<Date>(new Date());

  const loadArticles = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchArticles();
      setArticles(data);
      setLastSync(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load articles');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadArticles();
  }, [loadArticles]);

  useEffect(() => {
    const interval = setInterval(() => {
      loadArticles();
    }, 5000);
    return () => clearInterval(interval);
  }, [loadArticles]);

  const handleCreate = useCallback(async (article: Omit<Article, 'id'>) => {
    try {
      const newArticle = await createArticle(article);
      setArticles(prev => [newArticle, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create article');
    }
  }, []);

  const handleUpdate = useCallback(async (id: string, updates: Partial<Article>) => {
    try {
      const updatedArticle = await updateArticle(id, updates);
      setArticles(prev => prev.map(article => article.id === id ? updatedArticle : article));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update article');
    }
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    try {
      await deleteArticle(id);
      setArticles(prev => prev.filter(article => article.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete article');
    }
  }, []);

  const refresh = useCallback(() => {
    loadArticles();
  }, [loadArticles]);

  return {
    articles,
    loading,
    error,
    lastSync,
    createArticle: handleCreate,
    updateArticle: handleUpdate,
    deleteArticle: handleDelete,
    refresh,
  };
}
