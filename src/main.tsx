import {createRoot} from 'react-dom/client';
import Maintenance from './Maintenance';
import {MAINTENANCE_ENABLED} from './maintenance-config';

if(MAINTENANCE_ENABLED){
  createRoot(document.getElementById('root')!).render(<Maintenance/>);
}else{
  void import('./bootstrap');
}
