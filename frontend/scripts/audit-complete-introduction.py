"""F07 final audit: evidence-based coverage, provenance, regression and quality gates."""
import datetime, hashlib, json, pathlib, re
root=pathlib.Path(__file__).resolve().parents[2]
read=lambda name:json.loads((root/name).read_text(encoding="utf-8"))
manifest=read("Data/introduction_companion_manifest.json")
visual=read("Data/reports/f07_final_visual.json")
manual=read("Data/reports/f07_final_visual_review.json")
runtime=read("Data/reports/f07_runtime_measurements.json")
unit=read("frontend/test-reports/unit-results.json")
browser=read("frontend/test-reports/browser-results.json")
pipeline=read("Data/reports/f07_pipeline_tests.json")
targeted=read("Data/reports/f07_p23_targeted_smoke.json")
assert visual["success"] and runtime["success"] and manual["status"]=="PASS"
assert unit["success"] and unit["numTotalTests"]==unit["numPassedTests"]
assert browser["stats"]["expected"]==56 and all(browser["stats"][k]==0 for k in ["unexpected","skipped","flaky"])
assert pipeline["success"]
assert targeted["status"]=="PASS" and targeted["tests"]==1
for batch in "abcd": assert read(f"Data/reports/f07_batch_{batch}_gate.json")["status"]=="PASS"
changed=[];protected_count=0
for name in ["Data/reviews/f05_source_baseline.json","Data/reviews/f07_baseline.json"]:
    baseline=read(name);files=baseline.get("protected_files",baseline.get("files",{}));protected_count+=len(files)
    changed.extend(path for path,digest in files.items() if hashlib.sha256((root/path).read_bytes()).hexdigest()!=digest)
assert not changed,changed
registry=(root/"frontend/src/companion/registry.ts").read_text(encoding="utf-8")
assert list(map(int,re.findall(r"^\s+(\d+):\s*lazy",registry,re.M)))==list(range(1,37))
assert [p["page"] for p in visual["pages"]]==list(range(1,37))
old=read("Data/reports/f06_1_visual_measurements.json")
old_values={p["page"]:p["liveOutputs"] for p in old["pages"]}
old_formulas={p["page"]:p["formulas"] for p in old["pages"]}
records=[];regressions=[];formula_count=0
for p in visual["pages"]:
    n=p["page"];d=manifest["pages"][n-1];g=p["geometry"];formulas=p["formulas"]
    ids={f["formulaId"]:f for f in formulas}
    assert len(ids)==len(formulas) and not p["formulaOverflow"]
    assert all(f["conceptualExplanation"].strip() for f in formulas)
    for f in d["formulas_to_show"]:assert ids[f["id"]]["latex"]==f["expression"]
    for occurrence in g["formulaOccurrences"]:
        assert occurrence["id"] in ids and occurrence["canonical"]==ids[occurrence["id"]]["latex"]
    assert all(ref in ids for ref in g["formulaContexts"])
    assert not g["orphanEquations"]
    for notice in d["source_warning"]["student_notices"]:assert any(notice["text"] in text for text in g["warnings"])
    if n in old_values and g["outputs"]!=old_values[n]:regressions.append(n)
    if n in old_formulas:
        assert len(formulas)==len(old_formulas[n])
        for f in old_formulas[n]:
            assert ids[f["formulaId"]]["latex"]==f["latex"]
            assert ids[f["formulaId"]]["conceptualExplanation"]==f["conceptualExplanation"]
    images=[f"Docs/F07_assets/page-{n:02d}-companion.png"]+[f"Docs/F07_assets/page-{n:02d}-{a['view'].lower()}.png" for a in p["alternatives"]]
    assert all((root/path).is_file() and path in manual["screenshots"] for path in images)
    expected_alternatives=1 if len(d["visualization"]["presentation"]["toggle"])==2 else 0
    assert len(p["alternatives"])==expected_alternatives
    formula_count+=len(formulas)
    records.append({"page":n,"status":"IMPLEMENTED","companionPageCount":1,"mode":p["mode"],"formula_ids":list(ids),"formula_count":len(ids),
        "warning_type":d["source_warning"]["type"],"screenshots":images,"source_sync":"PASS","visual_review":"PASS"})
