"""Persist the individually inspected sources and authored design of batch A.

Only Optimization p1..9 may acquire analysis/content. Source artifacts and all
Introduction assets are read-only. The source index exposes future PDF pages
without presenting them as authored companions.
"""
from __future__ import annotations
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT))
from pipeline.analysis import build_request, load_corpus, validate_result
from pipeline.common import read_json, write_json, validate_schema, sha256_bytes

DATA = ROOT / "Data"
DOC = "OPTCON-RL_optimization_2026_09_14--6c1dba877ca1"
SOURCE = DATA / "documents" / DOC

def formula(key, latex, explanation, purpose, symbols=(), assumptions=(), origin="source", details=()):
    return dict(formulaId=key, latex=latex, conceptualExplanation=explanation, purpose=purpose,
                symbolDefinitions=[dict(symbol=s, meaning=m) for s, m in symbols], assumptions=list(assumptions),
                optionalDetails=list(details), relatedFormulaIds=[], parameterInterpretation=[],
                origin=origin, sourceFormulaIds=[key] if origin in ("source", "correction") else [])

def control(key, label, symbol, low, high, default, step, effect):
    return dict(id=key, label=label, symbol=symbol, component="ParameterControl",
                domain=dict(min=low, max=high, step=step, integer=False), default=default, unit="1", effect=effect)

