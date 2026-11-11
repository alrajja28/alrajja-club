export type InstallPromptEvent=Event&{
 prompt:()=>Promise<unknown>;
 userChoice:Promise<{outcome:'accepted'|'dismissed'}>;
};
export type InstallResult='accepted'|'dismissed'|'manual';
// Invoke prompt synchronously in the user's click gesture; never wait forever for
// either Chrome promise. A consumed event must not be offered a second time.
export async function requestWebInstall(event:InstallPromptEvent):Promise<InstallResult>{
 let timer:ReturnType<typeof setTimeout>|undefined;
 try{
  const choice=(async()=>{await event.prompt();return (await event.userChoice).outcome;})();
  const timeout=new Promise<InstallResult>(resolve=>{timer=setTimeout(()=>resolve('manual'),12000)});
  return await Promise.race([choice,timeout]);
 }catch{return 'manual'}finally{if(timer!==undefined)clearTimeout(timer)}
}
