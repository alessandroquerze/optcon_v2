"""Individually verified source and companion design: Newton, physical pages 34–37."""
import importlib.util
from pathlib import Path
loader=importlib.util.spec_from_file_location("optimization_authoring",Path(__file__).with_name("optimization-authoring.py"))
H=importlib.util.module_from_spec(loader);loader.loader.exec_module(H)
formula,control=H.formula,H.control
STEP=r"\nabla\ell(z^k)+\nabla^2\ell(z^k)\Delta z^k=0"
QP=r"\Delta z^k=\operatorname*{arg\,min}_{\Delta z}\nabla\ell(z^k)^\top\Delta z+\frac12\Delta z^\top\nabla^2\ell(z^k)\Delta z"
SURROGATE=r"\ell^k(z)=\ell(z^k)+\nabla\ell(z^k)^\top(z-z^k)+\frac12(z-z^k)^\top(D^k)^{-1}(z-z^k)"
CUBIC=r"\ell(z)=\frac13z^3-z,\quad\nabla\ell(z)=z^2-1,\quad\nabla^2\ell(z)=2z"
P={
34:dict(title="Newton cerca lo zero del modello",objective="Distinguere zero della linearizzazione e zero della funzione originale, con l’inversa correttamente dimensionata.",
 explanation="Si costruisce un modello affine del residuo nel punto corrente, poi se ne cerca lo zero. Il nuovo punto può avere ancora un residuo non nullo nella funzione originale.",
 takeaway="Si annulla il modello affine; poi si rivaluta il residuo originale nel nuovo punto.",
 obs=[("definition","La pagina considera il problema non lineare r(z)=0.","nonlinear root"),
      ("concept","Il nuovo punto è uno zero della linearizzazione di r attorno al tentativo corrente, non necessariamente di r.","represents a root"),
      ("equation","La linearizzazione usa ∇r(z^k)^⊤Δz^k e il passo usa l’inversa di questa trasposta.","linear approximation"),
      ("algorithm","L’aggiornamento sottrae (∇r(z^k)^⊤)^{-1}r(z^k); l’inversa presuppone sistema quadrato e Jacobiano invertibile.","Thus, the solution is improved")],
 formulas=[formula("opt34-update",r"z^{k+1}=z^k-\big(\nabla r(z^k)^\top\big)^{-1}r(z^k)","Per un sistema quadrato con Jacobiano invertibile, Newton annulla il modello affine. Questo non garantisce che il residuo reale si annulli in un passo.","Leggere aggiornamento e ipotesi dell’inversa.",[(r"\nabla r","Gradiente del campo nel corso: d×m, trasposto del Jacobiano usuale."),(r"\nabla r(z^k)^\top","Jacobiano m×d; l’inversa qui richiede m=d.")],["r differenziabile; m=d e Jacobiano invertibile al punto corrente."],details=["Nel calcolo si risolve il sistema lineare JΔz=−r, senza costruire materialmente una matrice inversa.","Il termine ‘improved’ nella fonte esprime l’idea del procedimento, non una garanzia globale per ogni funzione o punto iniziale."]),
 formula("opt34-linear",r"r^k(z^k+\Delta z^k)=r(z^k)+\nabla r(z^k)^\top\Delta z^k","rᵏ è il modello affine costruito all’iterazione k. Il passo annulla questo modello: il residuo originale viene rivalutato dopo l’aggiornamento.","Separare funzione non lineare e modello locale."),
 formula("opt34-step",r"\Delta z^k=-\big(\nabla r(z^k)^\top\big)^{-1}r(z^k)","Il segno meno risolve l’equazione affine; il vettore ottenuto si somma al punto corrente.","Distinguere spostamento e nuovo punto."),
 formula("opt34-example",r"r(z)=z^2-\alpha,\quad r^k(z)=r(c)+2c(z-c)","Il residuo è una parabola; il modello è la tangente in c. Il suo zero può essere lontano, mentre il residuo reale nel nuovo punto è generalmente diverso da zero.","Dare un esempio scalare controllabile mantenendo la convenzione del corso.",origin="enrichment",details=["α∈[0,2], c∈[−2,2]. Per c≠0 il passo è −(c²−α)/(2c).","A c=0,α>0 la tangente è una costante non nulla: niente inversa o aggiornamento. A c=α=0 si è già su una radice, senza una scelta univoca dello zero del modello nullo.","Il grafico usa un intervallo fisso [−2.5,2.5]. Un punto fuori dal ritaglio è dichiarato e non viene tagliato artificialmente.","Residuo già entro 10⁻¹²: arresto numerico dichiarato, distinto da uno zero esatto."])],
 controls=[control("opt34-c","Punto corrente","c",-2,2,1.5,.1,"Sposta il punto di linearizzazione, la tangente e il suo zero; la funzione resta fissa per α fissato."),
 control("opt34-alpha","Parametro del residuo",r"\alpha",0,2,1,.25,"Sposta la parabola e le sue radici; aggiorna modello e passo mantenendo c.")],
 choices=[("Esegui un passo","k","Avanza al nuovo punto se ricalcolabile e dentro [−2,2]","Punto iniziale scelto","Sostituisce c con il nuovo punto, senza cambiare α; non clampa un risultato fuori intervallo.")],
 prerequisites=[("Gradiente di un campo vettoriale","La trasposta è necessaria per le dimensioni del prodotto.",[7]),("Iterazioni","k indica aggiornamenti, non tempo fisico.",[27,33])],
 example=("α=1, c=1.5",["r(c)=1.25 e r′(c)=3.","Δz=−5/12; nuovo punto 13/12≈1.083333.","Il modello vale zero lì, il residuo reale vale 25/144≈0.173611."],"Lo zero della linearizzazione non è già una radice esatta del residuo non lineare."),
 visual="Residuo blu, tangente viola, punto corrente e zero affine arancio; confronto col residuo reale nel nuovo punto. Assi z e r(z), non costo.",
 axes=("z","r(z)","decision"),scope=["Il sistema generale richiede m=d e Jacobiano invertibile per la formula stampata.","La parabola è un esempio aggiunto; la fonte non specifica una funzione numerica."],
 interaction_reason="Muovere il punto mostra come cambia lo zero affine; α e i casi singolari distinguono funzione e modello.",
 edges=[("c=0,α>0","Sistema affine incompatibile: nessuna divisione per zero o nuovo punto inventato."),("c=α=0","Radice già raggiunta; modello nullo, nessun aggiornamento univoco."),("Risultato fuori dal grafico","Mostrare valore e avviso breve; nessun clamp o cambio automatico di scala."),("Residuo numerico piccolo","Arrestare esplicitamente entro 10⁻¹²; non chiamarlo zero esatto.")]),
35:dict(title="Azzerare il gradiente cerca stazionari",objective="Collegare ricerca di radici e ottimizzazione senza confondere punto stazionario e minimo.",
 explanation="Si applica Newton al residuo r=∇ℓ. Risolvere il sistema linearizzato cerca un punto stazionario; con curvatura negativa si può arrivare anche a un massimo.",
 takeaway="Newton sul gradiente cerca punti stazionari. La sola invertibilità della Hessiana non certifica un minimo.",
 obs=[("definition","Il problema è min ℓ(z) su R^d; i punti stazionari z̄ soddisfano ∇ℓ(z̄)=0.","stationary points"),
      ("concept","La fonte propone r(z)=∇ℓ(z) come problema di radici.","root finding problem"),
      ("equation","Il passo risolve ∇ℓ(z^k)+∇²ℓ(z^k)Δz^k=0.","linearization"),
      ("algorithm","Il passo negativo Hessiana-inversa per gradiente è evidenziato dalla parentesi graffa sotto l’aggiornamento.",None)],
 formulas=[formula("opt35-newton",r"z^{k+1}=z^k-\nabla^2\ell(z^k)^{-1}\nabla\ell(z^k)","Con Hessiana invertibile, questo è Newton applicato al gradiente. Cerca stazionari: invertibile non significa positiva definita né minimo.","Distinguere ricerca di stazionari e direzione garantita di discesa.",assumptions=["Costo sufficientemente differenziabile e Hessiana invertibile nel punto corrente."]),
 formula("opt35-system",STEP,"La Hessiana è il Jacobiano del gradiente: il sistema annulla la sua linearizzazione. Per un costo C² la simmetria rende coerente la trasposta usata nella pagina 34.","Collegare esattamente il residuo di pagina 34 alla Hessiana."),
 formula("opt35-stationarity",r"r(z)=\nabla\ell(z),\qquad\nabla\ell(\bar z)=0","L’equazione di radici esprime stazionarietà, una condizione necessaria al primo ordine. Non esclude massimi o selle.","Identificare che cosa viene effettivamente risolto."),
 formula("opt35-example",CUBIC,"Il residuo z²−1 ha due zeri: +1 è un minimo locale, −1 un massimo locale. La stessa ricerca di radici può avvicinare entrambi.","Usare la parabola precedente come gradiente di un costo, senza dichiarare un minimo globale.",origin="enrichment",details=["Il cubico non è limitato inferiormente su R: il minimo in +1 è locale, non globale.","Per a=−0.5: g=−0.75, H=−1, Δz=−0.75 e z nuovo=−1.25; il costo aumenta verso il massimo locale −1.","A a=0 la Hessiana è zero e il gradiente −1: nessun passo Newton puro.","Anche con Hessiana positiva il passo pieno può aumentare il costo: a=0.32 dà H=0.64 e nuovo punto 1.7225, ancora dentro il controllo, ma con costo maggiore."])],
 controls=[control("opt35-a","Punto corrente","a",-1.8,1.8,1.5,.1,"Cambia gradiente, Hessiana e tangente del gradiente; il costo cubico resta fisso.")],
 choices=[("Esegui un passo","k","Avanza se il nuovo punto è finito e dentro [−1.8,1.8]","Punto scelto","Sostituisce a con il punto Newton; non blocca una curvatura negativa fingendo che sia un minimo.")],
 prerequisites=[("Ricerca di radici","Ora il residuo da linearizzare è il gradiente.",[34]),("Condizioni di ottimalità","La stazionarietà non basta in assenza di convessità.",[8,9,22])],
 example=("a=−0.5",["Gradiente −0.75 e Hessiana −1: invertibile ma negativa.","Il sistema dà Δz=−0.75, nuovo punto −1.25.","Il costo passa da 0.458333 a 0.598958: aumenta, verso un massimo locale."],"Non reinterpretare una radice del gradiente come un minimo."),
 visual="Grafico del gradiente r(z)=z²−1 e sua tangente. Zeri classificati come massimo/minimo locale del cubico, con Hessiana e variazione di costo visibili.",
 axes=("z","∇ℓ(z)","decision"),scope=["La positività della Hessiana garantisce il quadro di discesa della 32; la 35 descrive una ricerca di radici quando l’inversa esiste.","Il grafico rappresenta il gradiente, non il costo cubico."],
 interaction_reason="Attraversare a=0 mostra singolarità e cambiamento di curvatura; gli aggiornamenti possono avvicinare anche un massimo.",progressive=True,
 edges=[("a=0","Hessiana nulla con gradiente non nullo: niente inversa."),("a<0","Hessiana negativa: non etichettare il punto come minimo."),("a=−1 o +1","Stazionario già raggiunto: distinguere massimo e minimo locale."),("Gradiente entro 10⁻¹²","Arresto numerico dichiarato vicino a uno stazionario; non chiamarlo passo fuori intervallo o zero esatto."),("Passo fuori intervallo","Dichiararlo, senza clamp.")]),
36:dict(title="Il passo è il minimo del modello",objective="Interpretare il QP del passo, usare il segno corretto e richiedere curvatura adatta.",
 explanation="Il modello quadratico determina uno spostamento con segno. Se la Hessiana è positiva definita, il suo minimo è unico; lo spostamento va sommato al punto corrente.",
 takeaway="Δzᵏ è uno spostamento con segno: si somma al punto corrente.",
 obs=[("equation","La pagina riprende il sistema ∇ℓ+∇²ℓΔz=0.","Observe that"),
      ("concept","La fonte lo chiama condizione necessaria e sufficiente del QP senza esplicitare positività della Hessiana.","necessary and sufficient"),
      ("equation","Il QP definisce Δz^k come argmin di gradienteᵀΔz+1/2 ΔzᵀHessianaΔz.","quadratic program"),
      ("equation","La riga finale stampa z^{k+1}=z^k−Δz^k, in conflitto col passo firmato del QP e pagina 35.",None)],
 formulas=[formula("opt36-qp",QP,"Il QP determina lo spostamento, non la nuova coordinata. Con Hessiana positiva definita è un minimo unico; con curvatura negativa è solo uno stazionario del modello.","Leggere la variabile del problema quadratico e il significato di argmin.",assumptions=["Per il minimo unico e la formula Newton con inversa: ∇²ℓ(z^k)>0."]),
 formula("opt36-system",STEP,"La derivata del QP rispetto allo spostamento dà lo stesso sistema di Newton. La sufficienza richiede convessità del modello; l’unicità richiede positività definita.","Collegare condizioni del QP e sistema lineare."),
 formula("opt36-literal",r"z^{k+1}=z^k-\Delta z^k","Questa è la riga stampata: il QP precedente ha già dato a Δzᵏ il segno del passo. La companion usa il più per sommarlo.","Conservare il letterale della fonte senza applicarlo ai calcoli."),
 formula("opt36-corrected",r"z^{k+1}=z^k+\Delta z^k,\qquad\nabla^2\ell(z^k)>0","Il segno meno è già nel passo −H⁻¹g. Sommare Δzᵏ collega coerentemente il QP all’aggiornamento di pagina 35.","Applicare la versione coerente nei calcoli e nell’esempio.",origin="correction"),
 formula("opt36-example",r"\ell(z)=\frac13z^3-z,\quad q_a(\Delta z)=(a^2-1)\Delta z+a(\Delta z)^2","La curvatura del QP è 2a: positiva con a>0, negativa con a<0, nulla a zero.","Confrontare modello del passo e vera variazione di costo nello stesso spostamento.",origin="enrichment",details=["Si è omessa la costante ℓ(a), che non cambia l’argmin. Il grafico usa Δz sull’asse orizzontale; il nuovo punto è a+Δz.","La curva reale è ℓ(a+Δz)−ℓ(a); il modello q_a non è una garanzia globale sul costo.","Per a<0 lo stazionario è un massimo del QP, non un argmin. A a=0 il modello è −Δz e non ha minimo.","Una Hessiana PSD singolare può avere minimi non unici se il sistema è compatibile, ma non giustifica l’inversa Newton: non affermare che PD sia necessaria a ogni QP."])],
 controls=[control("opt36-a","Punto di costruzione","a",-1.8,1.8,.5,.1,"Ricostruisce la variazione reale e il QP; aggiorna passo, tipo di stazionario e nuovo punto, mantenendo il cubico.")],
 choices=[("Esegui un passo","k","Solo se il modello ha minimo unico e il nuovo punto sta in [−1.8,1.8]","a=0.5","Applica a←a+Δz, mai a−Δz. Se il QP non ha minimo, non avanza come se ne avesse uno.")],
 prerequisites=[("Newton sul gradiente","Il sistema assegna a Δz il segno dello spostamento.",[35]),("QP senza vincoli","Convessità, compatibilità e positività definita hanno ruoli diversi.",[24,25])],
 example=("a=0.5",["g=−0.75, H=1; q(Δz)=−0.75Δz+0.5Δz².","Il minimo è Δz=0.75; nuovo punto 0.5+0.75=1.25.","q minimo=−0.28125; vera variazione del costo=−0.140625."],"Il passo si somma; il valore del modello e il costo reale possono differire."),
 visual="Asse orizzontale Δz: variazione reale del costo blu e QP viola, entrambi zero in Δz=0. Stazionario del modello arancio, etichettato minimo solo con curvatura positiva.",
 axes=("Δz","Variazione di costo","displacement"),scope=["SOURCE_LITERAL finale conservato; calcoli usano +Δz.","L’ipotesi PD rende coerenti argmin unico e inversa; con H≤0 l’esempio non viene simulato come minimizzazione valida."],
 interaction_reason="Il punto a cambia il segno della curvatura; il grafico separa spostamento e nuova decisione e mostra quando argmin non esiste.",progressive=True,
 edges=[("a>0","QP strettamente convesso, minimo unico; applicare il più. Il passo pieno può comunque aumentare il costo reale, per esempio a=0.32."),("a<0","QP concavo e illimitato inferiormente: lo stazionario non è minimo."),("a=0","QP lineare non costante, niente minimo né inversa."),("Fuori intervallo","Nessun clamp del minimizzatore o del nuovo punto.")]),
37:dict(title="Dᵏ sceglie il modello da minimizzare",objective="Capire che D⁻¹ è la curvatura del modello e che minimizzare un surrogato non basta a ridurre il costo reale.",
 explanation="Una Dᵏ simmetrica positiva definita costruisce un modello convesso con curvatura (Dᵏ)⁻¹. Il suo minimo dà il passo, ma il costo reale va verificato.",
 takeaway="Minimizzare il modello non garantisce discesa del costo reale.",
 obs=[("equation","La prima riga chiama direzione di discesa Δz^k=D^k∇ℓ(z^k), con segno positivo.","a descent direction"),
      ("equation","Il modello ℓ^k(z) usa curvatura (D^k)^{-1} ed è tangente in valore e gradiente al costo in z^k.","quadratic approximation"),
      ("equation","Derivata nulla dà ∇ℓ(z^k)+(D^k)^{-1}(z−z^k)=0; la pagina conclude z^{k+1}=z^k−D^k∇ℓ e Δz^k=−D^k∇ℓ.","By setting the derivative"),
      ("concept","La remark segnala utilità quando risolvere un QP è più facile e per dominio compatto convesso; non fornisce qui un algoritmo vincolato o un oracolo privo di gradiente.","Remark")],
 formulas=[formula("opt37-model",SURROGATE,"Modello tangente al costo, con curvatura (Dᵏ)⁻¹. Si assume Dᵏ>0.","Separare modello locale e costo originale.",assumptions=["Dᵏ simmetrica positiva definita, come nella famiglia della pagina 31."],details=["La tangenza significa stesso valore e gradiente nel punto corrente; la Hessiana del modello è (Dᵏ)⁻¹ e non necessariamente quella del costo reale."]),
 formula("opt37-literal",r"\Delta z^k=D^k\nabla\ell(z^k)","La prima riga stampa il segno positivo; il sistema e le due formule finali della stessa pagina usano il segno negativo.","Conservare il letterale della discrepanza."),
 formula("opt37-stationarity",r"\nabla\ell(z^k)+(D^k)^{-1}(z-z^k)=0","Annullare il gradiente del modello e moltiplicare per Dᵏ dà lo spostamento −Dᵏ∇ℓ. Con Dᵏ>0 il minimo è unico.","Ricavare il segno e l’aggiornamento dalle condizioni del modello."),
 formula("opt37-update",r"z^{k+1}=z^k-D^k\nabla\ell(z^k)","Il minimizzatore del modello diventa il prossimo iterato. Può però avere un costo reale maggiore: il modello non è automaticamente un maggiorante.","Collegare soluzione del QP e verifica del costo reale."),
 formula("opt37-corrected",r"\Delta z^k=-D^k\nabla\ell(z^k)","Il segno negativo è coerente con la derivata nulla e con l’aggiornamento finale della fonte. È questa la direzione usata in tutti i calcoli.","Applicare la direzione coerente della companion.",origin="correction"),
 formula("opt37-example",r"\ell(z)=\frac12(z_1^2+4z_2^2),\quad z^k=(1,0.5)^T,\quad D^k=\operatorname{diag}(s_1,s_2)","Il costo e il punto iniziale sono fissi; D è diagonale positiva.","Confrontare superfici e risultati senza cambiare problema.",origin="enrichment",details=["Il selettore cambia soltanto la funzione mostrata, non i dati del problema o il passo.","g=(1,2), Δz=(−s₁,−2s₂), z nuovo=(1−s₁,0.5−2s₂).","Il minimo del modello vale 1−(s₁+4s₂)/2; non va confuso con ℓ(z nuovo).","Con D=I, z nuovo=(0,−1.5), modello minimo −1.5 e costo reale 4.5, rispetto al costo iniziale 1.","Con D=diag(1,0.25), D⁻¹ è la Hessiana esatta: modello e costo coincidono e il nuovo punto è l’origine.","La remark sui QP richiede comunque che un modello sia disponibile: non promette di ottenere il gradiente gratuitamente. Nei domini convessi la minimizzazione deve includere il dominio; qui si visualizza il caso libero."])],
 controls=[control("opt37-d1","Prima diagonale D",r"D^k_{11}",.25,1.5,1,.05,"Cambia la prima curvatura del modello in 1/D₁₁ e la prima componente del passo; costo reale e punto corrente restano fissi."),
 control("opt37-d2","Seconda diagonale D",r"D^k_{22}",.1,1,1,.05,"Cambia la seconda curvatura del modello in 1/D₂₂ e la seconda componente del passo; il costo reale resta fisso.")],
 choices=[("Funzione mostrata","f","Modello quadratico / costo reale","Modello quadratico","Sostituisce livelli/superficie con la funzione scelta; conserva D, punto corrente, passo e tutti i valori calcolati.")],
 prerequisites=[("Trasformazione SPD","D positiva definita dà un modello convesso con inversa definita.",[31,32]),("QP del passo","Il minimizzatore è uno spostamento con segno.",[36])],
 example=("D=I",["Curvatura del modello I; punto corrente (1,0.5) e costo 1.","Il minimo del modello è (0,−1.5), valore −1.5.","Il costo reale lì è 4.5: aumenta di 3.5.","Scegliere D=diag(1,0.25) rende il modello identico al costo."],"Il minimo di un modello tangente non garantisce una diminuzione del costo reale."),
 visual="Livelli 2D e superficie 3D della funzione selezionata, con stesso punto corrente e minimizzatore del modello. Il terzo asse è ℓ o ℓᵏ, sempre dichiarato. Minimo reale evidenziato solo nella vista del costo.",
 scope=["Segno positivo iniziale conservato come SOURCE_LITERAL; usare −Dᵏ∇ℓ per passo e calcoli.","D>0 è l’ipotesi della famiglia di metodi nel contesto; non usare matrici indefinite.","Nessuna implementazione di Armijo della pagina 38: solo contesto per la necessità di scegliere il passo."],
 interaction_reason="Le due diagonali mostrano l’inversione della curvatura; cambiare funzione confronta modello e costo senza alterare i dati.",three=True,camera_elevation=55,progressive=True,
 edges=[("D=I","Modello minimo non certifica diminuzione reale."),("D=diag(1,0.25)","Modello e costo coincidono su tutto il dominio."),("D singolare o indefinita","Esclusa dal dominio dei controlli; nessuna inversa inventata."),("Cambio vista","Punto e parametri invariati fra 2D/3D e modello/costo."),("Pareggio","D=diag(0.8,0.6) conserva il costo iniziale. Entro 16 epsilon macchina scalati dichiarare pareggio numerico, senza certificare discesa stretta.")]),
}