P = {
1: dict(title="Nonlinear Optimization", objective="Orientarsi: dal problema alla scelta di un metodo.",
    explanation="L’ottimizzazione sceglie una decisione confrontando i valori di un costo. Qui iniziamo dalle definizioni, poi studieremo condizioni e algoritmi.",
    takeaway="Prima il significato della soluzione, poi il metodo per cercarla.",
    scope=["Copertina con titolo, autore, affiliazione e nota d’uso interno. Nessun teorema o algoritmo.", "La mappa della companion è un orientamento aggiunto, non una formula della slide."],
    obs=[("structure", "Il documento è Nonlinear Optimization, parte del corso Optimal Control and Reinforcement Learning.", "Nonlinear Optimization"),
         ("other", "Autore Giuseppe Notarstefano, Università di Bologna; slide per uso interno al corso.", "The present slides are for internal use of the course")],
    formulas=[], controls=[], prereq=[], example=None,
    visual="Mappa editoriale: definizioni → geometria → algoritmi → vincoli, con crediti della fonte.",
    edges=[("Nessuna formula in copertina", "Non introdurre un risultato matematico come affermazione della copertina.")]),
2: dict(title="Prima le condizioni, poi gli algoritmi", objective="Separare definire una soluzione, riconoscerla e cercarla.",
    explanation="Questa sezione riguarda problemi senza vincoli: definizioni, condizioni di ottimalità e classi particolari di problemi.",
    takeaway="Le condizioni aiutano a riconoscere una soluzione; un algoritmo è il procedimento che la cerca.",
    scope=["Pagina divisoria: solo il titolo della sezione, nessuna condizione matematica già enunciata."],
    obs=[("structure", "La sezione annuncia definizioni, condizioni di ottimalità e classi speciali per ottimizzazione non vincolata.", "Unconstrained optimization: definitions, optimality conditions and")],
    formulas=[], controls=[], prereq=[], example=None,
    visual="Tre riquadri: cosa significa minimo, quali indizi lo caratterizzano, quali ipotesi aiutano; percorso aggiunto.",
    edges=[("Titolo di sezione", "Non attribuire alla fonte dimostrazioni, convergenza o esempi non ancora presenti.")]),
3: dict(title="Minimo locale o globale? Conta il confronto", objective="Distinguere locale/globale e stretto/non stretto con i corretti quantificatori.",
    explanation="Un minimo locale vince nei confronti abbastanza vicini. Un minimo globale vince contro ogni decisione. “Stretto” esclude pareggi con punti distinti.",
    takeaway="Locale indica dove confronti; stretto indica se ammetti pareggi.",
    scope=["La fonte definisce quattro nozioni senza ipotesi di derivabilità.", "Il doppio pozzo e i suoi valori sono un esempio aggiunto; nessuna verifica su griglia viene presentata come prova globale."],
    obs=[("definition", "Il problema è minimizzare ℓ(z) su R^d, con z vettore decisionale e ℓ:R^d→R.", "with ℓ: Rd →R a cost function"),
         ("definition", "Minimo globale: ℓ(z⋆)≤ℓ(z) per ogni z; stretto globale: disuguaglianza stretta per z≠z⋆.", "global minimum if"),
         ("definition", "Minimo locale: esiste ε>0 tale che il confronto valga in B(z⋆,ε)={z:‖z−z⋆‖<ε}.", "local minimum if there exists"),
         ("definition", "Minimo locale stretto: nello stesso intorno, confronto stretto escludendo il punto stesso.", "strict local minimum if")],
    formulas=[formula("opt03-problem", r"\min_{z\in\mathbb R^d}\ell(z)", "Si sceglie z nello spazio delle decisioni per ottenere il costo più basso; il problema non contiene vincoli aggiuntivi.", "Identificare decisione, dominio e quantità da minimizzare.", [("z", "Vettore decisionale con d componenti."), (r"\ell", "Costo scalare.")]),
      formula("opt03-local", r"\exists\epsilon>0:\quad\ell(z^\star)\le\ell(z)\quad\forall z\in B(z^\star,\epsilon)", "Per il minimo locale basta un intorno in cui nessun punto costi meno. Non si stanno confrontando tutte le decisioni.", "Leggere correttamente esistenza dell’intorno e confronto locale.", [(r"B(z^\star,\epsilon)", "Palla aperta centrata nel punto, di raggio ε."), (r"z^\star", "Punto che si vuole classificare.")]),
      formula("opt03-ball", r"B(z^\star,\epsilon)=\{z\in\mathbb R^d:\|z-z^\star\|<\epsilon\}", "La palla è aperta: il bordo a distanza esattamente ε non appartiene all’intorno.", "Definire il dominio del confronto locale."),
      formula("opt03-global", r"\ell(z^\star)\le\ell(z)\quad\forall z\in\mathbb R^d", "Il confronto globale riguarda tutto lo spazio, non soltanto il ritaglio disegnato.", "Distinguere un minimo globale da uno locale."),
      formula("opt03-strict", r"\ell(z^\star)<\ell(z)\quad\forall z\ne z^\star", "La disuguaglianza stretta rende unico il vincitore nel dominio del confronto; per la versione locale quel dominio è l’intorno.", "Separare la nozione di stretto dalla nozione di locale/globale."),
      formula("opt03-strict-local", r"\exists\epsilon>0:\ \ell(z^\star)<\ell(z)\quad\forall z\in B(z^\star,\epsilon)\setminus\{z^\star\}", "Ogni altro punto sufficientemente vicino ha un costo maggiore; possono esistere soluzioni lontane migliori o di pari costo.", "Precisare il minimo locale stretto senza imporre unicità globale."),
      formula("opt03-example", r"\ell(z)=(z^2-1)^2+\tau z", "L’inclinazione τ rompe il pareggio fra i due pozzi. Un pozzo può restare un minimo locale pur diventando peggiore dell’altro.", "Esplorare locale e globale su una funzione coerciva esplicita.", [(r"\tau", "Parametro dell’esempio aggiunto, non della slide.")], ["τ∈[−0.5,0.5]: due minimi stretti e un massimo intermedio.", "I punti stazionari risolvono esattamente il modello cubico; la griglia serve soltanto a disegnare."], "enrichment")],
    controls=[control("opt03-tilt", "Inclinazione", r"\tau", -.5, .5, .25, .05, "Muove i punti critici e modifica quale pozzo ha costo globale minore."), control("opt03-radius", "Raggio dell’intorno", r"\epsilon", .1, 1.5, .5, .1, "Modifica soltanto la zona evidenziata del confronto locale, non la funzione o i minimi.")],
    prereq=[("Confronto di valori e intorno", "Per leggere quantificatori e disuguaglianze.", [])],
    example=("Doppio pozzo con τ=0", ["I punti −1 e 1 hanno costo 0 e sono entrambi minimi globali e locali stretti.", "Il minimo globale non è stretto: l’altro pozzo pareggia il costo.", "Con τ=0.25 il pozzo sinistro è l’unico minimo globale; il destro rimane locale."], "Parità globale e strettezza locale possono coesistere."),
    visual="Curva 2D con tre punti critici, candidato selezionabile e intorno aperto evidenziato.",
    edges=[("τ=0", "Due minimizzatori globali, nessuno dei due stretto globale."), ("Intorno troppo ampio", "La definizione richiede l’esistenza di un raggio adatto, non ogni raggio."), ("Candidato massimo", "Non classificarlo come minimo neppure quando è stazionario.")]),
4: dict(title="Un tratto piatto può contenere molti minimi", objective="Leggere il grafico qualitativo e il passaggio da minimi a massimi cambiando segno.",
    explanation="La figura distingue un minimo globale stretto da un tratto di minimi locali non stretti. Cambiando segno al costo si scambiano minimi e massimi.",
    takeaway="Su un tratto costante il pareggio impedisce la strettezza.",
    scope=["Il disegno della fonte è qualitativo: non specifica coordinate, funzione analitica o dati numerici.", "La companion usa un profilo aggiunto con lo stesso ruolo geometrico, non una ricostruzione dei dati originali."],
    obs=[("equation", "La fonte ripete min ℓ(z), z∈R^d, e la definizione di costo e decisione.", "Consider the unconstrained optimization problem"),
         ("diagram", "Il profilo mostra un minimo globale stretto, un massimo locale stretto e un segmento costante etichettato local minima.", None),
         ("concept", "I massimi sono definibili analogamente e sono minimi della funzione −ℓ.", "maxima are minima of −ℓ")],
    formulas=[formula("opt04-problem", r"\min_{z\in\mathbb R^d}\ell(z)", "Il problema rimane scegliere il costo più basso su tutto lo spazio delle decisioni; la figura ne illustra diversi punti notevoli.", "Collegare il profilo alle definizioni della pagina precedente."),
      formula("opt04-sign", r"\operatorname*{arg\,max}_z\ell(z)=\operatorname*{arg\,min}_z[-\ell(z)]", "Cambiare segno inverte ogni confronto: il punto più alto diventa il più basso. I punti restano gli stessi, i valori cambiano segno.", "Esplicitare la remark della fonte con una scrittura equivalente.", assumptions=["Identità fra insiemi di ottimi quando questi esistono."], origin="enrichment"),
      formula("opt04-profile", r"\ell(z)=\begin{cases}(z+2)^2&z<-2\\3s((z+2)/2)&-2\le z<0\\3-2s(z/2)&0\le z<2\\1&2\le z\le3\\1+(z-3)^2&z>3\end{cases}", "Il profilo aggiunto ha un minimo globale unico a −2, una cima a 0 e un plateau di costo 1. Nessun numero è ricavato dal disegno della fonte.", "Rendere esplicito il modello che alimenta il grafico.", [("s(t)", "s(t)=3t²−2t³, usata solo fra 0 e 1 per raccordare i tratti.")], ["Profilo C¹ costruito per l’esempio; non usarlo per applicare indiscriminatamente condizioni C² ai raccordi."], "enrichment")],
    controls=[], prereq=[("Minimi locali e stretti", "Per interpretare correttamente il plateau.", [3])],
    example=("Tre posizioni sul profilo aggiunto", ["ℓ(−2)=0: unico minimo globale e locale stretto.", "ℓ(0)=3: massimo locale stretto.", "ℓ(2.5)=1: minimo locale non stretto; nell’interno del plateau è anche massimo locale non stretto."], "La classificazione dipende dal confronto, non soltanto dalla pendenza nulla."),
    visual="Profilo 2D con plateau; selezione dei tre punti e confronto ℓ/−ℓ a scala verticale fissa.",
    edges=[("Punto interno al plateau", "È contemporaneamente minimo e massimo locale non stretto."), ("−ℓ", "Il minimo globale stretto di ℓ diventa massimo globale stretto di −ℓ."), ("Estremi del plateau", "Sono minimi locali non stretti, ma non massimi locali come i punti interni.")]),
5: dict(title="Argmin è il punto; min è il valore", objective="Separare minimizzatore e valore ottimo.",
    explanation="La soluzione z* dice dove scegliere. Il valore ℓ(z*) dice quanto costa quella scelta. Sono oggetti diversi, anche quando entrambi sono numeri.",
    takeaway="Il parametro a sposta il minimizzatore; c sposta soltanto il valore ottimo.",
    scope=["La fonte usa la notazione di un singolo minimizzatore. In generale argmin può essere un insieme o essere vuoto; l’esempio ha sempre soluzione unica."],
    obs=[("definition", "ℓ(z*) è il valore ottimo, uguale al minimo del costo.", "We denote ℓ(z∗) the optimal"),
         ("definition", "z* è il punto minimizzatore indicato mediante argmin.", "where z∗is the minimum point")],
    formulas=[formula("opt05-value", r"\ell(z^*)=\min_{z\in\mathbb R^d}\ell(z)", "Min restituisce il costo più basso, una quantità scalare: l’altezza del minimo nel grafico.", "Leggere il valore ottimo senza confonderlo con la decisione."),
      formula("opt05-point", r"z^*=\operatorname*{arg\,min}_{z\in\mathbb R^d}\ell(z)", "Argmin identifica dove si ottiene il valore minimo. Qui il minimizzatore è unico; con più soluzioni si considera l’insieme dei minimizzatori.", "Interpretare la coordinata del punto ottimo.", assumptions=["La notazione puntuale della slide è usata nell’esempio con soluzione unica."]),
      formula("opt05-example", r"\ell(z)=(z-a)^2+c,\qquad z^*=a,\quad\ell(z^*)=c", "Il quadrato è sempre non negativo e si annulla solo in a. La traslazione verticale c cambia il valore minimo senza muovere il minimizzatore.", "Separare visivamente posizione e valore con due parametri indipendenti.", [("a", "Posizione del vertice."), ("c", "Costo del vertice, anche negativo.")], origin="enrichment")],
    controls=[control("opt05-location", "Posizione del minimo", "a", -2, 2, 1, .1, "Trasla la parabola orizzontalmente: cambia z*, resta fisso il valore ottimo."), control("opt05-value", "Valore minimo", "c", -1, 3, .5, .1, "Trasla verticalmente: cambia ℓ(z*), resta fisso z*.")],
    prereq=[("Minimo globale", "Per distinguere il punto dal costo che vi si ottiene.", [3])],
    example=("a=1, c=0.5", ["La scelta ottima è z*=1.", "Il valore ottimo è ℓ(1)=0.5.", "Il costo in z=0 è 1.5: non è il valore ottimo."], "Un costo ottimo negativo è ammesso: non è una distanza se si aggiunge c<0."),
    visual="Parabola 2D, vertice e proiezioni sulle coordinate; letture separate z* e ℓ(z*).",
    edges=[("Più minimizzatori in altri problemi", "Argmin è in generale un insieme; non dedurre unicità dalla sola notazione."), ("Minimo non raggiunto", "Infimo e minimo non sono intercambiabili; l’esempio coercivo raggiunge sempre il minimo.")]),
6: dict(title="Gradiente e Hessiana: due informazioni diverse", objective="Leggere forma e significato delle derivate prime e seconde di un costo scalare.",
    explanation="Il gradiente raccoglie le sensibilità alle coordinate in una colonna. La Hessiana descrive come queste sensibilità cambiano, incluse le interazioni fra coordinate.",
    takeaway="Gradiente: colonna d×1. Hessiana: matrice d×d, simmetrica se r∈C².",
    scope=["La fonte riguarda r:R^d→R e richiede continuità delle derivate seconde per la simmetria.", "La matrice stampata contiene z_n dove il dominio usa d e una derivata senza il ²: trascrizione letterale conservata, correzione solo companion."],
    obs=[("equation", "Per r:R^d→R, ∇r(z) è la colonna delle derivate prime, in R^{d×1}.", "Gradient of a function"),
         ("equation", r"La Hessiana stampata è ∇²(r(z)); l’elemento alto destro usa ∂²r/(∂z₁zₙ), quello basso sinistro ∂r/(∂z_dz₁), con ² mancante.", "Hessian matrix of a function"),
         ("assumption", "La continuità delle derivate seconde consente lo scambio dell’ordine e rende simmetrica la Hessiana.", "continuity of the second derivatives")],
    formulas=[formula("opt06-gradient", r"\nabla r(z)=\begin{bmatrix}\frac{\partial r(z)}{\partial z_1}\\\vdots\\\frac{\partial r(z)}{\partial z_d}\end{bmatrix}\in\mathbb R^{d\times1}", "Ogni componente misura la variazione del valore quando si modifica quella coordinata, mantenendo fisse le altre.", "Fissare la convenzione del corso: gradiente scalare come vettore colonna.", [("r", "Funzione scalare; qui r è la notazione della fonte, non un vettore di vincoli."), ("d", "Dimensione del dominio.")]),
      formula("opt06-hessian", r"\nabla^2(r(z))=\left[\frac{\partial^2r(z)}{\partial z_i\partial z_j}\right]_{i,j=1}^d\in\mathbb R^{d\times d}", "La Hessiana descrive curvature e accoppiamenti. È simmetrica se le derivate seconde sono continue.", "Usare una Hessiana coerente con d e con l’ordine due delle derivate.", [("i,j", "Indici entrambi da 1 a d.")], ["r∈C² nell’intorno considerato per la simmetria."], "correction", details=["La diagonale misura le curvature coordinate; gli elementi fuori diagonale misurano l’accoppiamento."]),
      formula("opt06-example", r"r(z)=\tfrac12(z_1^2+2\rho z_1z_2+2z_2^2),\quad\nabla r(z)=\begin{bmatrix}z_1+\rho z_2\\\rho z_1+2z_2\end{bmatrix},\quad\nabla^2(r(z))=\begin{bmatrix}1&\rho\\\rho&2\end{bmatrix}", "Muovi z: varia il gradiente. Varia ρ: cambiano Hessiana e livelli. La Hessiana non dipende da z perché r è quadratica.", "Collegare derivate, valori numerici e geometria della stessa funzione.", [(r"\rho", "Accoppiamento adimensionale dell’esempio.")], ["ρ∈[−1,1]; r è un polinomio C∞."], "enrichment")],
    controls=[control("opt06-z1", "Prima coordinata", "z_1", -1.5, 1.5, .6, .1, "Muove il punto e aggiorna r e la colonna del gradiente."), control("opt06-z2", "Seconda coordinata", "z_2", -1.5, 1.5, .4, .1, "Muove il punto e aggiorna r e il gradiente."), control("opt06-coupling", "Accoppiamento", r"\rho", -1, 1, .5, .1, "Ruota i livelli e cambia gli elementi fuori diagonale della Hessiana.")],
    prereq=[("Derivate parziali e matrici", "Per leggere d×1 e d×d.", [])],
    example=("z=(0.6,0.4), ρ=0.5", ["r(z)=0.46.", "∇r(z)=(0.8,1.1)ᵀ.", "H=[[1,0.5],[0.5,2]], simmetrica e indipendente dal punto."], "La freccia 2D ha lunghezza normalizzata; i valori esatti sono nelle letture."),
    visual="Superficie/contour condivisi con punto corrente e direzione del gradiente; matrici numeriche.",
    edges=[("z=0", "Il gradiente è nullo: freccia nulla, senza normalizzazione per zero."), ("ρ=0", "Nessun accoppiamento; la Hessiana è diagonale."), ("Cambio del punto", "Non ricalcolare o modificare la Hessiana costante come se dipendesse da z.")]),
7: dict(title="Il gradiente vettoriale del corso è J trasposto", objective="Conservare la convenzione d×m per una funzione a valori vettoriali.",
    explanation="Ogni componente rⱼ ha un gradiente colonna. Affiancando queste colonne si ottiene la matrice d×m del corso, trasposta rispetto al Jacobiano usuale m×d.",
    takeaway="Una colonna per uscita, una riga per coordinata: ∇r ha forma d×m.",
    scope=["La fonte sceglie esplicitamente la trasposta del Jacobiano: non è un errore da correggere.", "L’esempio d=2,m=3 serve a rendere visibile l’orientamento rettangolare."],
    obs=[("equation", "Per r:R^d→R^m, il corso definisce ∇r(z)=[∇r₁(z) … ∇r_m(z)]∈R^{d×m}.", "For a vector field r : Rd →Rm"),
         ("concept", "Questa matrice è la trasposta del Jacobiano di r.", "transpose of the Jacobian")],
    formulas=[formula("opt07-convention", r"\nabla r(z)=[\nabla r_1(z)\ \cdots\ \nabla r_m(z)]\in\mathbb R^{d\times m}", "Le colonne seguono le componenti in uscita; le righe seguono le variabili di ingresso. La forma della matrice è parte della convenzione del corso.", "Evitare di scambiare gradiente vettoriale e Jacobiano.", [("d", "Numero di variabili."), ("m", "Numero di componenti della funzione.")]),
      formula("opt07-jacobian", r"J_r(z)=[\nabla r(z)]^\top\in\mathbb R^{m\times d}", "Trasporre scambia righe e colonne: la derivata della stessa componente rispetto alla stessa variabile rimane lo stesso numero.", "Dare un nome esplicito al Jacobiano descritto nella fonte.", origin="enrichment"),
      formula("opt07-example", r"r(z)=\begin{bmatrix}z_1^2+z_2\\z_1z_2\\2z_2\end{bmatrix},\qquad\nabla r(z)=\begin{bmatrix}2z_1&z_2&0\\1&z_1&2\end{bmatrix}", "Le tre colonne derivano separatamente r₁, r₂ e r₃. Selezionare una cella mostra dove ricompare il medesimo valore nella matrice trasposta.", "Rendere concreta la convenzione con una matrice rettangolare.", assumptions=["Esempio aggiunto r:R²→R³, polinomiale."], origin="enrichment")],
    controls=[control("opt07-z1", "Prima coordinata", "z_1", -2, 2, 1, .1, "Aggiorna ∂r₁/∂z₁ e ∂r₂/∂z₂, mantenendo la corrispondenza trasposta."), control("opt07-z2", "Seconda coordinata", "z_2", -2, 2, .5, .1, "Aggiorna ∂r₂/∂z₁ nella matrice del corso e nella sua trasposta.")],
    prereq=[("Gradiente scalare colonna", "Ogni colonna della nuova matrice è il gradiente di una componente.", [6])],
    example=("z=(1,0.5), d=2, m=3", ["∇r=[[2,0.5,0],[1,1,2]], forma 2×3.", "J_r=[[2,1],[0.5,1],[0,2]], forma 3×2.", "Per m=1 si ritrova la colonna del gradiente scalare."], "Stessa informazione, orientamento diverso."),
    visual="Due matrici numeriche affiancate con righe/colonne etichettate e selezione collegata di celle trasposte.",
    edges=[("d=m", "Una matrice quadrata può mascherare l’errore di trasposizione: usare d≠m nell’esempio."), ("Derivata zero", "Conservare lo zero e la posizione: non eliminare righe o colonne.")]),
8: dict(title="Stazionario non significa minimo", objective="Interpretare le condizioni necessarie senza invertirne l’implicazione.",
    explanation="Ogni minimo locale regolare deve avere gradiente nullo; con ℓ∈C² la Hessiana deve essere semidefinita positiva. Superare questi controlli non basta a dimostrare un minimo.",
    takeaway="Condizioni necessarie: possono escludere un minimo, ma da sole non lo certificano.",
    scope=["La fonte assume C¹ in un intorno per FNC, C² per SNC; il problema è non vincolato.", "Il profilo qualitativo etichetta saddle point su un tratto 1D: nell’esempio si usa una vera sella 2D; non si attribuiscono coordinate o formule al disegno."],
    obs=[("assumption", "ℓ è C¹ nell’intorno del minimo locale z⋆; allora ∇ℓ(z⋆)=0.", "First order necessary condition"),
         ("equation", "Con ℓ C², la Hessiana al minimo è positiva semidefinita, ∇²ℓ(z⋆)≥0.", "positive semidefinite"),
         ("definition", "I punti con gradiente nullo sono stazionari; includono minimi, massimi e selle.", "stationary points"),
         ("diagram", "Il disegno qualitativo mostra un minimo globale stretto, massimo locale, minimi piatti e un punto stazionario non minimo etichettato saddle point.", None)],
    formulas=[formula("opt08-necessary", r"\nabla\ell(z^\star)=0,\qquad\nabla^2\ell(z^\star)\ge0", "Sono conseguenze del minimo locale sotto le ipotesi di regolarità. La freccia logica parte dal minimo, non dal semplice annullamento delle derivate.", "Leggere insieme FNC e SNC senza confonderle con condizioni sufficienti.", [(r"\ge0", "Positività semidefinita come forma quadratica, non confronto elemento per elemento.")], ["ℓ∈C¹ in B(z⋆,ε) per il gradiente; ℓ∈C² per la Hessiana."]),
      formula("opt08-stationary", r"\nabla\ell(\bar z)=0", "Stazionario significa che le variazioni del primo ordine si annullano; la geometria può ancora essere una valle, una cima o una sella.", "Separare l’etichetta stazionario da minimo.")],
    controls=[], prereq=[("Minimo locale", "È la premessa delle implicazioni.", [3]), ("Gradiente e Hessiana", "Sono gli oggetti controllati nelle condizioni.", [6])],
    example=("Cinque funzioni aggiunte al punto z=0", ["z₁²+z₂²: H=diag(2,2), minimo.", "z₁²−z₂²: H=diag(2,−2), sella.", "−z₁²−z₂²: H=diag(−2,−2), massimo.", "±(z₁⁴+z₂⁴): H=0 in entrambi i casi, ma minimo nel caso + e massimo nel caso −."], "Il massimo quartico supera FNC e SNC e rimane un massimo: le condizioni non sono sufficienti."),
    visual="Cinque preset sulla stessa griglia 2D/3D, punto fisso z=0, autovalori e verifiche FNC/SNC.",
    edges=[("H=0", "Semidefinita positiva non significa minimo; confrontare i due quartici."), ("Sella", "Gradiente zero ma una direzione di curvatura negativa."), ("Non derivabilità", "Le condizioni C¹/C² della fonte non si applicano senza le rispettive ipotesi.")]),
9: dict(title="Curvatura positiva: una garanzia locale", objective="Applicare la sufficienza del secondo ordine e riconoscerne i limiti.",
    explanation="Se ℓ∈C², il gradiente è nullo e la Hessiana è definita positiva, il punto è un minimo locale stretto. La conclusione non promette un minimo globale.",
    takeaway="Hessiana definita positiva: sufficiente per il minimo locale stretto, non necessaria e non garanzia globale.",
    scope=["La fonte enuncia sufficienza locale sotto C²; non richiede convessità globale e non enuncia un algoritmo."],
    obs=[("assumption", "ℓ è due volte continuamente differenziabile in B(z⋆,ε).","Let ℓ: Rd →R be twice continuously differentiable"),
         ("equation", "Le ipotesi puntuali sono ∇ℓ(z⋆)=0 e ∇²ℓ(z⋆)>0, con >0 inteso definita positiva.", "positive definite"),
         ("concept", "La conclusione è che z⋆ è un minimo locale stretto non vincolato.", "strict (unconstrained) local minimum")],
    formulas=[formula("opt09-sufficient", r"\nabla\ell(z^\star)=0,\quad\nabla^2\ell(z^\star)>0\quad\Longrightarrow\quad z^\star\text{ minimo locale stretto}", "La curvatura è positiva in ogni direzione non nulla: vicino al punto domina i termini di ordine superiore e fa aumentare il costo.", "Capire il ruolo congiunto di stazionarietà, C² e positività definita.", [(r">0", "Tutti gli autovalori della matrice simmetrica sono positivi.")], ["ℓ∈C² in un intorno aperto del punto."], details=["Il teorema è sufficiente, non necessario: un minimo quartico può avere Hessiana nulla."]),
      formula("opt09-example", r"\ell(z)=\tfrac12(z_1^2+\alpha z_2^2)+\beta z_2^4,\quad\nabla\ell(0)=0,\quad\nabla^2\ell(0)=\operatorname{diag}(1,\alpha)", "α governa la curvatura nell’origine. β modifica il costo lontano dal punto, lasciando invariati gradiente e Hessiana nell’origine.", "Separare garanzia locale, degenerazione e comportamento globale.", [(r"\alpha", "Secondo autovalore della Hessiana all’origine."), (r"\beta", "Coefficiente quartico, invisibile nella Hessiana all’origine.")], ["Famiglia polinomiale C∞; dominio R²."], "enrichment", details=["Per α>0 il teorema garantisce un minimo locale stretto anche se β<0 rende il costo illimitato inferiormente."])],
    controls=[control("opt09-curvature", "Curvatura al punto", r"\alpha", -1, 2, 1, .1, "Modifica il secondo autovalore della Hessiana e la validità della condizione sufficiente."), control("opt09-quartic", "Termine di ordine quattro", r"\beta", -1, 1, -1, .1, "Cambia la forma lontano dall’origine senza cambiare gradiente e Hessiana nell’origine.")],
    prereq=[("Condizioni necessarie", "Per distinguere la nuova implicazione sufficiente.", [8]), ("Positività definita", "Significa curvatura positiva in ogni direzione.", [])],
    example=("α=1, β=−1", ["H(0)=diag(1,1)>0: origine minimo locale stretto.", "ℓ(0,1)=−0.5<ℓ(0,0)=0: non è globale.", "Con α=0, β>0 l’origine è comunque minimo stretto, ma il test sufficiente è inconclusivo."], "La proprietà è locale e il fallimento del test non nega automaticamente il minimo."),
    visual="Superficie/contour della stessa famiglia con origine e punto di confronto (0,1); autovalori e conclusione locale.",
    edges=[("α=0, β>0", "Minimo stretto con Hessiana solo semidefinita: sufficienza non necessaria."), ("α=0, β=0", "Minimi non stretti lungo z₁=0."), ("α<0", "Sella nell’origine, qualunque β."), ("α>0, β<0", "Minimo locale stretto ma costo non limitato inferiormente.")]),
}

