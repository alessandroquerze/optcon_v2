"""Individually inspected text/image and companion designs, physical pages 38–46 only."""
import importlib.util
from pathlib import Path
loader=importlib.util.spec_from_file_location("optimization_authoring",Path(__file__).with_name("optimization-authoring.py"))
H=importlib.util.module_from_spec(loader);loader.loader.exec_module(H)
formula,control=H.formula,H.control
UPDATE=r"z^{k+1}=z^k-\gamma^kD^k\nabla\ell(z^k)"
BOUNDS=r"d_1I\le D^k\le d_2I,\qquad d_1>0,\ d_2>0"
REJECT=r"\ell(z^k+\bar\gamma^id^k)\ge\ell(z^k)+c\bar\gamma^i\nabla\ell(z^k)^\top d^k"
ACCEPT=REJECT.replace(r"\ge",r"<")
SHRINK=r"\bar\gamma^{i+1}=\beta\bar\gamma^i,\qquad \gamma^k=\bar\gamma^i"
LIMIT=r"\nabla\ell(\bar z)=0"
SUBSEQ=r"z^{k_p}\to\bar z\quad\Longrightarrow\quad\nabla\ell(\bar z)=0"
COERCIVE=r"\lim_{\|z\|\to\infty}\ell(z)=+\infty"
LITERAL_SUBSEQ=r"\text{any subsequence }\{z^{k_p}\}\text{ converges to some stationary point }\bar z"
P={}
for n,title,focus in [
 (38,"Armijo: prova il passo iniziale","Il candidato iniziale può fallire il test di riduzione sufficiente."),
 (39,"Riduci il passo e riprova","Ridurre una volta non garantisce ancora l’accettazione."),
 (40,"Il primo passo che passa il test","Si accetta il primo candidato che soddisfa il confronto stretto della fonte.")]:
 key=f"opt{n}"
 P[n]=dict(title=title,objective=focus,
  explanation="Armijo confronta il costo reale con una frazione della diminuzione lineare prevista. Se il candidato non passa il test, lo moltiplica per β e riprova.",
  takeaway=["Il passo iniziale è una proposta: va confrontato con la soglia di Armijo.",
            "Ogni rifiuto moltiplica il passo per β; direzione e punto corrente restano fissi.",
            "Armijo accetta il primo passo sotto la soglia, senza cercare il passo ottimo."][n-38],
  obs=[("algorithm","Parametri iniziali: γ̄⁰>0, β∈(0,1), c∈(0,1); il while usa ≥, quindi l’uscita richiede <.","Armijo rule"),
       ("equation","A ogni rifiuto si usa γ̄^{i+1}=βγ̄^i; all’uscita γ^k=γ̄^i.","Step-size"),
       ("concept","L’idea è ridurre il costo facendo progresso; valori tipici β=0.7 e c=0.5.","Typical values"),
       ("diagram",[
           "Nella figura costo nero, tangente nera tratteggiata, soglia rossa tratteggiata e candidato blu γ̄⁰=1 sopra la soglia.",
           "Stessi algoritmo e curve della pagina precedente; il candidato blu è ora γ̄¹, ancora sopra la soglia rossa.",
           "Stessi algoritmo e curve; il candidato blu γ̄² è sotto la soglia rossa nel disegno. La fonte non assegna una funzione numerica alle curve."][n-38],None)],
  formulas=[
   formula(key+"-accept",ACCEPT,
    ["Si prova γ̄⁰=1. Il costo deve essere sotto la soglia: diminuire rispetto al solo valore iniziale non basta.",
     "Dopo un rifiuto il passo è β volte il precedente. Si ricalcola il costo e si ripete lo stesso confronto.",
     "Il while della fonte rifiuta anche l’uguaglianza. Si accetta il primo candidato strettamente sotto la soglia."][n-38],
    "Leggere l’uscita dal while senza cambiare la convenzione stretta.",origin="enrichment",
    assumptions=["Costo differenziabile e direzione di discesa, ∇ℓ(zᵏ)ᵀdᵏ<0; β,c interni a (0,1)."],
    details=["La condizione < è la negazione del ≥ stampato nel while, non una sostituzione con una diversa versione di Armijo.",
             "Con gradiente nullo si arresta prima della ricerca: il test stretto non deve generare un ciclo infinito.",
             "k conta le iterazioni esterne, i i tentativi di passo all’interno della stessa iterazione."]),
   formula(key+"-while",REJECT,"Il candidato viene rifiutato quando il suo costo è maggiore o uguale alla soglia di sufficiente diminuzione.","Conservare esattamente il test stampato."),
   formula(key+"-shrink",SHRINK,"β riduce geometricamente il candidato. All’uscita il valore corrente diventa il passo dell’iterazione esterna.","Separare tentativi i e iterazioni k."),
   formula(key+"-parameters",r"\bar\gamma^0>0,\quad\beta\in(0,1),\quad c\in(0,1)",
    "c determina la diminuzione richiesta; β determina quanto si riduce a ogni rifiuto. La fonte indica 0.7 e 0.5 come valori tipici.","Chiarire i ruoli dei due parametri."),
   formula(key+"-example",r"\ell(z)=z^2,\quad z^k=1,\quad d^k=-2",
    "Stesso esempio nelle tre pagine: punto e direzione restano fissi durante tutti i tentativi.","Fornire numeri alla figura qualitativa senza attribuirli alla fonte.",origin="enrichment"),
   formula(key+"-profile",r"\phi(\gamma)=(1-2\gamma)^2,\quad A(\gamma)=1-4c\gamma",
    "La curva blu è il costo effettivo; la retta rossa è la soglia. Il test equivale a 0<γ<1−c in questo esempio.","Verificare anche rifiuti al bordo con un confronto analitico.",origin="enrichment",
    details=["La tangente viola è 1−4γ. Il margine esatto φ−A è 4γ(γ−(1−c)).",
             "Con β=0.7,c=0.5: γ̄⁰=1 rifiutato, γ̄¹=0.7 rifiutato, γ̄²=0.49 accettato.",
             "Con β=c=0.5, γ=0.5 è un pareggio e viene rifiutato; il primo accettato è 0.25.",
             "Il minimo lungo la retta è γ=0.5; il test di Armijo non è una ricerca esatta del minimo."])],
  controls=[control(key+"-beta","Fattore di riduzione",r"\beta",.2,.9,.7,.05,"Ricalcola tutti i candidati moltiplicando per β; funzione, direzione e soglia fissata da c restano invariate."),
            control(key+"-c","Frazione richiesta","c",.05,.95,.5,.05,"Cambia soltanto la soglia e quindi il primo candidato accettabile; curva del costo e direzione restano fisse.")],
  choices=[("Tentativo","i","Da 0 al primo candidato accettato",str(n-38),"Seleziona un candidato già calcolato, senza applicare il passo esterno. Il default evidenzia iniziale/prima riduzione/accettazione secondo la pagina."),
           ("Prossimo tentativo","i+1","Disponibile fino all’accettazione","In pausa","Avanza di un solo rifiuto, senza animazioni di tempo fisico.")],
  prerequisites=[("Direzione di discesa","Assicura esistenza di passi sufficientemente piccoli accettabili.",[29,30]),
                 ("Modello e costo reale","Minimizzare un modello non basta a ridurre il costo originale.",[37])],
  example=("ℓ=z², zᵏ=1, dᵏ=−2; β=0.7,c=0.5",
           ["γ=1: costo 1, soglia −1, rifiutato.","γ=0.7: costo 0.16, soglia −0.4, rifiutato.","γ=0.49: costo 0.0004, soglia 0.02, accettato."],
           "Il punto finale accettato è 1−2×0.49=0.02. Non confondere il tentativo interno con una nuova linearizzazione."),
  visual="Profilo blu φ(γ), soglia rossa A(γ), tangente viola e candidati colorati, asse γ fisso [0,1.05]. Il candidato selezionato è evidenziato; margine e decisione coerenti col ≥ originale.",
  axes=("γ","Costo lungo la direzione","step_size"),
  scope=["La figura originale è qualitativa: non se ne ricavano coefficienti, curvature o coordinate numeriche.",
         "β,c modificano la ricerca, non la funzione scalare o il punto corrente.",
         "Il numero i di tentativi è distinto dall’iterazione k; si conserva una companion per ciascuna pagina fisica."],
  interaction_reason="Seguire ogni rifiuto mostra perché una riduzione può non bastare e come c/β cambiano accettazione e lavoro.",
  edges=[("Uguaglianza","Rifiutare il pareggio secondo il ≥ del while originale."),
         ("Candidato iniziale accettato","Fermarsi a i=0 senza riduzioni artificiali."),
         ("c vicino a 1","Richiede maggiore diminuzione, quindi passi più piccoli; β vicino a 1 può richiedere più tentativi."),
         ("Gradiente zero","Arresto prima del backtracking: il test stretto non è un criterio di continuazione a punto stazionario.")],
  progressive=n>38,
  progression=dict(assessment="progressive",related_page_ids=[f"{H.DOC}:p{x:04}" for x in (38,39,40) if x!=n],
   added=[focus],removed=[],changed=[f"Posizione del candidato blu: gamma barra apice {n-38}."],
   rationale="Tre rendering distinti della stessa slide 37/73; il nuovo candidato rende visibile un passaggio del backtracking. Non eliminarli come duplicati."))

