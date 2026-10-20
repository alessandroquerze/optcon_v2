"""Batch C authored analysis/design. Existing batches and all original artifacts are read-only."""
import importlib.util
import json
from pathlib import Path

def module(name, filename):
    loader=importlib.util.spec_from_file_location(name,Path(__file__).with_name(filename))
    result=importlib.util.module_from_spec(loader);loader.loader.exec_module(result)
    return result

B=module("batch_b_helpers","prepare-optimization-b.py")
A=B.A
ROOT,DATA,DOC,SOURCE=B.ROOT,B.DATA,B.DOC,B.SOURCE
formula,control=A.formula,A.control
read_json,write_json,validate_schema,sha256_bytes=B.read_json,B.write_json,B.validate_schema,B.sha256_bytes
SUPPORT=r"\ell(z_A)+\nabla\ell(z_A)^\top(z_B-z_A)"
QP=r"\min_{z\in\mathbb R^d}\frac12z^\top Qz+q^\top z,\quad Q=Q^\top"
QMODEL=r"Q=\begin{bmatrix}2&0\\0&\lambda\end{bmatrix},\quad q=\begin{bmatrix}-1\\b\end{bmatrix}"

P={
19:dict(title="Una parabola sostiene il costo",objective="Distinguere supporto affine e limite inferiore quadratico, con la stessa tangenza.",
 explanation="La convessità mette il costo sopra la tangente. Con forte convessità, anche una parabola di curvatura µ resta sotto il costo.",
 takeaway="Il supporto quadratico è una garanzia inferiore, non un’approssimazione senza verso.",
 obs=[("assumption","La prima implicazione richiede differenziabilità e convessità; la seconda µ-forte convessità.","If ℓis differentiable and convex"),
      ("equation","La prima disuguaglianza è un supporto affine, la seconda aggiunge µ/2 volte la distanza quadratica.","strong convexity imposes a quadratic lower bound"),
      ("diagram","Curva blu, supporto quadratico rosso e tangente nera tratteggiata condividono il punto (z_A,ℓ(z_A)); nessuna coordinata numerica.",None)],
 formulas=[formula("opt19-affine",r"\ell(z_B)\ge"+SUPPORT,"Per una funzione differenziabile e convessa, ogni tangente resta sotto il costo su tutto il dominio convesso.","Riconoscere il supporto affine.",assumptions=["ℓ differenziabile e convessa; dominio convesso."]),
  formula("opt19-lower",r"\ell(z_B)\ge"+SUPPORT+r"+\frac{\mu}{2}\|z_B-z_A\|^2","Con µ-forte convessità il costo supera la tangente almeno di un termine quadratico. Per punti coincidenti tutti i valori pareggiano.","Trasformare la curvatura minima in una garanzia sul costo.",[(r"\mu","Modulo di forte convessità con convenzione µ/2."),(r"z_A","Punto in cui costruire il supporto."),(r"z_B","Punto in cui verificare la garanzia.")],["Dominio convesso, ℓ differenziabile e µ-fortemente convessa, µ>0."]),
  formula("opt19-example",r"\ell(z)=\frac14z^2+\frac14z^4,\quad\mu=\frac12","La derivata seconda è 1/2+3z²≥1/2 su tutta ℝ: µ=1/2 è valido globalmente.","Dare coordinate al confronto senza attribuirle alla figura originale.",origin="enrichment")],
 controls=[control("opt19-a","Punto di tangenza","z_A",-.8,.8,-.4,.1,"Sposta tangente e supporto quadratico; costo e µ restano fissi."),
 control("opt19-b","Punto di confronto","z_B",-1.2,1.2,.9,.1,"Muove solo B e aggiorna costo, limite e margine.")],
 choices=[],prerequisites=[("Forte convessità","Normalizzazione µ/2 coerente con la pagina 19, conservando la policy della 16.",[16,18]),("Supporto affine","La tangente è un limite inferiore, non una secante.",[14])],
 example=("µ=0.5, z_A=−0.4 e z_B=0.9",["Calcolare ℓ(z_A)=0.0464 e ∇ℓ(z_A)=−0.264.","Il supporto quadratico in B vale 0.1257, il costo 0.366525.","Margine 0.240825≥0."],"La garanzia vale sul dominio intero, non soltanto sui campioni disegnati."),
 visual="Tre curve 2D su assi fissi: costo blu, supporto quadratico rosso e tangente tratteggiata; segmento verticale del margine in B.",
 edges=[("A=B","Costo e supporti coincidono, margine zero; nessuna divisione per distanza."),("µ","Il valore è fisso e validato globalmente, non stimato dal ritaglio.")]),
20:dict(title="Una parabola limita il costo dall’alto",objective="Leggere il limite L senza aggiungere un’ipotesi di convessità assente nella fonte.",
 explanation="Un gradiente L-Lipschitz impedisce al costo di superare il modello quadratico costruito in A. Non occorre che la funzione sia convessa.",
 takeaway="µ limita dal basso la curvatura; L controlla la variazione del gradiente e dà questo limite superiore.",
 obs=[("assumption","La fonte richiede differenziabilità e gradiente Lipschitz, senza ipotesi di convessità.","If ℓis differentiable with Lipschitz continuous gradient"),
      ("equation","Il termine quadratico superiore ha coefficiente L/2.","quadratic upper bound"),
      ("diagram","Parabola rossa sopra il costo blu e tangente nera tratteggiata nel punto condiviso (z_A,ℓ(z_A)); disegno qualitativo.",None)],
 formulas=[formula("opt20-upper",r"\ell(z_B)\le"+SUPPORT+r"+\frac L2\|z_B-z_A\|^2","Il gradiente L-Lipschitz garantisce che la parabola resti sopra il costo. Si integra la variazione del gradiente lungo il segmento; la convessità non è necessaria.","Costruire una maggiorazione quantitativa del costo.",[("L","Costante positiva di Lipschitz del gradiente.")],["ℓ differenziabile, gradiente L-Lipschitz; il segmento A–B appartiene al dominio."]),
 formula("opt20-example",r"\ell(z)=1-\cos z,\quad\nabla\ell(z)=\sin z,\quad L=1","Poiché |cos z|≤1, il gradiente sin z è 1-Lipschitz su tutta la retta. Il costo non è globalmente convesso.","Mostrare che regolarità del gradiente e convessità sono ipotesi diverse.",origin="enrichment",details=["La derivata seconda è negativa vicino a π: non dichiarare convesso questo esempio."])],
 controls=[control("opt20-a","Punto di tangenza","z_A",-1.2,1.2,-.4,.1,"Ricostruisce tangente e maggiorante, mantenendo fisso il costo e L=1."),
 control("opt20-b","Punto di confronto","z_B",-1.2,1.2,.9,.1,"Sposta B e aggiorna maggiorante, costo e margine superiore.")],
 choices=[],prerequisites=[("Gradiente Lipschitz","L controlla la variazione del gradiente, non è il valore della funzione.",[17]),("Limite inferiore","Confrontare il verso della disuguaglianza con pagina 19.",[19])],
 example=("L=1, A=−0.4, B=0.9",["Il maggiorante vale 1−cos(−0.4)+sin(−0.4)·1.3+1.3²/2.","Il costo vale 1−cos(0.9).","La differenza maggiorante−costo è non negativa."],"Anche fuori dalle regioni convesse di 1−cos z la maggiorazione resta valida."),
 visual="Costo blu, parabola superiore rossa e tangente tratteggiata; stessi ruoli dei punti della pagina 19, verso del margine invertito.",
 edges=[("A=B","Maggiorante e costo coincidono; margine zero."),("Regioni concave","La garanzia resta valida, non attribuire convessità globale al costo."),("L=0","Non previsto dal controllo; non dividere per L.")]),
21:dict(title="Convesso: un minimo locale è globale",objective="Comprendere la contraddizione geometrica e il ruolo di punti arbitrariamente vicini.",
 explanation="Se esistesse un punto migliore, il segmento verso quel punto porterebbe un costo più basso anche vicinissimo al presunto minimo locale.",
 takeaway="La convessità del dominio e del costo impedisce un minimo locale peggiore di un altro punto.",
 obs=[("assumption","L’enunciato richiede insieme Z convesso e funzione ℓ convessa; non richiede differenziabilità.","Let Z ⊂Rd be a convex set"),
      ("concept","Ogni minimo locale è anche globale; il teorema non afferma l’esistenza di un minimo.","local minimum of ℓis also a"),
      ("concept","La prova assume un global minimum z̄∈X con costo più basso, benché basti un qualunque punto migliore in Z.","there"),
      ("equation","La catena di Jensen è stretta per θ∈[0,1), e il punto interpolato tende a z⋆ quando θ tende a uno.","Using the definition of convexity")],
 formulas=[formula("opt21-literal",r"\exists\text{ global minimum }\bar z\in X:\quad\ell(\bar z)<\ell(z^\star)","La prova stampata introduce un minimo globale e usa X, mentre il dominio dell’enunciato è Z.","Conservare la premessa letterale, senza introdurla nella prova corretta."),
 formula("opt21-proof",r"\begin{aligned}\ell(\theta z^\star+(1-\theta)\bar z)&\le\theta\ell(z^\star)+(1-\theta)\ell(\bar z)\\&<\theta\ell(z^\star)+(1-\theta)\ell(z^\star)=\ell(z^\star)\end{aligned}","La convessità dà il primo confronto. Il punto migliore dà quello stretto se θ<1; con θ vicino a uno la contraddizione avviene in ogni intorno.","Mostrare perché un minimo soltanto locale non può essere peggiore."),
 formula("opt21-better",r"\exists\bar z\in\mathbb Z:\ \ell(\bar z)<\ell(z^\star),\quad\tilde z=\theta z^\star+(1-\theta)\bar z","Se il minimo locale non è globale, esiste un punto ammissibile migliore: non serve che quel punto sia un minimizzatore.","Usare la negazione corretta della globalità, nel dominio della proposizione.",origin="correction",assumptions=["Z convesso; ℓ convessa; z⋆ ipotizzato minimo locale."]),
  formula("opt21-example",r"\ell(z)=z^2,\quad z^\star=1\ \text{(candidato)},\quad\bar z=0,\quad\tilde z=\theta","Il candidato 1 non è minimo: per θ<1 il punto θ costa θ²<1 e tende a 1.","Visualizzare la contraddizione, senza chiamare minimo il candidato confutato.",origin="enrichment",details=["Nell’esempio il punto migliore è anche ottimo, ma la prova generale non usa questa proprietà.","Per mostrare l’assenza di esistenza automatica basta ℓ(z)=exp(z) su R: convessa, infimo zero non raggiunto."])],
 controls=[control("opt21-theta","Vicino al candidato",r"\theta",0,1,.8,.05,"Muove il punto da z̄=0 verso il candidato 1; aggiorna distanza e miglioramento, senza cambiare costo o estremi.")],
 choices=[],prerequisites=[("Convessità","Mantiene il segmento ammissibile e il costo sotto la corda.",[10,11]),("Minimo locale","Richiede un intorno favorevole: basta confutarlo con punti sempre più vicini.",[3])],
 example=("Candidato 1 per ℓ=z²; punto migliore 0",["Con θ=0.8, punto interpolato 0.8 e costo 0.64<1.","La distanza dal candidato è 0.2; il miglioramento è 0.36.","θ→1 da sinistra dà punti arbitrariamente vicini ancora migliori."],"A θ=1 il costo pareggia: non è il punto usato nella contraddizione."),
 visual="Curva e corda fra 0 e candidato 1; punto interpolato arancio, confronto con costo del candidato, distanza e miglioramento.",
 edges=[("θ=1","Candidato raggiunto: nessun miglioramento, la disuguaglianza stretta esclude questo estremo."),("Non esistenza del minimo","Il teorema è condizionale; non rende coerciva la funzione."),("θ prossimo a 1","Non arrotondare prematuramente il miglioramento positivo a zero.")]),
22:dict(title="Gradiente nullo: qui basta davvero",objective="Separare sufficienza globale, unicità ed esistenza nella minimizzazione convessa differenziabile.",
 explanation="Senza vincoli, convessità e differenziabilità rendono il gradiente nullo equivalente al minimo globale. L’unicità richiede ipotesi ulteriori.",
 takeaway="Con queste ipotesi, gradiente zero certifica un minimo globale; non certifica che sia unico.",
 obs=[("assumption","Il problema è non vincolato su R^d e ℓ è convessa; il gradiente implica differenziabilità, non esplicitata nella proposizione.","Let ℓ: Rd →R be a convex function"),
      ("equation","La proposizione enuncia minimo globale se e solo se ∇ℓ(z⋆)=0.","global minimum if and only if"),
      ("concept","La sufficienza sostituisce il gradiente nullo nel supporto affine; la necessità richiama FNC.","The converse is")],
 formulas=[formula("opt22-iff",r"z^\star\text{ minimo globale}\quad\Longleftrightarrow\quad\nabla\ell(z^\star)=0","Per un costo convesso e differenziabile su ℝᵈ, gradiente zero equivale al minimo globale. Esistenza e unicità richiedono altre ipotesi.","Usare un certificato globale con tutte le sue ipotesi.",assumptions=["Minimizzazione senza vincoli su R^d; ℓ convessa e differenziabile."]),
 formula("opt22-support",r"\ell(z)\ge\ell(z^\star)+\nabla\ell(z^\star)^T(z-z^\star)","Se il gradiente è zero, il termine lineare scompare: nessun punto ha costo minore. L’altro verso segue dalla necessità del primo ordine.","Capire perché la convessità rende sufficiente la stazionarietà."),
 *[formula("opt22-case-"+str(i),f,"I tre costi sono convessi su R; confrontare stazionarietà, curvatura e unicità senza confonderle.","Esempio esplicito sul certificato globale.",origin="enrichment",details=[d]) for i,(f,d) in enumerate([
 (r"\ell(z)=\frac12z^2,\quad\nabla\ell(z)=z","Minimo globale unico in zero, curvatura uno."),
 (r"\ell(z)=\frac14z^4,\quad\nabla\ell(z)=z^3","Minimo globale unico in zero, ma Hessiana nulla in zero: definita positività non necessaria."),
 (r"\ell(z)=0,\quad\nabla\ell(z)=0","Tutti i punti sono minimi globali non stretti; nessuna unicità.")])]],
 controls=[control("opt22-z","Punto candidato","z",-1.2,1.2,.6,.1,"Muove il candidato e aggiorna gradiente, costo e test; non cambia la funzione selezionata.")],
 choices=[("Costo","s","Quadratica / quartica / costante","Quadratica","Sostituisce costo e gradiente, conservando il punto; mostra unico minimo o intera retta.")],
 prerequisites=[("FNC","Senza convessità gradiente zero non basta.",[8]),("Minimi convessi","Locale implica globale, senza promessa di esistenza o unicità.",[21])],
 example=("Quadratica, quartica, costante",["In zero, le tre funzioni hanno gradiente nullo.","La quartica ha Hessiana zero ma minimo unico.","La funzione costante ha gradiente zero ovunque e infiniti minimi."],"Un costo convesso non differenziabile, come |z|, richiede altri strumenti: questo enunciato usa il gradiente."),
 visual="Curva e tangente al candidato; simbolo del minimo distinto dal candidato, una retta intera nel caso costante.",
 edges=[("z=0","Il gradiente nullo certifica sempre il minimo degli esempi."),("Costo costante","Ogni candidato è minimo; non evidenziare un unico ottimo."),("Derivabilità","Precisata vicino all’enunciato; non applicare il gradiente a |z| in zero.")]),
23:dict(title="Una matrice dà forma al costo",objective="Leggere Q simmetrica come curvatura e q come inclinazione di un problema quadratico.",
 explanation="La matrice simmetrica Q definisce la curvatura del costo; q aggiunge una parte lineare. La definizione non impone che Q sia positiva.",
 takeaway="Q fissa la curvatura; q inclina il costo.",
 obs=[("definition","La pagina introduce programmi quadratici senza vincoli; non impone Q≥0.","quadratic optimization problems"),
      ("equation","Il costo è 1/2 z^TQz+q^Tz; Q=Q^T∈R^{d×d} e q∈R^d.","with Q = QT")],
 formulas=[formula("opt23-problem",QP,"Q ha dimensione d×d ed è simmetrica; q e z sono colonne di d componenti. Nessuna positività di Q è richiesta dalla definizione.","Riconoscere decisione e coefficienti del programma quadratico.",[("Q","Matrice simmetrica della parte quadratica."),("q","Vettore della parte lineare."),("z","Decisione libera in R^d.")]),
 formula("opt23-example",QMODEL,"In due variabili, λ cambia la seconda curvatura; b inclina il costo lungo z₂.","Separare l’effetto di curvatura e termine lineare.",origin="enrichment",details=["ℓ(z)=z₁²+(λ/2)z₂²−z₁+bz₂; probe fisso (0.5,0.5).","λ<0 rende il costo illimitato inferiormente; λ=0 richiede b=0 per l’esistenza di un minimo.","Il modello diagonale non esaurisce tutte le matrici simmetriche, ma rende leggibili gli autovalori."])],
 controls=[control("opt23-lambda","Curvatura seconda",r"\lambda",-1,2,1,.25,"Deforma livelli e superficie e cambia la classificazione di Q; q e sonda restano fissi."),
 control("opt23-b","Inclinazione seconda","b",-.5,.5,-.25,.125,"Sposta i livelli e il costo alla sonda; Q, curvature e sonda restano fissi.")],
 choices=[],prerequisites=[("Prodotto quadratico","Produce uno scalare da una matrice simmetrica e una decisione.",[6]),("Geometria del costo","Le curve di livello rappresentano valori uguali di ℓ.",[11])],
 example=("Q=diag(2,1), q=(−1,−0.25)",["Alla sonda (0.5,0.5), ℓ=−0.25.","La seconda curvatura è 1: Q è positiva definita.","Spostare b inclina la valle; rendere λ negativo crea una sella."],"La definizione della fonte non garantisce l’esistenza di un minimo."),
 visual="Livelli 2D e superficie 3D della stessa quadratica; sonda arancio fissa, livelli/altezza mostrano separatamente λ e b.",
 edges=[("λ=0,b=0","Valle piatta e infiniti minimi; nessuna inversione singolare."),("λ=0,b≠0","Deriva lineare, nessun minimo."),("λ<0","Curvatura negativa, nessuna falsa soluzione dal ritaglio.")]),
24:dict(title="Due condizioni, da verificare insieme",objective="Distinguere stazionarietà, semidefinita positività e compatibilità del sistema lineare.",
 explanation="Un minimo deve annullare Qz+q e avere Q≥0. La curvatura non negativa da sola non garantisce che il sistema abbia una soluzione.",
 takeaway="Servono entrambi: gradiente nullo e Q≥0. Poi il minimo è globale.",
 obs=[("equation","FNC: se z⋆ è minimo, ∇ℓ(z⋆)=0 implica Qz⋆+q=0.","First-order necessary"),
      ("equation","SNC: la Hessiana non negativa implica Q≥0; il simbolo indica ordine semidefinito, non entrate positive.","Second-order necessary"),
      ("concept","La fonte conclude solo che ammettere un minimo richiede Q≥0, dunque convexità dei QP che ammettono minimi.","A necessary condition for the existence")],
 formulas=[formula("opt24-first",r"\nabla\ell(z^\star)=0\ \Longrightarrow\ Qz^\star+q=0","La derivata del costo quadratico con Q simmetrica è Qz+q: al minimo deve annullarsi.","Verificare il primo ordine su un candidato."),
 formula("opt24-second",r"\nabla^2\ell(z^\star)\ge0\ \Longrightarrow\ Q\ge0","La Hessiana è Q in ogni punto. Q≥0 significa semidefinita positiva: nessuna direzione ha curvatura negativa.","Leggere l’ordine matriciale del corso senza confonderlo con un confronto fra entrate."),
 formula("opt24-joint",r"Q\ge0,\quad Qz^\star+q=0","Se entrambi i controlli sono soddisfatti, la convessità certifica un minimo globale. La compatibilità del sistema esclude una deriva lineare nelle direzioni piatte.","Collegare le condizioni necessarie alla sufficienza spiegata nella pagina successiva.",origin="enrichment"),
 formula("opt24-example",QMODEL,"Q e q restano fissi nello scenario; la sonda percorre la retta (0.5,t).","Mostrare perché ciascuno dei due controlli serve.",origin="enrichment",details=["Q=diag(2,1), q=(−1,−0.5): minimo unico (0.5,0.5).","Q=diag(2,0), q=(−1,0): minimi (0.5,t), t reale.","Q=diag(2,0), q=(−1,0.5): nessuna soluzione stazionaria, deriva verso z₂→−∞.","Q=diag(2,−1), q=(−1,0): (0.5,0) è stazionario ma è una sella."])],
 controls=[control("opt24-t","Coordinata della sonda","t",-2,2,.5,.25,"Muove la sonda lungo z₁=0.5; aggiorna gradiente e costo, conservando Q e q del caso scelto.")],
 choices=[("Scenario","s","PD / PSD compatibile / PSD deriva / indefinita","PD","Sostituisce Q e q, aggiorna entrambe le viste e i certificati; conserva t.")],
 prerequisites=[("Derivata del costo quadratico","Con Q simmetrica, gradiente Qz+q e Hessiana Q.",[23]),("Necessarie non bastano in generale","Per le quadratiche i due controlli insieme consentono il passo ulteriore.",[8,22])],
 example=("Q=diag(2,0)",["Con q=(−1,0), il sistema è risolto da ogni (0.5,t).","Con q=(−1,0.5), la seconda equazione è 0.5=0: impossibile.","Q≥0 in entrambi i casi, ma nel secondo il costo tende a −∞ lungo z₂→−∞."],"Nessuna conclusione di esistenza dal solo segno della Hessiana."),
 visual="Livelli e superficie condivisi; sonda lungo una retta, insieme dei minimi verde se presente, punto stazionario viola se è una sella.",
 edges=[("PSD incompatibile","Nessun punto stazionario; non inventare una pseudoinversa che cancelli q."),("Indefinita e t=0","Residuo nullo ma sella, non minimo."),("PSD compatibile","Intera retta di minimi, residuo zero per ogni t.")]),
25:dict(title="Quando la soluzione è unica",objective="Applicare l’inversa soltanto a Q definita positiva e rappresentare correttamente la singolarità.",
 explanation="Con Q>0 il sistema stazionario ha una sola soluzione. Se Q è singolare, possono esistere infiniti minimi oppure una deriva senza minimo.",
 takeaway="Q>0 dà z⋆=−Q⁻¹q. Se Q è singolare, verifica la compatibilità: non usare l’inversa.",
 obs=[("concept","La frase introduttiva dice che i quadratic programs sono convex; pagina 24 limita l’affermazione a quelli che ammettono un minimo.","Since quadratic programs are convex program"),
      ("concept","Il riquadro importante dice che le condizioni necessarie sono sufficienti e i minimi globali; occorrono congiuntamente primo e secondo ordine.","necessary conditions of optimality are also sufficient"),
      ("equation","Q>0 garantisce esistenza e unicità del minimo globale z⋆=−Q⁻¹q.","If Q > 0")],
 formulas=[formula("opt25-unique",r"Q>0\quad\Longrightarrow\quad z^\star=-Q^{-1}q","Q>0: curvatura positiva in ogni direzione, inversa definita e minimo globale unico.","Sapere quando la formula con inversa è lecita.",assumptions=["Q=Qᵀ e Q>0; problema senza vincoli su R^d."]),
 formula("opt25-scope",r"z^\star\text{ minimo globale}\quad\Longleftrightarrow\quad Q\ge0\ \text{e}\ Qz^\star+q=0","Per una matrice simmetrica, i due controlli insieme sono necessari e sufficienti. Non tutti i programmi quadratici sono convessi.","Precisare l’ambito della frase iniziale senza attribuire convessità a Q indefinite.",origin="correction"),
 formula("opt25-example",QMODEL,"λ>0: minimo in (1/2,−b/λ). A λ=0 conta la compatibilità di q.","Collegare unicità, singolarità e termine lineare nello stesso modello.",origin="enrichment"),
 formula("opt25-complete",r"\ell(z)-\ell(z^\star)=\frac12(z-z^\star)^\top Q(z-z^\star)\quad(Qz^\star+q=0)","Completare il quadrato elimina la parte lineare attorno a un punto stazionario. Q≥0 rende lo scarto non negativo; Q>0 lo rende positivo fuori dal minimo.","Giustificare globalità e unicità, non solo calcolare un’inversa.",origin="enrichment")],
 controls=[control("opt25-b","Inclinazione seconda","b",-.5,.5,-.25,.125,"Sposta il minimo quando Q>0; nel caso singolare crea o elimina la deriva. Q resta fissa.")],
 choices=[("Curvatura di Q","s","λ=2 / λ=0.5 / λ=0","λ=2","Cambia la geometria e la validità dell’inversa; conserva b. Le tre opzioni hanno valori espliciti, senza clamp nascosti.")],
 prerequisites=[("Condizioni congiunte","Q≥0 e sistema compatibile sono entrambi necessari.",[24]),("Invertibilità","Q>0 garantisce inversa e soluzione unica.",[6,23])],
 example=("λ=2, b=−0.25",["z⋆=(0.5,0.125); costo minimo −0.265625.","Con λ=0.5, lo stesso b porta z⋆=(0.5,0.5).","Con λ=0 e b=0 si ottiene una retta di minimi; con b≠0 nessun minimo."],"Non attribuire un unico minimizzatore al caso singolare compatibile."),
 visual="Livelli 2D e superficie 3D, minimo verde o intera retta verde; lettura dinamica della soluzione e del valore minimo, messaggio esplicito se non esistono.",
 edges=[("λ=0,b=0","Infiniti minimi: mostrare insieme, non una finta soluzione unica."),("λ=0,b≠0","Nessuna inversa né minimo; spiegare la direzione di fuga."),("Piccola curvatura","Il minimo si sposta più per lo stesso b; scala fissa fra le opzioni.")]),
}