# Each preset has its own explained equation, rather than a generic formula note.
for i, (latex, hessian, description) in enumerate([
    (r"z_1^2+z_2^2", r"\operatorname{diag}(2,2)", "La curvatura è positiva in tutte le direzioni: l’origine è un minimo globale stretto."),
    (r"z_1^2-z_2^2", r"\operatorname{diag}(2,-2)", "La funzione sale lungo z₁ e scende lungo z₂: il punto è una sella."),
    (r"-z_1^2-z_2^2", r"\operatorname{diag}(-2,-2)", "La curvatura è negativa in tutte le direzioni: l’origine è un massimo globale stretto."),
    (r"z_1^4+z_2^4", "0", "Il costo cresce fuori dall’origine, pur avendo Hessiana nulla nel punto: minimo stretto degenere."),
    (r"-z_1^4-z_2^4", "0", "Il costo diminuisce fuori dall’origine: massimo stretto con gradiente e Hessiana nulli. FNC e SNC non bastano."),
]):
    P[8]["formulas"].append(formula(f"opt08-preset-{i}", rf"\ell(z)={latex},\quad\nabla\ell(0)=0,\quad\nabla^2\ell(0)={hessian}", description,
        "Interpretare un caso esplicito della famiglia di controesempi.", assumptions=["Funzione polinomiale C∞ su R²; candidato fisso nell’origine."], origin="enrichment"))
    P[8]["formulas"][-1]["displayLatex"] = rf"\begin{{gathered}}\ell(z)={latex},\quad\nabla\ell(0)=0\\\nabla^2\ell(0)={hessian}\end{{gathered}}"

