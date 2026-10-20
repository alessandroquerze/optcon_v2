import type { FormulaExplanation } from '../components/ExplainedEquation';
import type { CompanionDefinition } from '../data/manifest';
import { extendedFormulaNotes } from './extendedFormulaNotes';
import { optimizationFormulaNotes } from './optimization/formulaNotes';
import { convexityFormulaNotes } from './optimization/convexityNotes';
import { minimizationFormulaNotes } from './optimization/minimizationNotes';
import { descentFormulaNotes } from './optimization/descentNotes';
import { newtonFormulaNotes } from './optimization/newtonNotes';
import { stepSizeFormulaNotes } from './optimization/stepSizeNotes';
import { projectionFormulaNotes } from './optimization/projectionNotes';
import { kktFormulaNotes } from './optimization/kktNotes';
import { constrainedQpFormulaNotes } from './optimization/constrainedQpNotes';
import { sqpFormulaNotes } from './optimization/sqpNotes';
import { meritFormulaNotes } from './optimization/meritNotes';
import { documentFromId } from '../data/documents';

type Notes = Omit<FormulaExplanation, 'formulaId' | 'latex' | 'origin' | 'sourceFormulaIds'>;
export type Entry = Partial<Notes> & Pick<Notes, 'conceptualExplanation' | 'purpose'> & {
  latex?: string; origin?: FormulaExplanation['origin']; sourceFormulaIds?: readonly string[];
};
const symbols = (...entries: readonly [string, string][]) => entries.map(([symbol, meaning]) => ({ symbol, meaning }));
const parameters = (...entries: readonly [string, string][]) => entries.map(([controlId, explanation]) => ({ controlId, explanation }));

