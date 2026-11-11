import {useEffect,useState} from 'react';
import {Download,Check,Smartphone,X} from 'lucide-react';
import {LionLogo} from './LionLogo';
import {useClubSettings} from '../backend/useClubSettings';
type InstallEvent=Event&{prompt:()=>Promise<void>;userChoice:Promise<{outcome:string}>};
function isInstalled(){return window.matchMedia('(display-mode: standalone)').matches||(navigator as Navigator&{standalone?:boolean}).standalone===true;}
function wasDismissed(){try{return sessionStorage.getItem('club-install-dismissed')==='1'}catch{return false}}
export function InstallPrompt(){
 const settings=useClubSettings();const [installed,setInstalled]=useState(isInstalled),[open,setOpen]=useState(()=>!wasDismissed()),[event,setEvent]=useState<InstallEvent|null>(null),[help,setHelp]=useState(false),[busy,setBusy]=useState(false);
 useEffect(()=>{
  const before=(e:Event)=>{e.preventDefault();setEvent(e as InstallEvent)};
  const done=()=>{setInstalled(true);setOpen(false);setEvent(null)};
  window.addEventListener('beforeinstallprompt',before);window.addEventListener('appinstalled',done);
  if('serviceWorker' in navigator)navigator.serviceWorker.register(import.meta.env.BASE_URL+'sw.js',{scope:import.meta.env.BASE_URL}).catch(()=>{});
  return()=>{window.removeEventListener('beforeinstallprompt',before);window.removeEventListener('appinstalled',done)};
 },[]);
 function dismiss(){setOpen(false);try{sessionStorage.setItem('club-install-dismissed','1')}catch{}}
 async function install(){if(!event){setHelp(true);return;}setBusy(true);try{await event.prompt();const choice=await event.userChoice;setEvent(null);if(choice.outcome==='accepted'){dismiss()}else setHelp(true)}catch{setHelp(true)}finally{setBusy(false)}}
 if(installed)return null;
 return <>{!open&&<button type="button" onClick={()=>setOpen(true)} className="fixed top-20 left-3 z-[180] bg-[#d4af37] text-black rounded-full px-3 py-2 text-xs font-bold shadow-xl flex items-center gap-2"><Download size={16}/>تثبيت التطبيق</button>}{open&&<div className="fixed inset-0 z-[500] bg-black/75 backdrop-blur-md flex items-center justify-center p-5" dir="rtl"><section role="dialog" aria-modal="true" aria-labelledby="install-title" className="relative w-full max-w-sm rounded-[2rem] border border-[#d4af37]/40 bg-gradient-to-b from-[#1b2940] to-[#080f1d] p-7 shadow-2xl text-center"><button aria-label="إغلاق نافذة التثبيت" onClick={dismiss} className="absolute top-4 left-4 text-[#a3aec2]"><X size={20}/></button><div className="flex justify-center mb-5"><LionLogo size={95}/></div><span className="text-[#d4af37] text-xs font-bold">ناديك أقرب إلك</span><h2 id="install-title" className="text-xl font-black text-white mt-2">ثبّت تطبيق {settings?.title||'نادي الرجاء العراقي'}</h2><p className="text-[#a3aec2] text-sm leading-7 my-4">تابع الأخبار والمباريات واللاعبين من شاشة جهازك مباشرة.</p><div className="flex justify-center gap-4 text-xs text-[#d4af37] mb-5"><span className="flex gap-1 items-center"><Check size={14}/>بدون متجر</span><span className="flex gap-1 items-center"><Smartphone size={14}/>وصول أسرع</span></div><button className="w-full rounded-2xl bg-[#e30613] text-white font-bold p-4 flex justify-center gap-2" onClick={()=>void install()} disabled={busy}><Download size={20}/>{busy?'جارٍ فتح التثبيت…':'تثبيت تطبيق الويب'}</button><button onClick={dismiss} className="text-[#a3aec2] text-sm mt-4">أكمل التصفح الآن</button>{help&&<div role="status" className="mt-5 rounded-xl bg-white/5 p-4 text-right text-xs text-white leading-7">{/iphone|ipad|ipod/i.test(navigator.userAgent)?'على iPhone: افتح الموقع في Safari، اضغط مشاركة، ثم «إضافة إلى الشاشة الرئيسية».':'افتح قائمة المتصفح ⋮ أو ⋯ ثم اختر «تثبيت التطبيق» أو «إضافة إلى الشاشة الرئيسية». إذا كنت داخل واتساب افتح الرابط في المتصفح أولًا.'}</div>}</section></div>}</>;
}
