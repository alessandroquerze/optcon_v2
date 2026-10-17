"""Build/audit F04 design documents only. Never renders or implements companion pages."""
from __future__ import annotations

import argparse
from copy import deepcopy
import json
import math
from pathlib import Path

from .common import ROOT, read_json, sha256_file, write_json
from .introduction_design_content import PAGES, CONTROL_DOMAINS, EXTRA_FORMULAS, SEQUENCES
from .source_warning_policy import DOCUMENT, effective_companion_plan, object_hash, review_summary

DATA = ROOT / "Data"
TARGET = DATA / "introduction_companion_manifest.json"
DOC = ROOT / "Docs" / "INTRODUCTION_COMPANION_DESIGN.md"
AUDIT = DATA / "reports" / "introduction_companion_design_audit.json"
REQUIRED = """source_page title learning_objective prerequisite key_ideas
intuitive_explanation mathematical_explanation formulas_to_show worked_example
visualization interaction controls expected_parameter_effects edge_cases takeaway
source_warning reusable_components relation_to_previous_page relation_to_next_page
estimated_density""".split()

COMPONENTS = {
    "EquationCard": ("Formula, domini, legenda dei simboli e riferimenti di provenienza.", "Titolo, righe raggruppate, origine, anchor; nessun calcolo dal LaTeX."),
    "WarningBanner": ("Solo CORRECTION_WARNING locale.", "Testo F03 esatto, rosso, icona e testo; adiacente al gruppo corretto."),
    "InfoNote": ("Solo INFO_WARNING pertinente.", "Testo F03 esatto, rosso discreto, una nota locale per issue."),
    "ParameterControl": ("Un solo controllo numerico con slider e campo sincronizzati, oppure select.", "Dominio, default, unità, passo indicativo, etichetta, effect id; input numerico prevale sulla griglia slider."),
    "FunctionPlot": ("Grafico cartesiano 1D di una funzione scalare.", "Dominio, assi, curve, punti, segmenti di errore; stessa base per parabola, linearizzazione e seno."),
    "ContourPlot": ("Livelli e segno di un residuo in due dimensioni.", "Griglia, livelli, maschera, dominio visibile, degenerazioni; calcolo esterno."),
    "TimeSeriesPlot": ("Tracce temporali continue, campionate o a gradino.", "Stesso tempo, unità per traccia, discontinuità esplicite, marcatori aperti/chiusi, eventuale area."),
    "ConstraintVisualizer": ("Appartenenza e residui di vincoli.", "Banda 1D, regione 2D via ContourPlot o box; tolleranza esplicita, vuoto/bordo/esterno."),
    "VectorVisualizer": ("Vettori, stack, dimensioni e dizionari delle componenti.", "Ordine preservato, simboli LaTeX, legenda fisica; nessun ordinamento automatico."),
    "CostBreakdown": ("Contributi e totale di costo.", "Stadio/terminale, unità normalizzate, candidato fisso/ottimo dell'esempio, fattore di scala esplicito."),
    "StateInputTimeline": ("Indici di stato e ingresso, transizioni e residui.", "T+1 nodi, T archi, stack con x₀ escluso, domini di vincolo indipendenti."),
    "ModelDiagram": ("Schema statico o aggiornato dai valori del modello.", "Anello di feedback, mappa concettuale, drone o pendolo mediante configurazione; nessun motore fisico interno."),
    "ComparisonTable": ("Confronti concettuali e numerici leggibili.", "Colonne dichiarate, unità, righe brevi, niente selettori decorativi.")
}

ASSESSMENT = [
    ("EquationCard", "ADOPT", "EquationCard"),
    ("WarningBanner", "ADOPT", "WarningBanner"),
    ("InfoNote", "ADOPT", "InfoNote"),
    ("ParameterSlider", "VARIANT", "ParameterControl: slider + campo sincronizzato"),
    ("NumericInput", "VARIANT", "ParameterControl: stesso valore, parsing e validazione"),
    ("FunctionPlot", "ADOPT", "FunctionPlot"),
    ("ContourPlot", "ADOPT", "ContourPlot"),
    ("TimeSeriesPlot", "ADOPT", "TimeSeriesPlot"),
    ("StateSpacePlot", "DEFER", "Nessuna traiettoria di fase necessaria al focus delle pagine; futura variante cartesiana, non un simulatore distinto."),
    ("TrajectoryPlot", "DEFER", "Il caso dinamico scelto è verticale: bastano le tracce temporali. Le figure spaziali qualitative restano schemi."),
    ("ConstraintVisualizer", "ADOPT", "ConstraintVisualizer"),
    ("VectorVisualizer", "ADOPT", "VectorVisualizer"),
    ("CostBreakdown", "ADOPT", "CostBreakdown"),
    ("ContinuousVsDiscrete", "COMPOSE", "TimeSeriesPlot + EquationCard; campioni/curva su stesso tempo fisico"),
    ("LinearizationVisualizer", "COMPOSE", "FunctionPlot + EquationCard + letture numeriche"),
    ("StepSimulation", "COMPOSE", "Modulo discrete_step + StateInputTimeline/TimeSeriesPlot"),
    ("StateInputTimeline", "ADOPT", "StateInputTimeline")
]