/** Companion enrichment only. Validated PAGE_SPEC, manifest and source literals remain immutable. */
export const introductionFormulaNotes: Readonly<Record<number, Readonly<Record<string, Entry>>>> = {
  2: {
    'p02-example-choice': {
      latex: 'J(u)=(u-1)^2,\\qquad |u|\\leq0.6',
      conceptualExplanation: 'Il costo misura quanto la scelta u si allontana dall’obiettivo 1; il limite esclude le scelte troppo grandi. Perciò la migliore scelta ammessa è 0.6, anche se il suo costo non è zero.',
      purpose: 'Separare la preferenza espressa dal costo dall’ammissibilità imposta dal vincolo.',
      symbolDefinitions: symbols(['u', 'Decisione scalare dell’esempio, senza una dinamica.'], ['J', 'Costo da minimizzare, non una misura di stabilità.']),
      assumptions: ['Obiettivo 1 e limite 0.6 fissati soltanto per questo esempio aggiunto.'],
      optionalDetails: ['Senza vincolo si può raggiungere il bersaglio; con il vincolo si sceglie il punto dell’intervallo più vicino al bersaglio.'],
    },
  },
  8: {
    'p08-source-math-1': {
      conceptualExplanation: 'L’ingresso cambia lo stato a partire da x⁰: f ne determina la velocità di cambiamento, non direttamente lo stato futuro.',
      purpose: 'Determinare la traiettoria dello stato a partire da un ingresso e da uno stato iniziale.',
      symbolDefinitions: symbols(['t', 'Tempo continuo.'], ['x(t)', 'Stato del sistema.'], ['u(t)', 'Ingresso applicato.'], ['f', 'Mappa che determina la derivata dello stato.'], ['x^0', 'Stato assegnato al tempo zero.']),
      assumptions: ['La sola notazione non garantisce esistenza o unicità: servono ipotesi di regolarità sul modello e sull’ingresso.'],
      relatedFormulaIds: ['p08-source-math-2', 'p08-source-math-3'],
    },
    'p08-source-math-2': {
      conceptualExplanation: 'La mappa h descrive ciò che il modello rende osservabile: l’uscita può dipendere sia dallo stato sia dall’ingresso. In generale l’uscita non coincide con lo stato.',
      purpose: 'Collegare l’evoluzione interna alla quantità che si vuole misurare o controllare.',
      symbolDefinitions: symbols(['y(t)', 'Uscita.'], ['h', 'Mappa di uscita, distinta dalla dinamica f.']),
      relatedFormulaIds: ['p08-source-math-1', 'p08-source-math-3'],
    },
    'p08-source-math-3': {
      conceptualExplanation: 'Stato, ingresso e uscita possono contenere numeri diversi di componenti: conoscere l’uscita non equivale quindi a conoscere tutto lo stato.',
      purpose: 'Controllare che le dimensioni dei vettori e delle mappe siano compatibili.',
      symbolDefinitions: symbols(['n,m,p', 'Numeri di componenti rispettivamente dello stato, dell’ingresso e dell’uscita.'], ['\\mathbb R^n', 'Spazio dei vettori reali con n componenti.']),
    },
    'p08-source-math-5': {
      conceptualExplanation: 'La stessa coppia stato–ingresso produce la stessa derivata a qualunque istante. Questa invarianza della legge non obbliga lo stato a rimanere costante.',
      purpose: 'Distinguere un modello senza dipendenza esplicita dal tempo da una traiettoria costante.',
      symbolDefinitions: symbols(['f', 'Legge dinamica senza argomento temporale esplicito.']),
      relatedFormulaIds: ['p08-source-math-1'],
    },
    'p08-enrichment-0': {
      conceptualExplanation: 'Per a>0 lo stato tende a u/a, attenuando l’effetto iniziale. Per a=0 manca il richiamo e l’ingresso accumula stato nel tempo.',
      purpose: 'Confrontare una risposta analitica con la famiglia di curve mostrata, senza errori di integrazione.',
      symbolDefinitions: symbols(['a', 'Intensità del richiamo verso l’equilibrio, in s⁻¹.'], ['u', 'Ingresso costante, in unità di stato/s.'], ['x^0', 'Valore iniziale.'], ['y=x', 'Scelta di uscita valida solo in questo esempio.']),
      assumptions: ['Modello scalare aggiunto; a≥0, ingresso costante e tempo non negativo.', 'La divisione per a è usata solo per a>0; a=0 usa il ramo integratore.'],
      parameterInterpretation: parameters(['p08-control-1', 'a aumenta la rapidità del decadimento, ma cambia anche l’equilibrio u/a: non garantisce che ogni valore di x diminuisca.'], ['p08-control-2', 'u seleziona una sezione della famiglia e sposta la risposta.'], ['p08-control-3', 'x⁰ sposta la partenza; il suo effetto decade per a>0 e persiste per a=0.']),
      graphExplanation: 'Modello aggiunto ẋ=−ax+u, y=x: −ax richiama verso zero, u agisce sullo stato. Il terzo asse 3D è x(t;u).',
    },
  },
  12: {
    'p12-source-math-0': {
      conceptualExplanation: 'La mappa discreta trasforma stato e azione attuali nello stato del passo successivo. Cambiare l’ingresso può quindi modificare tutta la sequenza futura.',
      purpose: 'Definire la dinamica da confrontare con la sua approssimazione locale.',
      symbolDefinitions: symbols(['t\\in\\mathbb N_0', 'Indice intero non negativo, non tempo continuo.'], ['f_t', 'Mappa di transizione al passo t.']),
      relatedFormulaIds: ['p12-source-math-1'],
    },
    'p12-source-math-1': {
      conceptualExplanation: 'Il riferimento nominale è una traiettoria realizzabile dal modello. Questa coerenza permette di sottrarre la sua evoluzione quando si studiano piccole perturbazioni.',
      purpose: 'Fissare il punto di confronto per la linearizzazione.',
      symbolDefinitions: symbols(['\\bar x_t,\\bar u_t', 'Stato e ingresso della traiettoria nominale.']),
      assumptions: ['Una traiettoria nominale non è necessariamente un equilibrio.'],
      relatedFormulaIds: ['p12-source-math-0', 'p12-enrichment-0'],
    },
    'p12-source-math-2': {
      conceptualExplanation: 'Aₜ e Bₜ misurano le sensibilità locali: prevedono come piccoli scarti di stato e ingresso cambiano il passo successivo.',
      purpose: 'Sostituire localmente una mappa nonlineare con una relazione lineare più semplice.',
      symbolDefinitions: symbols(['\\Delta x_t,\\Delta u_t', 'Scarti rispetto alla traiettoria nominale, non passi temporali.'], ['A_t,B_t', 'Jacobiani rispetto a stato e ingresso.']),
      assumptions: ['Dinamica differenziabile presso la nominale; è un’approssimazione al primo ordine, non un’identità globale per la dinamica nonlineare.'],
      optionalDetails: ['La slide scrive l’uguaglianza per il sistema lineare delle variazioni; i termini di ordine superiore sono esclusi da quel modello. Anche se f non dipende esplicitamente da t, i Jacobiani possono cambiare lungo la nominale.'],
      relatedFormulaIds: ['p12-source-math-1', 'p12-enrichment-0', 'p12-enrichment-1'],
    },
    'p12-enrichment-0': {
      conceptualExplanation: 'Sottrarre la nominale separa la deviazione dal movimento già previsto. Uno scarto nullo indica coincidenza con il riferimento a quel passo.',
      purpose: 'Esprimere il problema in coordinate locali.',
      symbolDefinitions: symbols(['\\Delta', 'Differenza rispetto al valore nominale.'], ['\\bar x_t,\\bar u_t', 'Riferimenti di stato e ingresso.']),
      relatedFormulaIds: ['p12-source-math-1', 'p12-source-math-2'],
    },
    'p12-enrichment-1': {
      conceptualExplanation: 'Le derivate misurano quanto il prossimo stato è sensibile a ciascuna variabile, tenendo ferma l’altra. Valutarle sulla nominale dà la pendenza del piano tangente.',
      purpose: 'Costruire le matrici del modello lineare delle variazioni.',
      symbolDefinitions: symbols(['\\partial f_t/\\partial x', 'Jacobiano rispetto allo stato.'], ['\\partial f_t/\\partial u', 'Jacobiano rispetto all’ingresso.']),
      assumptions: ['Derivate esistenti nel punto nominale; nessuna garanzia di stabilità deriva da questa sola costruzione.'],
      relatedFormulaIds: ['p12-source-math-2'],
    },
    'p12-enrichment-2': {
      conceptualExplanation: 'Il piano trascura la curvatura (Δx)²: lo scarto cresce con |Δx|. Cambiare Δu trasla entrambe le previsioni allo stesso modo.',
      purpose: 'Misurare l’errore di un passo della linearizzazione con un esempio calcolabile esattamente.',
      symbolDefinitions: symbols(['f(x,u)=x^2+u', 'Mappa scalare aggiunta.'], ['(\\bar x,\\bar u)=(1,0)', 'Nominale fissa: f(1,0)=1, A=2, B=1.']),
      assumptions: ['Confronto locale di un passo, senza stima globale o garanzie di stabilità.'],
      parameterInterpretation: parameters(['p12-control-1', 'Δx muove il punto; lo scarto è esattamente (Δx)² per questa mappa.'], ['p12-control-2', 'Δu cambia la sezione; non cambia lo scarto in questo esempio additivo.']),
      graphExplanation: 'L’altezza è la variazione futura di stato; la sezione 2D confronta superficie esatta e piano tangente.',
      relatedFormulaIds: ['p12-enrichment-1', 'p12-example-error'],
    },
    'p12-example-error': {
      latex: '\\Delta x_{t+1}^{\\rm exact}-\\Delta x_{t+1}^{\\rm lin}=(\\Delta x)^2',
      conceptualExplanation: 'Lo scarto misura ciò che il piano tangente trascura: qui è sempre non negativo e si annulla se Δx=0, anche con Δu diverso da zero.',
      purpose: 'Interpretare la distanza verticale tra le due previsioni, senza dividere per una variazione eventualmente nulla.',
      relatedFormulaIds: ['p12-enrichment-2'],
    },
  },
  16: {
    'p16-source-math-0': {
      conceptualExplanation: 'La distanza quadratica penalizza l’allontanamento dal punto assegnato in tutte le direzioni allo stesso modo. Scarti di segno opposto hanno lo stesso costo.',
      purpose: 'Misurare una deviazione vettoriale con un costo scalare non negativo.',
      symbolDefinitions: symbols(['z,\\bar z', 'Decisione e riferimento in uno spazio di dimensione d.'], ['\\ell', 'Costo.'], ['\\top', 'Trasposizione del vettore.']),
      relatedFormulaIds: ['p16-source-math-1'],
    },
    'p16-source-math-1': {
      conceptualExplanation: 'La matrice W rende alcune deviazioni più costose di altre. Se W è simmetrica positiva definita, il solo punto a costo zero è il riferimento.',
      purpose: 'Rappresentare priorità diverse nelle componenti della decisione.',
      symbolDefinitions: symbols(['W', 'Matrice simmetrica dei pesi.'], ['\\|z-\\bar z\\|_W^2', 'Forma quadratica pesata.']),
      assumptions: ['Pesi positivi: minimo unico; con W semidefinita possono esistere direzioni non penalizzate.'],
      relatedFormulaIds: ['p16-source-math-0', 'p16-correction-0'],
    },
    'p16-source-math-2': {
      conceptualExplanation: 'La diagonale pesa separatamente i due errori; ogni barra mostra un contributo al costo totale.',
      purpose: 'Leggere separatamente le penalità delle due coordinate.',
      symbolDefinitions: symbols(['w_1,w_2', 'Pesi rispettivamente della prima e della seconda coordinata.'], ['e=z-\\bar z', 'Errore; nell’esempio è fissato a (1,1).']),
      assumptions: ['La slide assume entrambi i pesi positivi; lo zero degli slider è un’estensione semidefinita aggiunta.'],
      relatedFormulaIds: ['p16-correction-0'],
    },
    'p16-correction-0': {
      conceptualExplanation: 'Ogni errore paga il proprio peso: w₂ penalizza solo la seconda direzione. L’altezza misura il costo, non una terza decisione.',
      purpose: 'Collegare i pesi alla curvatura della superficie e ai livelli di uguale costo.',
      symbolDefinitions: symbols(['z_i-\\bar z_i', 'Scarto nella coordinata i; il riferimento è fisso a (0,0).'], ['w_i', 'Peso non negativo usato nell’esempio.'], ['1/2', 'Fattore di scala comune, incluso anche nelle barre e nel totale.']),
      assumptions: ['Due pesi strettamente positivi danno un minimo unico; uno nullo lascia una direzione libera; entrambi nulli danno costo zero ovunque.'],
      parameterInterpretation: parameters(['p16-control-1', 'w₁ cambia curvatura e contributo della prima coordinata; il punto (1,1) resta fisso.'], ['p16-control-2', 'w₂ cambia solo la seconda penalità; i livelli si restringono lungo quella direzione quando il peso aumenta.']),
      relatedFormulaIds: ['p16-source-math-1', 'p16-source-math-2'],
    },
  },
  17: {
    'p17-source-math-0': {
      conceptualExplanation: 'La disequazione ammette una regione, non solo una curva. Con a,b,c positivi è un’ellisse piena centrata nell’origine.',
      purpose: 'Decidere quali scelte appartengono all’insieme ammissibile.',
      symbolDefinitions: symbols(['z=(z_1,z_2)', 'Le due coordinate della decisione.'], ['Z', 'Insieme dei punti ammessi.'], ['a,b,c', 'Parametri reali, non obbligatoriamente positivi.']),
      assumptions: ['L’interpretazione come ellisse richiede a,b,c>0; gli slider permettono anche casi degeneri e non limitati.'],
      relatedFormulaIds: ['p17-residual'],
    },
    'p17-source-math-1': {
      conceptualExplanation: 'Un’uguaglianza ammette solo i punti che annullano esattamente la forma quadratica. A differenza della disequazione non include automaticamente una regione interna.',
      purpose: 'Descrivere un vincolo geometrico che deve essere soddisfatto con uguaglianza.',
      symbolDefinitions: symbols(['Q', 'Matrice quadrata della parte quadratica.'], ['q', 'Vettore della parte lineare.'], ['c', 'Livello scalare.'], ['d', 'Dimensione della decisione z.']),
      assumptions: ['Senza ulteriori ipotesi su Q, q e c, il luogo non è necessariamente una circonferenza o una parabola.'],
      relatedFormulaIds: ['p17-enrichment-0'],
    },
    'p17-enrichment-0': {
      conceptualExplanation: 'Cerchio fisso: solo il bordo è ammesso. Non segue gli slider.',
      purpose: 'Distinguere uguaglianza e disequazione sullo stesso esempio geometrico.',
      symbolDefinitions: symbols(['I_2', 'Matrice identità di ordine due.'], ['q=0,c=1', 'Valori locali fissi dell’inserto, distinti dai parametri correnti del grafico principale.']),
      assumptions: ['Confronto unitario fisso: non segue a, b e c degli slider.'],
      relatedFormulaIds: ['p17-source-math-1'],
    },
    'p17-residual': {
      latex: 'g(z)=az_1^2+bz_2^2-c,\\qquad z\\in Z\\iff g(z)\\leq0',
      conceptualExplanation: 'L’altezza 3D è il residuo g: sotto zero i punti sono ammessi. Il livello zero non è sempre il bordo dell’insieme.',
      purpose: 'Collegare la maschera 2D al segno della stessa funzione mostrata in 3D.',
      symbolDefinitions: symbols(['g', 'Residuo della disequazione, non costo e non terza variabile decisionale.']),
      assumptions: ['La griglia è un ritaglio: non dimostra limitatezza.', 'La classificazione numerica usa tolleranza assoluta 10⁻⁹; un insieme analiticamente vuoto resta vuoto.'],
      parameterInterpretation: parameters(['p17-control-1', 'a cambia la curvatura lungo z₁; se cambia segno può cambiare la natura dell’insieme.'], ['p17-control-2', 'b agisce analogamente lungo z₂.'], ['p17-control-3', 'Aumentare c abbassa g ovunque: l’insieme non può restringersi, ma può già essere vuoto o tutto il piano.']),
      relatedFormulaIds: ['p17-source-math-0'],
    },
  },
  27: {
    'p27-source-math-0': {
      conceptualExplanation: 'Euler mantiene la derivata iniziale per δ secondi e avanza lo stato. Approssima così il moto continuo.',
      purpose: 'Ottenere una mappa discreta utilizzabile per calcolare una sequenza di stati.',
      symbolDefinitions: symbols(['f_{\\rm CT}', 'Dinamica continua, valutata sul vecchio stato e ingresso.'], ['f_t', 'Intera mappa discreta, incluso xₜ.'], ['\\delta', 'Passo temporale positivo, distinto dalla perturbazione Δ.']),
      assumptions: ['Ridurre δ migliora l’accuratezza sotto le usuali ipotesi di regolarità e convergenza; non garantisce stabilità per qualunque modello e passo.'],
      relatedFormulaIds: ['p27-source-math-1', 'p27-source-math-2', 'p27-enrichment-0'],
    },
    'p27-source-math-1': {
      conceptualExplanation: 'Il passo positivo fissa quanto tempo fisico trascorre tra due campioni. Un passo più piccolo produce più aggiornamenti nella stessa durata.',
      purpose: 'Definire la risoluzione temporale della discretizzazione.',
      symbolDefinitions: symbols(['\\delta', 'Durata di ciascun passo in secondi.']),
      assumptions: ['La fonte non assegna una soglia universale per un passo sufficientemente piccolo.'],
      relatedFormulaIds: ['p27-time-sampling'],
    },
    'p27-source-math-2': {
      conceptualExplanation: 'Lo stato raccoglie posizione e velocità per ciascun asse, poi angolo e velocità angolare. Questa alternanza spiega perché la quota è x₃ e la sua velocità x₄.',
      purpose: 'Associare ogni componente numerica al suo significato fisico e impedire scambi di coordinate.',
      symbolDefinitions: symbols(['p_x,v_x,p_y,v_y', 'Posizioni e velocità nel piano.'], ['\\theta,\\omega', 'Angolo e velocità angolare.'], ['u_1,u_2', 'Spinte dei due rotori.']),
      assumptions: ['Modello planare: sei stati non significano sei dimensioni spaziali.'],
    },
    'p27-enrichment-0': {
      conceptualExplanation: 'La quota usa la vecchia velocità; la spinta aggiorna quella successiva. Da fermo, il primo passo ha quota zero ma velocità positiva.',
      purpose: 'Rendere osservabile la differenza tra Euler e l’accelerazione continua.',
      symbolDefinitions: symbols(['a_y=2.19', 'Accelerazione verticale costante in m/s² nel profilo scelto.'], ['p_y,v_y', 'Quota in metri e velocità verticale in m/s.']),
      assumptions: ['Stato iniziale nullo, θ=ω=0, spinte uguali e costanti; durata fisica 1 s.'],
      parameterInterpretation: parameters(['p27-control-1', 'δ cambia numero e posizione dei campioni, non spinte o durata: il cursore si ferma e riparte da zero.']),
      graphExplanation: 'Assi: tempo τ, quota p_y, velocità v_y. Il terzo asse non è spaziale; δ più piccolo riduce qui l’errore sulla quota.',
      relatedFormulaIds: ['p27-example-acceleration', 'p27-time-sampling', 'p27-example-reference'],
    },
    'p27-example-acceleration': {
      latex: 'a_y=(u_1+u_2)/M-g=2.19\\;\\mathrm{m/s^2}',
      conceptualExplanation: 'Le due spinte verticali sommate superano il peso: resta quindi un’accelerazione verso l’alto. Le spinte uguali mantengono nullo il momento rotazionale in questo profilo.',
      purpose: 'Collegare i numeri della simulazione alla forza risultante del modello planare.',
      symbolDefinitions: symbols(['M=1', 'Massa in kg.'], ['u_1=u_2=6', 'Spinte costanti in N.'], ['g=9.81', 'Accelerazione di gravità in m/s².']),
      assumptions: ['Assetto verticale θ=0 e velocità angolare iniziale nulla.'],
      relatedFormulaIds: ['p27-enrichment-0'],
    },
    'p27-time-sampling': {
      latex: '\\tau=k\\delta,\\qquad N=1\\,\\mathrm{s}/\\delta',
      conceptualExplanation: 'Il cursore sceglie un campione k, mentre τ ne indica l’istante fisico. N conta i passi dell’esempio su un secondo e non è l’orizzonte T del corso.',
      purpose: 'Confrontare discretizzazioni diverse a parità di durata reale.',
      symbolDefinitions: symbols(['k', 'Indice del campione, da 0 a N.'], ['\\tau', 'Tempo fisico in secondi.'], ['N', 'Numero di passi nella durata fissa.']),
      assumptions: ['Le scelte di δ dividono esattamente la durata di 1 s.'],
      relatedFormulaIds: ['p27-source-math-1'],
    },
    'p27-example-reference': {
      latex: 'p_y(\\tau)=\\tfrac12a_y\\tau^2,\\qquad v_y(\\tau)=a_y\\tau',
      conceptualExplanation: 'Con accelerazione costante la velocità cresce linearmente e la quota quadraticamente. Questa soluzione continua fornisce il riferimento con cui misurare l’errore dei campioni Euler.',
      purpose: 'Separare l’errore numerico dalla dinamica fisica del profilo.',
      symbolDefinitions: symbols(['\\tau', 'Tempo continuo fisico.'], ['a_y', 'Accelerazione verticale costante del profilo.']),
      assumptions: ['Quota e velocità iniziali nulle, accelerazione costante.'],
      relatedFormulaIds: ['p27-enrichment-0'],
    },
  },
  30: {
    'p30-correction-0': {
      conceptualExplanation: 'T comandi governano T transizioni: i limiti escludono le scelte non ammesse.',
      purpose: 'Imporre vincoli hard con indici coerenti con la dinamica discreta.',
      symbolDefinitions: symbols(['T', 'Numero di transizioni dell’orizzonte.'], ['u_t^{\\min},u_t^{\\max}', 'Limiti componenti degli ingressi.'], ['p_{y,t}^{\\min},p_{y,t}^{\\max}', 'Limiti di quota sugli stati previsti.']),
      assumptions: ['Lo stato iniziale è dato; il controllo puntuale non certifica il moto tra campioni.'],
      relatedFormulaIds: ['p30-enrichment-0', 'p30-index-example'],
    },
    'p30-enrichment-0': {
      conceptualExplanation: 'I residui misurano il superamento dei due limiti: entrambi devono essere non positivi. La quota è x₃.',
      purpose: 'Trasformare il controllo di una banda in due verifiche di segno.',
      symbolDefinitions: symbols(['p_y=x_3', 'Quota, non velocità.'], ['r_{\\min},r_{\\max}', 'Residui inferiore e superiore, in metri.']),
      relatedFormulaIds: ['p30-maximum-residual'],
    },
    'p30-maximum-residual': {
      latex: 'V=\\max(r_{\\min},r_{\\max}),\\qquad \\mathrm{violazione}=\\max(0,V)',
      conceptualExplanation: 'V≤0 indica quota ammessa; la sua parte positiva misura la violazione. L’altezza 3D è V, non la quota.',
      purpose: 'Leggere ammissibilità e distanza dal limite violato nello stesso grafico.',
      symbolDefinitions: symbols(['V', 'Massimo dei due residui firmati, in metri.'], ['\\max(0,V)', 'Violazione non negativa; non costo da ottimizzare.'], ['\\mathrm{min},\\mathrm{max}', 'Abbreviazioni dei limiti di quota p_y min e p_y max nella didascalia; max(·,·) è invece l’operatore massimo.']),
      assumptions: ['Se min>max la banda è vuota e nessun punto è ammesso; nessuna certificazione di collisione o sicurezza continua.'],
      parameterInterpretation: parameters(['p30-control-1', 'Aumentare min alza il residuo inferiore e seleziona una nuova sezione della superficie.'], ['p30-control-2', 'Aumentare max abbassa il residuo superiore e allarga la banda se non è vuota.'], ['p30-control-3', 'p_y muove il candidato, aggiornando entrambi i residui senza simulare un moto.']),
      relatedFormulaIds: ['p30-enrichment-0'],
    },
    'p30-index-example': {
      latex: 'T=1:\\qquad x_0\\xrightarrow{u_0}x_1',
      conceptualExplanation: 'Un solo comando u₀ porta da x₀ a x₁: il limite di quota riguarda lo stato previsto. Non esiste u₁ per T=1.',
      purpose: 'Verificare concretamente i due intervalli di indici corretti.',
      symbolDefinitions: symbols(['x_0', 'Stato iniziale assegnato.'], ['x_1', 'Stato dopo una transizione.']),
      relatedFormulaIds: ['p30-correction-0'],
    },
  },
  34: {
    'p34-source-math-1': {
      conceptualExplanation: 'All’equilibrio la coppia applicata bilancia l’effetto della gravità: l’accelerazione angolare è nulla. Questo bilancio va imposto insieme alla velocità angolare nulla.',
      purpose: 'Trovare l’ingresso che mantiene una configurazione angolare.',
      symbolDefinitions: symbols(['x_{1,e}', 'Angolo all’equilibrio.'], ['u_e', 'Coppia di sostegno.'], ['g', 'Accelerazione di gravità.'], ['l\\equiv\\ell', 'Unica lunghezza del pendolo.'], ['m\\equiv M', 'Unica massa del pendolo.']),
      assumptions: ['Modello del pendolo del corso; nessuna conclusione di stabilità deriva dal solo bilancio.'],
      relatedFormulaIds: ['p34-correction-0', 'p34-equilibrium-law'],
    },
    'p34-source-math-2': {
      conceptualExplanation: 'La prima configurazione abbina un angolo a velocità zero alla coppia che lo sostiene. L’apice 1 etichetta la coppia di equilibrio: non indica un passo temporale.',
      purpose: 'Definire la prima condizione stazionaria da confrontare con una seconda.',
      symbolDefinitions: symbols(['\\theta_e^1', 'Angolo della prima configurazione.'], ['x_e^1,u_e^1', 'Stato e ingresso della prima coppia di equilibrio.']),
      relatedFormulaIds: ['p34-enrichment-0', 'p34-equilibrium-law'],
    },
    'p34-correction-0': {
      conceptualExplanation: 'Il pendolo fermo ha velocità angolare nulla, anche con angolo diverso da zero. La coppia compensa la gravità.',
      purpose: 'Identificare correttamente la componente nulla dello stato di equilibrio.',
      symbolDefinitions: symbols(['x_{2,e}', 'Velocità angolare all’equilibrio.'], ['x_{1,e}=\\theta_e', 'Angolo, che può essere diverso da zero.']),
      assumptions: ['Velocità e accelerazione devono essere entrambe nulle; equilibrio non significa stabilità.'],
      relatedFormulaIds: ['p34-source-math-1', 'p34-equilibrium-law'],
    },
    'p34-enrichment-0': {
      conceptualExplanation: 'La seconda configurazione è un altro stato fermo, sostenuto dalla propria coppia. Scegliere due equilibri non specifica come passare dall’uno all’altro.',
      purpose: 'Confrontare due condizioni stazionarie senza inventare una traiettoria di trasferimento.',
      symbolDefinitions: symbols(['\\theta_e^2', 'Angolo della seconda configurazione.'], ['\\operatorname{col}', 'Vettore colonna delle componenti elencate.']),
      relatedFormulaIds: ['p34-source-math-2', 'p34-equilibrium-law'],
    },
    'p34-equilibrium-law': {
      latex: 'u_e=mg\\ell\\sin\\theta_e,\\qquad x_e=\\begin{bmatrix}\\theta_e\\\\0\\end{bmatrix}',
      conceptualExplanation: 'La coppia sostiene l’angolo scelto a velocità zero. Il terzo asse mostra la coppia, non un moto.',
      purpose: 'Collegare configurazioni planari, coppie calcolate e luogo nello spazio stato–ingresso.',
      symbolDefinitions: symbols(['\\theta_e', 'Angolo rispetto alla verticale del modello, in radianti.'], ['u_e', 'Coppia in N m.'], ['m=1,\\ell=1,g=9.81', 'Massa in kg, lunghezza in m e gravità in m/s² dell’esempio.']),
      assumptions: ['Alias locali l≡ℓ e m≡M.', 'Nell’intervallo visualizzato [−π/2,π/2] la coppia cresce con l’angolo; fuori da esso non vale una monotonia globale.'],
      parameterInterpretation: parameters(['p34-control-1', 'θₑ¹ muove il primo equilibrio e aggiorna la sua coppia; i residui dinamici restano nulli.'], ['p34-control-2', 'θₑ² agisce sul secondo equilibrio; non avvia alcun trasferimento.']),
      relatedFormulaIds: ['p34-source-math-1', 'p34-correction-0', 'p34-residuals'],
    },
    'p34-residuals': {
      latex: '\\dot x_1=x_2,\\qquad\\dot x_2=-\\frac{g}{\\ell}\\sin x_1+\\frac{u}{m\\ell^2}',
      conceptualExplanation: 'I due residui verificano velocità e accelerazione nulle. Confermano l’equilibrio, senza dimostrarne la stabilità.',
      purpose: 'Controllare il risultato sostituendo stato e coppia nella dinamica.',
      symbolDefinitions: symbols(['\\dot x_1,\\dot x_2', 'Velocità angolare e accelerazione angolare, con unità diverse.']),
      assumptions: ['Stesso modello e stessi alias di massa e lunghezza usati nella legge di sostegno.'],
      relatedFormulaIds: ['p34-equilibrium-law'],
    },
  },
};

