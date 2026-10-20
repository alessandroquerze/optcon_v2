import {ParameterControl} from '../components/ParameterControl';
import {InlineMath} from '../components/CompanionPage';
import type {usePlayback} from '../simulations/usePlayback';
/** All buttons select existing algorithmic samples; there is no physical-time integration. */
export function IterationControls({playback,count}:{playback:ReturnType<typeof usePlayback>;count:number}){
  const k=Math.min(playback.index,count-1);
  return <div className="iteration-picker"><ParameterControl label="Iterazione" displayLabel={<InlineMath latex="k"/>}
    domain={{min:0,max:count-1,step:1,integer:true}} unit="iter." value={k} onChange={playback.seek}/>
    <div className="iteration-buttons"><button onClick={playback.toggle} aria-pressed={playback.playing}>{playback.playing?'Pausa':'Play'}</button>
      <button onClick={()=>playback.seek(k+1)} disabled={k===count-1}>Passo</button><button onClick={playback.restart}>Riparti</button></div></div>;
}
