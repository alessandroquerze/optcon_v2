# F07 — Introduction completa

Implementate **36/36 companion**, con 28 nuove pagine e nessun placeholder.
Le otto pagine F06/F06.1 conservano i tre renderer originali e i modelli matematici:
hash, risultati numerici e 38 formule con le loro spiegazioni coincidono con la baseline.
Gli altri PDF non sono stati implementati. Tutte le pagine mantengono companionPageCount=1.

Evidenza completa: [f07_complete_introduction.json](../Data/reports/f07_complete_introduction.json).

## Batch e gate

| Batch | Copertura dopo il batch | Test unitari | Test browser | Gate |
| --- | --- | --- | --- | --- |
| A | 15/36 | 87 | 35 | PASS |
| B | 22/36 | 100 | 42 | PASS |
| C | 29/36 | 113 | 49 | PASS |
| D | 36/36 | 128 | 56 | PASS |

A: 1,3,4,5,6,7,9. B: 10,11,13,14,15,18,19. C: 20–26.
D: 28,29,31,32,33,35,36. Ogni batch è stato verificato prima di implementare il successivo.
I gate e le copie dei risultati sono in Data/reports/f07_batch_[a-d]_*.
Il gate D è stato riconfermato dopo il controllo finale del componente matematico condiviso.

## Implementazione e riuso

Il registry carica i renderer per pagina tramite import dinamici. I quattro nuovi
moduli motivation, decisionFoundations, ocp e continuous compongono LessonFrame,
senza un renderer generico che riversi il testo del manifest nella slide.
Copertina e pagine concettuali hanno mappe, confronti, schemi e casi aggiunti pertinenti.

CourseExplorer riusa FunctionExplorer, SurfacePlot3D e SceneViewport per toggle,
camera e letture. interactiveDefinition integra i controlli F04.1 in una copia
runtime della definizione; non riscrive il manifest. TrackingExplorer condivide
modello e grafica tra p22 (candidata fissa) e p25 (scelta ottima).
ParameterControl, ProjectionLink, AlignedTimeSeries, TrajectoryViewer,
CostBreakdown, ComparisonTable e StateInputTimeline restano le API comuni.
Nessuna dipendenza aggiunta.

ExplainedEquation accetta displayLatex per la sola composizione su più righe.
Il LaTeX canonico rimane separato e verificabile nel DOM. Il reflow condiviso
è stato esteso anche alle formule di media lunghezza dopo aver rilevato un
overflow nel pannello di p8: ora la formula occupa 812/812 px.
Le 38 spiegazioni originali non sono state riscritte.

## Formule e fedeltà

**110/110 gruppi semantici spiegati**, dei quali 38 già presenti e
72 aggiunti. Il conteggio distingue le formule per pagina; ripetizioni in grafici,
calcoli e letture rimandano allo stesso gruppo. Non conta come nuove formule
ogni singolo simbolo o ogni ripetizione dello stesso risultato.
Spiegazioni concettuali, simboli, ipotesi ed effetti dei parametri sono disponibili
nel contesto d’uso; le forme complete e i prerequisiti sono accessibili dal pannello.
L’audit confronta ogni espressione canonica con il manifest e verifica i riferimenti
delle occorrenze e dei grafici, anche nei pannelli aperti.

PDF, testi, render, PAGE_SPEC, F03, F04/F04.1 e documentazione validata restano
immutati: 969 voci della baseline delle fonti più 42 della baseline F07 controllate.
Il PDF servito al browser mantiene SHA-256
ae169f3492dc0915d0777d62e90184107d7017aee03b8620bbfe0aee9bd3a469.

Correzioni F03 conservate: p16 usa w₂ nel secondo termine, p30 limita gli ingressi
a t=0,…,T−1, p34 usa x₂,e=0. Note informative locali a p14,17,19,22,26;
nessun nuovo warning per le sole variazioni tipografiche di p31,33,36.
La tracciabilità SOURCE_LITERAL → CORRECTION_USED_BY_COMPANION resta nei metadata.

## Matematica e casi limite

| Modulo nuovo | Oggetto e verifiche indipendenti |
| --- | --- |
| courseFoundations | Sequenza discreta e geometria dei percorsi; collisione inclusa sul tetto |
| courseOptimization | Dimensioni nT/mT, equilibrio, residui, costo scalare, minimo vincolato |
| courseOcp | Contabilità stadi/terminale, raggiungibilità, tracking fisso/ottimo, OCP minimo, uscita, accelerazioni planari |
| courseContinuous | Euler riusato, snapshot del drone, funzionale continuo, famiglia a due coefficienti, pendolo e costo finale |

I renderer consumano dataset numerici prodotti da funzioni pure. I modelli
preesistenti del drone, del pendolo e di Euler sono riusati senza modificarli.
Esempi verificati: costo di p20=1.25; p21 con b=0.4 incompatibile e con b=0.5
compatibile; p23 impossibile senza falso minimo; p22 con R=2 ha costo 0.375
sulla candidata fissa mentre p25 sceglie u=1/3 e costo 1/3; p29=3.05;
p31=1; p33 a π/6 senza coppia dà −4.905; p36=3.2283695334 senza fattore ½.