MODULES = {
    "scalar_dynamics": dict(inputs="Profilo, x⁰, coefficiente a, ingresso costante u, tempo/numero di passi.",
        outputs="Stati e ingresso coerenti con il profilo; soluzione continua analitica oppure ricorrenza discreta.",
        rules="P8: ẋ=−ax+u, ramo a=0 separato. P9: x_next=a x+u. P10/P19–25 integratore quando dichiarato. Non associare automaticamente a discreto ad a continuo.",
        oracle="P8 x(1)=1−exp(−1); p9 x₁=1; p10 stack=(1.5,1.25,1.25)."),
    "horizon_indexing": dict(inputs="T intero positivo, n,m; domini distinti di dinamica/input/stato/path.",
        outputs="T ingressi, T+1 stati, stack nT/mT; indici controllati.",
        rules="Mai u_T; x₀ escluso da 𝐱. P30 input 0…T−1 e quote 1…T, p21/p23 path 0…T−1.",
        oracle="T=1: u₀ e stato previsto x₁; p30 include vincolo sullo stato terminale."),
    "constraint_residuals": dict(inputs="Punto/candidato, funzioni h,g oppure limiti inferiore/superiore.",
        outputs="Residui vettoriali, classe e tolleranza; nessun suggerimento automatico di ottimalità.",
        rules="h=0, g≤0 componente per componente; eps=1e−9 nei fixture normalizzati, con bordo dichiarato. min>max è insieme vuoto, non riordinare limiti.",
        oracle="P19 r₂=.5−.8=−.3; p30 rmax=3.2−3=.2."),
    "quadratic_cost": dict(inputs="Errori, pesi simmetrici/diagonali, fattore di scala e modalità riferimento.",
        outputs="Forma matriciale, contributi, costo e livelli.",
        rules="P16 secondo termine w₂. Matrici del tracking: Q,Q_T≥0,R>0. P29 ingressi rispetto a zero. P36 nessun ½; non applicare default globali di normalizzazione.",
        oracle="P16 diag(1,4),e=(1,1): .5+2=2.5; entrambi pesi zero: costo nullo."),
    "local_linearization": dict(inputs="Δx,Δu; nominale (1,0), modello f=x²+u.",
        outputs="A=2,B=1, esatta 2Δx+(Δx)²+Δu, lineare 2Δx+Δu, scarto (Δx)².",
        rules="Un passo, nessuna garanzia di stabilità; nominale fissata e coerente. Non calcolare errore relativo quando la quantità di riferimento è zero.",
        oracle="Δx=.1,Δu=0: .21,.2,.01."),
    "quadratic_sets": dict(inputs="a,b,c reali su dominio di visualizzazione; inserto unitario fisso.",
        outputs="Residuo az₁²+bz₂²−c, maschera ≤0 e luogo zero; classificazione limitato/vuoto/degenere/non limitato.",
        rules="Non assumere ellisse per coefficienti arbitrari. a,b>0,c=0: origine; c<0: vuoto. a=b=0: piano se c≥0, altrimenti vuoto. Segni misti: possibile regione non limitata.",
        oracle="a=b=c=1: residui ai punti (0,0),(1,0),(2,0): −1,0,3."),
    "closed_form_examples": dict(inputs="Identificativo dell'esempio e parametri del suo dominio.",
        outputs="Soluzione analitica, costo e stato di fattibilità solo per quella istanza.",
        rules="P18 z*=min(z̄,b). P23 u₀=u₁=d_target/2 se |d_target|≤2b. P25 u*=Q_T a/(R+Q_T), denominatore positivo. Nessun backend di ottimizzazione generale.",
        oracle="P18 z*=1,costo .5; p23 .5,.5,costo .25; p25 .5,costo .25."),
    "additive_cost": dict(inputs="Candidata o snapshot, stage cost, terminal cost, pesi, indici e scala.",
        outputs="Contributi e totale; modo di valutazione esplicito.",
        rules="P20/p22/p29 aggiornano solo costo. P29 è un singolo stadio: terminale simbolico escluso dal totale. Non cambiare una candidata quando cambia un peso.",
        oracle="P20 .625+.125+.5=1.25; p22 .125+.125=.25; p29 1+.05+1+1=3.05."),
    "planar_drone": dict(inputs="Stato nell'ordine (p_x,v_x,p_y,v_y,θ,ω), u₁,u₂,M,J,L,g.",
        outputs="f_CT=col(v_x,−(u₁+u₂)sinθ/M,v_y,(u₁+u₂)cosθ/M−g,ω,L(u₁−u₂)/(2J)); y=(p_x,p_y).",
        rules="Piano 2D, M,J,L>0. In p26–27 parametri fissi aggiunti M=1,J=.02,L=.4,g=9.81. Somma interamente negata in accelerazione x.",
        oracle="θ=0,u₁=u₂=4.905: accelerazioni zero; u₁=5,u₂=4: a_y=−.81,a_θ=10."),
    "discrete_step": dict(inputs="f_CT, stato, input, δ>0, durata fisica fissata.",
        outputs="Euler simultaneo x_next=x+δ f_CT(x,u,t); campioni e errore rispetto all'oracolo analitico del caso verticale.",
        rules="Tutti i componenti usano il vecchio stato. Nessun ½δ²a nella posizione. P27 δ divide 1 s; N=1/δ è numero di passi dell'esempio, distinto dal T generico del corso.",
        oracle="δ=.1,a_y=2.19: p₁=0,v₁=.219,p₂=.0219,v₂=.438,p₁₀=.9855; continuo a 1 s=1.095."),
    "continuous_functional": dict(inputs="Famiglia analitica, intervalli, running/terminal cost, scala e riferimento.",
        outputs="Valori del funzionale e contributi; punti di discontinuità separati.",
        rules="P31: ½c²T+½c²T². P36 integrare separatamente [0,T/2) e [T/2,T], senza ½; il singolo punto di salto non cambia l'integrale ma definisce il riferimento terminale.",
        oracle="P31 c=T=1:1. P36 candidata ferma con fixture:3.2283695334."),
    "pendulum_model": dict(inputs="θ,velocità,coppia; un parametro lunghezza l≡ℓ, uno massa m≡M,g.",
        outputs="ẋ₁=x₂, ẋ₂=−g/l sinx₁+u/(mℓ²); coppie di equilibrio (θ_e,0),u_e=mgℓsinθ_e.",
        rules="Alias locali F03; l=ℓ=m=1,g=9.81 nei fixture. P34 condizione x₂,e=0, mai x₁,e=0. Niente smorzamento, approssimazione del seno o stabilità dedotta.",
        oracle="θ=π/6,u=0:−4.905; u=4.905,velocità zero: entrambe componenti nulle."),
    "pendulum_reference": dict(inputs="θ_e¹,θ_e²,T>0 e coppie di equilibrio dallo stesso modello.",
        outputs="x₁des a gradino, x₂des=0, udes a gradino, con secondo ramo incluso a T/2.",
        rules="Sono riferimenti, non traiettorie per angoli distinti. Nessun wrapping automatico degli angoli: il costo della fonte usa differenza ordinaria. Se livelli uguali mostrare il caso costante.",
        oracle="T=2,0→π/6: switch1 s,torque0→4.905; a t=1 usare secondo ramo.")
}

LAYOUTS = {
    "EXPLANATION": [("HEADER", 90), ("EXPLANATION", 170), ("MAIN_VISUAL", 260), ("FORMULA", 160), ("WORKED_EXAMPLE", 240), ("TAKEAWAY", 100)],
    "COMPARISON": [("HEADER", 90), ("EXPLANATION", 120), ("FORMULA", 190), ("MAIN_VISUAL", 280), ("CONTROLS", 160), ("WORKED_EXAMPLE", 100), ("TAKEAWAY", 80)],
    "FORMULA_EXPLORER": [("HEADER", 90), ("EXPLANATION", 100), ("FORMULA", 260), ("MAIN_VISUAL", 240), ("CONTROLS", 160), ("WORKED_EXAMPLE", 90), ("TAKEAWAY", 80)],
    "GRAPH_AND_CONTROLS": [("HEADER", 90), ("EXPLANATION", 100), ("FORMULA", 210), ("MAIN_VISUAL", 300), ("CONTROLS", 160), ("WORKED_EXAMPLE", 80), ("TAKEAWAY", 80)],
    "SIMULATION": [("HEADER", 90), ("EXPLANATION", 90), ("FORMULA", 220), ("MAIN_VISUAL", 300), ("CONTROLS", 150), ("WORKED_EXAMPLE", 100), ("TAKEAWAY", 80)],
    "WORKED_EXAMPLE": [("HEADER", 90), ("EXPLANATION", 90), ("FORMULA", 310), ("MAIN_VISUAL", 200), ("CONTROLS", 160), ("WORKED_EXAMPLE", 100), ("TAKEAWAY", 80)],
    "CONCEPT_SUMMARY": [("HEADER", 90), ("EXPLANATION", 170), ("FORMULA", 150), ("MAIN_VISUAL", 320), ("WORKED_EXAMPLE", 190), ("TAKEAWAY", 100)]
}

SLICE = [
    (2, "Pagina testuale: schema di feedback, arricchimento statico, layout e fonte sincronizzata.", ["ModelDiagram", "ComparisonTable"]),
    (8, "Sistema continuo e grafico 1D: controllo numerico, ramo a=0, assi e stato iniziale.", ["ParameterControl", "TimeSeriesPlot"]),
    (12, "Linearizzazione: curva e retta con errore locale verificabile e nominale fissa.", ["FunctionPlot", "EquationCard"]),
    (16, "Costo e livelli 2D: formula corretta, warning rosso, due contributi e pesi degeneri.", ["ContourPlot", "WarningBanner", "CostBreakdown"]),
    (17, "Vincoli 2D: campitura/uguaglianza, nota F03, casi vuoto/degenere/non limitato.", ["ConstraintVisualizer", "InfoNote"]),
    (27, "Simulazione temporale Euler: ordine delle sei componenti, stesso tempo fisico, oracolo continuo.", ["VectorVisualizer", "TimeSeriesPlot"]),
    (30, "Vincoli e mapping temporale: input 0…T−1, quote 1…T, bordo e intervallo vuoto; secondo warning correttivo.", ["StateInputTimeline", "ConstraintVisualizer", "WarningBanner"]),
    (34, "Pendolo e terzo warning correttivo: equilibrio con angolo non nullo, residui e riuso dello schema fisico.", ["ModelDiagram", "EquationCard", "WarningBanner"])
]


