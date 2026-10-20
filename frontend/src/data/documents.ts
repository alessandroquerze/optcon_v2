export const courseDocuments = [
  {key:'introduction',title:'Introduction to Optimal Control',label:'INTRODUCTION',manifest:'manifest.json'},
  {key:'optimization',title:'Nonlinear Optimization',label:'OPTIMIZATION',manifest:'optimization-manifest.json'},
] as const;
export type DocumentKey = typeof courseDocuments[number]['key'];
export function documentFromHash(): DocumentKey {
  const value=new URLSearchParams(location.hash.split('?')[1]).get('doc');
  return value==='optimization'?'optimization':'introduction';
}
export function documentFromId(id:string): DocumentKey {
  return id.startsWith('OPTCON-RL_optimization_')?'optimization':'introduction';
}
export function studyHref(documentKey:DocumentKey,page:number) {
  return '#/study?'+(documentKey==='introduction'?'':'doc='+documentKey+'&')+'page='+page;
}
