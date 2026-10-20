# Studio — Introduction completa

React/TypeScript/Vite, PDF.js, KaTeX e Plotly.js. Sono implementate tutte le 36 companion Introduction. Gli altri PDF restano fuori dall’implementazione.

Da questa directory, con Node 22.12+ e npm:

    npm ci
    npm run dev

Studio: http://127.0.0.1:5173/#/study?page=1

Playground tecnico: http://127.0.0.1:5173/#/dev

I comandi predev/prebuild copiano il PDF e il manifest originali, senza modificarli, in public/course-assets. Il PDF è verificato tramite SHA-256. Font, CMap e WASM di PDF.js sono serviti localmente.

Verifiche:

    npm run typecheck
    npm test
    npm run test:browser
    npm run build
    npm run verify:sources

I test browser usano Google Chrome installato, senza scaricare un altro browser. In CI cambiare channel nel file playwright.config.ts se necessario.

Build statica:

    npm run build
    npm run preview

Aprire http://127.0.0.1:4173/. La directory dist contiene anche tutte le risorse locali.

## Architettura delle companion

I renderer semantici in src/companion/lessons sono caricati dal registro src/companion/registry.ts, che copre le pagine 1–36. Ognuno riceve una CompanionDefinition e compone LessonFrame / CompanionPage nella geometria del manifest.

LessonFrame, FormulaDeck, LessonControls e LiveMetrics condividono impaginazione e interazioni. I parametri del manifest vengono conservati per pagina nella sessione; il cambio pagina riporta lo scroll all'inizio.

La matematica produce dati tramite src/math e src/simulations. Le API pubbliche in src/visualization ricevono soltanto dati numerici. Solo core/SceneViewport.tsx importa Plotly e ne esegue metodi.

Usare visualization.visualizationMode e interaction.effective_enabled: i campi precedenti sono la baseline F04. Non interpretare formule source_literal come codice. Per gli avvisi usare studentNotices e SourceWarnings con l'anchor locale.

Il report corrente è [F07_COMPLETE_INTRODUCTION](../Docs/F07_COMPLETE_INTRODUCTION.md); i report F05, F06 e F06.1 conservano i risultati storici.

Con npm run preview attivo è possibile rigenerare gli screenshot e le misure:

    $env:F07_BASE_URL='http://127.0.0.1:4173'
    $env:F07_BATCH='ALL'
    node scripts/review-introduction.mjs
    $env:F07_RUNTIME_ALL='YES'
    node scripts/verify-introduction-runtime.mjs

I cataloghi di spiegazione conservano il LaTeX canonico separatamente dalla
presentazione su più righe. CourseExplorer condivide toggle e camera;
interactiveDefinition integra i controlli F04.1 senza modificare il manifest.
TrackingExplorer riusa lo stesso modello per candidata fissa (p22) e ottima (p25).
