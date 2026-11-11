import {useEffect,useRef,useState,useSyncExternalStore} from 'react';
import {Download,Check,Smartphone,X} from 'lucide-react';
import {LionLogo} from './LionLogo';
import {useClubSettings} from '../backend/useClubSettings';
import {installPromptStore} from '../pwa/installPromptStore';
import {requestWebInstall} from '../pwa/requestInstall';
function isInstalled(){return window.matchMedia('(display-mode: standalone)').matches||(navigator as Navigator&{standalone?:boolean}).standalone===true;}
function wasDismissed(){try{return sessionStorage.getItem('club-install-dismissed')==='1'}catch{return false}}
const subscribe=installPromptStore?.subscribe??(()=>()=>{});
const snapshot=installPromptStore?.getSnapshot??(()=>null);
export function InstallPrompt(){
 const settings=useClubSettings();
 const event=useSyncExternalStore(subscribe,snapshot,()=>null);
 const [installed,setInstalled]=useState(isInstalled),[open,setOpen]=useState(()=>!wasDismissed());
 const [help,setHelp]=useState(false),[busy,setBusy]=useState(false),[status,setStatus]=useState('');
 const operation=useRef(0),pending=useRef(false);
 const ios=/iphone|ipad|ipod/i.test(navigator.userAgent)||(/Macintosh/.test(navigator.userAgent)&&navigator.maxTouchPoints>1);
 const android=/android/i.test(navigator.userAgent);
 useEffect(()=>{
  const display=window.matchMedia('(display-mode: standalone)');
  const done=()=>{operation.current++;pending.current=false;setBusy(false);setInstalled(true);setOpen(false)};
  const changed=()=>{if(isInstalled())done()};
  window.addEventListener('appinstalled',done);display.addEventListener('change',changed);
  if('serviceWorker' in navigator)navigator.serviceWorker.register(import.meta.env.BASE_URL+'sw.js',{scope:import.meta.env.BASE_URL,updateViaCache:'none'}).catch(()=>{});
  return()=>{operation.current++;window.removeEventListener('appinstalled',done);display.removeEventListener('change',changed)};
 },[]);
 function dismiss(){operation.current++;pending.current=false;setBusy(false);setOpen(false);try{sessionStorage.setItem('club-install-dismissed','1')}catch{}}
 async function install(){
  if(pending.current)return;
  const prompt=installPromptStore?.consume();
  if(!prompt){setStatus('التثبيت المباشر غير متاح من الزر الآن. تقدر تثبّت التطبيق من قائمة المتصفح.');setHelp(true);return}
  pending.current=true;const current=++operation.current;setBusy(true);setStatus('أكمل التأكيد من نافذة التثبيت التي يعرضها المتصفح.');
  const result=await requestWebInstall(prompt);
  if(current!==operation.current)return;
  pending.current=false;setBusy(false);
  if(result==='accepted')setStatus('تمت الموافقة على طلب التثبيت. المتصفح يكمل تثبيت التطبيق؛ راجع الشاشة الرئيسية.');
  else {setStatus(result==='dismissed'?'تم إلغاء نافذة التثبيت. تقدر تثبّت التطبيق لاحقًا من قائمة المتصفح.':'ما وصل رد من المتصفح. زر التثبيت تحرر؛ استخدم الخطوات أدناه لإكمال التثبيت.');setHelp(true)}
 }
 if(installed)return null;
 return <>{!open&&<button type="button" onClick={()=>setOpen(true)} className="fixed top-20 left-3 z-[180] bg-[#d4af37] text-black rounded-full px-3 py-2 text-xs font-bold shadow-xl flex items-center gap-2"><Download size={16}/>تثبيت التطبيق</button>}{open&&<div className="fixed inset-0 z-[500] bg-black/75 backdrop-blur-md flex items-center justify-center p-5" dir="rtl"><section role="dialog" aria-modal="true" aria-labelledby="install-title" className="relative w-full max-w-sm max-h-[calc(100dvh-40px)] overflow-y-auto rounded-[2rem] border border-[#d4af37]/40 bg-gradient-to-b from-[#1b2940] to-[#080f1d] p-7 shadow-2xl text-center"><button aria-label="إغلاق نافذة التثبيت" onClick={dismiss} className="absolute top-4 left-4 text-[#a3aec2]"><X size={20}/></button><div className="flex justify-center mb-5"><LionLogo size={95}/></div><span className="text-[#d4af37] text-xs font-bold">ناديك أقرب إلك</span><h2 id="install-title" className="text-xl font-black text-white mt-2">ثبّت تطبيق {settings?.title||'نادي الرجاء العراقي'}</h2><p className="text-[#a3aec2] text-sm leading-7 my-4">تابع الأخبار والمباريات واللاعبين من شاشة جهازك مباشرة.</p><div className="flex justify-center gap-4 text-xs text-[#d4af37] mb-5"><span className="flex gap-1 items-center"><Check size={14}/>بدون متجر</span><span className="flex gap-1 items-center"><Smartphone size={14}/>وصول أسرع</span></div><button type="button" className="w-full rounded-2xl bg-[#e30613] text-white font-bold p-4 flex justify-center gap-2" onClick={()=>void install()} disabled={busy}><Download size={20}/>{busy?'أكمل التثبيت من نافذة المتصفح…':event?'تثبيت تطبيق الويب':android?'تثبيت من قائمة Chrome':'عرض خطوات تثبيت التطبيق'}</button>{status&&<p role="status" aria-live="polite" className="mt-4 text-sm leading-7 text-[#d4af37]">{status}</p>}<button type="button" onClick={()=>setHelp(!help)} aria-expanded={help} className="text-[#a3aec2] text-sm mt-4 underline">{help?'إخفاء الخطوات':'طريقة التثبيت من قائمة المتصفح'}</button>{help&&<div className="mt-4 rounded-xl bg-white/5 p-4 text-right text-sm text-white leading-8"><h3 className="font-bold text-[#d4af37] mb-2">{ios?'التثبيت على iPhone وiPad':android?'التثبيت من Chrome على أندرويد':'التثبيت من المتصفح'}</h3><ol className="list-decimal pr-5 space-y-2">{ios?<><li>افتح الرابط في Safari.</li><li>اضغط مشاركة ثم «إضافة إلى الشاشة الرئيسية».</li><li>اضغط «إضافة» وافتح التطبيق من الشاشة الرئيسية.</li></>:<><li>افتح رابط النادي في {android?'Chrome':'Chrome أو Edge'} مباشرة.</li><li>اضغط قائمة {android?'⋮':'⋮ أو ⋯'} ثم «إضافة إلى الشاشة الرئيسية» أو «تثبيت التطبيق».</li><li>اختر «تثبيت» وأكّد نافذة المتصفح.</li></>}</ol><p className="text-xs text-[#a3aec2] mt-3">إذا الرابط مفتوح داخل واتساب أو فيسبوك، افتحه بالمتصفح أولًا. وإذا التطبيق مثبت، افتحه من الشاشة الرئيسية.</p></div>}<button type="button" onClick={dismiss} className="block mx-auto text-[#a3aec2] text-sm mt-5">أكمل التصفح الآن</button></section></div>}</>;
}