def display_latex(text):
    # json.loads has already decoded JSON escapes. Preserve TeX commands AND
    # the double backslashes separating matrix/aligned rows.
    return text


def formulas(n, spec, plan):
    source = plan["source_math"]
    selected = {8: [1, 2, 3, 5], 14: [], 16: [0, 1, 2], 17: [0,1], 18: [2,3], 19: [0, 1],
                22: [0, 1, 4], 30: [], 31: [1, 2], 34: [1, 2],
                36: [0, 1]}.get(n, list(range(len(source))))
    result = []
    for i in selected:
        result.append(dict(id=f"p{n:02d}-source-math-{i}", expression=display_latex(source[i]["latex"]),
                           origin="source", reference=f"/analysis/result/didactic_plan/source_math/{i}",
                           usage="student_formula", computation_input=False))
    if n == 14:
        result.append(dict(id="p14-dimension", expression=r"z\in\mathbb R^d,\quad \ell:\mathbb R^d\to\mathbb R,\quad Z=\{z\in\mathbb R^d:h(z)=0,\ g(z)\le0\},\quad h:\mathbb R^d\to\mathbb R^m,\quad g:\mathbb R^d\to\mathbb R^r",
                           origin="policy_clarification", reference="/source_warning/issues/0",
                           usage="student_formula", computation_input=False))
    if n == 31:
        result.append(dict(id="p31-trajectory-set",
                           expression=r"\mathcal T=\{(x(\cdot),u(\cdot))\in\mathcal F\mid\dot x(t)=f_t(x(t),u(t)),\ t\in[0,T]\}",
                           origin="policy_clarification", reference="/source_warning/issues/0",
                           usage="student_formula", computation_input=False))
    for i, issue in enumerate(spec.get("source_warning", {}).get("issues", [])):
        if issue["type"] == "CORRECTION_WARNING":
            result.append(dict(id=f"p{n:02d}-correction-{i}", expression=display_latex(issue["corrected_expression"]),
                               origin="correction", reference=f"/source_warning/issues/{i}/corrected_expression",
                               usage="student_formula", computation_input=False))
    for i, expression in enumerate(EXTRA_FORMULAS.get(n, [])):
        result.append(dict(id=f"p{n:02d}-enrichment-{i}", expression=expression, origin="enrichment",
                           reference=f"design:p{n:02d}/mathematical_explanation", usage="student_formula", computation_input=False))
    return result


def warning_view(n, spec):
    policy = spec.get("source_warning")
    records = deepcopy(policy["issues"]) if policy else []
    local = {14: "domini z,h,g e dimensione d", 16: "espansione con il secondo peso w₂",
             17: "grafico calcolato della disequazione", 19: "righe f₀,f₁,…,f_{T−1}",
             22: "default x₀des=x⁰", 26: "uscita planare (p_x,p_y)",
             30: "due domini temporali dei vincoli", 34: "condizione x₂,e=0"}
    return dict(type=policy["type"] if policy else "NO_WARNING", policy_reference=f"Data/documents/{DOCUMENT}/pages/{n:04d}/page_spec.json#/source_warning" if policy else None,
                student_notices=[dict(issue_id=i["issue_id"], component="WarningBanner" if i["type"] == "CORRECTION_WARNING" else "InfoNote",
                                      text=i["short_warning"], color="red", adjacent_to=local[n],
                                      visible_when="Il relativo blocco è visibile; nessun popup o pannello editoriale.")
                                 for i in records if i["type"] != "NO_WARNING"],
                technical_metadata_only=dict(issues=records, inherited_companion_overrides=deepcopy(policy.get("companion_overrides", [])) if policy else [],
                                             never_expose_fields=["source_expression", "correction_reason", "technical_only_legacy_paths"],
                                             source_to_companion_trace="PAGE_SPEC source_literal/source_math → issue F03 → expression mostrata e contratto di calcolo"))


def controls(n, plan):
    if n not in CONTROL_DOMAINS:
        return [], []
    params = plan["interactivity"]["parameters"]
    if len(params) != len(CONTROL_DOMAINS[n]):
        raise ValueError(f"P{n}: parametro non allineato al dominio progettato.")
    cs, effects = [], []
    for j, (param, domain) in enumerate(zip(params, CONTROL_DOMAINS[n]), 1):
        low, high, step, default, unit = domain
        ident = f"p{n:02d}-control-{j}"
        select = isinstance(low, list)
        bounds = dict(choices=low) if select else dict(min=low, max=high, step=step, integer=step == 1)
        symbol = r"d_{\mathrm{target}}" if n == 23 and j == 1 else display_latex(param["symbol"])
        cs.append(dict(id=ident, label=param["name"], symbol=symbol,
                       component="ParameterControl", presentation="select" if select else "slider_and_numeric_input",
                       domain=bounds, default=default, unit=unit, domain_origin="enrichment",
                       symbol_origin=param["origin"], commit="Ricalcolo immediato dopo valore finito valido; campo non valido mostra errore locale e conserva ultimo valore valido.",
                       reset_value=default))
        effects.append(dict(control_id=ident, effect=param["effect_on_change"],
                            changes=[param["effect_on_change"]],
                            output_context=deepcopy(plan["interactivity"]["outputs"]),
                            invariants=deepcopy(plan["interactivity"]["invariants"]),
                            edge_cases=deepcopy(param["edge_cases"])))
    return cs, effects


def layout_for(seed, n, interactive, has_formulas, warning):
    blocks = deepcopy(LAYOUTS[seed["archetype"]])
    blocks = [(name, height) for name, height in blocks if not (
        (name == "CONTROLS" and not interactive) or (name == "FORMULA" and not has_formulas) or (name == "WORKED_EXAMPLE" and n == 1))]
    # Dense formulas and local warnings receive explicit page-specific budgets.
    adjustments = {
        8: {"FORMULA": 260, "MAIN_VISUAL": 270},
        16: {"FORMULA": 330, "MAIN_VISUAL": 250},
        17: {"FORMULA": 270, "MAIN_VISUAL": 280},
        23: {"FORMULA": 330},
        25: {"FORMULA": 340, "MAIN_VISUAL": 220},
        27: {"FORMULA": 300, "MAIN_VISUAL": 220},
        31: {"FORMULA": 300},
        34: {"FORMULA": 330, "MAIN_VISUAL": 200},
    }
    blocks = [(name, adjustments.get(n,{}).get(name,h)) for name,h in blocks]
    # The full p36 formulation needs more room than the generic worked example.
    if n == 36:
        blocks = [(name, 390 if name == "FORMULA" else 120 if name == "MAIN_VISUAL" else h) for name, h in blocks]
    rows = [dict(id=name, max_height_design_px=h,
                 content={"HEADER": "Titolo, obiettivo, riferimento alla pagina fisica.",
                          "EXPLANATION": "intuitive_explanation e massimo tre key_ideas.",
                          "FORMULA": "formulas_to_show raggruppate; legenda simboli; avvisi locali se pertinenti.",
                          "MAIN_VISUAL": "visualization.design, valori e legenda.",
                          "CONTROLS": "controls con unità e breve effetto; massimo quattro.",
                          "WORKED_EXAMPLE": "worked_example: setup e passaggi numerici essenziali.",
                          "TAKEAWAY": "takeaway."}[name]) for name, h in blocks]
    return dict(archetype=seed["archetype"], visual_block_order=[x["id"] for x in rows], blocks=rows,
                warning_placement="Dentro il blocco pertinente, con riserva fino a 64 px inclusa nel budget del blocco." if warning else None,
                max_student_prose_words=170 if seed["density"] == "HIGH" else 155,
                mandatory_material="Nessun concetto necessario nascosto in pannelli chiusi; metadata tecnici fuori dalla slide.",
                formula_grouping="Raggruppare definizioni equivalenti, spezzare dopo = o +; mantenere righe di matrici e allineamenti. Un solo EquationCard con sottogruppi, non una scheda con margini per ogni espressione.",
                overflow_policy="Verifica tipografica nel vertical slice. Riaggregare formule e testo ridondante prima di proporre una subpage; non ridurre corpo sotto il minimo.")


