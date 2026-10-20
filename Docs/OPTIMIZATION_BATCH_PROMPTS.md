# Optimization: prompt per batch separati e ripresa

Documento operativo per future richieste. Nessuna companion di Optimization viene implementata da questa consegna.

## Modalità consigliata

Una richiesta esegue un solo batch. Per separare anche il contesto, aprire preferibilmente una nuova conversazione nello stesso workspace per il batch successivo. Una nuova richiesta nella stessa conversazione conserva la cronologia accumulata.

I riferimenti persistenti sono soltanto:

- [OPTIMIZATION_COMPANION_BRIEF.md](OPTIMIZATION_COMPANION_BRIEF.md): qualità grafica, spiegazioni e riferimenti Introduction.
- Questo documento: suddivisione e istruzioni di esecuzione.
- [OPTIMIZATION_PROGRESS.md](OPTIMIZATION_PROGRESS.md): stato breve del lavoro e prossima azione.
- Codice e PAGE_SPEC effettivi: contenuti, formule, analisi e decisioni di dettaglio.

La chiusura di un batch è un limite di ambito scelto per rendere il lavoro riprendibile. Non è un gate di approvazione: dentro il batch si procede autonomamente fino al risultato completo.

## Suddivisione delle 81 pagine fisiche

I blocchi derivano dai titoli censiti nell'ingestion. L'analisi individuale deve ancora essere svolta; questa tabella non ne costituisce un sostituto.

| Batch | Pagine fisiche | Numero | Contenuto prevalente |
| --- | --- | ---: | --- |
| A | 1–9 | 9 | Introduzione, notazione, condizioni di ottimalità non vincolate |
| B | 10–18 | 9 | Convessità, monotonia del gradiente, forte convessità e Lipschitz |
| C | 19–25 | 7 | Interpretazioni geometriche, minimizzazione convessa e QP non vincolati |
| D | 26–33 | 8 | Algoritmi iterativi, direzioni di discesa e gradient method |
| E | 34–37 | 4 | Newton, modello quadratico locale e collegamento con il gradiente |
| F | 38–46 | 9 | Scelta del passo, Armijo, convergenza ed esempio quadratico |
| G | 47–54 | 8 | Insiemi convessi, proiezione, direzioni ammissibili e introduzione alle barriere |
| H | 55–62 | 8 | Problema vincolato, vincoli attivi, regolarità, Lagrangiana e KKT |
| I | 63–68 | 6 | Osservazioni KKT, condizioni del secondo ordine e QP vincolati |
| J | 69–74 | 6 | Algoritmi vincolati, Newton e introduzione a SQP |
| K | 75–81 | 7 | Merit function, Armijo vincolato, SQP, barriere e raccordo della notazione |
| Totale | 1–81 | 81 | Copertura completa senza sovrapposizioni |

Il batch E è più piccolo perché quattro pagine su Newton possono richiedere più lavoro matematico e grafico di molte pagine introduttive. Anche negli altri batch la densità effettiva prevale sulla velocità: un'interruzione si riprende dalla pagina e dal passaggio salvati, senza comprimere il contenuto per chiudere il blocco.

## Come si svolge ciascun batch

All'inizio leggere brief, stato e codice pertinente. Controllare che l'avanzamento dichiarato corrisponda ai file: una pagina parziale va ripresa, una già completa va riutilizzata. I report storici Introduction non descrivono necessariamente lo stato attuale dei componenti.

Analizzare tutte le pagine del batch in ordine fisico, una per una, con testo e immagine reali. Considerare precedente e successiva anche quando sono fuori batch; leggere ulteriori prerequisiti quando servono alla notazione o al ragionamento. Nella preparazione iniziale consultare le convenzioni delle pagine 5–7 e 79–81, senza considerarle già analizzate o implementate per questo motivo.

Completare le analisi pertinenti nei PAGE_SPEC, progettare e implementare le companion del batch. Una pagina o una famiglia già sufficientemente analizzata può essere lavorata fino alla revisione visiva prima di passare alla successiva. Il batch non deve terminare con la sola analisi o con soli prototipi. Le letture fuori batch servono al contesto e non autorizzano a implementare altre pagine.

Nel batch A predisporre il supporto necessario al secondo documento: selezione del PDF, registro distinto, navigazione e stato separati per documento. Riutilizzare il sistema grafico e mantenere disponibili le 36 companion Introduction. L'ordine dei nuovi batch è sequenziale; il precedente primo gruppo rappresentativo globale è sostituito dall'affinamento dei componenti man mano che compaiono le nuove famiglie visive.

Ogni pagina finita comprende spiegazione specifica, formule spiegate nel contesto, esempi quando utili e grafici pertinenti, con interazioni motivate e dati coerenti. Il PDF originale resta intatto. Eventuali correzioni vivono nella companion e conservano la provenienza; le trascrizioni letterali non si riscrivono. Una pagina fisica mantiene la propria identità anche se progressiva o accompagnata da sub-page.

Rivedere nel browser tutte le pagine del batch e le loro viste pertinenti. Controllare significato del grafico, leggibilità nella slide normale, etichette, scale, camera, fullscreen ed effetti dei parametri. Correggere internamente prima di dichiarare il batch concluso. Eseguire controlli numerici mirati per formule e algoritmi introdotti e controlli tecnici proporzionati alle modifiche; nessuna suite completa ripetuta come gate per ogni blocco.

## Ripresa dopo un'interruzione

Aggiornare `OPTIMIZATION_PROGRESS.md` prima di iniziare una pagina, quando cambia il passaggio operativo rilevante e dopo la sua conclusione. Scrivere subito anche le decisioni riutilizzabili che incidono sul resto del documento. Le informazioni necessarie non devono dipendere da un riepilogo scritto soltanto a fine sessione.