CHOICES = {
    3: [("Punto da classificare", "s", "Pozzo sinistro / pozzo destro / cima intermedia", "Pozzo sinistro",
         "Cambia il punto evidenziato, il costo e la classificazione; la funzione e i suoi punti critici restano fissi.")],
    4: [("Punto del profilo", "s", "−2 / 0 / 2.5", "2.5",
         "Cambia il punto evidenziato, il valore e la classificazione, senza modificare il profilo."),
        ("Funzione visualizzata", r"\sigma", "ℓ / −ℓ", "ℓ",
         "Inverte il segno del costo e scambia minimi e massimi; coordinate e scala verticale restano fisse.")],
    7: [("Cella selezionata", "(i,j)", "i=1,2; j=1,2,3", "(1,2)",
         "Evidenzia la derivata (i,j) nel gradiente del corso e (j,i) nel Jacobiano; i valori matematici restano invariati.")],
    8: [("Funzione dell’esempio", "s", "Minimo quadratico / sella / massimo quadratico / minimo quartico piatto / massimo quartico piatto", "Sella",
         "Cambia funzione, superficie, livelli, formula, autovalori e classificazione; il candidato resta z=0.")],
}

def make_analysis(n, meta, spec, corpus):
    request = build_request(DATA, spec, corpus)
    text = (SOURCE / f"pages/{n:04}/text.txt").read_text(encoding="utf-8")
    width, height = spec["source"]["geometry"]["width_pt"], spec["source"]["geometry"]["height_pt"]
    body = [20, 28, width-10, height-14]
    observations = []
    for k, (category, description, quote) in enumerate(meta["obs"], 1):
        assert quote is None or quote in text, (n, quote)
        observations.append(dict(id=f"s{k:02}", category=category, description=description, confidence=1,
            evidence=dict(page_id=spec["page_id"], modality="visual" if quote is None else "both", text_quote=quote,
                          bbox=body if n not in (1,2) else [0,0,width,height])))
    observations += [dict(id="structure", category="structure", description="Titolo, disposizione e crediti/footer letti visivamente; nessun dato numerico dedotto dagli elementi decorativi.", confidence=1,
        evidence=dict(page_id=spec["page_id"], modality="visual", text_quote=None, bbox=[0,0,width,height]))]
    ids = [o["id"] for o in observations]
    source_math = [dict(latex=f["latex"], anchor=next((o[2] for o in meta["obs"] if o[2]), text.splitlines()[0]), notes="Trascrizione della fonte; le forme equivalenti aggiunte sono enrichment.")
                   for f in meta["formulas"] if f["origin"] == "source"]
    if n == 6:
        source_math.append(dict(latex=r"\nabla^2(r(z))=\begin{bmatrix}\frac{\partial^2 r(z)}{\partial z_1^2}&\cdots&\frac{\partial^2r(z)}{\partial z_1z_n}\\\vdots&\ddots&\vdots\\\frac{\partial r(z)}{\partial z_dz_1}&\cdots&\frac{\partial^2r(z)}{\partial z_d^2}\end{bmatrix}\in\mathbb R^{d\times d}",
            anchor="Hessian matrix of a function", notes="SOURCE_LITERAL: mantenuti z_n e numeratore ∂r al posto di ∂²r. Usare la correzione nella companion."))
    examples=[]
    enrichments=[dict(id="explanation", label="enrichment", type="explanation", proposal=meta["explanation"], source_observation_ids=ids),
                 dict(id="visual", label="enrichment", type="visualization_design", proposal=meta["visual"], source_observation_ids=ids)]
    if meta["example"]:
        title, derivation, outcome=meta["example"]
        enrichments.append(dict(id="example", label="enrichment", type="worked_example", proposal=title, source_observation_ids=ids))
        examples=[dict(id="example-1", origin="enrichment", purpose=meta["objective"], setup=title, parameters=[], derivation=derivation, expected_outcome=outcome,
                       limitations=meta["scope"], enrichment_id="example", source_observation_ids=ids)]
    active = bool(meta["controls"]) or n in (4,8)
    params=[dict(name=c["label"], symbol=c["symbol"], origin="enrichment", range=str(c["domain"]), default=str(c["default"]), effect_on_change=c["effect"], edge_cases=[e[0] for e in meta["edges"]]) for c in meta["controls"]]
    params += [dict(name=name, symbol=symbol, origin="enrichment", range=domain, default=default,
                    effect_on_change=effect, edge_cases=[e[0] for e in meta["edges"]])
               for name,symbol,domain,default,effect in CHOICES.get(n,[])]
    if active: enrichments.append(dict(id="interaction", label="enrichment", type="interaction_design", proposal="Controlli dichiarati nel piano: "+meta["visual"], source_observation_ids=ids))
    plan=dict(source_scope_limits=meta["scope"], prerequisites=[dict(concept=c,why=w,origin="source_context" if ps else "enrichment",page_numbers=ps) for c,w,ps in meta["prereq"]],
        source_math=source_math,enrichments=enrichments,examples=examples,example_omission_reason=None if examples else "Copertina/divisorio senza contenuto tecnico da esemplificare numericamente.",
        visualization=dict(component="FunctionExplorer" if n in (6,8,9) else "MatrixVisualizer" if n==7 else "SceneViewport" if n in (3,4,5) else "ModelDiagram", description=meta["visual"],origin="enrichment",source_observation_ids=ids),
        interactivity=dict(recommended=active,rationale="L’effetto parametrico isola il concetto della pagina." if active else "Mappa concettuale statica: nessuna dinamica inventata.",component="ParameterControl" if active else None,parameters=params,outputs=[meta["objective"]],invariants=meta["scope"],enrichment_id="interaction" if active else None),
        edge_cases=[dict(case=c,expected_behavior=b,origin="enrichment",source_observation_ids=ids) for c,b in meta["edges"]],
        expansion_rationale="Un focus principale, una figura e dettagli su richiesta consentono una singola companion leggibile; nessuna riduzione tipografica.",
        blueprint=[dict(companion_suffix=None,focus=meta["objective"],source_observation_ids=ids,enrichment_ids=[e["id"] for e in enrichments])])
    contexts=[]
    for key,role in [("previous_page_id","previous"),("next_page_id","next")]:
        neighbor=spec["context"][key]
        if neighbor:
            number=corpus[neighbor]["source"]["physical_page_number"]
            note=(P[number]["objective"] if number in P else "La pagina 10 introduce gli insiemi convessi; non è ancora contenuto della pagina 9.")
            contexts.append(dict(page_id=neighbor,role=role,note=note))
    progression=dict(assessment="progressive" if n==4 else "unique",related_page_ids=[f"{DOC}:p0003"] if n==4 else [],
        added=["Rappresentazione geometrica e remark su −ℓ."] if n==4 else [], removed=["Elenco testuale delle quattro definizioni."] if n==4 else [],changed=[],observation_ids=ids,
        rationale="La pagina 4 riprende il problema della 3 ma sostituisce le definizioni con una figura e una nuova remark; le due pagine restano distinte." if n==4 else "Contenuto distinto dalle vicine: non eliminare o accorpare la pagina.")
    result=dict(protocol_version="1.0.0",request_sha256=request["request_sha256"],page_id=spec["page_id"],pdf_sha256=spec["source"]["pdf_sha256"],artifact_sha256={k:spec["artifacts"][k]["sha256"] for k in ("text","layout","render")},
        agent=dict(provider="OpenAI",model="GPT-6 (Codex session)",run_id="optimization-batch-a-2026-10-18"),
        inspection=dict(text_page_ids=request["required_page_ids"],layout_page_ids=request["required_page_ids"],image_page_ids=request["required_page_ids"],source_content_treated_as_data=True),
        title=spec["identity"]["title"],observations=observations,contextual_role=meta["objective"],context_notes=contexts,
        notation=[dict(symbol=f["latex"],meaning=f["conceptualExplanation"],observation_ids=ids) for f in meta["formulas"] if f["origin"]=="source"],
        uncertainties=[dict(description="Refusi visibili nella Hessiana; risolti dalla policy source_warning senza alterare il letterale.",blocking=False,observation_ids=ids)] if n==6 else [],
        progression=progression,coverage=dict(all_visible_regions_accounted_for=True,regions=[dict(bbox=[0,0,width,28],description="Titolo o spazio della copertina.",observation_ids=["structure"]),dict(bbox=[0,28,width,height-14],description="Tutto il contenuto, incluse formule, grafici, affiliazione e remark quando presenti.",observation_ids=ids),dict(bbox=[0,height-14,width,height],description="Footer e decorazione, o spazio bianco finale.",observation_ids=["structure"])]),
        companionPageCount=1,didactic_plan=plan,mapping_recommendation=dict(mode="one_to_one",rationale=plan["expansion_rationale"],subpages=[]))
    validate_result(result,spec,corpus,DATA)
    return result