def warning(n,text):
    if n==21:
        literal=text[text.index("Then there"):text.index("Using the definition")].strip()
        return ("CORRECTION_WARNING",literal,P[n]["formulas"][2]["latex"],
            "⚠ Warning: possibile errore nella slide originale. Basta un punto migliore in Z, non un minimo globale.",
            "La negazione di globalità fornisce un punto ammissibile di costo inferiore, non garantisce esistenza di un minimizzatore globale. Il dominio dell’enunciato è Z; X nella prova non è definito. Sostituire solo questa premessa nella companion. La catena di Jensen è corretta per θ<1, e θ→1− contraddice la minimalità locale. Nessuna ipotesi di esistenza/coercività o differenziabilità va aggiunta.")
    if n==22:
        return ("INFO_WARNING","Let ℓ: Rd →R be a convex function.",r"\ell:\mathbb R^d\to\mathbb R\text{ convessa e differenziabile}",
            "Nota: il criterio con il gradiente richiede anche differenziabilità.",
            "La proposizione usa ∇ℓ e la caratterizzazione al primo ordine senza esplicitare differenziabilità: assunzione implicita precisata nella companion. Non è un’estensione a costi convessi non differenziabili.")
    if n==25:
        return ("CORRECTION_WARNING",text[text.index("Since quadratic"):text.index("Important")].strip(),P[n]["formulas"][1]["latex"],
            "⚠ Warning: possibile errore nella slide originale. Per la sufficienza usiamo insieme Q≥0 e Qz⋆+q=0.",
            "La definizione di pagina 23 impone simmetria, non positività. Una quadratica con Q indefinita non è convessa: la frase iniziale, letta senza la restrizione del contesto di pagina 24 ai QP che ammettono minimi, è troppo generale. Per matrice simmetrica, un punto è minimo se e solo se Q è PSD e soddisfa Qz+q=0. Q PSD da sola non garantisce esistenza: occorre −q nell’immagine di Q; altrimenti una direzione nulla con componente lineare non nulla dà −∞. Q PD implica esistenza, unicità e formula inversa come stampato. La companion esplicita entrambe le condizioni; nessuna correzione alla formula inversa sotto Q>0.")
    return None

