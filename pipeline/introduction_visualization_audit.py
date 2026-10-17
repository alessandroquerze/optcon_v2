"""F04.1: extend existing design, preserve every F04 field, audit sources read-only."""
from __future__ import annotations

import argparse
from copy import deepcopy
import json
import math
from pathlib import Path

from .common import ROOT, read_json, sha256_file, write_json
from .source_warning_policy import object_hash, review_summary
from .introduction_visualization_decisions import DECISIONS, COMPONENTS, ASSESSMENT

DATA=ROOT/"Data"
MANIFEST=DATA/"introduction_companion_manifest.json"
DESIGN=ROOT/"Docs"/"INTRODUCTION_COMPANION_DESIGN.md"
REPORT=ROOT/"Docs"/"F04_1_VISUALIZATION_AUDIT.md"
BASELINE=DATA/"reviews"/"introduction_companion_f04_baseline.json"
AUDIT=DATA/"reports"/"introduction_visualization_audit.json"
GRAPHICS="FULL_2D_AND_3D_SUPPORT"
POLICY="Prefer 3D or combined 2D/3D whenever a meaningful third mathematical dimension exists; avoid it only when it would be irrelevant or misleading."
MODES=["NONE","2D_ONLY","3D_PRIMARY","2D_PRIMARY_WITH_3D","3D_PRIMARY_WITH_2D","2D_AND_3D_EQUAL"]
SUMMARY_KEYS=["PAGES_2D_ONLY","PAGES_3D_PRIMARY","PAGES_2D_PRIMARY_WITH_3D","PAGES_3D_PRIMARY_WITH_2D",
              "PAGES_2D_AND_3D_EQUAL","PAGES_WITH_NO_VISUALIZATION","PAGES_GAINING_3D_AFTER_AUDIT",
              "PAGES_GAINING_INTERACTIVITY_AFTER_AUDIT","REUSABLE_VISUALIZATION_COMPONENTS",
              "UNRESOLVED_VISUALIZATION_ISSUES","GRAPHICS_REQUIREMENT","READY_FOR_F05"]

TWO_D_AXES={
    8:["t [s]","x(t) [state unit]"],9:["x_t [state unit]","x_next [state unit]"],
    11:["x_e [state unit]","u_e [input unit]"],12:["Δx [1]","Δx_next [1]"],
    14:["z₁ [1]","z₂ [1]"],15:["z [1]","ℓ(z) [normalized cost]"],
    16:["z₁ [1]","z₂ [1]"],17:["z₁ [1]","z₂ [1]"],18:["z [1]","ℓ(z) [normalized cost]"],
    19:["x₁ [state unit]","x₂ [state unit]"],20:["contributo di costo","valore normalizzato"],
    21:["u₀ [input unit]","u₁ [input unit]"],22:["u₀ [input unit]","x₁ [state unit]"],
    23:["u₀ [input unit]","u₁ [input unit]"],24:["t [step]","y_t [state unit]"],
    25:["u₀ [input unit]","ℓ(u₀,u₀) [normalized cost]"],
    26:["p_x,p_y [m], schema fisico planare","p̈_x,p̈_y [m/s²], vettori su scala separata"],
    27:["τ [s]","p_y [m] / v_y [m/s], tracce distinte"],
    28:["τ [s]","p_y [m] / v_y [m/s], tracce distinte"],
    29:["e_px [normalized error]","θ [rad]"],
    30:["p_y [m], asse verticale","nessun secondo asse quantitativo; residui [m] in lettura numerica"],
    31:["t [s]","x(t) [state unit] / u(t) [state unit/s], tracce distinte"],
    32:["t [s]","x(t) [state unit] / u(t) [state unit/s], tracce distinte"],
    33:["θ [rad]","ẋ₂ [rad/s²]"],34:["θ_e [rad]","u_e [N m]"],
    35:["t [s]","x₁des [rad] / udes [N m], tracce distinte"],
    36:["t [s]","running cost [normalized cost]"]
}


def capture_baseline():
    if BASELINE.exists():
        return read_json(BASELINE)
    original=read_json(MANIFEST)
    if "visualization_audit" in original:
        raise ValueError("Baseline F04 mancante: non ricostruirla da un manifest già aggiornato.")
    f03=read_json(DATA/"reviews"/"introduction_source_warning_baseline.json")
    protected=deepcopy(f03["immutable_files"])
    for path in (DATA/"documents").glob("*/pages/*/page_spec.json"):
        protected[path.relative_to(ROOT).as_posix()]=sha256_file(path)
    for relative in [
        "Docs/INTRODUCTION_SOURCE_WARNING_REVIEW.md",
        "Data/reports/page_analysis_introduction.json",
        "Data/reports/introduction_companion_design_audit.json",
        "Analysis/introduction/source_warning_decisions.json",
        "pipeline/source_warning_policy.py",
        "pipeline/introduction_warning_decisions.py",
        "schemas/source-warning.schema.json"
    ]:
        path=ROOT/relative
        if path.exists():
            protected[relative]=sha256_file(path)
    baseline=dict(version="1.0.0",phase="F04 snapshot before F04.1",
                  manifest=original,manifest_sha256=sha256_file(MANIFEST),
                  design_doc=DESIGN.read_text(encoding="utf-8"),design_doc_sha256=sha256_file(DESIGN),
                  protected_files=protected)
    write_json(BASELINE,baseline)
    return baseline


def inherited_subset(original, updated, path="$"):
    """Additions are permitted; replacement/removal of ANY F04 value is not."""
    errors=[]
    if isinstance(original,dict):
        if not isinstance(updated,dict):
            return [path+": oggetto sostituito"]
        for key,value in original.items():
            if key not in updated:
                errors.append(path+"/"+key+": campo F04 rimosso")
            else:
                errors.extend(inherited_subset(value,updated[key],path+"/"+key))
    elif isinstance(original,list):
        if not isinstance(updated,list) or len(original)!=len(updated):
            return [path+": lista F04 sostituita o troncata"]
        for i,(a,b) in enumerate(zip(original,updated)):
            errors.extend(inherited_subset(a,b,path+f"/{i}"))
    elif original!=updated:
        errors.append(path+": valore F04 modificato")
    return errors