def make_manifest():
    report_path = DATA / "reports" / "page_analysis_introduction.json"
    report = read_json(report_path)
    if report["READY_FOR_COMPANION_DESIGN"] != "YES":
        raise ValueError("Gate F03 non soddisfatto.")
    pages = []
    for row in report["pages"]:
        n = row["physical_page"]
        spec_path = DATA / row["spec_path"]
        spec = read_json(spec_path)
        plan = effective_companion_plan(spec)
        seed = PAGES[n]
        interactive = n in CONTROL_DOMAINS
        formula_list = formulas(n, spec, plan)
        notice = warning_view(n, spec)
        cs, effects = controls(n, plan)
        if n == 32:
            rationale = "Confronto statico sufficiente a distinguere dimensione finita e spazio di funzioni; eliminata la proposta di slider K per non ripetere un laboratorio numerico senza necessità."
        else:
            rationale = plan["interactivity"]["rationale"]
        examples = deepcopy(plan["examples"])
        for e in examples:
            e["display_label"] = "Esempio aggiunto"
            e["mathematical_status"] = "ottimo analitico del solo esempio" if n in [2, 18, 23, 25] else "candidata/istantanea o illustrazione; nessuna ottimalità dichiarata"
        source_refs = [dict(id=o["id"], claim=o["description"], pointer=f"/analysis/result/observations/{i}")
                       for i, o in enumerate(spec["analysis"]["result"]["observations"]) if not o["id"].startswith("transcription")]
        item = dict(source_page=n, source_pdf_label=row["pdf_label"], page_id=spec["page_id"],
                    companionPageCount=1, subpages=[], mapping_reason="Il concetto è spiegabile con un focus, una rappresentazione principale e un esempio, senza espansione didattica eccezionale.",
                    title=seed["title"], learning_objective=seed["learning_objective"],
                    prerequisite=deepcopy(plan["prerequisites"]), key_ideas=seed["key_ideas"],
                    intuitive_explanation=seed["intuitive_explanation"],
                    mathematical_explanation=seed["mathematical_explanation"], formulas_to_show=formula_list,
                    worked_example=dict(required=n != 1, omission_reason=plan["example_omission_reason"],
                                        items=examples, student_rendering="Un solo esempio principale; tutti i numeri e i modelli aggiunti portano l'etichetta Esempio aggiunto."),
                    visualization=dict(mode="interactive" if interactive else "static", design=seed["visualization_design"],
                                       origin="enrichment", source_figure_policy="Schema autonomo nella companion; immagine originale soltanto nel pannello fonte immutabile.",
                                       accessible_alternative="Descrizione testuale, valori e residui in tabella; differenze indicate anche con tratteggio, marker e testo, oltre al colore."),
                    interaction=dict(enabled=interactive, pedagogical_purpose=rationale,
                                     calculation_mode="closed_form_optimum_of_example" if n in [18, 23, 25] else "fixed_candidate_cost" if n in [20, 22, 29, 36] else "model_or_constraint_exploration" if interactive else "none",
                                     outputs=deepcopy(plan["interactivity"]["outputs"]) if interactive else [],
                                     invariants=deepcopy(plan["interactivity"]["invariants"]) if interactive else [],
                                     state_scope="Per pagina e per profilo, con ripristino esplicito; nessun parametro numerico trasferito implicitamente tra profili.",
                                     reset="Ripristina tutti i default e le scale del profilo; annulla errori locali." if interactive else None),
                    controls=cs, expected_parameter_effects=effects,
                    edge_cases=deepcopy(plan["edge_cases"]), takeaway=seed["takeaway"], source_warning=notice,
                    reusable_components=seed["components"],
                    relation_to_previous_page=dict(source_page=n-1, role="Riprende "+PAGES[n-1]["title"]+". "+next((c["note"] for c in spec["analysis"]["result"]["context_notes"] if c["role"] == "previous"), "")) if n > 1 else None,
                    relation_to_next_page=dict(source_page=n+1, role="Prepara "+PAGES[n+1]["title"]+". "+next((c["note"] for c in spec["analysis"]["result"]["context_notes"] if c["role"] == "next"), "")) if n < 36 else None,
                    estimated_density=dict(level=seed["density"], rationale="Un focus, fino a tre idee, un esempio principale; formula e grafico condividono simboli e legenda.",
                                           needs_typographic_validation=True),
                    layout=layout_for(seed, n, interactive, bool(formula_list), bool(notice["student_notices"])),
                    shared_math_modules=seed["modules"],
                    computation_contract=dict(model_modules=seed["modules"],
                                              authoritative_inputs="Valori strutturati e regole dei moduli; il LaTeX e source_literal non sono codice da valutare.",
                                              formula_policy=[dict(issue_id=i["issue_id"], policy=i["calculation_policy"],
                                                                   corrected_expression=i["corrected_expression"], companion_uses=i["companion_uses"])
                                                              for i in spec.get("source_warning", {}).get("issues", [])],
                                              plan_resolved_through="effective_companion_plan; poi selezione delle formule secondo F03",
                                              output_status="Design: contratti e oracoli di verifica, nessun motore implementato."),
                    provenance=dict(page_spec=spec_path.relative_to(ROOT).as_posix(), page_spec_sha256=sha256_file(spec_path),
                                    source_claims=source_refs, source_scope_limits=plan["source_scope_limits"],
                                    source_pdf_sha256=report["source_pdf"]["sha256"],
                                    text_sha256=spec["artifacts"]["text"]["sha256"],
                                    render_sha256=spec["artifacts"]["render"]["sha256"],
                                    raw_source_math_usage="Trascrizione immutabile; mai input automatico. TeX conservato dopo il normale parsing JSON, inclusi i separatori di riga delle matrici.",
                                    design_explanations_origin="enrichment derivato dalle osservazioni; non nuove affermazioni letterali della fonte.",
                                    spec_read=True))
        pages.append(item)
    inventory = [dict(name=k, purpose=v[0], configuration=v[1],
                      used_on_pages=[p["source_page"] for p in pages if k in p["reusable_components"]],
                      status="DESIGNED_NOT_IMPLEMENTED") for k, v in COMPONENTS.items()]
    modules = [dict(id=k, **v, used_on_pages=[p["source_page"] for p in pages if k in p["shared_math_modules"]],
                    status="CONTRACT_ONLY_NOT_IMPLEMENTED") for k, v in MODULES.items()]
    return dict(schema_version="1.0.0", phase="F04 — INTRODUCTION COMPANION DESIGN",
                document_id=DOCUMENT, source_pdf=deepcopy(report["source_pdf"]),
                source_page_count=36, status="DESIGN_ONLY",
                source_references=[dict(path=str(p.relative_to(ROOT)).replace("\\", "/"), sha256=sha256_file(p))
                                   for p in [report_path, ROOT / "Docs" / "INTRODUCTION_SOURCE_WARNING_REVIEW.md"]],
                immutable_originals=True, app_implementation_authorized_by_this_manifest=False,
                design_principles=[
                    "Una pagina fisica → una companion; PDF.js futuro mostra il PDF originale a sinistra.",
                    "Ogni pagina ha un obiettivo osservabile, un focus visivo e un esempio quando utile.",
                    "Fonte, correzione F03 ed enrichment hanno provenienza distinta; lo studente vede brevi etichette, non motivazioni editoriali.",
                    "Interazione solo per un effetto matematico o dinamico esplicito; confronto statico quando sufficiente.",
                    "Valutazione di candidata, riferimento e ottimo analitico dell'esempio hanno sempre etichette distinte.",
                    "Nessun algoritmo generale, modello 3D o risultato ottimo inventato.",
                    "Le pagine simili mantengono la propria identità; il riuso avviene nelle rappresentazioni e nei componenti."
                ], pages=pages, pedagogical_sequences=SEQUENCES,
                component_inventory=inventory,
                requested_component_assessment=[dict(requested=a, decision=b, implementation_design=c) for a, b, c in ASSESSMENT],
                shared_math_modules=modules,
                warning_handling=dict(authority="PAGE_SPEC.source_warning F03",
                                      correction_pages=[16, 30, 34], info_pages=[14, 17, 19, 22, 26],
                                      no_warning_reviewed_pages=[31, 33, 36],
                                      ui_allowlist=["type", "student_notices.component", "student_notices.text", "student_notices.color", "student_notices.adjacent_to"],
                                      technical_fields_never_rendered=True,
                                      corrected_formula_mandatory_for=["explanation", "example", "plot", "simulation"],
                                      never_compute_known_erroneous_expression=True),
                visual_layout_system=dict(canvas_design_px=dict(width=960, height=1280), orientation="portrait 3:4",
                                          outer_margin_px=40, content_height_px=1200, inter_block_gap_px=12,
                                          fonts_design_px=dict(title=34, body=24, formula=28, caption=22, warning=22),
                                          min_display_width_px=720,
                                          small_viewport="Sotto 720 px per pannello, mantenere larghezza logica e consentire scorrimento/zoom o vista a pannelli alternati; mai comprimere fino a testo illeggibile.",
                                          color_roles=dict(state="blu", input="arancio", desired="grigio tratteggiato", exact="blu continuo", approximation="viola tratteggiato", violation="rosso con simbolo", admissible="verde con testo"),
                                          fixed_layout="Ordine e budget dei blocchi fissi per archetipo; lunghe formule spezzate in righe matematiche, mai ridotte a immagine.",
                                          accessibility="Tastiera, etichette e unità, input numerici, tabella dei dati; non usare il solo colore.",
                                          student_copy_boundary="Le 20 proprietà sono il design completo. Nella slide compaiono spiegazione breve, idee, formule raggruppate, esempio, visualizzazione e takeaway. Prerequisiti/relazioni sono righe brevi; motivazioni, contratti e provenance sono metadata.",
                                          archetypes={k: [name for name, h in v] for k, v in LAYOUTS.items()},
                                          acceptance_gate="Il budget strutturale è verificato ora; leggibilità, wrapping e assenza di overflow richiedono la successiva implementazione del vertical slice."),
                original_images_consulted_for_design=[5, 24, 27, 33, 35],
                proposed_vertical_slice=[dict(source_page=n, validates=why, components=cs,
                                             completion_criteria=["PDF originale e companion sincronizzati per pagina fisica.", "Nessun overflow a larghezza pannello 720 px; formule e avvisi leggibili.",
                                                                  "Oracoli dei moduli e casi limite della pagina verificati; etichette candidato/riferimento/ottimo corrette."])
                                         for n, why, cs in SLICE],
                implementation_boundary="Sono prodotti solo specifiche, inventario, contratti e audit. Nessuna pagina React/HTML/CSS, grafico o simulazione implementata.")


