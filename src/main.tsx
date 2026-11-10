import {createRoot} from 'react-dom/client';
import {MAINTENANCE_ENABLED} from './maintenance-config';

if(MAINTENANCE_ENABLED){
  void import('./Maintenance').then(({default:Maintenance})=>{createRoot(document.getElementById('root')!).render(<Maintenance/>);});
}else{
  void import('./bootstrap');
}