def requirements(n,p):
    d=DECISIONS[n]
    enabled="3D" in d["mode"]
    combined=enabled and d["mode"]!="3D_PRIMARY"
    original_ids=[c["id"] for c in p["controls"]]
    new_ids=[c["id"] for c in d["controls"]]
    parameter_ids=original_ids+new_ids
    axes=deepcopy(d["axes"])
    semantics=dict(
        xAxis=axes[0] if axes else None,yAxis=axes[1] if axes else None,zAxis=axes[2] if axes else None,
        zMeaning=d["definition"],
        derivedDimension=bool(enabled and not d.get("geometry",False)),
        derivedDimensionDefinition="True = coordinata ottenuta da funzione, residuo o embedding in spazio tempo/stato/ingresso; non una nuova posizione fisica.",
        coordinateSpace="illustrative_spatial_geometry" if d.get("geometry") else "mathematical_embedding" if enabled else "symbolic_or_2d",
        physicalStateDimensionAdded=False,physicalModelChanged=False,
        explanation=d["reason"],mathematicalDefinition=d["definition"],
        provenance="enrichment: riusa il modello/esempio F04 o introduce una geometria/famiglia didattica esplicitamente definita.",
        sourceNotationPolicy="Simboli del corso invariati nei campi F04; nomi di assi/errori/fixture nuovi dichiarati enrichment.")
    surface=dict(enabled=d["surface"], renderModes=["surface","wireframe","mesh"] if d["surface"] else [],
                 formula=d["definition"] if d["surface"] else None,
                 dataPolicy="Stessa funzione per mesh, tooltip, contorni e sezione; mai valutare source_literal.",
                 discontinuities="Mesh separate ai salti; nessuna superficie interpolata attraverso t=1." if n==36 else "Includere t=1 nella mesh e conservare la piega dello stato; ingresso a rami disgiunti, secondo valore a t=1." if n==32 else "Trattare i casi degeneri senza cambiare i valori matematici.",
                 contourProjection="Nel dominio di base, solo se sono livelli di questa funzione e non superfici di altri esempi.")
    trajectory=dict(enabled=d["trajectory"], definition=d["definition"] if d["trajectory"] else None,
                    kind="geometric_paths" if n==6 else "equilibrium_locus_not_motion" if n==34 else "desired_reference_not_motion" if n==35 else "cost_trace_of_fixed_candidate" if n==36 else "time_indexed_state_or_output",
                    interpolation="Segmenti disgiunti e marcatori aperto/chiuso; nessun salto animato del corpo." if n==35 else "Rami disgiunti a t=1; nessuna rampa interpolata del costo o dell'errore fra i due rami." if n==36 else "Punti campionati e guide dichiarate per dati discreti; nessuna integrazione implicita.",
                    currentPoint="Cursore temporale condiviso" if n in [24,27,28] else "Punto o coppia corrente definito dai controlli della pagina")
    return dict(
        visualizationMode=d["mode"], visualizationSemantics=semantics,
        modeRationale=d["reason"], rejected3DAlternative=d["alternative_considered"],
        threeDRequirements=dict(
            enabled=enabled,
            cameraControls=["orbit","zoom","pan","reset_camera"] if enabled else [],
            coordinateReadout=enabled,tooltip=enabled,highlightCurrentPoint=enabled,
            realtimeParameters=parameter_ids if enabled else [],
            parameterEffects=deepcopy(d["bindings"]),
            surface=surface,trajectory=trajectory,
            discontinuityHandling=dict(
                breakpoints=["T/2"] if n==35 else [1] if n in [32,36] else [],
                connectAcrossBreaks=False if n in [35,36] else True,
                rightBranchIncludesBreakpoint=n in [32,35,36],
                appliesTo="reference_curve" if n==35 else "running_cost_surface_and_cost_trace_only_not_physical_state" if n==36 else "input_jumps_state_continuous_with_kink" if n==32 else "no_breakpoints"),
            vectors=dict(enabled=False,reason="Nessun campo vettoriale 3D aggiunto senza una necessità della pagina; overlay nativo richiesto all'astrazione comune."),
            planes=deepcopy(d["planes"]),projections=deepcopy(d["projections"]),
            animation=dict(enabled=d["animation"],kind="paused_temporal_playback" if d["animation"] else "none",
                           semantics="Ispeziona i campioni Euler e il riferimento allo stesso τ; non interpola uno stato fisico aggiuntivo." if d["animation"] else "Nessuna animazione senza contenuto temporale utile.",
                           controls=["play_pause","time_scrub","restart"] if d["animation"] else [],
                           onParameterChange="Pausa, ricostruisci dati, torna a τ=0." if d["animation"] else None)),
        twoDRequirements=dict(enabled=d["mode"]!="3D_PRIMARY" and d["mode"]!="NONE",
                              plotType=d["plot2d"],axes=TWO_D_AXES.get(n,[]),
                              realtimeParameters=parameter_ids,
                              projectionOf3D=bool(combined and n not in [20,26]),
                              relationshipTo3D="Sezione/proiezione sincronizzata oppure lettura derivata dello stesso dataset; i contributi al costo non sono una proiezione geometrica." if combined else "Schema/lettura 2D indipendente; nessuna profondità fittizia.",
                              preserveF04Readout=True),
        presentation=dict(
            strategy=d["presentation"],
            defaultView="3D" if d["mode"] in ["3D_PRIMARY","3D_PRIMARY_WITH_2D"] else "2D",
            toggle=["2D","3D"] if combined else [],
            sameDataAndParameters=True,
            comparisonPolicy="Toggle nello stesso MAIN_VISUAL; le proiezioni/contorni possono comparire nella scena 3D. Nessun doppio canvas illeggibile a 720 px." if combined else "Singola vista principale; contesto e formule F04 restano visibili.",
            simultaneousOverlays=deepcopy(d["projections"]) if combined else [],
            layoutImpact="Riusa il budget MAIN_VISUAL F04; nessuna subpage. Barra modalità/camera massimo 32 px dentro il blocco. Se non entra, usa toggle e letture testuali, non riduzione dei caratteri.",
            uiBoundary="Nomi degli assi e badge Esempio aggiunto visibili; motivazioni tecniche e discussioni editoriali restano nei metadata.",
            camera=dict(projection="perspective" if n==6 else "orthographic",
                        initialAzimuthDeg=35,initialElevationDeg=28,resetOnlyCamera=True,
                        unitsWarning="Assi con unità diverse: nessuna distanza euclidea o angolo della scena presentato come invariante fisica.",
                        zeroRangePolicy="Espandi solo la finestra della camera, mai coordinate, costo o residuo nulli.")),
        auditControls=deepcopy(d["controls"]),
        additionalInvariants=deepcopy(d["invariants"]),additionalEdgeCases=deepcopy(d["edge_cases"]),
        additionalEnrichment=deepcopy(d["new_math"]),
        reusableVisualizationComponents=deepcopy(d["components"]),
        revisionPrecedence="Questi campi F04.1 governano le viste. visualization.mode/design e interaction.enabled rimangono la baseline storica F04; interaction.effective_enabled è lo stato attuale."
    )


