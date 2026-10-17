# Optimal Control & Reinforcement Learning

F06 completata: le companion delle pagine **2, 8, 12, 16, 17, 27, 30, 34**
sono operative, con formule, esempi, controlli e viste 2D/3D secondo F04.1.
Le altre 28 restano placeholder; F07 **non è iniziata**. Verificati 116/116 test,
TypeScript, production build e integrità di 969 file protetti.

Da PowerShell:

    cd frontend
    npm ci
    npm run dev

Studio: http://127.0.0.1:5173/#/study?page=1

Playground tecnico: http://127.0.0.1:5173/#/dev

Report e architettura: [F05_APPLICATION_SHELL](Docs/F05_APPLICATION_SHELL.md).
Vertical slice, screenshot e verifiche: [F06_VERTICAL_SLICE](Docs/F06_VERTICAL_SLICE.md).
Comandi frontend e punti di estensione: [frontend/README](frontend/README.md).

## Pipeline e analisi delle fonti

F03 SOURCE WARNING POLICY completata per l'introduzione: correzioni alle pagine
16, 30 e 34, note informative a 14, 17, 19, 22 e 26, nessun warning necessario
a 31, 33 e 36. Le 13 issue hanno una decisione tracciabile; il PDF e tutta
l'analisi precedente rimangono intatti. Il gate di progettazione è YES.
La policy e i testi brevi sono in
[INTRODUCTION_SOURCE_WARNING_REVIEW](Docs/INTRODUCTION_SOURCE_WARNING_REVIEW.md).

Ingestion locale, pagina per pagina, dei PDF del corso. La CLI estrae le sorgenti
e prepara pacchetti multimodali: **non chiama servizi AI e non crea companion slide**.
Il frontend F05 è separato dalla CLI e consuma gli artefatti esistenti.

La PAGE ANALYSIS dell'introduzione è stata svolta nella sessione Codex: **36/36
pagine**, con testo, immagini, contesto e enrichment separati. Ogni pagina ha
companionPageCount=1 come proposta. Sono presenti 25 analisi senza avvisi e 11
con note di revisione della fonte; le altre 101 pagine del corpus restano pending.
Il registro con un link a ciascun PAGE_SPEC è
[INTRODUCTION_PAGE_ANALYSIS_AUDIT](Docs/INTRODUCTION_PAGE_ANALYSIS_AUDIT.md).

Per ripetere l'audit specifico delle 36 analisi e dei loro esempi:

    .\.venv\Scripts\python.exe -m pipeline.audit_page_analysis --output Data --document introduction_optimal_control

La documentazione richiesta è in [PROJECT_ARCHITECTURE](Docs/PROJECT_ARCHITECTURE.md),
[PAGE_SPEC_SCHEMA](Docs/PAGE_SPEC_SCHEMA.md) e [IMPLEMENTATION_PLAN](Docs/IMPLEMENTATION_PLAN.md).

## Pipeline Python — avvio su Windows / PowerShell

Python 3.10 o successivo; non è richiesta l'attivazione dello script PowerShell della venv.

```powershell
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.lock.txt
.\.venv\Scripts\python.exe -m pipeline ingest --source . --output Data --dpi 144
```

`requirements.txt` contiene le dipendenze dirette; `requirements.lock.txt` fissa anche
quelle transitive dell'ambiente verificato. Per la sola CLI non servono Node, credenziali o servizi AI.
Per altri sistemi usare il Python della propria venv con gli stessi argomenti.

L'ingestion cerca ricorsivamente i PDF, escludendo output e cartelle tecniche, e
produce anche una richiesta di analisi per ogni pagina. I PDF originali rimangono
nella loro posizione; `Data/catalog.json` registra la radice sorgente locale.

## Comandi disponibili

```powershell
# Integrità di PDF, manifest, tutte le pagine, hash, PNG e stato di analisi.
.\.venv\Scripts\python.exe -m pipeline verify --output Data

# Rigenera i pacchetti dopo modifiche al protocollo/schema. Non esegue analisi AI.
.\.venv\Scripts\python.exe -m pipeline export-analysis --output Data

# Solo in una fase successiva: importa una risposta strutturata della singola pagina.
.\.venv\Scripts\python.exe -m pipeline import-analysis --output Data --result percorso\risposta.json

# Test end-to-end su PDF sintetici temporanei; non modifica Data o i PDF del corso.
.\.venv\Scripts\python.exe -m unittest discover -s tests -v
```

I comandi restituiscono codice `0` solo se la verifica passa. L'ingestion è
riavviabile: con sorgente e configurazione identiche riutilizza gli artefatti e
preserva eventuali analisi già importate. Per cambiare DPI/versioni della pipeline
usare un nuovo output, ad esempio `--output Data_192 --dpi 192`; la pipeline rifiuta
di sovrascrivere una revisione già estratta con una configurazione diversa.

## Output da aprire

- `Data/catalog.json`: inventario dei documenti e conteggio delle pagine fisiche.
- `Data/documents/<document_id>/manifest.json`: pagine, titoli, etichette e gruppi candidati.
- `Data/documents/<document_id>/pages/0001/`: testo originale, testo in ordine di
  lettura, layout con coordinate, `render.png`, `page_spec.json`.
- `Data/analysis/queue.jsonl`: una richiesta per ogni pagina fisica, incluse le duplicate.
- `Data/analysis/requests/<document_id>/0001.json`: testo e layout della pagina e
  delle vicine, allegati immagine da fornire realmente al modello, protocollo e schema.
- `Data/reports/validation.json`: esito dell'audit completo.

Nel corpus: **3 PDF, 137 pagine e 137 richieste**. Le 36 pagine dell'introduzione
hanno il proprio PAGE_SPEC analizzato; le altre 101 restano `pending`.
`verify` positivo certifica l'integrità della pipeline, non l'avvenuta analisi semantica.
Le immagini archiviate sono prodotte con PyMuPDF; il lettore dell'app futura userà
PDF.js direttamente sui PDF originali, come descritto nell'architettura.
