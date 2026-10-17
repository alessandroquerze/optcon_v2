# F06.1 — Global formula explanation policy

Stato: **COMPLETATA**. Aggiornate esclusivamente le companion **2, 8, 12, 16, 17, 27, 30, 34**. F07 non è iniziata; le altre 28 pagine conservano il placeholder.

La [policy permanente](GLOBAL_FORMULA_EXPLANATION_POLICY.md) richiede una spiegazione specifica per ogni formula significativa, anche negli esempi e nelle visualizzazioni. È attiva per tutti i futuri documenti, inclusi Optimization e KKT, ed è un criterio di chiusura delle fasi successive nel [piano](IMPLEMENTATION_PLAN.md).

## Censimento e applicazione

Sono censiti **38 ID semantici distinti**: i 28 gruppi di formule del manifest validato e 10 ulteriori relazioni di esempi, grafici e risultati. Le ripetizioni condividono l’ID e non aumentano il conteggio. Un gruppo coerente può contenere più equazioni, come il modello continuo e i suoi due rami di soluzione; simboli isolati, unità e assegnazioni già spiegate non sono contati separatamente.

| Pagina | Formule/gruppi | Copertura concettuale aggiunta o migliorata |
| ---: | ---: | --- |
| 2 | 1 | Costo come distanza dal bersaglio, vincolo come esclusione delle scelte, significato del costo positivo della migliore decisione ammessa. |
| 8 | 5 | Dinamica e condizione iniziale, uscita distinta dallo stato, dimensioni, invarianza temporale, richiamo ed effetto dell’ingresso; limite integratore a=0. |
| 12 | 7 | Mappa discreta, nominale realizzabile, scarti, sensibilità/Jacobiani, piano tangente, variazione esatta e scarto quadratico di un passo. |
| 16 | 4 | Distanza e distanza pesata, significato di W e dei due contributi, curvatura, costo come altezza e degenerazioni dei pesi nulli. |
| 17 | 4 | Regione ammissibile e uguaglianza, confronto unitario fisso, residuo e piano zero, condizioni per l’ellisse e significato delle degenerazioni. |
| 27 | 7 | Mappa Euler, passo positivo, ordine dello stato, aggiornamenti verticali simultanei, accelerazione risultante, tempo fisico/campionamento e riferimento continuo. |
| 30 | 4 | Domini temporali corretti, quota x₃ e residui, massimo firmato e violazione positiva, esempio T=1 con un solo comando. |
| 34 | 6 | Velocità nulla, bilancio gravitazionale, due coppie di equilibrio, legge di sostegno, luogo stato–ingresso e verifica dei due residui dinamici. |
| **Totale** | **38** | **38/38 spiegate; nessuna formula significativa senza spiegazione.** |

Il [censimento JSON](../Data/reports/f06_1_formula_explanations.json) registra per ogni ID espressione canonica, spiegazione osservata nella UI, dettagli, contesti visibili e riferimenti da grafici/esempi. I metadata strutturati completi sono in [formulaExplanations.ts](../frontend/src/companion/formulaExplanations.ts): significato, utilità, simboli, ipotesi, dettagli, collegamenti ed effetti dei controlli.

Le spiegazioni sono enrichment della companion. La provenienza fonte/correzione/enrichment riguarda le espressioni canoniche e non attribuisce alla slide il nuovo testo didattico.

## Architettura e presentazione

[ExplainedEquation](../frontend/src/components/ExplainedEquation.tsx) compone EquationCard con una spiegazione breve visibile e dettagli accessibili da tastiera. Una spiegazione vuota produce un errore esplicito. Il componente non interpreta il LaTeX come modello numerico.

LessonEquation recupera il contenuto dal catalogo; FormulaDeck rende la relazione centrale spiegata e tutte le formule complete nel pannello di riferimento. FormulaContext collega grafici, barre, residui e timeline alla stessa spiegazione, con una lettura locale visibile e un comando adiacente per aprire il modello.

Il catalogo recupera dal manifest le espressioni validate, senza copiarle o modificarle. Se una formula del manifest non ha metadata didattici, fallisce esplicitamente. La notazione canonica rimane tracciata anche quando la presentazione usa interruzioni di riga o una forma equivalente più compatta, come la mappa Euler senza parentesi graffa nella vista principale.

Per evitare ripetizioni, nelle pagine tecniche l’introduzione separata è stata assorbita nella spiegazione sotto l’equazione. I dettagli di simboli, ipotesi e parametri si espandono localmente; non occupano permanentemente lo spazio dei grafici. Le primitive EquationCard/InlineMath restano disponibili per la tipografia, mentre le relazioni didattiche delle otto companion usano il nuovo contratto.

