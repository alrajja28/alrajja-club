import type {Player} from '../components/TeamTab';
import type {AcademyPlayer} from './academyData';
export function toAcademyPlayer(player:Player,categoryTitle:string):AcademyPlayer{
 const positions:Record<string,'gk'|'def'|'mid'|'fwd'>={'حراس':'gk','دفاع':'def','وسط':'mid','هجوم':'fwd'};
 return {...player,category:player.teamCategory??'first',categoryTitle,subCategory:player.birthYear?String(player.birthYear):'',birthYear:player.birthYear?String(player.birthYear):'',number:player.number??'—',position:player.posName||player.position||'لاعب',posGroup:positions[player.position],height:player.height||'—',specialSkill:''};
}