def visualization(n, meta):
    three=n in (6,8,9)
    axes=[dict(symbol=s,label=s,unit="1" if k<2 else "valore",role="decision" if k<2 else "cost",domain="Dominio visualizzato dell’esempio") for k,s in enumerate(("z₁","z₂","r(z)" if n==6 else "ℓ(z)"))]
    return dict(visualizationMode="3D_PRIMARY_WITH_2D" if three else "2D_ONLY",
        visualizationSemantics=dict(xAxis=axes[0] if three else None,yAxis=axes[1] if three else None,zAxis=axes[2] if three else None,zMeaning="Valore della funzione, non quota fisica." if three else None,derivedDimension=three,coordinateSpace="decision_function" if three else "conceptual_or_2d",physicalStateDimensionAdded=False,physicalModelChanged=False,explanation=meta["visual"],mathematicalDefinition=next((f["latex"] for f in meta["formulas"] if f["origin"]=="enrichment"),None)),
        threeDRequirements=dict(enabled=three,cameraControls=["orbit","pan","zoom","reset"] if three else [],coordinateReadout=three,tooltip=three,highlightCurrentPoint=three,realtimeParameters=[c["id"] for c in meta["controls"]],parameterEffects={c["id"]:c["effect"] for c in meta["controls"]},surface=dict(enabled=three,renderModes=["surface"],formula=None,dataPolicy="Stessa griglia e stessi parametri nelle viste 2D/3D.",discontinuities="Nessuna per i polinomi usati.",contourProjection="Livelli della stessa funzione."),trajectory=dict(enabled=False,definition=None,kind="none",interpolation="none",currentPoint="Punto decisionale, non tempo fisico."),vectors=dict(enabled=n==6,reason="Direzione del gradiente nel piano." if n==6 else "Nessun vettore dinamico."),planes=[],projections=["contour"] if three else [],animation=dict(enabled=False,kind="none",semantics="Nessuna dinamica temporale inventata.",controls=[],onParameterChange=None),discontinuityHandling=dict(breakpoints=[],connectAcrossBreaks=False,rightBranchIncludesBreakpoint=False,appliesTo="none")),
        twoDRequirements=dict(enabled=True,plotType="contour" if three else "matrix" if n==7 else "curve" if n in (3,4,5) else "diagram",axes=[a["label"] for a in axes[:2]] if three else [],realtimeParameters=[c["id"] for c in meta["controls"]],projectionOf3D=three,relationshipTo3D="Stessi dati e punto corrente." if three else "Non richiede 3D.",preserveF04Readout=True),
        presentation=dict(strategy="toggle" if three else "single",defaultView="3D" if three else "2D",toggle=["2D","3D"] if three else [],sameDataAndParameters=True,camera=dict(projection="orthographic",initialAzimuthDeg=40,initialElevationDeg=30,resetOnlyCamera=True,unitsWarning="Assi di decisione e costo distinti; nessuna distanza fisica dedotta dalla prospettiva.",zeroRangePolicy="Dominio della griglia sempre non degenere.")),auditControls=[],reusableVisualizationComponents=["FunctionExplorer","SceneViewport","GraphicViewport"] if three else ["MatrixVisualizer"] if n==7 else ["SceneViewport"] if n in (3,4,5) else ["ModelDiagram"])

