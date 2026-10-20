import { useMemo,useState,type ReactNode } from 'react';
import type { CompanionRendererProps } from '../registry';
import type { CompanionDefinition } from '../../data/manifest';
import { InlineMath } from '../../components/CompanionPage';
import { LessonFrame,FormulaDeck,LessonEquation,FormulaContext,LessonControls,LiveMetrics,numberText,useLessonParameters } from '../LessonFrame';
import { SceneViewport,FunctionExplorer,MatrixVisualizer,GraphicViewport } from '../../visualization';
import type { Point } from '../../numeric-data/types';
import { wellCost,doubleWell,plateauCost,scalarQuadratic,coupledQuadratic,vectorFunction,stationaryExample,stationaryNames,localSufficiency,curveData,functionGrid } from '../../math/optimizationFoundations';
import '../../styles/optimization.css';

const rememberedChoices=new Map<string,number>();
function useChoice(definition:CompanionDefinition,name:string,initial:number){
  const key=definition.page_id+':'+name;
  const [value,setValue]=useState(()=>rememberedChoices.get(key)??initial);
  const update=(next:number)=>{rememberedChoices.set(key,next);setValue(next);};
  return {value,update,reset:()=>update(initial)};
}
function Choice({label,value,options,onChange}:{label:string;value:number;options:readonly string[];onChange:(v:number)=>void}){
  return <label className="opt-choice"><span>{label}</span><select aria-label={label} value={value} onChange={e=>onChange(Number(e.target.value))}>
    {options.map((name,i)=><option key={name} value={i}>{name}</option>)}
  </select></label>;
}
const wrapper='optimization-lesson';
const curveTrace=(fn:(x:number)=>number,low:number,high:number,color='#176c98')=>{
  const curve=curveData('Profilo del costo',fn,low,high);
  return {type:'scatter',mode:'lines',name:'Costo',x:curve.points.map(p=>p.x),y:curve.points.map(p=>p.y),line:{color,width:3},hovertemplate:'z=%{x:.3f}<br>costo=%{y:.4f}<extra></extra>'};
};
function PointReadout({label,children}:{label:string;children:ReactNode}){
  return <div className="opt-reading"><strong>{label}</strong><span>{children}</span></div>;
}

