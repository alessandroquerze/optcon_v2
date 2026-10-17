# Piano di implementazione e criteri di completamento

## Stato corrente — sequenza Introduction

La numerazione delle consegne Introduction successiva alla pipeline è distinta
da quella del piano originario riportato più sotto.

| Fase corrente | Scopo | Stato e criterio verificato |
| --- | --- | --- |
| PAGE ANALYSIS | Analisi multimodale e PAGE_SPEC per pagina | Completata: 36/36 sull'introduzione |
| F03 | Source warning policy | Completata: tutte le issue risolte; fonti immutabili |
| F04 | Companion design | Completata: manifest delle 36 pagine |
| F04.1 | Audit visualizzazioni 2D/3D | Completata: requisito FULL_2D_AND_3D_SUPPORT vincolante |
| F05 | Application shell, graphics foundation e component library | **COMPLETATA**: 78/78 test, TypeScript e build PASS, 969 file protetti invariati |
| F06 | Vertical slice [2, 8, 12, 16, 17, 27, 30, 34] | **COMPLETATA**: 8/8, 116/116 test, build e revisione visiva PASS |
| F06.1 | Global formula explanation policy sulle otto companion esistenti | **COMPLETATA**: 38/38 formule spiegate, 140/140 test, TypeScript/build e revisione visiva PASS |
| F07 | Fase successiva alla vertical slice | **NON INIZIATA**: le altre 28 companion restano placeholder |

Requisito permanente da F06.1: [GLOBAL_FORMULA_EXPLANATION_POLICY](GLOBAL_FORMULA_EXPLANATION_POLICY.md).
F07 e tutte le fasi successive, inclusi i documenti Optimization e KKT, devono
censire e spiegare ogni formula significativa anche in esempi, grafici e simulazioni.
La chiusura richiede UNEXPLAINED_FORMULAS=0, verifica semantica e matematica,
browser test, screenshot ispezionati, leggibilità e regressioni superate.
Il requisito si applica anche alle future attività del piano storico sotto riportato.

Criteri F06.1 verificati: otto companion aggiornate; formule ed esempi censiti
anche fuori dal pannello di riferimento; spiegazioni specifiche, simboli,
ipotesi e parametri accessibili nel contesto; grafici e simulazioni invariati;
warning F03 conservati; 32 screenshot salvati e ispezionati; geometria 960×1280
valida in entrambe le viste. Nessuna modifica alle fonti o ai report storici.
Evidenze: [F06_1_FORMULA_EXPLANATIONS](F06_1_FORMULA_EXPLANATIONS.md).
F07 rimane **NON INIZIATA** e le altre 28 pagine restano placeholder.

Criteri di chiusura F05:

- PDF.js mostra i byte originali e sincronizza le 36 pagine con il placeholder.
- Stato currentSourcePage unico, bounds, navigazione, jump, resize e scroll indipendenti verificati.
- KaTeX, warning locali F03 e contenitore slide configurato dal manifest disponibili.
- Grafica nativa 2D e 3D, camera, aggiornamenti da slider, toggle e viste collegate verificati nel browser.
- Fondamenta dei 9 componenti grafici canonici e 12 ulteriori componenti pubblici disponibili.
- Matematica e simulazioni generiche separate dai renderer; nessun modello di una companion implementato.
- 38 test frontend, 6 browser e 34 pipeline superati; controllo TypeScript e build di produzione superati.
- Nessun PDF, PAGE_SPEC, testo, immagine, F03 o manifest F04/F04.1 modificato.

Evidenze e avvio: [F05_APPLICATION_SHELL](F05_APPLICATION_SHELL.md).

Criteri di chiusura F06:

