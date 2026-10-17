"""Authored F03 decisions, derived from visual and mathematical source verification."""
from __future__ import annotations

from .common import ROOT, read_json, write_json
from .source_warning_policy import DECISIONS, DOCUMENT, PRIORITY


def build_decisions():
    output = ROOT / "Data"
    pages = {n: read_json(output / "documents" / DOCUMENT / "pages" / f"{n:04d}" / "page_spec.json") for n in [14, 16, 17, 19, 22, 26, 30, 31, 33, 34, 36]}
    records = {}

    def math_source(page, index):
        return pages[page]["analysis"]["result"]["didactic_plan"]["source_math"][index]["latex"]

    def add(page, index, kind, label, source, uses, reason, policy, short=None, corrected=None, references=None, context=None, placement=None):
        record = records.setdefault(page, {"page": page, "policy_version": "1.0.0", "scope": "companion_only",
            "type": kind, "review_status": "resolved", "issues": [], "companion_overrides": [], "technical_only_legacy_paths": []})
        record["type"] = max(record["type"], kind, key=PRIORITY.get)
        visible = kind != "NO_WARNING"
        record["issues"].append({
            "issue_id": f"intro-p{page:02d}-issue-{index + 1}", "source_issue_index": index, "issue": label,
            "type": kind, "source_expression": source, "corrected_expression": corrected,
            "companion_uses": uses, "short_warning": short, "correction_reason": reason,
            "use_corrected_value_for_examples": kind == "CORRECTION_WARNING",
            "use_corrected_value_for_simulation": kind == "CORRECTION_WARNING",
            "resolved": True,
            "source_references": references or ["/analysis/result/didactic_plan/source_math/0"],
            "context_pages_consulted": context or [], "calculation_policy": policy,
            "ui": {"show": visible, "color": "red" if visible else None,
                "placement": placement if visible else None,
                "when": "solo quando è visibile la specifica spiegazione interessata; una sola nota locale" if visible else None,
                "student_text_field": "short_warning"}
        })

    add(14, 0, "INFO_WARNING", "Dimensione d/n",
        math_source(14, 0) + "; " + math_source(14, 1) + "; " + math_source(14, 3),
        "z∈R^d; h_i,g_j:R^d→R; Z⊆R^d, con n≡d in questa definizione.",
        "Il vettore decisionale e il costo sono già dichiarati in R^d. La successiva formulazione a pagina 18 usa d in tutti i domini. Le due lettere possono indicare la stessa dimensione, senza implicare un diverso oggetto matematico: è sufficiente un chiarimento locale, non un allarme di formula sbagliata.",
        "Un solo parametro di dimensione decisionale. Leggere n come alias locale di d nella pagina 14; non imporre un'uguaglianza globale fra n e d in tutto il corso.",
        short="⚠ Nota: d e n indicano qui la stessa dimensione.",
        references=["/analysis/result/didactic_plan/source_math/0", "/analysis/result/didactic_plan/source_math/1", "/analysis/result/didactic_plan/source_math/3"],
        context=[18], placement="accanto alla definizione dei domini di h, g e Z")

    corrected16 = r"\ell(z)=\frac12\|z-\bar z\|_W^2=\frac12w_1(z_1-\bar z_1)^2+\frac12w_2(z_2-\bar z_2)^2"
    add(16, 0, "CORRECTION_WARNING", "Secondo peso della forma quadratica",
        math_source(16, 3), corrected16,
        "Ponendo e=z−z̄ e W=diag(w₁,w₂), il prodotto eᵀWe è w₁e₁²+w₂e₂². La seconda coordinata deve quindi avere coefficiente w₂. L'identità errata coincide accidentalmente solo in casi particolari, ad esempio pesi uguali o secondo scarto nullo. La correzione deriva dalla matrice e dalla definizione generale già presenti nella stessa pagina.",
        "Usare esclusivamente il prodotto matriciale e la sua espansione con w₂ nel secondo termine per esempi, curve di livello, grafici, simulazioni e audit numerici. Vietato valutare il refuso anche come confronto didattico.",
        short="⚠ Warning: possibile errore nella slide originale. Qui usiamo w₂ nel secondo termine invece di w₁.",
        corrected=corrected16,
        references=["/analysis/result/didactic_plan/source_math/1", "/analysis/result/didactic_plan/source_math/2", "/analysis/result/didactic_plan/source_math/3"],
        placement="accanto alla sola espansione del costo pesato")

    add(17, 0, "INFO_WARNING", "Figura qualitativa dell'insieme",
        "az₁²+bz₂²−c≤0; disegno di un'ellisse inclinata e traslata.",
        "az₁²+bz₂²−c≤0. Per a,b,c>0: ellisse centrata nell'origine, allineata agli assi.",
        "La forma omogenea diagonale non contiene termini lineari o incrociati: nel caso positivo l'ellisse ha centro nell'origine e assi coordinati. La figura originale è uno schema qualitativo. Non si modifica la disequazione né si aggiungono parametri per farla assomigliare al disegno. Con coefficienti generali reali non si promette una geometria ellittica.",
        "Calcolare il segno di az₁²+bz₂²−c sui punti. Rispettare i casi vuoto, degenere o illimitato; non traslare o ruotare il grafico per imitare la figura.",
        short="⚠ Nota: la figura è qualitativa; il grafico segue la formula.",
        references=["/analysis/result/didactic_plan/source_math/0", "/analysis/result/observations/2"],
        placement="accanto al grafico dell'insieme ammissibile")

    add(17, 1, "NO_WARNING", "Nome dell'insieme X/Z",
        "Then, the constraints set X is; " + math_source(17, 2),
        "Z, come nella formula dell'insieme ammissibile.",
        "X nella prosa e Z nell'equazione non introducono insiemi con proprietà diverse. Il simbolo della formula e del resto della lezione è sufficiente; un warning distrarrebbe dal confronto uguaglianza/disuguaglianza.",
        "Usare Z per il nome dell'insieme senza cambiare il predicato o i punti ammissibili.",
        references=["/analysis/result/observations/4", "/analysis/result/didactic_plan/source_math/2"])

    add(19, 0, "INFO_WARNING", "Indice temporale della dinamica sviluppata",
        math_source(19, 2) + "; " + math_source(19, 3) + "; " + math_source(19, 4),
        "f_t(x_t,u_t)−x_{t+1}=0, t=0,…,T−1; righe f₀, f₁, …, f_{T−1}.",
        "La formula generale in alto definisce già una famiglia f_t. Lo schema inferiore usa f e poi t come segnaposto nelle varie righe; non è necessario attribuirgli una legge dinamica diversa. La companion esplicita l'istante corretto in ciascuna transizione, usando la formula generale della stessa slide.",
        "La riga t applica la propria f_t a x_t e u_t. In un esempio time-invariant tutte le f_t possono coincidere; non costringerle a coincidere nel caso generale.",
        short="⚠ Nota: ogni transizione usa la propria mappa f_t.",
        references=["/analysis/result/didactic_plan/source_math/0", "/analysis/result/didactic_plan/source_math/2", "/analysis/result/didactic_plan/source_math/3", "/analysis/result/didactic_plan/source_math/4"],
        placement="accanto allo sviluppo delle uguaglianze per t")

    add(22, 0, "INFO_WARNING", "Riferimento iniziale non elencato",
        "Costo con somma da t=0; x_t^{des} elencato per t=1,…,T; x₀=x⁰.",
        r"x_0^{\mathrm{des}}=x^0 come default esplicito degli esempi; il costo mantiene t=0.",
        "Il primo addendo richiede un riferimento anche a t=0, ma la lista testuale parte da 1. Quando x₀ è fissato, quel termine è costante rispetto alle decisioni: non modifica gli argmin, ma incide sul valore assoluto del costo. Per evitare un valore non definito, gli esempi assegnano esplicitamente il riferimento iniziale al dato x⁰. Questa è una convenzione dichiarata della companion, non una formula attribuita alla fonte.",
        "Assegnare x₀^{des}=x⁰ prima di valutare il costo. Se cambia il dato iniziale, aggiornare il riferimento iniziale secondo questo default. Non eliminare la riga t=0 né introdurre valori impliciti.",
        short="⚠ Nota: negli esempi il riferimento iniziale coincide con x⁰.",
        references=["/analysis/result/didactic_plan/source_math/0", "/analysis/result/didactic_plan/source_math/4", "/analysis/result/observations/4"],
        placement="accanto alla definizione del riferimento iniziale")

    add(26, 0, "INFO_WARNING", "Ambito planare rispetto alla frase 3D",
        "Consider a planar drone model; given time law in the 3D space.",
        "Moto nel piano (p_x,p_y), con θ; uscita y_t=(p_{x,t},p_{y,t}). Nessuna terza coordinata.",
        "Titolo del modello, due accelerazioni traslazionali e uscita a due componenti identificano un esempio planare. La frase 3D può descrivere un obiettivo più generale, ma non assegna un modello spaziale completo. Non occorre dichiarare errate le equazioni: basta delimitare il modello effettivamente utilizzato.",
        "Usare le tre equazioni planari invariate. Per un'eventuale rappresentazione ambientale tridimensionale, non aggiungere dinamica fuori piano; l'esempio calcolato rimane 2D.",
        short="⚠ Nota: il modello usato qui è planare, in due dimensioni.",
        references=["/analysis/result/observations/0", "/analysis/result/observations/4", "/analysis/result/didactic_plan/source_math/3"],
        context=[27], placement="accanto alla descrizione dell'ambito del modello")

    corrected30 = r"u_t^{\min}\leq u_t\leq u_t^{\max},\quad t=0,\ldots,T-1;\qquad p_{y,t}^{\min}\leq p_{y,t}\leq p_{y,t}^{\max},\quad t=1,\ldots,T"
    add(30, 0, "CORRECTION_WARNING", "Indici distinti per ingressi e stati previsti",
        math_source(30, 0) + "; " + math_source(30, 1),
        corrected30,
        "Lo stack a pagina 10 è col(u₀,…,u_{T−1}) e la dinamica ha T transizioni. Applicare alle saturazioni l'intervallo 1,…,T ometterebbe u₀ e richiederebbe un inesistente u_T. La companion corregge il dominio degli ingressi a 0,…,T−1 e conserva 1,…,T per le quote degli stati previsti, come nel caso illustrato. Il limite su x_T si impone esplicitamente come vincolo di stato terminale, distinto dai path di stadio del problema generale; non si crea un ingresso terminale.",
        "T ingressi indicizzati 0…T−1 e T stati previsti indicizzati 1…T. Applicare i limiti agli array corrispondenti, incluso il primo ingresso e lo stato finale. Il dato x₀ resta separato dai limiti di quota previsti di questo esempio.",
        short="⚠ Warning: possibile errore nella slide originale. Gli ingressi usano t=0,…,T−1; le quote t=1,…,T.",
        corrected=corrected30,
        references=["/analysis/result/didactic_plan/source_math/0", "/analysis/result/didactic_plan/source_math/1", "/analysis/result/didactic_plan/source_math/2"],
        context=[10, 21, 23, 27], placement="accanto agli intervalli temporali delle saturazioni e dei limiti di quota")

    add(31, 0, "NO_WARNING", "Parentesi tipografiche ridondanti",
        math_source(31, 0) + "; " + math_source(31, 3),
        math_source(31, 2) + "; coppia (x(·),u(·)) con delimitatori bilanciati.",
        "Il funzionale è riscritto correttamente nella stessa pagina. Le parentesi eccedenti non aggiungono termini né cambiano l'insieme dinamico. Una composizione tipografica bilanciata della companion mantiene simboli e contenuto; un warning allo studente non migliorerebbe la comprensione.",
        "Usare il funzionale già bilanciato presente nella fonte e mantenere invariati integrale, termine terminale e domini temporali. Nessun valore numerico dipende dalle parentesi superflue.",
        references=["/analysis/result/didactic_plan/source_math/0", "/analysis/result/didactic_plan/source_math/2", "/analysis/result/didactic_plan/source_math/3"])

    add(33, 0, "NO_WARNING", "Varianti tipografiche di lunghezza e massa",
        r"g/l;\quad 1/(m\ell^2);\quad Mg nel disegno.",
        "Notazione del modello conservata; l≡ℓ è una sola lunghezza, m≡M una sola massa nel pendolo.",
        "Il modello descrive un pendolo con una lunghezza e una massa; non definisce due lunghezze o due masse indipendenti. l/ℓ e m/M sono letti come varianti locali della stessa quantità fisica. Questa interpretazione concorda con la relazione di equilibrio a pagina 34. Non è utile un warning per ogni glifo.",
        "Collegare l e ℓ al medesimo parametro positivo di lunghezza; M e m alla medesima massa positiva. Non esporre quattro parametri indipendenti. Mantenere questa convenzione nelle pagine 33–36, senza riscrivere le equazioni source_literal.",
        references=["/analysis/result/didactic_plan/source_math/0", "/analysis/result/observations/3"],
        context=[34])

    add(34, 0, "CORRECTION_WARNING", "Componente nulla all'equilibrio",
        math_source(34, 0),
        r"0=x_{2,e};\qquad u_e=mg\ell\sin x_{1,e}\quad(l\equiv\ell).",
        "Dalla dinamica ẋ₁=x₂ della pagina 33, un equilibrio impone x₂,e=0. La prima componente x₁,e è invece l'angolo scelto e può essere non nulla; la stessa pagina mostra x_e=col(θ_e,0). La coppia si verifica annullando entrambe le derivate con u_e=mgℓsinθ_e, identificando i due glifi della lunghezza. Imporre x₁,e=0 eliminerebbe impropriamente gli equilibri inclinati.",
        "Per ogni angolo selezionato usare x_e=col(θ_e,0), u_e=mgℓsinθ_e e residui della dinamica corretta. Non imporre né valutare x₁,e=0 come condizione di equilibrio. Non generare un residuo numerico del refuso per confronto.",
        short="⚠ Warning: possibile errore nella slide originale. La condizione di equilibrio corretta è x₂,e=0.",
        corrected=r"0=x_{2,e}",
        references=["/analysis/result/didactic_plan/source_math/0", "/analysis/result/didactic_plan/source_math/2"],
        context=[33], placement="accanto alla prima condizione di equilibrio")

    add(34, 1, "NO_WARNING", "Lunghezza nella coppia di equilibrio",
        math_source(34, 1) + "; " + math_source(34, 2),
        r"u_e=mg\ell\sin\theta_e,\quad l\equiv\ell.",
        "L'equazione generale darebbe mgℓ²/l come coefficiente se i simboli fossero due quantità indipendenti. Nel pendolo descritto esiste una sola lunghezza; l≡ℓ è la lettura fisica locale fissata anche per pagina 33. La formula mgℓsinθ_e già stampata è coerente, senza necessità di una seconda correzione o nota allo studente.",
        "Un solo parametro positivo di lunghezza condiviso fra termine gravitazionale e inerziale. Usare direttamente la coppia mgℓsinθ_e con questa convenzione.",
        references=["/analysis/result/didactic_plan/source_math/1", "/analysis/result/didactic_plan/source_math/2"],
        context=[33])

    add(36, 0, "NO_WARNING", "Glifi della lunghezza nel modello finale",
        r"g/l;\qquad 1/(m\ell^2).",
        "Equazioni e costo della fonte conservati; l≡ℓ è un solo parametro di lunghezza.",
        "La variazione tipografica è la stessa del modello di pagina 33 e non introduce un nuovo grado di libertà. La convenzione di lunghezza unica risolve la valutazione numerica senza un ulteriore avviso. Restano intatti i fattori di costo della fonte, inclusa l'assenza di 1/2.",
        "Usare la stessa lunghezza positiva nei due denominatori e nella coppia desiderata delle pagine 34–35. Nessun fattore 1/2 aggiunto al costo; nessun warning tipografico ridondante.",
        references=["/analysis/result/didactic_plan/source_math/0"],
        context=[33, 34])

    def override(page, path, value):
        records[page]["companion_overrides"].append({"path": path, "value": value})

    override(16, "/examples/0/purpose", "Calcolare il costo corretto e distinguere i contributi delle due coordinate.")
    override(16, "/examples/0/derivation", ["Con W=diag(1,4) ed e=(1,1): ℓ=½w₁e₁²+½w₂e₂².", "Primo contributo: 0.5; secondo contributo: 2.", "Il costo totale corretto è 2.5."])
    override(16, "/examples/0/expected_outcome", "Il secondo scarto è pesato da w₂. Si valuta soltanto l'espressione corretta.")
    override(16, "/enrichments/0/proposal", "Usare l'espansione con w₂ nel secondo termine e il solo breve warning locale della policy.")
    override(16, "/enrichments/3/proposal", "Variare i pesi della formula corretta per comprendere l'anisotropia del costo.")
    override(16, "/enrichments/4/proposal", "Curve di livello della formula corretta, senza pannelli o valori calcolati dal refuso.")
    override(16, "/visualization/component", "WeightedQuadraticContours")
    override(16, "/visualization/description", "Curve di livello della forma corretta e piccolo warning rosso accanto all'espansione; nessun confronto numerico con il refuso.")
    override(16, "/interactivity/rationale", "Comprendere l'effetto distinto di w₁ e w₂ sulla stessa forma quadratica corretta.")
    override(16, "/interactivity/outputs", ["Costo corretto", "Contributi delle due coordinate", "Curve di livello", "Indicazione della positività dei pesi"])
    override(16, "/blueprint/0/focus", "Distanza quadratica pesata: ogni coordinata usa il proprio peso; breve warning sulla seconda componente.")
    records[16]["technical_only_legacy_paths"] = [
        "/analysis/result/didactic_plan/examples/0/derivation/1",
        "/analysis/result/didactic_plan/interactivity/outputs/1",
        "/analysis/result/didactic_plan/enrichments/4/proposal"]

    override(30, "/examples/0/setup", "Enrichment a un istante di stato previsto t∈{1,…,T}: p_y^{min}=1,p_y^{max}=3; confrontare p_y=2 con p_y=3.2.")
    override(30, "/interactivity/invariants", ["Istante di stato t∈{1,…,T}", "Ingressi indicizzati 0,…,T−1, senza u_T", "p_y=x₃", "Nessuna integrazione del drone", "Range/default sono enrichment"])

    override(34, "/enrichments/0/proposal", "Equilibrio: x₂,e=0 e u_e=mgℓ sinθ_e, usando una sola lunghezza l≡ℓ; breve warning accanto alla prima condizione.")
    override(34, "/enrichments/2/proposal", "Variare l'angolo e la coppia di equilibrio, verificando soltanto i residui della dinamica corretta.")
    override(34, "/examples/0/purpose", "Verificare due coppie di equilibrio usando la condizione corretta x₂,e=0.")
    override(34, "/examples/0/derivation", ["Prima coppia: x_e¹=(0,0), u_e¹=0.", "Seconda coppia: x_e²=(π/6,0), u_e²=4.905.", "Per entrambe ẋ₁=0 e ẋ₂=0; la velocità di equilibrio è x₂,e=0."])
    override(34, "/examples/0/expected_outcome", "Due coppie annullano la dinamica; la traiettoria di trasferimento è un problema successivo.")
    override(34, "/visualization/description", "Due configurazioni e coppie di equilibrio corrette, con il solo warning sintetico accanto a x₂,e=0.")
    override(34, "/interactivity/rationale", "Mostrare come l'angolo scelto determina la coppia che annulla l'accelerazione con velocità nulla.")
    override(34, "/interactivity/parameters/0/effect_on_change", "Aggiornare la prima configurazione, u_e¹=9.81sinθ_e¹ e i residui delle due equazioni dinamiche corrette, con x₂,e=0.")
    override(34, "/interactivity/parameters/0/edge_cases", ["θ_e¹=0: coppia di equilibrio nulla"])
    override(34, "/interactivity/outputs", ["Due coppie corrette (x_e,u_e)", "Residui della dinamica", "Warning sintetico sulla prima condizione"])
    override(34, "/blueprint/0/focus", "Equilibri a velocità nulla, coppia di sostegno e breve warning sulla condizione corretta.")
    records[34]["technical_only_legacy_paths"] = [
        "/analysis/result/didactic_plan/examples/0/derivation/3",
        "/analysis/result/didactic_plan/interactivity/parameters/0/effect_on_change",
        "/analysis/result/didactic_plan/enrichments/0/proposal"]
    return [records[n] for n in sorted(records)]


if __name__ == "__main__":
    write_json(DECISIONS, build_decisions())
    print("Decisioni F03 scritte: 11 pagine, 13 issue.")
