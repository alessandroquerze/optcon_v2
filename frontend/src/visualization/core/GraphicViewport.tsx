import { createContext,useContext,useEffect,useId,useRef,useState,type ReactNode,type RefObject } from 'react';
import { createPortal } from 'react-dom';
import '../../styles/fullscreen.css';

const WithinGraphic=createContext(false);
type Target=HTMLElement|SVGSVGElement;
type Session={root:HTMLElement;close:()=>void};
let currentSession:Session|null=null;
const focusable='button:not(:disabled),input:not(:disabled),select:not(:disabled),a[href],[tabindex]:not([tabindex="-1"])';

/** Operates on existing DOM nodes: no portal/reparenting or copy of the graphic or its controls. */
function useGraphicFullscreen(target:RefObject<Target|null>,label:string){
  const [session,setSession]=useState<Session|null>(null),[error,setError]=useState('');
  const disposed=useRef(false),generation=useRef(0),local=useRef<Session|null>(null);
  useEffect(()=>{disposed.current=false;return()=>{disposed.current=true;generation.current++;local.current?.close();};},[]);
  const open=async()=>{
    const selected=target.current;if(!selected?.isConnected)return;
    const request=++generation.current;
    const root=selected.closest<HTMLElement>('.companion-page')??selected as HTMLElement;
    const previous=document.activeElement instanceof HTMLElement?document.activeElement:null;
    const scrolls:Array<{element:Element;top:number;left:number}>=[];
    for(let e:Element|null=root.parentElement;e;e=e.parentElement)scrolls.push({element:e,top:e.scrollTop,left:e.scrollLeft});
    const changes:Array<()=>void>=[];
    const attr=(el:Element,key:string,value:string)=>{
      const before=el.getAttribute(key);changes.push(()=>before===null?el.removeAttribute(key):el.setAttribute(key,before));el.setAttribute(key,value);
    };
    currentSession?.close();setError('');
    let mode:'native'|'popover';
    try{
      try{
        if(!root.requestFullscreen)throw new Error('Fullscreen API unavailable');
        await root.requestFullscreen();mode='native';
      }catch{
        if(!root.showPopover)throw new Error('Top layer unavailable');
        attr(root,'popover','manual');root.showPopover();mode='popover';
      }
    }catch{
      changes.reverse().forEach(undo=>undo());
      if(!disposed.current)setError('Schermo intero non disponibile in questo browser.');
      return;
    }
    if(disposed.current||request!==generation.current||!selected.isConnected){
      if(document.fullscreenElement===root)void document.exitFullscreen().catch(()=>{});
      if(mode==='popover'){root.hidePopover();changes.reverse().forEach(undo=>undo());}
      return;
    }
    attr(root,'data-graphic-fullscreen',mode);
    attr(root,'role','dialog');attr(root,'aria-modal','true');attr(root,'aria-label',label+' — schermo intero');
    attr(selected,'data-fullscreen-target','true');
    if(selected!==root)for(let e=selected.parentElement;e&&e!==root;e=e.parentElement)attr(e,'data-fullscreen-branch','true');
    const oldOverflow=document.body.style.overflow;document.body.style.overflow='hidden';
    let finished=false;
    const finish=()=>{
      if(finished)return;finished=true;
      document.removeEventListener('fullscreenchange',onFullscreen);
      document.removeEventListener('keydown',onKey,true);root.removeEventListener('toggle',onToggle);
      changes.reverse().forEach(undo=>undo());document.body.style.overflow=oldOverflow;
      if(currentSession===active)currentSession=null;local.current=null;
      if(!disposed.current)setSession(null);
      for(const s of scrolls)if(s.element.isConnected){s.element.scrollTop=s.top;s.element.scrollLeft=s.left;}
      if(previous?.isConnected)previous.focus({preventScroll:true});
    };
    const active:Session={root,close:()=>{
      if(mode==='native'&&document.fullscreenElement===root)void document.exitFullscreen().then(finish,finish);
      else {if(mode==='popover'&&root.isConnected)root.hidePopover();finish();}
    }};
    const onFullscreen=()=>{if(mode==='native'&&document.fullscreenElement!==root)finish();};
    const onToggle=(event:Event)=>{if(mode==='popover'&&(event as ToggleEvent).newState==='closed')finish();};
    const onKey=(event:KeyboardEvent)=>{
      if(event.key==='Escape'){event.preventDefault();active.close();return;}
      if(event.key!=='Tab')return;
      const items=Array.from(root.querySelectorAll<HTMLElement>(focusable)).filter(e=>e.getClientRects().length>0);
      const first=items[0],last=items.at(-1);if(!first||!last)return;
      if(event.shiftKey&&(document.activeElement===first||!root.contains(document.activeElement))){event.preventDefault();last.focus();}
      else if(!event.shiftKey&&(document.activeElement===last||!root.contains(document.activeElement))){event.preventDefault();first.focus();}
    };
    document.addEventListener('fullscreenchange',onFullscreen);document.addEventListener('keydown',onKey,true);
    root.addEventListener('toggle',onToggle);currentSession=active;local.current=active;setSession(active);
    requestAnimationFrame(()=>{if(!finished)root.querySelector<HTMLElement>('[data-graphic-close]')?.focus({preventScroll:true});});
  };
  const ui=session?createPortal(<div className="graphic-fullscreen-header" data-fullscreen-ui>
    <span>{label}</span><span className="graphic-escape-hint">Esc per uscire</span>
    <button type="button" data-graphic-close onClick={session.close}>Esci da schermo intero</button>
  </div>,session.root):null;
  return {open,ui,error};
}
function ExpandButton({open,label,className='',style}:{open:()=>void;label:string;className?:string;style?:React.CSSProperties}){
  return <button type="button" className={'graphic-expand '+className} style={style}
    aria-label={'Apri a schermo intero: '+label} title="Schermo intero" onClick={open}>⛶</button>;
}
/** Future visualizations inherit fullscreen by using this boundary or SceneViewport. */
export function GraphicViewport({children,label,className=''}:{children:ReactNode;label:string;className?:string}){
  const parent=useContext(WithinGraphic),ref=useRef<HTMLDivElement>(null),fullscreen=useGraphicFullscreen(ref,label);
  return <WithinGraphic.Provider value={true}><div className={'graphic-viewport '+className} ref={ref} data-graphic-owner={parent?undefined:'true'} data-graphic-label={label}>
    <div className="graphic-content">{children}</div>
    {!parent&&<ExpandButton open={fullscreen.open} label={label}/>}
    {fullscreen.error&&<p role="status" className="graphic-fullscreen-error">{fullscreen.error}</p>}
    {fullscreen.ui}
  </div></WithinGraphic.Provider>;
}