- Solo le otto pagine autorizzate sono registrate; ciascuna conserva una companion 960×1280.
- Le sette modalità miste 2D/3D e la pagina concettuale 2D rispettano F04.1.
- Formule corrette F03, esempi aggiunti e funzioni pure alimentano tutte le letture e i grafici.
- P12, p16, p17, p27, p30 e p34 superano gli oracoli numerici e i casi limite; p8 gestisce a=0.
- 62 test frontend, 20 test browser e 34 test pipeline superati; TypeScript e build PASS.
- Verificate tutte le otto pagine anche sulla build statica; 23 screenshot salvati e ispezionati.
- Camera e nodo grafico conservati durante gli aggiornamenti; superfici invarianti non ricampionate.
- Persistenza dei parametri, reset dello scroll al cambio pagina e cleanup delle scene verificati.
- 969 file protetti invariati; nessuna modifica a PDF, PAGE_SPEC, F03, F04/F04.1 o manifest.

Evidenze F06: [F06_VERTICAL_SLICE](F06_VERTICAL_SLICE.md). Nessuna issue bloccante
irrisolta; pronta per revisione umana. F07 non è stata avviata.

## Piano originario della pipeline — numerazione storica

La consegna originaria comprendeva **F00–F04**. La tabella e le sezioni seguenti
conservano la numerazione iniziale della pipeline; i loro F05/F06 non indicano
le consegne correnti Application Shell e Vertical Slice. Per lo stato attuale
fa fede la tabella Introduction precedente.

| Fase | Scopo | Stato |
| --- | --- | --- |
| F00 | Vincoli, inventario e architettura | Implementata |
| F01 | Ambiente riproducibile e contratti JSON | Implementata |
| F02 | Estrazione e rendering di ogni pagina | Implementata |
| F03 | Identità, contesto e rilevamento di somiglianze | Implementata |
| F04 | Pacchetti AI, import controllato e audit | Implementata |
| F05 | Analisi multimodale effettiva di ogni pagina | Completata sull'introduzione: 36/36; restano 101 pagine degli altri PDF |
| F06 | Revisione semantica e mapping definitivo | Pianificata |
| F07 | Lettore PDF.js e struttura React sincronizzata | Pianificata |
| F08 | Generazione delle companion didattiche | Pianificata |
| F09 | Grafici, simulazioni e interazioni validate | Pianificata |
| F10 | Verifica integrata e distribuzione | Pianificata |

## F00 — Vincoli, inventario e architettura

Produrre architettura, schema e piano; censire tutti i PDF senza modificarli.
Stabilire che la chiave sia la pagina fisica, con default 1:1 e possibilità
motivata di sub-page. Separare estrazione automatica, analisi e revisione.

Criteri di completamento:

- I tre documenti richiesti sono presenti in `Docs/` e descrivono il confine della consegna.
- L'inventario registra i tre PDF e 137 pagine fisiche, con hash completo dei file.
- Il piano non contiene criteri che permettano di sostituire l'analisi delle pagine
  con una sintesi globale del documento.

## F01 — Ambiente e contratti

Implementare CLI Python e schemi Draft 2020-12 per catalogo, manifest, PAGE_SPEC
e risultato dell'analisi; fissare le dipendenze. Non serve ancora il frontend.

Criteri di completamento:

- Installazione delle dipendenze da `requirements.lock.txt` in una venv locale.
- `python -m pipeline --help` mostra i quattro comandi documentati.
- Schemi controllati dal validatore locale, senza riferimenti remoti da scaricare.
- Proprietà inattese e stati incoerenti vengono rifiutati.

## F02 — Estrazione e rendering per pagina

Per ogni pagina conservare testo originale, ordine di lettura alternativo,
layout e PNG dell'originale. Manifest e catalogo vengono pubblicati soltanto
quando il documento è completo. Rendere gli errori espliciti e la riesecuzione sicura.

Criteri di completamento:

- `ingest` produce 137 directory di pagina, ciascuna con i cinque artefatti previsti.
- Le 137 immagini sono decodificabili e corrispondono a dimensioni e hash registrati.
- Ogni PAGE_SPEC ha hash del PDF, indici fisici, geometria e hash degli artefatti.
- Sono gestiti con test pagine vuote/senza testo, rotazioni e alterazione di un artefatto.
- Una riesecuzione identica riutilizza gli artefatti e conserva l'analisi importata.
- Una configurazione diversa non sovrascrive un output esistente.

