# F06 — Introduction vertical slice

Stato: **COMPLETATA**. Implementate esclusivamente le companion delle pagine fisiche **2, 8, 12, 16, 17, 27, 30, 34**. Le altre 28 conservano il placeholder. F07 **non è iniziata**.

Ogni pagina mantiene una companion HTML/React nella tela logica 960×1280. A sinistra PDF.js mostra il documento originale; formule, testo, immagini, PAGE_SPEC, F03, F04, F04.1 e manifest sono rimasti invariati. La verifica SHA-256 controlla 969 file protetti.

## Renderer e mapping PAGE_SPEC → UI

Il registro usa renderer semantici caricati al bisogno, senza componenti PageXX. Titoli, spiegazioni, formule complete, prerequisiti, controlli, domini, default, warning, ordine dei blocchi e modalità grafiche provengono dal manifest. Le spiegazioni vengono abbreviate dove necessario senza cambiare il concetto. Modelli, valori assegnati, deduzioni e grafici aggiunti sono etichettati come esempi aggiunti.

| Pagina | Renderer | Evidenze PAGE_SPEC e contenuto effettivo |
| ---: | --- | --- |
| 2 | FeedbackLesson | Osservazioni s01–s05: anello riferimento–controllore–sistema–uscita, disturbo e feedback; riquadri performance index / constraints. J(u) e il confronto 1 / 0.6 sono enrichment, senza simulazione dinamica. |
| 8 | ContinuousResponseLesson | source_math 1–3 e 5: dinamica, uscita, dimensioni e invarianza temporale. Esempio ẋ=−ax+u, y=x; soluzione analitica, ramo a=0, ingresso separato e famiglia x(t;u). |
| 12 | LinearizationLesson | source_math 0–2: dinamica, traiettoria nominale e sistema delle variazioni. Jacobiani espliciti e modello x²+u sono enrichment. Superficie esatta, piano tangente, sezione e scarto di un passo. |
| 16 | WeightedCostLesson | source_math 1–2 e correzione F03: forma matriciale, W diagonale ed espansione con w₂. Stessa funzione per superficie, livelli, punto e contributi al costo. |
| 17 | ConstraintSetsLesson | source_math 0–2 e INFO_WARNING F03: disequazione, uguaglianza quadratica, figura qualitativa. Maschera calcolata, luogo zero, piano g=0, punti campione e cerchio unitario fisso separato. |
| 27 | EulerDiscretizationLesson | source_math 0–2: intera mappa Euler, δ>0 e ordine delle sei componenti. Dizionario visibile, campioni di stato, confronto analitico, cursore e playback. |
| 30 | PathConstraintsLesson | Correzione F03: ingressi 0…T−1 e quote 1…T. Banda, punto candidato, due residui, massimo V, sezione della famiglia dei limiti e timeline del caso T=1. |
| 34 | PendulumEquilibriumLesson | Correzione F03 e source_math 1–2: x₂,e=0, coppia di sostegno e coppie di equilibrio. Due pose, proiezione angolo–coppia, luogo nello spazio stato–ingresso e residui dinamici. |

I PAGE_SPEC restano nelle rispettive directory Data/documents/OPTCON-RL_introduction_optimal_control_2026_09_14--ae169f3492dc/pages/NNNN. Nessuna loro analisi è stata riscritta.

FormulaDeck conserva i riferimenti agli ID delle formule del manifest e rende disponibili tutte le espressioni, con provenienza e prerequisiti, nel pannello «Formule e prerequisiti». Le relazioni centrali, gli esempi numerici e i warning restano visibili nella vista principale. Il pannello evita di ripetere contemporaneamente notazioni equivalenti, senza introdurre sub-page.

## Componenti riutilizzati e generalizzazioni

Riutilizzati CompanionPage, CompanionHeader, ExplanationBlock, EquationCard, SourceWarnings, WarningBanner, InfoNote, ControlsBlock, ExampleBlock, TakeawayBlock, ParameterControl e SlideViewport. La grafica usa FunctionExplorer, SceneViewport, TrajectoryViewer, ProjectionLink, ContourPlot2D, SurfacePlot3D e ConstraintVisualizer; diagrammi, contributi e timeline usano le fondamenta F05.

