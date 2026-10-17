# Contratto PAGE_SPEC v1.0.0

## F03 — Policy delle issue della fonte

Le 11 pagine dell'introduzione precedentemente marcate needs_review hanno
ora una proprietà additiva **source_warning**, validata da
[source-warning.schema.json](../schemas/source-warning.schema.json).
La proprietà non modifica analysis, observations, source_math, testo o immagini.
Le singole decisioni sono nell'array issues: una voce per ogni uncertainty
originale, identificata da source_issue_index e da riferimenti JSON Pointer.
Il tipo al livello di pagina è la massima severità delle sue issue.

Ogni decisione distingue source_expression, corrected_expression (solo per
correzioni), companion_uses, short_warning, correction_reason e le due regole
di uso nei calcoli. short_warning ha al massimo 20 parole; la motivazione
completa resta esclusivamente nei metadata tecnici. La policy UI specifica
rosso, collocazione locale e condizione di visibilità. NO_WARNING non produce
testo UI.

**Precedenza per la progettazione:** source_math è una trascrizione immutabile
e non è l'input automatico di un calcolo. Per una CORRECTION_WARNING, esempi,
grafici e simulazioni devono usare corrected_expression e calculation_policy.
La funzione effective_companion_plan restituisce una copia delle proposte con
i companion_overrides applicati; non riscrive il PAGE_SPEC. Sono così escluse
le vecchie proposte di mostrare risultati numerici ottenuti dai refusi delle
pagine 16 e 34, che rimangono soltanto nella storia dell'analisi.

La baseline in Data/reviews/introduction_source_warning_baseline.json conserva
gli hash delle sorgenti e dei campi PAGE_SPEC precedenti. Il report corrente
espone la risoluzione delle issue in source_warning_review e il nuovo gate
READY_FOR_COMPANION_DESIGN. I vecchi status e blocking restano storici;
ready_for_companion_implementation resta separato.

Decisioni e tabella:
[INTRODUCTION_SOURCE_WARNING_REVIEW.md](INTRODUCTION_SOURCE_WARNING_REVIEW.md).

Comando di verifica, senza rigenerare sorgenti o analisi:

    .\.venv\Scripts\python.exe -m pipeline.source_warning_policy audit --output Data

## Estensione per la PAGE ANALYSIS dell'introduzione

Sono state analizzate tutte le 36 pagine fisiche di Introduction to Optimal
Control. Ogni PAGE_SPEC conserva sorgenti, evidenze e risultato individuale;
il conteggio proposto è esposto anche come **companionPageCount** alla radice.
La decisione del mapping diventa **proposed_after_analysis**, distinguendo una
proposta dall'iniziale pending_analysis: nessuna companion viene creata.

Il risultato aggiunge companionPageCount e **didactic_plan**, definito in
[didactic-plan.schema.json](../schemas/didactic-plan.schema.json). Il progetto contiene:

- source_scope_limits: ciò che non è lecito attribuire alla pagina.
- prerequisites: concetti necessari, origine e pagine precedenti di riferimento.
- source_math: trascrizioni LaTeX verificate visivamente, ancoraggi testuali e
  irregolarità della fonte; il testo originale resta negli artefatti.
- enrichments: aggiunte etichettate, separate dalle observations della fonte.
- examples: origine, dati, passaggi, esito e limiti; se assenti, motivazione.
- visualization: componente appropriato e distinzione fra fonte e aggiunta.
- interactivity: raccomandazione, componente, parametri, intervalli, default,
  effetti delle modifiche, output, invarianti e casi limite.
- edge_cases: casi limite con origine dichiarata.
- expansion_rationale e blueprint: motivazione del conteggio e ambito della
  futura companion, senza implementazione.

L'estensione è additiva: le 101 pagine degli altri PDF restano pending. Il
protocollo consente ora proposte di esempi solo nel progetto etichettato
enrichment, secondo la richiesta dell'utente. Le precedenti versioni dei
PAGE_SPEC sono archiviate sotto Data/analysis/history; le registrazioni della
prima ispezione conservano l'ordine fisico 1–36.

Il mapping successivo all'analisi è una proposta, distinta dall'approvazione
editoriale e dall'implementazione. I paragrafi sullo stato iniziale riportati
sotto descrivono il contratto di ingestion. Il registro attuale è
[INTRODUCTION_PAGE_ANALYSIS_AUDIT.md](INTRODUCTION_PAGE_ANALYSIS_AUDIT.md).