function InlineSvgControl({element,scope}:{element:SVGSVGElement;scope:HTMLElement}){
  const ref=useRef<Target|null>(element),id=useId();
  const container=element.parentElement??scope;
  const label=element.getAttribute('aria-label')??element.querySelector('title')?.textContent??'Diagramma 2D';
  const fullscreen=useGraphicFullscreen(ref,label),[position,setPosition]=useState({top:0,left:0});
  useEffect(()=>{
    const place=()=>{
      const box=element.getBoundingClientRect(),base=container.getBoundingClientRect(),scale=base.width/container.clientWidth||1;
      setPosition({top:(box.top-base.top)/scale+4,left:(box.right-base.left)/scale-36});
    };
    const position=container.style.position;
    if(getComputedStyle(container).position==='static')container.style.position='relative';
    element.dataset.graphicAutoOwner=id;place();
    const observer=new ResizeObserver(place);observer.observe(element);observer.observe(scope);
    return()=>{observer.disconnect();container.style.position=position;delete element.dataset.graphicAutoOwner;};
  },[element,scope,container,id]);
  return <>{createPortal(<ExpandButton open={fullscreen.open} label={label} className="graphic-auto-expand" style={position}/>,container)}
    {fullscreen.ui}{fullscreen.error&&createPortal(<p role="status">{fullscreen.error}</p>,scope)}</>;
}
/** Covers inline diagrams without changing or regenerating page renderers; ignores renderer-owned SVG. */
export function AutoGraphicFullscreen({scope}:{scope:RefObject<HTMLElement|null>}){
  const [elements,setElements]=useState<SVGSVGElement[]>([]);
  const identities=useRef(new WeakMap<SVGSVGElement,number>()),nextIdentity=useRef(0);
  useEffect(()=>{
    const root=scope.current;if(!root)return;let frame=0;
    const scan=()=>{
      const next=Array.from(root.querySelectorAll<SVGSVGElement>('svg[role="img"]'))
        .filter(e=>!e.closest('.graphic-viewport,.js-plotly-plot,.katex'));
      setElements(previous=>previous.length===next.length&&previous.every((e,i)=>e===next[i])?previous:next);
    };
    scan();const observer=new MutationObserver(()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(scan);});
    observer.observe(root,{childList:true,subtree:true});
    return()=>{observer.disconnect();cancelAnimationFrame(frame);};
  },[scope]);
  return <>{elements.map(element=>{
    if(!identities.current.has(element))identities.current.set(element,nextIdentity.current++);
    return scope.current&&<InlineSvgControl key={identities.current.get(element)} element={element} scope={scope.current}/>;
  })}</>;
}