## Correttezza matematica e F03

Moduli matematici, fixture, campionamento e simulazioni sono rimasti identici byte per byte. Tutte le letture numeriche iniziali coincidono con quelle registrate in F06; i test continuano a verificare anche modifiche degli input e casi limite.

| Punto delicato | Interpretazione verificata |
| --- | --- |
| p8 | a cambia rapidità e livello u/a: non si promette una diminuzione monotona di ogni risposta. Il ramo a=0 evita la divisione per zero. y=x è locale all’esempio. |
| p12 | La nominale soddisfa la dinamica; l’uguaglianza del sistema delle variazioni non è un’identità globale per il modello nonlineare. Nessuna garanzia di stabilità. |
| p16 | Secondo termine con w₂. Pesi positivi danno minimo unico; uno nullo lascia una direzione libera; entrambi nulli danno costo zero ovunque. |
| p17 | Ellisse solo sotto le ipotesi appropriate. Aumentare c non restringe l’insieme. Livello zero e bordo topologico non sono sinonimi in tutti i casi; ritaglio e tolleranza numerica sono espliciti. |
| p27 | Posizione aggiornata con la vecchia velocità. Durata fissa, passi N e tempo τ distinti dall’orizzonte T. L’accuratezza osservata non diventa una garanzia universale di stabilità di Euler. |
| p30 | Ingressi 0…T−1, quote 1…T; V è firmato, la violazione è la sua parte positiva. Nessuna certificazione di moto o sicurezza continua. |
| p34 | x₂,e=0; la coppia compensa la gravità. Terzo asse = coppia, curva = luogo di equilibri. Equilibrio non implica stabilità o trasferimento realizzato. |

I warning F03 di p16, p30 e p34 e la nota di p17 conservano il testo validato, la posizione locale e la presenza nelle due viste. Non sono state introdotte nuove correzioni o discussioni editoriali per lo studente.

Verificati **969 file protetti** e una baseline supplementare di **56 file** che comprende report/documenti storici, screenshot F06, registro e moduli matematici/simulativi. Nessuna modifica rilevata. PDF, immagini, testi, PAGE_SPEC, manifest e report F03/F04/F05/F06 restano invariati.

## Browser e revisione visiva

Acquisiti e ispezionati **32 screenshot reali della produzione**: otto desktop, otto companion complete, sette viste alternative, sette pannelli formule e due espansioni contestuali.

Tutte le pagine hanno tela **960×1280**; takeaway entro **1240 px**, nessun debordamento delle formule principali e nessuna sovrapposizione fra blocchi. Verificata anche la geometria delle sette viste alternative. Test browser su viewport desktop, 900 e 560 px conservano navigazione e scroll indipendenti.

Formule a 28 px; spiegazioni e didascalie a 22 px nella tela logica. La revisione ha eliminato testo ripetuto e corretto l’interlinea ereditata dai contenitori. I grafici mantengono spazio dedicato; il pendolo usa una vista di 310 px e una proiezione con pose e grafico separati. La didascalia di p30 è stata abbreviata dopo un debordamento rilevato solo in 3D. Le soglie di layout F06 non sono state allentate.

Le espansioni sono sovrapposizioni intenzionali e reversibili: non spostano la slide, i parametri o la camera. I dettagli lunghi scorrono; quelli vicini al margine inferiore si aprono verso l’alto. Il pannello formule mostra una porzione scorrevole del catalogo; i test raggiungono ciascuna delle 38 spiegazioni.

