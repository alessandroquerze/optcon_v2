# F05 — Application shell, graphics foundation and reusable component library

Questo report conserva lo stato della consegna F05. L'implementazione successiva
delle otto companion è documentata in [F06_VERTICAL_SLICE](F06_VERTICAL_SLICE.md);
per lo stato corrente consultare [IMPLEMENTATION_PLAN](IMPLEMENTATION_PLAN.md).

Stato: **COMPLETATA**. F06: **NON INIZIATA**.

L'applicazione locale mostra il PDF originale a sinistra e un contenitore companion sincronizzato a destra. Tutte le 36 companion restano placeholder. Le dimostrazioni tecniche sono disponibili esclusivamente nel playground DEV, senza implementare alcuna pagina del corso.

GRAPHICS_REQUIREMENT = FULL_2D_AND_3D_SUPPORT

Le decisioni di F04.1 sono vincolanti. La vertical slice corrente resta [2, 8, 12, 16, 17, 27, 30, 34]; nessuno dei suoi renderer è registrato.

## Stack e motivazione

| Livello | Tecnologia fissata nel lockfile | Impiego |
| --- | --- | --- |
| Interfaccia | React 19.3.1, TypeScript 7.0.2, Vite 8.3.4 | Stato condiviso, API tipizzate, build statica |
| PDF | pdfjs-dist 6.4.299 | Rendering diretto dei byte originali, worker, CMap, font e WASM locali |
| Formule | KaTeX 0.19.0 | HTML e MathML; errori visibili, trust disabilitato |
| Grafica | Plotly.js 4.1.2, react-plotly.js 4.1.0 | Un backend scientifico per grafici 2D e scene WebGL 3D |
| Contratti dati | Zod 4.6.7 | Validazione runtime del manifest e tipi TypeScript derivati |
| Verifiche | Vitest 5.0.5, Testing Library, Playwright 1.64.1 | Test isolati e browser Chrome reale |