def extend(baseline):
    m=deepcopy(baseline["manifest"])
    for p in m["pages"]:
        n=p["source_page"]
        p["visualization"].update(requirements(n,p))
        p["interaction"]["effective_enabled"]=p["interaction"]["enabled"] or DECISIONS[n]["gain"]
        p["interaction"]["audit_f04_1_purpose"]=DECISIONS[n]["reason"]
        p["interaction"]["effective_control_ids"]=[c["id"] for c in p["controls"]]+[c["id"] for c in DECISIONS[n]["controls"]]
    components=deepcopy(COMPONENTS)
    original_to_new={old:c["name"] for c in components for old in c["replaces"]}
    for c in components:
        c["usedOnPages"]=[p["source_page"] for p in m["pages"] if
                         c["name"] in p["visualization"]["reusableVisualizationComponents"]
                         or any(original_to_new.get(old)==c["name"] for old in p["reusable_components"])]
        c["status"]="DESIGNED_NOT_IMPLEMENTED"
    m["current_design_phase"]="F04.1 — 2D/3D VISUALIZATION AUDIT"
    m["GRAPHICS_REQUIREMENT"]=GRAPHICS
    m["3D_VISUALIZATION_POLICY"]=POLICY
    m["visualization_architecture"]=dict(
        canonicalComponents=components,canonicalVisualizationComponentCount=len(components),
        assessment=[dict(requested=k,canonicalDesign=v) for k,v in ASSESSMENT.items()],
        aliasesSupersedeF04Deferrals=["StateSpacePlot","TrajectoryPlot","ContinuousVsDiscrete","LinearizationVisualizer","StepSimulation"],
        nonVisualizationComponentsRetained=["EquationCard","WarningBanner","InfoNote","ParameterControl"],
        singleModelManyViews="Il modulo matematico produce un dataset versionato condiviso. Camera, superficie, contorno e proiezioni non hanno copie indipendenti delle formule.",
        cameraVsMath="Orbit/zoom/pan/reset camera cambiano solo la vista. Slider e selettori matematici aggiornano dati, marker e sezioni secondo parameterEffects.",
        noMetricAssumption="Una scena con costo, velocità o coppia come terzo asse è uno spazio di quantità etichettate, non uno spazio fisico euclideo.",
        preservedF04Inventory="component_inventory e requested_component_assessment restano storici. Questo inventario è quello effettivo per F05.",
        dataProtocol=dict(required=["coordinate_semantics","units","domains","value_samples_or_functions","discontinuity_segments","selected_point_id","projection_maps","formula_provenance","calculation_policy"],
                          noFormulaEvaluationFromTranscription=True,sharedSelection=True),
        f05Requirements=[
            "Selezionare uno stack grafico con 2D e 3D nativi già nella vertical slice: superfici, mesh, curve, campi vettoriali e proiezioni collegate.",
            "Verificare orbit/zoom/pan/reset, picking, tooltip e coordinate con unità; alternative da tastiera e tabella numerica.",
            "Unico dato matematico per tutte le viste, incluse geometrie degeneri e discontinuità senza interpolazione artificiale.",
            "Aggiornamenti dei controlli in tempo reale con invalidazione delle sole superfici o selezioni coinvolte; nessun ottimo ricalcolato per le candidate fisse.",
            "F03 obbligatoria in ogni modalità; il PDF a sinistra resta originale.",
            "F05 deve motivare la scelta dello stack con prove locali dei casi p12,p16,p17,p27,p30,p34; non rinviare il 3D a una fase futura.",
            "Misurare fluidità e uso memoria sul dispositivo target; smaltire risorse 3D al cambio pagina, testare ridimensionamento e perdita/ripristino del contesto grafico.",
            "Se il 3D non è disponibile, mostrare spiegazione e alternativa 2D/accessibile; questo fallback non soddisfa da solo il gate FULL_2D_AND_3D_SUPPORT.",
            "Nessun renderer o stack viene installato o implementato durante F04.1."
        ],
        acceptanceTests=[
            "P16: in 2D/3D il punto (1,1) ha costo 2.5; cambiare w₂ modifica solo il secondo peso.",
            "P12: superficie e piano danno .21 e .2 a (.1,0), errore .01; la sezione 2D coincide.",
            "P17: campitura g≤0 coincide con la proiezione della superficie sotto zero, anche nei casi degeneri.",
            "P27: Euler a δ=.1 dà quota .9855 e velocità 2.19 a 1 s; stesso cursore in 2D/3D.",
            "P30: min>max produce sezione vuota e warning indici resta visibile, senza u_T.",
            "P34: curva con x₂,e=0 e punto (π/6,0,4.905), due residui dinamici nulli.",
            "Toggle/camera non cambiano alcun risultato numerico o formula; nessuna modifica al PDF o ai PAGE_SPEC.",
            "Nessuna mesh attraversa il salto di p36 e nessun segmento di p35 simula un trasferimento fisico."
        ])
    m["visualization_vertical_slice_impact"]=[
        dict(source_page=s["source_page"],visualizationMode=DECISIONS[s["source_page"]]["mode"],
             preservesF04Selection=True,extension=DECISIONS[s["source_page"]]["reason"],
             acceptance="Aggiungere equivalenza 2D/3D, controlli camera e semantica degli assi ai criteri F04." if "3D" in DECISIONS[s["source_page"]]["mode"] else "Confermare il caso 2D/simbolico senza profondità decorativa.")
        for s in m["proposed_vertical_slice"]]
    return m


