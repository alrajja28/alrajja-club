import React, { useState } from 'react';
import { useClubAuthActions } from '../backend/CustomerAuth';
import {useQuery} from 'convex/react';
import {clubApi} from '../backend/api';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { LionLogo } from './LionLogo';
interface LoginScreenProps { onBack:()=>void; onLoginSuccess:(userData:{name:string;phone:string;role:string})=>void; onContinueGuest:()=>void; }
export const LoginScreen:React.FC<LoginScreenProps>=({onBack,onContinueGuest})=>{
  const {signIn}=useClubAuthActions(); const [error,setError]=useState(''); const [busy,setBusy]=useState(false);
  const authStatus=useQuery(clubApi.content.authStatus,{});
  async function login(){setBusy(true);setError('');try{await signIn('google',{redirectTo:window.location.origin+import.meta.env.BASE_URL});}catch{setError('تعذر بدء تسجيل الدخول. حاول مرة أخرى.');setBusy(false);}}
  return <div id="login-screen" className="w-full h-full min-h-0 flex flex-col p-6 overflow-y-auto">
    <header className="flex justify-between items-center"><button type="button" aria-label="الرجوع" onClick={onBack} className="w-10 h-10 rounded-full bg-white/5 grid place-items-center"><ArrowRight size={18}/></button><button type="button" onClick={onContinueGuest} className="text-xs text-[#a3aec2]">تخطي كزائر</button></header>
    <div className="my-auto py-10 text-center"><div className="flex justify-center"><LionLogo size={110}/></div><h1 className="text-2xl font-black mt-6">نادي الرجاء العراقي</h1><p className="text-sm text-[#a3aec2] mt-3 leading-relaxed">حساب واحد يجمعك بناديك.<br/>سجّل الدخول أو أنشئ حسابك باستخدام Google.</p>
    <button type="button" onClick={login} disabled={busy||!authStatus?.googleReady} className="mt-8 w-full bg-white text-[#172033] rounded-2xl p-4 font-bold flex gap-3 justify-center items-center disabled:opacity-50"><span aria-hidden="true" className="font-black text-xl text-[#4285f4]">G</span>{busy?'جاري الانتقال…':'المتابعة باستخدام Google'}</button>
    {authStatus&&!authStatus.googleReady&&<p className="mt-4 text-sm text-[#d4af37]">تسجيل Google قيد التجهيز. يمكنك تصفح التطبيق كزائر الآن.</p>}
    {error&&<p role="alert" className="mt-4 text-sm text-red-300">{error}</p>}
    <p className="mt-5 text-xs text-[#a3aec2] flex justify-center items-center gap-2"><ShieldCheck size={15}/>لن نطلب كلمة مرور Google داخل التطبيق.</p></div>
  </div>;
};
