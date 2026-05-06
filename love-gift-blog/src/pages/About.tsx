import { Link } from 'react-router-dom';
import { Heart, Calendar, Gift, BookOpen, Sparkles } from 'lucide-react';
import { articles, tags } from '@/data/articles';
import { Button } from '@/components/ui/button';

export function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50/30 to-white">
      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full mb-6 shadow-lg">
            <Heart className="w-10 h-10 text-white fill-white" />
          </div>
          <h1 className="font-serif text-4xl md:text-5xl text-slate-900 mb-4">
            关于这个博客
          </h1>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            记录每一份心动的礼物，见证每一段美好的爱情
          </p>
        </section>

        {/* Story Section */}
        <section className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-gray-100 mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Sparkles className="w-6 h-6 text-pink-500" />
            <h2 className="font-serif text-2xl text-slate-900">我们的故事</h2>
          </div>
          <div className="prose prose-slate max-w-none text-slate-600 space-y-4">
            <p>
              这个博客诞生于一个简单的想法：<strong>记录每一份送给爱人的礼物</strong>。
            </p>
            <p>
              每一份礼物背后，都承载着满满的心意和回忆。
              从第一次送花的小紧张，到精心策划的求婚惊喜，
              我们想把这些珍贵的瞬间都记录下来。
            </p>
            <p>
              希望这个博客能够：
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>帮助你们记录爱情中的每一个重要时刻</li>
              <li>分享实用的送礼建议和心得</li>
              <li>成为你们美好回忆的珍藏夹</li>
            </ul>
          </div>
        </section>

        {/* Stats Section */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <StatCard
            icon={<Gift className="w-6 h-6" />}
            value={articles.length}
            label="篇记录"
            color="pink"
          />
          <StatCard
            icon={<TagIcon className="w-6 h-6" />}
            value={tags.length}
            label="个标签"
            color="rose"
          />
          <StatCard
            icon={<Heart className="w-6 h-6" />}
            value="∞"
            label="份爱意"
            color="red"
          />
          <StatCard
            icon={<Calendar className="w-6 h-6" />}
            value="365"
            label="天的陪伴"
            color="amber"
          />
        </section>

        {/* Features Section */}
        <section className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-gray-100 mb-12">
          <div className="flex items-center gap-3 mb-6">
            <BookOpen className="w-6 h-6 text-pink-500" />
            <h2 className="font-serif text-2xl text-slate-900">博客功能</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FeatureItem
              title="文章列表"
              description="浏览所有送礼记录，按时间顺序排列"
            />
            <FeatureItem
              title="文章详情"
              description="查看每份礼物的完整故事和心得"
            />
            <FeatureItem
              title="标签分类"
              description="按标签筛选：生日、纪念日、情人节等"
            />
            <FeatureItem
              title="Markdown 支持"
              description="支持丰富的文本格式，记录更精彩"
            />
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <h2 className="font-serif text-2xl text-slate-900 mb-4">
            开始记录你的故事
          </h2>
          <p className="text-slate-600 mb-6">
            每一份礼物都值得被铭记，每一段爱情都值得被珍藏
          </p>
          <Link to="/">
            <Button size="lg" className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white shadow-lg">
              <Heart className="w-5 h-5 mr-2" />
              浏览文章
            </Button>
          </Link>
        </section>
      </main>
    </div>
  );
}

function StatCard({
  icon,
  value,
  label,
  color,
}: {
  icon: React.ReactNode;
  value: number | string;
  label: string;
  color: 'pink' | 'rose' | 'red' | 'amber';
}) {
  const colors = {
    pink: 'bg-pink-50 text-pink-600',
    rose: 'bg-rose-50 text-rose-600',
    red: 'bg-red-50 text-red-600',
    amber: 'bg-amber-50 text-amber-600',
  };

  return (
    <div className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-100">
      <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-3 ${colors[color]}`}>
        {icon}
      </div>
      <div className="font-serif text-3xl text-slate-900 mb-1">{value}</div>
      <div className="text-sm text-slate-500">{label}</div>
    </div>
  );
}

function FeatureItem({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="p-4 bg-pink-50/50 rounded-xl">
      <h3 className="font-medium text-slate-900 mb-1">{title}</h3>
      <p className="text-sm text-slate-600">{description}</p>
    </div>
  );
}

// Tag Icon component
function TagIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z" />
      <circle cx="7.5" cy="7.5" r=".5" fill="currentColor" />
    </svg>
  );
}