P[41]=dict(title="Un passo piccolo può essere troppo piccolo",objective="Distinguere limite zero, somma infinita e quadrati sommabili delle successioni di passi.",
 explanation="Far tendere il passo a zero non basta: se la somma totale è finita, il progresso disponibile può esaurirsi. Il criterio sulle serie è asintotico, non si prova con pochi campioni.",
 takeaway="Passi decrescenti: tendere a zero e avere somma infinita sono richieste diverse.",
 obs=[("definition","Passo costante γ^k=γ>0; la frase usa t per l’indice della sequenza di γ^k.","Constant step-size"),
      ("assumption","Per passi decrescenti si richiedono γ^k→0 e somma infinita; viene segnalata lentezza tipica.","Diminishing step-size"),
      ("equation","Scelta tipica: somma dei passi infinita, somma dei quadrati finita; esempio 1/k^α con 1/2<α≤1. Gli indici delle somme sono t=0 pur usando k negli addendi.",None)],
 formulas=[
  formula("opt41-conditions",r"\gamma^k\to0,\qquad\sum_{t=0}^{\infty}\gamma^k=\infty",
   "Il passo svanisce, ma la somma totale deve restare infinita. Sono due condizioni distinte.","Preservare l’enunciato, chiarendo gli indici nel calcolo."),
  formula("opt41-constant",r"\gamma^k=\gamma>0","Il passo costante non svanisce. La sua efficacia richiede un valore adatto al problema.","Confrontare le famiglie di passi."),
  formula("opt41-squares",r"\sum_{t=0}^{\infty}\gamma^k=\infty,\qquad\sum_{t=0}^{\infty}(\gamma^k)^2<\infty",
   "La prima serie impone persistenza; la seconda limita l’accumulo dei quadrati. La fonte la presenta come scelta tipica.","Separare requisito e scelta più restrittiva."),
  formula("opt41-literal",r"\gamma^k=\frac1{k^\alpha},\qquad\frac12<\alpha\le1",
   "L’esempio letterale è definito per k≥1. Un indice iniziale finito non cambia il carattere delle serie.","Conservare la formula originale senza dividere per zero."),
  formula("opt41-shift",r"\gamma^k=\frac1{(k+1)^\alpha},\qquad k=0,1,\ldots",
   "Il traslato k+1 parte da zero senza cambiare il carattere delle serie.","Rendere l’esempio operativo sullo stesso indice delle iterazioni.",origin="correction",
   details=["Si assume α>0 nel controllo: tutte le successioni mostrate tendono a zero.",
            "Gli indici t e k della fonte si riferiscono alla medesima serie: nei calcoli l’indice muto è k.",
            "Le somme parziali sono finite per ogni N: i verdetti sulle serie derivano dal criterio analitico delle serie p.",
            "α>1 dà passi con somma finita; α=1/2 dà quadrati con serie armonica divergente."])],
 controls=[control("opt41-alpha","Esponente","\\alpha",.25,1.5,.75,.05,"Cambia l’intera successione e le due somme parziali; il numero di campioni resta fisso."),
           {**control("opt41-n","Campioni","N",10,100,40,10,"Estende la finestra finita senza cambiare α o la classificazione asintotica."),"domain":dict(min=10,max=100,step=10,integer=True)}],
 choices=[("Quantità mostrata","s","Passi / somma parziale / somma dei quadrati","Passi","Cambia la quantità sull’asse verticale; dati e N restano comuni, ogni quantità ha una scala fissa esplicita.")],
 prerequisites=[("Serie p","I criteri di convergenza si applicano ad α e 2α.",[]),("Scelta del passo","γ controlla la lunghezza dell’aggiornamento.",[28,38])],
 example=("α=0.75, γᵏ=1/(k+1)^0.75",["I passi tendono a zero.","La serie dei passi ha esponente 0.75≤1: diverge.","I quadrati hanno esponente 1.5>1: sono sommabili."],"Cambiare N non certifica né confuta una proprietà infinita."),
 visual="Grafico discreto con selettore tra γᵏ, somma parziale dei passi e dei quadrati; assi k e quantità esplicita. Verdetti analitici separati dai valori finiti.",
 axes=("k","Quantità selezionata","iteration"),
 scope=["La formula 1/k^α è mantenuta come letterale. Nei calcoli k parte da zero e si usa il traslato 1/(k+1)^α.",
        "La sommabilità dei quadrati è una scelta tipica, non viene aggiunta come ipotesi obbligatoria alla proposizione della 43."],
 interaction_reason="Cambiare α attraversa esattamente le soglie 1/2 e 1; il selettore separa passi e somme.",
 edges=[("α=1/2","Somma dei quadrati divergente; escluso dalla scelta tipica stretta."),
        ("α=1","Somma dei passi armonica divergente, quadrati sommabili."),
        ("α>1","Passi a zero ma somma finita: non soddisfa il criterio di persistenza."),
        ("N finito","Mai chiamare infinita una somma parziale numerica.")])

