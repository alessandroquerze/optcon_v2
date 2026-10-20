import {useState} from 'react';
import type {CompanionDefinition} from '../data/manifest';
const choices=new Map<string,number>();
/** Session choice isolated by document, physical page and control name. */
export function useLessonChoice(definition:CompanionDefinition,name:string,initial=0){
  const key=definition.page_id+':'+name;
  const [value,setValue]=useState(()=>choices.get(key)??initial);
  const update=(next:number)=>{choices.set(key,next);setValue(next);};
  return {value,update,reset:()=>update(initial)};
}
export function LessonChoice({label,options,state}:{label:string;options:readonly string[];state:ReturnType<typeof useLessonChoice>}){
  return <label className="opt-choice"><span>{label}</span><select aria-label={label} value={state.value} onChange={e=>state.update(Number(e.target.value))}>
    {options.map((text,i)=><option value={i} key={text}>{text}</option>)}</select></label>;
}
