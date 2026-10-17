# Studio — foundation F05 e vertical slice F06

React/TypeScript/Vite, PDF.js, KaTeX e Plotly.js. Sono implementate le sole companion 2, 8, 12, 16, 17, 27, 30, 34; le altre 28 restano placeholder. F07 non è iniziata.

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

I renderer semantici in src/companion/lessons sono caricati dal registro src/companion/registry.ts. Ognuno riceve una CompanionDefinition e compone LessonFrame / CompanionPage nella geometria del manifest. Non sono presenti renderer per le altre 28 pagine.

LessonFrame, FormulaDeck, LessonControls e LiveMetrics condividono impaginazione e interazioni. I parametri del manifest vengono conservati per pagina nella sessione; il cambio pagina riporta lo scroll all'inizio.

La matematica produce dati tramite src/math e src/simulations. Le API pubbliche in src/visualization ricevono soltanto dati numerici. Solo core/SceneViewport.tsx importa Plotly e ne esegue metodi.

Usare visualization.visualizationMode e interaction.effective_enabled: i campi precedenti sono la baseline F04. Non interpretare formule source_literal come codice. Per gli avvisi usare studentNotices e SourceWarnings con l'anchor locale.

I report sono ../Docs/F05_APPLICATION_SHELL.md e ../Docs/F06_VERTICAL_SLICE.md.

Con npm run preview attivo è possibile rigenerare gli screenshot e le misure:

    $env:F06_BASE_URL='http://127.0.0.1:4173'
    node scripts/review-vertical-slice.mjs
    node scripts/measure-vertical-slice.mjs
