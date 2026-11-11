import {useClubSettings} from './useClubSettings';
import {OFFICIAL_SOCIAL_LINKS} from '../utils/socialLinks';
export function useSocialLinks(){const settings=useClubSettings();return OFFICIAL_SOCIAL_LINKS.map(s=>({...s,url:settings?.[s.id]??''})).filter(s=>s.url.startsWith('https://'));}