def check_numerical_oracles():
    """Independent arithmetic checks of documented fixtures, not a simulation engine."""
    a = math.pi / 6
    cases = [
        ("p2_cost", (0.6-1)**2, .16),
        ("p8_continuous", 1-math.exp(-1), .6321205588285577),
        ("p9_update", .8*1+.2, 1),
        ("p10_stack_terminal", 1+.5-.25+0, 1.25),
        ("p11_equilibrium", 2-(.5*2+1), 0),
        ("p12_exact", (1.1**2)-1, .21),
        ("p12_linear", 2*.1, .2),
        ("p12_error", .1**2, .01),
        ("p14_cost", .5*(.5**2+.5**2), .25),
        ("p15_cost", .5*(3-2)**2, .5),
        ("p16_corrected_cost_matrix", .5*(1*1**2+4*1**2), 2.5),
        ("p16_second_coordinate_only", .5*4*1**2, 2),
        ("p17_residual_exterior", 2**2+0**2-1, 3),
        ("p18_constrained_cost", .5*(min(2,1)-2)**2, .5),
        ("p19_residual", 1-.5-.8, -.3),
        ("p20_total", .5*(1+.25)+.5*.25+2*.25, 1.25),
        ("p21_reachable_upper", 2*.4, .8),
        ("p22_fixed_cost", .5*.5**2+.5*(.5-1)**2, .25),
        ("p23_optimal_cost", .5*(.5**2+.5**2), .25),
        ("p25_optimal_input", 1*1/(1+1), .5),
        ("p26_hover_vertical", (4.905+4.905)-9.81, 0),
        ("p26_asymmetric_vertical", (5+4)-9.81, -.81),
        ("p26_asymmetric_angular", .4/(2*.02)*(5-4), 10),
        ("p27_euler_step1_position", 0+.1*0, 0),
        ("p27_euler_step1_velocity", .1*2.19, .219),
        ("p27_euler_step2_position", .1*.219, .0219),
        ("p27_euler_final_position_closed_form", 2.19*.1**2*10*9/2, .9855),
        ("p27_continuous_final_position", .5*2.19, 1.095),
        ("p29_stage_cost", .5*(2*1**2+10*.1**2+.5*2**2+.5*2**2), 3.05),
        ("p30_upper_violation", 3.2-3, .2),
        ("p31_functional", .5*1**2*1+.5*1**2*1**2, 1),
        ("p32_terminal", 1*1+(-1)*1, 0),
        ("p33_acceleration", -9.81*math.sin(a), -4.905),
        ("p34_equilibrium_torque", 9.81*math.sin(a), 4.905),
        ("p34_correct_velocity_condition", 0, 0),
        ("p34_dynamic_second_residual", -9.81*math.sin(a)+4.905, 0),
        ("p35_second_branch_torque", 9.81*math.sin(a), 4.905),
        ("p36_cost_no_half", a*a+.1*4.905**2+2*a*a, 3.228369533424113),
    ]
    return [dict(id=key, computed=value, expected=expected, tolerance=1e-9, ok=abs(value-expected)<1e-9)
            for key,value,expected in cases]


