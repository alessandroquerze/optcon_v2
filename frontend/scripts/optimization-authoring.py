"""Shared persistence for authored Optimization batches; never runs old batch generators."""
import importlib.util
import json
from pathlib import Path

def load_module(name,filename):
    loader=importlib.util.spec_from_file_location(name,Path(__file__).with_name(filename))
    result=importlib.util.module_from_spec(loader);loader.loader.exec_module(result)
    return result

B=load_module("optimization_evidence_protocol","prepare-optimization-b.py")
from pipeline.source_warning_policy import object_hash,validate_warning
A=B.A
ROOT,DATA,DOC,SOURCE=B.ROOT,B.DATA,B.DOC,B.SOURCE
formula,control=A.formula,A.control

def persist_batch(P,first,last,batch,neighbors,notes_filename,notes_export,warning_resolver=None,configure_visualization=None,analysis_date="2026-10-18"):
    path=DATA/"optimization_companion_manifest.json";manifest=B.read_json(path)
    if any(p["source_page"]>last for p in manifest["pages"]):raise ValueError("Non riscrivere batch successivi.")
    if any(p.get("implementation_status")==f"implemented_in_batch_{batch}" for p in manifest["pages"]):raise ValueError("Batch consolidato: non rigenerare.")
    preserved=[p for p in manifest["pages"] if p["source_page"]<first]
    assert [p["source_page"] for p in preserved]==list(range(1,first))
    assert list(P)==list(range(first,last+1))
    _,_,corpus=B.load_corpus(DATA);authored=[]
    B.P={**P,**{n:dict(objective=text) for n,text in neighbors.items()}}
    B.warning=warning_resolver or (lambda n,text:None)
    for n,m in P.items():
        dest=SOURCE/f"pages/{n:04}/page_spec.json";spec=B.read_json(dest)
        for f in m["formulas"]:
            f["parameterInterpretation"]=[dict(controlId=c["id"],explanation=c["effect"]) for c in m["controls"]]
        if not m["formulas"]:
            A.P=B.P
            result=A.make_analysis(n,{**m,"prereq":m["prerequisites"]},spec,corpus)
            issue=None
        else:
            result,issue=B.analyze(n,m,spec,corpus)
        result["agent"]["run_id"]=f"optimization-batch-{batch.lower()}-{analysis_date}"
        progressive=m.get("progressive",False);ids=[o["id"] for o in result["observations"]]
        result["progression"]=dict(assessment="progressive" if progressive else "unique",
            related_page_ids=[f"{DOC}:p{n-1:04}"] if progressive else [],added=[m["objective"]] if progressive else [],
            removed=[],changed=["Nuova scelta o caratterizzazione della direzione; mantenere una pagina fisica distinta."] if progressive else [],
            observation_ids=ids,rationale="Progressione concettuale, non duplicato eliminabile." if progressive else "Scopo e contenuto autonomi.")
        if m.get("progression"):
            result["progression"].update(m["progression"])
        plan=result["didactic_plan"]
        plan["source_scope_limits"]+=m.get("scope",[])
        plan["visualization"]["component"]="FunctionExplorer" if m.get("three") else "ModelDiagram" if not m["formulas"] else "SceneViewport"
        if not m["example"]:
            plan["examples"]=[];plan["example_omission_reason"]="Divisoria: la fonte contiene soltanto il titolo. La companion propone una mappa, senza esempio numerico inventato."
            plan["enrichments"]=[e for e in plan["enrichments"] if e["id"]!="example"]
        if not m["controls"] and not m["choices"]:
            plan["interactivity"].update(recommended=False,rationale="Mappa statica sufficiente per orientarsi.",component=None,enrichment_id=None)
            plan["enrichments"]=[e for e in plan["enrichments"] if e["id"]!="interaction"]
        else:
            plan["interactivity"]["rationale"]=m["interaction_reason"]
        plan["blueprint"][0]["enrichment_ids"]=[e["id"] for e in plan["enrichments"]]
        if not m["formulas"]:
            w,h=spec["source"]["geometry"]["width_pt"],spec["source"]["geometry"]["height_pt"]
            result["observations"][-1]["description"]="Solo titolo centrale su fondo bianco; nessun footer, numero visibile, formula o figura tecnica."
            result["coverage"]["regions"]=[dict(bbox=[0,0,w,h],description="Titolo centrale e tutti gli spazi bianchi; assenza di altri elementi verificata.",observation_ids=ids)]
        B.validate_result(result,spec,corpus,DATA)
        old=spec["analysis"]["result"]
        if old:
            assert old["agent"]["run_id"]==result["agent"]["run_id"]
            assert old["observations"]==result["observations"],"Osservazioni originali immutabili"
            assert old["didactic_plan"]["source_math"]==plan["source_math"],"SOURCE_LITERAL immutabile"
        spec["analysis"]=dict(status="needs_review" if issue else "analyzed",result=result)
        spec["companionPageCount"]=1;spec["companion_mapping"]["decision"]="proposed_after_analysis"
        notices=[]
        if issue:
            kind,literal,corrected,short,reason=issue
            anchor=next((f["formulaId"] for f in m["formulas"] if f["origin"]=="correction"),m["formulas"][0]["formulaId"])
            item=dict(issue_id=f"opt{n}-source-review",source_issue_index=0,issue=m["title"],type=kind,source_expression=literal,
                corrected_expression=corrected,companion_uses=corrected,short_warning=short,correction_reason=reason,
                use_corrected_value_for_examples=kind=="CORRECTION_WARNING",use_corrected_value_for_simulation=kind=="CORRECTION_WARNING",resolved=True,
                source_references=["/analysis/result/observations"],context_pages_consulted=[n-1,n,n+1],
                calculation_policy="SOURCE_LITERAL immutabile; esempi e calcoli usano la versione companion dichiarata.",
                ui=dict(show=True,color="red",placement="Accanto al concetto interessato",when="Concetto pertinente",student_text_field="short_warning"))
            spec["source_warning"]=dict(policy_version="1.0.0",scope="companion_only",type=kind,review_status="resolved",
                original_analysis_sha256=object_hash(spec["analysis"]),
                issues=[item],companion_overrides=[],technical_only_legacy_paths=[])
            validate_warning(spec)
            notices=[dict(issue_id=item["issue_id"],component="InfoNote" if kind=="INFO_WARNING" else "WarningBanner",text=short,color="red",adjacent_to=anchor,visible_when="Concetto pertinente")]
        B.validate_schema(spec,"page-spec.schema.json");B.write_json(dest,spec)
        vis=A.visualization(8 if m.get("three") else 3,dict(visual=m["visual"],controls=m["controls"],formulas=m["formulas"]))
        if m.get("three"):
            vis["visualizationMode"]="2D_PRIMARY_WITH_3D";vis["presentation"].update(defaultView="2D")
            vis["presentation"]["camera"]["initialElevationDeg"]=m.get("camera_elevation",30)
            vis["visualizationSemantics"]["zAxis"].update(label="ℓ(z)",symbol="ℓ(z)",role="cost")
            vis["threeDRequirements"]["trajectory"].update(enabled=True,definition=m["visual"],kind="optimization_iterates" if m.get("animation") else "single_update",interpolation="Segmenti tra decisioni; nessuna dinamica fisica.",currentPoint="Decisione all’iterazione k, non istante del sistema.")
            vis["twoDRequirements"].update(plotType="contour_and_iterates",projectionOf3D=True,relationshipTo3D="Stesso costo, decisioni e parametri; percorso sul costo 3D e sui suoi livelli.")
            vis["reusableVisualizationComponents"]=["FunctionExplorer","SceneViewport"]
        elif m["formulas"]:
            x,y,role=m["axes"]
            vis["visualizationSemantics"]["xAxis"]=dict(symbol=x,label=x,unit="1",role=role,domain="Intervallo fisso dichiarato nel grafico.")
            vis["visualizationSemantics"]["yAxis"]=dict(symbol=y,label=y,unit="valore" if role=="step_size" else "1",role="cost" if role=="step_size" else role,domain="Scala fissa dell’esempio.")
            vis["twoDRequirements"].update(axes=[x,y],plotType="line_search_profile" if role=="step_size" else "directions")
        else:
            vis["visualizationMode"]="NONE";vis["twoDRequirements"]["enabled"]=False
            vis["reusableVisualizationComponents"]=["LessonFrame"]
        if m.get("animation"):
            vis["threeDRequirements"]["animation"].update(enabled=True,kind="iteration_selection",semantics="k è un indice algoritmico; Play seleziona campioni già calcolati.",controls=["Play/Pausa","Passo","Riparti","Iterazione k"],onParameterChange="Pausa e ritorno a k=0; ricalcolo dal medesimo z⁰.")
        if configure_visualization:configure_visualization(n,vis,m)
        p=json.loads(json.dumps(preserved[4]))
        p.update(source_page=n,source_pdf_label=spec["source"]["pdf_label"],page_id=spec["page_id"],companionPageCount=1,
            title=m["title"],learning_objective=m["objective"],prerequisite=plan["prerequisites"],key_ideas=[o[1] for o in m["obs"]],
            intuitive_explanation=m["explanation"],mathematical_explanation=m["objective"],
            formulas_to_show=[dict(id=f["formulaId"],expression=f["latex"],origin=f["origin"],reference=spec["page_id"],computation_input=False) for f in m["formulas"]],
            worked_example=dict(required=bool(m["example"]),omission_reason=plan["example_omission_reason"],student_rendering="Esempio aggiunto" if m["example"] else "Mappa aggiunta al titolo.",
                items=[{**e,"display_label":"Esempio aggiunto","mathematical_status":"Modello analitico esplicito; nessun dato attribuito alla figura originale."} for e in plan["examples"]]),
            controls=[{k:v for k,v in c.items() if k!="effect"} for c in m["controls"]],
            expected_parameter_effects=[dict(control_id=c["id"],effect=c["effect"],changes=[c["effect"]],output_context=[m["visual"]],invariants=m.get("scope",[]),edge_cases=[e[0] for e in m["edges"]]) for c in m["controls"]],
            edge_cases=plan["edge_cases"],takeaway=m["takeaway"],reusable_components=vis["reusableVisualizationComponents"],
            source_warning=dict(type=issue[0] if issue else "NO_WARNING",student_notices=notices),visualization=vis,
            interaction=dict(enabled=plan["interactivity"]["recommended"],effective_enabled=plan["interactivity"]["recommended"]),
            relation_to_previous_page=dict(source_page=n-1,role="Contesto verificato") if spec["context"]["previous_page_id"] else None,
            relation_to_next_page=dict(source_page=n+1,role="Sviluppo successivo") if spec["context"]["next_page_id"] else None,
            implementation_status=f"batch_{batch}_in_progress")
        if not m["formulas"]:p["layout"]["archetype"]="EXPLANATION"
        authored.append(p)
        progress=ROOT/"Docs/OPTIMIZATION_PROGRESS.md"
        lines=progress.read_text(encoding="utf-8").splitlines()
        progress.write_text("\n".join(f"- Pagina in lavorazione: {n}; analisi e progetto salvati, implementazione/revisione {batch} in corso." if line.startswith("- Pagina in lavorazione:") else line for line in lines)+"\n",encoding="utf-8")
        print(f"p{n}: analisi e progetto validati",flush=True)
    manifest["pages"]=preserved+authored
    manifest["warning_handling"]["correction_pages"]=[p["source_page"] for p in manifest["pages"] if p["source_warning"]["type"]=="CORRECTION_WARNING"]
    manifest["warning_handling"]["info_pages"]=[p["source_page"] for p in manifest["pages"] if p["source_warning"]["type"]=="INFO_WARNING"]
    B.write_json(path,manifest)
    (ROOT/f"frontend/src/companion/optimization/{notes_filename}").write_text("import type {FormulaExplanation} from '../../components/ExplainedEquation';\nexport const "+notes_export+" = "+json.dumps({n:m["formulas"] for n,m in P.items()},ensure_ascii=False,indent=2)+" as const satisfies Readonly<Record<number,readonly FormulaExplanation[]>>;\n",encoding="utf-8")