Gestiti limiti e pesi nulli, box degenere, target irraggiungibile, coppia
compensativa, equilibri coincidenti e assegnazione del secondo ramo a T/2.
Nessun ottimo inventato per snapshot o candidate; nessuna simulazione temporale
aggiunta alle pagine che richiedono solo un’istantanea.

## Grafica, interazioni e revisione

9 pagine 2D_ONLY, 1 pagina 3D_PRIMARY e 26 pagine con toggle coerenti con F04.1.
Le 27 pagine con 3D usano scene native con orbit, pan, zoom e reset.
Gli embedding dichiarano costo, residuo, tempo, errore o accelerazione come
terza coordinata. Drone sempre planare: nessuna posizione fuori piano inventata.
Le curve a gradino di p35 sono separate; la mesh di p36 è tagliata a t=1.
I contributi di costo in 2D sono letture dello stesso modello, senza fingere
che siano proiezioni geometriche della superficie.

Salvati e ispezionati **62 screenshot di pagina/vista**: 36 principali e
26 alternative. In aggiunta: pannello formule aperto di p8 e tre screenshot
delle fondamenta grafiche. Tutte le slide hanno geometria 960×1280, footer entro
1240 px, nessuna sovrapposizione, nessun errore KaTeX e nessun overflow nelle
formule complete. La timeline di p9 scorre orizzontalmente; il grafico contiene
tutti i campioni e lo stato finale è disponibile anche come lettura numerica.

Evidenze: [audit visivo](../Data/reports/f07_final_visual.json),
[revisione degli screenshot](../Data/reports/f07_final_visual_review.json).
Il browser verifica titolo, esempio, sincronizzazione PDF, tutti i controlli,
reset, toggle, warning e spiegazioni. Le regressioni coprono anche playback,
selezione, degenerazioni, cambio passo e cleanup delle otto pagine preesistenti.

## Test e performance

TypeScript e build di produzione PASS. Test: **218/218** =
128 unitari + 56 browser + 34 pipeline.
In aggiunta, 19 verifiche browser su casi limite e valori numerici.
L’ultima correzione al campionamento del bordo 3D di p23 è coperta da un oracolo
numerico e da un ulteriore smoke browser mirato (1/1), successivo alla suite completa.
Nessuna regressione numerica, di notazione o spiegazione sulle otto pagine F06/F06.1.

Misurati 12 aggiornamenti completi del grafico di p23:
mediana 120 ms, massimo 192 ms.
Nodo e camera conservati. Nella navigazione resta al massimo una scena; tornando
a p1 non rimane alcuna scena o canvas WebGL. Le misure includono automazione
Chrome headless e SwiftShader: non sono un benchmark di GPU fisica. I campioni
heap sono osservazioni senza garbage collection forzata, non una prova di assenza di leak.
Dettagli: [runtime_measurements](../Data/reports/f07_runtime_measurements.json).

## Copertura per pagina

