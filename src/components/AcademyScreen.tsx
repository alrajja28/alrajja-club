import React, { useRef, useState } from 'react';
import { useContent } from '../backend/useContent';
import { useMutation } from 'convex/react';
import { clubApi } from '../backend/api';
import {errorMessage} from '../backend/errors';
import { LionLogo } from './LionLogo';
import {
  ACADEMY_PLAYERS,
  ACADEMY_SUB_FILTERS,
  ACADEMY_BANNER_INFO,
  AcademyPlayer,
} from '../data/academyData';

interface AcademyScreenProps {
  onBack: () => void;
  onOpenMenu: () => void;
}

export const AcademyScreen: React.FC<AcademyScreenProps> = ({ onBack, onOpenMenu }) => {
  const announcements = useContent<{id:string;title:string;description?:string;image?:string}>('academy');
  // Main tabs: الأشبال | الناشئين | الشباب | الفريق الأول
  const [activeMainTab, setActiveMainTab] = useState<'اشبال' | 'ناشئين' | 'شباب' | 'اول'>('اشبال');

  // Sub-filters (المواليد أو المراكز)
  const [activeSubFilter, setActiveSubFilter] = useState<string>('2012');

  // Modal actions
  const [activeModal, setActiveModal] = useState<
    'register' | 'coaches' | 'fixtures' | 'programs' | 'news' | 'playerDetail' | null
  >(null);
  const [selectedNews, setSelectedNews] = useState<any>(null);
  const [selectedPlayer, setSelectedPlayer] = useState<AcademyPlayer | null>(null);

  // Registration form state
  const [regForm, setRegForm] = useState({
    childName: '',
    birthYear: '2012',
    parentName: '',
    phone: '',
    position: 'وسط',
  });
  const [regSubmitted, setRegSubmitted] = useState(false);
  const submitRegistration = useMutation(clubApi.submissions.submit);
  const [registrationError,setRegistrationError] = useState('');
  const [registrationBusy,setRegistrationBusy] = useState(false);
  const registrationNonce=useRef(crypto.randomUUID());

  // Switch category and update default subfilter accordingly
  const handleCategoryChange = (tab: 'اشبال' | 'ناشئين' | 'شباب' | 'اول') => {
    setActiveMainTab(tab);
    if (tab === 'اشبال') {
      setActiveSubFilter('2012');
    } else if (tab === 'ناشئين') {
      setActiveSubFilter('2010');
    } else if (tab === 'شباب') {
      setActiveSubFilter('2006');
    } else if (tab === 'اول') {
      setActiveSubFilter('all');
    }
  };

  // Filter players dynamically
  const filteredPlayers = ACADEMY_PLAYERS.filter((player) => {
    if (player.category !== activeMainTab) return false;
    if (activeMainTab === 'اول') {
      if (activeSubFilter === 'all') return true;
      return player.posGroup === activeSubFilter;
    }
    return player.subCategory === activeSubFilter;
  });

  const bannerInfo = ACADEMY_BANNER_INFO[activeMainTab];
  const subFilters = ACADEMY_SUB_FILTERS[activeMainTab] || [];

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegistrationError('');setRegistrationBusy(true);
    try {
      await submitRegistration({kind:'academy',data:regForm,nonce:registrationNonce.current});
      setRegSubmitted(true);
    } catch(error) {setRegistrationError(errorMessage(error));}
    finally {setRegistrationBusy(false);}
  };

  const getCategoryTitleAr = () => {
    switch (activeMainTab) {
      case 'اشبال':
        return 'فئة الأشبال';
      case 'ناشئين':
        return 'فئة الناشئين';
      case 'شباب':
        return 'فئة الشباب';
      case 'اول':
        return 'الفريق الأول لنادي الرجاء العراقي';
    }
  };

  return (
    <div id="academy-screen" className="screen active">
      {/* الترويسة العلوية */}
      <div className="screen-header">
        <i
          className="fa-solid fa-chevron-right back-icon cursor-pointer"
          onClick={onBack}
          role="button"
          title="رجوع"
        ></i>
        <h2 className="header-title">أكاديمية نادي الرجاء العراقي</h2>
        <i
          className="fa-solid fa-bars menu-icon cursor-pointer"
          onClick={onOpenMenu}
          role="button"
          title="القائمة"
        ></i>
      </div>

      {/* شريط التبويبات الرئيسي (الأشبال / الناشئين / الشباب / الفريق الأول) */}
      <div className="academy-tabs">
        <button
          className={`academy-tab-btn ${activeMainTab === 'اشبال' ? 'active' : ''}`}
          onClick={() => handleCategoryChange('اشبال')}
        >
          الأشبال
        </button>
        <button
          className={`academy-tab-btn ${activeMainTab === 'ناشئين' ? 'active' : ''}`}
          onClick={() => handleCategoryChange('ناشئين')}
        >
          الناشئين
        </button>
        <button
          className={`academy-tab-btn ${activeMainTab === 'شباب' ? 'active' : ''}`}
          onClick={() => handleCategoryChange('شباب')}
        >
          الشباب
        </button>
        <button
          className={`academy-tab-btn ${activeMainTab === 'اول' ? 'active' : ''}`}
          onClick={() => handleCategoryChange('اول')}
        >
          الفريق الأول
        </button>
      </div>

      {/* شريط التصنيفات الفرعية (المواليد للفئات السنية أو المراكز للفريق الأول) */}
      <div className="academy-sub-filters">
        {subFilters.map((f) => (
          <span
            key={f.id}
            className={`a-filter-item ${activeSubFilter === f.id ? 'active' : ''}`}
            onClick={() => setActiveSubFilter(f.id)}
          >
            {f.label}
          </span>
        ))}
      </div>

      <div className="academy-content">
        {announcements.map(item => <article key={item.id} className="match-card">
          {item.image && <img src={item.image} alt={item.title} className="w-full h-36 object-cover rounded-xl mb-3"/>}
          <h2 className="font-bold text-sm">{item.title}</h2><p className="text-xs leading-loose text-[#a3aec2] mt-2">{item.description}</p>
        </article>)}
        {/* البانر التفاعلي لكل فئة */}
        <div className="academy-banner relative rounded-2xl overflow-hidden mb-4 shadow-lg">
          <img
            src={bannerInfo.image}
            alt={bannerInfo.title}
            className="w-full h-36 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070d1a] via-[#070d1a]/60 to-transparent flex flex-col justify-end p-3.5">
            <span className="text-[10px] font-bold text-[#e30613] bg-[#e30613]/20 border border-[#e30613]/40 px-2 py-0.5 rounded-full w-fit mb-1">
              {getCategoryTitleAr()}
            </span>
            <h2 className="text-sm font-extrabold text-white leading-tight">
              {bannerInfo.title}
            </h2>
            <p className="text-[11px] text-[#8c96aa] mt-0.5 line-clamp-1">
              {bannerInfo.subtitle}
            </p>
            <div className="mt-2 flex items-center justify-between text-[10px] text-white/80 border-t border-white/10 pt-1.5">
              <span className="flex items-center gap-1 text-[#ffd700]">
                <i className="fa-solid fa-user-tie"></i>
                <span>{bannerInfo.coach}</span>
              </span>
              <span className="text-[#8c96aa]">{bannerInfo.trainingDays}</span>
            </div>
          </div>
        </div>

        {/* الأيقونات السريعة للأكاديمية */}
        <div className="academy-links-grid mb-5">
          <div
            className="a-link-card cursor-pointer"
            onClick={() => {
              setRegSubmitted(false);
              setActiveModal('register');
            }}
          >
            <i className="fa-solid fa-user-plus text-[#e30613]"></i>
            <span>تسجيل لاعب</span>
          </div>

          <div
            className="a-link-card cursor-pointer"
            onClick={() => setActiveModal('coaches')}
          >
            <i className="fa-solid fa-user-tie text-[#ffd700]"></i>
            <span>المدربين</span>
          </div>

          <div
            className="a-link-card cursor-pointer"
            onClick={() => setActiveModal('fixtures')}
          >
            <i className="fa-regular fa-calendar-days text-[#38bdf8]"></i>
            <span>جداول المباريات</span>
          </div>

          <div
            className="a-link-card cursor-pointer"
            onClick={() => setActiveModal('programs')}
          >
            <i className="fa-solid fa-clipboard-list text-emerald-400"></i>
            <span>البرامج التدريبية</span>
          </div>
        </div>

        {/* ================= قسم قائمة اللاعبين المتغير ديناميكياً ================= */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3 px-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#e30613] animate-pulse"></span>
              <h3 className="text-sm font-extrabold text-white">
                قائمة لاعبي {getCategoryTitleAr()}
              </h3>
            </div>
            <span className="text-[11px] font-bold text-[#ffd700] bg-[#ffd700]/10 px-2.5 py-0.5 rounded-full border border-[#ffd700]/20">
              {filteredPlayers.length} لاعبين
            </span>
          </div>

          {/* شبكة بطاقات اللاعبين */}
          {filteredPlayers.length > 0 ? (
            <div className="grid grid-cols-2 gap-2.5">
              {filteredPlayers.map((player) => (
                <div
                  key={player.id}
                  onClick={() => {
                    setSelectedPlayer(player);
                    setActiveModal('playerDetail');
                  }}
                  className="bg-[#121c2e] hover:bg-[#18253d] border border-white/5 hover:border-[#e30613]/50 rounded-2xl p-2.5 cursor-pointer transition-all duration-200 hover:-translate-y-1 shadow-md group flex flex-col justify-between"
                >
                  {/* صورة اللاعب مع الرقم */}
                  <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-2 bg-[#070d1a]">
                    <img
                      src={player.imgUrl}
                      alt={player.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-1.5 right-1.5 w-6 h-6 rounded-md bg-[#070d1a]/80 backdrop-blur-sm border border-white/10 flex items-center justify-center font-mono font-black text-xs text-white">
                      #{player.number}
                    </div>
                    <div className="absolute bottom-1.5 left-1.5 bg-[#070d1a]/80 backdrop-blur-sm px-1.5 py-0.5 rounded text-[10px] font-bold text-[#ffd700] flex items-center gap-1 border border-white/10">
                      <i className="fa-solid fa-star text-[9px]"></i>
                      <span>{player.rating}</span>
                    </div>
                  </div>

                  {/* تفاصيل اللاعب */}
                  <div>
                    <h4 className="text-xs font-bold text-white group-hover:text-[#ffd700] transition-colors truncate">
                      {player.name}
                    </h4>
                    <div className="text-[10px] text-[#8c96aa] truncate mt-0.5">
                      {player.position}
                    </div>

                    {/* إحصائيات سريعة */}
                    <div className="mt-2 pt-2 border-t border-white/5 flex items-center justify-between text-[10px]">
                      {player.goals !== undefined ? (
                        <span className="text-[#e30613] font-bold">
                          {player.goals} هدف
                        </span>
                      ) : player.cleanSheets !== undefined ? (
                        <span className="text-emerald-400 font-bold">
                          {player.cleanSheets} كلين شيت
                        </span>
                      ) : (
                        <span className="text-[#8c96aa]">
                          {player.matches} مباراة
                        </span>
                      )}
                      <span className="text-[9px] text-[#8c96aa]">
                        {player.birthYear ? `مواليد ${player.birthYear}` : ''}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center bg-[#121c2e] rounded-2xl border border-white/5">
              <i className="fa-solid fa-users text-[#8c96aa] text-3xl mb-2"></i>
              <p className="text-xs text-[#8c96aa]">لا يوجد لاعبين في هذا التصنيف حالياً</p>
            </div>
          )}
        </div>

        {/* قسم آخر الأخبار */}
        <div className="section-title" style={{ marginTop: '10px' }}>
          أخبار فئات الأكاديمية
        </div>

        <div className="academy-news-list">
          {/* خبر 1 */}
          <div
            className="a-news-card cursor-pointer"
            onClick={() => {
              setSelectedNews({
                title: 'اختبارات الأكاديمية لمواليد 2010',
                date: '2026/09/15',
                image:
                  'https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=400&q=80',
                content:
                  'تعلن إدارة أكاديمية نادي الرجاء العراقي عن انطلاق تجارب الأداء الفنية والبدنية للبراعم والناشئين مواليد 2010 على ملاعب النادي التدريبية تحت إشراف الطاقم الفني المعتمد.',
              });
              setActiveModal('news');
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=400&q=80"
              alt="اختبارات الأكاديمية"
              className="a-news-img"
            />
            <div className="a-news-details">
              <h4 className="a-news-title">اختبارات الأكاديمية لمواليد 2010</h4>
              <div className="a-news-meta">
                <span className="a-news-date">2026/09/15</span>
                <div className="a-news-stats">
                  <span>
                    <i className="fa-regular fa-eye"></i> 1.2K
                  </span>
                  <span>
                    <i className="fa-regular fa-heart"></i> 120
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* خبر 2 */}
          <div
            className="a-news-card cursor-pointer"
            onClick={() => {
              setSelectedNews({
                title: 'نتائج مباريات فئة الناشئين',
                date: '2026/09/12',
                image:
                  'https://images.unsplash.com/photo-1526232761682-d26e03ac148e?auto=format&fit=crop&w=400&q=80',
                content:
                  'حقق فريق ناشئي نادي الرجاء العراقي فوزاً كبيراً بنتيجة 4-1 في قمة دوري الفئات العمرية بعد أداء تكتيكي مميز أشاد به مدربو قطاع المراحل السنية.',
              });
              setActiveModal('news');
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1526232761682-d26e03ac148e?auto=format&fit=crop&w=400&q=80"
              alt="نتائج مباريات"
              className="a-news-img"
            />
            <div className="a-news-details">
              <h4 className="a-news-title">نتائج مباريات فئة الناشئين</h4>
              <div className="a-news-meta">
                <span className="a-news-date">2026/09/12</span>
                <div className="a-news-stats">
                  <span>
                    <i className="fa-regular fa-eye"></i> 850
                  </span>
                  <span>
                    <i className="fa-regular fa-heart"></i> 95
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= نافذة تفاصيل اللاعب (Player Card Modal) ================= */}
      {activeModal === 'playerDetail' && selectedPlayer && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-sm bg-[#0a1120] border border-white/10 rounded-3xl p-5 text-right text-white relative shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <LionLogo size={24} />
                <span className="text-xs font-bold text-[#e30613]">
                  بطاقة لاعب · {selectedPlayer.categoryTitle}
                </span>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center text-[#8c96aa] hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Profile Content */}
            <div className="mt-4 flex flex-col items-center">
              <div className="relative w-28 h-28 rounded-2xl overflow-hidden border-2 border-[#e30613] shadow-lg mb-3">
                <img
                  src={selectedPlayer.imgUrl}
                  alt={selectedPlayer.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-1 right-1 bg-black/80 px-2 py-0.5 rounded text-xs font-black font-mono text-white">
                  #{selectedPlayer.number}
                </div>
              </div>

              <h3 className="font-black text-base text-white">{selectedPlayer.name}</h3>
              <p className="text-xs text-[#ffd700] font-semibold mt-0.5">
                {selectedPlayer.position}
              </p>

              {/* Stats Grid */}
              <div className="w-full grid grid-cols-3 gap-2 my-4">
                <div className="bg-[#121c2e] p-2.5 rounded-xl border border-white/5 text-center">
                  <span className="block text-[10px] text-[#8c96aa]">المباريات</span>
                  <span className="text-sm font-black font-mono text-white">
                    {selectedPlayer.matches}
                  </span>
                </div>
                <div className="bg-[#121c2e] p-2.5 rounded-xl border border-white/5 text-center">
                  <span className="block text-[10px] text-[#8c96aa]">
                    {selectedPlayer.goals !== undefined
                      ? 'الأهداف'
                      : selectedPlayer.cleanSheets !== undefined
                      ? 'شباك نظيفة'
                      : 'المشاركات'}
                  </span>
                  <span className="text-sm font-black font-mono text-[#e30613]">
                    {selectedPlayer.goals ?? selectedPlayer.cleanSheets ?? '-'}
                  </span>
                </div>
                <div className="bg-[#121c2e] p-2.5 rounded-xl border border-white/5 text-center">
                  <span className="block text-[10px] text-[#8c96aa]">التقييم</span>
                  <span className="text-sm font-black font-mono text-[#ffd700]">
                    ⭐ {selectedPlayer.rating}
                  </span>
                </div>
              </div>

              {/* Attributes Details */}
              <div className="w-full bg-[#121c2e] p-3 rounded-2xl border border-white/5 space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#8c96aa]">المواليد:</span>
                  <span className="font-bold text-white">مواليد {selectedPlayer.birthYear}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8c96aa]">الطول:</span>
                  <span className="font-bold text-white">{selectedPlayer.height}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8c96aa]">القدم المفضلة:</span>
                  <span className="font-bold text-white">{selectedPlayer.foot}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8c96aa]">الميزة التكتيكية:</span>
                  <span className="font-bold text-[#ffd700] text-[11px]">
                    {selectedPlayer.specialSkill}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setActiveModal(null)}
                className="w-full mt-4 py-2.5 bg-[#e30613] hover:bg-[#c40510] text-white rounded-xl text-xs font-bold transition cursor-pointer"
              >
                إغلاق البطاقة
              </button>
            </div>
          </div>
        </div>
      )}

      {/* نافذة تسجيل لاعب */}
      {activeModal === 'register' && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-sm bg-[#0a1120] border border-white/10 rounded-3xl p-5 text-right text-white relative shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <i className="fa-solid fa-user-plus text-[#e30613]"></i>
                <h3 className="font-bold text-sm text-white">
                  تسجيل لاعب جديد بأكاديمية نادي الرجاء العراقي
                </h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center text-[#8c96aa] hover:text-white"
              >
                ✕
              </button>
            </div>

            {regSubmitted ? (
              <div className="py-6 text-center space-y-3">
                <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto text-2xl">
                  <i className="fa-solid fa-check"></i>
                </div>
                <h4 className="font-extrabold text-base text-white">تم استلام طلب التسجيل بنجاح!</h4>
                <p className="text-xs text-[#8c96aa] leading-relaxed">
                  سيتواصل معك المشرف الإداري لأكاديمية نادي الرجاء العراقي خلال 24 ساعة لتحديد موعد الفحص الطبي واختبار المهارات.
                </p>
                <button
                  onClick={() => setActiveModal(null)}
                  className="py-2.5 px-6 bg-[#e30613] text-white rounded-xl text-xs font-bold hover:bg-[#c40510]"
                >
                  إغلاق
                </button>
              </div>
            ) : (
              <form onSubmit={handleRegisterSubmit} className="mt-4 space-y-3">
                {registrationError && <p role="alert" className="text-xs text-red-300">{registrationError}</p>}
                <div>
                  <label className="block text-[11px] font-semibold text-[#8c96aa] mb-1">
                    اسم اللاعب الرباعي
                  </label>
                  <input
                    type="text"
                    required
                    value={regForm.childName}
                    onChange={(e) => setRegForm({ ...regForm, childName: e.target.value })}
                    placeholder="مثال: يوسف أحمد الكرخي"
                    className="w-full bg-[#121c2e] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#e30613]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#8c96aa] mb-1">
                      سنة الميلاد
                    </label>
                    <select
                      value={regForm.birthYear}
                      onChange={(e) => setRegForm({ ...regForm, birthYear: e.target.value })}
                      className="w-full bg-[#121c2e] border border-white/10 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-[#e30613]"
                    >
                      <option value="2013">2013 (الأشبال)</option>
                      <option value="2012">2012 (الأشبال)</option>
                      <option value="2011">2011 (الأشبال)</option>
                      <option value="2010">2010 (الناشئين)</option>
                      <option value="2009">2009 (الناشئين)</option>
                      <option value="2006">2006 (الشباب)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#8c96aa] mb-1">
                      المركز المفضل
                    </label>
                    <select
                      value={regForm.position}
                      onChange={(e) => setRegForm({ ...regForm, position: e.target.value })}
                      className="w-full bg-[#121c2e] border border-white/10 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-[#e30613]"
                    >
                      <option value="حارس مرمى">حارس مرمى</option>
                      <option value="مدافع">مدافع</option>
                      <option value="وسط">خط وسط</option>
                      <option value="مهاجم">مهاجم</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#8c96aa] mb-1">
                    رقم هاتف ولي الأمر
                  </label>
                  <input
                    type="tel"
                    required
                    value={regForm.phone}
                    onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                    placeholder="0770xxxxxxx"
                    className="w-full bg-[#121c2e] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#e30613]"
                  />
                </div>

                <button
                  type="submit" disabled={registrationBusy}
                  className="w-full py-3 bg-[#e30613] hover:bg-[#c40510] text-white font-bold text-xs rounded-xl mt-2 cursor-pointer transition shadow-lg"
                >
                  إرسال طلب الانضمام للأكاديمية
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* نافذة المدربين */}
      {activeModal === 'coaches' && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-sm bg-[#0a1120] border border-white/10 rounded-3xl p-5 text-right text-white relative shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <i className="fa-solid fa-user-tie text-[#ffd700]"></i>
                <h3 className="font-bold text-sm text-white">
                  الكادر الفني لأكاديمية نادي الرجاء العراقي
                </h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center text-[#8c96aa] hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-3 max-h-[60vh] overflow-y-auto pr-1">
              {[
                {
                  name: 'كابتن مارك فان دير بيلت',
                  role: 'المدير الفني لقطاع الفئات والناشئين',
                  license: 'UEFA Pro',
                },
                {
                  name: 'كابتن أحمد الحمادي',
                  role: 'مدرب فئة الأشبال والبراعم',
                  license: 'AFC A',
                },
                {
                  name: 'كابتن رافد سالم السعدي',
                  role: 'مدرب فريق الشباب',
                  license: 'AFC Pro',
                },
                {
                  name: 'كابتن كارلوس سيلفا',
                  role: 'مدرب حراس المرمى لفرق الفئات',
                  license: 'FIFA Goalkeeping',
                },
                {
                  name: 'د. يوسف النعيمي',
                  role: 'أخصائي الإعداد البدني والتغذية',
                  license: 'Ph.D Sports Science',
                },
              ].map((c, i) => (
                <div
                  key={i}
                  className="bg-[#121c2e] p-3 rounded-2xl border border-white/5 flex items-center justify-between"
                >
                  <div>
                    <h5 className="font-bold text-xs text-white">{c.name}</h5>
                    <p className="text-[11px] text-[#8c96aa]">{c.role}</p>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-[#ffd700] border border-white/10">
                    {c.license}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* نافذة جداول المباريات */}
      {activeModal === 'fixtures' && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-sm bg-[#0a1120] border border-white/10 rounded-3xl p-5 text-right text-white relative shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <i className="fa-regular fa-calendar-days text-[#38bdf8]"></i>
                <h3 className="font-bold text-sm text-white">
                  جدول مباريات فرق نادي الرجاء العراقي
                </h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center text-[#8c96aa] hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {[
                {
                  comp: 'دوري الأشبال تحت 14 سنة',
                  match: 'الرجاء العراقي vs الزوراء',
                  date: 'السبت 3 أكتوبر · 4:30 م',
                  ground: 'ملعب النادي الفرعي 1',
                },
                {
                  comp: 'دوري الناشئين تحت 17 سنة',
                  match: 'الرجاء العراقي vs القوة الجوية',
                  date: 'الأحد 4 أكتوبر · 5:15 م',
                  ground: 'ملعب الشعب الدولي (الفرعي)',
                },
                {
                  comp: 'دوري الشباب تحت 20 سنة',
                  match: 'الرجاء العراقي vs الشرطة',
                  date: 'الثلاثاء 6 أكتوبر · 4:00 م',
                  ground: 'ملعب أكاديمية الرجاء',
                },
              ].map((f, i) => (
                <div key={i} className="bg-[#121c2e] p-3 rounded-2xl border border-white/5 space-y-1">
                  <div className="flex justify-between text-[10px] text-[#ffd700]">
                    <span>{f.comp}</span>
                    <span className="text-[#8c96aa]">{f.ground}</span>
                  </div>
                  <div className="font-bold text-xs text-white">{f.match}</div>
                  <div className="text-[11px] text-[#8c96aa]">{f.date}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* نافذة البرامج التدريبية */}
      {activeModal === 'programs' && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-sm bg-[#0a1120] border border-white/10 rounded-3xl p-5 text-right text-white relative shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <i className="fa-solid fa-clipboard-list text-emerald-400"></i>
                <h3 className="font-bold text-sm text-white">البرنامج التدريبي الأسبوعي</h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center text-[#8c96aa] hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-2 text-xs">
              <div className="bg-[#121c2e] p-3 rounded-2xl border border-white/5">
                <span className="font-bold text-emerald-400 block mb-1">
                  الأحد والثلاثاء (4:30 - 6:00 م)
                </span>
                <p className="text-[#8c96aa] text-[11px]">
                  تطوير التحكم بالكرة، التمرير الدقيق، وبناء اللعب من الخلف للفئات السنية.
                </p>
              </div>
              <div className="bg-[#121c2e] p-3 rounded-2xl border border-white/5">
                <span className="font-bold text-emerald-400 block mb-1">
                  الإثنين والأربعاء (4:30 - 6:00 م)
                </span>
                <p className="text-[#8c96aa] text-[11px]">
                  اللياقة البدنية، الرشاقة، والتسديد من مسافات مختلفة والمناورات التكتيكية.
                </p>
              </div>
              <div className="bg-[#121c2e] p-3 rounded-2xl border border-white/5">
                <span className="font-bold text-emerald-400 block mb-1">
                  الخميس (مباريات تطبيقية داخلية)
                </span>
                <p className="text-[#8c96aa] text-[11px]">
                  تقييم الأداء التكتيكي ومراجعة الفيديو مع الطاقم الفني الهولندي المعتمد.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* نافذة تفاصيل الخبر */}
      {activeModal === 'news' && selectedNews && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-sm bg-[#0a1120] border border-white/10 rounded-3xl p-5 text-right text-white relative shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-xs font-bold text-[#e30613]">أخبار أكاديمية الرجاء</span>
              <button
                onClick={() => setActiveModal(null)}
                className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center text-[#8c96aa] hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <img
                src={selectedNews.image}
                alt={selectedNews.title}
                className="w-full h-40 object-cover rounded-2xl"
              />
              <div className="text-[11px] text-[#8c96aa]">{selectedNews.date}</div>
              <h4 className="font-bold text-sm text-white">{selectedNews.title}</h4>
              <p className="text-xs text-[#8c96aa] leading-relaxed">{selectedNews.content}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
