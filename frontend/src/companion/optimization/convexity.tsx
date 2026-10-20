import {useMemo,useState} from 'react';
import type {CompanionRendererProps} from '../registry';
import type {CompanionDefinition} from '../../data/manifest';
import type {XY} from '../../math/convexity';
import {segmentSet,jensen,jensenNames,constraintLevel,inequalityNames,equalityNames,firstOrder,quartic,quarticGradient,smoothQuadratic,circle} from '../../math/convexity';
import {curveData,functionGrid} from '../../math/optimizationFoundations';
import {LessonFrame,FormulaDeck,LessonEquation,LessonControls,LiveMetrics,FormulaContext,numberText,useLessonParameters} from '../LessonFrame';
import {SceneViewport,FunctionExplorer,ConstraintVisualizer,ProjectionLink} from '../../visualization';
import '../../styles/optimization.css';
import '../../styles/convexity.css';

const rememberedCases=new Map<string,number>();
function useCase(definition:CompanionDefinition){
  const [value,setValue]=useState(()=>rememberedCases.get(definition.page_id)??0);
  const update=(next:number)=>{rememberedCases.set(definition.page_id,next);setValue(next);};
  return {value,update,reset:()=>update(0)};
}
function CaseSelect({label,options,choice}:{label:string;options:readonly string[];choice:ReturnType<typeof useCase>}){
  return <label className="opt-choice"><span>{label}</span><select aria-label={label} value={choice.value} onChange={e=>choice.update(Number(e.target.value))}>
    {options.map((name,i)=><option key={name} value={i}>{name}</option>)}</select></label>;
}
const className='optimization-lesson convexity-lesson';
const formatted=(x:number)=>x!==0&&Math.abs(x)<.0001?x.toExponential(2):numberText(x,4);
const line=(fn:(x:number)=>number,low=-1.5,high=1.5,color='#176c98',name='Costo')=>{
  const data=curveData(name,fn,low,high);
  return {type:'scatter',mode:'lines',name,x:data.points.map(p=>p.x),y:data.points.map(p=>p.y),line:{width:3,color},hovertemplate:'z=%{x:.3f}<br>valore=%{y:.5f}<extra>'+name+'</extra>'};
};
const point=(x:number,y:number,name:string,color='#cf6b24')=>({type:'scatter',mode:'markers',name,x:[x],y:[y],marker:{color,size:12,line:{color:'white',width:2}},hovertemplate:name+'<br>%{x:.4f}, %{y:.4f}<extra></extra>'});
const labeledPoint=(p:XY,label:string,color='#176c98')=>({...point(...p,label,color),mode:'markers+text',text:[label],textposition:'top center',textfont:{size:22,color}});
const segment=(a:XY,b:XY,name:string,color='#cf6b24',dash='solid')=>({type:'scatter',mode:'lines',name,x:[a[0],b[0]],y:[a[1],b[1]],line:{width:3,color,dash}});
const planeLayout=(range:number[])=>({xaxis:{title:{text:'z₁ [1]'},range,constrain:'domain'},yaxis:{title:{text:'z₂ [1]'},range,constrain:'domain',scaleanchor:'x'}});

