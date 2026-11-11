export const TICKET_TIERS=[
 {id:'vip',name:'VIP',rate:2.5,color:'#ffd700'},
 {id:'first',name:'درجة أولى',rate:1.5,color:'#e30613'},
 {id:'second',name:'درجة ثانية',rate:1,color:'#10b981'},
 {id:'third',name:'درجة ثالثة',rate:.5,color:'#3b82f6'},
] as const;
export type TicketPrices=Record<typeof TICKET_TIERS[number]['id'],number>;
export function ticketPrices(data:{ticketPrice?:number;ticketPrices?:Partial<TicketPrices>}):TicketPrices{
 return Object.fromEntries(TICKET_TIERS.map(t=>[t.id,data.ticketPrices?.[t.id]??Math.round((data.ticketPrice??0)*t.rate)])) as TicketPrices;
}