P[42]=dict(title="Armijo: che cosa garantisce il teorema?",objective="Leggere ipotesi uniformi e conclusione sui punti limite, distinguendola dall’esistenza di tali punti.",
 explanation="Con matrici uniformemente positive e limitate, Armijo porta ogni eventuale punto limite a essere stazionario. Il teorema non promette un punto limite né un minimo globale.",
 takeaway="Un punto limite è stazionario; il teorema non ne assicura l’esistenza.",
 obs=[("algorithm","Il metodo è z^{k+1}=z^k−γ^kD^k∇ℓ(z^k).","a gradient method"),
      ("assumption","La fonte richiede d₁I≤D^k≤d₂I con costanti positive, Armijo e ℓ continuamente differenziabile.","continuously differentiable"),
      ("concept","Ogni punto limite della sequenza è stazionario; la remark definisce punto limite tramite una sottosuccessione convergente.","every limit point")],
 formulas=[
  formula("opt42-limit",LIMIT,"Con ℓ∈C¹, Armijo e 0<d₁I≤Dᵏ≤d₂I, ogni eventuale punto limite è stazionario.","Leggere la portata precisa della conclusione.",assumptions=["ℓ∈C¹; Armijo con parametri fissati interni ai domini; Dᵏ simmetrica con 0<d₁I≤Dᵏ≤d₂I."],details=["d₁ e d₂ sono costanti positive indipendenti da k. La conclusione non afferma che la sequenza intera converga."]),
  formula("opt42-update",UPDATE,"La matrice cambia la direzione; Armijo sceglie il passo a ogni iterazione.","Connettere ipotesi e algoritmo."),
  formula("opt42-bounds",BOUNDS,"Gli stessi d₁,d₂ valgono per ogni k: nessuna direzione può degenerare o crescere senza controllo.","Spiegare il significato uniforme delle disuguaglianze fra matrici."),
  formula("opt42-example",r"\ell(z)=\tfrac12(z_1^2+4z_2^2),\quad z^0=(1.5,1),\quad D^k=I",
   "Questo costo coercivo e strettamente convesso ha un unico minimo.","Mostrare un caso concreto senza promuoverlo a prova generale.",origin="enrichment",
   details=["La direzione è −∇ℓ; β varia, c=0.5 e γ̄⁰=1 sono fissi.",
            "Ogni iterazione svolge una ricerca completa di Armijo: i tentativi interni non sono iterazioni k.",
            "Si visualizzano 25 iterati da k=0 a 24, non una dimostrazione del limite.",
            "Gradiente numericamente nullo: arresto dichiarato, nessun ciclo di test stretti a passo zero."])],
 controls=[control("opt42-beta","Fattore di riduzione",r"\beta",.4,.8,.7,.05,"Ricalcola tutte le ricerche di Armijo dal medesimo z⁰; mette in pausa e torna a k=0.")],
 choices=[("Iterazione","k","0…24","0","Seleziona l’iterato e i risultati della relativa ricerca, senza cambiare il problema."),
          ("Play/Pausa, Passo, Riparti","k","Campioni già calcolati","In pausa","Avanza l’indice algoritmico, non il tempo fisico.")],
 prerequisites=[("Armijo","Occorre selezionare il primo passo accettato a ogni iterazione.",[38,39,40]),("D positiva definita","I limiti uniformi controllano l’intera sequenza.",[31])],
 example=("Quadratica con D=I, β=0.7,c=0.5",["A z⁰=(1.5,1), g=(1.5,4).","γ=0.7⁴=0.2401 è il primo accettato.","z¹=(1.13985,0.0396); si rivalutano gradiente e ricerca."],"Il percorso finito illustra il teorema, non ne dimostra la conclusione infinita."),
 visual="Livelli 2D e superficie 3D del costo quadratico, stessi iterati, selezione k e minimo noto. Valori correnti di costo, norma gradiente e passo usato.",
 axes=("z₁","z₂","decision"),three=True,animation=True,camera_elevation=55,
 scope=["Nessuna garanzia di esistenza di punti limite o di minimo globale attribuita alla proposizione.",
        "D=I verifica d₁=d₂=1. Coercività e convessità appartengono soltanto al costo aggiunto."],
 interaction_reason="L’iterazione selezionabile collega punti sul costo, norma gradiente e passi accettati; β cambia la ricerca mantenendo fisso il confronto.",
 edges=[("k=0","Il passo precedente non esiste: mostrare un trattino, non un valore inventato."),
        ("Cambio β","Pausa e ritorno a z⁰; stessi costo e punto iniziale."),
        ("Norma piccola","Arresto numerico distinto da stazionarietà esatta."),
        ("Nessun punto limite","Il teorema resta condizionale; il caso lineare della 43 lo mostra.")])

