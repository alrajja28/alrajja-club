import React from 'react';
import {Users,Shirt,CalendarDays,Newspaper,GraduationCap,ShoppingBag,Ticket,Tv,Clapperboard,Menu} from 'lucide-react';
import {LionLogo} from './LionLogo';
import {ClubMatchCard} from './ClubMatchCard';
import {useContent} from '../backend/useContent';
import initialContent from '../data/initialContent.json';
import type {Match,NewsItem} from '../data/clubData';
interface HomeTabProps{onOpenTickets:(match?:Match)=>void;onOpenStore:()=>void;onOpenNews?:()=>void;onOpenMedia?:()=>void;onOpenAnthem:()=>void;onOpenProfile:()=>void;onSelectNews:(news:NewsItem)=>void;onNavigateTab:(tab:'matches'|'team'|'community'|'more')=>void;onOpenMenu:()=>void;onOpenLiveStream:()=>void;onOpenAcademy:()=>void;}
export const HomeTab:React.FC<HomeTabProps>=(props)=>{
 const settings=useContent('settings',initialContent.settings)[0];
 const matches=useContent<Match>('matches',initialContent.matches as Match[]);
 const upcoming=matches.find(m=>m.status==='live')||matches.find(m=>m.status==='upcoming');
 const links=[{label:'اللاعبون',icon:Users,action:()=>props.onNavigateTab('team')},{label:'الفريق',icon:Shirt,action:()=>props.onNavigateTab('team')},{label:'المباريات',icon:CalendarDays,action:()=>props.onNavigateTab('matches')},{label:'الأخبار',icon:Newspaper,action:props.onOpenNews},{label:'الأكاديمية',icon:GraduationCap,action:props.onOpenAcademy},{label:'المتجر',icon:ShoppingBag,action:props.onOpenStore},{label:'التذاكر',icon:Ticket,action:()=>props.onOpenTickets(upcoming)},{label:'البث المباشر',icon:Tv,action:props.onOpenLiveStream},{label:'الميديا',icon:Clapperboard,action:props.onOpenMedia}];
 return <div id="home-screen" className="screen active w-full h-full min-h-0 flex flex-col"><header className="home-header"><div className="header-logo-side"><LionLogo size={38}/><div><h3>{settings?.title||'نادي الرجاء العراقي'}</h3><span>التطبيق الرسمي للنادي</span></div></div><button className="header-menu-button" type="button" aria-label="القائمة الجانبية" onClick={props.onOpenMenu}><Menu size={19}/></button></header><div className="home-content min-h-0"><section className="main-banner"><div className="banner-text"><span className="hero-eyebrow">أهلاً بجمهور الرجاء</span><h2>{settings?.title||'الرجاء العراقي'}</h2><p>{settings?.subtitle}</p></div><div className="hero-crest"><LionLogo size={100}/></div></section><h2 className="section-title">كل ما يخص ناديك</h2><div className="quick-links-grid">{links.map(({label,icon:Icon,action})=><button key={label} type="button" className="link-item" onClick={action}><Icon size={23} strokeWidth={1.6}/><span>{label}</span></button>)}</div><h2 className="section-title">المباراة القادمة</h2>{upcoming?<ClubMatchCard match={upcoming} onTickets={props.onOpenTickets}/>:<div className="match-card text-sm text-center text-[#a3aec2]">سيُعلن جدول المباريات قريبًا</div>}</div></div>;
};