def numerical_oracles():
    """Independent arithmetic of the proposed embeddings; not plot/simulation code."""
    a=math.pi/6
    cases=[
        ("p06_closed_roof_boundary_height",2-2,0),
        ("p08_t1_u1",1-math.exp(-1),.6321205588285577),
        ("p09_first_transition",.8*1+.2,1),
        ("p11_zero_residual",.5*2-1,0),
        ("p12_surface",2*.1+.1**2+0,.21),
        ("p12_tangent_plane",2*.1+0,.2),
        ("p12_gap",.1**2,.01),
        ("p14_cost",.5*(.5**2+.5**2),.25),
        ("p14_equality",.5+.5-1,0),
        ("p14_inequality",-.5,-.5),
        ("p16_corrected_surface",.5*1*1**2+.5*4*1**2,2.5),
        ("p16_zero_weights",0*1**2+0*1**2,0),
        ("p17_origin_g",0+0-1,-1),
        ("p17_boundary_g",1+0-1,0),
        ("p18_active_minimum_cost",.5*(min(2,1)-2)**2,.5),
        ("p19_second_dynamic_residual",1-.5-.8,-.3),
        ("p20_surface_default",.625*1+.125*1+.125*4,1.25),
        ("p21_boundary_residual",.5+.5-1,0),
        ("p22_candidate_height",.5*.5**2+.5*(.5-1)**2,.25),
        ("p23_optimum_height",.5*(.5**2+.5**2),.25),
        ("p24_middle_error",1-2,-1),
        ("p24_terminal_error",2-2,0),
        ("p25_optimum",1/(1+1),.5),
        ("p26_hover_vertical", (4.905+4.905)*math.cos(0)-9.81,0),
        ("p27_euler_altitude",2.19*.1**2*10*9/2,.9855),
        ("p27_euler_velocity",2.19*10*.1,2.19),
        ("p27_exact_altitude",1.095*1**2,1.095),
        ("p28_altitude_error",.9855-1.095,-.1095),
        ("p28_velocity_error",2.19-2.19,0),
        ("p29_stage_surface",.5*2*1**2+.5*10*.1**2+2*.5+2*.5,3.05),
        ("p30_valid_residual",max(1-2,2-3),-1),
        ("p30_boundary_residual",max(1-3,3-3),0),
        ("p30_violation_residual",max(1-3.2,3.2-3),.2),
        ("p30_inverted_bounds_minimum_residual",max(3-2,2-1),1),
        ("p31_family_endpoint",1*1,1),
        ("p31_functional",.5*1**2*1+.5*1**2*1**2,1),
        ("p32_left_at_switch",1*1,1),
        ("p32_right_at_switch",1+(-1)*(1-1),1),
        ("p32_endpoint",1+(-1)*(2-1),0),
        ("p33_acceleration_surface",-9.81*math.sin(a)+0,-4.905),
        ("p34_equilibrium_input",9.81*math.sin(a),4.905),
        ("p34_velocity_coordinate",0,0),
        ("p34_second_dynamic_residual",-9.81*math.sin(a)+4.905,0),
        ("p35_second_branch_input",9.81*math.sin(a),4.905),
        ("p36_running_cost_right",a*a+.1*4.905**2,2.680058177808038),
        ("p36_terminal_separate",2*a*a,.5483113556160754),
        ("p36_total_no_half",a*a+.1*4.905**2+2*a*a,3.228369533424113)
    ]
    return [dict(id=k,computed=x,expected=y,ok=abs(x-y)<1e-9,tolerance=1e-9) for k,x,y in cases]