| Pagina | Desktop | Companion 960×1280 | Vista alternativa | Catalogo |
| ---: | --- | --- | --- | --- |
| 2 | [desktop](F06_1_assets/page-02-desktop.png) | [pagina](F06_1_assets/page-02-companion.png) | — | Esempio nella pagina |
| 8 | [desktop](F06_1_assets/page-08-desktop.png) | [pagina](F06_1_assets/page-08-companion.png) | [3D](F06_1_assets/page-08-3d.png) | [pannello](F06_1_assets/page-08-formula-reference.png) |
| 12 | [desktop](F06_1_assets/page-12-desktop.png) | [pagina](F06_1_assets/page-12-companion.png) | [2D](F06_1_assets/page-12-2d.png) | [pannello](F06_1_assets/page-12-formula-reference.png) |
| 16 | [desktop](F06_1_assets/page-16-desktop.png) | [pagina](F06_1_assets/page-16-companion.png) | [2D](F06_1_assets/page-16-2d.png) | [pannello](F06_1_assets/page-16-formula-reference.png) |
| 17 | [desktop](F06_1_assets/page-17-desktop.png) | [pagina](F06_1_assets/page-17-companion.png) | [3D](F06_1_assets/page-17-3d.png) | [pannello](F06_1_assets/page-17-formula-reference.png) |
| 27 | [desktop](F06_1_assets/page-27-desktop.png) | [pagina](F06_1_assets/page-27-companion.png) | [2D](F06_1_assets/page-27-2d.png) | [pannello](F06_1_assets/page-27-formula-reference.png) |
| 30 | [desktop](F06_1_assets/page-30-desktop.png) | [pagina](F06_1_assets/page-30-companion.png) | [3D](F06_1_assets/page-30-3d.png) | [pannello](F06_1_assets/page-30-formula-reference.png) |
| 34 | [desktop](F06_1_assets/page-34-desktop.png) | [pagina](F06_1_assets/page-34-companion.png) | [2D](F06_1_assets/page-34-2d.png) | [pannello](F06_1_assets/page-34-formula-reference.png) |

Espansioni controllate: [modello del residuo p30](F06_1_assets/page-30-context-details.png), [residui del pendolo p34](F06_1_assets/page-34-context-details.png). Revisione eseguita da Codex; non viene dichiarata una valutazione didattica da parte di studenti o docenti. Il 3D è verificato con Chrome/SwiftShader, senza un nuovo benchmark hardware.

## Test e audit ripetibile

**140/140 test PASS**: 78 frontend, 28 browser, 34 pipeline. TypeScript e build di produzione PASS. Nessun errore JavaScript o richiesta fallita nella revisione della produzione.

I nuovi test verificano copertura del catalogo, provenienza canonica, riferimenti, effetti di tutti i controlli, rifiuto delle formule non censite, spiegazione obbligatoria, testo non eseguibile e accesso ai dettagli. Nel browser verificano le spiegazioni contestuali delle otto pagine, i contenuti del catalogo, l’apertura da tastiera e la conservazione dei risultati.

I test F05/F06 continuano a passare: oracoli matematici, warning, parametri, toggle, camera e nodo conservati, superfici invarianti, playback, casi degeneri, sincronizzazione PDF, resize, reset e cleanup. La qualità specifica e non tautologica del testo è stata controllata semanticamente; una verifica di sola presenza non la dimostra.

Evidenze:

- [Audit completo e censimento](../Data/reports/f06_1_formula_explanations.json)
- [Conservazione matematica e confronto con F06](../Data/reports/f06_1_math_validation.json)
- [Test frontend](../Data/reports/f06_1_unit_tests.json)
- [Test browser](../Data/reports/f06_1_browser_tests.json)
- [Test pipeline](../Data/reports/f06_1_pipeline_tests.json)
- [Misure e smoke della produzione](../Data/reports/f06_1_visual_measurements.json)

Da frontend, dopo l’avvio locale:

    npm test
    npm run test:browser
    npm run typecheck
    npm run build
    npm run verify:sources
    npm run preview

Con preview attiva su 4173:

    $env:F06_1_BASE_URL='http://127.0.0.1:4173'
    node scripts/review-formula-explanations.mjs

Dalla radice, dopo i test pipeline e l’ispezione degli screenshot:

    .venv/Scripts/python.exe frontend/scripts/audit-formula-explanations.py

L’audit verifica le evidenze e gli hash; la revisione semantica e l’ispezione delle immagini restano attività esplicite, non giudizi prodotti automaticamente dal programma.

## Stato finale

    FORMULA_EXPLANATION_POLICY = PASS
    UPDATED_COMPANION_PAGES = 8/8
    MEANINGFUL_FORMULAS = 38
    FORMULAS_WITH_CONCEPTUAL_EXPLANATION = 38/38
    UNEXPLAINED_FORMULAS = 0
    INTERACTIVE_FORMULA_EXPLANATIONS = PASS
    MATHEMATICAL_VALIDATION = PASS
    VISUAL_REVIEW = PASS
    F06_REGRESSIONS = 0
    TESTS = 140/140
    BUILD = PASS
    FUTURE_DOCUMENT_POLICY = ACTIVE
    READY_FOR_F07 = YES

READY_FOR_F07 indica preparazione tecnica. F07 non è stata avviata; nessuna delle altre 28 companion è stata implementata.
