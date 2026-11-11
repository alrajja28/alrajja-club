import {useClubSettings} from '../backend/useClubSettings';
import {ClubName} from './ClubName';
import {useSocialLinks} from '../backend/useSocialLinks';
import React from 'react';
import { LionLogo } from './LionLogo';
import { OFFICIAL_SOCIAL_LINKS, openSocialPlatform } from '../utils/socialLinks';

interface SideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  userRole: string;
  onOpenAnthem: () => void;
  onOpenStore: () => void;
  onOpenMedia?: () => void;
  onOpenTickets?: () => void;
  onOpenAcademy?: () => void;
  onOpenProfile: () => void;
  onLogout: () => void;
}

export const SideDrawer: React.FC<SideDrawerProps> = ({
  isOpen,
  onClose,
  userName,
  userRole,
  onOpenAnthem,
  onOpenStore,
  onOpenMedia,
  onOpenTickets,
  onOpenAcademy,
  onOpenProfile,
  onLogout,
}) => {
  const settings=useClubSettings();
  const socialLinks=useSocialLinks();
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex justify-end animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer content */}
      <div className="relative w-72 max-w-[80vw] h-full bg-[#0a1120] border-r border-white/10 flex flex-col justify-between p-5 text-right z-10 shadow-2xl">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-5">
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-[#8c96aa] hover:text-white"
            >
              ✕
            </button>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm text-white"><ClubName/></span>
              <LionLogo size={28} />
            </div>
          </div>

          {/* User profile brief */}
          <div
            onClick={() => {
              onClose();
              onOpenProfile();
            }}
            className="p-3.5 bg-[#121c2e] rounded-2xl border border-white/5 mb-5 flex items-center gap-3 cursor-pointer hover:border-white/20 transition-all"
          >
            <div className="w-11 h-11 rounded-full bg-[#e30613]/20 border border-[#e30613]/40 flex items-center justify-center text-[#e30613] font-bold text-base">
              {userName.charAt(0)}
            </div>
            <div className="flex-1">
              <div className="text-xs font-bold text-white">{userName}</div>
              <div className="text-[10px] text-[#d4af37] font-semibold mt-0.5 flex items-center gap-1">
                <span>{userRole}</span>
                <span>•</span>
                <span>{userRole}</span>
              </div>
            </div>
          </div>

          {/* Quick Menu Links */}
          <div className="space-y-1">
            <button
              onClick={() => {
                onClose();
                onOpenProfile();
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-white/90 hover:bg-[#121c2e] transition-colors"
            >
              <i className="fa-solid fa-id-card text-[#8c96aa] w-5 text-center"></i>
              <span>بطاقة العضوية الرقمية</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onOpenAnthem();
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-white/90 hover:bg-[#121c2e] transition-colors"
            >
              <i className="fa-solid fa-music text-[#d4af37] w-5 text-center"></i>
              <span>نشيد النادي وأهازيج الجمهور</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onOpenStore();
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-white/90 hover:bg-[#121c2e] transition-colors"
            >
              <i className="fa-solid fa-shirt text-[#e30613] w-5 text-center"></i>
              <span>المتجر الرسمي وتخصيص القميص</span>
            </button>

            {onOpenTickets && (
              <button
                onClick={() => {
                  onClose();
                  onOpenTickets();
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-white/90 hover:bg-[#121c2e] transition-colors"
              >
                <i className="fa-solid fa-ticket text-[#ffd700] w-5 text-center"></i>
                <span>حجز التذاكر (المباريات)</span>
              </button>
            )}

            {onOpenMedia && (
              <button
                onClick={() => {
                  onClose();
                  onOpenMedia();
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-white/90 hover:bg-[#121c2e] transition-colors"
              >
                <i className="fa-solid fa-photo-film text-cyan-400 w-5 text-center"></i>
                <span>الصور والفيديوهات (معرض الميديا)</span>
              </button>
            )}

            {onOpenAcademy && (
              <button
                onClick={() => {
                  onClose();
                  onOpenAcademy();
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-white/90 hover:bg-[#121c2e] transition-colors"
              >
                <i className="fa-solid fa-graduation-cap text-[#38bdf8] w-5 text-center"></i>
                <span>الأكاديمية والفئات العمرية</span>
              </button>
            )}

            <div className="pt-3 pb-1">
              <div className="text-[10px] font-bold text-[#8c96aa] px-3 uppercase tracking-wider">
                معلومات النادي
              </div>
            </div>

            <div className="px-3 py-2 text-xs text-[#8c96aa] space-y-1.5 leading-relaxed bg-[#121c2e]/40 rounded-xl">
              <div className="flex justify-between">
                <span>الملعب:</span>
                <span className="text-white">{settings?.stadium||'—'}</span>
              </div>
              <div className="flex justify-between">
                <span>اللقب:</span>
                <span className="text-[#d4af37]">{settings?.nickname||'—'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-white/5 space-y-3">
          <button
            onClick={() => {
              onClose();
              onLogout();
            }}
            className="w-full py-2.5 px-3 bg-red-500/10 hover:bg-red-500/20 text-[#e30613] rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2"
          >
            <i className="fa-solid fa-arrow-right-from-bracket"></i>
            <span>تسجيل الخروج</span>
          </button>

          {/* حسابات النادي الرسمية */}
          <div className="flex items-center justify-center gap-2.5 pt-1">
            {socialLinks.map((social) => (
              <a
                key={social.id}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => openSocialPlatform(e, social)}
                title={social.nameAr}
                aria-label={social.nameAr}
                className="w-8 h-8 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-xs text-[#8c96aa] hover:text-white hover:bg-white/10 transition-all cursor-pointer"
              >
                <i className={social.iconClass}></i>
              </a>
            ))}
          </div>

          <p className="text-[10px] text-center text-[#8c96aa]">
            تطبيق نادي الرجاء العراقي الرسمي © 2026
          </p>
        </div>
      </div>
    </div>
  );
};