P[43]=dict(title="Le ipotesi contano quanto la conclusione",objective="Interpretare il passo sufficientemente piccolo e il controesempio lineare senza inventare punti limite.",
 explanation="Con gradiente Lipschitz e D uniformemente positiva, il teorema ammette passi costanti piccoli oppure decrescenti con somma infinita. Non assicura che esista un punto limite.",
 takeaway="Un problema può soddisfare le ipotesi e avere iterati senza punti limite.",
 obs=[("assumption","La fonte ripete il metodo e i limiti uniformi di D e impone Lipschitz globale del gradiente.","for some L"),
      ("concept","Costante sufficientemente piccolo, oppure γ^k→0 e somma infinita: ogni punto limite è stazionario.","sufficiently small"),
      ("concept","La remark chiede di verificare il problema lineare min cᵀz. Il tipo stampato c∈Rᵀ è incoerente con la dimensione d, senza cambiare il senso dell’esercizio.",None)],
 formulas=[
  formula("opt43-limit",LIMIT,"Con gradiente L-Lipschitz, 0<d₁I≤Dᵏ≤d₂I e passi adatti, ogni eventuale punto limite è stazionario.","Leggere un enunciato condizionale.",assumptions=["Gradiente globalmente L-Lipschitz; Dᵏ simmetrica uniformemente PD e limitata; uno dei due regimi di passo."],details=["Passi adatti: costante sufficientemente piccolo, oppure decrescente verso zero con somma infinita. d₁,d₂ sono costanti positive indipendenti da k. Una sequenza che va all’infinito può soddisfare le ipotesi senza avere punti limite."]),
  formula("opt43-lipschitz",r"\|\nabla\ell(z)-\nabla\ell(y)\|\le L\|z-y\|,\quad\forall z,y\in\mathbb R^d","L controlla quanto può cambiare il gradiente su tutto il dominio.","Rendere concreta la regolarità richiesta."),
  formula("opt43-update",UPDATE,"Dᵏ e γᵏ hanno gli stessi ruoli delle pagine precedenti.","Preservare il metodo del corso."),
  formula("opt43-bounds",BOUNDS,"d₁,d₂ sono costanti comuni a tutte le iterazioni.","Distinguere positività puntuale da controllo uniforme."),
  formula("opt43-regimes",r"\gamma^k=\gamma>0\ \text{sufficiently small},\quad\text{or}\quad\gamma^k\to0,\ \sum_{t=0}^\infty\gamma^k=\infty",
   "Il primo caso richiede una soglia adatta al costo; il secondo richiede persistenza, non solo passi a zero.","Non introdurre la sommabilità dei quadrati come nuova ipotesi della proposizione."),
  formula("opt43-linear-source",r"\min_{z\in\mathbb R^d}c^\top z,\qquad c\in\mathbb R^\top",
   "L’esercizio è un costo lineare; il vettore dei coefficienti deve avere la dimensione della decisione. La scritta del tipo è conservata nel letterale.","Mantenere il refuso tipografico nei metadata senza un warning invasivo."),
  formula("opt43-example",r"\ell_1(z)=\tfrac12z^2,\qquad\ell_2(z)=z,\qquad D^k=1,\ z^0=1",
   "Il quadratico ha L=1 e minimo in zero; il lineare ha gradiente costante 1 e nessun minimo su R.","Verificare la remark con due costi espliciti.",origin="enrichment",
   details=["Per il lineare il gradiente è Lipschitz con qualsiasi L>0: la differenza dei gradienti è zero.",
            "Con passi positivi e somma infinita, zᵏ=1−Σ_{j<k}γʲ→−∞ e non esistono punti limite in R.",
            "Nel quadratico, un passo costante 0<γ<2 dà zᵏ=(1−γ)^k; a 2 si alterna senza convergere, oltre 2 diverge.",
            "La soglia 2 appartiene a questo costo con D=1, non è una soglia universale.",
            "La scelta decrescente è γᵏ=1/(k+1)^α, 0.55≤α≤1. Nei calcoli l’indice muto delle somme è k."])],
 controls=[control("opt43-gamma","Passo costante",r"\gamma",.1,2.2,.5,.1,"Cambia la ricorrenza soltanto nel regime costante. γ≥2 esce dalla garanzia illustrata per il quadratico."),
           control("opt43-alpha","Esponente decrescente",r"\alpha",.55,1,1,.05,"Cambia γᵏ=1/(k+1)^α soltanto nel regime decrescente; la somma è infinita in tutto il dominio.")],
 choices=[("Costo","f","Quadratico / lineare","Quadratico","Cambia funzione e gradiente, preserva z⁰=1 e la regola scelta."),
          ("Regola del passo","s","Costante / decrescente","Costante","Mostra solo il parametro pertinente e ricostruisce da k=0."),
          ("Iterazione","k","0…20","0","Seleziona uno degli iterati già calcolati; Play/Pausa, Passo e Riparti disponibili.")],
 prerequisites=[("Lipschitz","La proposizione richiede un L globale.",[17,20]),("Passi decrescenti","Somma infinita distinta dal limite zero.",[41])],
 example=("Costo lineare ℓ=z con D=1",["∇ℓ=1, differenza dei gradienti sempre zero.","Con passo costante γ, zᵏ=1−kγ.","Con passi decrescenti a somma infinita, zᵏ=1−Σγʲ→−∞."],"Nessun punto limite: non contraddice la conclusione sui punti limite."),
 visual="Sequenza discreta zᵏ contro k; retta z=0 marcata come minimo solo nel caso quadratico. Nessuna linea obiettivo nel caso lineare. Casi oltre ritaglio dichiarati.",
 axes=("k","zᵏ","iteration"),
 scope=["Il c∈Rᵀ della remark è un refuso di tipo: nei calcoli si usa l’esempio scalare c=1; nessun cambiamento al letterale.",
        "L>0 non implica che il problema lineare sia limitato inferiormente.",
        "Le soglie mostrate per γ sono derivate per il costo scalare, non attribuite alla fonte."],
 interaction_reason="Il confronto lineare/quadratico separa le ipotesi dalla presunta esistenza del limite; γ=2 espone il ruolo di sufficientemente piccolo.",
 edges=[("Quadratico, γ=2","Alternanza ±1 e costo costante: fuori dalla discesa garantita."),
        ("Quadratico, γ>2","Divergenza mostrata senza clamp; numeri fuori grafico restano nei risultati."),
        ("Lineare","Gradiente costante non nullo; non inventare soluzione o punto limite."),
        ("Cambio modello o passo","Pausa e ritorno al medesimo z⁰.")])

