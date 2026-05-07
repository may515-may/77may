import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
})

export default async function handler(req: Request, context: { params?: { id?: string } }) {
  const url = new URL(req.url)
  const id = context?.params?.id

  if (req.method === 'GET') {
    if (id) {
      return getArticle(id)
    }
    return getArticles()
  }

  if (req.method === 'POST') {
    return createArticle(req)
  }

  if (req.method === 'PUT' && id) {
    return updateArticle(id, req)
  }

  if (req.method === 'DELETE' && id) {
    return deleteArticle(id)
  }

  return new Response('Method not allowed', { status: 405 })
}

async function getArticles() {
  try {
    const articles = await prisma.article.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return new Response(JSON.stringify(articles), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch articles' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

async function getArticle(id: string) {
  try {
    const article = await prisma.article.findUnique({
      where: { id },
    })
    if (!article) {
      return new Response(JSON.stringify({ error: 'Article not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      })
    }
    return new Response(JSON.stringify(article), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch article' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

async function createArticle(req: Request) {
  try {
    const body = await req.json()
    const article = await prisma.article.create({
      data: {
        title: body.title,
        content: body.content,
        excerpt: body.excerpt,
        tags: JSON.stringify(body.tags || []),
      },
    })
    return new Response(JSON.stringify(article), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to create article' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

async function updateArticle(id: string, req: Request) {
  try {
    const body = await req.json()
    const article = await prisma.article.update({
      where: { id },
      data: {
        title: body.title,
        content: body.content,
        excerpt: body.excerpt,
        tags: JSON.stringify(body.tags || []),
      },
    })
    return new Response(JSON.stringify(article), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to update article' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

async function deleteArticle(id: string) {
  try {
    await prisma.article.delete({
      where: { id },
    })
    return new Response(JSON.stringify({ message: 'Article deleted' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to delete article' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