def audit(m,baseline):
    errors=[];checks={}
    def check(key,ok,detail):
        checks[key]=dict(ok=bool(ok),detail=detail)
        if not ok:
            errors.append(key+": "+detail)
    inherited=inherited_subset(baseline["manifest"],m)
    check("f04_preserved_additively",not inherited,"Nessun valore F04 rimosso o sostituito; "+str(len(inherited))+" differenze.")
    if inherited:
        errors.extend(inherited[:10])
    pages=m["pages"]
    check("physical_coverage",[p["source_page"] for p in pages]==list(range(1,37)),"36 pagine distinte nell'ordine fisico.")
    check("one_to_one",all(p["companionPageCount"]==1 and not p["subpages"] for p in pages),"Mapping e sottopagine F04 immutati.")
    original_pages={p["source_page"]:p for p in baseline["manifest"]["pages"]}
    policy_unchanged=(m["warning_handling"]==baseline["manifest"]["warning_handling"] and
                      all(p["source_warning"]==original_pages[p["source_page"]]["source_warning"] and
                          p["computation_contract"]==original_pages[p["source_page"]]["computation_contract"] for p in pages))
    check("f03_warning_and_calculation_contracts_exact",policy_unchanged,"Policy, testi UI, correzioni e contratti di calcolo F04/F03 conservati integralmente, senza nuove issue.")
    check("mode_partition",all(p["visualization"].get("visualizationMode") in MODES for p in pages),"Una modalità valida per pagina.")
    for p in pages:
        n=p["source_page"];v=p["visualization"];d=DECISIONS[n]
        three="3D" in v["visualizationMode"]
        s=v["visualizationSemantics"];req=v["threeDRequirements"]
        check(f"p{n:02d}_semantics", bool(s["explanation"]) and (all(s[k] is not None and all(x in s[k] for x in ["symbol","unit","role","domain"]) for k in ["xAxis","yAxis","zAxis"]) and bool(s["mathematicalDefinition"]) if three else s["zAxis"] is None and bool(v["rejected3DAlternative"])), "Assi, unità, dominio e definizione espliciti oppure rifiuto motivato del 3D.")
        check(f"p{n:02d}_no_new_physical_states",not s["physicalStateDimensionAdded"] and not s["physicalModelChanged"],"L'embedding non modifica il modello fisico.")
        old_ids=[c["id"] for c in p["controls"]]
        added=v["auditControls"]
        ids=old_ids+[c["id"] for c in added]
        if three:
            check(f"p{n:02d}_parameter_effects",set(req["parameterEffects"])==set(ids) and all(req["parameterEffects"][k] for k in ids),"Effetto esplicito per ogni parametro matematico, nuovo o ereditato.")
            check(f"p{n:02d}_camera",req["cameraControls"]==["orbit","zoom","pan","reset_camera"] and req["tooltip"] and req["coordinateReadout"],"Controlli nativi, coordinate e tooltip obbligatori.")
        check(f"p{n:02d}_controls",len(ids)==len(set(ids)) and all(c["min"]<=c["default"]<=c["max"] and c["effect"] and c["origin"]=="enrichment" for c in added),"Nuovi controlli con dominio, default ed effetto, distinti dai controlli F04.")
        check(f"p{n:02d}_effective_interaction",p["interaction"]["effective_enabled"]==(p["interaction"]["enabled"] or bool(added)),"Interattività effettiva distinta dalla classificazione storica.")
        if 26<=n<=30:
            check(f"p{n:02d}_planar_model",s["coordinateSpace"]=="mathematical_embedding" and "p_z" not in json.dumps(s,ensure_ascii=False),"Il drone planare non acquisisce una coordinata fuori piano.")
        if n in [35,36]:
            breaks=req["discontinuityHandling"]
            check(f"p{n:02d}_no_interpolation_across_jump",not breaks["connectAcrossBreaks"] and breaks["rightBranchIncludesBreakpoint"],"Riferimento/errore/costo restano a rami disgiunti, senza salto fisico inventato.")
        if three:
            check(f"p{n:02d}_current_requirements",v["visualizationMode"]==d["mode"] and s["mathematicalDefinition"]==d["definition"],"Modalità e formula coincidono con le decisioni editoriali versionate.")
    protected_errors=[path for path,sha in baseline["protected_files"].items() if not (ROOT/path).is_file() or sha256_file(ROOT/path)!=sha]
    check("immutable_source_and_policy",not protected_errors,f"{len(baseline['protected_files'])} file protetti inclusi 137 PAGE_SPEC completi e policy F03; differenze={protected_errors}.")
    source_review=review_summary(DATA)
    check("f03_gate",not source_review["errors"] and source_review["READY_FOR_COMPANION_DESIGN"]=="YES","Policy F03 ancora valida; nessun flag storico reinterpretato come nuova issue.")
    check("native_graphics_requirement",m["GRAPHICS_REQUIREMENT"]==GRAPHICS and m["3D_VISUALIZATION_POLICY"]==POLICY,"Supporto nativo 2D e 3D vincolante per F05.")
    names=[c["name"] for c in m["visualization_architecture"]["canonicalComponents"]]
    check("component_inventory",len(names)==len(set(names))==9 and all(set(p["visualization"]["reusableVisualizationComponents"])<=set(names) for p in pages),"9 astrazioni visuali canoniche; alias e composizioni non duplicano componenti.")
    check("requested_component_assessment",len(m["visualization_architecture"]["assessment"])==15,"Tutte le 15 proposte 2D/3D valutate.")
    check("vertical_slice_preserved",[x["source_page"] for x in m["proposed_vertical_slice"]]==[2,8,12,16,17,27,30,34],"Stesse 8 pagine F04, estese con i casi 3D.")
    fixtures=numerical_oracles()
    check("embedding_numeric_oracles",all(c["ok"] for c in fixtures),f"{sum(c['ok'] for c in fixtures)}/{len(fixtures)} fixture; nessuna mesh o simulazione implementata.")
    def page_list(mode):
        return [p["source_page"] for p in pages if p["visualization"]["visualizationMode"]==mode]
    gains=[p["source_page"] for p in pages if "3D" in p["visualization"]["visualizationMode"]]
    interactions=[p["source_page"] for p in pages if not p["interaction"]["enabled"] and p["interaction"]["effective_enabled"]]
    design_without_audit=deepcopy(m)
    design_without_audit.pop("visualization_audit",None)
    return dict(ok=not errors,phase="F04.1",checks=checks,errors=errors,numerical_checks=fixtures,
                generated_design_sha256=object_hash(design_without_audit),
                PAGES_2D_ONLY=page_list("2D_ONLY"),PAGES_3D_PRIMARY=page_list("3D_PRIMARY"),
                PAGES_2D_PRIMARY_WITH_3D=page_list("2D_PRIMARY_WITH_3D"),
                PAGES_3D_PRIMARY_WITH_2D=page_list("3D_PRIMARY_WITH_2D"),
                PAGES_2D_AND_3D_EQUAL=page_list("2D_AND_3D_EQUAL"),PAGES_WITH_NO_VISUALIZATION=page_list("NONE"),
                PAGES_GAINING_3D_AFTER_AUDIT=gains,PAGES_GAINING_INTERACTIVITY_AFTER_AUDIT=interactions,
                REUSABLE_VISUALIZATION_COMPONENTS=len(names),UNRESOLVED_VISUALIZATION_ISSUES=len(errors),
                GRAPHICS_REQUIREMENT=GRAPHICS,READY_FOR_F05="NO" if errors else "YES",
                pages_with_3d=len(gains),effective_interactive_pages=sum(p["interaction"]["effective_enabled"] for p in pages),
                effective_static_pages=sum(not p["interaction"]["effective_enabled"] for p in pages),
                source_warning_pages_unchanged=policy_unchanged,
                limitations=["Verifica editoriale, strutturale e aritmetica; non prova di rendering, performance o usabilità 3D.",
                             "Scelta dello stack e implementazione sono attività F05; non eseguite da questo audit."],
                baseline_reference=BASELINE.relative_to(ROOT).as_posix(),
                historical_f04_fields="Tutti preservati, inclusi audit F04, inventario e flag statico/interattivo originari.",
                effective_fields="visualization.visualizationMode e relativi Requirements; interaction.effective_enabled; visualization_architecture.")


def fmt(value):
    return str(value).replace("|","∣").replace("\n"," ")


