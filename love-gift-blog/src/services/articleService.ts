import type { Article, Tag } from '@/data/articles';

const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://77may.vercel.app/api' 
  : 'http://localhost:5173/api';

interface RawArticle {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  tags: string;
  createdAt: string;
  updatedAt: string;
}

function convertToFrontendArticle(raw: RawArticle, allTags: Tag[]): Article {
  let tagIds: string[] = [];
  try {
    tagIds = JSON.parse(raw.tags);
  } catch {
    tagIds = [];
  }
  
  const tagObjects = tagIds.map(tagId => 
    allTags.find(t => t.id === tagId) || { id: tagId, name: tagId, color: 'bg-gray-100 text-gray-700' }
  );
  
  return {
    id: raw.id,
    title: raw.title,
    content: raw.content,
    excerpt: raw.excerpt,
    tags: tagObjects,
    date: raw.createdAt.split('T')[0],
    recipient: '',
    occasion: '',
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
  } as Article;
}

export async function fetchArticles(): Promise<Article[]> {
  const response = await fetch(`${API_URL}/articles`);
  if (!response.ok) {
    throw new Error('Failed to fetch articles');
  }
  const rawArticles: RawArticle[] = await response.json();
  const tagsResponse = await import('@/data/articles');
  return rawArticles.map(article => convertToFrontendArticle(article, tagsResponse.tags));
}

export async function fetchArticle(id: string): Promise<Article> {
  const response = await fetch(`${API_URL}/articles?id=${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch article');
  }
  const rawArticle: RawArticle = await response.json();
  const tagsResponse = await import('@/data/articles');
  return convertToFrontendArticle(rawArticle, tagsResponse.tags);
}

export async function createArticle(article: Omit<Article, 'id'>): Promise<Article> {
  const tagIds = article.tags.map(tag => tag.id);
  const response = await fetch(`${API_URL}/articles`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: article.title,
      content: article.content,
      excerpt: article.excerpt,
      tags: tagIds,
    }),
  });
  if (!response.ok) {
    throw new Error('Failed to create article');
  }
  const rawArticle: RawArticle = await response.json();
  const tagsResponse = await import('@/data/articles');
  return convertToFrontendArticle(rawArticle, tagsResponse.tags);
}

export async function updateArticle(id: string, article: Partial<Article>): Promise<Article> {
  const payload: any = {};
  if (article.title) payload.title = article.title;
  if (article.content) payload.content = article.content;
  if (article.excerpt) payload.excerpt = article.excerpt;
  if (article.tags) payload.tags = article.tags.map(tag => tag.id);
  
  const response = await fetch(`${API_URL}/articles?id=${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error('Failed to update article');
  }
  const rawArticle: RawArticle = await response.json();
  const tagsResponse = await import('@/data/articles');
  return convertToFrontendArticle(rawArticle, tagsResponse.tags);
}

export async function deleteArticle(id: string): Promise<void> {
  const response = await fetch(`${API_URL}/articles?id=${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete article');
  }
}