def warning(n,text):
    if n==36:
        literal=STEP+"; "+QP+r";\quad z^{k+1}=z^k-\Delta z^k"
        return ("CORRECTION_WARNING",literal,P[n]["formulas"][3]["latex"],
            "⚠ Warning: possibile errore nella slide originale. Usiamo +Δzᵏ e richiediamo Hessiana positiva definita.",
            "Il QP firmato dà Δz=−H^{-1}g quando H è PD. L’aggiornamento coerente è z nuovo=z+Δz, come pagina 35: il meno finale stampato lo invertirebbe. Per g≠0,H>0 il meno letterale dà una direzione di salita; esempio a=0.5 del cubico, g=−0.75,H=1: Δ=+0.75 e il nuovo punto corretto 1.25, mentre il meno porta a −0.25. Inoltre la sola stazionarietà del QP è sufficiente sotto PSD, non per Hessiane indefinite. PD è sufficiente a garantire un argmin unico e la formula Newton con inversa, non necessaria per ogni QP: PSD singolare compatibile può avere minimi non unici. Per H≤0 nel laboratorio non produrre un finto minimizzatore. Fonte e riga con il meno restano immutabili.")
    if n==37:
        return ("CORRECTION_WARNING",r"\Delta z^k=D^k\nabla\ell(z^k)",P[n]["formulas"][4]["latex"],
            "⚠ Warning: possibile errore nella slide originale. Qui usiamo Δzᵏ=−Dᵏ∇ℓ(zᵏ).",
            "Il segno positivo della frase iniziale è incompatibile con la condizione ∇ℓ+D^{-1}(z−z^k)=0 e con le due formule finali negative della stessa slide. Per D simmetrica PD e g≠0, il passo corretto −Dg ha prodotto gᵀΔ=−gᵀDg<0, quello positivo dà salita. La companion conserva modello e aggiornamento finali corretti, usa la versione negativa per tutti i calcoli e dichiara SPD dal contesto di pagina 31. D^{-1} è la curvatura del surrogato, non necessariamente la Hessiana reale; il minimo del modello può aumentare il costo reale. La remark non dimostra disponibilità di un QP senza informazioni di primo ordine e non viene trasformata in un algoritmo vincolato.")
    return None