Le aggiunte comuni sono:

- LessonFrame, FormulaDeck, LessonControls e LiveMetrics: composizione, notazione completa, controlli e letture numeriche.
- useLessonParameters: default del manifest, valori locali conservati in memoria durante la sessione e reset esplicito. Cambiare pagina non trasferisce parametri tra modelli.
- InlineMath: stessa configurazione KaTeX di EquationCard per i simboli dei controlli.
- VisualizationSwitch: modalità F04.1 e toggle comune anche alle curve senza superficie.
- AlignedTimeSeries: serie con ascissa temporale condivisa e scale verticali separate; nessuna sovrapposizione di stato e ingresso con unità diverse.
- SurfacePlot3D e TrajectoryViewer estesi con curve, punti, piani e sezioni forniti come dati numerici.
- FeedbackDiagram, IntervalBand, EquilibriumPoses e UnitCircleInset: composizioni schematiche riutilizzabili.

Tutte le chiamate a Plotly rimangono in SceneViewport. Nessun modello fisico viene derivato dentro il renderer.

## Matematica e dati numerici

I moduli puri sono frontend/src/math/introduction.ts e introductionData.ts. Riutilizzano i moduli F05 per costo diagonale, residui, indici, campionamento ed Euler. Le costanti degli esempi sono raccolte in introductionFixtures, con profili distinti per drone e pendolo.

| Caso | Risultato verificato |
| --- | --- |
| p8: a=1,u=1,x⁰=0 | x(1)=1−exp(−1)≈0.6321; y=x solo nell'esempio |
| p8: a=0 | x(t)=x⁰+ut, senza divisione per zero |
| p12: Δx=.1,Δu=0 | esatta .21, lineare .2, errore .01 |
| p12: Δx=0,Δu=.1 | entrambe .1, errore zero; nessun errore relativo indefinito |
| p16: W=diag(1,4),e=(1,1) | contributi .5 e 2, totale 2.5 |
| p16: pesi nulli | costo zero e piano piatto; nessuna curvatura inventata |
| p17: a=b=c=1 | residui −1,0,3 ai punti (0,0),(1,0),(2,0) |
| p17: degenerazioni | origine, insieme vuoto, retta, intero piano e regioni non limitate distinti |
| p27: δ=.1 | primo passo p_y=0,v_y=.219; secondo .0219,.438 |
| p27: durata 1 s | Euler p_y=.9855,v_y=2.19; continuo p_y=1.095 |
| p30: min=1,max=3,p_y=3.2 | residuo superiore e violazione .2 |
| p30: T=1 | ingresso u₀, stato previsto x₁; nessun u₁ |
| p34: θ=π/6 | u_e=4.905; velocità e due residui dinamici nulli |

Per p17 il livello g=0 non viene chiamato bordo topologico quando l'insieme è tutto il piano. Le degenerazioni sono classificate dalla formula, non dal ritaglio della griglia.

La simulazione p27 è forward Euler simultaneo: ogni componente usa il vecchio stato. La durata resta 1 s e N=1/δ è il numero di passi dell'esempio, distinto dall'orizzonte T del corso. Il playback seleziona campioni già calcolati; cambiare δ mette in pausa e riporta il cursore a zero.

P30 è una verifica puntuale di quota e un richiamo simbolico ai limiti degli ingressi. Non viene inventata una traiettoria del drone, né certificata la sicurezza fra campioni. P34 mostra un luogo di equilibri, senza animare un trasferimento o dedurre stabilità.

## Warning e immutabilità

| Pagina | Policy applicata nella UI |
| ---: | --- |
| 16 | CORRECTION_WARNING rosso accanto all'espansione con w₂; tutti i numeri derivano dalla forma corretta |
| 17 | INFO_WARNING locale vicino al grafico: la figura originale è qualitativa |
| 30 | CORRECTION_WARNING accanto ai due domini temporali, sempre presente al cambio vista |
| 34 | CORRECTION_WARNING accanto a x₂,e=0; alias l≡ℓ e m≡M limitati al pendolo |

studentNotices continua a proiettare solo i campi ammessi. correction_reason non viene mostrato; nessuna espressione nota come errata viene valutata. NO_WARNING non produce UI.

