import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Tag as TagIcon } from 'lucide-react';
import { useArticles } from '@/context/ArticleContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export function TagPage() {
  const { tagId } = useParams<{ tagId: string }>();
  const { articles, tags } = useArticles();
  const allTags = tags;
  const currentTag = allTags.find((t) => t.id === tagId);
  const tagArticles = tagId 
    ? articles.filter(a => a.tags.some(t => t.id === tagId))
    : articles;

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50/30 to-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <Link to="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              返回首页
            </Button>
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-pink-100 rounded-full mb-4">
            <TagIcon className="w-8 h-8 text-pink-600" />
          </div>
          <h1 className="font-serif text-4xl text-slate-900 mb-2">
            {currentTag ? currentTag.name : '所有标签'}
          </h1>
          <p className="text-slate-600">
            共 {tagArticles.length} 篇文章
          </p>
        </div>

        {/* All Tags */}
        <section className="mb-12">
          <h2 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-4">
            浏览标签
          </h2>
          <div className="flex flex-wrap gap-3">
            {allTags.map((tag) => (
              <Link key={tag.id} to={`/tag/${tag.id}`}>
                <Badge
                  className={`${tag.color} border-0 px-4 py-1.5 text-sm cursor-pointer hover:opacity-80 transition-opacity ${
                    currentTag?.id === tag.id ? 'ring-2 ring-pink-400 ring-offset-2' : ''
                  }`}
                >
                  {tag.name}
                </Badge>
              </Link>
            ))}
          </div>
        </section>

        <Separator className="my-8" />

        {/* Articles Grid */}
        <section>
          <h2 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-6">
            {currentTag ? `${currentTag.name}相关记录` : '全部记录'}
          </h2>
          {tagArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tagArticles.map((article) => (
                <Link
                  key={article.id}
                  to={`/article/${article.id}`}
                  className="group cursor-pointer"
                >
                  <article className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100">
                    {article.coverImage && (
                      <div className="aspect-[4/3] overflow-hidden">
                        <img
                          src={article.coverImage}
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    )}
                    <div className="p-5">
                      <div className="flex flex-wrap gap-2 mb-3">
                        {article.tags.map((tag) => (
                          <Badge
                            key={tag.id}
                            className={`${tag.color} border-0 text-xs`}
                          >
                            {tag.name}
                          </Badge>
                        ))}
                      </div>
                      <h3 className="font-serif text-lg text-slate-900 mb-2 group-hover:text-pink-600 transition-colors line-clamp-1">
                        {article.title}
                      </h3>
                      <p className="text-sm text-slate-600 line-clamp-2 mb-3">
                        {article.excerpt}
                      </p>
                      <p className="text-xs text-slate-400">
                        {article.date}
                      </p>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-slate-500">
              <p>暂无相关文章</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