Il file distingue pagine analizzate, implementate e riviste nel browser. La pagina è completa solo quando il lavoro effettivo è concluso; l'esistenza di un file o di un renderer registrato non basta. Annotare eventuali sub-page necessarie ancora mancanti.

Per una pagina in corso bastano: numero fisico, passaggio raggiunto, file interessati, problema aperto e prossima azione concreta. I dettagli matematici restano nei PAGE_SPEC e nei moduli pertinenti. Se l'interruzione è improvvisa, alla ripresa controllare i file effettivi e aggiornare lo stato prima di continuare.

La riduzione del contesto della conversazione non richiede di accorciare spiegazioni, PAGE_SPEC o derivazioni salvate. Si rilegge la fonte del batch attivo e si recuperano dai file soltanto le decisioni necessarie.

## Prompt completo da copiare per iniziare o proseguire

```text
Lavora sul PDF OPTCON-RL_optimization_2026_09_14.pdf in modalità
BATCH SEPARATI.

Leggi:
- Docs/OPTIMIZATION_COMPANION_BRIEF.md
- Docs/OPTIMIZATION_BATCH_PROMPTS.md
- Docs/OPTIMIZATION_PROGRESS.md

Esegui soltanto il primo batch incompleto nella sequenza A–K.
Se un batch è già in corso, riprendilo dalla pagina e dal passaggio
effettivamente incompleti. Verifica lo stato sui file e conserva il lavoro
già concluso. Se lo stato manca, ricostruiscilo dal repository; non assumere
che tutto sia da rifare. Se A–K sono tutti completi, verifica la copertura
finale e comunica l'esito senza rigenerare le pagine.

La priorità è la qualità grafica e didattica di Introduction:
spiegazioni precise e comprensibili, grafici utili e leggibili, stessi
componenti, tipografia e linguaggio visivo. Usa come riferimenti le
companion Introduction 12, 16, 17, 27 e 34, nella loro versione attuale.

Per ogni pagina del batch usa testo estratto e immagine originale,
considera le vicine e i prerequisiti necessari, conserva la notazione.
Completa l'analisi nei PAGE_SPEC pertinenti, progetta la companion,
implementala e rivedila nel browser. Distingui fonte, enrichment e
correzioni. Non modificare PDF, immagini originali, testo estratto o
source_literal. Non alterare i manifest validati di Introduction.

Spiega le formule dove sono usate. Proponi esempi pertinenti, interazioni
con effetti chiari e 3D quando migliora la comprensione. Mantieni coerenti
dati, viste 2D/3D, controlli e risultati. Gestisci le ipotesi e i casi limite.
Non ridurre accuratezza, caratteri o grafici per far entrare contenuti densi.
Prevedi sub-page soltanto quando servono davvero.

Nel batch A aggiungi il supporto necessario a navigare Optimization come
secondo documento, conservando Introduction e separando identità e stato.
Nei batch successivi riutilizza questo supporto e correggi i componenti
comuni quando necessario. Non rigenerare le companion già complete.

Dentro il batch procedi autonomamente, senza chiedere conferme tra pagine
o tra analisi, design e implementazione. Esegui verifiche visive sulle pagine
effettive e controlli numerici/tecnici mirati. Evita suite complete ripetute,
report ridondanti e gate manuali.

Aggiorna Docs/OPTIMIZATION_PROGRESS.md durante il lavoro: pagina corrente,
passaggio, pagine analizzate/implementate/riviste, file importanti,
decisioni da conservare e prossima azione concreta. Non aspettare la fine
della sessione per salvare lo stato. Dichiara completate soltanto le pagine
effettivamente finite, incluse le eventuali sub-page.

Termina quando il batch attivo è completo; non avviare il successivo
in questa richiesta. Non fermarti invece alla sola analisi o ai prototipi
del batch. Alla fine riporta pagine complete, eventuali parti incomplete
e batch successivo. Il documento intero è completo soltanto a 81/81 pagine
fisiche coperte da companion complete e navigabili, senza placeholder.
```

Per selezionare un batch specifico, sostituire «primo batch incompleto» con, per esempio, «batch E, pagine fisiche 34–37». I prerequisiti già implementati vanno riutilizzati; eventuali dipendenze mancanti vanno esplicitate senza espandere silenziosamente il lavoro all'intero documento.

## Prompt breve di ripresa

```text
Riprendi Optimization secondo Docs/OPTIMIZATION_BATCH_PROMPTS.md e
Docs/OPTIMIZATION_COMPANION_BRIEF.md. Leggi Docs/OPTIMIZATION_PROGRESS.md,
verifica il lavoro effettivo nei file e completa soltanto il primo batch
incompleto, ripartendo dalla pagina e dal passaggio salvati. Mantieni
qualità grafica e accuratezza, aggiorna lo stato durante il lavoro e
termina alla conclusione di quel batch. Non rigenerare le pagine finite.
```

## Contesto e dimensione del lavoro

La dimensione effettiva dipende da immagini, formule, codice e risultati degli strumenti, oltre che dal numero di pagine. Il numero di pagine non consente di garantire che un batch rientri in una sessione o in un budget di crediti.

La [documentazione ufficiale OpenAI sulla compattazione](https://developers.openai.com/api/docs/guides/compaction) descrive la riduzione del contesto preservando lo stato utile. Per questo progetto consiglio comunque batch separati e decisioni salvate nei file: permettono di ricostruire il contesto rilevante anche in una nuova conversazione. È una scelta organizzativa, non una garanzia che la compattazione non avverrà.

Il principio di mantenere specifiche e avanzamento nei file del progetto è descritto anche nelle [indicazioni OpenAI sui lavori lunghi con Codex](https://developers.openai.com/blog/run-long-horizon-tasks-with-codex).
