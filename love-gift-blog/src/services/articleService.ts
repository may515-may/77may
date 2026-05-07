export interface Article {
  id: string
  title: string
  content: string
  excerpt?: string
  tags: string[]
  createdAt: string
  updatedAt: string
}

const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://77may.vercel.app/api' 
  : 'http://localhost:5173/api'

export async function fetchArticles(): Promise<Article[]> {
  const response = await fetch(`${API_URL}/articles`)
  if (!response.ok) {
    throw new Error('Failed to fetch articles')
  }
  return response.json()
}

export async function fetchArticle(id: string): Promise<Article> {
  const response = await fetch(`${API_URL}/articles/${id}`)
  if (!response.ok) {
    throw new Error('Failed to fetch article')
  }
  return response.json()
}

export async function createArticle(article: Omit<Article, 'id' | 'createdAt' | 'updatedAt'>): Promise<Article> {
  const response = await fetch(`${API_URL}/articles`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(article),
  })
  if (!response.ok) {
    throw new Error('Failed to create article')
  }
  return response.json()
}

export async function updateArticle(id: string, article: Partial<Article>): Promise<Article> {
  const response = await fetch(`${API_URL}/articles/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(article),
  })
  if (!response.ok) {
    throw new Error('Failed to update article')
  }
  return response.json()
}

export async function deleteArticle(id: string): Promise<void> {
  const response = await fetch(`${API_URL}/articles/${id}`, {
    method: 'DELETE',
  })
  if (!response.ok) {
    throw new Error('Failed to delete article')
  }
}
