import initialContent from '../data/initialContent.json';
import { useContent } from '../backend/useContent';
import React, { useState, useEffect } from 'react';
import { NewsItem } from '../data/clubData';
import { LionLogo } from './LionLogo';

interface NewsTabProps {
  onSelectNews: (news: NewsItem) => void;
  onBack?: () => void;
  onOpenMenu?: () => void;
}

interface NewsCardItem {
  id: string;
  category: 'أخبار' | 'تقارير' | 'تصريحات' | 'صور' | 'فيديو';
  title: string;
  date: string;
  views: string;
  likes?: number;
  liked?: boolean;
  image?: string;
  imageAlt?: string;
  isCompact?: boolean;
  content: string;
}

export const NewsTab: React.FC<NewsTabProps> = ({ onSelectNews, onBack, onOpenMenu }) => {
  const [activeCategory, setActiveCategory] = useState<'أخبار' | 'تقارير' | 'تصريحات' | 'صور' | 'فيديو'>('أخبار');

  const [articles, setArticles] = useState<NewsCardItem[]>(initialContent.news as NewsCardItem[]);
  const liveArticles = useContent<NewsCardItem>('news', initialContent.news as NewsCardItem[]);
  useEffect(() => setArticles(liveArticles), [liveArticles]);

  const handleToggleLike = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setArticles((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const isLiked = !item.liked;
          return {
            ...item,
            liked: isLiked,
            likes: (item.likes || 0) + (isLiked ? 1 : -1),
          };
        }
        return item;
      })
    );
  };

  const handleCardClick = (article: NewsCardItem) => {
    onSelectNews({
      id: article.id,
      title: article.title,
      date: article.date,
      category: article.category,
      readTime: '3 دقائق',
      summary: article.content.slice(0, 100) + '...',
      content: article.content,
      imageBg: 'from-[#17274a] to-[#070d1a]',
    });
  };

  const displayedArticles = articles.filter(
    (item) => item.category === activeCategory
  );

  return (
    <div id="news-screen" className="screen active w-full h-full flex flex-col relative">
      {/* الترويسة العلوية (الكليشة 4) */}
      <div className="screen-header">
        <i
          className="fa-solid fa-chevron-right back-icon"
          onClick={onBack}
          title="رجوع"
        ></i>
        <h2 className="header-title">الأخبار</h2>
        <i
          className="fa-solid fa-bars menu-icon"
          onClick={onOpenMenu}
          title="القائمة"
        ></i>
      </div>

      {/* شريط التبويبات (الكليشة 4) */}
      <div className="tabs-container">
        {(['أخبار', 'تقارير', 'تصريحات', 'صور', 'فيديو'] as const).map((tab) => (
          <button
            key={tab}
            className={`tab-btn ${activeCategory === tab ? 'active' : ''}`}
            onClick={() => setActiveCategory(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* قائمة الأخبار (الكليشة 4) */}
      <div className="news-list">
        {displayedArticles.length > 0 ? (
          displayedArticles.map((item) => (
            <div
              key={item.id}
              className={`news-card ${item.isCompact ? 'compact-card' : ''} cursor-pointer`}
              onClick={() => handleCardClick(item)}
            >
              {/* صورة الخبر (تختفي في البطاقات المصغرة عبر CSS) */}
              {!item.isCompact && (
                <div className="relative overflow-hidden group">
                  <img
                    src={item.image}
                    alt={item.imageAlt || item.title}
                    className="news-image transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                    onError={(e) => {
                      // Fallback if image fails to load
                      const target = e.target as HTMLElement;
                      target.style.display = 'none';
                    }}
                  />
                  <div className="absolute top-3 right-3 bg-[#e30613] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md">
                    {item.category}
                  </div>
                  {item.category === 'فيديو' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <div className="w-12 h-12 rounded-full bg-[#e30613] text-white flex items-center justify-center shadow-lg">
                        <i className="fa-solid fa-play mr-[-2px]"></i>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* محتوى الخبر */}
              <div className="news-content">
                <h3 className="news-title">{item.title}</h3>
                <div className="news-meta">
                  <span className="news-date">{item.date}</span>
                  <div className="news-stats">
                    <span>
                      <i className="fa-regular fa-eye"></i> {item.views}
                    </span>
                    {item.likes !== undefined && (
                      <span
                        onClick={(e) => handleToggleLike(e, item.id)}
                        className={`cursor-pointer transition-colors ${
                          item.liked ? 'text-[#e30613] font-bold' : 'hover:text-[#e30613]'
                        }`}
                        title="إعجاب"
                      >
                        <i className={`${item.liked ? 'fa-solid' : 'fa-regular'} fa-heart`}></i>{' '}
                        {item.likes}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-12 text-center text-[#8c96aa]">
            <LionLogo size={48} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm font-semibold text-white">لا توجد أخبار في هذا القسم حالياً</p>
            <p className="text-xs mt-1">تابعنا لموافاتك بآخر المستجدات أولاً بأول</p>
          </div>
        )}
      </div>
    </div>
  );
};