## F03 — Identificazione e somiglianze

Separare titolo candidato, pagina fisica, label PDF e numero stampato. Collegare
ogni pagina alle vicine. Registrare duplicate/progressive con evidenze,
conservando tutte le pagine e rendendo esplicite le ipotesi da confermare.

Criteri di completamento:

- Ogni pagina ha le vicine corrette; prima e ultima usano null sul lato mancante.
- Label grezze e decodificate sono conservate; i footer non diventano ID.
- Ogni relazione è simmetrica e contiene metriche, motivazione e delta.
- Un duplicato sintetico esatto viene riconosciuto come tale; un overlay con
  modifica solo grafica viene segnalato anche a testo identico.
- Una pagina sintetica di argomento diverso non viene accorpata per il solo layout.
- Nel corpus si registrano 10 coppie progressive candidate e una quasi duplicata;
  non si considera questo conteggio una valutazione della precisione dell'algoritmo.

## F04 — Pacchetti per l'analisi AI e audit

Predisporre un task multimodale per ciascuna pagina, senza eseguirlo. Implementare
un punto di import che consenta in futuro di registrare risposte rigorose e
tracciabili; verificare il corpus con una CLI ripetibile.

Criteri di completamento:

- `queue.jsonl` ha esattamente 137 righe e 137 page_id distinti.
- Ogni richiesta contiene target, tutte le vicine disponibili e le pagine
  correlate, con testo/layout completi e riferimenti alle immagini reali.
- Protocollo, schema e hash della richiesta sono inclusi nel pacchetto.
- Nessuna richiesta viene scartata perché duplicata o parte di una progressiva.
- L'import rifiuta hash obsoleti, citazioni inesistenti, bbox fuori pagina,
  ispezioni mancanti, contesto incompleto, riferimenti a osservazioni assenti e
  sub-page con suffissi non consecutivi.
- `verify` ha exit code 0 e riporta 137 pagine validate, tutte `pending` nella
  consegna iniziale; la generazione di companion rimane disabilitata.
- La suite di test sintetici passa senza scrivere contenuti del corso.

**Punto di arresto della consegna attuale.** I gate seguenti richiedono lavoro
successivo; nessun placeholder viene presentato come companion completata.

Verifica eseguita sulla consegna: `python -m pipeline verify --output Data`
termina con codice 0, 137 pagine e 137 richieste validate, zero errori e 137
analisi `pending`. `python -m unittest discover -s tests -v` supera 13 test.
Il report persistito è `Data/reports/validation.json`.

## F05 — Analisi AI multimodale effettiva

Aggiornamento su richiesta dell'utente: eseguita nella sessione Codex su tutte
le 36 pagine dell'introduzione, in ordine, leggendo testo e PNG e considerando
le vicine. Disponibili 36 PAGE_SPEC separati, 35 proposte di esempio, 25 proposte
interattive motivate e 30 verifiche numeriche degli enrichment, tutte superate.
Nessuna pagina implementata. L'audit completo è in
[INTRODUCTION_PAGE_ANALYSIS_AUDIT.md](INTRODUCTION_PAGE_ANALYSIS_AUDIT.md).

Stato: 25 analisi senza avvisi e 11 con note di revisione della fonte. Le pagine
16, 30 e 34 hanno questioni bloccanti per il successivo riuso delle parti
interessate. Tutte le pagine sono comunque analizzate e coperte. Il lavoro sugli
altri PDF e l'adapter API descritto sotto restano futuri.

Realizzare un adapter verso il provider scelto, con input visivi reali,
risposte strutturate, retry e log. Eseguire separatamente ogni task e importare
i risultati. Pianificare costi e limiti solo dopo aver scelto il modello.

Criteri di completamento:

- 137 risultati individuali validati, uno per pagina fisica, con metadati reali
  del modello, hash, osservazioni e copertura delle regioni.
- Ogni esecuzione ha ricevuto effettivamente le immagini, non soltanto i percorsi.
- Nessun risultato importa concetti della pagina successiva come se fossero già
  presenti nella target; ogni vicina contribuisce con una nota esplicita.
