import { useState, useEffect, useRef } from 'react';
import type { Article, Tag } from '@/data/articles';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { X, Save, Upload, Image as ImageIcon } from 'lucide-react';

interface ArticleFormProps {
  tags: Tag[];
  article?: Article;
  onSubmit: (article: any) => void;
  onCancel: () => void;
}

export function ArticleForm({ tags, article, onSubmit, onCancel }: ArticleFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    excerpt: '',
    content: '',
    recipient: '',
    occasion: '',
    price: '',
    coverImage: '',
    tags: [] as Tag[],
  });

  useEffect(() => {
    if (article) {
      setFormData({
        title: article.title,
        date: article.date,
        excerpt: article.excerpt,
        content: article.content,
        recipient: article.recipient,
        occasion: article.occasion,
        price: article.price || '',
        coverImage: article.coverImage || '',
        tags: article.tags,
      });
    }
  }, [article]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleTag = (tag: Tag) => {
    setFormData(prev => {
      const isSelected = prev.tags.some(t => t.id === tag.id);
      return {
        ...prev,
        tags: isSelected 
          ? prev.tags.filter(t => t.id !== tag.id)
          : [...prev.tags, tag],
      };
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('请选择图片文件');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('图片大小不能超过5MB');
      return;
    }

    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setFormData(prev => ({ ...prev, coverImage: base64 }));
        setUploading(false);
      };
      reader.onerror = () => {
        alert('图片读取失败');
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      alert('图片上传失败');
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, coverImage: '' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-xl font-serif text-slate-900">
            {article ? '编辑文章' : '新增文章'}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">标题 *</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="输入文章标题"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">日期 *</Label>
              <Input
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="recipient">送给谁 *</Label>
              <Input
                id="recipient"
                name="recipient"
                value={formData.recipient}
                onChange={handleChange}
                required
                placeholder="例如：女朋友"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="occasion">场合 *</Label>
              <Input
                id="occasion"
                name="occasion"
                value={formData.occasion}
                onChange={handleChange}
                required
                placeholder="例如：生日"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">价格</Label>
              <Input
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="例如：¥299"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>封面图片</Label>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            {formData.coverImage ? (
              <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-gray-200">
                <img
                  src={formData.coverImage}
                  alt="Cover preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                    >
                      <Upload className="w-4 h-4 mr-1" />
                      更换图片
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={handleRemoveImage}
                    >
                      删除图片
                    </Button>
                  </div>
                </div>
                {uploading && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="text-white">上传中...</div>
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="w-full aspect-video border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-2 text-gray-500 hover:border-pink-400 hover:text-pink-500 transition-colors disabled:opacity-50"
              >
                {uploading ? (
                  <>
                    <div className="w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin" />
                    <span>上传中...</span>
                  </>
                ) : (
                  <>
                    <ImageIcon className="w-8 h-8" />
                    <span>点击上传封面图片</span>
                    <span className="text-xs text-gray-400">支持 JPG、PNG，最大 5MB</span>
                  </>
                )}
              </button>
            )}
          </div>

          <div className="space-y-2">
            <Label>标签</Label>
            <div className="flex flex-wrap gap-2">
              {tags.map(tag => (
                <Badge
                  key={tag.id}
                  className={`cursor-pointer ${
                    formData.tags.some(t => t.id === tag.id)
                      ? tag.color
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  onClick={() => toggleTag(tag)}
                >
                  {tag.name}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt">摘要 *</Label>
            <Textarea
              id="excerpt"
              name="excerpt"
              value={formData.excerpt}
              onChange={handleChange}
              required
              rows={2}
              placeholder="简短描述"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">内容 *</Label>
            <Textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              rows={8}
              placeholder="文章内容（支持Markdown）"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              className="flex-1 gap-2 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600"
            >
              <Save className="w-4 h-4" />
              {article ? '保存修改' : '发布文章'}
            </Button>
            <Button type="button" variant="ghost" onClick={onCancel}>
              取消
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