export function pageFormulaExplanations(definition: CompanionDefinition): readonly FormulaExplanation[] {
  if(documentFromId(definition.page_id)==='optimization') {
    const entries:Readonly<Record<number,readonly FormulaExplanation[]>>={...optimizationFormulaNotes,...convexityFormulaNotes,...minimizationFormulaNotes,...descentFormulaNotes,...newtonFormulaNotes,...stepSizeFormulaNotes,...projectionFormulaNotes,...kktFormulaNotes,...constrainedQpFormulaNotes,...sqpFormulaNotes,...meritFormulaNotes};
    const formulas=entries[definition.source_page];
    if(!formulas)throw new Error('Catalogo formule Optimization non disponibile.');
    for(const source of definition.formulas_to_show)if(!formulas.some(f=>f.formulaId===source.id&&f.latex===source.expression))throw new Error('Formula Optimization non allineata: '+source.id);
    return formulas;
  }
  const notes = introductionFormulaNotes[definition.source_page] ?? extendedFormulaNotes[definition.source_page];
  if (!notes) throw new Error('Catalogo formule non disponibile per questa companion.');
  const source = new Map(definition.formulas_to_show.map(f => [f.id, f]));
  for (const id of source.keys()) if (!notes[id]) throw new Error('Formula priva di spiegazione: ' + id);
  return Object.entries(notes).map(([formulaId, n]) => {
    const original = source.get(formulaId), latex = original?.expression ?? n.latex;
    if (!latex || !n.conceptualExplanation.trim()) throw new Error('Formula o spiegazione mancante: ' + formulaId);
    return { formulaId, latex, displayLatex: n.displayLatex, conceptualExplanation: n.conceptualExplanation, purpose: n.purpose,
      symbolDefinitions: n.symbolDefinitions ?? [], assumptions: n.assumptions ?? [], optionalDetails: n.optionalDetails ?? [],
      relatedFormulaIds: n.relatedFormulaIds ?? [], parameterInterpretation: n.parameterInterpretation ?? [],
      graphExplanation: n.graphExplanation, origin: original?.origin === 'correction' ? 'correction' : original?.origin === 'source' ? 'source' : 'enrichment',
      sourceFormulaIds: n.sourceFormulaIds ?? (original ? [formulaId] : []),
    };
  });
}
export function formulaExplanation(definition: CompanionDefinition, id: string) {
  const result = pageFormulaExplanations(definition).find(f => f.formulaId === id);
  if (!result) throw new Error('Formula non censita: ' + id);
  return result;
}