def audit(manifest):
    errors = []
    checks = {}

    def check(name, ok, detail):
        checks[name] = dict(ok=bool(ok), detail=detail)
        if not ok:
            errors.append(name+": "+detail)

    pages = manifest["pages"]
    nums = [p["source_page"] for p in pages]
    check("physical_coverage", nums == list(range(1, 37)), "Esattamente 36 entry distinte, in ordine fisico 1…36.")
    check("complete_page_fields", all(all(k in p for k in REQUIRED) for p in pages), "Tutte le 20 proprietà richieste.")
    check("mapping_one_to_one", all(p["companionPageCount"] == 1 and p["subpages"] == [] for p in pages), "36 companion, zero sottopagine aggiuntive.")
    expected_severity = {"CORRECTION_WARNING": [16,30,34], "INFO_WARNING": [14,17,19,22,26]}
    for severity, expected in expected_severity.items():
        check("warning_pages_"+severity, [p["source_page"] for p in pages if p["source_warning"]["type"] == severity] == expected, str(expected))
    all_notices_valid, spec_hashes_valid, traces_valid = True, True, True
    for p in pages:
        n = p["source_page"]
        specpath = ROOT / p["provenance"]["page_spec"]
        spec = read_json(specpath)
        spec_hashes_valid &= sha256_file(specpath) == p["provenance"]["page_spec_sha256"]
        old_issues = spec.get("source_warning", {}).get("issues", [])
        expected = [(i["issue_id"], i["short_warning"]) for i in old_issues if i["type"] != "NO_WARNING"]
        actual = [(i["issue_id"], i["text"]) for i in p["source_warning"]["student_notices"]]
        all_notices_valid &= actual == expected and p["source_warning"]["student_notices"] == warning_view(n,spec)["student_notices"]
        traces_valid &= p["source_warning"]["technical_metadata_only"]["issues"] == old_issues
        for idx, issue in enumerate(old_issues):
            if issue["type"] == "CORRECTION_WARNING":
                matching = [f for f in p["formulas_to_show"] if f["origin"] == "correction" and f["reference"] == f"/source_warning/issues/{idx}/corrected_expression"]
                traces_valid &= len(matching) == 1 and matching[0]["expression"] == display_latex(issue["corrected_expression"])
        # Source formulas chosen for display must be traceable and unchanged mathematically.
        for f in p["formulas_to_show"]:
            if f["origin"] == "source":
                index = int(f["reference"].rsplit("/",1)[1])
                traces_valid &= f["expression"] == display_latex(spec["analysis"]["result"]["didactic_plan"]["source_math"][index]["latex"])
        ids = [c["id"] for c in p["controls"]]
        check(f"p{n:02d}_control_effects", len(ids) == len(set(ids)) and ids == [e["control_id"] for e in p["expected_parameter_effects"]] and all(e["effect"] and e["changes"] and e["edge_cases"] for e in p["expected_parameter_effects"]), "Ogni controllo ha dominio, default, effetto, output e casi limite.")
        for c in p["controls"]:
            d=c["domain"]
            valid = c["default"] in d["choices"] if "choices" in d else d["min"]<=c["default"]<=d["max"] and d["step"]>0
            check(c["id"]+"_domain", valid and bool(c["unit"]) and c["domain_origin"]=="enrichment", "Default nel dominio, passo valido e unità esplicite; intervallo attribuito all'enrichment.")
        check(f"p{n:02d}_interaction", bool(p["controls"]) == p["interaction"]["enabled"] and bool(p["interaction"]["pedagogical_purpose"]), "Solo interazioni motivate; le pagine statiche non espongono parametri.")
        check(f"p{n:02d}_neighbors", (p["relation_to_previous_page"]["source_page"] if n>1 else None) == (n-1 if n>1 else None) and (p["relation_to_next_page"]["source_page"] if n<36 else None) == (n+1 if n<36 else None), "Vicini fisici corretti.")
        heights = sum(b["max_height_design_px"] for b in p["layout"]["blocks"])
        gaps = (len(p["layout"]["blocks"])-1)*manifest["visual_layout_system"]["inter_block_gap_px"]
        check(f"p{n:02d}_structural_height_budget", heights+gaps<=1200, f"Budget {heights+gaps}/1200 px; wrapping reale da verificare nel vertical slice.")
    check("exact_f03_notice_text", all_notices_valid, "Solo short_warning, testo esatto; nessun avviso per issue NO_WARNING.")
    check("formula_provenance_and_corrections", traces_valid, "Fonte→F03→display e calculation_policy; source_expression resta nei metadata.")
    check("page_specs_byte_integrity", spec_hashes_valid, "I 36 PAGE_SPEC, inclusa tutta l'analisi, sono identici agli input di F04.")
    sources_unchanged = all(sha256_file(ROOT/r["path"]) == r["sha256"] for r in manifest["source_references"])
    check("primary_reports_unchanged", sources_unchanged, "Report PAGE ANALYSIS e review F03 immutati.")
    review = review_summary(DATA)
    check("original_sources_and_analysis_integrity", not review["errors"], f"Baseline F03: {review['immutable_file_count']} file immutabili, {review['original_page_specs_checked']} PAGE_SPEC originali; errori={review['errors']}.")
    used = {c for p in pages for c in p["reusable_components"]}
    check("reusable_components", used == set(COMPONENTS) and all(len(p["reusable_components"])==len(set(p["reusable_components"])) for p in pages), "13 componenti generali configurabili; specializzazioni richieste composte o motivate come differite.")
    check("math_module_references", all(set(p["shared_math_modules"])<=set(MODULES) for p in pages), "Ogni riferimento risolve un contratto di modulo.")
    # Direct guards for mistakes that would change the mathematics.
    by_page={p["source_page"]:p for p in pages}
    def expressions(n):
        return " ".join(f["expression"] for f in by_page.get(n,{}).get("formulas_to_show",[]))
    f16,f30,f34,f36=(expressions(n) for n in [16,30,34,36])
    check("calculation_policy_16", r"\frac12w_2" in f16 and r"\frac12w_1(z_2" not in f16, "Nessuna formula del costo con w₁ sul secondo scarto.")
    check("calculation_policy_30", r"t=0,\ldots,T-1" in f30 and r"t=1,\ldots,T" in f30, "Ingressi e quote hanno domini temporali distinti.")
    check("calculation_policy_34", "0=x_{2,e}" in f34 and "0=x_{1,e}" not in f34, "La velocità è nulla; l'angolo può essere non nullo.")
    check("pendulum_no_half", r"\frac12" not in f36, "Nessun fattore ½ nel costo di p36.")
    numeric = check_numerical_oracles()
    check("numerical_fixture_oracles", all(c["ok"] for c in numeric), f"{sum(c['ok'] for c in numeric)}/{len(numeric)} controlli aritmetici; nessun renderer, simulatore o solver implementato.")
    count=sum(p["interaction"]["enabled"] for p in pages)
    return dict(ok=not errors, document_id=DOCUMENT, missing_pages=sorted(set(range(1,37))-set(nums)),
                checks=checks, numerical_fixture_checks=numeric,
                limitations=["Budget di spazio strutturale, non prova di wrapping o accessibilità nel browser: gate della futura vertical slice.",
                             "Audit matematico dei fixture e dei contratti; grafici, simulazioni e solver non sono implementati né collaudati in F04.",
                             "Nessuna revisione umana dichiarata."],
                errors=errors, DESIGNED_PAGES=f"{len(pages)}/36", COMPANION_SUBPAGES=sum(len(p["subpages"]) for p in pages),
                INTERACTIVE_PAGES=count, STATIC_PAGES=len(pages)-count, REUSABLE_COMPONENTS=len(COMPONENTS),
                UNRESOLVED_DESIGN_ISSUES=len(errors), READY_FOR_VERTICAL_SLICE="NO" if errors else "YES",
                readiness_scope="Autorizza a pianificare la successiva implementazione; F04 non la esegue.")


