"use client";

import { useState, useEffect } from 'react';

import { 
  Search, Globe, Bookmark, Share2, Clock, 
  Newspaper, TrendingUp, Film, HeartPulse, 
  Atom, Trophy, Cpu, Loader2, ChevronDown 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function NewsPage() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState('top');
  const [language, setLanguage] = useState('en');
  const [searchQuery, setSearchQuery] = useState('');
  const [savedArticles, setSavedArticles] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [expandedArticle, setExpandedArticle] = useState(null);

  const API_KEY = 'pub_78156b7370b86c7c44609acd69323a2e7b5a4';
  
  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        let url = `https://newsdata.io/api/1/news?apikey=${API_KEY}&language=${language}`;
        
        if (category !== 'top') {
          url += `&category=${category}`;
        }
        
        if (searchQuery) {
          url += `&q=${encodeURIComponent(searchQuery)}`;
        }

        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error('Failed to fetch news');
        }
        
        const data = await response.json();
        setNews(data.results || []);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching news:', err);
        setError('Failed to load news. Please try again later.');
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchNews();
    }, 500);

    return () => clearTimeout(timer);
  }, [category, language, searchQuery]);

  const categories = [
    { value: 'top', icon: <TrendingUp size={18} />, label: 'Trending' },
    { value: 'business', icon: <TrendingUp size={18} />, label: 'Business' },
    { value: 'entertainment', icon: <Film size={18} />, label: 'Entertainment' },
    { value: 'health', icon: <HeartPulse size={18} />, label: 'Health' },
    { value: 'science', icon: <Atom size={18} />, label: 'Science' },
    { value: 'sports', icon: <Trophy size={18} />, label: 'Sports' },
    { value: 'technology', icon: <Cpu size={18} />, label: 'Tech' },
    { value: 'world', icon: <Globe size={18} />, label: 'World' }
  ];

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
    { code: 'it', name: 'Italiano' }
  ];

  const toggleSaveArticle = (article) => {
    setSavedArticles(prev => {
      const isSaved = prev.some(a => a.link === article.link);
      return isSaved 
        ? prev.filter(a => a.link !== article.link) 
        : [...prev, article];
    });
  };

  const toggleExpandArticle = (index) => {
    setExpandedArticle(expandedArticle === index ? null : index);
  };

  const shareArticle = async (article) => {
    try {
      await navigator.share({
        title: article.title,
        text: article.description,
        url: article.link
      });
    } catch (err) {
      console.log('Sharing failed:', err);
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(article.link);
      alert('Link copied to clipboard!');
    }
  };

  const filteredNews = activeTab === 'saved' 
    ? savedArticles 
    : news.filter(article => 
        activeTab === 'all' || 
        (article.category && article.category.includes(activeTab))
      );

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-purple-50">
      <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 shadow-lg">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-yellow-300 flex items-center gap-2">
                <Newspaper size={32} />
                <span>CryptoWeather Nexus</span>
              </h1>
              <p className="mt-2 text-indigo-200">Stay updated with the latest headlines</p>
            </div>
            
            <div className="relative w-full md:w-64">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search news..."
                className="w-full pl-10 pr-4 py-2 rounded-full bg-white/20 border border-gray-100 text-white placeholder-indigo-200 focus:outline-none focus:ring-2 focus:ring-yellow-300"
              />
              <Search className="absolute left-3 top-2.5 text-indigo-200" size={18} />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-6">
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-full flex items-center gap-2 transition-all ${activeTab === 'all' ? 'bg-indigo-600 text-white' : 'bg-white text-indigo-700 hover:bg-indigo-100'}`}
            >
              <Newspaper size={16} />
              All News
            </button>
            <button
              onClick={() => setActiveTab('saved')}
              className={`px-4 py-2 rounded-full flex items-center gap-2 transition-all ${activeTab === 'saved' ? 'bg-indigo-600 text-white' : 'bg-white text-indigo-700 hover:bg-indigo-100'}`}
            >
              <Bookmark size={16} />
              Saved ({savedArticles.length})
            </button>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setCategory(cat.value)}
                  className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 text-sm transition-all ${category === cat.value ? 'bg-purple-600 text-white' : 'bg-white text-indigo-700 hover:bg-purple-50'}`}
                >
                  {cat.icon}
                  {cat.label}
                </button>
              ))}
            </div>
            
            <div className="flex items-center gap-2">
              <Globe className="text-indigo-700" size={18} />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="border rounded-full p-2 text-indigo-700 bg-white focus:outline-none focus:ring-2 focus:ring-purple-300"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {loading && (
          <div className="flex justify-center items-center h-64">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            >
              <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
            </motion.div>
          </div>
        )}
        
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 text-center"
          >
            {error}
            <button 
              onClick={() => window.location.reload()}
              className="mt-2 px-4 py-1.5 bg-red-600 text-white rounded-full text-sm hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </motion.div>
        )}

        {!loading && !error && filteredNews.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-5xl mb-4">📰</div>
            <h3 className="text-xl font-medium text-indigo-700 mb-2">
              {activeTab === 'saved' ? 'No saved articles yet' : 'No news articles found'}
            </h3>
            <p className="text-indigo-500">
              {activeTab === 'saved' 
                ? 'Save articles by clicking the bookmark icon' 
                : 'Try a different search or category'}
            </p>
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredNews.map((article, index) => (
              <motion.div
                key={article.link || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                layout
              >
                <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
                  {article.image_url ? (
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={article.image_url} 
                        alt={article.title || 'News image'} 
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/600x400?text=No+Image';
                        }}
                      />
                      <div className="absolute top-2 right-2 flex gap-1">
                        <button
                          onClick={() => toggleSaveArticle(article)}
                          className={`p-2 rounded-full backdrop-blur-sm ${savedArticles.some(a => a.link === article.link) ? 'bg-yellow-400 text-yellow-800' : 'bg-white/80 text-gray-700 hover:bg-yellow-400 hover:text-yellow-800'}`}
                        >
                          <Bookmark size={18} fill="currentColor" />
                        </button>
                        <button
                          onClick={() => shareArticle(article)}
                          className="p-2 rounded-full backdrop-blur-sm bg-white/80 text-gray-700 hover:bg-indigo-500 hover:text-white"
                        >
                          <Share2 size={18} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="h-48 bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                      <span className="text-gray-400">No image available</span>
                    </div>
                  )}
                  
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-xs font-medium px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full">
                        {article.source_id || 'Unknown'}
                      </span>
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock size={14} />
                        {new Date(article.pubDate).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <h2 
                      className="text-xl font-semibold mb-3 text-indigo-800 cursor-pointer"
                      onClick={() => toggleExpandArticle(index)}
                    >
                      {article.title}
                    </h2>
                    
                    <AnimatePresence>
                      {expandedArticle === index && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="mb-4"
                        >
                          <p className="text-gray-600 mb-4">
                            {article.description || 'No description available.'}
                          </p>
                          {article.content && (
                            <p className="text-gray-500 text-sm">
                              {article.content.substring(0, 200)}...
                            </p>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                    
                    <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center">
                      <a 
                        href={article.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:text-indigo-800 font-medium text-sm flex items-center gap-1"
                      >
                        Read full story
                        <ChevronDown size={16} className="transform rotate-270" />
                      </a>
                      <button
                        onClick={() => toggleExpandArticle(index)}
                        className="text-indigo-500 hover:text-indigo-700 text-sm"
                      >
                        {expandedArticle === index ? 'Show less' : 'Show more'}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </main>

      <footer className="bg-gradient-to-r from-indigo-700 to-purple-700 text-white p-6 mt-12">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h2 className="text-xl font-bold text-yellow-300 flex items-center gap-2">
                <Newspaper size={24} />
                CryptoWeather Nexus
              </h2>
              <p className="text-indigo-200 mt-1">Your trusted news source</p>
            </div>
            <div className="flex gap-4">
              <a href="#" className="text-indigo-200 hover:text-white transition-colors">About</a>
              <a href="#" className="text-indigo-200 hover:text-white transition-colors">Privacy</a>
              <a href="#" className="text-indigo-200 hover:text-white transition-colors">Terms</a>
              <a href="#" className="text-indigo-200 hover:text-white transition-colors">Contact</a>
            </div>
          </div>
          <div className="mt-6 text-center text-indigo-300 text-sm">
            &copy; {new Date().getFullYear()} CryptoWeather Nexus News App. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}