Plotly copre line/scatter, contour, heatmap, surface, mesh3d, scatter3d e cone; le superfici sono primitive native. Le stesse strutture numeriche alimentano 2D e 3D. Il wrapper React aggiorna i grafici con Plotly.react e uirevision conserva la camera durante le modifiche dei dati. Queste capacità soddisfano il manifest senza aggiungere un secondo motore 3D. Riferimenti primari: [surface plots](https://plotly.com/javascript/3d-surface-plots/), [integrazione React](https://plotly.com/javascript/react/), [persistenza delle interazioni](https://plotly.com/javascript/uirevision/).

PDF.js riceve il documento originale e renderizza ogni pagina su canvas, secondo il suo [modello document/page/render](https://mozilla.github.io/pdf.js/examples/index.html). KaTeX usa renderToString e output HTML/MathML con [API](https://katex.org/docs/api) e [opzioni](https://katex.org/docs/options) esplicite. Nessun contenuto LaTeX viene eseguito per ricavare dati numerici.

## Struttura

    frontend/
      src/
        app/                    Shell, routing e currentSourcePage
        data/                   Manifest, validazione e lookup per pagina
        pdf/                    Viewer PDF.js
        companion/              Viewer e registro vuoto dei renderer F06
        components/             Blocchi didattici, controlli, tabelle, viewport
        numeric-data/           Contratti numerici indipendenti dal renderer
        math/                   Funzioni pure e campionamento
        simulations/            Euler, rollout e playback
        visualization/
          core/                 Unico accesso a Plotly
          2d/                   Funzioni, serie temporali, contour e heatmap
          3d/                   Superfici, wireframe, mesh e layer
          shared/               Explorer, traiettorie, proiezioni e vincoli
        dev/                    Fixture sintetiche e playground
        styles/                 Token e layout
      scripts/                  Copia asset, verifica hash e misure locali
      browser-tests/            Verifiche reali di PDF e grafica
      public/                   Copie generate; mai fonti autorevoli
      dist/                     Build generata
    Data/reviews/f05_source_baseline.json
    Data/reports/f05_application_shell.json
    Data/reports/f05_pipeline_tests.json
    Data/reports/f05_production_smoke.json
    Data/reports/f05_runtime_measurements.json
    Docs/F05_assets/             Screenshot del browser

## Shell, PDF e sincronizzazione

PageStateProvider mantiene currentSourcePage come unica sorgente di verità. Previous, Next, jump e hash URL aggiornano quello stato; PDF e companion ricevono lo stesso numero fisico. I bounds derivano dal manifest: 1..36. Jump decimali o non numerici vengono rifiutati; valori interi fuori intervallo vengono limitati ai bounds.

La shell ha toolbar, due pannelli con scroll indipendente, divider accessibile da mouse e tastiera, fit/zoom del PDF e disposizione verticale su viewport stretta. Il contenitore companion usa la geometria logica del manifest, 960 × 1280, e larghezza minima di visualizzazione 720 px. Su pannelli più stretti scorre internamente: le future pagine mantengono la propria impaginazione.

Il viewer gestisce caricamento, errori e navigazione rapida. Ogni render usa un canvas separato; il task precedente viene annullato e i risultati obsoleti ignorati. Il canvas viene pubblicato soltanto dopo il completamento del render corrente. ResizeObserver adatta la risoluzione alla larghezza disponibile; un render vecchio non viene presentato come pagina nuova.

Il documento servito è verificato contro SHA-256 ae169f3492dc0915d0777d62e90184107d7017aee03b8620bbfe0aee9bd3a469. Il browser confronta anche l'hash dei byte ricevuti. Il PDF non riceve overlay correttivi né modifiche.

## Data layer e costruzione futura

prepare:assets copia il manifest esistente e il PDF senza trasformarli; worker, font, CMap e WASM di PDF.js vengono serviti localmente. La preparazione è automatica prima di dev e build.

loadManifest valida i dati e crea sourcePage → CompanionDefinition. Il contratto comprende prerequisiti, formule, esempi, effetti dei parametri, casi limite, layout, warning, relazioni e tutti i campi operativi 2D/3D di F04.1. Verifica copertura ordinata delle pagine, ID univoci, semantica della terza coordinata e allineamento dei warning F03.

L'ingestion Python esclude le copie generate in frontend/public/course-assets e frontend/dist: una nuova scansione della radice continua a censire soltanto i PDF sorgente. Un test di regressione crea entrambe le copie di un PDF sintetico e verifica che il catalogo contenga ancora un solo documento.

Si usano visualization.visualizationMode e interaction.effective_enabled. I campi storici F04 rimangono nel manifest e non prevalgono su F04.1. Nel documento corrente 27 pagine richiedono 3D e 29 hanno interattività effettiva.

CompanionPage compone slot HEADER, EXPLANATION, FORMULA, MAIN_VISUAL, CONTROLS, WORKED_EXAMPLE e TAKEAWAY nell'ordine del manifest. Supporta gli archetipi EXPLANATION, FORMULA_EXPLORER, GRAPH_AND_CONTROLS, SIMULATION, WORKED_EXAMPLE, CONCEPT_SUMMARY e COMPARISON.

In F06 un renderer riceverà la propria CompanionDefinition, sceglierà i blocchi e fornirà dati numerici alle visualizzazioni. Il punto di ingresso è src/companion/registry.ts, attualmente vuoto e coperto da un test. Il manifest non viene eseguito come codice e le sue formule non sono automaticamente convertite in modelli.

## Architettura grafica 2D e 3D

Solo visualization/core/SceneViewport importa Plotly e invoca il backend. I componenti superiori ricevono dati numerici e metadati degli assi; non derivano modelli fisici. Il backend riceve copie dei dati per evitare che eventuali mutazioni della libreria alterino gli input matematici.

Il livello 2D offre line/scatter, funzioni campionate, serie temporali, contour, heatmap, traiettorie e maschere di ammissibilità. ConstraintVisualizer riceve sia residui sia maschere già calcolati. VectorField visualizza vettori forniti dal chiamante.

Il livello 3D offre surface, wireframe, mesh3d, scatter3d e cone, punti evidenziati, traiettorie, piani come layer, contorni proiettati e tooltip delle coordinate. TrajectoryViewer accetta xy, xyt e xyz; xyt richiede tempi espliciti e xyz coordinate z esplicite. Non viene inventata una terza coordinata. Curve discontinue devono essere fornite come segmenti distinti; valori di superficie non definiti diventano null e non vengono collegati.

SceneViewport centralizza orbit, pan, zoom e reset della camera. ResizeObserver aggiorna il viewport senza rimontare il grafico. L'identità del plot e uirevision restano stabili durante gli aggiornamenti; il reset modifica la camera e conserva i parametri.

FunctionExplorer supporta NONE, 2D_ONLY, 3D_PRIMARY, 2D_PRIMARY_WITH_3D, 3D_PRIMARY_WITH_2D e 2D_AND_3D_EQUAL, con toggle o viste affiancate. ProjectionLink condivide l'ID selezionato tra proiezione e scena. Contour e surface ricevono la stessa griglia; traiettorie e proiezioni mantengono gli stessi ID. Uno state-space 3D e una serie temporale possono essere composti con gli stessi campioni e la stessa selezione.

Le impostazioni specifiche di ogni pagina — formula, significato degli assi, camera, piani, residui, domini, discontinuità e layout — saranno collegate dai renderer F06 al contratto F04.1. La foundation non sceglie un modello fisico per la pagina.

## Inventario riutilizzabile

Le nove voci canoniche di F04.1 hanno fondamenta operative:

| Componente canonico | Foundation disponibile |
| --- | --- |
| FunctionExplorer | Politiche 2D/3D, toggle e combinazione |
| TrajectoryViewer | xy, xyt, xyz; alias StateSpaceViewer |
| ProjectionLink | Selezione condivisa; alias Projection2D3D |
| SceneViewport | Backend unico, camera, resize, aggiornamenti e cleanup |
| ModelDiagram | Diagramma SVG configurabile con nodi e collegamenti |
| VectorVisualizer | Vettori ordinati e notazione tramite KaTeX |
| CostBreakdown | Contributi numerici e totale forniti dal chiamante |
| StateInputTimeline | Sequenze stato/ingresso con controllo T+1 / T |
| ComparisonTable | Confronti configurabili in tabella accessibile |

FunctionPlot2D, TimeSeriesPlot, ContourPlot2D, SurfacePlot3D, ConstraintVisualizer e VectorField completano queste fondamenta. Gli alias e le composizioni non aumentano artificialmente il conteggio canonico: **9/9**.

I componenti non grafici pubblici sono **12**: CompanionPage, CompanionHeader, ExplanationBlock, EquationCard, SourceWarnings, WarningBanner, InfoNote, ControlsBlock, ExampleBlock, TakeawayBlock, ParameterControl e SlideViewport. Le API sono TypeScript e non contengono logica di una particolare slide.

ParameterControl unifica slider e input numerico, supporta domini continui, interi e scelte discrete. Non arrotonda arbitrariamente un valore valido alla griglia dello slider; rifiuta valori non finiti, fuori dominio e interi non validi. I token comuni riguardano tipografia, spazi, card, bordi, controlli, warning, formule e grafici.

## Matematica e simulazioni

Flusso: parametri → funzioni pure → dati numerici → renderer.

math contiene linspace, costo quadratico diagonale con scala esplicita, previsione lineare con Jacobiani forniti, residui, classificazione dei bordi, indici di orizzonte e campionamento. Il fattore 1/2 non è una convenzione globale: deve essere passato dal chiamante. Un intervallo invertito rappresenta un insieme vuoto; non viene riordinato silenziosamente.

simulations/core contiene Euler esplicito e rollout per una dinamica fornita dall'esterno. Euler usa simultaneamente lo stato precedente per tutte le coordinate. usePlayback riproduce campioni già calcolati, senza integrare implicitamente un modello.

Le funzioni matematiche importano contratti numerici neutrali, senza React o Plotly. Non sono stati implementati pendolo, drone, ottimizzatori, ricerca dell'equilibrio o modelli specifici del corso.

## Warning F03

studentNotices proietta soltanto issue_id, componente, testo breve, colore, anchor e condizione di visibilità. SourceWarnings colloca l'avviso vicino al blocco indicato: EquationCard può ospitarlo direttamente. WarningBanner è rosso e compatto; InfoNote è una nota breve locale; NO_WARNING non produce alcun elemento.

correction_reason e le discussioni editoriali restano nei metadata. I placeholder non mostrano avvisi privi del relativo concetto. Il playground usa testi dimostrativi esplicitamente riconoscibili.

Le correzioni F03 rimangono quelle del manifest: pagine 16, 30 e 34; note informative 14, 17, 19, 22 e 26. In F06 le funzioni pure dovranno ricevere la formula corretta dichiarata dalla companion; non si valuta mai source_literal. I test numerici verificano, tra l'altro, il costo pesato 2.5 e gli indici degli ingressi fino a T−1.

## Playground DEV

La route #/dev è separata dallo studio. Contiene:

- Funzione sintetica a sin(x) cos(y), con contour 2D, superficie 3D, sezione 1D, maschera, piano e punti.
- Slider/input dell'ampiezza, modalità affiancata o toggle e surface/wireframe/mesh.
- Elica geometrica sintetica, proiezione xy, cursore collegato e playback.
- KaTeX, avvisi dimostrativi, diagramma, vettori, contributi di costo, timeline e tabella.
- Campo vettoriale sintetico 2D e cone 3D.

Queste fixture sono indipendenti dalle pagine del corso. La normale route studio continua a mostrare soltanto PDF e placeholder.

## Verifica effettiva

Eseguiti **78/78 test**: 38 frontend, 6 browser, 34 della pipeline Python, inclusa la regressione sulle copie generate. TypeScript check e production build passano. La verifica degli hash conferma **969/969 file protetti invariati**, compresi PDF, immagini, testi, PAGE_SPEC, F03 e manifest F04/F04.1.

Verificata anche l'anteprima della build a 127.0.0.1:4173: PDF e placeholder sincronizzati sulla pagina 34, caricamento differito del chunk Plotly, contour e superficie 3D operativi. Nessun errore JavaScript o richiesta fallita, come registrato in Data/reports/f05_production_smoke.json.

| Suite | Risultato | Evidenza |
| --- | --- | --- |
| Stato pagina | 8/8 | Bounds, jump e consumer sincronizzati |
| Manifest reale | 7/7 | 36 pagine, campi F04.1 e policy F03 |
| Blocchi e controlli | 9/9 | KaTeX/MathML, errori visibili, warning locali e input |
| Matematica | 8/8 | Costo, Jacobiani, residui, orizzonte, Euler e campionamento |
| Explorer | 5/5 | Vista primaria, toggle, cambio policy e selezione |
| Registro companion | 1/1 | Nessuna pagina del corso implementata |
| Chrome reale | 6/6 | PDF, navigazione, resize, grafici, camera e controlli |
| Pipeline Python | 34/34 | Contratti e ingestion, incluse le copie generate dal frontend |

I quindici controlli richiesti sono stati eseguiti nell'app avviata, tramite interazioni Playwright in Chrome installato. Gli screenshot sono stati anche ispezionati visivamente. È una verifica browser automatizzata con ispezione delle immagini, non una sessione manuale umana dichiarata.

| # | Controllo richiesto | Esito |
| --- | --- | --- |
| 1 | PDF originale caricato a sinistra | PASS |
| 2 | Placeholder companion a destra | PASS |
| 3 | Next sincronizza entrambi | PASS |
| 4 | Previous | PASS |
| 5 | Jump diretto | PASS |
| 6 | Bounds 1..36 | PASS |
| 7 | Resize, divider e viewport 900/560 px | PASS |
| 8 | KaTeX | PASS |
| 9 | WarningBanner rosso e locale | PASS |
| 10 | Plot 2D | PASS |
| 11 | Contour | PASS |
| 12 | Superficie WebGL 3D | PASS |
| 13 | Orbit, pan, zoom e reset camera | PASS |
| 14 | Slider/input aggiorna dati senza ricreare il plot | PASS |
| 15 | Vista combinata 2D/3D con dati condivisi | PASS |

Screenshot: [shell](F05_assets/study-shell.png), [contour e superficie](F05_assets/combined-2d-3d.png), [traiettoria collegata](F05_assets/trajectory-3d.png).

La misura locale registrata in Data/reports/f05_runtime_measurements.json usa Chrome 155 headless con WebGL SwiftShader. Cinque aggiornamenti della griglia 33 × 33 impiegano 367–535 ms ciascuno, inclusa l'automazione. La camera e il nodo del plot vengono conservati. Dopo l'unmount i canvas passano da 1 a 0. Queste misure non sono un benchmark GPU fisica o una prova di assenza di leak; non è stato forzato il garbage collector.

La build produce un chunk Plotly di circa 4.64 MB, 1.42 MB gzip, caricato quando si apre il playground o una futura visualizzazione. La shell non lo precarica. PDF.js è in un chunk separato e il worker è locale. Il bundle scientifico è una scelta esplicita per coprire nativamente 2D e 3D.

## Avvio e ripetizione delle verifiche

Con Node 22.12+ e npm, dalla radice:

    cd frontend
    npm ci
    npm run dev

Aprire http://127.0.0.1:5173/#/study?page=1 oppure http://127.0.0.1:5173/#/dev.

    npm run typecheck
    npm test
    npm run test:browser
    npm run build
    npm run verify:sources
    npm run preview

L'anteprima di produzione è http://127.0.0.1:4173/. I test browser richiedono Chrome installato; il canale è configurabile in playwright.config.ts. La procedura di sviluppo e build segue il [flusso Vite](https://vite.dev/guide/).

La regressione della pipeline si esegue dalla radice:

    .\.venv\Scripts\python.exe -m unittest discover -s tests -v

Nell'ambiente Codex Windows alcuni comandi Node richiedono accesso fuori dal sandbox per risolvere i percorsi della directory utente. La build standard è stata verificata senza il workaround NODE_OPTIONS per i symlink, che interferiva con il caricatore Vite. Nessun workaround è richiesto dall'app per l'utente.

## Confine della consegna e fase successiva

Completati shell, rendering PDF, sincronizzazione, contenitore slide, rendering matematico, warning, backend 2D/3D, componenti, nucleo numerico, playground, test e build.

Rimandati a F06: renderer delle otto pagine selezionate, collegamento dei loro parametri e formule corrette, modelli specifici, layout didattico finale e verifica della densità. Le altre companion restano a una fase successiva. La baseline protetta e il manifest originale non sono stati modificati.

    APPLICATION_SHELL = PASS
    PDF_VIEWER = PASS
    PAGE_SYNC = PASS
    COMPANION_CONTAINER = PASS
    WARNING_SYSTEM = PASS
    GRAPHICS_2D_FOUNDATION = PASS
    GRAPHICS_3D_FOUNDATION = PASS
    COMBINED_2D_3D = PASS
    REALTIME_GRAPH_UPDATES = PASS
    REUSABLE_VISUALIZATION_FOUNDATIONS = 9/9
    OTHER_REUSABLE_COMPONENT_FOUNDATIONS = 12
    TESTS = 78/78
    BUILD = PASS
    VERTICAL_SLICE_IMPLEMENTED = NO
    READY_FOR_F06 = YES