def render_doc(m):
    lines = ["# F04 — Introduction Companion Design", "",
             "Progetto delle 36 companion, una per pagina fisica del PDF. Sono specifiche di contenuto, layout e comportamento: nessuna pagina o interazione è implementata.",
             "Questa F04 è la fase richiesta dopo la SOURCE WARNING POLICY; la numerazione storica di IMPLEMENTATION_PLAN.md appartiene al precedente piano della pipeline.", "",
             "Fonti primarie: [review F03](INTRODUCTION_SOURCE_WARNING_REVIEW.md), [report PAGE ANALYSIS](../Data/reports/page_analysis_introduction.json) e tutti i 36 PAGE_SPEC indicizzati nel manifest.",
             "Il contratto completo e verificabile è [introduction_companion_manifest.json](../Data/introduction_companion_manifest.json). L'audit ripetibile è [introduction_companion_design_audit.json](../Data/reports/introduction_companion_design_audit.json).", "",
             "## 1. DESIGN PRINCIPLES", ""]
    lines += ["- "+s for s in m["design_principles"]]
    lines += ["", "Le spiegazioni intuitive, le deduzioni e tutti i valori assegnati sono enrichment. Le affermazioni della fonte hanno riferimenti puntuali alle osservazioni del PAGE_SPEC. Le formule del corso conservano simboli, indici, fattori e separatori di riga TeX, senza riscrivere la trascrizione.", ""]
    for s in SEQUENCES:
        lines += [f"**Sequenza {s['id']} — pagine {s['pages']}.** {s['representation']} {s['state_policy']}", ""]
    lines += ["## 2. PAGE-BY-PAGE DESIGN", "",
              "Le pagine indicate sono fisiche (1–36); la label PDF corrispondente è 0–35. Tutte hanno companionPageCount=1. Ogni scheda contiene le 20 proprietà richieste; dettagli di provenienza e domini strutturati restano nel manifest.", ""]

    def cell(value):
        return str(value).replace("|", "∣").replace("\n", " ")

    for p in m["pages"]:
        n=p["source_page"]
        lines += [f"### Pagina {n:02d} — {p['title']}", "",
                  f"**source_page:** {n}; label PDF {p['source_pdf_label']}; mapping 1:1.",
                  f"**learning_objective:** {p['learning_objective']}",
                  "**prerequisite:** "+("; ".join(x["concept"] for x in p["prerequisite"]) or "Nessuno: copertina."),
                  "**key_ideas:** "+"; ".join(p["key_ideas"]),
                  f"**intuitive_explanation — enrichment:** {p['intuitive_explanation']}",
                  f"**mathematical_explanation:** {p['mathematical_explanation']}", "",
                  "**formulas_to_show** (source = contenuto della fonte; correction/policy = F03; enrichment = aggiunta):", ""]
        if p["formulas_to_show"]:
            for f in p["formulas_to_show"]:
                lines += [f"- {f['origin']}: \\({f['expression']}\\)"]
        else:
            lines += ["Nessuna formula della fonte; eventuali espressioni dell'esempio sono enrichment."]
        lines += ["", "**worked_example — Esempio aggiunto:**"]
        for e in p["worked_example"]["items"]:
            lines += [e["setup"], "", *["- "+x for x in e["derivation"]], "", "Limiti: "+"; ".join(e["limitations"])]
        if not p["worked_example"]["items"]:
            lines += [p["worked_example"]["omission_reason"]]
        lines += ["", f"**visualization:** {p['visualization']['design']}",
                  f"**interaction:** {'Sì' if p['interaction']['enabled'] else 'Statica'}. {p['interaction']['pedagogical_purpose']}", "",
                  "**controls / expected_parameter_effects:**", ""]
        if p["controls"]:
            lines += ["| Controllo | Dominio; default; unità | Effetto osservabile |", "| --- | --- | --- |"]
            for c,e in zip(p["controls"],p["expected_parameter_effects"]):
                d=c["domain"]
                bound=str(d["choices"]) if "choices" in d else f"[{d['min']}, {d['max']}], passo indicativo {d['step']}"
                lines += ["| "+" | ".join(cell(x) for x in [c["symbol"], f"{bound}; default {c['default']}; {c['unit']}", e["effect"]])+" |"]
            lines += ["", "Invarianti: "+"; ".join(p["interaction"]["invariants"])]
        else:
            lines += ["Nessun controllo; nessun parametro dello studente da propagare."]
        lines += ["", "**edge_cases:**", ""]
        lines += ["- "+e["case"]+": "+e["expected_behavior"] for e in p["edge_cases"]]
        lines += ["", "**takeaway:** "+p["takeaway"],
                  "**source_warning:** "+p["source_warning"]["type"]+"."]
        for notice in p["source_warning"]["student_notices"]:
            lines += ["Avviso rosso vicino a "+notice["adjacent_to"]+": "+notice["text"]]
        if not p["source_warning"]["student_notices"]:
            lines += ["Nessun avviso allo studente."]
        lines += ["**reusable_components:** "+", ".join(p["reusable_components"]),
                  "**relation_to_previous_page:** "+(p["relation_to_previous_page"]["role"] if p["relation_to_previous_page"] else "Nessuna: prima pagina."),
                  "**relation_to_next_page:** "+(p["relation_to_next_page"]["role"] if p["relation_to_next_page"] else "Nessuna: conclusione del documento."),
                  "**estimated_density:** "+p["estimated_density"]["level"]+". "+p["estimated_density"]["rationale"],
                  "**Layout:** "+p["layout"]["archetype"]+"; "+" → ".join(p["layout"]["visual_block_order"])+".",
                  "**Moduli matematici condivisi:** "+(", ".join(p["shared_math_modules"]) or "Nessuno necessario."),
                  "**Fonte e limiti:** "+"; ".join(p["provenance"]["source_scope_limits"]),
                  f"**PAGE_SPEC:** [{n:04d}]({('../'+p['provenance']['page_spec'])}).", ""]
    lines += ["## 3. COMPONENT INVENTORY", "",
              "13 componenti da realizzare, tutti configurabili e riusati. Header, griglia e takeaway appartengono al contenitore comune, non sono mini-app per pagina.", "",
              "| Componente | Responsabilità | Pagine |", "| --- | --- | --- |"]
    for c in m["component_inventory"]:
        lines += ["| "+" | ".join(cell(x) for x in [c["name"],c["purpose"]+" "+c["configuration"],c["used_on_pages"]])+" |"]
    lines += ["", "Valutazione di tutti i componenti richiesti:", "", "| Proposta | Decisione | Riuso |", "| --- | --- | --- |"]
    for c in m["requested_component_assessment"]:
        lines += ["| "+" | ".join(cell(c[k]) for k in ["requested","decision","implementation_design"])+" |"]
    lines += ["", "## 4. SHARED SIMULATION/MATH MODULES", "",
              "Sono contratti per la fase successiva, non implementazioni. I moduli producono dati, i componenti li rappresentano. La UI non interpreta formule LaTeX come codice. I fixture sono verificati ora con aritmetica indipendente; il futuro motore dovrà superarli prima di mostrare risultati.", ""]
    for mod in m["shared_math_modules"]:
        lines += ["### "+mod["id"], "", "**Pagine:** "+str(mod["used_on_pages"]), "**Input:** "+mod["inputs"],
                  "**Output:** "+mod["outputs"], "**Regole:** "+mod["rules"], "**Oracolo:** "+mod["oracle"], ""]
    lines += ["Nessun ottimizzatore generale è richiesto dal primo design. Le pagine 18, 23 e 25 usano soluzioni analitiche di piccoli esempi; le pagine 20, 22, 29 e 36 rivalutano candidate fisse. p26 e p33 sono ispettori istantanei, p27 è il laboratorio temporale Euler, p35 genera solo riferimenti.", "",
              "## 5. WARNING HANDLING", "",
              "La policy F03 è vincolante. Il pannello PDF conserva la fonte; nella companion si mostra soltanto il testo breve previsto. correction_reason, source_expression e discussioni tecniche restano esclusivamente nei metadata.", "",
              "| Pagina | Tipo | Punto di applicazione e testo esatto |", "| --- | --- | --- |"]
    for p in m["pages"]:
        for notice in p["source_warning"]["student_notices"]:
            lines += [f"| {p['source_page']} | {p['source_warning']['type']} | {cell(notice['adjacent_to'])}: {cell(notice['text'])} |"]
    lines += ["", "Nessun avviso per le issue NO_WARNING, comprese quelle aggiuntive a pagine 17 e 34 e le pagine 31,33,36. Nessun confronto numerico con il refuso.",
              "Tracciabilità: source_literal/source_math originale → issue F03 → corrected_expression/companion_uses → formula mostrata → contratto matematico → esempio e output.",
              "P16 usa w₂ sul secondo scarto; p30 separa input 0…T−1 e quote 1…T; p34 usa x₂,e=0. Negli esempi p22 assegna x₀des=x⁰; p26 è planare; nel pendolo una sola lunghezza e una sola massa, e p36 conserva il costo senza ½.", "",
              "## 6. VISUAL/LAYOUT SYSTEM", "",
              "Tela logica 960×1280, verticale 3:4; margini 40 px, 1200 px interni e separazioni 12 px. Titolo 34 px, corpo 24, formule 28, didascalie/avvisi 22. A larghezza 720 px corrispondono corpo 18 e didascalie 16.5 px. Sotto tale larghezza si usa zoom/scorrimento o pannelli alternati, senza comprimere ulteriormente il testo.", "",
              "Un solo grafico principale; massimo quattro controlli. Formule spezzate in righe matematiche, simboli coerenti e valori con unità. Fino a 170 parole di prosa studente nelle pagine dense, oltre alle formule e al piccolo esempio. I campi tecnici completi del manifest non devono apparire tutti nella slide.",
              "Le motivazioni e le fonti dettagliate restano nei metadata; nessun passaggio necessario alla comprensione viene nascosto per far entrare il contenuto.", "",
              "| Archetipo | Ordine base dei blocchi |", "| --- | --- |"]
    for name, blocks in m["visual_layout_system"]["archetypes"].items():
        lines += ["| "+name+" | "+" → ".join(blocks)+" |"]
    lines += ["", "Le entry riportano budget per blocco: p27 dedica più spazio al dizionario di stato; p36 alla formulazione completa. Gli avvisi sono interni al budget del blocco pertinente e prevedono fino a 64 px.",
              "Blu per stato/esatto, arancio per ingresso, grigio tratteggiato per desiderato, viola tratteggiato per approssimazione. Ammissibilità e violazioni hanno sempre anche testo/marker. Tabelle numeriche e descrizione alternativa accompagnano i grafici; controlli accessibili da tastiera.",
              "ParameterControl accetta input numerici finiti anche se non sulla griglia indicativa dello slider: π/6 e 4.905 restano esatti ai default. Valori fuori dominio sono rifiutati con un errore locale, senza ricalcolare. Minimo maggiore del massimo è invece un caso matematico valido: insieme vuoto.",
              "Il reset ripristina i default del profilo. Tornare a una pagina nella stessa sessione ripristina i suoi valori salvati; una nuova sessione parte dai default. Nessuna propagazione implicita fra istantanee, modelli o esempi con assunzioni diverse.", "",
              "Il controllo attuale prova i budget strutturali. La verifica reale di wrapping, leggibilità, tastiera e overflow rimane criterio di accettazione della vertical slice, perché F04 non crea DOM o grafici.", "",
              "## 7. PROPOSED VERTICAL SLICE", "",
              "Otto pagine, nell'ordine fisico seguente. Coprono testo, formule, grafici 1D/2D, dinamica, linearizzazione, costi, vincoli e simulazione temporale; includono tutte e tre le correzioni F03.", "",
              "| Pagina | Che cosa valida |", "| --- | --- |"]
    for s in m["proposed_vertical_slice"]:
        lines += [f"| {s['source_page']} | {s['validates']} |"]
    lines += ["", "Completamento della futura vertical slice: 8 mapping navigabili sul PDF originale; formule e warning conformi al manifest; tutti gli oracoli e casi limite delle pagine scelte verificati; leggibilità senza overflow a 720 px per pannello; tastiera e alternative testuali funzionanti. Nessuna implementazione è stata eseguita in questa fase.", "",
              "**Audit finale F04.** "+str(len(m["audit"]["checks"]))+" controlli strutturali/policy più "+str(len(m["audit"]["numerical_fixture_checks"]))+" fixture aritmetici. "+m["audit"]["checks"]["original_sources_and_analysis_integrity"]["detail"],
              "Tutte le pagine hanno le 20 proprietà, il proprio PAGE_SPEC e i vicini corretti. Mapping 1:1, testi F03 esatti, formule corrette tracciabili, domini/default/effetti dei controlli espliciti, nessun componente ad hoc duplicato. PDF, immagini, testo estratto, source_literal e analisi precedenti sono immutati.",
              "READY_FOR_VERTICAL_SLICE indica che il design è pronto per la prossima fase, non che l'applicazione o le verifiche di rendering siano complete.", "",
              "Audit ripetibile: .venv/Scripts/python.exe -m pipeline.introduction_companion_design audit", ""]
    for key in ["DESIGNED_PAGES","COMPANION_SUBPAGES","INTERACTIVE_PAGES","STATIC_PAGES","REUSABLE_COMPONENTS","UNRESOLVED_DESIGN_ISSUES","READY_FOR_VERTICAL_SLICE"]:
        lines += [f"{key} = {m['audit'][key]}", ""]
    spaced = []
    for line in lines:
        if line.startswith("**") and spaced and spaced[-1]:
            spaced.append("")
        spaced.append(line)
    return "\n".join(spaced)


