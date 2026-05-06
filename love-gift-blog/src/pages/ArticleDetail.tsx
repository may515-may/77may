import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ArrowLeft, Calendar, Gift, Heart, Share2 } from 'lucide-react';
import { useArticles } from '@/context/ArticleContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export function ArticleDetail() {
  const { id } = useParams<{ id: string }>();
  const { articles, getArticleById } = useArticles();
  const article = getArticleById(id || '');

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-serif text-slate-900 mb-4">文章未找到</h1>
          <Link to="/">
            <Button variant="outline">返回首页</Button>
          </Link>
        </div>
      </div>
    );
  }

  // 获取相关文章
  const relatedArticles = articles
    .filter((a) => a.id !== article.id)
    .filter((a) => a.tags.some((t) => article.tags.some((at) => at.id === t.id)))
    .slice(0, 2);

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50/30 to-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link to="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              返回列表
            </Button>
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Cover Image */}
        {article.coverImage && (
          <div className="aspect-video rounded-2xl overflow-hidden mb-8 shadow-lg">
            <img
              src={article.coverImage}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Article Header */}
        <div className="text-center mb-12">
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            {article.tags.map((tag) => (
              <Badge
                key={tag.id}
                className={`${tag.color} border-0 cursor-pointer hover:opacity-80 transition-opacity`}
              >
                <Link to={`/tag/${tag.id}`}>{tag.name}</Link>
              </Badge>
            ))}
          </div>
          <h1 className="font-serif text-4xl md:text-5xl text-slate-900 mb-6 leading-tight">
            {article.title}
          </h1>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{article.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Gift className="w-4 h-4" />
              <span>{article.occasion}</span>
            </div>
            {article.recipient && (
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4" />
                <span>送给 {article.recipient}</span>
              </div>
            )}
            {article.price && (
              <div className="flex items-center gap-2 text-pink-600 font-medium">
                {article.price}
              </div>
            )}
          </div>
        </div>

        <Separator className="my-8" />

        {/* Article Content */}
        <article className="prose prose-slate prose-lg max-w-none prose-headings:font-serif prose-headings:text-slate-900 prose-a:text-pink-600 prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl prose-img:shadow-lg">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {article.content}
          </ReactMarkdown>
        </article>

        <Separator className="my-12" />

        {/* Share Section */}
        <div className="flex justify-center">
          <div className="flex items-center gap-4 p-4 bg-pink-50 rounded-full">
            <span className="text-sm text-slate-600">分享这份爱意：</span>
            <Button size="sm" variant="outline" className="gap-2">
              <Share2 className="w-4 h-4" />
              分享
            </Button>
          </div>
        </div>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <section className="mt-16">
            <h2 className="font-serif text-2xl text-slate-900 mb-6 text-center">
              相关记录
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedArticles.map((related) => (
                <Link
                  key={related.id}
                  to={`/article/${related.id}`}
                  className="group cursor-pointer"
                >
                  <article className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                    {related.coverImage && (
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={related.coverImage}
                          alt={related.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="font-serif text-lg text-slate-900 group-hover:text-pink-600 transition-colors line-clamp-1">
                        {related.title}
                      </h3>
                      <p className="text-sm text-slate-500 mt-1">{related.date}</p>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
