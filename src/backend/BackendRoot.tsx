import React from 'react';
import { ConvexReactClient } from 'convex/react';
import { CustomerAuthProvider } from './CustomerAuth';

const url = import.meta.env.VITE_CONVEX_URL;
const client = url ? new ConvexReactClient(url) : null;

export function BackendRoot({ children }: { children: React.ReactNode }) {
  if (!client) return <main dir="rtl" style={{minHeight:'100dvh',display:'grid',placeItems:'center',background:'#070d1a',color:'#fff',padding:24}}>
    <div style={{textAlign:'center'}}><h1>نادي الرجاء العراقي</h1><p>نجهّز الخدمات الآن. يرجى العودة لاحقًا.</p></div>
  </main>;
  return <CustomerAuthProvider client={client}>{children}</CustomerAuthProvider>;
}