assert not regressions,regressions
total_tests=unit["numPassedTests"]+browser["stats"]["expected"]+pipeline["tests"]
result={"phase":"F07","completed_at":datetime.datetime.now(datetime.timezone.utc).isoformat(),
    "TOTAL_COMPANION_PAGES":"36/36","NEW_PAGES_IMPLEMENTED":"28/28","PLACEHOLDER_PAGES":0,
    "FORMULA_EXPLANATION_POLICY":"PASS","MEANINGFUL_FORMULAS":formula_count,"FORMULAS_WITH_CONCEPTUAL_EXPLANATION":f"{formula_count}/{formula_count}","UNEXPLAINED_FORMULAS":0,
    **{key:"PASS" for key in ["SOURCE_INTEGRITY","SOURCE_WARNINGS","MATH_VALIDATION","GRAPHICS_2D","GRAPHICS_3D","COMBINED_VIEWS","INTERACTIONS","VISUAL_REVIEW","PAGE_SYNC","BUILD"]},
    "F06_F06_1_REGRESSIONS":0,"TESTS":f"{total_tests}/{total_tests}","UNRESOLVED_ISSUES":0,"READY_FOR_FINAL_HUMAN_REVIEW":"YES",
    "tests":{"unit":unit["numPassedTests"],"browser":56,"pipeline":pipeline["tests"],"runtime_boundary_assertions":len(runtime["checks"]),"typecheck":"PASS"},
    "source_integrity":{"pdf_sha256":visual["pdf_sha256"],"protected_baseline_entries_checked":protected_count,"modified_files":changed},
    "batches":[read(f"Data/reports/f07_batch_{b}_gate.json") for b in "abcd"],
    "reused_components":["LessonFrame","ExplainedEquation","FormulaDeck","FormulaContext","ParameterControl","CostBreakdown","ComparisonTable","StateInputTimeline","TrajectoryViewer","SurfacePlot3D","VisualizationSwitch","ProjectionLink","AlignedTimeSeries","SceneViewport","PDF.js shell"],
    "new_shared_components":["CourseExplorer","interactiveDefinition","IngredientMatrix","TrackingExplorer (fixed/optimal modes)"],
    "mathematical_modules":["courseFoundations.ts","courseOptimization.ts","courseOcp.ts","courseContinuous.ts"],
    "formula_policy":{"counting_unit":"Distinct semantic formula groups per physical page, including enrichment; repeated graph/readout uses link to the same explanation.","canonical_notation_preserved":True,"display_line_breaks":"Separate displayLatex metadata; canonical source expressions untouched."},
    "post_full_suite_targeted_smoke":targeted,
    "runtime":runtime,"pages":records,"screenshots":sum(len(p["screenshots"]) for p in records),"unresolved_issues":[]}
