import {useContent} from '../backend/useContent';
export function ManagedCards({section='pages',category,scope}:{section?:'pages'|'staff'|'management'|'matches'|'academy';category?:string;scope?:string}){
 const records=useContent<any>(section).filter(r=>(!category||r.category===category)&&(!scope||r.scope===scope));
 if(!records.length)return <p className="p-4 text-sm text-[#8c96aa] text-center">لا يوجد محتوى منشور حاليًا.</p>;
 return <div className="space-y-3">{records.map(r=><article key={r.id} className="bg-[#121c2e] rounded-2xl border border-white/10 p-4 text-sm">{(r.image||r.imgUrl)&&<img src={r.image||r.imgUrl} alt={r.title} className="w-full max-h-48 object-cover rounded-xl mb-3"/>}<h3 className="font-bold text-white">{r.title}</h3><p className="text-[#d4af37]">{r.role||r.competition}</p><p className="text-[#8c96aa] whitespace-pre-line mt-2">{r.description||r.content||r.opponent}</p>{r.date&&<p className="text-xs mt-2">{r.date} {r.time}</p>}<p className="text-xs">{r.stadium}</p>{r.license&&<p className="text-xs">{r.license}</p>}</article>)}</div>;
}