| Pagina fisica | Companion | Modalità | Formule | Revisione |
| --- | --- | --- | --- | --- |
| 1 | Introduction to Optimal Control | 2D_ONLY | 0 | [screenshot](F07_assets/page-01-companion.png) |
| 2 | Che cosa rende un controllo ottimo? | 2D_ONLY | 1 | [screenshot](F07_assets/page-02-companion.png) |
| 3 | Velivoli: prestazioni entro i limiti | 2D_ONLY | 0 | [screenshot](F07_assets/page-03-companion.png) |
| 4 | Robot: il percorso non basta | 2D_ONLY | 0 | [screenshot](F07_assets/page-04-companion.png) |
| 5 | Guida autonoma: criteri che competono | 2D_ONLY | 0 | [screenshot](F07_assets/page-05-companion.png) |
| 6 | Droni: percorso, energia e ostacoli | 3D_PRIMARY | 1 | [screenshot](F07_assets/page-06-companion.png) |
| 7 | Sistemi spaziali: orbita e orientamento | 2D_ONLY | 0 | [screenshot](F07_assets/page-07-companion.png) |
| 8 | Continuo: stato, ingresso, uscita | 2D_PRIMARY_WITH_3D | 5 | [screenshot](F07_assets/page-08-companion.png) |
| 9 | Discreto: un ingresso, un aggiornamento | 2D_PRIMARY_WITH_3D | 4 | [screenshot](F07_assets/page-09-companion.png) |
| 10 | Orizzonte finito: contare senza errori | 2D_ONLY | 4 | [screenshot](F07_assets/page-10-companion.png) |
| 11 | Traiettoria ed equilibrio | 2D_AND_3D_EQUAL | 4 | [screenshot](F07_assets/page-11-companion.png) |
| 12 | Linearizzazione: misurare l'errore locale | 3D_PRIMARY_WITH_2D | 7 | [screenshot](F07_assets/page-12-companion.png) |
| 13 | Dagli strumenti di controllo all'ottimizzazione | 2D_ONLY | 0 | [screenshot](F07_assets/page-13-companion.png) |
| 14 | Ottimizzazione: decisione, costo, insieme | 2D_AND_3D_EQUAL | 2 | [screenshot](F07_assets/page-14-companion.png) |
| 15 | Costo scalare: distanza da z̄ | 2D_ONLY | 2 | [screenshot](F07_assets/page-15-companion.png) |
| 16 | Costo vettoriale: che cosa fanno i pesi? | 3D_PRIMARY_WITH_2D | 4 | [screenshot](F07_assets/page-16-companion.png) |
| 17 | Vincoli: regione e curva | 2D_AND_3D_EQUAL | 4 | [screenshot](F07_assets/page-17-companion.png) |
| 18 | Minimizzare dentro l'insieme ammissibile | 2D_PRIMARY_WITH_3D | 3 | [screenshot](F07_assets/page-18-companion.png) |
| 19 | La dinamica è un insieme di uguaglianze | 3D_PRIMARY_WITH_2D | 4 | [screenshot](F07_assets/page-19-companion.png) |
| 20 | Costo di stadio e costo terminale | 2D_PRIMARY_WITH_3D | 4 | [screenshot](F07_assets/page-20-companion.png) |
| 21 | Vincoli agli estremi e lungo il percorso | 2D_PRIMARY_WITH_3D | 3 | [screenshot](F07_assets/page-21-companion.png) |
| 22 | Tracking: valutare una candidata | 2D_PRIMARY_WITH_3D | 4 | [screenshot](F07_assets/page-22-companion.png) |
| 23 | L'OCP discreto completo | 3D_PRIMARY_WITH_2D | 3 | [screenshot](F07_assets/page-23-companion.png) |
| 24 | Generare una traiettoria di uscita | 2D_PRIMARY_WITH_3D | 4 | [screenshot](F07_assets/page-24-companion.png) |
| 25 | Tracking: ora scegliere la candidata | 2D_AND_3D_EQUAL | 3 | [screenshot](F07_assets/page-25-companion.png) |
| 26 | Drone planare: somma e differenza degli ingressi | 2D_PRIMARY_WITH_3D | 4 | [screenshot](F07_assets/page-26-companion.png) |
| 27 | Drone: dal continuo ai passi di Euler | 3D_PRIMARY_WITH_2D | 7 | [screenshot](F07_assets/page-27-companion.png) |
| 28 | Drone: dai requisiti alle variabili | 2D_PRIMARY_WITH_3D | 4 | [screenshot](F07_assets/page-28-companion.png) |
| 29 | Drone: leggere ogni contributo al costo | 3D_PRIMARY_WITH_2D | 3 | [screenshot](F07_assets/page-29-companion.png) |
| 30 | Drone: vincoli hard e indici corretti | 2D_PRIMARY_WITH_3D | 4 | [screenshot](F07_assets/page-30-companion.png) |
| 31 | Continuo: un costo sulle funzioni | 2D_PRIMARY_WITH_3D | 4 | [screenshot](F07_assets/page-31-companion.png) |
| 32 | Perché il problema è infinito-dimensionale? | 3D_PRIMARY_WITH_2D | 2 | [screenshot](F07_assets/page-32-companion.png) |
| 33 | Pendolo: angolo, velocità, coppia | 3D_PRIMARY_WITH_2D | 4 | [screenshot](F07_assets/page-33-companion.png) |
| 34 | Pendolo: due coppie di equilibrio | 3D_PRIMARY_WITH_2D | 6 | [screenshot](F07_assets/page-34-companion.png) |
| 35 | Desiderato a gradino: un obiettivo, non un moto | 2D_PRIMARY_WITH_3D | 3 | [screenshot](F07_assets/page-35-companion.png) |
| 36 | Pendolo: valutare il problema completo | 3D_PRIMARY_WITH_2D | 3 | [screenshot](F07_assets/page-36-companion.png) |

## Esito finale

    TOTAL_COMPANION_PAGES = 36/36
    NEW_PAGES_IMPLEMENTED = 28/28
    PLACEHOLDER_PAGES = 0
    FORMULA_EXPLANATION_POLICY = PASS
    MEANINGFUL_FORMULAS = 110
    FORMULAS_WITH_CONCEPTUAL_EXPLANATION = 110/110
    UNEXPLAINED_FORMULAS = 0
    SOURCE_INTEGRITY = PASS
    SOURCE_WARNINGS = PASS
    MATH_VALIDATION = PASS
    GRAPHICS_2D = PASS
    GRAPHICS_3D = PASS
    COMBINED_VIEWS = PASS
    INTERACTIONS = PASS
    VISUAL_REVIEW = PASS
    PAGE_SYNC = PASS
    BUILD = PASS
    F06_F06_1_REGRESSIONS = 0
    TESTS = 218/218
    UNRESOLVED_ISSUES = 0
    READY_FOR_FINAL_HUMAN_REVIEW = YES

Nessuna issue irrisolta. F07 termina qui; pronta per revisione umana finale.
