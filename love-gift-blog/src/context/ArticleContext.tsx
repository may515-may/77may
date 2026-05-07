import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { Article, Tag } from '@/data/articles';
import { tags as initialTags } from '@/data/articles';
import { fetchArticles, createArticle, updateArticle, deleteArticle, fetchArticle } from '../services/articleService';

interface ArticleContextType {
  articles: Article[];
  tags: Tag[];
  loading: boolean;
  error: string | null;
  lastSync: Date;
  addArticle: (article: Omit<Article, 'id'>) => void;
  updateArticle: (id: string, article: Partial<Article>) => void;
  deleteArticle: (id: string) => void;
  getArticleById: (id: string) => Article | undefined;
  refresh: () => void;
}

const ArticleContext = createContext<ArticleContextType | undefined>(undefined);

export function ArticleProvider({ children }: { children: ReactNode }) {
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

  const addArticle = async (articleData: Omit<Article, 'id'>) => {
    try {
      const newArticle = await createArticle({
        title: articleData.title,
        content: articleData.content,
        excerpt: articleData.excerpt,
        tags: articleData.tags,
      });
      setArticles(prev => [newArticle, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create article');
    }
  };

  const handleUpdate = async (id: string, updatedArticle: Partial<Article>) => {
    try {
      const updated = await updateArticle(id, updatedArticle);
      setArticles(prev => prev.map(article => 
        article.id === id ? { ...article, ...updated } : article
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update article');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteArticle(id);
      setArticles(prev => prev.filter(article => article.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete article');
    }
  };

  const getArticleById = (id: string) => {
    return articles.find(article => article.id === id);
  };

  const refresh = () => {
    loadArticles();
  };

  return (
    <ArticleContext.Provider
      value={{
        articles,
        tags: initialTags,
        loading,
        error,
        lastSync,
        addArticle,
        updateArticle: handleUpdate,
        deleteArticle: handleDelete,
        getArticleById,
        refresh,
      }}
    >
      {children}
    </ArticleContext.Provider>
  );
}

export function useArticles() {
  const context = useContext(ArticleContext);
  if (context === undefined) {
    throw new Error('useArticles must be used within an ArticleProvider');
  }
  return context;
}
