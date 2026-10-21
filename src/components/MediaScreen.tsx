import React, { useState } from 'react';
import { useContent } from '../backend/useContent';
import { VideoPlayer } from './VideoPlayer';

export interface MediaItem {
  id: string;
  title: string;
  type: 'photo' | 'video' | 'stream';
  category: 'matches' | 'training' | 'backstage';
  badgeType: 'photo' | 'video';
  badgeValue: string; // e.g. '18', '10:25'
  imgSrc: string;
  alt: string;
  description?: string;
  date?: string;
  url?: string;
}

interface MediaScreenProps {
  onBack: () => void;
  onOpenMenu: () => void;
  onOpenLiveStream?: () => void;
}

const INITIAL_MEDIA_ITEMS: MediaItem[] = [
  {
    id: 'm-1',
    title: 'صور المباراة',
    alt: 'صور المباراة',
    type: 'photo',
    category: 'matches',
    badgeType: 'photo',
    badgeValue: '18',
    imgSrc: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=500&auto=format&fit=crop',
    description: 'ألبوم حصري يوثق أحداث مواجهة نادي الرجاء العراقي ولحظات الاحتفال.',
    date: '2026/09/25',
  },
  {
    id: 'm-2',
    title: 'ملخص المباراة',
    alt: 'ملخص المباراة',
    type: 'video',
    category: 'matches',
    badgeType: 'video',
    badgeValue: '10:25',
    imgSrc: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=500&auto=format&fit=crop',
    description: 'شاهد ملخص مباراة نادي الرجاء العراقي كاملة، وأبرز الهجمات والتصديات المثيرة.',
    date: '2026/09/25',
  },
  {
    id: 'm-3',
    title: 'تدريبات',
    alt: 'تدريبات',
    type: 'video',
    category: 'training',
    badgeType: 'video',
    badgeValue: '01:15',
    imgSrc: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=500&auto=format&fit=crop',
    description: 'جانب من تدريبات اللياقة البدنية والسرعة الصباحية للاعبي الفريق الأول.',
    date: '2026/09/23',
  },
  {
    id: 'm-4',
    title: 'الجماهير',
    alt: 'الجماهير',
    type: 'photo',
    category: 'matches',
    badgeType: 'photo',
    badgeValue: '24',
    imgSrc: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?w=500&auto=format&fit=crop',
    description: 'حماس ومؤازرة جماهير نادي الرجاء العراقي الوفية في المدرجات طوال الـ 90 دقيقة.',
    date: '2026/09/25',
  },
  {
    id: 'm-5',
    title: 'مؤتمر صحفي',
    alt: 'مؤتمر صحفي',
    type: 'photo',
    category: 'backstage',
    badgeType: 'photo',
    badgeValue: '5',
    imgSrc: 'https://images.unsplash.com/photo-1551958219-acbc608c6377?w=500&auto=format&fit=crop',
    description: 'المؤتمر الصحفي لمدرب الفريق وقائد الرجاء العراقي للحديث عن الاستعدادات والجاهزية.',
    date: '2026/09/22',
  },
  {
    id: 'm-6',
    title: 'هدف',
    alt: 'هدف',
    type: 'video',
    category: 'matches',
    badgeType: 'video',
    badgeValue: '00:45',
    imgSrc: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=500&auto=format&fit=crop',
    description: 'لقطة الهدف الصاروخي الذي حسم نقاط اللقاء لصالح فرسان الرافدين.',
    date: '2026/09/25',
  },
  {
    id: 'm-7',
    title: 'كواليس غرفة الملابس',
    alt: 'كواليس غرفة الملابس',
    type: 'photo',
    category: 'backstage',
    badgeType: 'photo',
    badgeValue: '12',
    imgSrc: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=500&auto=format&fit=crop',
    description: 'لقطات حصرية لما قبل نزول اللاعبين لأرضية الميدان والحديث التحفيزي.',
    date: '2026/09/24',
  },
  {
    id: 'm-8',
    title: 'تمارين التسديد على المرمى',
    alt: 'تمارين التسديد',
    type: 'video',
    category: 'training',
    badgeType: 'video',
    badgeValue: '02:40',
    imgSrc: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=500&auto=format&fit=crop',
    description: 'تدريبات فنية مكثفة على الكرات الثابتة والتسديد من مسافات بعيدة.',
    date: '2026/09/21',
  },
];

