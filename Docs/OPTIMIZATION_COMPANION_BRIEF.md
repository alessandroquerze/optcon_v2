# Optimization: replicare la qualità grafica e didattica

Brief per una successiva lavorazione di `OPTCON-RL_optimization_2026_09_14.pdf`. Questa consegna contiene soltanto indicazioni: non avvia analisi, implementazione o generazione di companion.

La priorità richiesta è la qualità delle spiegazioni e dei grafici, insieme alla continuità visiva con Introduction. Il flusso proposto elimina gate manuali e collaudi estesi ripetuti tra blocchi. I documenti delle fasi precedenti rimangono come storico.

**Modalità a batch separati:** per lavorare con richieste o conversazioni distinte usare [OPTIMIZATION_BATCH_PROMPTS.md](OPTIMIZATION_BATCH_PROMPTS.md). In questa modalità si analizzano e implementano le pagine del solo batch attivo, considerando le altre come contesto quando necessario, e si termina al completamento del batch. Queste indicazioni di ambito e arresto prevalgono sul prompt globale di fine documento; gli standard grafici e didattici di questo brief rimangono validi. Lo stato di ripresa è in [OPTIMIZATION_PROGRESS.md](OPTIMIZATION_PROGRESS.md).

## Da dove partire

Il catalogo contiene già le **81 pagine fisiche**, con testo, rendering e PAGE_SPEC individuali. Le 81 analisi risultano ancora `pending`: l'estrazione esiste, l'interpretazione didattica deve essere svolta.

Sono già disponibili lettore PDF, layout companion, componenti grafici 2D/3D, controlli, formule spiegate e fullscreen. Si riutilizzano queste fondamenta. Nell'implementazione futura servirà anche rendere selezionabile il documento: attualmente il registro dei renderer e alcune etichette sono specifici di Introduction. Pagina 16 di Optimization e pagina 16 di Introduction dovranno avere identità distinte, anche per parametri e camera salvati.

## Il riferimento visivo deve essere concreto

Usare le companion esistenti come riferimenti diretti, osservandole nel browser:

| Riferimento Introduction | Cosa riutilizzare |
| --- | --- |
| Pagina 16 | Rapporto fra formula, spiegazione, superficie, livelli 2D, controlli ed esempio numerico |
| Pagina 17 | Leggibilità di vincoli e regioni ammissibili, distinzione fra superficie e insieme |
| Pagina 12 | Confronto fra funzione e approssimazione locale |
| Pagina 27 | Animazione controllabile, campione corrente e lettura dei risultati |
| Pagina 34 | Composizione di diagramma e grafico, senza confondere geometria e traiettoria |

Il riferimento riguarda la qualità della presentazione; il contenuto viene progettato per il nuovo concetto.

Conservare tela logica **960×1280**, tipografia, spaziature, colori, trattamento delle formule, slider e pulsanti. Riutilizzare `CompanionPage`, `LessonFrame`, `ExplainedEquation`, `ParameterControl` e la libreria `visualization`, adattando soltanto le parti legate al documento. `SceneViewport` e `GraphicViewport` forniscono già fullscreen e gestione della camera.

Coerenza non significa assegnare a tutte le pagine lo stesso impaginato. Una definizione, una dimostrazione, un algoritmo e un esempio richiedono composizioni diverse, mantenendo lo stesso linguaggio visivo. Le correzioni a un componente condiviso devono migliorare tutte le pagine che lo usano; le particolarità didattiche rimangono nella singola lezione.

## La qualità della spiegazione

Ogni companion deve rispondere a una domanda riconoscibile: cosa deve capire lo studente dopo averla letta?

La struttura preferita è: idea intuitiva breve, formula pertinente con spiegazione locale, rappresentazione visiva, esempio utile e conclusione concreta. I dettagli più lunghi possono essere espandibili. La spiegazione principale deve essere leggibile senza aprire pannelli.

Per una formula, chiarire **che relazione descrive, perché serve e quali ipotesi permettono di usarla**. Evitare la sola lettura dei simboli e frasi generiche come «questa formula permette di ottimizzare». Per un algoritmo, spiegare che cosa produce una singola iterazione e perché quel movimento può essere utile. Per un teorema, distinguere ipotesi, conclusione e ciò che non è garantito.

