import {useClubSettings} from '../backend/useClubSettings';
export function ClubName(){const settings=useClubSettings();return <>{settings?.title||'نادي الرجاء العراقي'}</>;}
