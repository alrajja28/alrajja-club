import {useQuery} from 'convex/react';
import {clubApi} from './api';
export type PlayerCategory={slug:string;title:string};
const initialCategories:PlayerCategory[]=[{slug:'first',title:'الفريق الأول'},{slug:'youth',title:'الشباب'},{slug:'juniors',title:'الناشئين'},{slug:'cubs',title:'الأشبال'}];
export function usePlayerCategories():PlayerCategory[]{return useQuery(clubApi.content.listPlayerCategories,{})??initialCategories;}