Traccia: source_math / source_literal immutabile → decisione F03 → formula del manifest → funzione pura → dato numerico → esempio e grafico. Nessun overlay correttivo viene aggiunto al PDF.

## Modalità 2D/3D

| Pagina | Modalità vincolante | Vista iniziale e collegamento |
| ---: | --- | --- |
| 2 | 2D_ONLY | Diagramma e confronto statici; nessun grafico 3D |
| 8 | 2D_PRIMARY_WITH_3D | 2D; sezione temporale e superficie tempo–ingresso–stato |
| 12 | 3D_PRIMARY_WITH_2D | 3D; superficie/piano e sezione a Δu corrente |
| 16 | 3D_PRIMARY_WITH_2D | 3D; costo e livelli .5,1,2,4 dalla stessa griglia |
| 17 | 2D_AND_3D_EQUAL | 2D; regione, superficie del residuo e piano zero |
| 27 | 3D_PRIMARY_WITH_2D | 3D; tempo–quota–velocità e due serie temporali con lo stesso cursore |
| 30 | 2D_PRIMARY_WITH_3D | 2D; banda e sezione corrente del residuo massimo |
| 34 | 3D_PRIMARY_WITH_2D | 3D; curva (θ_e,0,u_e), proiezione e due configurazioni planari |

Le terze coordinate sono quelle matematiche di F04.1. Il drone resta planare. Selezione e ID sono condivisi dove utili; il cambio vista non modifica parametri, costi o residui.

## Layout e revisione visiva

Sono stati aperti e ispezionati screenshot reali della build di produzione: otto viste desktop 1500×1000, otto companion complete 960×1280 e sette viste alternative 2D/3D. I test includono anche viewport 900 e 560 px.

La revisione ha portato a correggere problemi effettivi: etichette sovrapposte nelle serie allineate, assi 3D troppo ingombranti e blocchi che eccedevano l'altezza. Ora la toolbar camera è inclusa nell'altezza del viewport; unità e simboli 3D hanno una legenda leggibile; i titoli sulle serie temporali sono orizzontali. Non sono stati ridotti i caratteri di prosa e formule per fare entrare le pagine.

Corpo 24 px, formule 28 px, didascalie e warning 22 px nella tela logica; larghezza minima 720 px prima di applicare lo scroll interno. Tutte le companion hanno altezza 1280; i blocchi e i takeaway terminano entro circa 1240 px. Le formule principali non richiedono scorrimento orizzontale e i warning non sono tagliati.

Su desktop 1500×1000 la pagina verticale richiede scroll nel pannello companion; la toolbar di navigazione resta disponibile e il PDF scorre indipendentemente. Cambiare pagina riporta entrambi i pannelli all'inizio, conservando i parametri locali della sessione.

| Pagina | Desktop | Companion completa | Vista alternativa |
| ---: | --- | --- | --- |
| 2 | [desktop](F06_assets/page-02-desktop.png) | [960×1280](F06_assets/page-02-companion.png) | — |
| 8 | [desktop](F06_assets/page-08-desktop.png) | [960×1280](F06_assets/page-08-companion.png) | [3D](F06_assets/page-08-3d.png) |
| 12 | [desktop](F06_assets/page-12-desktop.png) | [960×1280](F06_assets/page-12-companion.png) | [2D](F06_assets/page-12-2d.png) |
| 16 | [desktop](F06_assets/page-16-desktop.png) | [960×1280](F06_assets/page-16-companion.png) | [2D](F06_assets/page-16-2d.png) |
| 17 | [desktop](F06_assets/page-17-desktop.png) | [960×1280](F06_assets/page-17-companion.png) | [3D](F06_assets/page-17-3d.png) |
| 27 | [desktop](F06_assets/page-27-desktop.png) | [960×1280](F06_assets/page-27-companion.png) | [2D](F06_assets/page-27-2d.png) |
| 30 | [desktop](F06_assets/page-30-desktop.png) | [960×1280](F06_assets/page-30-companion.png) | [3D](F06_assets/page-30-3d.png) |
| 34 | [desktop](F06_assets/page-34-desktop.png) | [960×1280](F06_assets/page-34-companion.png) | [2D](F06_assets/page-34-2d.png) |