for n in (44,45):
 P[n]=dict(title="Una sottosuccessione non è tutta la sequenza" if n==44 else "Convessità trasforma stazionari in minimi",
 objective="Distinguere convergenza totale e sottosuccessioni, correggendo il quantificatore troppo forte." if n==44 else "Separare coercività, stazionarietà e convessità nella conclusione sui minimi globali.",
 explanation="Le proposizioni non garantiscono convergenza della sequenza intera. La coercività rende compatti i sottolivelli; i limiti di sottosuccessioni convergenti sono stazionari." if n==44 else "La coercività assicura esistenza di minimi per un costo continuo. Con convessità, ogni punto stazionario è globale; senza convessità può essere anche un massimo.",
 takeaway="Due sottosuccessioni possono avere limiti diversi." if n==44 else "Coercività dà esistenza; convessità rende globale ogni punto stazionario.",
 obs=[("concept","La prima remark esclude garanzie di convergenza della sequenza e perfino di esistenza di punti limite.","The propositions do not guarantee"),
      ("concept","Si presentano le alternative costo verso −∞ oppure costo finito e gradiente verso zero; la frase successiva afferma troppo: any subsequence converges.","any subsequence"),
      ("assumption","Coercività/radiale illimitatezza è definita dal costo verso +∞ a norma crescente.","radially unbounded"),
      ("concept","Nel caso non convesso con coercività la conclusione riguarda stazionari, non minimi globali.","general (nonconvex)"),
      ("diagram","La figura rappresenta (−1)^n con punti alternati a ±1 e sottosuccessione pari a +1; non è dichiarata una traiettoria di gradient method." if n==44 else "La figura alternante scompare e viene aggiunta la remark: per programmi convessi con coercività, i limiti di sottosuccessioni sono minimi globali.",None)],
 formulas=[
  formula(f"opt{n}-subsequence",SUBSEQ,"La conclusione vale per sottosuccessioni che convergono. La sequenza intera può avere più punti limite.","Usare il quantificatore corretto preservando la fonte.",origin="correction",
          assumptions=["Si applicano le ipotesi delle proposizioni precedenti; l’implicazione considera una sottosuccessione effettivamente convergente."],
          details=["La compattezza fornisce l’esistenza di sottosuccessioni convergenti, non la convergenza di ogni sottosuccessione.",
                   "La coercività di un costo continuo rende compatti i sottolivelli e garantisce un minimo globale per Weierstrass.",
                   "Per ottenere iterati limitati si usa anche il fatto che restino in un sottolivello limitato (Armijo o regime di discesa). Non attribuire questa proprietà alla sola parola coercività.",
                   "Per costi non convessi, un limite stazionario può essere un massimo o una sella; il teorema non assicura un minimo."]),
  formula(f"opt{n}-literal",LITERAL_SUBSEQ,"La remark stampata dice ‘any subsequence’. La companion conserva il letterale e precisa ‘ogni sottosuccessione convergente’.","Tracciare la modifica del quantificatore."),
  formula(f"opt{n}-coercive",COERCIVE,"Lontano dall’origine il costo cresce senza limite. Per un costo continuo questo impedisce ai suoi sottolivelli di estendersi all’infinito.","Spiegare il ruolo di coercività ed esistenza."),
  formula(f"opt{n}-alternatives",r"\ell(z^k)\to-\infty\quad\text{or}\quad\ell(z^k)\to\ell_\infty\in\mathbb R,\ \nabla\ell(z^k)\to0",
   "La fonte distingue fuga del costo e avvicinamento alla stazionarietà. Sono conclusioni nel contesto dei metodi e delle loro ipotesi, non per successioni arbitrarie.","Non trasferire ipotesi algoritmiche alla sequenza alternante.",origin="enrichment",details=["Questa è una riscrittura matematica delle frasi della remark: ℓ∞ è un nome aggiunto per il valore finito, non un simbolo stampato nella slide."]),
  *([formula("opt44-example",r"z^k=(-1)^k,\quad z^{2p}=1,\quad z^{2p+1}=-1",
   "La sequenza completa alterna; i campioni pari e dispari sono due sottosuccessioni costanti con limiti diversi.","Esplicitare la figura della fonte.",
   origin="enrichment",details=["Questa è un’illustrazione di successioni, non un’esecuzione certificata di un gradient method sotto le ipotesi delle proposizioni.",
                             "Si include k=0 per chiarezza del selettore; la figura usa n>0. Il comportamento asintotico non cambia.",
                             "N finito mostra il pattern; l’identità esatta (−1)^k dimostra i due limiti."])]
    if n==44 else [
    formula("opt45-convex",r"\nabla\ell(\bar z)=0\quad\Longrightarrow\quad\bar z\in\operatorname*{arg\,min}_{z\in\mathbb R^d}\ell(z)",
     "Per ℓ convessa e differenziabile, stazionarietà è sufficiente alla globalità. Coercività aggiunge esistenza, non unicità.","Leggere la nuova remark della progressiva.",origin="enrichment",assumptions=["ℓ convessa e differenziabile; la remark considera anche coercività."],details=["L’implicazione con argmin rende esplicita la remark testuale; la fonte non stampa questa formula aggiuntiva."]),
    formula("opt45-example",r"\ell_1(z)=\tfrac12z^2,\quad\ell_2(z)=\tfrac14(z^2-1)^2,\quad\ell_3(z)=e^{-z}",
     "Tre costi separano le proprietà: quadratico convesso coercivo, doppia valle coerciva non convessa, esponenziale convessa non coerciva.","Evitare di confondere esistenza e classificazione dello stazionario.",origin="enrichment",
     details=["ℓ₁ ha minimo globale unico 0; ℓ₂ ha minimi globali ±1 e massimo locale 0.",
              "ℓ₃ ha infimo 0 non raggiunto: non ha punti stazionari né minimo globale su R.",
              "Il selettore cambia il problema: gli intervalli verticali sono dichiarati per funzione; muovere a non cambia alcuna scala.",
              "Il grafico valuta un punto, non implementa un algoritmo né ne garantisce la convergenza."])])],
 controls=[{**control("opt44-n","Campioni","N",6,40,16,2,"Estende la sequenza finita, senza cambiare i valori ±1 e i limiti delle sottosuccessioni."),"domain":dict(min=6,max=40,step=2,integer=True)}] if n==44 else [control("opt45-a","Punto da esaminare","a",-1.5,1.5,0,.1,"Muove il punto e rivaluta costo/gradiente; funzione, minimi noti e proprietà restano fissi.")],
 choices=[("Campioni mostrati","s","Tutti / pari / dispari","Tutti","Evidenzia l’intera successione o una delle due sottosuccessioni; non cambia la funzione (-1)^k.")] if n==44 else [("Costo","f","Quadratico / doppia valle / esponenziale","Quadratico","Cambia costo e classificazione; conserva il punto a per confrontare le proprietà.")],
 prerequisites=[("Punto limite","È il limite di una sottosuccessione, non necessariamente di tutta la sequenza.",[42,43]),
                ("Convessità e ottimalità","Gradiente nullo è sufficiente al minimo globale sotto convessità.",[22])],
 example=("Sequenza alternante",["I termini pari valgono 1 e quelli dispari −1.","La sequenza completa non converge.","Le due sottosuccessioni hanno limiti distinti."],"L’esistenza di sottosuccessioni convergenti non dà convergenza di ogni sottosuccessione.") if n==44 else ("Confronto dei costi in a=0",["Il quadratico ha gradiente zero: minimo globale.","La doppia valle ha gradiente zero: massimo locale, non minimo.","L’esponenziale è convessa ma non coerciva, senza minimo raggiunto."],"Coercività, convessità e stazionarietà rispondono a domande diverse."),
 visual="Grafico discreto di (−1)^k con pari rossi e dispari blu, selezione dell’intera sequenza o di una sottosuccessione. Non è una traiettoria di ottimizzazione." if n==44 else "Curva del costo selezionato, punto a, minimi globali noti e massimo locale quando presente; proprietà analitiche e gradiente nei risultati.",
 axes=("k","zᵏ","iteration") if n==44 else ("z","ℓ(z)","decision"),
 scope=["Il testo ‘any subsequence converges’ resta SOURCE_LITERAL, ma la companion limita la conclusione alle sottosuccessioni convergenti.",
        "Coercività e continuità garantiscono esistenza di minimi; stazionarietà è globalmente sufficiente soltanto sotto convessità.",
        "Nessuna affermazione di convergenza dell’intera sequenza o unicità viene aggiunta."],
 interaction_reason="Il filtro pari/dispari mostra la differenza fra sequenza e sottosuccessioni." if n==44 else "Lo stesso punto su tre costi rende visibili proprietà diverse senza confondere stazionario e minimo.",
 edges=[("Tutti i campioni","Nessun limite unico della sequenza alternante."),("Solo pari o dispari","Sottosuccessioni costanti, limiti +1 oppure −1.")] if n==44 else [("Doppia valle, a=0","Gradiente zero ma massimo locale; nessuna etichetta di minimo."),("Doppia valle, a=±1","Due minimi globali: nessuna unicità."),("Esponenziale","Nessun minimo o stazionario finito; infimo non raggiunto.")],
 progressive=n==45,
 progression=dict(assessment="progressive",related_page_ids=[f"{H.DOC}:p{45 if n==44 else 44:04}"],
  added=["Nuova remark sulla globalità sotto convessità."] if n==45 else ["Figura della sequenza alternante."],
  removed=["Figura alternante sostituita dalla remark convessa."] if n==45 else [],
  changed=["Stesse prime tre remark; la quarta e la figura distinguono i due rendering 41/73."],
  rationale="Pagine fisiche distinte della stessa slide progressiva; conservare entrambe con focus didattici complementari."))