function Orientation({definition}:CompanionRendererProps){
  return <LessonFrame definition={definition} className={wrapper}
    visual={<div className="course-orientation opt-orientation">
      <p className="course-author">Prof. Giuseppe Notarstefano</p><p className="lesson-caption">Università di Bologna · Optimal Control and Reinforcement Learning</p>
      <ol>{[['01','Definire la soluzione','Dove il costo è più basso? Locale o globale?'],['02','Leggere la geometria','Gradienti, curvature e condizioni di ottimalità.'],['03','Costruire un metodo','Direzione, passo e iterazioni.'],['04','Rispettare i vincoli','Ammissibilità, condizioni KKT e metodi vincolati.']].map(([n,title,text])=><li key={n}><strong>{n}</strong><div><h2>{title}</h2><p>{text}</p></div></li>)}</ol>
      <p className="lesson-caption">Percorso di lettura aggiunto. Le slide originali sono per uso interno al corso.</p>
    </div>}/>;
}
function SectionOpening({definition}:CompanionRendererProps){
  return <LessonFrame definition={definition} className={wrapper}
    visual={<><div className="opt-section-cards">
      <section><span className="opt-step-number">01</span><h2>Che cosa cerchiamo?</h2><p>Un punto che minimizzi il costo. Prima distinguiamo locale, globale e stretto.</p></section>
      <section><span className="opt-step-number">02</span><h2>Come riconoscerlo?</h2><p>Studiamo condizioni necessarie e sufficienti, dichiarando sempre le ipotesi.</p></section>
      <section><span className="opt-step-number">03</span><h2>Quali problemi aiutano?</h2><p>Convessità e struttura quadratica danno informazioni ulteriori sul problema.</p></section>
    </div><p className="lesson-caption">Orientamento aggiunto al titolo della sezione; i risultati vengono introdotti nelle pagine successive.</p></>}
    example={<div className="concept-pair"><section><h2>Riconoscere</h2><p>Quali proprietà deve avere una soluzione?</p></section><section><h2>Cercare</h2><p>Quali operazioni ci portano verso una soluzione?</p></section></div>}/>;
}
function LocalAndGlobal({definition}:CompanionRendererProps){
  const state=useLessonParameters(definition),[tilt,radius]=state.numbers,choice=useChoice(definition,'well',0);
  const data=useMemo(()=>doubleWell(tilt,choice.value,radius),[tilt,radius,choice.value]);
  const traces=useMemo(()=>[curveTrace(z=>wellCost(z,tilt),-1.8,1.8),{
    type:'scatter',mode:'markers',name:'Punti critici',x:data.critical,y:data.critical.map(z=>wellCost(z,tilt)),marker:{size:9,color:'#78909e'},
  },{type:'scatter',mode:'markers',name:'Punto selezionato',x:[data.candidate],y:[data.cost],marker:{size:14,color:'#cf6b24',line:{color:'white',width:2}}}], [tilt,data]);
  const layout=useMemo(()=>({xaxis:{title:{text:'z [1]'},range:[-1.8,1.8]},yaxis:{title:{text:'ℓ(z) [valore]'},range:[-.65,4.2]},
    shapes:[{type:'rect',xref:'x',yref:'paper',x0:data.candidate-radius,x1:data.candidate+radius,y0:0,y1:1,fillcolor:'#12687916',line:{width:0},layer:'below'},
      {type:'line',x0:-1.8,x1:1.8,y0:data.cost,y1:data.cost,line:{color:'#cf6b24',width:1,dash:'dash'}}]}),[data,radius]);
  const local=data.local?'locale stretto':'non è un minimo';
  const global=data.global?(data.strictGlobal?'globale stretto':'globale, con pareggio'):'non globale';
  return <LessonFrame definition={definition} className={wrapper} explanation={null}
    formula={<FormulaDeck definition={definition} primaryId="opt03-local"/>}
    legend="Esempio aggiunto · zona colorata: intorno aperto; curva mostrata in un ritaglio."
    visual={<><div className="opt-comparison-strip"><span><strong>Locale</strong> · vicino al punto</span><span><strong>Globale</strong> · tutto lo spazio</span></div>
      <SceneViewport id="optimization-p03-wells" label="Due pozzi e confronto locale globale" traces={traces} layout={layout} height={300} fontSize={22}/>
      <p className="lesson-caption">{data.neighborhoodValid?'In questo intorno il candidato non ha concorrenti meno costosi.':data.local?'Questo raggio include punti meno costosi: per un minimo locale basta un intorno più piccolo.':'Ci sono punti meno costosi arbitrariamente vicini: questo candidato non è un minimo.'}</p></>}
    controls={<LessonControls definition={definition} state={{...state,reset:()=>{state.reset();choice.reset();}}}
      hints={['Rompe o ripristina il pareggio fra i pozzi','Cambia il confronto, non la funzione']}
      extra={<Choice label="Punto da classificare" value={choice.value} options={['Pozzo sinistro','Pozzo destro','Cima intermedia']} onChange={choice.update}/>}/>}
    example={<><LessonEquation definition={definition} formulaId="opt03-example"/>
      <LiveMetrics items={[{id:'opt03-point',label:'Punto selezionato',value:numberText(data.candidate,3)},{id:'opt03-left',label:'Costo pozzo sinistro',value:numberText(data.leftCost,3)},{id:'opt03-right',label:'Costo pozzo destro',value:numberText(data.rightCost,3)}]}/>
      <p className="opt-verdict" data-testid="opt03-classification">{local} · {global}</p>
    </>}/>;
}
function PlateauAndSign({definition}:CompanionRendererProps){
  const state=useLessonParameters(definition),choice=useChoice(definition,'point',2),sign=useChoice(definition,'sign',0);
  const x=[-2,0,2.5][choice.value],factor=sign.value?-1:1,value=factor*plateauCost(x);
  const traces=useMemo(()=>[curveTrace(z=>factor*plateauCost(z),-3.2,4.2),{type:'scatter',mode:'markers',name:'Punto selezionato',x:[x],y:[value],marker:{size:14,color:'#cf6b24'}}],[factor,x,value]);
  const verdict=choice.value===2?'Minimo e massimo locale non stretto':choice.value===0?(sign.value?'Massimo globale stretto':'Minimo globale stretto'):(sign.value?'Minimo locale stretto':'Massimo locale stretto');
  return <LessonFrame definition={definition} className={wrapper} explanation={null}
    formula={<FormulaDeck definition={definition} primaryId="opt04-sign"/>}
    legend="Profilo costruito per l’esempio: illustra la figura, senza attribuirle dati numerici."
    visual={<SceneViewport id="optimization-p04-plateau" label="Profilo con plateau e inversione del segno" traces={traces}
      layout={{xaxis:{title:{text:'z [1]'},range:[-3.2,4.2]},yaxis:{title:{text:sign.value?'−ℓ(z) [valore]':'ℓ(z) [valore]'},range:[-3.5,3.5]}}} height={350} fontSize={22}/>}
    controls={<LessonControls definition={definition} state={{...state,reset:()=>{choice.reset();sign.reset();}}} extra={<>
      <Choice label="Punto del profilo" value={choice.value} options={['z = −2 · fondo sinistro','z = 0 · cima','z = 2.5 · tratto piatto']} onChange={choice.update}/>
      <Choice label="Funzione visualizzata" value={sign.value} options={['ℓ(z)','−ℓ(z)']} onChange={sign.update}/>
    </>}/>}
    example={<><LiveMetrics items={[{id:'opt04-point',label:'Decisione selezionata',value:numberText(x,1)},{id:'opt04-value',label:'Valore visualizzato',value:numberText(value,2)}]}/>
      <p className="opt-verdict" data-testid="opt04-classification">{verdict}</p><p className="lesson-caption">Nell’interno del plateau, i punti vicini pareggiano: la parola “stretto” non si applica.</p>
      <FormulaContext definition={definition} formulaId="opt04-profile">Modello del profilo disponibile nei dettagli; il grafico è un ritaglio della funzione.</FormulaContext>
    </>}/>;
}
function PointAndValue({definition}:CompanionRendererProps){
  const state=useLessonParameters(definition),[a,c]=state.numbers;
  const traces=useMemo(()=>[curveTrace(z=>scalarQuadratic(z,a,c),-3,3),{type:'scatter',mode:'markers',name:'Minimo',x:[a],y:[c],marker:{size:14,color:'#cf6b24'}}],[a,c]);
  const layout=useMemo(()=>({xaxis:{title:{text:'z [1]'},range:[-3,3]},yaxis:{title:{text:'ℓ(z) [valore]'},range:[-1.5,8]},shapes:[
    {type:'line',x0:a,x1:a,y0:0,y1:c,line:{color:'#cf6b24',dash:'dash'}},{type:'line',x0:0,x1:a,y0:c,y1:c,line:{color:'#8057a5',dash:'dash'}}]}),[a,c]);
  return <LessonFrame definition={definition} className={wrapper} explanation={null}
    formula={<FormulaDeck definition={definition} primaryId="opt05-value"/>}
    legend={<span>Argmin → punto <InlineMath latex="z^*"/> · Min → valore <InlineMath latex="\ell(z^*)"/>.</span>}
    visual={<SceneViewport id="optimization-p05-min-argmin" label="Coordinate del minimizzatore e del valore ottimo" traces={traces} layout={layout} height={340} fontSize={22}/>}
    controls={<LessonControls definition={definition} state={state} hints={['Sposta z*, conserva il costo minimo','Sposta il costo minimo, conserva z*']}/>}
    example={<><LessonEquation definition={definition} formulaId="opt05-example"/>
      <LiveMetrics items={[{id:'opt05-argmin',label:'Minimizzatore z*',value:numberText(a,2)},{id:'opt05-min',label:'Valore ottimo ℓ(z*)',value:numberText(c,2)},{id:'opt05-zero',label:'Costo in z=0',value:numberText(scalarQuadratic(0,a,c),2)}]}/>
      <p className="lesson-caption">La parabola ha sempre un unico minimizzatore. In altri problemi argmin può essere un insieme di punti.</p>
    </>}/>;
}
function ScalarDerivatives({definition}:CompanionRendererProps){
  const state=useLessonParameters(definition),[x,y,rho]=state.numbers;
  const data=useMemo(()=>coupledQuadratic(x,y,rho),[x,y,rho]);
  const grid=useMemo(()=>functionGrid('optimization-derivatives',(a,b)=>coupledQuadratic(a,b,rho).value,-2,2,'r(z)'),[rho]);
  const points=useMemo<Point[]>(()=>[{id:'optimization-p06-point',x,y,z:data.value}],[x,y,data.value]);
  const length=Math.hypot(...data.gradient),normalization=.45/Math.max(1,length);
  const twoDTraces=useMemo(()=>[{
    type:'contour',x:grid.x,y:grid.y,z:grid.z,colorscale:'Viridis',contours:{coloring:'heatmap',showlabels:true},colorbar:{title:{text:'r(z)'}},
  },{type:'scatter',mode:'lines+markers',x:[x,x+normalization*data.gradient[0]],y:[y,y+normalization*data.gradient[1]],line:{color:'#cf6b24',width:4},marker:{size:[9,length<1e-12?0:12],symbol:['circle','arrow'],angleref:'previous'}}],[grid,x,y,data.gradient,normalization,length]);
  return <LessonFrame definition={definition} className={wrapper} explanation={null}
    formula={<FormulaDeck definition={definition} primaryId="opt06-hessian" warnings
      primaryLatex="(\nabla^2(r(z)))_{ij}=\frac{\partial^2r(z)}{\partial z_i\partial z_j},\quad i,j=1,\ldots,d"/>}
    legend="Esempio aggiunto · 2D: gradiente con freccia normalizzata · 3D: quota r(z)."
    visual={<FunctionExplorer id="optimization-p06-explorer" grid={grid} points={points} policy="3D_PRIMARY_WITH_2D" camera={definition.visualization.presentation.camera} height={290} fontSize={22}
      twoDView={<SceneViewport id="optimization-p06-contour" label="Livelli e direzione del gradiente" traces={twoDTraces}
        layout={{xaxis:{title:{text:'z₁ [1]'},range:[-2,2],constrain:'domain'},yaxis:{title:{text:'z₂ [1]'},range:[-2,2],scaleanchor:'x',constrain:'domain'}}} height={290} fontSize={22}/>}/>}
    controls={<LessonControls definition={definition} state={state} hints={['Muove punto e gradiente','Muove punto e gradiente','Cambia accoppiamento']}/>}
    example={<><LessonEquation definition={definition} formulaId="opt06-example" latex="r(z)=\tfrac12(z_1^2+2\rho z_1z_2+2z_2^2)"/>
      <div className="opt-derivative-values" data-formula-reference="opt06-example">
        <PointReadout label="Valore r(z)"><output data-testid="opt06-value">{numberText(data.value,3)}</output></PointReadout>
        <PointReadout label="Gradiente colonna"><InlineMath latex={String.raw`\begin{bmatrix}${data.gradient.map(v=>numberText(v,2)).join(String.raw`\\`)}\end{bmatrix}`}/></PointReadout>
        <PointReadout label="Hessiana"><InlineMath latex={String.raw`\begin{bmatrix}1&${numberText(rho,2)}\\${numberText(rho,2)}&2\end{bmatrix}`}/></PointReadout>
      </div>
    </>}/>;
}
function VectorDerivatives({definition}:CompanionRendererProps){
  const state=useLessonParameters(definition),[x,y]=state.numbers,cell=useChoice(definition,'cell',1);
  const data=useMemo(()=>vectorFunction(x,y),[x,y]),i=Math.floor(cell.value/3),j=cell.value%3;
  return <LessonFrame definition={definition} className={wrapper} explanation={null}
    formula={<FormulaDeck definition={definition} primaryId="opt07-convention"/>}
    legend="Esempio aggiunto · d=2 variabili, m=3 componenti · seleziona una cella per ritrovarla nella trasposta."
    visual={<GraphicViewport label="Gradiente del corso e Jacobiano trasposto"><div className="opt-matrix-pair">
      <section><h2>∇r · convenzione del corso</h2><MatrixVisualizer label="Gradiente 2 per 3" values={data.gradient} rowLabels={['z₁','z₂']} columnLabels={['r₁','r₂','r₃']} selected={[i,j]} onSelect={(r,c)=>cell.update(r*3+c)}/><p>2 righe × 3 colonne</p></section>
      <section><h2>Jᵣ = (∇r)ᵀ</h2><MatrixVisualizer label="Jacobiano 3 per 2" values={data.jacobian} rowLabels={['r₁','r₂','r₃']} columnLabels={['z₁','z₂']} selected={[j,i]} onSelect={(r,c)=>cell.update(c*3+r)}/><p>3 righe × 2 colonne</p></section>
    </div></GraphicViewport>}
    controls={<LessonControls definition={definition} state={{...state,reset:()=>{state.reset();cell.reset();}}} hints={['Aggiorna entrambe le matrici','Conserva la corrispondenza trasposta']}/>}
    example={<><LessonEquation definition={definition} formulaId="opt07-example" latex="r(z)=\begin{bmatrix}z_1^2+z_2\\z_1z_2\\2z_2\end{bmatrix}"/>
      <p className="opt-verdict" data-testid="opt07-selected">∂r{['₁','₂','₃'][j]}/∂z{['₁','₂'][i]} = {numberText(data.gradient[i][j],2)} in entrambe le matrici.</p>
      <FormulaContext definition={definition} formulaId="opt07-jacobian">La trasposizione cambia la posizione della derivata, non il suo valore.</FormulaContext>
    </>}/>;
}
function NecessaryConditions({definition}:CompanionRendererProps){
  const state=useLessonParameters(definition),choice=useChoice(definition,'case',1),data=useMemo(()=>stationaryExample(choice.value),[choice.value]);
  const grid=useMemo(()=>functionGrid('optimization-stationarity',data.fn,-1,1),[data]);
  const points=useMemo(()=>[{id:'optimization-p08-origin',x:0,y:0,z:0}],[]);
  return <LessonFrame definition={definition} className={wrapper} explanation={null}
    formula={<FormulaDeck definition={definition} primaryId="opt08-necessary"/>}
    legend="Ipotesi della fonte: C¹ per il gradiente, C² per la Hessiana. Esempi polinomiali aggiunti, punto fisso z=0."
    visual={<FunctionExplorer id="optimization-p08-explorer" policy="3D_PRIMARY_WITH_2D" camera={definition.visualization.presentation.camera} grid={grid} points={points} height={315} fontSize={22}/>}
    controls={<LessonControls definition={definition} state={{...state,reset:choice.reset}} extra={<Choice label="Funzione dell’esempio" value={choice.value} options={stationaryNames} onChange={choice.update}/>}/>}
    example={<><LessonEquation definition={definition} formulaId={'opt08-preset-'+choice.value}/>
      <LiveMetrics items={[{id:'opt08-first',label:'Gradiente nullo?',value:'sì'},{id:'opt08-eigenvalues',label:'Autovalori Hessiana',value:data.eigenvalues.join(', ')},{id:'opt08-second',label:'H semidefinita ≥0?',value:data.semidefinite?'sì':'no'}]}/>
      <p className="opt-verdict" data-testid="opt08-classification">Nel modello: {data.classification}.</p>
    </>}/>;
}
function SufficientConditions({definition}:CompanionRendererProps){
  const state=useLessonParameters(definition),[alpha,beta]=state.numbers,data=useMemo(()=>localSufficiency(alpha,beta),[alpha,beta]);
  const grid=useMemo(()=>functionGrid('optimization-sufficiency',data.fn,-1.5,1.5),[data]);
  const points=useMemo(()=>[{id:'optimization-p09-origin',x:0,y:0,z:0},{id:'optimization-p09-comparison',x:0,y:1,z:data.comparison}],[data.comparison]);
  const verdict=data.positiveDefinite?'Il teorema garantisce un minimo locale stretto.':'Il test sufficiente non si applica: occorre studiare il modello.';
  return <LessonFrame definition={definition} className={wrapper} explanation={null}
    formula={<FormulaDeck definition={definition} primaryId="opt09-sufficient"
      primaryLatex="\nabla\ell(z^\star)=0,\ \nabla^2\ell(z^\star)>0\ \Longrightarrow\ z^\star\text{ minimo locale stretto}"/>}
    legend="ℓ∈C² in un intorno del punto. Esempio aggiunto: origine e punto di confronto (0,1)."
    visual={<FunctionExplorer id="optimization-p09-explorer" grid={grid} points={points} policy="3D_PRIMARY_WITH_2D" camera={definition.visualization.presentation.camera} height={300} fontSize={22}/>}
    controls={<LessonControls definition={definition} state={state} hints={['Secondo autovalore al punto','Cambia il termine quartico, non H(0)']}/>}
    example={<><LessonEquation definition={definition} formulaId="opt09-example"
      latex="\ell(z)=\tfrac12(z_1^2+\alpha z_2^2)+\beta z_2^4"/>
      <LiveMetrics items={[{id:'opt09-hessian',label:'Autovalori H(0)',value:'1, '+numberText(alpha,1)},{id:'opt09-origin',label:'Costo nell’origine',value:'0'},{id:'opt09-comparison',label:'Costo in (0,1)',value:numberText(data.comparison,2)}]}/>
      <p className="opt-verdict" data-testid="opt09-verdict">{verdict}</p>
      <p className="lesson-caption" data-testid="opt09-classification">Nel modello: {data.classification}{data.global?' globale':data.unbounded?' · costo illimitato inferiormente':''}.</p>
    </>}/>;
}

const lessons=[Orientation,SectionOpening,LocalAndGlobal,PlateauAndSign,PointAndValue,ScalarDerivatives,VectorDerivatives,NecessaryConditions,SufficientConditions];
export function OptimizationLesson(props:CompanionRendererProps){
  const Lesson=lessons[props.definition.source_page-1];
  if(!Lesson)throw new RangeError('Pagina Optimization non implementata in questo batch.');
  return <Lesson {...props}/>;
}
