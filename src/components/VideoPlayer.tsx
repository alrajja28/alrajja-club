import React from 'react';

export function VideoPlayer({ url, title }: { url?: string; title: string }) {
  if (!url) return <div className="aspect-video grid place-items-center bg-black/30 rounded-2xl text-sm text-[#a3aec2]">لا يوجد بث متاح الآن</div>;
  let parsed: URL;
  try { parsed=new URL(url); if(parsed.protocol!=='https:')throw new Error(); }
  catch { return <p role="alert">رابط الفيديو غير صالح</p>; }
  let youtubeId: string | null = null;
  if (['www.youtube.com','youtube.com','m.youtube.com'].includes(parsed.hostname))
    youtubeId=parsed.searchParams.get('v') || parsed.pathname.match(/^\/(?:embed|live|shorts)\/([\w-]{11})/)?.[1] || null;
  if(parsed.hostname==='youtu.be')youtubeId=parsed.pathname.slice(1);
  if(youtubeId && /^[\w-]{11}$/.test(youtubeId)) return <iframe title={title} className="aspect-video w-full rounded-2xl" src={`https://www.youtube-nocookie.com/embed/${youtubeId}`} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" />;
  if (/\.(mp4|webm)(?:$|\?)/i.test(url) || parsed.hostname.endsWith('.convex.cloud') || parsed.hostname.endsWith('.convex.site'))
    return <video aria-label={title} className="aspect-video w-full rounded-2xl bg-black" src={url} controls playsInline preload="metadata" />;
  return <a className="btn-primary block text-center" href={url} target="_blank" rel="noopener noreferrer">فتح {title}</a>;
}