def analyze(n,m,spec,corpus):
    # Reuse the validated evidence/analysis protocol; customize context and progression for this batch.
    B.P={**P,18:dict(objective="Forte convessità e gradiente Lipschitz danno un limite congiunto, nella convenzione µ/2."),
         26:dict(objective="Pagina divisoria: algoritmi di ottimizzazione non vincolata. Solo contesto; non implementata.") }
    B.warning=warning
    result,issue=B.analyze(n,m,spec,corpus)
    progressive=n in (20,22,24,25)
    result["agent"]["run_id"]="optimization-batch-c-2026-10-18"
    result["progression"]=dict(assessment="progressive" if progressive else "unique",
        related_page_ids=[f"{DOC}:p{n-1:04}"] if progressive else [],
        added=[m["objective"]] if progressive else [],removed=[],
        changed=["Nuova ipotesi, verso del limite o conseguenza: non eliminare la pagina."] if progressive else [],
        observation_ids=[o["id"] for o in result["observations"]],
        rationale="Sviluppo distinto di una famiglia concettuale, non duplicazione eliminabile." if progressive else "Pagina con enunciato e scopo autonomi.")
    if n in (23,24,25):result["didactic_plan"]["visualization"]["component"]="FunctionExplorer"
    # Formula 22's implicit differentiability is an informational clarification, not a formula override.
    B.validate_result(result,spec,corpus,DATA)
    return result,issue

