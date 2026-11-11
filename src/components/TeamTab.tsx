import {useClubSettings} from '../backend/useClubSettings';
type ClubPerson={id:string;name:string;role:string;scope?:string;nationality?:string;experience?:string;imgUrl?:string};
import { useContent } from '../backend/useContent';
import {usePlayerCategories} from '../backend/usePlayerCategories';
import React, { useState } from 'react';
import { LionLogo } from './LionLogo';

export interface Player {
  specialSkill?:string;
  id: string;
  teamCategory?:string;
  birthYear?:number;
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
  const categories=usePlayerCategories();
  const [categoryFilter,setCategoryFilter]=useState('all');
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  // Exact players from Template 6 specification + extended squad
  const settings=useClubSettings();
  const playersData: Player[] = useContent<Player>('players');

  // Filtering players by position
  const filteredPlayers = playersData.filter((player) => {
    if(categoryFilter!=='all'&&(player.teamCategory??'first')!==categoryFilter)return false;
    if (subFilter === 'كل اللاعبين') return true;
    return player.position === subFilter;
  });

  // Technical Staff
  const technicalStaff = useContent<ClubPerson>('staff').filter(p=>p.scope!=='academy');

  // Board Management
  const boardManagement = useContent<ClubPerson>('management');

  return (
    <div id="players-screen" className="screen active fade-in-screen">
      {/* الترويسة العلوية */}
      <div className="screen-header">
        <i
          className="fa-solid fa-chevron-right back-icon"
          onClick={onBack}
          title="رجوع"
        ></i>
        <h2 className="header-title">فرق النادي واللاعبون</h2>
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
          <nav className="sub-filters player-category-filters" aria-label="فئات اللاعبين">
            <button className={'filter-item '+(categoryFilter==='all'?'active':'')} aria-pressed={categoryFilter==='all'} onClick={()=>setCategoryFilter('all')}>كل الفئات</button>
            {categories.map(c=><button key={c.slug} className={'filter-item '+(categoryFilter===c.slug?'active':'')} aria-pressed={categoryFilter===c.slug} onClick={()=>setCategoryFilter(c.slug)}>{c.title}</button>)}
          </nav>
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
            {filteredPlayers.length===0&&<p className="text-center text-sm text-[#8c96aa] p-6 col-span-2">لا يوجد لاعبون في هذه الفئة حاليًا.</p>}
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
                    <span className="player-pos">{player.posName||player.position} · {categories.find(c=>c.slug===(player.teamCategory??'first'))?.title??'الفريق الأول'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {mainTab==='formation'&&<div className="flex-1 overflow-y-auto p-4 pb-24"><h3 className="text-center font-bold mb-4">{settings?.formation||'التشكيلة الأساسية'}</h3><div className="rounded-3xl border border-white/20 bg-emerald-950 p-5 space-y-10 min-h-96">{['هجوم','وسط','دفاع','حراس'].map(position=><div key={position} className="flex justify-around gap-2">{playersData.filter((p:any)=>p.starting==='yes'&&p.position===position).map(p=><button key={p.id} onClick={()=>{if(onSelectPlayer)onSelectPlayer(p);else setSelectedPlayer(p);}} className="flex flex-col items-center text-xs"><span className="rounded-full bg-[#e30613] w-9 h-9 grid place-items-center font-bold">{p.number}</span><span>{p.name}</span></button>)}</div>)}</div>{!playersData.some((p:any)=>p.starting==='yes')&&<p className="text-center text-sm p-4 text-[#8c96aa]">لم تُعلن التشكيلة بعد.</p>}</div>}

      {/* Main Tab 3: Technical Staff */}
      {mainTab === 'staff' && (
        <div className="flex-1 overflow-y-auto p-4 pb-24 space-y-3 fade-in-screen">
          <div className="text-right mb-2">
            <h3 className="font-extrabold text-base text-white">الجهاز الفني والإداري</h3>
            <p className="text-xs text-[#8c96aa]">الكادر التدريبي لقيادة النادي</p>
          </div>

          {!technicalStaff.length&&<p className="text-center text-sm text-[#8c96aa]">لا يوجد كادر منشور حاليًا.</p>}
          {technicalStaff.map((staff) => (
            <div
              key={staff.id}
              className="bg-[#121c2e] border border-white/5 rounded-2xl p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-[#e30613]/20 border border-[#e30613]/40 flex items-center justify-center text-white font-bold text-sm">
                  {staff.imgUrl ? <img src={staff.imgUrl} alt={staff.name} className="w-full h-full rounded-full object-cover"/> : staff.name.slice(0, 1)}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">{staff.name}</h4>
                  <p className="text-xs text-[#e30613] font-semibold">{staff.role}</p>
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

          {!boardManagement.length&&<p className="text-center text-sm text-[#8c96aa]">لا يوجد أعضاء منشورون حاليًا.</p>}
          {boardManagement.map((leader) => (
            <div
              key={leader.id}
              className="bg-[#121c2e] border border-white/5 rounded-2xl p-4 flex items-center gap-3.5"
            >
              <div className="w-10 h-10 rounded-xl bg-[#d4af37]/20 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37]">
                {leader.imgUrl ? <img src={leader.imgUrl} alt={leader.name} className="w-full h-full rounded-xl object-cover"/> : <i className="fa-solid fa-crown text-sm"></i>}
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