function ConvexSets({definition}:CompanionRendererProps){
  const state=useLessonParameters(definition),theta=state.numbers[0],choice=useCase(definition);
  const d=useMemo(()=>segmentSet(choice.value,theta),[choice.value,theta]);
  const traces=useMemo(()=>{
    const boundary=choice.value===0?circle('Ellisse',0,0,1.8,1.2):circle('Corona',0,0,1.5);
    const outer={type:'scatter',mode:'lines',x:boundary.points.map(p=>p.x),y:boundary.points.map(p=>p.y),fill:'toself',fillcolor:'#b3ddd0',line:{color:'#25775b',width:2},hoverinfo:'skip'};
    const hole=circle('Foro',0,0,.65);
    return [outer,...(choice.value?[{...outer,x:hole.points.map(p=>p.x),y:hole.points.map(p=>p.y),fillcolor:'white'}]:[]),
      segment(d.a,d.b,'Segmento','#176c98','dash'),labeledPoint(d.a,'z<sub>A</sub>'),labeledPoint(d.b,'z<sub>B</sub>'),point(...d.point,'Punto corrente',d.inside?'#cf6b24':'#c92929')];
  },[choice.value,d]);
  return <LessonFrame definition={definition} className={className} explanation={null}
    formula={<FormulaDeck definition={definition} primaryId="opt10-segment"/>}
    legend="Esempio aggiunto · segmento blu · punto arancio se ammesso, rosso se escluso."
    visual={<SceneViewport id="optimization-p10-segment" traces={traces} layout={planeLayout([-2,2])} label="Segmento e appartenenza all’insieme" height={360} fontSize={22}/>}
    controls={<LessonControls definition={definition} state={{...state,reset:()=>{state.reset();choice.reset();}}} hints={['Da B verso A, regione fissa']} extra={<CaseSelect label="Insieme" options={['Ellisse piena','Corona con foro']} choice={choice}/>}/>}
    example={<><LiveMetrics items={[{id:'opt10-z1',label:'Prima coordinata',value:numberText(d.point[0],2)},{id:'opt10-z2',label:'Seconda coordinata',value:numberText(d.point[1],2)},{id:'opt10-inside',label:'Punto nell’insieme?',value:d.inside?'sì':'no'}]}/>
      <p className="opt-verdict" data-testid="opt10-classification">{d.convex?'Ellisse convessa: tutto il segmento resta dentro.':'Corona non convessa: il segmento attraversa il foro.'}</p>
      <FormulaContext definition={definition} formulaId="opt10-example">Le regioni hanno modelli espliciti. Un solo segmento favorevole non dimostra la convessità di un insieme generico.</FormulaContext></>}/>;
}
function ConvexFunctions({definition}:CompanionRendererProps){
  const state=useLessonParameters(definition),theta=state.numbers[0],choice=useCase(definition);
  const d=useMemo(()=>jensen(choice.value,theta),[choice.value,theta]);
  const traces=useMemo(()=>[line(d.fn),segment([d.a,d.fn(d.a)],[d.b,d.fn(d.b)],'Corda','#8057a5','dash'),
    segment([d.z,d.value],[d.z,d.chord],'Scarto'),point(d.z,d.value,'Costo nel punto'),point(d.z,d.chord,'Valore sulla corda','#8057a5')],[d]);
  return <LessonFrame definition={definition} className={className} explanation={null}
    formula={<FormulaDeck definition={definition} primaryId="opt11-jensen"/>}
    legend="Esempio aggiunto · curva blu · corda viola · confronto verticale nello stesso punto."
    visual={<SceneViewport id="optimization-p11-chord" traces={traces} layout={{xaxis:{title:{text:'z [1]'},range:[-1.5,1.5]},yaxis:{title:{text:'ℓ(z) [valore]'},range:[-2.4,2.4]}}} label="Curva e corda" height={350} fontSize={22}/>}
    controls={<LessonControls definition={definition} state={{...state,reset:()=>{state.reset();choice.reset();}}} hints={['Estremi fissi: A=−1, B=1']} extra={<CaseSelect label="Funzione" options={jensenNames} choice={choice}/>}/>}
    example={<><LessonEquation definition={definition} formulaId={'opt11-case-'+choice.value}/>
      <LiveMetrics items={[{id:'opt11-cost',label:'Costo nel punto',value:formatted(d.value)},{id:'opt11-chord',label:'Valore sulla corda',value:formatted(d.chord)},{id:'opt11-gap',label:'Corda − costo',value:formatted(d.gap)}]}/>
      <p className="lesson-caption" data-testid="opt11-verdict">{theta===0||theta===1?'Agli estremi il confronto è in uguaglianza, anche nel caso stretto.':d.strict?'Disuguaglianza stretta all’interno del segmento.':d.convex?'Pareggio affine: convessa, senza strettezza.':'Il costo supera la corda: questa funzione è concava.'}</p></>}/>;
}

