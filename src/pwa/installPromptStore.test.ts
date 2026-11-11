import {describe,it,expect} from 'vitest';
import {createInstallPromptStore} from './installPromptStore';
import type {InstallPromptEvent} from './requestInstall';
function browserEvent(){return Object.assign(new Event('beforeinstallprompt',{cancelable:true}),{prompt:()=>Promise.resolve(),userChoice:Promise.resolve({outcome:'accepted' as const})}) as InstallPromptEvent;}
describe('early browser installation readiness',()=>{
 it('retains readiness announced before the React UI subscribes and consumes it once',()=>{
  const browser=new EventTarget(),store=createInstallPromptStore(browser),event=browserEvent();
  browser.dispatchEvent(event);expect(event.defaultPrevented).toBe(true);
  expect(store.getSnapshot()).toBe(event);
  let changes=0;const unsubscribe=store.subscribe(()=>changes++);
  expect(store.consume()).toBe(event);expect(changes).toBe(1);
  expect(store.consume()).toBeNull();expect(store.getSnapshot()).toBeNull();
  unsubscribe();store.dispose();
 });
 it('clears a captured event when installation completes outside the custom button',()=>{
  const browser=new EventTarget(),store=createInstallPromptStore(browser);
  browser.dispatchEvent(browserEvent());browser.dispatchEvent(new Event('appinstalled'));
  expect(store.getSnapshot()).toBeNull();store.dispose();
 });
});
