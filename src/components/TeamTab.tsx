import initialContent from '../data/initialContent.json';
import { useContent } from '../backend/useContent';
import React, { useState } from 'react';
import { LionLogo } from './LionLogo';

export interface Player {
  id: string;
  name: string;
  number: number;
  position: 'حراس' | 'دفاع' | 'وسط' | 'هجوم';
  posName: string;
  imgUrl: string;
  nationality: string;
  age: number;
  matches: number;
  goals?: number;
  assists?: number;
  cleanSheets?: number;
  height: string;
  weight?: string;
  yellowCards?: number;
  rating?: number | string;
}

interface TeamTabProps {
  onBack?: () => void;
  onOpenMenu?: () => void;
  onSelectPlayer?: (player: Player) => void;
}

export const TeamTab: React.FC<TeamTabProps> = ({ onBack, onOpenMenu, onSelectPlayer }) => {
  const [mainTab, setMainTab] = useState<'formation' | 'players' | 'staff' | 'management'>('players');
  const [subFilter, setSubFilter] = useState<'كل اللاعبين' | 'حراس' | 'دفاع' | 'وسط' | 'هجوم'>('كل اللاعبين');
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  // Exact players from Template 6 specification + extended squad
  const playersData: Player[] = useContent<Player>('players', initialContent.players as Player[]);

  // Filtering players by position
  const filteredPlayers = playersData.filter((player) => {
    if (subFilter === 'كل اللاعبين') return true;
    return player.position === subFilter;
  });

  // Technical Staff
  const technicalStaff = [
    { title: 'المدير الفني', name: 'غوران توميتش', nationality: 'كرواتيا', experience: '15 سنة' },
    { title: 'مساعد المدرب', name: 'كريم البصري', nationality: 'العراق', experience: '10 سنوات' },
    { title: 'مدرب الحراس', name: 'ماركو بيريز', nationality: 'إسبانيا', experience: '12 سنة' },
    { title: 'المعد البدني', name: 'جيروم ديبوا', nationality: 'فرنسا', experience: '8 سنوات' },
    { title: 'طبيب الفريق', name: 'د. حسام السعدي', nationality: 'العراق', experience: '14 سنة' },
  ];

  // Board Management
  const boardManagement = [
    { role: 'رئيس مجلس الإدارة', name: 'الشيخ ذياب بن زايد آل نهيان' },
    { role: 'نائب الرئيس', name: 'سعادة راشد الزعابي' },
    { role: 'المدير التنفيذي للشركة الرياضية', name: 'خالد السركال' },
    { role: 'مدير شؤون الاحتراف', name: 'فهد مسعود' },
    { role: 'المشرف العام على الفريق', name: 'عبدالباسط محمد' },
  ];

  return (
    <div id="players-screen" className="screen active fade-in-screen">
      {/* الترويسة العلوية */}
      <div className="screen-header">
        <i
          className="fa-solid fa-chevron-right back-icon"
          onClick={onBack}
          title="رجوع"
        ></i>
        <h2 className="header-title">الفريق الأول</h2>
        <i
          className="fa-solid fa-bars menu-icon"
          onClick={onOpenMenu}
          title="القائمة"
        ></i>
      </div>

      {/* شريط التبويبات الرئيسي */}
      <div className="main-tabs">
        <button
          className={`main-tab-btn ${mainTab === 'formation' ? 'active' : ''}`}
          onClick={() => setMainTab('formation')}
        >
          التشكيلة
        </button>
        <button
          className={`main-tab-btn ${mainTab === 'players' ? 'active' : ''}`}
          onClick={() => setMainTab('players')}
        >
          اللاعبين
        </button>
        <button
          className={`main-tab-btn ${mainTab === 'staff' ? 'active' : ''}`}
          onClick={() => setMainTab('staff')}
        >
          الجهاز الفني
        </button>
        <button
          className={`main-tab-btn ${mainTab === 'management' ? 'active' : ''}`}
          onClick={() => setMainTab('management')}
        >
          الإدارة
        </button>
      </div>

      {/* Main Tab 1: Players (الكليشة 6) */}
      {mainTab === 'players' && (
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* شريط التصنيفات (المراكز) */}
          <div className="sub-filters">
            <span
              className={`filter-item ${subFilter === 'كل اللاعبين' ? 'active' : ''}`}
              onClick={() => setSubFilter('كل اللاعبين')}
            >
              كل اللاعبين
            </span>
            <span
              className={`filter-item ${subFilter === 'حراس' ? 'active' : ''}`}
              onClick={() => setSubFilter('حراس')}
            >
              حراس
            </span>
            <span
              className={`filter-item ${subFilter === 'دفاع' ? 'active' : ''}`}
              onClick={() => setSubFilter('دفاع')}
            >
              دفاع
            </span>
            <span
              className={`filter-item ${subFilter === 'وسط' ? 'active' : ''}`}
              onClick={() => setSubFilter('وسط')}
            >
              وسط
            </span>
            <span
              className={`filter-item ${subFilter === 'هجوم' ? 'active' : ''}`}
              onClick={() => setSubFilter('هجوم')}
            >
              هجوم
            </span>
          </div>

          {/* شبكة اللاعبين */}
          <div className="players-grid">
            {filteredPlayers.map((player) => (
              <div
                key={player.id}
                className="player-card group"
                onClick={() => {
                  if (onSelectPlayer) {
                    onSelectPlayer(player);
                  } else {
                    setSelectedPlayer(player);
                  }
                }}
              >
                <img
                  src={player.imgUrl}
                  alt={player.name}
                  className="player-img group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                  onError={(e) => {
                    // Fallback to elegant placeholder with club badge
                    const target = e.target as HTMLImageElement;
                    target.src = `https://via.placeholder.com/80x100/121c2e/ffffff?text=${encodeURIComponent(player.name.split(' ')[0])}`;
                  }}
                />
                <div className="player-info">
                  <span className="player-number">{player.number}</span>
                  <div className="player-name-pos">
                    <span className="player-name">{player.name}</span>
                    <span className="player-pos">{player.posName}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Tab 2: Formation (التشكيلة التكتيكية على أرض الملعب) */}
      {mainTab === 'formation' && (
        <div className="flex-1 overflow-y-auto p-4 pb-24 fade-in-screen">
          <div className="bg-[#121c2e] border border-white/5 rounded-2xl p-4 text-center mb-4">
            <span className="text-xs text-[#8c96aa] font-semibold">الخطة التكتيكية المعتمدة</span>
            <h3 className="text-xl font-black text-white mt-1">4 - 3 - 3 هجومية</h3>
            <p className="text-xs text-[#e30613] font-bold mt-0.5">تشكيلة لقاء الجمعة ضد نادي الشاوي</p>
          </div>

          {/* Pitch canvas visual */}
          <div className="relative w-full aspect-[3/4] bg-emerald-900/60 border-2 border-white/30 rounded-2xl overflow-hidden p-3 shadow-inner flex flex-col justify-between">
            {/* Pitch markings */}
            <div className="absolute inset-x-0 top-1/2 h-[1px] bg-white/20 -translate-y-1/2" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 border border-white/20 rounded-full" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-16 border-b border-x border-white/20 rounded-b-lg" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-36 h-16 border-t border-x border-white/20 rounded-t-lg" />

            {/* Attackers (3) */}
            <div className="flex justify-around items-center pt-2 z-10">
              <div className="flex flex-col items-center">
                <span className="w-8 h-8 rounded-full bg-[#e30613] text-white font-extrabold text-xs flex items-center justify-center border-2 border-white shadow">
                  10
                </span>
                <span className="text-[10px] text-white font-bold bg-black/60 px-1.5 py-0.5 rounded mt-1">
                  منتظر رحيم
                </span>
              </div>
              <div className="flex flex-col items-center">
                <span className="w-8 h-8 rounded-full bg-[#e30613] text-white font-extrabold text-xs flex items-center justify-center border-2 border-white shadow">
                  70
                </span>
                <span className="text-[10px] text-white font-bold bg-black/60 px-1.5 py-0.5 rounded mt-1">
                  عمر خربين
                </span>
              </div>
              <div className="flex flex-col items-center">
                <span className="w-8 h-8 rounded-full bg-[#e30613] text-white font-extrabold text-xs flex items-center justify-center border-2 border-white shadow">
                  11
                </span>
                <span className="text-[10px] text-white font-bold bg-black/60 px-1.5 py-0.5 rounded mt-1">
                  سيباستيان
                </span>
              </div>
            </div>

            {/* Midfielders (3) */}
            <div className="flex justify-around items-center z-10 my-auto">
              <div className="flex flex-col items-center">
                <span className="w-8 h-8 rounded-full bg-[#121c2e] text-white font-extrabold text-xs flex items-center justify-center border-2 border-white shadow">
                  7
                </span>
                <span className="text-[10px] text-white font-bold bg-black/60 px-1.5 py-0.5 rounded mt-1">
                  عبدالله حبيب
                </span>
              </div>
              <div className="flex flex-col items-center">
                <span className="w-8 h-8 rounded-full bg-[#121c2e] text-white font-extrabold text-xs flex items-center justify-center border-2 border-white shadow">
                  88
                </span>
                <span className="text-[10px] text-white font-bold bg-black/60 px-1.5 py-0.5 rounded mt-1">
                  أحمد نور الله
                </span>
              </div>
              <div className="flex flex-col items-center">
                <span className="w-8 h-8 rounded-full bg-[#121c2e] text-white font-extrabold text-xs flex items-center justify-center border-2 border-white shadow">
                  8
                </span>
                <span className="text-[10px] text-white font-bold bg-black/60 px-1.5 py-0.5 rounded mt-1">
                  أمير علي
                </span>
              </div>
            </div>

            {/* Defenders (4) */}
            <div className="flex justify-around items-center z-10">
              <div className="flex flex-col items-center">
                <span className="w-8 h-8 rounded-full bg-[#121c2e] text-white font-extrabold text-xs flex items-center justify-center border-2 border-white shadow">
                  2
                </span>
                <span className="text-[9px] text-white font-bold bg-black/60 px-1 py-0.5 rounded mt-1">
                  أحمد ماجد
                </span>
              </div>
              <div className="flex flex-col items-center">
                <span className="w-8 h-8 rounded-full bg-[#121c2e] text-white font-extrabold text-xs flex items-center justify-center border-2 border-white shadow">
                  4
                </span>
                <span className="text-[9px] text-white font-bold bg-black/60 px-1 py-0.5 rounded mt-1">
                  علي
                </span>
              </div>
              <div className="flex flex-col items-center">
                <span className="w-8 h-8 rounded-full bg-[#121c2e] text-white font-extrabold text-xs flex items-center justify-center border-2 border-white shadow">
                  5
                </span>
                <span className="text-[9px] text-white font-bold bg-black/60 px-1 py-0.5 rounded mt-1">
                  عباس
                </span>
              </div>
              <div className="flex flex-col items-center">
                <span className="w-8 h-8 rounded-full bg-[#121c2e] text-white font-extrabold text-xs flex items-center justify-center border-2 border-white shadow">
                  12
                </span>
                <span className="text-[9px] text-white font-bold bg-black/60 px-1 py-0.5 rounded mt-1">
                  سجاد
                </span>
              </div>
            </div>

            {/* Goalkeeper (1) */}
            <div className="flex justify-center items-center pb-2 z-10">
              <div className="flex flex-col items-center">
                <span className="w-8 h-8 rounded-full bg-[#d4af37] text-black font-extrabold text-xs flex items-center justify-center border-2 border-white shadow">
                  1
                </span>
                <span className="text-[10px] text-white font-bold bg-black/60 px-1.5 py-0.5 rounded mt-1">
                  موسى إياد (GK)
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Tab 3: Technical Staff */}
      {mainTab === 'staff' && (
        <div className="flex-1 overflow-y-auto p-4 pb-24 space-y-3 fade-in-screen">
          <div className="text-right mb-2">
            <h3 className="font-extrabold text-base text-white">الجهاز الفني والإداري</h3>
            <p className="text-xs text-[#8c96aa]">الكادر التدريبي لقيادة نادي الرجاء العراقي 2025 - 2026</p>
          </div>

          {technicalStaff.map((staff, i) => (
            <div
              key={i}
              className="bg-[#121c2e] border border-white/5 rounded-2xl p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-[#e30613]/20 border border-[#e30613]/40 flex items-center justify-center text-white font-bold text-sm">
                  {staff.name.slice(0, 1)}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">{staff.name}</h4>
                  <p className="text-xs text-[#e30613] font-semibold">{staff.title}</p>
                </div>
              </div>
              <div className="text-left text-xs text-[#8c96aa]">
                <div>{staff.nationality}</div>
                <div className="text-[10px] text-[#8c96aa]/80">{staff.experience}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Main Tab 4: Management */}
      {mainTab === 'management' && (
        <div className="flex-1 overflow-y-auto p-4 pb-24 space-y-3 fade-in-screen">
          <div className="text-right mb-2">
            <h3 className="font-extrabold text-base text-white">مجلس الإدارة</h3>
            <p className="text-xs text-[#8c96aa]">قيادة نادي الرجاء العراقي الرياضي</p>
          </div>

          {boardManagement.map((leader, i) => (
            <div
              key={i}
              className="bg-[#121c2e] border border-white/5 rounded-2xl p-4 flex items-center gap-3.5"
            >
              <div className="w-10 h-10 rounded-xl bg-[#d4af37]/20 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37]">
                <i className="fa-solid fa-crown text-sm"></i>
              </div>
              <div>
                <span className="text-[11px] text-[#8c96aa] block font-semibold">{leader.role}</span>
                <h4 className="font-bold text-sm text-white mt-0.5">{leader.name}</h4>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Player Detail Modal */}
      {selectedPlayer && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#121c2e] border border-white/10 rounded-3xl p-5 max-w-xs w-full text-right relative overflow-hidden">
            <button
              onClick={() => setSelectedPlayer(null)}
              className="absolute top-4 left-4 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 cursor-pointer"
            >
              <i className="fa-solid fa-xmark text-sm"></i>
            </button>

            <div className="flex items-center gap-3 mb-4">
              <img
                src={selectedPlayer.imgUrl}
                alt={selectedPlayer.name}
                className="w-16 h-20 rounded-2xl object-cover border border-white/10"
              />
              <div>
                <span className="text-xs font-bold text-[#e30613] bg-[#e30613]/10 px-2 py-0.5 rounded-full">
                  #{selectedPlayer.number} {selectedPlayer.posName}
                </span>
                <h3 className="text-lg font-black text-white mt-1">{selectedPlayer.name}</h3>
                <p className="text-xs text-[#8c96aa]">{selectedPlayer.nationality}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-center my-4">
              <div className="bg-[#070d1a] p-2.5 rounded-xl border border-white/5">
                <span className="text-[10px] text-[#8c96aa] block">المشاركات</span>
                <span className="text-base font-black text-white font-mono">{selectedPlayer.matches}</span>
              </div>
              <div className="bg-[#070d1a] p-2.5 rounded-xl border border-white/5">
                <span className="text-[10px] text-[#8c96aa] block">
                  {selectedPlayer.position === 'حراس' ? 'شباك نظيفة' : 'الأهداف'}
                </span>
                <span className="text-base font-black text-[#e30613] font-mono">
                  {selectedPlayer.position === 'حراس'
                    ? selectedPlayer.cleanSheets || 0
                    : selectedPlayer.goals || 0}
                </span>
              </div>
              <div className="bg-[#070d1a] p-2.5 rounded-xl border border-white/5">
                <span className="text-[10px] text-[#8c96aa] block">العمر</span>
                <span className="text-sm font-black text-white font-mono">{selectedPlayer.age} سنة</span>
              </div>
              <div className="bg-[#070d1a] p-2.5 rounded-xl border border-white/5">
                <span className="text-[10px] text-[#8c96aa] block">الطول</span>
                <span className="text-sm font-black text-white font-mono">{selectedPlayer.height}</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedPlayer(null)}
              className="w-full bg-[#e30613] hover:bg-[#c40510] text-white py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              إغلاق
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