def main():
    manifest_path=DATA/"optimization_companion_manifest.json"
    if manifest_path.exists() and any(page["source_page"]>9 for page in read_json(manifest_path)["pages"]):
        raise ValueError("Questo supporto storico del batch A non deve sovrascrivere i batch successivi.")
    _,_,corpus=load_corpus(DATA)
    source_manifest=read_json(SOURCE/"manifest.json")
    output_pages=[]
    for n,meta in P.items():
        path=SOURCE/f"pages/{n:04}/page_spec.json"
        spec=read_json(path)
        result=make_analysis(n,meta,spec,corpus)
        if spec["analysis"]["result"] is not None and spec["analysis"]["result"]!=result:
            raise ValueError(f"p{n}: esiste un’analisi diversa, non sovrascritta")
        spec["analysis"]=dict(status="needs_review" if n==6 else "analyzed",result=result)
        spec["companionPageCount"]=1
        spec["companion_mapping"]["decision"]="proposed_after_analysis"
        warning=[]
        if n==6:
            literal=result["didactic_plan"]["source_math"][-1]["latex"]
            corrected=meta["formulas"][1]["latex"]
            short="⚠ Warning: possibile errore nella slide originale. Qui usiamo ∂²r e indice d."
            reason="La Hessiana di r:R^d→R è indicizzata i,j=1,…,d e contiene esclusivamente derivate seconde. L’elemento alto destro usa z_n senza n definito; quello basso sinistro omette il ² nel numeratore. La formula corretta segue la definizione e la simmetria sotto C² affermata dalla stessa pagina. Nessuna alterazione del letterale o della notazione ∇²(r(z))."
            issue=dict(issue_id="opt06-hessian-typos",source_issue_index=0,issue="Indice e ordine di derivazione nella Hessiana",type="CORRECTION_WARNING",source_expression=literal,corrected_expression=corrected,companion_uses=corrected,short_warning=short,correction_reason=reason,use_corrected_value_for_examples=True,use_corrected_value_for_simulation=True,resolved=True,source_references=["analysis/result/didactic_plan/source_math/1"],context_pages_consulted=[5,6,7],calculation_policy="Usare solo la Hessiana corretta nei calcoli, conservare SOURCE_LITERAL.",ui=dict(show=True,color="red",placement="Accanto alla formula della Hessiana",when="Formula o esempio Hessiana",student_text_field="short_warning"))
            spec["source_warning"]=dict(policy_version="1.0.0",scope="companion_only",type="CORRECTION_WARNING",review_status="resolved",original_analysis_sha256=sha256_bytes(json.dumps(result,ensure_ascii=False,sort_keys=True).encode()),issues=[issue],companion_overrides=[],technical_only_legacy_paths=[])
            warning=[dict(issue_id=issue["issue_id"],component="WarningBanner",text=short,color="red",adjacent_to="opt06-hessian",visible_when="Formula o esempio Hessiana")]
        validate_schema(spec,"page-spec.schema.json")
        write_json(path,spec)
        plan=result["didactic_plan"]
        vis=visualization(n,meta)
        examples=plan["examples"]
        output_pages.append(dict(source_page=n,source_pdf_label=spec["source"]["pdf_label"],page_id=spec["page_id"],companionPageCount=1,title=meta["title"],learning_objective=meta["objective"],prerequisite=plan["prerequisites"],key_ideas=[o[1] for o in meta["obs"]],intuitive_explanation=meta["explanation"],mathematical_explanation=meta["objective"],formulas_to_show=[dict(id=f["formulaId"],expression=f["latex"],origin=f["origin"],reference=spec["page_id"],computation_input=False) for f in meta["formulas"]],worked_example=dict(required=bool(examples),omission_reason=plan["example_omission_reason"],student_rendering="Esempio aggiunto" if examples else "Nessun esempio numerico necessario.",items=[{**e,"display_label":"Esempio aggiunto","mathematical_status":"Funzione esplicita verificabile; nessun dato numerico attribuito alla fonte."} for e in examples]),controls=[{k:v for k,v in c.items() if k!="effect"} for c in meta["controls"]],expected_parameter_effects=[dict(control_id=c["id"],effect=c["effect"],changes=[c["effect"]],output_context=["Grafico e letture dell’esempio"],invariants=meta["scope"],edge_cases=[e[0] for e in meta["edges"]]) for c in meta["controls"]],edge_cases=plan["edge_cases"],takeaway=meta["takeaway"],reusable_components=vis["reusableVisualizationComponents"],layout=dict(archetype="GRAPH_AND_CONTROLS" if n>=3 else "EXPLANATION",visual_block_order=["HEADER","EXPLANATION","FORMULA","MAIN_VISUAL","CONTROLS","WORKED_EXAMPLE","TAKEAWAY"],blocks=[]),source_warning=dict(type="CORRECTION_WARNING" if n==6 else "NO_WARNING",student_notices=warning),visualization=vis,interaction=dict(enabled=plan["interactivity"]["recommended"],effective_enabled=plan["interactivity"]["recommended"]),relation_to_previous_page=dict(source_page=n-1,role="Prerequisito o contesto immediato") if n>1 else None,relation_to_next_page=dict(source_page=n+1,role="Sviluppo successivo"),estimated_density=dict(level="MEDIUM" if n>=3 else "LOW",rationale="Un focus principale con approfondimenti facoltativi.",needs_typographic_validation=True),implementation_status="implemented_in_batch_A"))
        print(f"p{n}: analisi multimodale e progetto salvati",flush=True)
        progress=ROOT/"Docs/OPTIMIZATION_PROGRESS.md"
        s=progress.read_text(encoding="utf-8")
        s=s.replace(next(line for line in s.splitlines() if line.startswith("- Pagine con analisi completata:")),f"- Pagine con analisi completata: 1–{n}; p6 contiene refusi risolti nella policy companion quando presente. Le pagine fuori batch rimangono pending.")
        s=s.replace(next(line for line in s.splitlines() if line.startswith("- Pagina in lavorazione:")),f"- Pagina in lavorazione: {n}; analisi e progetto registrati, implementazione da completare.")
        progress.write_text(s,encoding="utf-8")
    architecture=read_json(DATA/"introduction_companion_manifest.json")
    manifest=dict(schema_version="1.0.0",document_id=DOC,course_title="Nonlinear Optimization",coverage_mode="incremental",source_page_count=81,source_pdf=dict(path="OPTCON-RL_optimization_2026_09_14.pdf",filename="OPTCON-RL_optimization_2026_09_14.pdf",sha256=source_manifest["source"]["sha256"] if "sha256" in source_manifest["source"] else source_manifest["source"]["pdf_sha256"]),
        GRAPHICS_REQUIREMENT="FULL_2D_AND_3D_SUPPORT",**{"3D_VISUALIZATION_POLICY":"Usare 3D per valori di funzioni di due decisioni e 2D per livelli degli stessi dati; nessuna profondità decorativa."},
        pages=output_pages,source_page_index=source_manifest["pages"],proposed_vertical_slice=[],visual_layout_system=architecture["visual_layout_system"],visualization_architecture=architecture["visualization_architecture"],warning_handling=dict(correction_pages=[6],info_pages=[],technical_fields_never_rendered=True,never_compute_known_erroneous_expression=True))
    write_json(DATA/"optimization_companion_manifest.json",manifest)
    dest=ROOT/"frontend/src/companion/optimization/formulaNotes.ts"
    dest.parent.mkdir(parents=True,exist_ok=True)
    dest.write_text("import type { FormulaExplanation } from '../../components/ExplainedEquation';\n".replace("../../components", "../../components")+"/** Individually authored source/enrichment explanations for Optimization batch A. */\nexport const optimizationFormulaNotes = "+json.dumps({n:m["formulas"] for n,m in P.items()},ensure_ascii=False,indent=2)+" as const satisfies Readonly<Record<number, readonly FormulaExplanation[]>>;\n",encoding="utf-8")

if __name__=="__main__":main()