Applicare la [policy delle spiegazioni](GLOBAL_FORMULA_EXPLANATION_POLICY.md) soprattutto come criterio di scrittura. Non riempire la slide di schede ripetitive per soddisfare un conteggio di formule.

Leggere ogni pagina con testo e immagine, considerando le vicine e le eventuali progressive. Conservare simboli, indici e convenzioni del corso. Le pagine finali sulla notazione vanno considerate nella preparazione generale: aiutano a distinguere variabile di decisione, indice di iterazione e tempo del sistema.

Gli esempi e le intuizioni aggiunte devono essere riconoscibili come enrichment. Eventuali errori della fonte si correggono soltanto nella companion, con warning breve e locale. Originale, testo estratto e trascrizioni letterali rimangono immutabili.

Mapping preferito: una pagina fisica → una companion. Una progressiva mantiene la propria pagina e mette in evidenza il nuovo passaggio. Quando il contenuto richiede davvero più spazio, usare sub-page motivate oppure approfondimenti pertinenti; non ridurre caratteri e grafici per comprimere tutto.

## La qualità del grafico

Prima di costruirlo, decidere quale relazione deve rendere visibile. La seguente tabella propone rappresentazioni da valutare durante l'analisi; non descrive contenuti già verificati nelle singole slide.

| Concetto | Rappresentazione utile | Cosa dovrebbe diventare evidente |
| --- | --- | --- |
| Convessità | Curva, segmento fra due punti e relativi valori | Il confronto geometrico che esprime la disuguaglianza |
| Gradiente e curvatura | Livelli, vettore gradiente, superficie e sezioni | Direzione di variazione e ruolo della curvatura |
| Gradient method | Iterati sui livelli, valore del costo rispetto all'iterazione | L'effetto di direzione e passo sul percorso |
| Newton | Modello quadratico locale e passo risultante | Come il modello locale determina l'aggiornamento e quali limiti ha |
| Proiezione | Insieme ammissibile, punto intermedio e punto proiettato | Differenza fra passo libero e aggiornamento ammissibile |
| Armijo | Funzione lungo una direzione, soglia e passi candidati | Perché un passo viene accettato o ridotto |
| KKT | Vincoli attivi e vettori pertinenti alle condizioni della pagina | La relazione geometrica fra costo, vincoli e moltiplicatori |
| SQP | Problema locale e aggiornamenti successivi | Il legame fra approssimazione locale e problema originale |

Usare il 3D quando l'altezza rappresenta una quantità precisa e rende più chiaro il concetto. Conservare una vista 2D quando permette letture più accurate. Le due viste devono derivare dagli stessi dati e mostrare la stessa selezione. Il supporto 3D disponibile non impone una scena 3D a ogni pagina.

Etichette, segni, unità, legenda, domini e camera fanno parte della spiegazione. Mostrare dove utile punto corrente, direzione, passo e soluzione nota dell'esempio. Tenere distinguibili candidata e ottimo, vincolo e traiettoria. Evitare cambi automatici di scala che facciano sembrare identici effetti diversi. Rendere espliciti i valori fuori dal ritaglio visualizzato.

Ogni controllo deve avere un effetto didattico riconoscibile: cosa cambia, cosa resta fisso e quale effetto osservare. Preferire pochi parametri rilevanti. Le animazioni degli algoritmi devono consentire almeno avanzamento per iterazione e reset; l'indice di iterazione deve essere distinguibile dal tempo fisico.

Per confrontare metodi, mantenere uguali problema, punto iniziale e criterio di confronto quando questo è lo scopo. Conservare esempi ricorrenti fra pagine adiacenti se aiutano la progressione; non trasferire dati tra problemi con ipotesi differenti. Divergenza, infeasibilità, singolarità e altri casi limite devono essere rappresentati onestamente. Il comportamento di un esempio non costituisce una garanzia generale di convergenza.

Il grafico deve essere leggibile nella companion normale. Il fullscreen offre uno spazio aggiuntivo di esplorazione.

## Come lavorare sulle 81 pagine

Fare prima una lettura puntuale in ordine, riutilizzando gli artefatti esistenti. Per ciascuna pagina fissare soltanto ciò che serve a costruirla bene: obiettivo, fonte e notazione, spiegazione, esempio, grafico, effetti dei controlli ed eventuali dubbi matematici. I PAGE_SPEC esistenti sono il luogo naturale per questa analisi; non serve una nuova catena di report equivalenti.