def render_report(m):
    r=m["visualization_audit"]
    lines=["# F04.1 — 2D/3D Visualization Audit","",
           "Estensione del design F04 già completo: 36 pagine riesaminate, nessuna riprogettazione delle spiegazioni o modifica del mapping. Le 27 pagine con 3D usano una quantità esplicitamente definita; 5 pagine prima statiche acquistano interazioni didattiche.",
           "PDF, testo, immagini, tutti i PAGE_SPEC e policy F03 rimangono immutabili. Nessun componente, grafico, simulatore o frontend è implementato.","",
           "## 1. VISUALIZATION PHILOSOPHY","",
           "Il 3D è una capacità nativa e una scelta normale per superfici, residui, relazioni fra stato e ingresso e embedding temporali. La terza coordinata può essere un valore matematico o uno stato già esistente: non occorre inventare un'altra direzione fisica.",
           "Le decisioni F04 sono conservate integralmente. Nei campi nuovi le viste attuali prevalgono sui precedenti rinvii di StateSpacePlot/TrajectoryPlot e sulla scelta originaria statica delle pagine 6,14,24,28,32. Il loro contenuto ed esempio restano disponibili.",
           "Le 6 modalità sono alternative di presentazione, non tipi di modello. 2D_ONLY include mappe simboliche e tabelle; quindi non c'è alcuna pagina NONE: tutte le 36 avevano già almeno una rappresentazione nel design F04.",
           "Tutte le nuove geometrie, famiglie parametriche e coordinate derivate sono enrichment. Il badge Esempio aggiunto e il significato degli assi sono visibili; le motivazioni tecniche non entrano nella UI.",
           "La camera non altera i dati. Unità diverse su assi diversi non definiscono una distanza fisica euclidea: evitare deduzioni da inclinazioni prospettiche o rapporti visivi fra unità.","",
           "## 2. PAGE-BY-PAGE 2D/3D DECISIONS","",
           "| Pagina | Modalità | Interattività F04 → attuale | Decisione e scopo |","| ---: | --- | --- | --- |"]
    for p in m["pages"]:
        v=p["visualization"]
        status=f"{'sì' if p['interaction']['enabled'] else 'no'} → {'sì' if p['interaction']['effective_enabled'] else 'no'}"
        lines.append(f"| {p['source_page']} | {v['visualizationMode']} | {status} | {fmt(v['modeRationale'])} |")
    lines+=["","Casi mantenuti 2D e alternativa 3D valutata:",""]
    for p in m["pages"]:
        v=p["visualization"]
        if v["rejected3DAlternative"]:
            lines.append(f"- Pagina {p['source_page']}: {v['rejected3DAlternative']}")
    lines+=["","## 3. MEANING OF THIRD DIMENSION","",
            "| Pagina | Assi x; y; z (unità) | Definizione e significato |","| ---: | --- | --- |"]
    for p in m["pages"]:
        v=p["visualization"]
        if "3D" in v["visualizationMode"]:
            s=v["visualizationSemantics"]
            axes="; ".join(s[k]["symbol"]+" ["+s[k]["unit"]+"]" for k in ["xAxis","yAxis","zAxis"])
            lines.append(f"| {p['source_page']} | {fmt(axes)} | {fmt(s['mathematicalDefinition'])} |")
    lines+=["",
            "La pagina 6 usa un ambiente geometrico 3D esplicitamente assegnato come esempio: non un modello dinamico nuovo. Le pagine 26–30 mantengono il drone planare: p26 usa l'accelerazione come quota; p27/p28 tempo, quota e velocità esistente; p29 il costo; p30 il residuo. Nessuna coordinata p_z o dinamica fuori piano.",
            "P19 mostra candidati nello spazio delle decisioni, non tutte traiettorie. P31/p32 mostrano famiglie finite dentro uno spazio di funzioni, non una dimostrazione globale di manifold. P34 mostra un luogo di equilibri, non un trasferimento. P35 mostra riferimenti discontinui: i segmenti non sono raccordati come moto fisico. P36 separa lo stato costante dal salto del costo/riferimento.","",
            "## 4. 2D/3D COMBINED VIEWS","",
            "Un toggle 2D | 3D usa lo stesso MAIN_VISUAL nelle pagine combinate: parametri, selezione e numeri persistono cambiando vista. I due pulsanti hanno pari rilievo nelle pagine 2D_AND_3D_EQUAL. Le modalità primary indicano la vista iniziale. P6 usa una scena 3D principale, senza un secondo grafico 2D ridondante.",
            "Le sovrapposizioni simultanee sono matematiche: contorni, piani zero, sezioni e marker nella stessa scena. Le letture numeriche restano visibili. Non si aggiungono due canvas piccoli a scapito di formule o warning. Il budget F04 resta il vincolo: barra modalità/camera entro 32 px nel blocco visuale.",
            "Orbit, zoom, pan, reset camera, tooltip e coordinate sono requisiti di tutte le 27 viste 3D. Surface/wireframe/mesh sono modalità dello stesso oggetto. Sezioni e contour projection compaiono solo dove definiti; gradienti e frecce non vengono aggiunti senza uno scopo.",
            "L'unico playback nuovo è p27: pausa iniziale, play/pause, cursore temporale e restart ispezionano i campioni già definiti. P35 non anima salti del pendolo; p34 non inventa una traiettoria di trasferimento.",""]
    for p in m["pages"]:
        v=p["visualization"]
        if "3D" not in v["visualizationMode"]:
            continue
        lines += [f"### Pagina {p['source_page']} — contratto delle viste","",
                  "**Presentazione:** "+v["presentation"]["strategy"]+"; iniziale "+v["presentation"]["defaultView"]+".",
                  "**2D:** "+v["twoDRequirements"]["plotType"]+".",
                  "**Superficie/traiettoria:** "+("superficie " if v["threeDRequirements"]["surface"]["enabled"] else "")+("curva/percorso " if v["threeDRequirements"]["trajectory"]["enabled"] else "")+".",
                  "**Piani/sezioni:** "+("; ".join(v["threeDRequirements"]["planes"]) or "Non necessari."),
                  "**Proiezioni/letture:** "+("; ".join(v["threeDRequirements"]["projections"]) or "Nessun grafico 2D aggiuntivo."),
                  "**Parametri e cambiamenti:**",""]
        controls={c["id"]:c for c in p["controls"]}
        controls.update({c["id"]:c for c in v["auditControls"]})
        for ident,effect in v["threeDRequirements"]["parameterEffects"].items():
            lines.append("- "+controls[ident]["symbol"]+": "+effect)
        if v["auditControls"]:
            lines+=["","**Nuovi controlli — enrichment:**",""]
            for c in v["auditControls"]:
                lines.append(f"- {c['symbol']}: [{c['min']},{c['max']}], default {c['default']} {c['unit']}"+("; intero." if c["integer"] else "."))
        lines+=["","**Invarianti e limiti:**",""]
        lines+=["- "+s for s in v["additionalInvariants"]+v["additionalEdgeCases"]]
        lines.append("")
    lines+=["## 5. COMPONENT INVENTORY UPDATE","",
            "9 componenti visuali canonici, oltre ai 4 componenti non visuali F04 EquationCard, WarningBanner, InfoNote e ParameterControl. La conta non somma alias, varianti 2D/3D o composizioni. L'inventario F04 resta storico; quello effettivo per F05 è visualization_architecture.",
            "FunctionExplorer riunisce FunctionPlot, ContourPlot e la parte grafica di ConstraintVisualizer. TrajectoryViewer assorbe TimeSeriesPlot e i plot di traiettoria/stato. ProjectionLink e SceneViewport forniscono sincronizzazione e camera condivise.","",
            "| Componente canonico | Responsabilità/contratto |","| --- | --- |"]
    for c in m["visualization_architecture"]["canonicalComponents"]:
        lines.append("| "+c["name"]+" | "+fmt(c["role"]+" "+c["contract"])+" |")
    lines+=["","Valutazione delle 15 proposte richieste:","","| Proposta | Astrazione/variante |","| --- | --- |"]
    for x in m["visualization_architecture"]["assessment"]:
        lines.append("| "+x["requested"]+" | "+fmt(x["canonicalDesign"])+" |")
    lines+=["",
            "I campi vettoriali 2D/3D sono una capacità nativa dell'astrazione e un criterio di scelta F05, anche se non vengono forzati nelle 36 pagine: dove un campo non è definito, non si inventano frecce o dinamiche.",
            "Protocollo dati comune: semantica/unità/domino di ciascun asse, funzione o campioni, segmenti discontinui, ID del punto selezionato, mappe di proiezione, provenienza e calculation_policy. Tutte le viste consumano gli stessi valori.","",
            "## 6. REQUIREMENTS FOR F05","",
            "GRAPHICS_REQUIREMENT = "+GRAPHICS,"",
            "3D_VISUALIZATION_POLICY = \""+POLICY+"\"",""]
    lines+=["- "+s for s in m["visualization_architecture"]["f05Requirements"]]
    lines+=["","Criteri di accettazione da eseguire nell'implementazione F05:",""]
    lines+=["- "+s for s in m["visualization_architecture"]["acceptanceTests"]]
    lines+=["",
            "F03 resta l'autorità: p16 superficie e contorni usano w₂ nel secondo termine; p30 separa indici input e quota; p34 usa x₂,e=0. Gli avvisi originali F03 rimangono adiacenti alle formule al cambio vista. P36 non riceve fattori ½. Nessun warning nuovo o discussione editoriale nella UI.","",
            "## 7. IMPACT ON VERTICAL SLICE","",
            "La selezione F04 rimane [2,8,12,16,17,27,30,34]. Include 7 pagine con 3D e una pagina simbolica 2D; tutte e tre le correzioni sono ancora coperte.","",
            "| Pagina | Modalità attuale | Estensione della verifica |","| ---: | --- | --- |"]
    for s in m["visualization_vertical_slice_impact"]:
        lines.append(f"| {s['source_page']} | {s['visualizationMode']} | {fmt(s['extension'])} |")
    lines+=["",
            "Le cinque nuove interazioni statiche sono test di espansione dopo la slice: geometria p6, punto ammissibile p14, ingresso del tracking p24, cursore requisiti p28, famiglia funzionale p32. Non si cambiano le otto pagine scelte per rifare F04.",
            f"Audit: {len(r['checks'])} controlli strutturali/editoriali, {len(r['numerical_checks'])} fixture aritmetici. {len(m['pages'])}/36 pagine; {r['pages_with_3d']}/36 con 3D; {r['effective_interactive_pages']} interattive e {r['effective_static_pages']} statiche nel design effettivo.",
            "Preservazione verificata: tutti i campi F04 sono un sottoinsieme esatto del manifest aggiornato; il Markdown F04 è conservato integralmente. Protetti byte per byte anche i 137 PAGE_SPEC e la policy F03. La baseline F04.1 registra hash e contenuto F04 precedenti.",
            "Questi controlli non sono una prova di rendering, performance o usabilità del futuro stack. READY_FOR_F05 significa audit di progetto risolto e requisiti pronti; la scelta dello stack e le prove grafiche sono compiti della fase successiva.",
            "Audit ripetibile: .venv/Scripts/python.exe -m pipeline.introduction_visualization_audit audit.",""]
    for key in SUMMARY_KEYS:
        lines += [f"{key} = {r[key]}",""]
    return "\n".join(lines)


