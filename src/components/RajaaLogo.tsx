import {useClubSettings} from '../backend/useClubSettings';
import React from 'react';

export interface RajaaLogoProps {
  className?: string;
  size?: number;
  showGlow?: boolean;
}

export const RajaaLogo: React.FC<RajaaLogoProps> = ({
  className = '',
  size = 120,
  showGlow = true,
}) => { const settings=useClubSettings(); return (
  <div
    className={`club-crest relative inline-flex items-center justify-center shrink-0 select-none ${className}`}
    style={{ width: size, height: size }}
    title="شعار نادي الرجاء العراقي الرسمي"
  >
    <img
      src={settings?.image||`${import.meta.env.BASE_URL}rajaa-logo.png`}
      alt="شعار نادي الرجاء العراقي"
      width={size}
      height={size}
      draggable={false}
      className={`w-full h-full object-contain ${showGlow ? 'drop-shadow-[0_8px_25px_rgba(212,160,52,0.35)]' : ''}`}
    />
  </div>
);};