export const MediaScreen: React.FC<MediaScreenProps> = ({
  onBack,
  onOpenMenu,
  onOpenLiveStream,
}) => {
  // Main tabs: 'stream' (البث المباشر) | 'videos' (الفيديوهات) | 'photos' (الصور - active in template)
  const [mainTab, setMainTab] = useState<'stream' | 'videos' | 'photos'>('photos');

  // Sub-filters: 'backstage' (خلف الكواليس) | 'training' (التدريبات) | 'matches' (المباريات) | 'all' (كل الفئات - active in template)
  const [subFilter, setSubFilter] = useState<'backstage' | 'training' | 'matches' | 'all'>('all');

  // Preview modal state
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);

  // Filter media items
  const mediaItems = useContent<MediaItem>('media', INITIAL_MEDIA_ITEMS);
  const filteredItems = mediaItems.filter((item) => {
    // Main tab filter
    if (mainTab === 'photos' && item.type !== 'photo') return false;
    if (mainTab === 'videos' && item.type !== 'video') return false;
    if (mainTab === 'stream') return item.type === 'stream';

    // Sub-filter
    if (subFilter !== 'all' && item.category !== subFilter) return false;

    return true;
  });

  return (
    <div id="media-screen" className="screen active fade-in-screen">
      {/* الترويسة العلوية */}
      <div className="screen-header">
        <i
          className="fa-solid fa-chevron-right back-icon"
          onClick={onBack}
          role="button"
          tabIndex={0}
          aria-label="رجوع"
        ></i>
        <h2 className="header-title">الصور والفيديوهات</h2>
        <i
          className="fa-solid fa-bars menu-icon"
          onClick={onOpenMenu}
          role="button"
          tabIndex={0}
          aria-label="القائمة"
        ></i>
      </div>

      {/* شريط التبويبات الرئيسي */}
      <div className="media-main-tabs">
        <button
          className={`media-tab-btn ${mainTab === 'stream' ? 'active' : ''}`}
          onClick={() => {
            setMainTab('stream');
            if (onOpenLiveStream) onOpenLiveStream();
          }}
        >
          البث المباشر
        </button>
        <button
          className={`media-tab-btn ${mainTab === 'videos' ? 'active' : ''}`}
          onClick={() => setMainTab('videos')}
        >
          الفيديوهات
        </button>
        <button
          className={`media-tab-btn ${mainTab === 'photos' ? 'active' : ''}`}
          onClick={() => setMainTab('photos')}
        >
          الصور
        </button>
      </div>

      {/* شريط الفئات الفرعية */}
      <div className="media-sub-filters">
        <span
          className={`m-filter-item ${subFilter === 'backstage' ? 'active' : ''}`}
          onClick={() => setSubFilter('backstage')}
          role="button"
          tabIndex={0}
        >
          خلف الكواليس
        </span>
        <span
          className={`m-filter-item ${subFilter === 'training' ? 'active' : ''}`}
          onClick={() => setSubFilter('training')}
          role="button"
          tabIndex={0}
        >
          التدريبات
        </span>
        <span
          className={`m-filter-item ${subFilter === 'matches' ? 'active' : ''}`}
          onClick={() => setSubFilter('matches')}
          role="button"
          tabIndex={0}
        >
          المباريات
        </span>
        <span
          className={`m-filter-item ${subFilter === 'all' ? 'active' : ''}`}
          onClick={() => setSubFilter('all')}
          role="button"
          tabIndex={0}
        >
          كل الفئات
        </span>
      </div>

      {/* شبكة الميديا (الصور والفيديوهات) */}
      <div className="media-grid">
        {filteredItems.length === 0 ? (
          <div className="col-span-2 py-16 text-center text-[#8c96aa]">
            <i className="fa-solid fa-photo-film text-3xl mb-3 text-white/20 block"></i>
            <p className="text-xs font-bold">لا توجد وسائط متوفرة في هذا القسم حالياً</p>
          </div>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item.id}
              className="media-card group"
              onClick={() => setSelectedMedia(item)}
              role="button"
              tabIndex={0}
            >
              <img
                src={item.imgSrc}
                alt={item.alt}
                className="media-img"
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=500&auto=format&fit=crop';
                }}
              />
              <div className="media-badge">
                {item.badgeType === 'video' ? (
                  <>
                    <i className="fa-solid fa-play"></i>
                    <span>{item.badgeValue}</span>
                  </>
                ) : (
                  <>
                    <i className="fa-regular fa-images"></i>
                    <span>{item.badgeValue}</span>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* نافذة استعراض الميديا التفصيلية */}
      {selectedMedia && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setSelectedMedia(null)}
        >
          <div
            className="relative w-full max-w-sm bg-[#121c2e] border border-white/10 rounded-2xl overflow-hidden shadow-2xl text-right"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-3.5 border-b border-white/10 bg-[#0a1120]">
              <button
                onClick={() => setSelectedMedia(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
              >
                ✕
              </button>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">{selectedMedia.title}</span>
                <span className="text-[10px] bg-[#e30613] text-white px-2 py-0.5 rounded-full font-bold">
                  {selectedMedia.type === 'video' ? 'فيديو' : 'ألبوم صور'}
                </span>
              </div>
            </div>

            <div className="relative aspect-video w-full bg-black flex items-center justify-center">
              {selectedMedia.type === 'video'
                ? <VideoPlayer url={selectedMedia.url} title={selectedMedia.title} />
                : <img src={selectedMedia.imgSrc} alt={selectedMedia.alt} className="w-full h-full object-contain" />}
            </div>
            {/* Details */}
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between text-xs text-[#8c96aa]">
                <span>التاريخ: {selectedMedia.date || '2026/09/25'}</span>
                <span className="font-semibold text-[#d4af37]">
                  {selectedMedia.category === 'matches'
                    ? 'المباريات'
                    : selectedMedia.category === 'training'
                    ? 'التدريبات'
                    : 'خلف الكواليس'}
                </span>
              </div>

              <p className="text-xs text-white/90 leading-relaxed">
                {selectedMedia.description}
              </p>

              <div className="pt-2 flex gap-2">
                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: selectedMedia.title,
                        text: selectedMedia.description,
                        url: window.location.href,
                      }).catch(() => {});
                    }
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <i className="fa-solid fa-share-nodes"></i>
                  <span>مشاركة</span>
                </button>
                <button
                  onClick={() => setSelectedMedia(null)}
                  className="flex-1 py-2.5 rounded-xl bg-[#e30613] hover:bg-[#c0040f] text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <span>إغلاق</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