def render_design_addendum(m):
    r=m["visualization_audit"]
    lines=["## F04.1 — Aggiornamento vincolante delle visualizzazioni","",
           "Questa sezione estende le sette sezioni F04 precedenti, conservate integralmente come baseline. Le decisioni seguenti prevalgono sulle precedenti scelte 2D e sui rinvii dei componenti di traiettoria/spazio di stato. Non si rifà F04.",
           "Report completo con significato degli assi, formule, controlli e casi limite: [F04_1_VISUALIZATION_AUDIT.md](F04_1_VISUALIZATION_AUDIT.md).",
           "Nel manifest sono effettivi visualization.visualizationMode/visualizationSemantics/threeDRequirements/twoDRequirements, interaction.effective_enabled e visualization_architecture. I campi e le metriche F04 precedenti rimangono storici.",
           "GRAPHICS_REQUIREMENT = "+GRAPHICS,"",
           "3D_VISUALIZATION_POLICY = \""+POLICY+"\"","",
           f"Supporto 3D progettato su {r['pages_with_3d']} pagine; interazioni aggiunte a {r['PAGES_GAINING_INTERACTIVITY_AFTER_AUDIT']}. Stato effettivo: {r['effective_interactive_pages']} interattive, {r['effective_static_pages']} statiche; 36 mapping 1:1 e zero nuove sottopagine.","",
           "| Pagina | Modalità | Terzo asse / motivo del 2D |","| ---: | --- | --- |"]
    for p in m["pages"]:
        v=p["visualization"];s=v["visualizationSemantics"]
        text=s["zAxis"]["symbol"]+" — "+s["zMeaning"] if s["zAxis"] else v["modeRationale"]
        lines.append(f"| {p['source_page']} | {v['visualizationMode']} | {fmt(text)} |")
    lines+=["","### Inventario effettivo per F05","",
            "9 astrazioni visuali canoniche: "+", ".join(c["name"] for c in m["visualization_architecture"]["canonicalComponents"])+". EquationCard, WarningBanner, InfoNote e ParameterControl rimangono condivisi.",
            "FunctionExplorer copre curve, contorni, superfici, residui, maschere e campi vettoriali 2D/3D. TrajectoryViewer copre serie temporali, xy/xyt/xyz e spazi di stato. Sezioni, piani tangenti e vincoli sono configurazioni, non componenti separati. ProjectionLink condivide selezioni e SceneViewport gestisce camera e coordinate.",
            "La selezione dello stack F05 deve includere 3D nativo già nella vertical slice, non come estensione futura; dettagli e criteri di accettazione nel report F04.1.","",
            "### Viste e layout","",
            "Le viste combinate usano un toggle 2D | 3D nello stesso MAIN_VISUAL. Contorni/proiezioni possono comparire nella scena; letture numeriche e warning restano visibili. Nessun pannello 3D aggiuntivo a scapito della leggibilità. Non cambia il mapping.",
            "Orbit, zoom, pan e reset camera sono distinti da modifica/reset dei parametri. Tooltip e coordinate hanno unità; camera e toggle non alterano dati o formule. Solo p27 ha playback temporale; p34 mostra equilibri, p35 riferimenti discontinui senza teletrasporto fisico.",
            "Il drone delle pagine 26–30 resta planare: la terza coordinata del grafico è accelerazione, velocità, costo o residuo. Il 3D geometrico illustrativo di p6 non è una nuova dinamica del veicolo.",
            "PDF, PAGE_SPEC e F03 intatti; superfici e simulazioni future useranno sempre le formule corrette. I limiti di layout e le verifiche nel browser rimangono gate F05.","",
            "### Impatto sulla vertical slice","",
            "Pagine confermate: 2,8,12,16,17,27,30,34. P2 verifica il caso simbolico 2D; p8 una famiglia di risposte; p12 superficie/piano tangente; p16 costo/contorni corretti; p17 superficie del vincolo; p27 traiettoria tempo–quota–velocità; p30 residuo e intervallo vuoto; p34 curva degli equilibri con velocità nulla.",
            "Audit F04.1: preservazione completa F04, fonti e PAGE_SPEC immutati, tutte le 36 decisioni presenti, assi/effetti dei parametri espliciti, 9 componenti visuali senza duplicazioni. Nessuna implementazione eseguita.",""]
    for key in SUMMARY_KEYS:
        lines += [f"{key} = {r[key]}",""]
    return "\n".join(lines)


