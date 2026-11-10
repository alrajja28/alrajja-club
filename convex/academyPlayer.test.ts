import {describe,it,expect} from 'vitest';
import {toAcademyPlayer} from '../src/data/academyPlayer';
import type {Player} from '../src/components/TeamTab';
describe('published players in academy categories',()=>{
 it('keeps a custom category and birth year without inventing ratings',()=>{
  const row=toAcademyPlayer({id:'published-player',name:'لاعب الاختبار',teamCategory:'custom-youth',birthYear:2014,position:'حراس'} as Player,'براعم النادي');
  expect(row).toMatchObject({id:'published-player',name:'لاعب الاختبار',category:'custom-youth',categoryTitle:'براعم النادي',birthYear:'2014',subCategory:'2014',posGroup:'gk'});
  expect(row.rating).toBeUndefined();expect(row.number).toBe('—');expect(row.foot).toBeUndefined();
 });
 it('keeps legacy players in the first team without rewriting stored data',()=>{
  const original={id:'legacy',name:'لاعب قديم',position:'وسط',number:8} as Player;
  expect(toAcademyPlayer(original,'الفريق الأول').category).toBe('first');
  expect(original.teamCategory).toBeUndefined();
 });
});