- Tutte le coppie candidate sono confermate o respinte motivatamente; eventuali
  ulteriori progressive non rilevate automaticamente vengono registrate in revisione.
- Nessuna pagina rimane `pending`; quelle dubbie sono esplicitamente `needs_review`.
- Nessuna companion generata in questa fase.

## F06 — Revisione semantica e mapping definitivo

Implementare registro versionato delle revisioni e gate editoriale. Verificare
fedeltà di formule, assunzioni e grafici; correggere le analisi conservando la
provenienza. Decidere il mapping senza comprimere i concetti complessi.

Criteri di completamento:

- Ogni pagina ha una revisione approvata e tutte le incertezze bloccanti sono risolte.
- La copertura dichiarata viene confrontata con la pagina renderizzata.
- Ogni pagina ha almeno una companion prevista; le sub-page hanno suffissi,
  ambito, ordine e motivazione didattica verificabile.
- Progressive e duplicate mantengono riferimenti alla propria pagina sorgente.
- Un controllo automatico impedisce la generazione per pagine prive di revisione.

## F07 — Lettore e struttura sincronizzata

Creare l'app React con pannello sinistro PDF.js sul PDF originale e pannello
destro HTML/React a layout slide fisso. Integrare il mapping approvato.

Criteri di completamento:

- Tutte le pagine originali si navigano avanti/indietro e tramite selezione diretta.
- Testi, formule, immagini, rotazioni e annotazioni vengono controllati visivamente
  su campioni rappresentativi e confrontati con il rendering di ingestion.
- Ogni cambio pagina aggiorna la companion corretta; cambiare sub-page mantiene
  la pagina PDF; ricarica e link diretto ripristinano la selezione.
- Le identità funzionano anche con numeri stampati ripetuti o diversi dall'indice fisico.
- Il contenitore companion è HTML/React, con dimensioni e scala esplicite.

## F08 — Companion didattiche

Definire un contratto separato per il contenuto companion e generarlo dalle sole
analisi approvate. Produrre spiegazioni chiare mantenendo le ipotesi originali,
con esempi numerici verificati e visualizzazioni pertinenti.

Criteri di completamento:

- Ogni unità del mapping approvato ha contenuto revisionato e tracciabile alle fonti.
- Tutte le formule e gli esempi numerici sono controllati con calcoli indipendenti.
- Il layout fisso non taglia contenuti e non riduce eccessivamente la leggibilità;
  un eccesso concettuale porta a una proposta motivata di sub-page.
- Non si usa un PDF generato come pannello companion.

## F09 — Interazioni, grafici e simulazioni

Introdurre controlli soltanto dove aiutano il concetto: algoritmi iterativi,
dinamiche, vincoli e politiche. Esplicitare parametri, unità, reset e stato.

Criteri di completamento:

- Ogni simulazione corrisponde al concetto della pagina e ha un caso di riferimento
  con risultato numerico verificato.
- Controlli e grafici rimangono coerenti agli estremi dell'intervallo dei parametri.
- Algoritmi divergenti, dati non validi e condizioni di fattibilità vengono
  rappresentati correttamente senza produrre conclusioni didattiche fuorvianti.
- Navigazione e ridimensionamento non producono aggiornamenti su pagine inattive.

## F10 — Verifica integrata e distribuzione

Controllare copertura, accessibilità, performance e pacchetto di esecuzione.
La scelta dell'hosting è successiva e non è parte della pipeline iniziale.

Criteri di completamento:

- Audit completo: nessuna pagina o companion mancante, link di fonte risolvibili,
  nessuna analisi obsoleta o revisione bloccante.
- Navigazione tramite tastiera, descrizioni dei grafici e contrasto verificati.
- Caricamento progressivo dei PDF/companion con limiti di memoria misurati.
- Procedura di avvio e build riproducibile su un ambiente pulito; distribuzione
  della sola versione approvata con gli originali accessibili secondo il progetto.
