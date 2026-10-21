import React, { useState } from 'react';
import { ArrowRight, Menu } from 'lucide-react';
import { ClubMatchCard } from './ClubMatchCard';
import { useContent } from '../backend/useContent';
import initialContent from '../data/initialContent.json';
import type { Match } from '../data/clubData';
interface MatchesTabProps { onOpenTickets: (match: Match) => void; onBack?: () => void; onOpenMenu?: () => void; }
export const MatchesTab: React.FC<MatchesTabProps> = ({ onOpenTickets, onBack, onOpenMenu }) => {
  const [tab, setTab] = useState<'upcoming' | 'past' | 'standings'>('upcoming');
  const standings = useContent<{ id: string; title: string; p: number; w: number; d: number; l: number; pts: number }>('standings', initialContent.standings);
  const matches = useContent<Match>('matches', initialContent.matches as Match[]);
  const filtered = matches.filter(m => tab === 'past' ? m.status === 'finished' : m.status !== 'finished');
  return <div id="matches-screen" className="screen active min-h-0">
    <header className="screen-header">
      <button type="button" aria-label="رجوع" onClick={onBack} className="back-icon"><ArrowRight size={18} /></button>
      <h1 className="header-title">المباريات</h1>
      <button type="button" aria-label="القائمة" onClick={onOpenMenu} className="menu-icon"><Menu size={18} /></button>
    </header>
    <div className="matches-tabs" role="tablist" aria-label="تصنيف المباريات">
      {([{id:'upcoming',label:'القادمة والمباشرة'},{id:'past',label:'السابقة'},{id:'standings',label:'جدول البطولات'}] as const).map(item =>
        <button key={item.id} type="button" role="tab" aria-selected={tab === item.id} className={`match-tab-btn ${tab === item.id ? 'active' : ''}`} onClick={() => setTab(item.id)}>{item.label}</button>
      )}
    </div>
    <div className="matches-content min-h-0">
      {tab === 'standings' ? <div className="match-card overflow-x-auto">
        <table className="w-full text-xs text-center">
          <thead><tr>{['الفريق','لعب','فاز','تعادل','خسر','نقاط'].map(t => <th key={t} className="p-2 text-[#d4af37]">{t}</th>)}</tr></thead>
          <tbody>{[...standings].sort((a,b) => b.pts-a.pts).map(row => <tr key={row.id} className="border-t border-white/10"><td className="p-3 text-right">{row.title}</td><td>{row.p}</td><td>{row.w}</td><td>{row.d}</td><td>{row.l}</td><td className="font-bold text-[#d4af37]">{row.pts}</td></tr>)}</tbody>
        </table>
      </div> : filtered.map(match => <ClubMatchCard key={match.id} match={match} onTickets={onOpenTickets} />)}
      {tab !== 'standings' && !filtered.length && <p className="match-card text-center text-sm text-[#a3aec2]">لا توجد مباريات في هذا القسم حاليًا</p>}
    </div>
  </div>;
};
