import React from 'react';
import { LionLogo } from './LionLogo';
import { VideoPlayer } from './VideoPlayer';
import { useContent } from '../backend/useContent';
interface LiveStreamModalProps { isOpen: boolean; onClose: () => void; }
export const LiveStreamModal: React.FC<LiveStreamModalProps> = ({isOpen,onClose}) => {
  const streams=useContent<{title:string;url?:string;description?:string}>('stream');
  const stream=streams[0];
  if(!isOpen)return null;
  return <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4 backdrop-blur-sm">
    <section role="dialog" aria-modal="true" aria-labelledby="live-title" className="bg-[#121c2e] border border-white/10 rounded-3xl p-5 max-w-md w-full text-right shadow-2xl">
      <header className="flex items-center justify-between mb-4"><h2 id="live-title" className="font-bold">{stream?.title||'بث نادي الرجاء العراقي'}</h2><button type="button" aria-label="إغلاق البث" onClick={onClose} className="w-10 h-10 rounded-full bg-white/5">✕</button></header>
      <VideoPlayer url={stream?.url} title={stream?.title||'البث'} />
      {stream?.description && <p className="text-sm leading-relaxed mt-4 text-[#a3aec2]">{stream.description}</p>}
      {!stream && <div className="flex justify-center mt-4"><LionLogo size={48}/></div>}
    </section>
  </div>;
};
