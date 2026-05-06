import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { ArticleList } from '@/pages/ArticleList';
import { ArticleDetail } from '@/pages/ArticleDetail';
import { TagPage } from '@/pages/TagPage';
import { About } from '@/pages/About';
import { ArticleProvider } from '@/context/ArticleContext';

function App() {
  return (
    <ArticleProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-white">
          <Navbar />
          <Routes>
            <Route path="/" element={<ArticleList />} />
            <Route path="/article/:id" element={<ArticleDetail />} />
            <Route path="/tag" element={<TagPage />} />
            <Route path="/tag/:tagId" element={<TagPage />} />
            <Route path="/about" element={<About />} />
          </Routes>
          {/* Footer */}
          <footer className="bg-gradient-to-b from-white to-pink-50 border-t border-gray-100 py-8 mt-16">
            <div className="max-w-6xl mx-auto px-4 text-center">
              <p className="text-slate-500 text-sm">
                ©恋爱送礼记录 · 用心记录每一份爱意
              </p>
            </div>
          </footer>
        </div>
      </BrowserRouter>
    </ArticleProvider>
  );
}

export default App;