Lo schema eseguibile è [page-spec.schema.json](../schemas/page-spec.schema.json),
in JSON Schema Draft 2020-12. Il risultato dell'analisi è definito separatamente in
[analysis-result.schema.json](../schemas/analysis-result.schema.json) e richiamato
dal PAGE_SPEC tramite l'URI locale `urn:optconv:analysis-result:1.0.0`.
Il validatore Python registra tutti gli schemi locali e non risolve riferimenti
via rete. La semantica di oggetti e proprietà chiuse segue la
[documentazione ufficiale JSON Schema](https://json-schema.org/understanding-json-schema/reference/object).

## Unità e identificazione

Un PAGE_SPEC descrive esattamente una pagina fisica del PDF originale, anche
quando il suo contenuto è duplicato o progressivo. È persistito in
`Data/documents/<document_id>/pages/NNNN/page_spec.json`.

- `document_id`: nome del file senza estensione più prefisso dell'hash della revisione.
- `page_id`: `<document_id>:pNNNN`, con indice fisico a base uno e padding minimo di quattro cifre.
- `source.page_index`: indice a base zero, adatto all'indicizzazione interna.
- `source.physical_page_number`: indice a base uno, adatto a `PDF.js.getPage`.
- `source.pdf_label_raw`, `source.pdf_label`: label originale e decodificata; possono
  essere nulle, ripetersi o differire dal numero fisico.
- `identity.printed_number_candidates`: numeri stampati del tipo `37 | 73` o
  `37/73`, con rettangolo di provenienza. Non sono chiavi primarie.

## Campi principali

| Campo | Tipo | Significato e vincoli |
| --- | --- | --- |
| `schema_version` | string | Valore fisso `1.0.0` |
| `page_id`, `document_id` | string | Identità stabile della revisione estratta |
| `source` | object | Hash completo PDF, indici, label, geometria |
| `identity` | object | Titolo candidato, metodo, confidence, bbox, numero stampato, avvisi |
| `artifacts` | object | Percorsi e SHA-256 di testo, ordine alternativo, layout e PNG |
| `context` | object | `previous_page_id` e `next_page_id`; null ai confini |
| `relations` | array | Candidati duplicati/progressivi con metriche e delta |
| `companion_mapping` | object | Default 1:1, decisione ancora pendente, nessuna companion creata |
| `analysis` | object | Stato e risultato della singola pagina; null finché non importato |

Tutti gli oggetti del contratto delle pagine e delle risposte sono chiusi:
campi estranei, come `companion_html`, vengono rifiutati. Le proprietà principali
sono obbligatorie: un dato sconosciuto si rappresenta con null dove consentito,
non eliminando la proprietà. Le confidence sono fra zero e uno, gli hash SHA-256
sono 64 caratteri esadecimali minuscoli.

## Artefatti e coordinate

`artifacts.text`, `reading_order_text`, `layout` hanno `path` e `sha256`.
`artifacts.render` aggiunge `width_px`, `height_px`, `dpi`, `renderer` e
`pixel_sha256`. L'hash del file PNG e l'hash dei pixel RGB decodificati sono
distinti. Tutti i percorsi sono relativi alla radice di output e vengono
controllati per impedire riferimenti esterni.

I bbox hanno forma `[x0, y0, x1, y1]`. Le evidenze dell'analisi usano **punti PDF
nel sistema non ruotato del layout**, origine in alto a sinistra, come
`layout.json`; non pixel. `layout.rotation_matrix` descrive la trasformazione
verso la pagina renderizzata ruotata. Il delta visivo delle relazioni usa invece
`changed_bbox_px`, esplicitamente in pixel del PNG completo. `cropbox` e
`mediabox` conservano i box originali forniti dal motore.

## Identificazione automatica

Il titolo è un candidato ricavato dalle prime righe nella zona superiore,
unendo eventuali continuazioni con font e geometria compatibili. Si salvano
metodo e rettangolo; non è una lettura semantica del titolo. Per esempio una
copertina può avere come candidato il nome del corso anziché il sottotitolo:
la futura analisi registra il titolo interpretato in `analysis.result.title`
senza cancellare la provenienza automatica.

Gli avvisi attuali sono `no_text_layer_requires_visual_review_or_ocr`,
`sparse_text_requires_visual_review`, `unicode_replacement_character`,
`rotated_page_use_rotation_matrix_for_evidence` e `title_unavailable`.

## Relazioni

Ogni relazione contiene `page_id`, `kind`, `confidence`, `review_status`,
`reason`, `metrics` e `delta_in_physical_order`. È registrata simmetricamente
su entrambe le pagine. Il delta mantiene sempre l'orientamento fisico crescente.

| `kind` | `review_status` iniziale | Interpretazione |
| --- | --- | --- |
| `exact_duplicate` | `verified_exact` | Identici raster completo e testo alla configurazione archiviata |
| `near_duplicate` | `candidate` | Somiglianza elevata, da valutare individualmente |
| `progressive_candidate` | `candidate` | Possibile overlay, aggiunta/rimozione o modifica grafica |

`metrics` include Jaccard, contenimento dei token, conteggi dei token per la
coppia in ordine fisico, differenza visiva media, ink overlap e distanza dHash.
Il delta del testo conserva righe aggiunte/rimosse senza inventarne il significato.
Le relazioni non modificano il numero delle pagine né quello delle richieste AI.

## Stato e mapping

Il PAGE_SPEC generato contiene:

```json
{
  "companion_mapping": {
    "default_count": 1,
    "decision": "pending_analysis",
    "subpages": [],
    "split_rationale": null
  },
  "analysis": {
    "status": "pending",
    "result": null
  }
}
```

Questo frammento descrive soltanto stato e mapping, non è un PAGE_SPEC completo.
Un esempio completo senza contenuto AI è qualsiasi `page_spec.json` sotto `Data`.

Le transizioni implementate sono `pending → analyzed` e `pending → needs_review`
tramite `import-analysis`. Reimportare lo stesso risultato è idempotente;
un risultato diverso già presente viene rifiutato. Le revisioni editoriali
future avranno un contratto dedicato. Nessuno stato abilita in questa versione
la generazione di companion.

## Risposta di analisi rigorosa

| Campo della risposta | Funzione |
| --- | --- |
| `protocol_version`, `request_sha256` | Legame al pacchetto e al protocollo effettivamente analizzati |
| `page_id`, `pdf_sha256`, `artifact_sha256` | Provenienza della target e dei suoi artefatti |
| `agent` | Provider, modello e ID reale dell'esecuzione futura |
| `inspection` | Pagine dichiarate ispezionate come testo, layout e immagini |
| `title` | Titolo interpretato, distinto dal candidato automatico |
| `observations` | Concetti, formule, diagrammi, assunzioni e struttura con evidenze |
| `contextual_role`, `context_notes` | Ruolo nella sequenza e contributo di ogni vicina immediata |
| `notation` | Simboli e significati documentati; significato null quando incerto |
| `uncertainties` | Dubbi con indicazione dell'eventuale carattere bloccante |
| `progression` | Valutazione motivata di tutte le relazioni candidate e delle differenze |
| `coverage` | Regioni visibili e osservazioni collegate |
| `mapping_recommendation` | Default 1:1 o proposta motivata di almeno due sub-page |

Ogni observation ha ID univoco, categoria, descrizione, confidence ed evidence.
Le categorie includono `concept`, `definition`, `equation`, `diagram`,
`assumption`, `algorithm`, `structure`, `other`. Le formule devono essere
trascritte fedelmente nella descrizione dell'osservazione; questo schema non
introduce ancora un AST matematico né prova automaticamente le equazioni.

Per evidenza testuale, `text_quote` deve essere una sottostringa esatta del testo
originale della target. Per evidenza visiva serve un bbox valido nella target.
La modalità `both` richiede entrambi. Almeno un'osservazione deve avere evidenza
visiva. Le osservazioni delle pagine vicine vanno nelle note di contesto; non
possono essere usate per attribuire contenuto assente alla target.

L'insieme di ogni lista `inspection.*_page_ids` deve essere uguale a
`required_page_ids` del pacchetto: target, vicine e correlate. Ogni vicina
immediata deve avere una nota con ruolo `previous` o `next`. Tutte le relazioni
candidate vanno valutate, anche per respingerle. La copertura deve referenziare
ID esistenti e includere ogni osservazione; la sua completezza visiva effettiva
resta da revisionare.

Per `one_to_one`, `subpages` deve essere vuoto. Per `subpages`, si richiedono
almeno due elementi con suffissi consecutivi `a`, `b`, ecc., ambiti distinti e
motivazione. L'import registra solo la raccomandazione, imposta `needs_review`
e mantiene invariato il mapping sorgente. Non esiste generazione didattica.

## Validazione

La validazione combina gli schemi con controlli fra file: indici e identità,
hash effettivi degli artefatti, contesto atteso, citazioni, bbox, relazioni
simmetriche, riferimenti alle osservazioni e hash del pacchetto. Non basta che
un JSON abbia le chiavi corrette. Il protocollo completo da fornire al modello è
[analyze_page.md](../prompts/analyze_page.md).
