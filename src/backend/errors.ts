import {ConvexError} from 'convex/values';
export function errorMessage(error:unknown){
  if(error instanceof ConvexError&&typeof error.data==='string')return error.data;
  return 'تعذر إتمام العملية. تحقق من اتصال الإنترنت وحاول مرة أخرى.';
}