L'ispezione delle immagini è stata svolta in questa sessione da Codex. La valutazione didattica e di usabilità da parte di una persona resta da svolgere: READY_FOR_HUMAN_REVIEW indica che gli artefatti sono pronti per tale valutazione.

## Test, build e performance

**116/116 test superati:** 62 frontend, 20 browser Chrome reale, 34 pipeline Python. TypeScript e production build PASS.

I test numerici sono indipendenti dalla UI e verificano oracoli, segni, Jacobiani, casi limite, dati delle superfici e identità delle proiezioni. I test browser coprono tutte le otto pagine, formule complete, warning, input, toggle, camera, resize, sincronizzazione, persistenza e cleanup. Le sei verifiche browser F05 continuano a passare.

La build statica è stata avviata su 127.0.0.1:4173 e percorsa per tutte le otto pagine e le sette viste alternative. Nessun errore JavaScript o richiesta fallita; il PDF ricevuto ha lo stesso SHA-256 dell'originale.

Le superfici sono memorizzate secondo i parametri da cui dipendono. Cambiare Δx/Δu a p12 sposta punti/sezioni e conserva il buffer della superficie; a p8 cambiare u seleziona una sezione senza ricampionare la famiglia. Le copie destinate al backend mantengono i buffer numerici invariati e isolano gli originali dalle mutazioni di Plotly.

Un test reale a p16 conserva nodo DOM e camera dopo la modifica di un peso e verifica il valore aggiornato sia nella superficie sia nei contorni. La navigazione verso un placeholder elimina scene e canvas grafici della lezione. Le misure locali sono in f06_runtime_measurements.json; includono automazione e rendering software SwiftShader, senza benchmark di GPU fisica o prova di assenza di leak tramite heap.

Nella misura locale, cinque modifiche di w₂ su griglia 49×49 richiedono 153–257 ms dall'input al grafico aggiornato, inclusa l'automazione. Nodo e camera restano identici; sulla pagina placeholder finale non rimangono scene o canvas WebGL della lezione.

Report verificabili:

- [Audit finale](../Data/reports/f06_vertical_slice.json)
- [Test numerici](../Data/reports/f06_math_validation.json)
- [Test browser](../Data/reports/f06_browser_tests.json)
- [Regressione pipeline](../Data/reports/f06_pipeline_tests.json)
- [Geometria e smoke della produzione](../Data/reports/f06_visual_measurements.json)
- [Misure di aggiornamento e cleanup](../Data/reports/f06_runtime_measurements.json)

## Avvio e ripetizione

    cd frontend
    npm ci
    npm run dev

Aprire http://127.0.0.1:5173/#/study?page=2. Tutte le altre pagine della slice sono raggiungibili dall'input nella toolbar.

    npm test
    npm run test:browser
    npm run typecheck
    npm run build
    npm run verify:sources
    npm run preview

Con l'anteprima attiva a 4173:

    $env:F06_BASE_URL='http://127.0.0.1:4173'
    node scripts/review-vertical-slice.mjs
    node scripts/measure-vertical-slice.mjs

I test usano Chrome installato, con WebGL software configurato in Playwright. Il codice dell'app non forza SwiftShader. Restano da misurare prestazioni e usabilità sul dispositivo dello studente; non sono issue bloccanti della slice verificata.

## Stato finale

    VERTICAL_SLICE_PAGES = 8/8
    PAGE_2 = PASS
    PAGE_8 = PASS
    PAGE_12 = PASS
    PAGE_16 = PASS
    PAGE_17 = PASS
    PAGE_27 = PASS
    PAGE_30 = PASS
    PAGE_34 = PASS
    SOURCE_WARNINGS = PASS
    MATH_VALIDATION = PASS
    GRAPHICS_2D = PASS
    GRAPHICS_3D = PASS
    COMBINED_VIEWS = PASS
    VISUAL_REVIEW = PASS
    PAGE_SYNC = PASS
    TESTS = 116/116
    BUILD = PASS
    OTHER_COMPANIONS_IMPLEMENTED = 0
    UNRESOLVED_VERTICAL_SLICE_ISSUES = 0
    READY_FOR_HUMAN_REVIEW = YES
    READY_FOR_F07 = YES