def write_docs(m,baseline):
    notice="> Aggiornamento F04.1: il supporto nativo 2D/3D e le decisioni attuali sono nella sezione finale F04.1 e nel report collegato. Le sezioni F04 qui sotto sono conservate come baseline storica.\n\n"
    DESIGN.write_text(notice+baseline["design_doc"]+"\n\n"+render_design_addendum(m),encoding="utf-8")
    REPORT.write_text(render_report(m),encoding="utf-8")


def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument("command",choices=["apply","audit"])
    args=parser.parse_args()
    baseline=capture_baseline() if args.command=="apply" else read_json(BASELINE)
    if args.command=="apply":
        existing=read_json(MANIFEST)
        if "visualization_audit" in existing:
            # Do not silently overwrite any later manual additions/revisions.
            prior=deepcopy(existing)
            prior.pop("visualization_audit",None)
            recorded=existing["visualization_audit"].get("generated_design_sha256")
            expected_hash=recorded or object_hash(extend(baseline))
            if object_hash(prior)!=expected_hash:
                raise ValueError("Manifest divergente dalle decisioni F04.1 correnti: revisionare esplicitamente le differenze prima di riapplicare; nessun campo verrà scartato.")
        else:
            if object_hash(existing)!=object_hash(baseline["manifest"]):
                raise ValueError("Il manifest non coincide con la baseline F04.")
        m=extend(baseline)
        result=audit(m,baseline)
        if not result["ok"]:
            raise ValueError("\n".join(result["errors"]))
        m["visualization_audit"]=result
        write_json(MANIFEST,m);write_json(AUDIT,result);write_docs(m,baseline)
    else:
        m=read_json(MANIFEST);result=audit(m,baseline)
        expected_notice="> Aggiornamento F04.1: il supporto nativo 2D/3D e le decisioni attuali sono nella sezione finale F04.1 e nel report collegato. Le sezioni F04 qui sotto sono conservate come baseline storica.\n\n"
        docs_ok=(DESIGN.read_text(encoding="utf-8")==expected_notice+baseline["design_doc"]+"\n\n"+render_design_addendum(m)
                 and REPORT.read_text(encoding="utf-8")==render_report(m))
        if result!=m["visualization_audit"] or result!=read_json(AUDIT) or not docs_ok:
            result["errors"].append("Report o documentazione non allineati all'audit ricalcolato.")
            result["ok"]=False;result["UNRESOLVED_VISUALIZATION_ISSUES"]=len(result["errors"]);result["READY_FOR_F05"]="NO"
    print(json.dumps({k:result[k] for k in ["ok",*SUMMARY_KEYS,"errors"]},ensure_ascii=False,indent=2))
    return 0 if result["ok"] else 1


if __name__=="__main__":
    raise SystemExit(main())
