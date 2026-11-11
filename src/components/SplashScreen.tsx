import {ClubName} from './ClubName';
import React from 'react';
import { LionLogo } from './LionLogo';
import { ArrowLeft, Sparkles } from 'lucide-react';

interface SplashScreenProps {
  onStart: () => void;
  onExploreGuest?: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onStart, onExploreGuest }) => {
  return (
    <div
      id="splash-screen"
      className="w-full h-full flex flex-col justify-between items-center px-6 pt-12 pb-8 text-center relative overflow-hidden select-none"
      style={{
        backgroundImage: 'radial-gradient(circle at center 30%, #17274a 0%, #070d1a 65%)',
      }}
    >
      {/* Decorative ambient background elements */}
      <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-[#e30613]/10 to-transparent pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#e30613]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 -left-20 w-56 h-56 bg-[#1a2d54]/40 rounded-full blur-2xl pointer-events-none" />

      {/* Top Club Badge Pill */}
      <div className="z-10 flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-xs font-semibold text-[#8c96aa]">
        <span className="w-2 h-2 rounded-full bg-[#e30613] animate-pulse"></span>
        <span>التطبيق الرسمي · نادي الرجاء العراقي</span>
      </div>

      {/* Center Logo Section with Glow */}
      <div className="flex flex-col items-center justify-center my-auto z-10 w-full">
        {/* Glow container behind lion crest */}
        <div className="relative w-48 h-48 flex items-center justify-center">
          {/* Intense red glow filter */}
          <div
            className="absolute w-36 h-36 rounded-full bg-[#e30613]/40 blur-[45px] z-0 animate-pulse"
            style={{ animationDuration: '3s' }}
          />
          <div className="absolute w-28 h-28 rounded-full bg-[#d4af37]/20 blur-[30px] z-0" />
          
          {/* The Club Crest */}
          <div className="relative z-10 transform transition-transform duration-500 hover:scale-105">
            <LionLogo size={145} />
          </div>
        </div>

        {/* Club Brand Title */}
        <h1 className="text-3xl font-black text-white mt-5 tracking-wide drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
          <ClubName/>
        </h1>
      </div>

      {/* Bottom Text and Actions */}
      <div className="w-full z-10 flex flex-col items-center">
        {/* Primary CTA: "ابدأ الآن" */}
        <button
          onClick={onStart}
          id="btn-start"
          className="w-full max-w-xs bg-[#e30613] hover:bg-[#c40510] text-white py-4 px-6 rounded-full font-bold text-lg cursor-pointer transition-all duration-200 active:scale-95 shadow-[0_4px_20px_rgba(227,6,19,0.45)] hover:shadow-[0_6px_25px_rgba(227,6,19,0.6)] flex items-center justify-center gap-3 group"
        >
          <span>ابدأ الآن</span>
          <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
        </button>

        {/* Guest direct preview shortcut */}
        {onExploreGuest && (
          <button
            onClick={onExploreGuest}
            className="mt-3 text-xs text-[#8c96aa] hover:text-white transition-colors py-2 px-4 font-medium flex items-center gap-1"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>تصفح كزائر بدون تسجيل</span>
          </button>
        )}
      </div>
    </div>
  );
};
