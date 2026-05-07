import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Heart, Gift, Plus, Edit, Trash2 } from 'lucide-react';
import { useArticles } from '@/context/ArticleContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { ArticleForm } from '@/components/ArticleForm';
import type { Article } from '@/data/articles';

export function ArticleList() {
  const { articles, tags, addArticle, updateArticle, deleteArticle } = useArticles();
  const [showForm, setShowForm] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | undefined>();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleAdd = () => {
    setEditingArticle(undefined);
    setShowForm(true);
  };

  const handleEdit = (article: Article, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setEditingArticle(article);
    setShowForm(true);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setDeleteId(id);
  };

  const confirmDelete = () => {
    if (deleteId) {
      deleteArticle(deleteId);
      setDeleteId(null);
    }
  };

  const handleSubmit = (formData: any) => {
    if (editingArticle) {
      updateArticle(editingArticle.id, formData);
    } else {
      addArticle(formData);
    }
    setShowForm(false);
  };

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center py-16 px-4">
        <h1 className="font-serif text-5xl md:text-6xl text-slate-900 mb-4">
          恋爱送礼记录
        </h1>
        <p className="text-slate-600 text-lg max-w-2xl mx-auto font-light">
          记录每一份心意的时刻，将爱意珍藏
        </p>
        <div className="flex flex-wrap justify-center gap-4 mt-8">
          <div className="flex items-center gap-2 text-pink-600">
            <Heart className="w-5 h-5 fill-pink-600" />
            <span className="text-sm">{articles.length} 篇记录</span>
          </div>
          <div className="flex items-center gap-2 text-pink-600">
            <Gift className="w-5 h-5" />
            <span className="text-sm">{tags.length} 个标签</span>
          </div>
          <Button
            onClick={handleAdd}
            className="gap-2 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600"
          >
            <Plus className="w-4 h-4" />
            新增记录
          </Button>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <div key={article.id} className="group">
              <Link
                to={`/article/${article.id}`}
                className="block cursor-pointer"
              >
                <article className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
                  {article.coverImage && (
                    <div className="aspect-[4/3] overflow-hidden">
                      <img
                        src={article.coverImage}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="p-6">
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
                    <h2 className="font-serif text-xl text-slate-900 mb-2 group-hover:text-pink-600 transition-colors">
                      {article.title}
                    </h2>
                    <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{article.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Gift className="w-3.5 h-3.5" />
                        <span>{article.occasion}</span>
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
              
              {/* Action Buttons */}
              <div className="flex gap-2 p-2 -mt-12 relative z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="ml-auto flex gap-2 bg-white/90 backdrop-blur rounded-lg p-1 shadow-lg">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-slate-600 hover:text-pink-600 hover:bg-pink-50"
                    onClick={(e) => handleEdit(article, e)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-slate-600 hover:text-red-600 hover:bg-red-50"
                    onClick={(e) => handleDelete(article.id, e)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Article Form Modal */}
      {showForm && (
        <ArticleForm
          tags={tags}
          article={editingArticle}
          onSubmit={handleSubmit}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              确定要删除这篇文章吗？此操作无法撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteId(null)}>取消</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