def visual(n,vis,m):
    if n<37:
        x,y=m["axes"][:2]
        vis["visualizationSemantics"]["xAxis"].update(label=x,symbol=x,role="displacement" if n==36 else "decision")
        vis["visualizationSemantics"]["yAxis"].update(label=y,symbol=y,role="residual" if n==34 else "gradient" if n==35 else "cost_difference",unit="valore")
        vis["twoDRequirements"]["plotType"]="residual_and_linearization" if n in (34,35) else "quadratic_step_model"
    else:
        vis["visualizationSemantics"]["zAxis"].update(label="ℓ(z) oppure ℓᵏ(z)",symbol="ℓ / ℓᵏ",role="selected_cost")
        vis["visualizationSemantics"]["zMeaning"]="Costo reale o valore del modello quadratico, secondo il selettore; nessuna coordinata fisica."
        vis["twoDRequirements"]["relationshipTo3D"]="Livelli e superficie della stessa funzione selezionata, con identici parametri e punti."

if __name__=="__main__":
    H.persist_batch(P,34,37,"E",{33:"Steepest descent confronta direzioni unitarie; indice k distinto dal tempo fisico.",
        38:"Armijo e scelta del passo: solo contesto del prossimo batch, non implementato."},
        "newtonNotes.ts","newtonFormulaNotes",warning_resolver=warning,configure_visualization=visual)
