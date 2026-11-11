import {afterEach,describe,expect,it,vi} from 'vitest';
import {requestWebInstall,type InstallPromptEvent} from './requestInstall';
const never=()=>new Promise<never>(()=>{});
function promptEvent(prompt:()=>Promise<unknown>,userChoice:Promise<{outcome:'accepted'|'dismissed'}>):InstallPromptEvent{return {prompt,userChoice} as InstallPromptEvent;}
afterEach(()=>vi.useRealTimers());
describe('browser installation completion',()=>{
 it('invokes the native prompt during the click call and returns an accepted choice',async()=>{
  let invoked=false;const pending=requestWebInstall(promptEvent(()=>{invoked=true;return Promise.resolve()},Promise.resolve({outcome:'accepted'})));
  expect(invoked).toBe(true);expect(await pending).toBe('accepted');
 });
 it('returns manual installation when Chrome never opens the prompt',async()=>{
  vi.useFakeTimers();let result:unknown;
  void requestWebInstall(promptEvent(never,never())).then(value=>{result=value});
  await vi.advanceTimersByTimeAsync(12000);expect(result).toBe('manual');
 });
 it('does not remain busy when Chrome leaves userChoice pending',async()=>{
  vi.useFakeTimers();let result:unknown;
  void requestWebInstall(promptEvent(()=>Promise.resolve(),never())).then(value=>{result=value});
  await vi.advanceTimersByTimeAsync(12000);expect(result).toBe('manual');
 });
 it('handles stale events and keeps a cancelled installation distinct',async()=>{
  expect(await requestWebInstall(promptEvent(()=>Promise.reject(Error('event consumed')),never()))).toBe('manual');
  expect(await requestWebInstall(promptEvent(()=>Promise.resolve(),Promise.resolve({outcome:'dismissed'})))).toBe('dismissed');
 });
});