def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument("command", choices=["build","audit"])
    args=parser.parse_args()
    if args.command=="build":
        if TARGET.exists() and "visualization_audit" in read_json(TARGET):
            raise ValueError("F04.1 già presente: build F04 sovrascriverebbe l'audit 2D/3D. Usare pipeline.introduction_visualization_audit audit.")
        manifest=make_manifest()
        result=audit(manifest)
        if not result["ok"]:
            raise ValueError("\n".join(result["errors"]))
        manifest["audit"]=result
        write_json(TARGET,manifest)
        write_json(AUDIT,result)
        DOC.write_text(render_doc(manifest),encoding="utf-8")
    else:
        manifest=read_json(TARGET)
        result=audit(manifest)
        result["persisted_audit_matches"]=result==manifest["audit"]
        if not result["persisted_audit_matches"]:
            result["errors"].append("Audit persistito non allineato.")
            result["ok"]=False
    print(json.dumps({k:result[k] for k in ["ok","DESIGNED_PAGES","COMPANION_SUBPAGES","INTERACTIVE_PAGES","STATIC_PAGES","REUSABLE_COMPONENTS","UNRESOLVED_DESIGN_ISSUES","READY_FOR_VERTICAL_SLICE","errors"]},ensure_ascii=False,indent=2))
    return 0 if result["ok"] else 1


if __name__=="__main__":
    raise SystemExit(main())
