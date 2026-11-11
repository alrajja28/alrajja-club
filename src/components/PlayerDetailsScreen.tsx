import React, { useState } from 'react';

export interface PlayerDetailsData {
  biography?:string;
  gameLog?:string;
  foot?:string;
  contractUntil?:string;
  id?: string;
  name: string;
  number: number;
  position: string;
  posName?: string;
  imgUrl?: string;
  height?: string;
  weight?: string;
  age?: number;
  matches?: number;
  goals?: number;
  assists?: number;
  yellowCards?: number;
  rating?: number | string;
}

interface PlayerDetailsScreenProps {
  player?: PlayerDetailsData | null;
  onBack: () => void;
  onOpenMenu: () => void;
}

export const PlayerDetailsScreen: React.FC<PlayerDetailsScreenProps> = ({
  player,
  onBack,
  onOpenMenu,
}) => {
  const [activeTab, setActiveTab] = useState<'matches' | 'stats' | 'info'>('stats');

  const current:PlayerDetailsData=player||{name:'لاعب غير متاح',number:0,position:''};

  const cleanHeight = current.height ? current.height.replace(/[^\d]/g, '') || '—' : '—';
  const cleanWeight = current.weight ? current.weight.replace(/[^\d]/g, '') || '—' : '—';
  const cleanAge = current.age ?? '—';
  const cleanMatches = current.matches !== undefined ? current.matches : '—';
  const cleanGoals = current.goals !== undefined ? current.goals : '—';
  const cleanAssists = current.assists !== undefined ? current.assists : '—';
  const cleanYellowCards = current.yellowCards !== undefined ? current.yellowCards : '—';
  const cleanRating = current.rating ?? '—';

  return (
    <div id="player-details-screen" className="screen active fade-in-screen">
      {/* الترويسة العلوية */}
      <div className="screen-header transparent-header">
        <i
          className="fa-solid fa-chevron-right back-icon"
          onClick={onBack}
          title="رجوع"
        ></i>
        <h2 className="header-title">تفاصيل اللاعب</h2>
        <i
          className="fa-solid fa-bars menu-icon"
          onClick={onOpenMenu}
          title="القائمة"
        ></i>
      </div>

      <div className="player-details-content">
        {/* صورة اللاعب والمعلومات الأساسية */}
        <div className="player-profile-header">
          <div className="player-large-img">
            <img
              src={
                current.imgUrl ||
                `${import.meta.env.BASE_URL}rajaa-logo.png`
              }
              alt={current.name}
            />
          </div>
          <div className="player-name-badge">
            <h1 className="p-number">{current.number}</h1>
            <h2 className="p-name">{current.name}</h2>
            <span className="p-position">{current.position || 'وسط'}</span>
          </div>
        </div>

        {/* شريط التبويبات */}
        <div className="details-tabs">
          <button
            className={`details-tab-btn ${activeTab === 'matches' ? 'active' : ''}`}
            onClick={() => setActiveTab('matches')}
          >
            المباريات
          </button>
          <button
            className={`details-tab-btn ${activeTab === 'stats' ? 'active' : ''}`}
            onClick={() => setActiveTab('stats')}
          >
            الإحصائيات
          </button>
          <button
            className={`details-tab-btn ${activeTab === 'info' ? 'active' : ''}`}
            onClick={() => setActiveTab('info')}
          >
            معلومات
          </button>
        </div>

        {/* محتوى التبويبات */}
        {activeTab === 'stats' && (
          <div className="stats-container">
            {/* المعلومات البدنية */}
            <div className="physical-stats">
              <div className="stat-box">
                <i className="fa-solid fa-ruler-vertical"></i>
                <span className="stat-label">الطول</span>
                <span className="stat-val">
                  {cleanHeight} <small>سم</small>
                </span>
              </div>
              <div className="stat-box">
                <i className="fa-solid fa-weight-scale"></i>
                <span className="stat-label">الوزن</span>
                <span className="stat-val">
                  {cleanWeight} <small>كجم</small>
                </span>
              </div>
              <div className="stat-box">
                <i className="fa-regular fa-calendar"></i>
                <span className="stat-label">العمر</span>
                <span className="stat-val">
                  {cleanAge} <small>سنة</small>
                </span>
              </div>
            </div>

            {/* إحصائيات الموسم الحالي */}
            <div className="section-title">إحصائيات الموسم الحالي</div>
            <div className="season-stats">
              <div className="season-stat-item">
                <span className="stat-num">{cleanMatches}</span>
                <span className="stat-text">مباراة</span>
              </div>
              <div className="season-stat-item">
                <span className="stat-num">{cleanGoals}</span>
                <span className="stat-text">
                  {current.position === 'حراس' ? 'شباك نظيفة' : 'أهداف'}
                </span>
              </div>
              <div className="season-stat-item">
                <span className="stat-num">{cleanAssists}</span>
                <span className="stat-text">صناعة</span>
              </div>
              <div className="season-stat-item">
                <span className="stat-num">{cleanYellowCards}</span>
                <span className="stat-text">بطاقات صفراء</span>
              </div>
            </div>

            {/* تقييم الأداء */}
            <div className="performance-rating">
              <span className="rating-label">تقييم الأداء</span>
              <div className="rating-score">
                <span className="score-num">{cleanRating}</span>
              </div>
            </div>
          </div>
        )}

        {activeTab==='matches'&&<div className="stats-container"><h3 className="section-title">سجل مشاركات اللاعب</h3><p className="bg-[#121c2e] p-4 rounded-2xl text-sm whitespace-pre-line">{current.gameLog||'لم يُضف سجل المشاركات بعد.'}</p></div>}

        {activeTab === 'info' && (
          <div className="stats-container">
            <div className="section-title">السيرة والمسيرة الرياضية</div>
            <div className="bg-[#121c2e] p-4 rounded-2xl border border-white/5 text-xs text-[#8c96aa] space-y-3 leading-relaxed">
              <p>
                {current.biography||'لم تُضف السيرة بعد.'}
              </p>
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/5 text-white">
                <div>
                  <span className="text-[10px] text-[#8c96aa] block">القدم المفضلة</span>
                  <span className="font-bold">{current.foot||'—'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#8c96aa] block">العقد حتى</span>
                  <span className="font-bold">{current.contractUntil||'—'}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
