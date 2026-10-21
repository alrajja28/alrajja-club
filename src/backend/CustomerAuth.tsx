import React,{createContext,useCallback,useContext,useEffect,useMemo,useState} from 'react';
import {getApp,getApps,initializeApp} from 'firebase/app';
import {getAuth,GoogleAuthProvider,onIdTokenChanged,signInWithPopup,signOut,type User} from 'firebase/auth';
import {ConvexProviderWithAuth,useConvexAuth,useMutation,type ConvexReactClient} from 'convex/react';
import {anyApi} from 'convex/server';
import config from './firebase-config.json';

const app=getApps().length?getApp():initializeApp(config);
const auth=getAuth(app);
const Context=createContext<{user:User|null;isLoading:boolean}>({user:null,isLoading:true});
function useFirebaseToken(){
 const {user,isLoading}=useContext(Context);
 const fetchAccessToken=useCallback(async({forceRefreshToken}:{forceRefreshToken:boolean})=>user?user.getIdToken(forceRefreshToken):null,[user]);
 return useMemo(()=>({isLoading,isAuthenticated:!!user,fetchAccessToken}),[isLoading,user,fetchAccessToken]);
}
export function useClubAuthActions(){return {
 signIn:async(_provider?:string,options?:{loginHint?:string;redirectTo?:string})=>{const provider=new GoogleAuthProvider();provider.setCustomParameters(options?.loginHint?{login_hint:options.loginHint}:{prompt:'select_account'});await signInWithPopup(auth,provider);},
 signOut:()=>signOut(auth),
};}
function ProfileSync({children}:{children:React.ReactNode}){
 const {isAuthenticated,isLoading}=useConvexAuth();const {user}=useContext(Context);
 const ensureUser=useMutation(anyApi.identity.ensureUser);
 const [ready,setReady]=useState(''),[error,setError]=useState('');
 const identity=user?.uid??'';
 useEffect(()=>{let current=true;setError('');if(isAuthenticated&&identity){void ensureUser({}).then(()=>{if(current)setReady(identity);}).catch(()=>{if(current)setError('تعذر مزامنة الحساب. أعد المحاولة.');});}else setReady('');return()=>{current=false};},[isAuthenticated,identity,ensureUser]);
 if(error)return <div dir="rtl" style={{padding:30,color:'#fff',background:'#0a1020',minHeight:'100vh'}} role="alert">{error}<button onClick={()=>location.reload()}>إعادة المحاولة</button><button onClick={()=>void signOut(auth)}>تسجيل الخروج</button></div>;
 if(isLoading||(isAuthenticated&&ready!==identity))return <div dir="rtl" style={{padding:30,color:'#fff',background:'#0a1020',minHeight:'100vh'}}>جارٍ التحقق من الحساب…</div>;
 return children;
}
export function CustomerAuthProvider({client,children}:{client:ConvexReactClient;children:React.ReactNode}){
 const [state,setState]=useState<{user:User|null;isLoading:boolean}>({user:null,isLoading:true});
 useEffect(()=>onIdTokenChanged(auth,user=>setState({user,isLoading:false}),()=>setState({user:null,isLoading:false})),[]);
 return <Context.Provider value={state}><ConvexProviderWithAuth client={client} useAuth={useFirebaseToken}><ProfileSync>{children}</ProfileSync></ConvexProviderWithAuth></Context.Provider>;
}