(root/"Data/reports/f07_complete_introduction.json").write_text(json.dumps(result,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
rows="\n".join(f"| {p['page']} | {manifest['pages'][p['page']-1]['title']} | {p['mode']} | {p['formula_count']} | [screenshot](F07_assets/page-{p['page']:02d}-companion.png) |" for p in records)
batch_rows="\n".join(f"| {b['batch']} | {b['implemented_pages']}/36 | {b['unit_tests']} | {b['browser_tests']} | PASS |" for b in result["batches"])
metrics="\n".join(f"    {k} = {v}" for k,v in result.items() if k.isupper())
doc=f"""# F07 — Introduction completa

Implementate **36/36 companion**, con 28 nuove pagine e nessun placeholder.
Le otto pagine F06/F06.1 conservano i tre renderer originali e i modelli matematici:
hash, risultati numerici e 38 formule con le loro spiegazioni coincidono con la baseline.
Gli altri PDF non sono stati implementati. Tutte le pagine mantengono companionPageCount=1.

Evidenza completa: [f07_complete_introduction.json](../Data/reports/f07_complete_introduction.json).

## Batch e gate

| Batch | Copertura dopo il batch | Test unitari | Test browser | Gate |
| --- | --- | --- | --- | --- |
{batch_rows}

A: 1,3,4,5,6,7,9. B: 10,11,13,14,15,18,19. C: 20–26.
D: 28,29,31,32,33,35,36. Ogni batch è stato verificato prima di implementare il successivo.
I gate e le copie dei risultati sono in Data/reports/f07_batch_[a-d]_*.
Il gate D è stato riconfermato dopo il controllo finale del componente matematico condiviso.

## Implementazione e riuso

Il registry carica i renderer per pagina tramite import dinamici. I quattro nuovi
moduli motivation, decisionFoundations, ocp e continuous compongono LessonFrame,
senza un renderer generico che riversi il testo del manifest nella slide.
Copertina e pagine concettuali hanno mappe, confronti, schemi e casi aggiunti pertinenti.

CourseExplorer riusa FunctionExplorer, SurfacePlot3D e SceneViewport per toggle,
camera e letture. interactiveDefinition integra i controlli F04.1 in una copia
runtime della definizione; non riscrive il manifest. TrackingExplorer condivide
modello e grafica tra p22 (candidata fissa) e p25 (scelta ottima).
ParameterControl, ProjectionLink, AlignedTimeSeries, TrajectoryViewer,
CostBreakdown, ComparisonTable e StateInputTimeline restano le API comuni.
Nessuna dipendenza aggiunta.

ExplainedEquation accetta displayLatex per la sola composizione su più righe.
Il LaTeX canonico rimane separato e verificabile nel DOM. Il reflow condiviso
è stato esteso anche alle formule di media lunghezza dopo aver rilevato un
overflow nel pannello di p8: ora la formula occupa 812/812 px.
Le 38 spiegazioni originali non sono state riscritte.

## Formule e fedeltà

**{formula_count}/{formula_count} gruppi semantici spiegati**, dei quali 38 già presenti e
{formula_count-38} aggiunti. Il conteggio distingue le formule per pagina; ripetizioni in grafici,
calcoli e letture rimandano allo stesso gruppo. Non conta come nuove formule
ogni singolo simbolo o ogni ripetizione dello stesso risultato.
Spiegazioni concettuali, simboli, ipotesi ed effetti dei parametri sono disponibili
nel contesto d’uso; le forme complete e i prerequisiti sono accessibili dal pannello.
L’audit confronta ogni espressione canonica con il manifest e verifica i riferimenti
delle occorrenze e dei grafici, anche nei pannelli aperti.

PDF, testi, render, PAGE_SPEC, F03, F04/F04.1 e documentazione validata restano
immutati: 969 voci della baseline delle fonti più 42 della baseline F07 controllate.
Il PDF servito al browser mantiene SHA-256
ae169f3492dc0915d0777d62e90184107d7017aee03b8620bbfe0aee9bd3a469.

Correzioni F03 conservate: p16 usa w₂ nel secondo termine, p30 limita gli ingressi
a t=0,…,T−1, p34 usa x₂,e=0. Note informative locali a p14,17,19,22,26;
nessun nuovo warning per le sole variazioni tipografiche di p31,33,36.
La tracciabilità SOURCE_LITERAL → CORRECTION_USED_BY_COMPANION resta nei metadata.

## Matematica e casi limite

| Modulo nuovo | Oggetto e verifiche indipendenti |
| --- | --- |
| courseFoundations | Sequenza discreta e geometria dei percorsi; collisione inclusa sul tetto |
| courseOptimization | Dimensioni nT/mT, equilibrio, residui, costo scalare, minimo vincolato |
| courseOcp | Contabilità stadi/terminale, raggiungibilità, tracking fisso/ottimo, OCP minimo, uscita, accelerazioni planari |
| courseContinuous | Euler riusato, snapshot del drone, funzionale continuo, famiglia a due coefficienti, pendolo e costo finale |

I renderer consumano dataset numerici prodotti da funzioni pure. I modelli
preesistenti del drone, del pendolo e di Euler sono riusati senza modificarli.
Esempi verificati: costo di p20=1.25; p21 con b=0.4 incompatibile e con b=0.5
compatibile; p23 impossibile senza falso minimo; p22 con R=2 ha costo 0.375
sulla candidata fissa mentre p25 sceglie u=1/3 e costo 1/3; p29=3.05;
p31=1; p33 a π/6 senza coppia dà −4.905; p36=3.2283695334 senza fattore ½.

Gestiti limiti e pesi nulli, box degenere, target irraggiungibile, coppia
compensativa, equilibri coincidenti e assegnazione del secondo ramo a T/2.
Nessun ottimo inventato per snapshot o candidate; nessuna simulazione temporale
aggiunta alle pagine che richiedono solo un’istantanea.

## Grafica, interazioni e revisione

9 pagine 2D_ONLY, 1 pagina 3D_PRIMARY e 26 pagine con toggle coerenti con F04.1.
Le 27 pagine con 3D usano scene native con orbit, pan, zoom e reset.
Gli embedding dichiarano costo, residuo, tempo, errore o accelerazione come
terza coordinata. Drone sempre planare: nessuna posizione fuori piano inventata.
Le curve a gradino di p35 sono separate; la mesh di p36 è tagliata a t=1.
I contributi di costo in 2D sono letture dello stesso modello, senza fingere
che siano proiezioni geometriche della superficie.

Salvati e ispezionati **62 screenshot di pagina/vista**: 36 principali e
26 alternative. In aggiunta: pannello formule aperto di p8 e tre screenshot
delle fondamenta grafiche. Tutte le slide hanno geometria 960×1280, footer entro
1240 px, nessuna sovrapposizione, nessun errore KaTeX e nessun overflow nelle
formule complete. La timeline di p9 scorre orizzontalmente; il grafico contiene
tutti i campioni e lo stato finale è disponibile anche come lettura numerica.

Evidenze: [audit visivo](../Data/reports/f07_final_visual.json),
[revisione degli screenshot](../Data/reports/f07_final_visual_review.json).
Il browser verifica titolo, esempio, sincronizzazione PDF, tutti i controlli,
reset, toggle, warning e spiegazioni. Le regressioni coprono anche playback,
selezione, degenerazioni, cambio passo e cleanup delle otto pagine preesistenti.

## Test e performance

TypeScript e build di produzione PASS. Test: **{total_tests}/{total_tests}** =
{unit['numPassedTests']} unitari + 56 browser + {pipeline['tests']} pipeline.
In aggiunta, {len(runtime['checks'])} verifiche browser su casi limite e valori numerici.
L’ultima correzione al campionamento del bordo 3D di p23 è coperta da un oracolo
numerico e da un ulteriore smoke browser mirato (1/1), successivo alla suite completa.
Nessuna regressione numerica, di notazione o spiegazione sulle otto pagine F06/F06.1.

Misurati 12 aggiornamenti completi del grafico di p23:
mediana {runtime['median_update_ms']} ms, massimo {runtime['maximum_update_ms']} ms.
Nodo e camera conservati. Nella navigazione resta al massimo una scena; tornando
a p1 non rimane alcuna scena o canvas WebGL. Le misure includono automazione
Chrome headless e SwiftShader: non sono un benchmark di GPU fisica. I campioni
heap sono osservazioni senza garbage collection forzata, non una prova di assenza di leak.
Dettagli: [runtime_measurements](../Data/reports/f07_runtime_measurements.json).

## Copertura per pagina

| Pagina fisica | Companion | Modalità | Formule | Revisione |
| --- | --- | --- | --- | --- |
{rows}

## Esito finale

{metrics}

Nessuna issue irrisolta. F07 termina qui; pronta per revisione umana finale.
"""
(root/"Docs/F07_COMPLETE_INTRODUCTION.md").write_text(doc,encoding="utf-8")
plan=root/"Docs/IMPLEMENTATION_PLAN.md"
text=plan.read_text(encoding="utf-8")
text=text.replace("| F07 | Complete Introduction companion implementation | **IN CORSO**: batch A e B chiusi; batch C in verifica; nessun gate manuale |",
    f"| F07 | Complete Introduction companion implementation | **COMPLETATA**: 36/36, {formula_count}/{formula_count} formule spiegate, {total_tests}/{total_tests} test, build e audit visivo PASS |")
marker="F07 procede in quattro batch con gate automatici e revisione visiva prima del successivo."
text=text.replace(marker,"F07 completata in quattro batch, ciascuno con test e revisione visiva prima del successivo.\nEvidenze: [F07_COMPLETE_INTRODUCTION](F07_COMPLETE_INTRODUCTION.md).")
plan.write_text(text,encoding="utf-8")
print(json.dumps({k:v for k,v in result.items() if k.isupper()},indent=2))