/** Same analytic boundary and residual drive inequality and equality views. */
function ConstraintLab({definition}:CompanionRendererProps){
  const equality=definition.source_page===13,prefix=equality?'opt13':'opt12';
  const state=useLessonParameters(definition),[c,x]=state.numbers,choice=useCase(definition);
  const d=useMemo(()=>constraintLevel(equality,choice.value,c,x),[equality,choice.value,c,x]);
  const points=useMemo(()=>[d.point],[d.point]);
  const layer=useMemo(()=>[{grid:d.plane,label:'Piano zero',opacity:.22}],[d.plane]);
  return <LessonFrame definition={definition} className={className} explanation={null}
    formula={<FormulaDeck definition={definition} primaryId={prefix+'-set'} warnings/>}
    legend={equality?'Esempio aggiunto · solo la curva è ammissibile · 3D: residuo h e piano zero.':'Esempio aggiunto · verde: g≤0, bordo incluso · 3D: residuo g e piano zero.'}
    visual={<ProjectionLink initialId={d.point.id}><FunctionExplorer id={'optimization-'+prefix+'-level'} grid={d.grid} points={points} layers={layer}
      policy={definition.visualization.visualizationMode} camera={definition.visualization.presentation.camera} height={315} fontSize={22}
      twoDView={<ConstraintVisualizer id={'optimization-'+prefix+'-region'} residual={d.grid} feasibleMask={d.mask} points={points}
        zeroSet={d.boundary} hideMask={equality} hideContour height={315} fontSize={22}/>}/></ProjectionLink>}
    controls={<LessonControls definition={definition} state={{...state,reset:()=>{state.reset();choice.reset();}}} hints={['Sposta il livello zero','Muove solo la sonda']}
      extra={<CaseSelect label={equality?'Uguaglianza':'Vincolo'} options={equality?equalityNames:inequalityNames} choice={choice}/>}/>}
    example={<><LessonEquation definition={definition} formulaId={prefix+'-case-'+choice.value}/>
      <LiveMetrics items={[{id:prefix+'-residual',label:equality?'h(z₁,0)':'g(z₁,0)',value:formatted(d.value)},{id:prefix+'-feasible',label:'Sonda ammissibile?',value:d.feasible?'sì':'no'},{id:prefix+'-convex',label:'Insieme convesso?',value:d.convex?'sì':'no'}]}/>
      <p className="lesson-caption" data-testid={prefix+'-kind'}>Insieme corrente: {d.kind}.</p></>}/>;
}
function SupportingGradient({definition}:CompanionRendererProps){
  const state=useLessonParameters(definition),[a,b]=state.numbers,d=useMemo(()=>firstOrder(a,b),[a,b]);
  const traces=useMemo(()=>[line(z=>quartic(z,1)),line(z=>d.valueA+d.gradientA*(z-a),-1.5,1.5,'#8057a5','Supporto affine'),
    segment([b,d.tangentB],[b,d.valueB],'Scarto'),labeledPoint([a,d.valueA],'z<sub>A</sub>','#cf6b24'),
    ...(a===b?[]:[labeledPoint([b,d.valueB],'z<sub>B</sub>')])],[a,b,d]);
  return <LessonFrame definition={definition} className={className} explanation={null}
    formula={<FormulaDeck definition={definition} primaryId="opt14-support"/>}
    legend="Esempio aggiunto · costo blu · supporto affine viola · scarto verticale nel punto B."
    visual={<SceneViewport id="optimization-p14-support" traces={traces} layout={{xaxis:{title:{text:'z [1]'},range:[-1.5,1.5]},yaxis:{title:{text:'ℓ(z) [valore]'},range:[-4.5,3]}}} label="Costo e supporto affine" height={350} fontSize={22}/>}
    controls={<LessonControls definition={definition} state={state} hints={['Sposta punto e tangente','Confronta il costo con il supporto']}/>}
    example={<><LessonEquation definition={definition} formulaId="opt14-example"/>
      <LiveMetrics items={[{id:'opt14-support',label:'Supporto nel punto B',value:formatted(d.tangentB)},{id:'opt14-gap',label:'Costo − supporto',value:formatted(d.gap)},{id:'opt14-M',label:'Prodotto monotono M',value:formatted(d.monotonicity)}]}/>
      <FormulaContext definition={definition} formulaId="opt14-monotone">M è il prodotto fra differenza dei gradienti e spostamento: è non negativo. Se i punti coincidono vale zero.</FormulaContext></>}/>;
}
function StrictGradient({definition}:CompanionRendererProps){
  const state=useLessonParameters(definition),h=state.numbers[0],d=useMemo(()=>firstOrder(-h,h,0),[h]);
  const traces=useMemo(()=>[line(z=>quarticGradient(z),-1.1,1.1,'#176c98','Gradiente z³'),point(-h,d.gradientA,'Gradiente in z_A'),point(h,d.gradientB,'Gradiente in z_B')],[h,d]);
  const layout=useMemo(()=>({xaxis:{title:{text:'z [1]'},range:[-1.1,1.1]},yaxis:{title:{text:'∇ℓ(z) [1]'},range:[-1.4,1.4]},
    shapes:[{type:'rect',x0:-h,x1:h,y0:d.gradientA,y1:d.gradientB,line:{color:'#cf6b24',width:1},fillcolor:'#cf6b2418',layer:'below'}]}),[h,d]);
  return <LessonFrame definition={definition} className={className} explanation={null}
    formula={<FormulaDeck definition={definition} primaryId="opt15-distinct" warnings/>}
    legend="Esempio aggiunto · gradiente z³ · area del rettangolo = prodotto monotono M."
    visual={<SceneViewport id="optimization-p15-strict" traces={traces} layout={layout} label="Gradiente strettamente crescente e prodotto" height={340} fontSize={22}/>}
    controls={<LessonControls definition={definition} state={state} hints={['Avvicina i punti all’origine; non cambia la funzione']}/>}
    example={<><LessonEquation definition={definition} formulaId="opt15-example" latex="\ell(z)=\frac14z^4,\quad\nabla\ell(z)=z^3,\quad z_A=-h,\ z_B=h"/>
      <LiveMetrics items={[{id:'opt15-M',label:'Prodotto M',value:formatted(d.monotonicity)},{id:'opt15-distance',label:'Distanza quadratica',value:formatted(d.distanceSquared)},{id:'opt15-ratio',label:'M / distanza²',value:d.ratio===null?'non definito':formatted(d.ratio)}]}/>
      <p className="lesson-caption" data-testid="opt15-verdict">{h===0?'Punti coincidenti: il confronto stretto non si applica; nessuna divisione 0/0.':'Il rapporto è h² e tende a zero: nessuna costante uniforme positiva sul dominio.'}</p></>}/>;
}
function StrongGradient({definition}:CompanionRendererProps){
  const state=useLessonParameters(definition),[mu,h]=state.numbers,d=useMemo(()=>firstOrder(-h,h,mu),[mu,h]);
  const traces=useMemo(()=>[line(z=>quartic(z,mu)),line(z=>mu*z*z/2,-1.5,1.5,'#8057a5','Base quadratica'),
    point(-h,d.valueA,'z_A'),point(h,d.valueB,'z_B')],[mu,h,d]);
  return <LessonFrame definition={definition} className={className} explanation={null}
    formula={<FormulaDeck definition={definition} primaryId="opt16-monotone" warnings/>}
    legend="Esempio aggiunto · costo blu · base quadratica µz²/2 viola · coppia di punti ±h."
    visual={<SceneViewport id="optimization-p16-strong" traces={traces} layout={{xaxis:{title:{text:'z [1]'},range:[-1.5,1.5]},yaxis:{title:{text:'ℓ(z) [valore]'},range:[-.1,3.6]}}} label="Costo e curvatura minima" height={335} fontSize={22}/>}
    controls={<LessonControls definition={definition} state={state} hints={['Cambia la curvatura minima','Cambia la coppia, funzione fissa']}/>}
    example={<><LessonEquation definition={definition} formulaId="opt16-example"/>
      <LiveMetrics items={[{id:'opt16-M',label:'Prodotto M',value:formatted(d.monotonicity)},{id:'opt16-lower',label:'Limite µ distanza²',value:formatted(d.lower)},{id:'opt16-margin',label:'M − limite',value:formatted(d.monotonicity-d.lower)}]}/>
      <p className="lesson-caption" data-testid="opt16-verdict">{mu===0?'µ=0: caso di confine, strettamente convesso ma senza forte convessità.':h===0?'Coppia coincidente: entrambi i lati sono zero.':'La stessa µ>0 garantisce il limite per tutte le coppie del dominio.'}</p></>}/>;
}
function GradientDisk({id,data,refined}:{id:string;data:ReturnType<typeof smoothQuadratic>;refined:boolean}){
  const traces=useMemo(()=>{
    // Normalize only the gradient and its admissible disk by L. Keep δ at unit length.
    const scale=refined?data.L:1,center:XY=[data.center[0]/scale,data.center[1]/scale],radius=data.radius/scale;
    const plotted:XY=[data.plotted[0]/scale,data.plotted[1]/scale],boundary=circle('Disco del limite',...center,radius);
    return [{type:'scatter',mode:radius===0?'markers':'lines',x:boundary.points.map(p=>p.x),y:boundary.points.map(p=>p.y),
      fill:radius===0?undefined:'toself',fillcolor:'#b3ddd04d',line:{color:'#25775b',width:2},marker:{size:9,color:'#25775b'},hoverinfo:'skip'},
      segment([0,0],data.delta,'Differenza fra punti','#176c98'),
      segment([0,0],plotted,'Differenza gradienti / L'),
      point(...data.delta,'δ = differenza fra punti','#176c98'),point(...plotted,'Δg / L')];
  },[data,refined]);
  const layout={xaxis:{title:{text:'Componente 1 [1]'},range:[-.6,1.6],constrain:'domain'},
    yaxis:{title:{text:'Componente 2 [1]'},range:[-.6,1.6],constrain:'domain',scaleanchor:'x'}};
  return <SceneViewport id={id} traces={traces} layout={layout} label={refined?'Disco del limite combinato':'Disco della cocoercività'} height={315} fontSize={22}/>;
}
/** One quadratic supplies the vector comparison, both graph views and all readouts. */
function SmoothGradient({definition}:CompanionRendererProps){
  const refined=definition.source_page===18,prefix=refined?'opt18':'opt17';
  const state=useLessonParameters(definition),mu=refined?state.numbers[0]:1,L=state.numbers[refined?1:0],angle=state.numbers[refined?2:1];
  const d=useMemo(()=>smoothQuadratic(mu,L,angle,refined),[mu,L,angle,refined]);
  const grid=useMemo(()=>functionGrid('optimization-'+prefix,d.value,-1.1,1.1),[d]);
  const points=useMemo(()=>[{id:'optimization-'+prefix+'-A',x:d.delta[0],y:d.delta[1],z:d.value(...d.delta)},{id:'optimization-'+prefix+'-B',x:0,y:0,z:0}],[prefix,d]);
  return <LessonFrame definition={definition} className={className} explanation={null}
    formula={<FormulaDeck definition={definition} primaryId={refined?'opt18-refined':'opt17-cocoercive'}
      primaryLatex={refined?String.raw`\begin{gathered}(\nabla\ell(z_A)-\nabla\ell(z_B))^\top(z_A-z_B)\\\ge\ \gamma_1\|z_A-z_B\|^2+\gamma_2\|\nabla\ell(z_A)-\nabla\ell(z_B)\|^2\end{gathered}`:
        String.raw`(\nabla\ell(z_A)-\nabla\ell(z_B))^\top(z_A-z_B)\ge\frac1L\|\nabla\ell(z_A)-\nabla\ell(z_B)\|^2`}/>}
    legend="Esempio aggiunto · blu: differenza fra punti · arancio: Δg/L · disco normalizzato."
    visual={<FunctionExplorer id={'optimization-'+prefix+'-smooth'} grid={grid} points={points} policy={definition.visualization.visualizationMode}
      camera={definition.visualization.presentation.camera} height={315} fontSize={22}
      twoDView={<GradientDisk id={'optimization-'+prefix+'-disk'} data={d} refined={refined}/>}/>}
    controls={<LessonControls definition={definition} state={state}
      hints={refined?['Modifica la curvatura','Modifica curva e disco','Ruota coppia e disco']:['Cambia la curvatura lungo z₂','Ruota la coppia a distanza uno']}/>}
    example={<><LessonEquation definition={definition} formulaId={prefix+'-example'}
      latex={refined?String.raw`\ell(z)=\frac{\mu}{2}z_1^2+\frac{\mu+L}{4}z_2^2,\quad\gamma_1=\frac{\mu L}{\mu+L},\ \gamma_2=\frac1{\mu+L}`:
        String.raw`\ell(z)=\frac12(z_1^2+Lz_2^2),\quad z_A=(\cos\varphi,\sin\varphi)^\top,\ z_B=0`}/>
      <LiveMetrics items={refined?[{id:'opt18-M',label:'Prodotto M',value:formatted(d.M)},{id:'opt18-first',label:'Termine γ₁ distanza²',value:formatted(d.gamma1)},{id:'opt18-second',label:'Termine γ₂ norma²',value:formatted(d.gamma2*d.normSquared)}]:
        [{id:'opt17-M',label:'Prodotto M',value:formatted(d.M)},{id:'opt17-rhs',label:'Norma² / L',value:formatted(d.rhs)},{id:'opt17-norm',label:'Norma Δg (≤ L)',value:formatted(d.norm)}]}/>
      <p className="lesson-caption" data-testid={prefix+'-verdict'}>{refined?(mu===L?'µ=L: disco puntiforme e confronto in uguaglianza, margine zero.':'Somma dei termini = '+formatted(d.rhs)+' · margine M − somma = '+formatted(d.margin)+'.'):'Margine della cocoercività = '+formatted(d.margin)+' · distanza fra punti = 1.'}</p>
    </>}/>;
}
const lessons=[ConvexSets,ConvexFunctions,ConstraintLab,ConstraintLab,SupportingGradient,StrictGradient,StrongGradient,SmoothGradient,SmoothGradient];
export function ConvexityLesson(props:CompanionRendererProps){
  const Lesson=lessons[props.definition.source_page-10];
  if(!Lesson)throw new RangeError('Pagina fuori dal batch B.');
  return <Lesson {...props}/>;
}
