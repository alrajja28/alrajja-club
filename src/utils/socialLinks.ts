import React from 'react';

export interface SocialPlatformConfig {
  id: 'facebook' | 'instagram' | 'tiktok' | 'twitter';
  name: string;
  nameAr: string;
  url: string;
  iconClass: string;
  brandColor: string;
  bgHoverClass: string;
  textHoverClass: string;
  androidPackage: string;
}

export const OFFICIAL_SOCIAL_LINKS: SocialPlatformConfig[] = [
  {
    id: 'facebook',
    name: 'Facebook',
    nameAr: 'فيسبوك',
    url: 'https://www.facebook.com/share/19fRsxf6ji/',
    iconClass: 'fa-brands fa-facebook-f',
    brandColor: '#1877F2',
    bgHoverClass: 'hover:bg-[#1877F2]/15',
    textHoverClass: 'hover:text-[#1877F2]',
    androidPackage: 'com.facebook.katana',
  },
  {
    id: 'twitter',
    name: 'X (Twitter)',
    nameAr: 'تويتر / إكس',
    url: 'https://x.com/ALRAJAA_IQ',
    iconClass: 'fa-brands fa-x-twitter',
    brandColor: '#ffffff',
    bgHoverClass: 'hover:bg-white/15',
    textHoverClass: 'hover:text-white',
    androidPackage: 'com.twitter.android',
  },
  {
    id: 'instagram',
    name: 'Instagram',
    nameAr: 'انستغرام',
    url: 'https://www.instagram.com/alrajaa_iq?stkn=aDhnNmVwdXpneWZx',
    iconClass: 'fa-brands fa-instagram',
    brandColor: '#E1306C',
    bgHoverClass: 'hover:bg-[#E1306C]/15',
    textHoverClass: 'hover:text-[#E1306C]',
    androidPackage: 'com.instagram.android',
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    nameAr: 'تيك توك',
    url: 'https://www.tiktok.com/@alrajaaiq?_r=1&_t=ZS-9A5gV4bSfFU',
    iconClass: 'fa-brands fa-tiktok',
    brandColor: '#00f2fe',
    bgHoverClass: 'hover:bg-[#00f2fe]/15',
    textHoverClass: 'hover:text-[#00f2fe]',
    androidPackage: 'com.zhiliaoapp.musically',
  },
];

/**
 * دالة ذكية للفتح:
 * تحوّل المستخدم إلى التطبيق المثبت على جهازه مباشرة (إن وجد)،
 * أو تفتح الصفحة في المتصفح إذا لم يكن التطبيق مثبتاً.
 */
export const openSocialPlatform = (
  e: React.MouseEvent<HTMLAnchorElement>,
  social: SocialPlatformConfig
) => {
  const ua = (typeof navigator !== 'undefined' ? navigator.userAgent : '') || '';
  const isAndroid = /android/i.test(ua);

  // نظام آندرويد: استخدام Intent URL مع browser_fallback_url
  // يقوم نظام أندرويد بفتح التطبيق المثبت مباشرة، وفي حال عدم تثبيته يفتح المتصفح تلقائياً
  if (isAndroid) {
    e.preventDefault();

    let intentUrl = '';
    const cleanUrl = social.url.replace(/^https?:\/\//, '');

    if (social.id === 'instagram') {
      intentUrl = `intent://${cleanUrl}#Intent;package=com.instagram.android;scheme=https;S.browser_fallback_url=${encodeURIComponent(
        social.url
      )};end`;
    } else if (social.id === 'twitter') {
      intentUrl = `intent://${cleanUrl}#Intent;package=com.twitter.android;scheme=https;S.browser_fallback_url=${encodeURIComponent(
        social.url
      )};end`;
    } else if (social.id === 'tiktok') {
      intentUrl = `intent://${cleanUrl}#Intent;package=com.zhiliaoapp.musically;scheme=https;S.browser_fallback_url=${encodeURIComponent(
        social.url
      )};end`;
    } else if (social.id === 'facebook') {
      intentUrl = `intent://${cleanUrl}#Intent;package=com.facebook.katana;scheme=https;S.browser_fallback_url=${encodeURIComponent(
        social.url
      )};end`;
    }

    if (intentUrl) {
      window.location.href = intentUrl;
      return;
    }
  }

  // نظام iOS (آيفون/آيباد) وأجهزة الكمبيوتر:
  // استخدام الروابط العامة (Universal Links) عبر الوسم <a> برابط مباشر target="_blank"
  // نظام iOS يقوم تلقائياً بفتح التطبيق الرسمي المثبت (Instagram / X / TikTok / Facebook)،
  // وإذا لم يكن التطبيق مثبتاً يفتح الرابط في متصفح Safari دون أي أخطاء أو تنبيهات مزعجة.
};