Poi realizzare un primo gruppo rappresentativo delle principali famiglie visive, scelto dopo l'analisi: geometria di una funzione, iterazioni, modello locale, proiezione e condizioni vincolate. Confrontarlo internamente con i riferimenti di Introduction e correggere i componenti comuni. Proseguire autonomamente sulle altre pagine, senza richiesta di approvazione.

L'organizzazione seguente deriva dai titoli già censiti e rimane da affinare con la lettura effettiva:

| Pagine fisiche | Famiglia concettuale |
| --- | --- |
| 1–9 | Introduzione, notazione, condizioni non vincolate |
| 10–25 | Convessità, regolarità e problemi quadratici |
| 26–46 | Metodi iterativi, gradiente, Newton e scelta del passo |
| 47–54 | Insiemi convessi, proiezione e introduzione alle barriere |
| 55–68 | Vincoli, regolarità, Lagrangiana, KKT e QP |
| 69–78 | Algoritmi vincolati, Newton, SQP, merit function e barriere |
| 79–81 | Raccordo della notazione con il controllo ottimo |

I blocchi lunghi si possono lavorare in gruppi di circa 6–10 pagine, rispettando derivazioni e progressive. Servono a mantenere attenzione e continuità, non sono checkpoint da approvare.

## Dove investire il tempo

La revisione prioritaria consiste nell'aprire le pagine reali, leggere spiegazioni e formule, usare i controlli e guardare i grafici nelle viste disponibili. Verificare tutte le pagine; conservare screenshot quando aiutano a giudicare un layout o documentare un problema. Correggere durante il lavoro e proseguire.

Git permette di recuperare un layout precedente. Per la qualità didattica rimane utile controllare i calcoli che alimentano esempi e grafici: un passo di Newton errato può produrre una figura plausibile. Bastano verifiche mirate ai modelli e alle affermazioni introdotte, senza costruire una suite estesa per ogni pagina.

Avvio e build sono controlli tecnici rapidi quando necessari. Ripetere l'intera suite, produrre audit voluminosi o attendere approvazioni tra blocchi non è la priorità di questo flusso. I test esistenti rimangono disponibili; nuovi test hanno senso soprattutto per una nuova funzione matematica delicata o una modifica al componente condiviso.

## Prompt per avviare il lavoro in una successiva richiesta

> Realizza le companion del PDF `OPTCON-RL_optimization_2026_09_14.pdf`, coprendo tutte le 81 pagine fisiche, secondo `Docs/OPTIMIZATION_COMPANION_BRIEF.md`.
>
> Le priorità sono qualità delle spiegazioni, utilità e leggibilità dei grafici e coerenza visiva con Introduction. Usa come riferimenti concreti le companion Introduction 12, 16, 17, 27 e 34. Riutilizza layout, tipografia, componenti, formule spiegate, controlli e fullscreen esistenti. Mantieni disponibili entrambe le lezioni e separa le loro identità e il loro stato.
>
> Riusa l'ingestion già presente. Analizza individualmente tutte le pagine in ordine con testo, immagine e contesto, poi progetta spiegazioni, esempi e visualizzazioni aderenti al contenuto. Conserva la notazione e distingui fonte, correzioni ed enrichment. PDF e artefatti originali restano immutabili.
>
> Per ogni pagina chiarisci l'idea principale; spiega le formule dove sono usate; scegli il grafico che rende visibile il concetto. Usa interazioni e 3D quando aggiungono comprensione. Esplicita gli effetti dei controlli, le ipotesi e i casi limite. Non comprimere pagine dense riducendo la leggibilità.
>
> Parti da un piccolo gruppo rappresentativo per affinare internamente i componenti comuni, poi continua per blocchi concettuali fino alla copertura completa. Nessun gate manuale o richiesta di conferma fra blocchi. Rivedi nel browser tutte le pagine e correggi i problemi grafici e didattici durante il lavoro.
>
> Evita suite complete ripetute, report ridondanti e test che duplicano la struttura delle pagine. Esegui soltanto controlli tecnici e numerici proporzionati alle modifiche. Valuta la riuscita attraverso le pagine effettive, la correttezza delle spiegazioni e il comportamento dei grafici.
