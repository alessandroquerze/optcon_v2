# Global formula explanation policy

Stato: **ACTIVE**, introdotta da F06.1. Requisito permanente per l’intera applicazione, F07 e ogni fase successiva, per Introduction, Optimization, KKT e ogni futuro documento didattico.

## Regola

Ogni formula significativa della companion deve avere una spiegazione concettuale specifica e accessibile dove viene usata. La regola riguarda introduzioni, teoria, derivazioni, esempi, risultati, costi, vincoli, modelli, grafici e simulazioni. Non basta spiegare le formule nel solo pannello di riferimento.

Una formula è significativa se esprime una relazione necessaria per comprendere il concetto, costruire un calcolo, interpretare un risultato o leggere una visualizzazione. Una relazione coerente su più righe può costituire un unico gruppo spiegato: per esempio modello e soluzione nei due rami dello stesso esempio. Relazioni con scopi diversi richiedono spiegazioni distinte.

Simboli isolati, unità, coordinate di un punto e assegnazioni di valori già spiegati non richiedono ciascuno una nuova scheda. Una formula ripetuta usa lo stesso formulaId; la ripetizione deve avere una spiegazione locale o un richiamo immediatamente accessibile alla spiegazione pertinente. Il censimento conta ID semantici distinti, non occorrenze tipografiche.

## Contenuto richiesto

La spiegazione deve chiarire la relazione matematica, fisica o geometrica e perché viene introdotta. La lettura ad alta voce dei simboli non è una spiegazione. Indicare i simboli nuovi, richiamando quelli già definiti; esplicitare ipotesi e limiti quando incidono sull’interpretazione.

Scrivere normalmente una o due frasi, fino a tre se necessarie. Approfondimenti, derivazioni e dizionari possono essere espandibili. Non generare frasi standard per riempire campi mancanti. Un controllo automatico di presenza non certifica qualità didattica: occorre anche revisione semantica.

Esempio: una mappa di transizione spiega come un’azione modifica lo stato futuro. La sola frase «lo stato successivo è uguale a f dello stato e dell’ingresso» non soddisfa la policy.

## Presentazione

Ordine preferito: formula → spiegazione breve visibile → dettagli facoltativi. La spiegazione principale non dipende da hover o tooltip. Se una formula è disponibile solo in un pannello di riferimento, la sua spiegazione compare insieme a essa quando si apre il pannello.

Grafici, valori e componenti interattivi possono richiamare un gruppo già spiegato mediante FormulaContext. Il richiamo deve contenere una lettura concettuale locale, non soltanto un pulsante. Il comando adiacente apre modello e spiegazione senza cambiare pagina, parametri o camera.

I dettagli devono essere utilizzabili da tastiera, scorrere quando lunghi e rientrare nella tela. Le espansioni non sostituiscono o rimpiccioliscono il grafico. Evitare ripetizioni fra introduzione e spiegazione dell’equazione; non diminuire i caratteri per fare entrare il testo. Verificare la tela logica 960×1280 e le viste alternative.

## Grafici e simulazioni

Specificare modello, significato delle variabili e unità. Per ogni controllo indicare che cosa cambia, che cosa resta fisso e perché si osserva l’effetto. Distinguere proprietà garantite, proprietà di un particolare esempio e semplici osservazioni nel dominio visualizzato.

Spiegare il terzo asse: costo, residuo, velocità, ingresso e tempo non diventano automaticamente una coordinata spaziale. Una curva di equilibri non è una traiettoria. Un ritaglio della griglia non prova limitatezza. Una linearizzazione non garantisce validità globale o stabilità; una verifica ai campioni non certifica sicurezza tra campioni.

Le spiegazioni non modificano le funzioni matematiche, i dati numerici, i default o le simulazioni. Ogni eventuale futura modifica matematica richiede una motivazione e verifiche proprie.

## Contratto dati e componenti

Il contratto FormulaExplanation include:

| Campo | Regola |
| --- | --- |
| formulaId | Identità stabile e unica della relazione o del gruppo |
| latex | Espressione canonica; le varianti di impaginazione non sostituiscono questa traccia |
| conceptualExplanation | Obbligatoria, specifica e non tautologica |
| purpose | Problema o uso per cui la relazione viene introdotta |
| symbolDefinitions | Simboli nuovi; quelli già definiti possono essere richiamati |
| assumptions | Ipotesi, dominio e limiti pertinenti |
| optionalDetails | Approfondimenti facoltativi, senza discussioni editoriali |
| relatedFormulaIds | Collegamenti risolvibili a formule dello stesso contesto |
| parameterInterpretation | Effetti dei controlli identificati dal loro ID |
| graphExplanation | Lettura locale della visualizzazione, quando utile |
| origin / sourceFormulaIds | Fonte, correzione o enrichment e tracciabilità |

ExplainedEquation rende la spiegazione obbligatoria per costruzione e separa presentazione da contenuto. EquationCard e InlineMath restano primitive tipografiche: non soddisfano da sole questa policy. Le companion devono usare ExplainedEquation o un equivalente che rispetti lo stesso contratto; simboli isolati nei controlli possono usare InlineMath.

I metadata didattici vivono separatamente dai PAGE_SPEC e dai manifest validati. Per Introduction, formulaExplanations.ts ricava le espressioni canoniche dal manifest senza modificarlo. Il catalogo deve fallire esplicitamente se una nuova formula del manifest è priva di spiegazione: nessun ripiego con testo generico.

## Fedeltà e F03

PDF, immagini, testi estratti e source_literal restano immutabili. Le formule della fonte conservano la notazione; interruzioni di riga e forme equivalenti di presentazione mantengono la relazione canonica tracciabile. Correzioni soltanto nella companion e secondo F03.

Le spiegazioni di una formula corretta descrivono la versione effettivamente usata da calcoli, esempi e simulazioni. I warning rimangono brevi, locali e distinti dalle spiegazioni. Non mostrare agli studenti motivazioni tecniche estese della revisione della fonte.

## Criteri di completamento futuri

Una fase che introduce o modifica contenuti matematici è completa solo se:

1. Censisce tutte le relazioni significative, anche quelle fuori dal pannello formule, con ID, provenienza e contesti d’uso.
2. Associa una spiegazione specifica a ogni ID e verifica simboli, scopo, ipotesi, casi limite e controlli pertinenti.
3. Controlla matematicamente le affermazioni: monotonia, convergenza, stabilità e interpretazioni geometriche richiedono le proprie condizioni.
4. Verifica nel browser la presenza contestuale, l’accesso da tastiera, il comportamento dei dettagli e la conservazione dei risultati interattivi.
5. Esegue revisione visiva con screenshot delle pagine interessate, senza sovrapposizioni significative, formule tagliate o perdita di leggibilità dei grafici.
6. Esegue i test appropriati, TypeScript e build; conserva le fonti e le decisioni F03.

UNEXPLAINED_FORMULAS deve essere zero prima di dichiarare una consegna pronta. La policy resta attiva anche quando cambia documento o si riusa un componente.
