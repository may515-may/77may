import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Article, Tag } from '@/data/articles';
import { articles as initialArticles, tags as initialTags } from '@/data/articles';

const STORAGE_KEY = 'love-gift-articles';

interface ArticleContextType {
  articles: Article[];
  tags: Tag[];
  addArticle: (article: Omit<Article, 'id'>) => void;
  updateArticle: (id: string, article: Partial<Article>) => void;
  deleteArticle: (id: string) => void;
  getArticleById: (id: string) => Article | undefined;
}

const ArticleContext = createContext<ArticleContextType | undefined>(undefined);

function loadArticles(): Article[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Failed to load articles from localStorage:', e);
  }
  return initialArticles;
}

export function ArticleProvider({ children }: { children: ReactNode }) {
  const [articles, setArticles] = useState<Article[]>(loadArticles);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(articles));
    } catch (e) {
      console.error('Failed to save articles to localStorage:', e);
    }
  }, [articles]);

  const addArticle = (article: Omit<Article, 'id'>) => {
    const newArticle: Article = {
      ...article,
      id: Date.now().toString(),
    };
    setArticles([newArticle, ...articles]);
  };

  const updateArticle = (id: string, updatedArticle: Partial<Article>) => {
    setArticles(articles.map(article => 
      article.id === id ? { ...article, ...updatedArticle } : article
    ));
  };

  const deleteArticle = (id: string) => {
    setArticles(articles.filter(article => article.id !== id));
  };

  const getArticleById = (id: string) => {
    return articles.find(article => article.id === id);
  };

  return (
    <ArticleContext.Provider
      value={{
        articles,
        tags: initialTags,
        addArticle,
        updateArticle,
        deleteArticle,
        getArticleById,
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
