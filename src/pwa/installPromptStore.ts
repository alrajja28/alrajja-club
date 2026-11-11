import type {InstallPromptEvent} from './requestInstall';
// Capture before bootstrap/Firebase download. The browser can announce readiness
// before the React installation component has mounted.
export function createInstallPromptStore(target:EventTarget){
 let pending:InstallPromptEvent|null=null;
 const listeners=new Set<()=>void>();
 const emit=()=>{for(const listener of listeners)listener()};
 const clear=()=>{pending=null;emit()};
 const capture=(event:Event)=>{event.preventDefault();pending=event as InstallPromptEvent;emit()};
 target.addEventListener('beforeinstallprompt',capture);
 target.addEventListener('appinstalled',clear);
 return {
  getSnapshot:()=>pending,
  subscribe:(listener:()=>void)=>{listeners.add(listener);return ()=>{listeners.delete(listener)}},
  consume:()=>{const event=pending;clear();return event},
  dispose:()=>{target.removeEventListener('beforeinstallprompt',capture);target.removeEventListener('appinstalled',clear);listeners.clear()},
 };
}
export const installPromptStore=typeof window==='undefined'?null:createInstallPromptStore(window);
