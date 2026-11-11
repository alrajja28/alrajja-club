import {useClubSettings} from '../backend/useClubSettings';
import React, { useState, useEffect } from 'react';
import { X, Volume2, VolumeX, Music, Heart } from 'lucide-react';
import { CLUB_ANTHEM_LYRICS } from '../data/clubData';
import { LionLogo } from './LionLogo';

interface AnthemModalProps {
  onClose: () => void;
}

export const AnthemModal: React.FC<AnthemModalProps> = ({ onClose }) => {
  const settings=useClubSettings();
  const lyrics=String(settings?.anthem??'').split('\n').filter(Boolean);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentLine, setCurrentLine] = useState(0);
  const [likes, setLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);

  // Synthesized cheering rhythm/chant simulation
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentLine((prev) => (prev + 1) % Math.max(1,lyrics.length));
    }, 3200);
    return () => clearInterval(interval);
  }, [isPlaying,lyrics.length]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-[#070d1a] border border-[#e30613]/30 rounded-3xl p-6 text-white relative overflow-hidden shadow-[0_10px_35px_rgba(227,6,19,0.3)]">
        {/* Glow */}
        <div className="absolute -top-16 -right-16 w-44 h-44 bg-[#e30613]/25 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 relative z-10">
          <div className="flex items-center gap-2">
            <Music className="w-5 h-5 text-[#e30613]" />
            <h3 className="font-extrabold text-sm text-white">نشيد نادي الرجاء العراقي الرسمي</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-[#8c96aa] hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Vinyl / Emblem Player Animation */}
        <div className="py-6 flex flex-col items-center justify-center relative z-10">
          <div className={`relative flex items-center justify-center w-36 h-36 rounded-full bg-[#121c2e] border-2 border-[#e30613]/50 ${isPlaying ? 'animate-[spin_12s_linear_infinite]' : ''}`}>
            <LionLogo size={80} />
          </div>

          {/* Sound waves graphic */}
          <div className="flex items-center gap-1 mt-5 h-8">
            {[40, 70, 100, 60, 90, 45, 80, 50, 95, 30].map((h, i) => (
              <div
                key={i}
                className="w-1 bg-[#e30613] rounded-full transition-all duration-300"
                style={{
                  height: isPlaying ? `${h}%` : '20%',
                  opacity: isPlaying ? 0.9 : 0.3,
                }}
              />
            ))}
          </div>
        </div>

        {/* Chanting Lyrics Box */}
        <div className="bg-[#121c2e]/90 border border-white/5 rounded-2xl p-4 text-center my-3 relative z-10 min-h-[90px] flex flex-col justify-center">
          <span className="text-[10px] text-[#d4af37] font-bold block mb-1">
            أهازيج جماهير أصحاب السعادة
          </span>
          <p className="text-base font-black text-white transition-all duration-300 transform scale-105">
            "{lyrics[currentLine%Math.max(1,lyrics.length)]||'لم تُضف كلمات النشيد بعد'}"
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between pt-2 relative z-10">
          <button
            onClick={() => {
              setHasLiked(!hasLiked);
              setLikes(hasLiked ? likes - 1 : likes + 1);
            }}
            className="flex items-center gap-1.5 text-xs text-[#8c96aa] hover:text-[#e30613] transition-colors"
          >
            <Heart className={`w-4 h-4 ${hasLiked ? 'fill-[#e30613] text-[#e30613]' : ''}`} />
            <span className="font-mono">{likes}</span>
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="bg-[#e30613] hover:bg-[#c40510] text-white px-5 py-2.5 rounded-full text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md"
          >
            {isPlaying ? (
              <>
                <Volume2 className="w-4 h-4" />
                <span>إيقاف مؤقت</span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4" />
                <span>تشغيل النشيد</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