P[46]=dict(title="Il gradiente di un QP diventa una ricorrenza",objective="Applicare l’aggiornamento a un costo quadratico senza supporre positività definita o esistenza di un minimo.",
 explanation="Per un QP il gradiente è Qz+q: l’iterazione si calcola con un prodotto matrice-vettore. Con Q semidefinita il minimo può non essere unico, oppure può non esistere.",
 takeaway="Q≥0 dà convessità; esistenza del minimo e scelta del passo restano da verificare.",
 obs=[("definition","QP non vincolato: min 1/2 zᵀQz+qᵀz con Q=Qᵀ≥0∈R^{d×d}, q∈R^d.","Quadratic program"),
      ("algorithm","Steepest descent usa z^{k+1}=z^k−γ^k∇ℓ(z^k).","Steepest descent"),
      ("equation","Sostituendo il gradiente si ottiene z^{k+1}=z^k−γ^k(Qz^k+q).","for a Quadratic Program")],
 formulas=[
  formula("opt46-update",r"z^{k+1}=z^k-\gamma^k(Qz^k+q)","Qzᵏ+q è il gradiente del QP. Il passo scala questo vettore a ogni aggiornamento.","Collegare dati del QP e algoritmo.",assumptions=["Q simmetrica semidefinita positiva; un passo adatto è necessario per la convergenza."]),
  formula("opt46-qp",r"\min_{z\in\mathbb R^d}\tfrac12z^\top Qz+q^\top z,\qquad Q=Q^\top\ge0","La simmetria dà il gradiente Qz+q; la semidefinita positività dà convessità, non automaticamente un minimo.","Mantenere il caso PSD della fonte."),
  formula("opt46-steepest",r"z^{k+1}=z^k-\gamma^k\nabla\ell(z^k)","L’espressione generale resta la stessa: cambia solo la disponibilità esplicita del gradiente.","Leggere la sostituzione della formula."),
  formula("opt46-example",r"Q=\operatorname{diag}(1,\lambda),\quad q=(0,b)^\top,\quad z^0=(1.5,1)^\top",
   "λ cambia curvatura; b può creare deriva nella direzione piatta.","Esplorare positività e compatibilità senza omettere il caso singolare.",origin="enrichment",
   details=["λ>0: unico minimo (0,−b/λ). λ=0,b=0: tutta la retta z₁=0 è minima. λ=0,b≠0: nessun minimo, costo illimitato inferiormente.",
            "Con λ>0 e componenti attive, il passo costante 0<γ<2/max(1,λ) è sufficiente alla convergenza. Al bordo possono apparire oscillazioni; oltre il bordo instabilità.",
            "Per λ=0,b=0 la componente piatta resta quella iniziale: non sostituirla arbitrariamente con zero.",
            "Scale fisse: z₁,z₂∈[−2,2], costo∈[−2,16]; punti fuori ritaglio dichiarati e valori conservati senza clamp.",
            "Con λ molto piccolo non nullo il minimo −b/λ può essere enorme: non trattarlo come λ=0 con una tolleranza.",
            "k conta aggiornamenti, non tempo fisico; la simulazione seleziona 21 campioni calcolati."])],
 controls=[control("opt46-lambda","Seconda curvatura",r"\lambda",0,6,4,.5,"Cambia Q e il gradiente, ricalcola dal medesimo z⁰; mette in pausa e torna a k=0."),
           control("opt46-b","Termine lineare","b",-1,1,0,.25,"Cambia q e il minimo/deriva; conserva Q e ricalcola il percorso da z⁰."),
           control("opt46-gamma","Passo costante",r"\gamma",.05,1,.25,.05,"Cambia la ricorrenza mantenendo costo e z⁰; nessuna correzione nascosta di passi instabili.")],
 choices=[("Iterazione","k","0…20","0","Seleziona il campione con controlli Play/Pausa, Passo e Riparti; cambiare parametri torna a k=0.")],
 prerequisites=[("QP convesso","Compatibilità e semidefinita positività vanno considerate insieme.",[23,24,25]),
                ("Scelta del passo","Un passo troppo grande può annullare la direzione favorevole.",[38,43])],
 example=("λ=4,b=0,γ=0.25",["Da z⁰=(1.5,1), il gradiente è (1.5,4).","z¹=(1.125,0), costo 0.6328125.","La componente più curva si azzera al primo passo; la prima decade con fattore 0.75."],"Modificare λ o γ può produrre oscillazioni o divergenza, dichiarate nel grafico."),
 visual="Livelli e superficie del medesimo QP, percorso selezionabile, punto corrente e minimo noto. Nel caso piatto compatibile evidenziare l’intera retta minima; in deriva non mostrare un minimo inventato.",
 axes=("z₁","z₂","decision"),three=True,animation=True,camera_elevation=55,
 scope=["Nessuna ipotesi Q>0 sostituita a Q≥0 della fonte.",
        "La quadratica di esempio, il dominio dei controlli e la soglia spettrale sono enrichment.",
        "La pagina 47 è solo contesto del prossimo batch; nessuna proiezione o algoritmo vincolato implementato."],
 interaction_reason="Curvatura, componente lineare e passo separano convergenza, insieme di minimi e deriva; 3D mostra il costo lungo gli stessi iterati.",
 edges=[("λ=0,b=0","Retta di minimi; coordinata piatta conservata."),
        ("λ=0,b≠0","Deriva, nessun minimo; direzione piatta non regolarizzata."),
        ("γ al bordo spettrale","Possibile alternanza con costo non decrescente strettamente."),
        ("γ oltre soglia","Iterati e costi fuori ritaglio dichiarati, senza autoscale ingannevole o clamp. I campioni esterni non vengono inviati ai buffer 3D, per evitare che la precisione GPU appiattisca la superficie; i valori reali restano nei risultati numerici."),
        ("λ piccolo non nullo","Minimo calcolato dalla formula, eventualmente fuori ritaglio; mai arrotondare λ a zero.")])