def main():
    path=DATA/"optimization_companion_manifest.json";manifest=read_json(path)
    if any(p["source_page"]>25 for p in manifest["pages"]):raise ValueError("Non riscrivere batch futuri.")
    if any(p.get("implementation_status")=="implemented_in_batch_C" for p in manifest["pages"]):raise ValueError("Batch C consolidato: non rigenerare.")
    preserved=[p for p in manifest["pages"] if p["source_page"]<=18]
    assert [p["source_page"] for p in preserved]==list(range(1,19))
    _,_,corpus=B.load_corpus(DATA);pages=[]
    for n,m in P.items():
        dest=SOURCE/f"pages/{n:04}/page_spec.json";spec=read_json(dest)
        result,issue=analyze(n,m,spec,corpus)
        old=spec["analysis"]["result"]
        if old:
            assert old["agent"]["run_id"]==result["agent"]["run_id"]
            assert old["observations"]==result["observations"],"Fonte osservata immutabile"
            assert old["didactic_plan"]["source_math"]==result["didactic_plan"]["source_math"],"SOURCE_LITERAL immutabile"
        spec["analysis"]=dict(status="needs_review" if issue else "analyzed",result=result)
        spec["companionPageCount"]=1;spec["companion_mapping"]["decision"]="proposed_after_analysis"
        notices=[]
        if issue:
            kind,literal,corrected,short,reason=issue
            anchor=next((f["formulaId"] for f in m["formulas"] if f["origin"]=="correction"),m["formulas"][0]["formulaId"])
            item=dict(issue_id=f"opt{n}-source-review",source_issue_index=0,issue=m["title"],type=kind,source_expression=literal,
                corrected_expression=corrected,companion_uses=corrected,short_warning=short,correction_reason=reason,
                use_corrected_value_for_examples=True,use_corrected_value_for_simulation=True,resolved=True,
                source_references=["analysis/result/observations"],context_pages_consulted=[n-1,n,n+1],
                calculation_policy="SOURCE_LITERAL immutabile; esempi e calcoli usano le ipotesi e le formule companion dichiarate.",
                ui=dict(show=True,color="red",placement="Accanto all’enunciato interessato",when="Concetto pertinente",student_text_field="short_warning"))
            spec["source_warning"]=dict(policy_version="1.0.0",scope="companion_only",type=kind,review_status="resolved",
                original_analysis_sha256=sha256_bytes(json.dumps(result,ensure_ascii=False,sort_keys=True).encode()),
                issues=[item],companion_overrides=[],technical_only_legacy_paths=[])
            notices=[dict(issue_id=item["issue_id"],component="InfoNote" if kind=="INFO_WARNING" else "WarningBanner",text=short,color="red",adjacent_to=anchor,visible_when="Enunciato pertinente")]
        validate_schema(spec,"page-spec.schema.json");write_json(dest,spec)
        p=json.loads(json.dumps(preserved[4]))
        three=n>=23
        vis=A.visualization(8 if three else 3,dict(visual=m["visual"],controls=m["controls"],formulas=m["formulas"]))
        if three:
            vis["visualizationMode"]="2D_PRIMARY_WITH_3D";vis["presentation"]["defaultView"]="2D"
            vis["visualizationSemantics"]["zAxis"].update(label="ℓ(z)",symbol="ℓ(z)",role="cost")
            vis["visualizationSemantics"]["zMeaning"]="Valore della stessa quadratica: altezza in 3D, colore e livelli in 2D."
            vis["twoDRequirements"].update(plotType="contour",relationshipTo3D="Stesso costo, stessi parametri, stessi punti e insieme dei minimi; livelli della superficie.",projectionOf3D=True,axes=["z₁ [1]","z₂ [1]"])
            vis["reusableVisualizationComponents"]=["FunctionExplorer","SceneViewport","SurfacePlot3D"]
        else:
            vis["visualizationSemantics"]["xAxis"]=dict(symbol="z",label="z",unit="1",role="decision",domain="Intervallo fisso dell’esempio.")
            vis["visualizationSemantics"]["yAxis"]=dict(symbol="ℓ(z)",label="ℓ(z)",unit="valore",role="cost",domain="Scala fissa dell’esempio; non una garanzia fuori dal modello.")
            vis["twoDRequirements"].update(axes=["z [1]","ℓ(z) [valore]"],plotType="curve")
        p.update(source_page=n,source_pdf_label=spec["source"]["pdf_label"],page_id=spec["page_id"],companionPageCount=1,title=m["title"],
            learning_objective=m["objective"],prerequisite=result["didactic_plan"]["prerequisites"],
            key_ideas=[o[1] for o in m["obs"]],intuitive_explanation=m["explanation"],mathematical_explanation=m["objective"],
            formulas_to_show=[dict(id=f["formulaId"],expression=f["latex"],origin=f["origin"],reference=spec["page_id"],computation_input=False) for f in m["formulas"]],
            worked_example=dict(required=True,omission_reason=None,student_rendering="Esempio aggiunto",items=[{**result["didactic_plan"]["examples"][0],"display_label":"Esempio aggiunto","mathematical_status":"Modello analitico esplicito; nessun dato numerico attribuito alla fonte."}]),
            controls=[{k:v for k,v in c.items() if k!="effect"} for c in m["controls"]],
            expected_parameter_effects=[dict(control_id=c["id"],effect=c["effect"],changes=[c["effect"]],output_context=[m["visual"]],invariants=["Stesso modello in formule, grafici e valori."],edge_cases=[e[0] for e in m["edges"]]) for c in m["controls"]],
            edge_cases=result["didactic_plan"]["edge_cases"],takeaway=m["takeaway"],reusable_components=vis["reusableVisualizationComponents"],
            source_warning=dict(type=issue[0] if issue else "NO_WARNING",student_notices=notices),visualization=vis,
            interaction=dict(enabled=True,effective_enabled=True),relation_to_previous_page=dict(source_page=n-1,role="Contesto verificato"),
            relation_to_next_page=dict(source_page=n+1,role="Sviluppo successivo"),implementation_status="batch_C_in_progress")
        pages.append(p)
        progress=ROOT/"Docs/OPTIMIZATION_PROGRESS.md"
        lines=progress.read_text(encoding="utf-8").splitlines()
        progress.write_text("\n".join(f"- Pagina in lavorazione: {n}; analisi e progetto salvati, implementazione/revisione C in corso." if line.startswith("- Pagina in lavorazione:") else line for line in lines)+"\n",encoding="utf-8")
        print(f"p{n}: analisi e design validati",flush=True)
    manifest["pages"]=preserved+pages
    manifest["warning_handling"]["correction_pages"]=[p["source_page"] for p in manifest["pages"] if p["source_warning"]["type"]=="CORRECTION_WARNING"]
    manifest["warning_handling"]["info_pages"]=[p["source_page"] for p in manifest["pages"] if p["source_warning"]["type"]=="INFO_WARNING"]
    write_json(path,manifest)
    (ROOT/"frontend/src/companion/optimization/minimizationNotes.ts").write_text("import type {FormulaExplanation} from '../../components/ExplainedEquation';\nexport const minimizationFormulaNotes = "+json.dumps({n:m["formulas"] for n,m in P.items()},ensure_ascii=False,indent=2)+" as const satisfies Readonly<Record<number,readonly FormulaExplanation[]>>;\n",encoding="utf-8")

if __name__=="__main__":main()