def warning(n,text):
 if n==41:
  return ("INFO_WARNING",r"\gamma^k=1/k^\alpha,\quad 1/2<\alpha\le1",P[n]["formulas"][4]["latex"],
   "⚠ Nota: usiamo γᵏ=1/(k+1)ᵅ per partire da k=0.",
   "La potenza 1/k^α è definita da k=1; la slide scrive somme da t=0 con addendi indicizzati k. È una convenzione iniziale incoerente, risolta senza modificare la fonte. Un traslato finito non cambia sommabilità o divergenza; nei calcoli si usa k=0,1,... e 1/(k+1)^α. Si mantiene 1/2<α≤1 come scelta tipica e si esplorano anche α esterni dichiaratamente. Nessuna divisione per zero.")
 if n in (44,45):
  return ("CORRECTION_WARNING",LITERAL_SUBSEQ,SUBSEQ,
   "⚠ Warning: possibile errore nella slide originale. La conclusione riguarda sottosuccessioni convergenti.",
   "La frase ‘any subsequence ... converges’ implica la convergenza della sequenza completa (essa stessa una sottosuccessione) ed è incompatibile con la precedente assenza di garanzia e con la figura alternante della 44. La conclusione corretta delle proposizioni è: ogni punto limite è stazionario, cioè se una sottosuccessione converge, il suo limite ha gradiente nullo. Limitatezza/compattezza garantisce esistenza di sottosuccessioni convergenti, non che ogni sottosuccessione converga. Coercività di un costo continuo dà sottolivelli compatti ed esistenza di minimi. Per dedurre iterati limitati occorre anche contenerli in un sottolivello: ciò vale nel regime di discesa/Armijo pertinente, non per una successione arbitraria. In convessità i limiti stazionari sono globali, senza inferire unicità o convergenza totale. Il grafico (-1)^k è un esempio di successione, non iterati certificati dell’algoritmo. Fonte e letterali rimangono intatti.")
 return None

def visual(n,vis,m):
 if n not in (42,46):
  x,y=m["axes"][:2]
  vis["visualizationSemantics"]["xAxis"].update(symbol=x,label=x,role="step_size" if n<41 else "iteration" if n in (41,43,44) else "decision")
  vis["visualizationSemantics"]["yAxis"].update(symbol=y,label=y,role="selected_series" if n==41 else "decision" if n in (43,44) else "cost",unit="valore")
  vis["twoDRequirements"].update(plotType="armijo_profile" if n<41 else "discrete_sequence" if n in (41,43,44) else "cost_curve")
 if n==44:
  vis["visualizationSemantics"]["yAxis"]["label"]="Valore della sequenza illustrativa"
 if n in (42,46):
  vis["threeDRequirements"]["animation"]["controls"]=["Play/Pausa","Passo","Riparti","Iterazione k"]

if __name__=="__main__":
 H.persist_batch(P,38,46,"F",{37:"Modello quadratico con D: il minimo del modello può aumentare il costo reale.",
  47:"Divisoria: ottimizzazione su insiemi convessi, solo contesto; nessuna implementazione del batch G."},
  "stepSizeNotes.ts","stepSizeFormulaNotes",warning_resolver=warning,configure_visualization=visual)
