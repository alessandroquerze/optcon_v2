"""Authored page analysis/design for Optimization 10..18. Never rewrites batch A."""
from __future__ import annotations
import importlib.util
import json
import sys
from pathlib import Path

ROOT=Path(__file__).resolve().parents[2]
sys.path.insert(0,str(ROOT))
from pipeline.analysis import build_request,load_corpus,validate_result
from pipeline.common import read_json,write_json,validate_schema,sha256_bytes
loader=importlib.util.spec_from_file_location("batch_a_helpers",Path(__file__).with_name("prepare-optimization-a.py"))
A=importlib.util.module_from_spec(loader)
loader.loader.exec_module(A)
formula,control=A.formula,A.control
DATA=ROOT/"Data"
DOC=A.DOC
SOURCE=DATA/"documents"/DOC
JENSEN=r"\ell(\theta z_A+(1-\theta)z_B)\le\theta\ell(z_A)+(1-\theta)\ell(z_B)"
MONO=r"(\nabla\ell(z_A)-\nabla\ell(z_B))^\top(z_A-z_B)"
SOURCE_STRONG=r"\ell(\theta z_A+(1-\theta)z_B)<\theta\ell(z_A)+(1-\theta)\ell(z_B)-\mu\theta(1-\theta)\|z_A-z_B\|^2"
CORRECT_STRONG=r"\ell(\theta z_A+(1-\theta)z_B)\le\theta\ell(z_A)+(1-\theta)\ell(z_B)-\frac{\mu}{2}\theta(1-\theta)\|z_A-z_B\|^2"

P={
10:dict(title="Convessità: il segmento deve restare dentro",objective="Distinguere appartenenza dei due estremi e appartenenza dell'intero segmento.",
 explanation="Un insieme è convesso quando ogni segmento fra due suoi punti resta nell’insieme. Un solo segmento che esce basta a confutare la convessità.",
 takeaway="Due estremi ammissibili non garantiscono che lo siano anche i punti intermedi.",
 obs=[("definition","La definizione quantifica su ogni coppia z_A,z_B∈Z e ogni θ∈[0,1].","A set Z"),
      ("diagram","Il disegno contrappone una regione convessa e una non convessa, con estremi interni e segmento tratteggiato.",None)],
 formulas=[formula("opt10-segment",r"\theta z_A+(1-\theta)z_B\in\mathbb Z,\quad\theta\in[0,1]","θ percorre il segmento: da B per θ=0 ad A per θ=1. La proprietà deve valere per tutte le coppie dell’insieme.","Applicare la definizione geometrica di convessità.",[(r"\mathbb Z","Insieme di decisioni del corso, non un asse temporale.")],["Entrambi gli estremi appartengono all’insieme."]),
   formula("opt10-example",r"\mathbb Z_1=\{z:(z_1/1.8)^2+(z_2/1.2)^2\le1\},\quad\mathbb Z_2=\{z:0.65^2\le z_1^2+z_2^2\le1.5^2\}","L’ellisse piena è convessa. La corona ha un foro: il segmento fra (−1.2,0) e (1.2,0) lo attraversa.","Dare un controesempio esplicito senza attribuire coordinate ai disegni originali.",origin="enrichment")],
 controls=[control("opt10-theta","Peso del segmento",r"\theta",0,1,.5,.05,"Muove solo il punto sul segmento; estremi, regione e segmento restano fissi.")],
 choices=[("Insieme","s","Ellisse piena / corona con foro","Ellisse piena","Sostituisce regione ed estremi ammissibili; aggiorna appartenenza e controesempio.")],
 prerequisites=[("Combinazioni convesse","θ e 1−θ sono pesi non negativi che sommano a uno.",[])],
 example=("Ellisse e corona esplicite",["Nell’ellisse ogni combinazione convessa resta dentro.","Nella corona, θ=1/2 produce z=0, escluso dal foro."],"Un test favorevole di un solo segmento non dimostra la proprietà universale."),
 visual="Regione 2D, segmento completo e punto corrente; foro bianco e appartenenza calcolata analiticamente.",
 edges=[("θ=0 o 1","Il punto coincide con un estremo, sempre ammissibile."),("Corona al punto medio","Il punto non appartiene all’insieme anche se gli estremi vi appartengono.")]),
11:dict(title="La curva sotto la corda",objective="Leggere la disuguaglianza di convessità come confronto fra costo interpolato e interpolazione dei costi.",
 explanation="Il costo nel punto intermedio non supera la media pesata dei costi agli estremi. La concavità inverte il confronto; la convessità stretta esclude il pareggio all’interno.",
 takeaway="Convessità: sotto la corda. Convessità stretta: strettamente sotto per punti distinti e 0<θ<1.",
 obs=[("assumption","Il dominio Z è convesso.","Let Z"),
      ("equation","La fonte enuncia la disuguaglianza di convessità per tutte le coppie e θ∈[0,1].","A function"),
      ("diagram","La figura mostra una curva convessa sotto la corda, senza coordinate numeriche.",None),
      ("definition","Concava significa −ℓ convessa; la versione stretta richiede punti distinti e θ interno.","Remark")],
 formulas=[formula("opt11-jensen",JENSEN,"Sul dominio convesso, per ogni coppia il costo del punto intermedio non supera la media pesata dei costi: così definiamo ℓ convessa.","Separare decisione interpolata e costo interpolato.",[(r"\theta","Peso del punto z_A, fra zero e uno.")],["Dominio convesso, z_A,z_B nel dominio."]),
   formula("opt11-strict",JENSEN.replace(r"\le","<")+r",\quad z_A\ne z_B,\quad0<\theta<1","La disuguaglianza stretta riguarda punti distinti e pesi interni. Agli estremi il pareggio è inevitabile.","Chiarire quando stretto ha significato."),
   formula("opt11-concave",r"\ell\ \text{concava}\quad\Longleftrightarrow\quad-\ell\ \text{convessa}","Cambiare il segno riflette il grafico e scambia sopra e sotto la corda.","Interpretare la remark della fonte."),
   *[formula("opt11-case-"+str(i),r"\ell(z)="+f+r",\quad z_A=-1,\ z_B=1",text,"Confrontare funzioni esplicite sullo stesso segmento.",origin="enrichment") for i,(f,text) in enumerate([
     ("z^2","La quadratica è strettamente convessa: il margine è positivo per θ interno."),
     ("z","Una funzione affine coincide con ogni sua corda: convessa, senza strettezza."),
     ("-z^2","La quadratica concava sta sopra la corda e viola il confronto di convessità.")])]],
 controls=[control("opt11-theta","Peso del segmento",r"\theta",0,1,.4,.05,"Muove il punto interpolato e aggiorna i due valori del confronto; la funzione e gli estremi restano fissi.")],
 choices=[("Funzione","s","z² / z / −z²","z²","Cambia curva, costi agli estremi e margine, conservando θ e il segmento [−1,1].")],
 prerequisites=[("Insieme convesso","Garantisce che il punto interpolato appartenga al dominio.",[10])],
 example=("z_A=−1, z_B=1 e θ=0.4",["z_θ=0.2.","Per ℓ=z² il costo è 0.04 e la corda vale 1.","Il margine 0.96 è positivo."],"Il margine riguarda questa coppia; la classificazione delle funzioni si giustifica analiticamente."),
 visual="Curva e corda con stesso asse, punto sulla funzione, punto sulla corda e tratto verticale fra i due.",
 edges=[("θ=0 o 1","Margine nullo anche per una funzione strettamente convessa."),("Caso affine","Pareggio per ogni θ."),("Caso concavo","Margine negativo all’interno: non dichiarare convessità.")]),
12:dict(title="Disequazioni: una regione, non solo il bordo",objective="Distinguere sottolivello zero, bordo e condizione sufficiente di convessità.",
 explanation="Il vincolo g(z)≤0 ammette un’intera regione. Componenti convesse, o quasiconvesse, danno sottolivelli convessi; la convessità del solo livello zero non caratterizza tutta g.",
 takeaway="Convessità o quasiconvessità delle componenti: condizioni sufficienti per l’insieme ammissibile.",
 obs=[("equation","g:R^d→R^p definisce Z_ineq tramite g(z)≤0, componente per componente.","Let g"),
      ("concept","La fonte afferma un se e solo se con la quasiconvessità: il verso necessario è errato per un unico livello zero.","if and only if"),
      ("concept","Il corollario sulla sufficienza della convessità è corretto, interpretato componente per componente.","Corollary"),
      ("diagram","Sono mostrate una regione ellittica e un semipiano, con bordo incluso.",None)],
 formulas=[formula("opt12-set",r"\mathbb Z_{\mathrm{ineq}}=\{z\in\mathbb R^d\mid g(z)\le0\}","Con più componenti devono valere tutte le disequazioni. Sono ammessi tutti i punti con g≤0, non soltanto gli zeri.","Leggere l’ammissibilità di una disequazione.",assumptions=["Disuguaglianza vettoriale componente per componente."]),
   formula("opt12-sufficient",r"g_i\ \text{quasiconvessa per ogni }i\ \Longrightarrow\ \mathbb Z_{\mathrm{ineq}}\ \text{convesso}","Ogni sottolivello è convesso; intersecarli conserva la convessità. Un solo sottolivello convesso non basta al viceversa.","Usare solo la direzione valida dell’affermazione.",origin="correction"),
   *[formula("opt12-case-"+str(i),f,text,"Calcolare regione e valore del vincolo nello stesso modello.",origin="enrichment") for i,(f,text) in enumerate([
      (r"g(z)=z_1^2+2z_2^2-c","c amplia l’ellisse; c=0 lascia soltanto l’origine."),
      (r"g(z)=z_1+z_2-c","c trasla la retta di bordo; il semipiano resta convesso."),
      (r"g(z)=z_1^2(z_1^2-1)-c","Per c≥0 il livello zero è una striscia convessa. g non è quasiconvessa: altri sottolivelli sono sconnessi.")])]],
 controls=[control("opt12-level","Soglia", "c",0,2,1,.1,"Trasla il residuo e sposta il bordo; i sottolivelli zero dei tre esempi restano convessi."),
           control("opt12-probe","Coordinata della sonda","z_1",-1.5,1.5,1,.1,"Muove la sonda (z₁,0); aggiorna residuo e appartenenza, senza cambiare la regione.")],
 choices=[("Vincolo","s","Ellisse / semipiano / controesempio al solo se","Ellisse","Sostituisce g e la regione; conserva c e la sonda.")],
 prerequisites=[("Insieme convesso","Il sottolivello deve contenere i segmenti.",[10]),("Funzione convessa","È una condizione sufficiente, non necessaria.",[11])],
 example=("Tre vincoli scalari aggiunti",["Per c=1, (1,0) è sul bordo dell’ellisse e del semipiano.","Per g=z₁²(z₁²−1), il livello zero è |z₁|≤1.","g(±1/√2,0)=−1/4 mentre g(0,0)=0: il sottolivello −1/5 non è convesso."],"Controesempio rigoroso al solo se, senza modificare il corollario valido."),
 visual="Viste collegate: regione ammissibile 2D con bordo analitico; superficie del residuo e piano zero in 3D.",
 edges=[("c=0 per ellisse","Singleton all’origine; nessun interno inventato."),("g=0","Bordo ammissibile."),("g non quasiconvessa","Non dedurre nonconvessità del suo singolo sottolivello zero.")]),
13:dict(title="Uguaglianze: affine è sufficiente",objective="Separare insieme affine, sottospazio lineare e rappresentazione nonlineare dello stesso insieme.",
 explanation="Un sistema affine Az=c definisce un insieme affine, se compatibile. Una funzione nonlineare può avere lo stesso insieme degli zeri: la sola forma di h non dà un “se e solo se”.",
 takeaway="Affinità sufficiente, non necessaria. Affine non significa lineare.",
 obs=[("equation","h:R^d→R^p definisce Z_eq mediante h(z)=0.","Let h"),
      ("concept","Il solo se h affine è falso: funzioni non affini possono avere lo stesso insieme degli zeri.","if and only if"),
      ("concept","La fonte chiama linear spaces gli insiemi convessi di uguaglianza: in generale, per sistemi affini si tratta di insiemi affini, eventualmente vuoti.","linear spaces (hyperplanes)"),
      ("diagram","La figura contrappone una curva quadratica e una retta; il segmento fra punti della curva può lasciarla.",None)],
 formulas=[formula("opt13-set",r"\mathbb Z_{\mathrm{eq}}=\{z\in\mathbb R^d\mid h(z)=0\}","Sono ammessi soltanto gli zeri. In 2D una retta o una circonferenza non ammettono automaticamente il loro interno.","Distinguere uguaglianza e disequazione."),
   formula("opt13-affine",r"h(z)=Az-c\ \Longrightarrow\ \mathbb Z_{\mathrm{eq}}=\{z:Az=c\}\ \text{convesso}","Se non vuoto, il sistema affine dà un insieme affine. Passa per l’origine, e diventa sottospazio, quando c=0. h affine è sufficiente, non necessario.","Correggere necessità e classificazione geometrica.",origin="correction",details=["Per p>1 l’intersezione può avere codimensione diversa da uno o essere vuota; non è sempre un singolo iperpiano."]),
   *[formula("opt13-case-"+str(i),f,text,"Mostrare come dipendono gli zeri dalla funzione scelta.",origin="enrichment") for i,(f,text) in enumerate([
     (r"h(z)=z_1+z_2-c","La retta traslata è affine; c=0 la fa passare per l’origine."),
     (r"h(z)=(z_1+z_2-c)^3","Il cubo cambia i valori di h ma non i suoi zeri: stessa retta, funzione non affine."),
     (r"h(z)=z_1^2+z_2^2-c","Con c>0 gli zeri sono una circonferenza non convessa. Con c=0 resta il singleton origine.")])]],
 controls=[control("opt13-level","Costante del vincolo","c",0,2,1,.1,"Trasla la retta, oppure modifica il raggio della circonferenza; c=0 è gestito esplicitamente."),
           control("opt13-probe","Coordinata della sonda","z_1",-1.5,1.5,1,.1,"Muove solo (z₁,0) e verifica se h(z)=0.")],
 choices=[("Uguaglianza","s","Retta affine / cubo della stessa retta / circonferenza","Retta affine","Sostituisce h; retta e cubo conservano lo stesso insieme degli zeri.")],
 prerequisites=[("Vincoli di disuguaglianza","L’uguaglianza ammette soltanto il livello, non tutta la regione.",[12])],
 example=("h=z₁+z₂−1 e h=(z₁+z₂−1)³",["Entrambe si annullano sulla stessa retta z₁+z₂=1.","La retta non contiene l’origine, quindi non è un sottospazio.","La seconda h non è affine: controesempio al solo se."],"Separare proprietà dell’insieme e proprietà della sua rappresentazione."),
 visual="Zeri analitici 2D senza area riempita; 3D opzionale della funzione h e del piano zero, stessa sonda.",
 edges=[("c=0 e circonferenza","Singleton, che è convesso; non continuare a chiamarlo circonferenza non convessa."),("c=0 e retta","Sottospazio lineare."),("Punto fuori dallo zero","Non è ammissibile anche se è interno al cerchio."),("Rappresentazioni equivalenti","Per la retta e il suo cubo verificare geometricamente lo stesso insieme degli zeri: una tolleranza assoluta sul solo residuo cubico creerebbe una falsa banda ammissibile.")]),
14:dict(title="La tangente resta sotto il costo",objective="Collegare supporto affine e monotonia del gradiente senza invertirne i segni.",
 explanation="La funzione convessa sta sopra la sua approssimazione affine in ogni punto. Sommando i confronti nei due versi si ottiene un prodotto non negativo fra differenze di gradiente e decisione.",
 takeaway="Il supporto affine non sovrastima il costo; il prodotto monotono è ≥0.",
 obs=[("assumption","Le proprietà richiedono ℓ differenziabile e convessa.","If ℓis differentiable and convex"),
      ("equation","La fonte enuncia il limite affine al punto z_A per il valore in z_B.","it holds"),
      ("equation","Il prodotto delle differenze è non negativo per tutte le coppie; il gradiente è monotono.","monotone operator")],
 formulas=[formula("opt14-support",r"\ell(z_B)\ge\ell(z_A)+\nabla\ell(z_A)^\top(z_B-z_A)","Per ℓ differenziabile e convessa, la tangente in A usa valore e pendenza locali e non sovrastima il costo in B.","Interpretare geometricamente il limite del primo ordine.",assumptions=["ℓ differenziabile e convessa sul dominio convesso considerato."]),
   formula("opt14-monotone",MONO+r"\ge0","Il prodotto scalare mette insieme tutte le coordinate: non richiede un confronto componente per componente dei gradienti.","Capire la monotonia dell’operatore gradiente.",details=["Sommare le disuguaglianze di supporto scambiando A e B; i valori dei costi si cancellano."]),
   formula("opt14-example",r"\ell(z)=\frac14z^4+\frac12z^2,\quad\nabla\ell(z)=z^3+z","La pendenza cresce con z. La stessa funzione alimenta curva, tangente e confronti numerici.","Collegare i due risultati sulla stessa coppia di punti.",origin="enrichment")],
 controls=[control("opt14-a","Punto di tangenza","z_A",-1,1,-.5,.1,"Sposta la tangente e aggiorna gradiente, supporto e prodotto; la funzione resta fissa."),
           control("opt14-b","Punto di confronto","z_B",-1,1,.9,.1,"Muove il punto confrontato e il tratto di scarto, conservando la tangente in z_A.")],
 choices=[],prerequisites=[("Convessità differenziabile","La tangente è il supporto della funzione.",[11]),("Gradiente colonna","Il prodotto scalare usa la trasposta della colonna.",[6])],
 example=("z_A=−0.5, z_B=0.9",["Calcolare ℓ(z_A), ℓ(z_B) e ∇ℓ(z_A).","Costruire la retta affine nel punto z_A.","Verificare scarto dal supporto e prodotto monotono non negativi."],"Le coppie coincidenti danno zero in entrambi i confronti."),
 visual="Curva 2D, tangente nel punto A, costo in B e tratto verticale dello scarto; lettura del prodotto monotono.",
 edges=[("z_A=z_B","Scarto e prodotto sono esattamente zero."),("Scambio A/B","Il prodotto monotono resta uguale; il supporto cambia.")]),
15:dict(title="Stretta non significa uniformemente curva",objective="Distinguere monotonia stretta da un limite quadratico uniforme.",
 explanation="Per due punti distinti il prodotto è positivo. Può però diventare arbitrariamente piccolo rispetto alla distanza quadratica: la convessità stretta non implica quella forte.",
 takeaway="Positivo per ogni coppia distinta non significa separato da zero mediante una costante uniforme.",
 obs=[("definition","La definizione stretta usa z_A≠z_B e θ∈(0,1).","A function"),
      ("equation","La fonte stampa il prodotto strettamente positivo seguito da for all z_A,z_B: va mantenuta l’esclusione delle coppie coincidenti.","strictly monotone operator")],
 formulas=[formula("opt15-strict",JENSEN.replace(r"\le","<")+r",\quad z_A\ne z_B,\ 0<\theta<1","Il confronto è stretto soltanto fra punti distinti e lungo la parte interna del segmento.","Ricollegare monotonia e definizione di convessità stretta."),
   formula("opt15-literal",MONO+r">0\quad\forall z_A,z_B\in\mathbb Z","La formulazione stampata sottintende punti distinti; presa letteralmente include una coppia per cui il prodotto è zero.","Registrare la formula della fonte senza usarla sulle coppie coincidenti."),
   formula("opt15-distinct",MONO+r">0,\quad z_A\ne z_B","Per ℓ strettamente convessa e differenziabile, il confronto è stretto fra punti distinti. Se coincidono, il prodotto è zero.","Applicare la precisazione necessaria alla lettura della slide.",origin="correction"),
   formula("opt15-example",r"\ell(z)=\frac14z^4,\quad z_A=-h,\ z_B=h,\quad\frac{M}{\|z_A-z_B\|^2}=h^2\ (h>0)","Il gradiente z³ è strettamente crescente. Il rapporto tende a zero con h: nessun modulo uniforme positivo sull’intero dominio.","Mostrare una funzione strettamente convessa che non è fortemente convessa.",origin="enrichment",details=["M è il prodotto monotono; per h=0 il rapporto è 0/0 e non viene calcolato."])],
 controls=[control("opt15-distance","Semidistanza dei punti","h",0,1,.6,.05,"Avvicina entrambi i punti all’origine; cambia prodotto e rapporto. A h=0 il test stretto non si applica e il rapporto non è definito.")],
 choices=[],prerequisites=[("Monotonia del gradiente","Si passa da non negativo a positivo sulle coppie distinte.",[14])],
 example=("ℓ=z⁴/4 e punti ±h",["∇ℓ(z)=z³, M=4h⁴ e distanza²=4h².","Per h>0 il prodotto è positivo, ma il rapporto è h².","Per h→0 il rapporto tende a zero."],"Non attribuire al rapporto locale una costante di forte convessità globale."),
 visual="Gradiente z³ con due punti e rettangolo del prodotto; confronto numerico fra M, distanza² e rapporto.",
 edges=[("h=0","Mostrare prodotto zero, rapporto non definito, precisazione sui punti distinti."),("h piccolo","Conservare valori piccoli senza arrotondarli a una falsa uguaglianza zero.")]),
16:dict(title="Forte convessità: una curvatura minima",objective="Interpretare µ come limite uniforme inferiore e conservare una normalizzazione coerente.",
 explanation="Il prodotto cresce almeno come µ volte la distanza quadratica. µ è una garanzia uniforme, non un valore ricavato da una sola coppia di punti.",
 takeaway="µ>0 dà una garanzia uniforme; µ=0 resta un caso di confine.",
 obs=[("definition","La definizione stampata usa < e sottrae µθ(1−θ)||z_A−z_B||², senza il fattore 1/2.","parameter µ > 0"),
      ("equation","La monotonia forte stampata ha modulo µ: prodotto ≥µ||z_A−z_B||².","strongly monotone operator"),
      ("concept","La definizione della pagina è più forte della convenzione µ/2 usata dal limite inferiore di pagina 19; non trascriverla silenziosamente come convenzione standard.",None)],
 formulas=[formula("opt16-literal",SOURCE_STRONG,"La slide usa questa normalizzazione, più restrittiva. La companion adotta µ/2 e ≤ per mantenere µ coerente con monotonia e pagine successive.","Conservare il letterale della definizione."),
   formula("opt16-normalized",CORRECT_STRONG,"Il margine rispetto alla corda è almeno µ/2 volte θ(1−θ) e la distanza quadratica. La stessa µ compare nel limite di monotonia.","Fissare la convenzione dei calcoli della companion.",origin="correction"),
   formula("opt16-monotone",MONO+r"\ge\mu\|z_A-z_B\|^2","Per ℓ µ-fortemente convessa e differenziabile, un’unica µ>0 garantisce questo limite per tutte le coppie.","Distinguere forte monotonia e semplice strettezza.",assumptions=["ℓ differenziabile, µ>0, normalizzazione µ/2 nella definizione."]),
   formula("opt16-example",r"\ell(z)=\frac{\mu}{2}z^2+\frac14z^4,\quad\nabla\ell(z)=\mu z+z^3","La derivata seconda è µ+3z²: µ è una soglia uniforme. Il termine quartico aggiunge curvatura.","Confrontare una funzione con la sua base quadratica.",origin="enrichment")],
 controls=[control("opt16-mu","Modulo di curvatura",r"\mu",0,2,.5,.1,"Alza la curvatura minima, il gradiente e il limite inferiore; zero esplora soltanto il confine non forte."),
           control("opt16-distance","Semidistanza dei punti","h",0,1,.7,.05,"Sposta la coppia ±h e aggiorna M e µ distanza²; la funzione non cambia.")],
 choices=[],prerequisites=[("Convessità stretta","Positività puntuale non dà un modulo uniforme.",[15])],
 example=("µ=0.5, h=0.7",["M=4h²(µ+h²), limite inferiore=4µh².","La differenza è 4h⁴≥0.","Per una pura quadratica µz²/2, Jensen raggiunge esattamente il margine µ/2: non vale la definizione letterale stampata con la stessa µ."],"La convenzione scelta è dichiarata; la definizione letterale è una condizione più forte, non un controesempio ai risultati che ne seguono."),
 visual="Funzione e base quadratica µz²/2 sulla stessa scala, punti ±h e confronto uniforme del prodotto.",
 edges=[("µ=0","Il quartico resta strettamente convesso ma non fortemente convesso."),("h=0","Prodotto e limite nulli; non dividere per la distanza."),("Normalizzazione","Usare µ/2 e ≤ nei confronti di Jensen; non cambiare il letterale.")]),
17:dict(title="Il gradiente non cambia troppo in fretta",objective="Leggere insieme limite Lipschitz e cocoercività per una funzione convessa.",
 explanation="L limita la variazione del gradiente. Con la convessità si ottiene anche un legame fra allineamento e norma: il prodotto è almeno ||Δg||²/L.",
 takeaway="Il limite superiore L e la convessità vincolano insieme dimensione e orientamento della variazione del gradiente.",
 obs=[("assumption","ℓ è differenziabile e convessa; il gradiente è L-Lipschitz con L>0.","Consider a differentiable convex function"),
      ("equation","Il limite Lipschitz confronta la norma della differenza dei gradienti con L volte la distanza.","i.e.,"),
      ("equation","La fonte enuncia cocoercività con coefficiente 1/L.","co-coercive operator")],
 formulas=[formula("opt17-lipschitz",r"\|\nabla\ell(z_A)-\nabla\ell(z_B)\|\le L\|z_A-z_B\|","L è un limite superiore uniforme alla variazione del gradiente, non necessariamente il valore più piccolo possibile.","Interpretare la costante di regolarità.",assumptions=["L>0 e confronto su tutto il dominio dichiarato."]),
   formula("opt17-cocoercive",MONO+r"\ge\frac1L\|\nabla\ell(z_A)-\nabla\ell(z_B)\|^2","Per ℓ convessa e differenziabile con gradiente L-Lipschitz, una variazione del gradiente richiede un allineamento quantitativo con lo spostamento.","Leggere la conclusione della slide.",assumptions=["ℓ differenziabile e convessa, gradiente L-Lipschitz."]),
   formula("opt17-example",r"\ell(z)=\frac12(z_1^2+Lz_2^2),\quad z_B=0,\quad z_A=(\cos\varphi,\sin\varphi)^\top","La distanza è uno; il gradiente varia con la direzione. Δg/L deve restare nel disco di diametro fra 0 e δ.","Rendere visibili cocoercività e orientamento su una quadratica.",origin="enrichment",details=["δ=z_A−z_B, Δg=∇ℓ(z_A)−∇ℓ(z_B). Il disco è una rappresentazione aggiunta della stessa disuguaglianza, non un nuovo teorema attribuito al disegno della fonte."])],
 controls=[control("opt17-L","Limite del gradiente","L",1,4,3,.1,"Cambia la seconda curvatura, la superficie, Δg/L e i due limiti; distanza e direzione restano fisse."),
           {**control("opt17-angle","Direzione della coppia",r"\varphi",0,1.5707963267948966,.7853981633974483,.07853981633974483,"Ruota una coppia a distanza uno, il disco e i vettori; conserva L."),"unit":"rad"}],
 choices=[],prerequisites=[("Gradiente monotono","Cocoercività aggiunge un limite quantitativo.",[14])],
 example=("L=3 e φ=π/4",["δ=(1/√2,1/√2), Δg=(1/√2,3/√2).","M=2 e ||Δg||²/L=5/3.","||Δg||=√5≤3."],"Tutti i valori provengono dalla stessa quadratica; il disco usa Δg/L, non Δg."),
 visual="2D: vettori δ e Δg/L e disco equivalente; 3D: costo quadratico della stessa coppia e degli stessi parametri.",
 edges=[("L=1","Quadratica isotropa, Δg/L=δ e cocoercività in uguaglianza."),("φ=π/2","Direzione di curvatura L; entrambi i limiti sono esatti."),("L≤0","Non consentito: nessuna divisione per zero.")]),
18:dict(title="Curvatura minima e massima nello stesso limite",objective="Valutare i due termini γ₁ e γ₂ senza confondere costanti di curvatura e variabili di decisione.",
 explanation="Forte convessità e regolarità danno un limite che combina distanza fra decisioni e distanza fra gradienti. Entrambi i termini contribuiscono allo stesso confronto.",
 takeaway="Due contributi: distanza fra punti e fra gradienti, pesati da µ e L.",
 obs=[("assumption","ℓ è µ-fortemente convessa, con µ>0, e ha gradiente L-Lipschitz, con L>0.","Consider a strongly convex"),
      ("equation","Il primo coefficiente è γ₁=µL/(µ+L), il secondo γ₂=1/(µ+L).","following characterization"),
      ("equation","La disuguaglianza vale per ogni coppia nel dominio; i coefficienti sono sottolineati con parentesi graffe nella slide.",None)],
 formulas=[formula("opt18-refined",MONO+r"\ge\underbrace{\frac{\mu L}{\mu+L}}_{\gamma_1}\|z_A-z_B\|^2+\underbrace{\frac1{\mu+L}}_{\gamma_2}\|\nabla\ell(z_A)-\nabla\ell(z_B)\|^2","Con ℓ µ-fortemente convessa e gradiente L-Lipschitz, distanza e variazione del gradiente danno due contributi da sommare.","Usare contemporaneamente le due informazioni di curvatura.",[(r"\gamma_1","µL/(µ+L), peso della distanza quadratica."),(r"\gamma_2","1/(µ+L), peso della norma quadratica del gradiente.")],["µ>0, gradiente L-Lipschitz, normalizzazione µ/2; nell’esempio 0<µ≤L."]),
   formula("opt18-example",r"\ell(z)=\frac{\mu}{2}z_1^2+\frac{\mu+L}{4}z_2^2,\quad z_B=0,\quad z_A=(\cos\varphi,\sin\varphi)^\top","Curvature µ e (µ+L)/2: L è un limite valido, anche se non ottimale. Il confronto può avere margine positivo.","Esplorare contributi, uguaglianza e margine sullo stesso modello.",origin="enrichment",
    details=["Ponendo δ=z_A−z_B e Δg=∇ℓ(z_A)−∇ℓ(z_B), la disuguaglianza equivale a ||Δg−(µ+L)δ/2||≤(L−µ)||δ||/2. Il grafico divide gradiente, centro e raggio per L; δ resta di lunghezza uno. Questa riscrittura è enrichment."])],
 controls=[control("opt18-mu","Curvatura minima",r"\mu",.1,1,.5,.1,"Cambia la prima curvatura, quella intermedia e i coefficienti γ; conserva la direzione e L."),
           control("opt18-L","Limite superiore","L",1,4,3,.1,"Modifica curvatura intermedia, coefficiente γ e disco; resta sempre L≥µ."),
           {**control("opt18-angle","Direzione della coppia",r"\varphi",0,1.5707963267948966,.7853981633974483,.07853981633974483,"Ruota la coppia a distanza uno; aggiorna i due contributi senza cambiare le curvature."),"unit":"rad"}],
 choices=[],prerequisites=[("Forte convessità","Fornisce il limite inferiore µ.",[16]),("Gradiente Lipschitz","Fornisce il limite superiore L.",[17])],
 example=("µ=0.5, L=3 e φ=π/4",["La seconda curvatura è 1.75.","M=(0.5+1.75)/2=1.125.","γ₁=3/7 e γ₂=2/7; i due contributi sono distinti.","Con µ=L=1 il disco si riduce a δ e il confronto è un’uguaglianza."],"Un L non ottimale resta valido; non attribuire al massimo visualizzato il ruolo di stima universale."),
 visual="2D: Δg/L nel disco di centro (µ+L)δ/(2L) e raggio (L−µ)/(2L), con ||δ||=1; assi fissi e comuni alla pagina 17. 3D: superficie dello stesso costo e coppia corrente.",
 edges=[("µ=L=1","Disco puntiforme visibile, limite esatto, nessuna scala nulla."),("φ=0","Direzione con curvatura µ: uguaglianza."),("Costanti incompatibili","I domini separati garantiscono 0<µ≤L senza correzioni silenziose dell’input.")]),
}

def warning(n,text):
    if n==12:
        literal=text[text.index("The set Zineq"):text.index("Corollary:")].strip()
        return ("CORRECTION_WARNING",literal,P[n]["formulas"][1]["latex"],
          "⚠ Warning: possibile errore nella slide originale. Quasiconvessità: condizione sufficiente.",
          "Per un livello fissato, convessità di {g≤0} non implica quasiconvessità globale. g(x,y)=x²(x²−1) ha {g≤0}={|x|≤1}, ma il sottolivello −1/5 è sconnesso: g(±1/√2,0)=−1/4 e g(0,0)=0. Per g vettoriale si applica la condizione sufficiente a ogni componente; l’intersezione è convessa. Il corollario sulla convessità delle componenti resta valido.")
    if n==13:
        literal=text[text.index("The set Zeq"):text.index("z⊤Qz")].strip()
        return ("CORRECTION_WARNING",literal,P[n]["formulas"][1]["latex"],
          "⚠ Warning: possibile errore nella slide originale. Affinità sufficiente; insieme affine.",
          "h=(z₁+z₂−1)³ è non affine e ha l’insieme convesso degli zeri z₁+z₂=1: il solo se è falso. Con h(z)=Az−c il sistema, se compatibile, dà un insieme affine; è sottospazio quando c=0. Per p>1 non è necessariamente un unico iperpiano; può essere vuoto. Gli zeri di funzioni generiche possono essere convessi senza essere affini, ad esempio h=(max(0,||z||²−1))². Nessuna correzione dei letterali originali.")
    if n==15:
        return ("INFO_WARNING",P[n]["formulas"][1]["latex"],P[n]["formulas"][2]["latex"],
          "⚠ Nota: confronto stretto per punti distinti. Punti coincidenti: prodotto zero.",
          "La definizione iniziale della slide esclude già z_A=z_B. Il successivo for all va letto con la stessa esclusione; con A=B il prodotto è 0. Si precisa il dominio senza cambiare la convenzione del corso.")
    if n==16:
        return ("CORRECTION_WARNING",SOURCE_STRONG,CORRECT_STRONG,
          "⚠ Warning: possibile errore nella slide originale. Nella definizione usiamo ≤ e µ/2.",
          "La slide definisce una condizione più forte con < e µ, mentre il modulo del gradiente e il limite di pagina 19 usano la convenzione standard µ/2. Per ℓ(z)=µ||z||²/2, lo scarto dalla corda è esattamente µθ(1−θ)||δ||²/2: soddisfa il limite di monotonia con modulo µ e il supporto quadratico di pagina 19, ma non la definizione letterale con la stessa µ. La versione stampata può essere una definizione più restrittiva con costante diversa e implica comunque il limite più debole successivo: non si afferma che tutti i risultati della slide siano falsi. La companion dichiara esplicitamente la scelta ≤ e µ/2, conserva SOURCE_LITERAL e usa una sola normalizzazione in tutti gli esempi e in 17–18.")
    return None

def analyze(n,m,spec,corpus):
    request=build_request(DATA,spec,corpus)
    text=(SOURCE/f"pages/{n:04}/text.txt").read_text(encoding="utf-8")
    w,h=spec["source"]["geometry"]["width_pt"],spec["source"]["geometry"]["height_pt"]
    obs=[]
    for i,(category,description,quote) in enumerate(m["obs"],1):
        assert quote is None or quote in text,(n,quote)
        obs.append(dict(id=f"source-{i}",category=category,description=description,confidence=1,
            evidence=dict(page_id=spec["page_id"],modality="visual" if quote is None else "both",text_quote=quote,bbox=[0,0,w,h])))
    obs.append(dict(id="structure",category="structure",description="Titolo, impaginazione, eventuale figura, footer e numerazione fisica/visibile controllati sul rendering.",confidence=1,
        evidence=dict(page_id=spec["page_id"],modality="visual",text_quote=None,bbox=[0,0,w,h])))
    ids=[o["id"] for o in obs]
    sources=[dict(latex=f["latex"],anchor=next((o[2] for o in m["obs"] if o[2]),spec["identity"]["title"]),notes="SOURCE_LITERAL: formula o enunciato della fonte; nessuna correzione applicata a questa trascrizione.") for f in m["formulas"] if f["origin"]=="source"]
    issue=warning(n,text)
    enrich=[dict(id="explanation",label="enrichment",type="explanation",proposal=m["explanation"],source_observation_ids=ids),
            dict(id="example",label="enrichment",type="worked_example",proposal=m["example"][0],source_observation_ids=ids),
            dict(id="visual",label="enrichment",type="visualization_design",proposal=m["visual"],source_observation_ids=ids),
            dict(id="interaction",label="enrichment",type="interaction_design",proposal="Controlli e selettori dichiarati di seguito; nessun parametro attribuito alla fonte.",source_observation_ids=ids)]
    parameters=[dict(name=c["label"],symbol=c["symbol"],origin="enrichment",range=str(c["domain"]),default=str(c["default"]),effect_on_change=c["effect"],edge_cases=[x[0] for x in m["edges"]]) for c in m["controls"]]
    parameters += [dict(name=name,symbol=symbol,origin="enrichment",range=domain,default=default,effect_on_change=effect,edge_cases=[x[0] for x in m["edges"]]) for name,symbol,domain,default,effect in m["choices"]]
    contexts=[]
    for key,role in [("previous_page_id","previous"),("next_page_id","next")]:
        pid=spec["context"][key]
        if pid is None:continue
        number=corpus[pid]["source"]["physical_page_number"]
        note=P[number]["objective"] if number in P else "Pagina 9: sufficienza locale, senza convessità globale." if number==9 else "Pagina 19: interpretazione del supporto affine e quadratico, con coefficiente µ/2; solo contesto."
        contexts.append(dict(page_id=pid,role=role,note=note))
    progressive=n in (15,16,17,18)
    plan=dict(source_scope_limits=["Le formule e i grafici numerici dell’esempio sono enrichment, non dati della fonte.",
                "Z e le costanti mantengono il ruolo del corso; indici di coordinate distinti da iterazioni e tempo.",
                issue[4] if issue else "Nessuna correzione matematica necessaria dopo confronto con la pagina precedente e successiva."],
        prerequisites=[dict(concept=c,why=why,origin="source_context" if nums else "enrichment",page_numbers=nums) for c,why,nums in m["prerequisites"]],
        source_math=sources,enrichments=enrich,
        examples=[dict(id="example-1",origin="enrichment",purpose=m["objective"],setup=m["example"][0],parameters=[],derivation=m["example"][1],expected_outcome=m["example"][2],limitations=["Esempio esplicito: non sostituisce una prova della proprietà per funzioni generiche."],enrichment_id="example",source_observation_ids=ids)],
        example_omission_reason=None,
        visualization=dict(component="FunctionExplorer" if n in (12,13,17,18) else "SceneViewport",description=m["visual"],origin="enrichment",source_observation_ids=ids),
        interactivity=dict(recommended=True,rationale="Variare un solo aspetto del confronto mantenendo esplicite le invarianti.",component="ParameterControl",parameters=parameters,outputs=[m["objective"]],invariants=["PDF, testo e trascrizioni originali immutabili.","Stesso modello numerico nelle viste 2D/3D."],enrichment_id="interaction"),
        edge_cases=[dict(case=case,expected_behavior=behavior,origin="enrichment",source_observation_ids=ids) for case,behavior in m["edges"]],
        expansion_rationale="Un concetto principale per pagina, grafico leggibile e dettagli contestuali espandibili. Una companion, senza ridurre caratteri o grafici.",
        blueprint=[dict(companion_suffix=None,focus=m["objective"],source_observation_ids=ids,enrichment_ids=[e["id"] for e in enrich])])
    result=dict(protocol_version="1.0.0",request_sha256=request["request_sha256"],page_id=spec["page_id"],pdf_sha256=spec["source"]["pdf_sha256"],
        artifact_sha256={k:spec["artifacts"][k]["sha256"] for k in ("text","layout","render")},
        agent=dict(provider="OpenAI",model="GPT-6 (Codex session)",run_id="optimization-batch-b-2026-10-18"),
        inspection=dict(text_page_ids=request["required_page_ids"],layout_page_ids=request["required_page_ids"],image_page_ids=request["required_page_ids"],source_content_treated_as_data=True),
        title=spec["identity"]["title"],observations=obs,contextual_role=m["objective"],context_notes=contexts,
        notation=[dict(symbol=f["latex"],meaning=f["conceptualExplanation"],observation_ids=ids) for f in m["formulas"] if f["origin"]=="source"],
        uncertainties=[dict(description="Discrepanza della fonte esaminata e risolta nella policy companion: "+issue[4],blocking=False,observation_ids=ids)] if issue else [],
        progression=dict(assessment="progressive" if progressive else "unique",related_page_ids=[f"{DOC}:p{n-1:04}"] if progressive else [],added=[m["objective"]] if progressive else [],removed=[],changed=["Ipotesi e limite quantitativo cambiano: conservare entrambe le pagine."] if progressive else [],observation_ids=ids,rationale="Progressione concettuale verificata, non duplicazione eliminabile." if progressive else "Pagina distinta per definizione, vincolo o interpretazione; non accorpare."),
        coverage=dict(all_visible_regions_accounted_for=True,regions=[dict(bbox=[0,0,w,28],description="Titolo.",observation_ids=["structure"]),dict(bbox=[0,28,w,h-14],description="Enunciati, formule, remark ed eventuali figure letti individualmente.",observation_ids=ids),dict(bbox=[0,h-14,w,h],description="Footer, numerazione e crediti.",observation_ids=["structure"])]),
        companionPageCount=1,didactic_plan=plan,mapping_recommendation=dict(mode="one_to_one",rationale=plan["expansion_rationale"],subpages=[]))
    if m.get("progression"):
        result["progression"].update(m["progression"])
    validate_result(result,spec,corpus,DATA)
    return result,issue

def main():
    manifest_path=DATA/"optimization_companion_manifest.json"
    manifest=read_json(manifest_path)
    if any(p["source_page"]>18 for p in manifest["pages"]):raise ValueError("Il batch B non deve riscrivere batch successivi.")
    if any(p.get("implementation_status")=="implemented_in_batch_B" for p in manifest["pages"]):
        raise ValueError("Batch B già consolidato: non rigenerare pagine complete.")
    preserved=manifest["pages"][:9]
    assert [p["source_page"] for p in preserved]==list(range(1,10))
    _,_,corpus=load_corpus(DATA)
    pages=[]
    for n,m in P.items():
        path=SOURCE/f"pages/{n:04}/page_spec.json"
        spec=read_json(path)
        result,issue=analyze(n,m,spec,corpus)
        previous=spec["analysis"]["result"]
        if previous is not None and previous!=result:
            # Refine only this in-progress batch's presentation/enrichment. Freeze all source observations and literals.
            assert previous["agent"]["run_id"]==result["agent"]["run_id"],"Analisi di altra sessione: riesaminarla."
            assert previous["observations"]==result["observations"],"Osservazioni della fonte modificate."
            assert previous["didactic_plan"]["source_math"]==result["didactic_plan"]["source_math"],"SOURCE_LITERAL modificato."
        spec["analysis"]=dict(status="needs_review" if issue else "analyzed",result=result)
        spec["companionPageCount"]=1
        spec["companion_mapping"]["decision"]="proposed_after_analysis"
        notices=[]
        if issue:
            kind,literal,corrected,short,reason=issue
            correction_id=next(f["formulaId"] for f in m["formulas"] if f["origin"]=="correction")
            item=dict(issue_id=f"opt{n:02}-source-review",source_issue_index=0,issue=m["title"],type=kind,source_expression=literal,corrected_expression=corrected,companion_uses=corrected,short_warning=short,correction_reason=reason,
                use_corrected_value_for_examples=True,use_corrected_value_for_simulation=True,resolved=True,source_references=["analysis/result/observations"],context_pages_consulted=[n-1,n,n+1]+([19] if n==16 else []),
                calculation_policy="SOURCE_LITERAL immutabile; calcoli basati sulla versione companion e sulle ipotesi dichiarate.",ui=dict(show=True,color="red",placement="Accanto al concetto interessato",when="Enunciato o esempio pertinente",student_text_field="short_warning"))
            spec["source_warning"]=dict(policy_version="1.0.0",scope="companion_only",type=kind,review_status="resolved",original_analysis_sha256=sha256_bytes(json.dumps(result,ensure_ascii=False,sort_keys=True).encode()),issues=[item],companion_overrides=[],technical_only_legacy_paths=[])
            notices=[dict(issue_id=item["issue_id"],component="InfoNote" if kind=="INFO_WARNING" else "WarningBanner",text=short,color="red",adjacent_to=correction_id,visible_when="Concetto pertinente")]
        validate_schema(spec,"page-spec.schema.json")
        write_json(path,spec)
        p=json.loads(json.dumps(preserved[4]))
        three=n in (12,13,17,18)
        vis=A.visualization(8 if three else 3,dict(visual=m["visual"],controls=m["controls"],formulas=m["formulas"]))
        if three:
            label="g(z)" if n==12 else "h(z)" if n==13 else "ℓ(z)"
            vis["visualizationMode"]="2D_PRIMARY_WITH_3D"
            vis["presentation"]["defaultView"]="2D"
            vis["visualizationSemantics"]["zAxis"]["label"]=label
            vis["visualizationSemantics"]["zAxis"]["symbol"]=label
            if n in (12,13):
                vis["visualizationSemantics"]["zAxis"]["role"]="constraint_residual"
                vis["visualizationSemantics"]["zMeaning"]="Residuo del vincolo: ammissibilità rispetto al livello zero, non costo da minimizzare."
            vis["twoDRequirements"]["plotType"]="constraint" if n in (12,13) else "vector"
            vis["twoDRequirements"]["relationshipTo3D"]="Stessa funzione e coppia/sonda; il 2D rappresenta il livello o il confronto fra gradienti, non una nuova funzione."
            vis["reusableVisualizationComponents"]=["FunctionExplorer","SceneViewport","ConstraintVisualizer"] if n in (12,13) else ["FunctionExplorer","SceneViewport"]
            if n in (17,18):
                vis["twoDRequirements"]["projectionOf3D"]=False
                vis["twoDRequirements"]["axes"]=["Componente 1 [1]","Componente 2 [1]"]
                vis["twoDRequirements"]["relationshipTo3D"]="Vettori e disco derivati dal gradiente della stessa funzione 3D; non una proiezione geometrica della superficie."
        else:
            x="z₁" if n==10 else "z"
            y="z₂" if n==10 else "∇ℓ(z)" if n==15 else "ℓ(z)"
            vis["visualizationSemantics"]["xAxis"]=dict(symbol=x,label=x,unit="1",role="decision",domain="Dominio fisso dell’esempio mostrato.")
            vis["visualizationSemantics"]["yAxis"]=dict(symbol=y,label=y,unit="1" if n in (10,15) else "valore",role="decision" if n==10 else "gradient" if n==15 else "cost",domain="Scala esplicita e fissa del grafico.")
            vis["twoDRequirements"]["axes"]=[x,y]
            vis["twoDRequirements"]["plotType"]="set_and_segment" if n==10 else "curve"
        p.update(source_page=n,source_pdf_label=spec["source"]["pdf_label"],page_id=spec["page_id"],companionPageCount=1,title=m["title"],learning_objective=m["objective"],prerequisite=result["didactic_plan"]["prerequisites"],
            key_ideas=[o[1] for o in m["obs"]],intuitive_explanation=m["explanation"],mathematical_explanation=m["objective"],
            formulas_to_show=[dict(id=f["formulaId"],expression=f["latex"],origin=f["origin"],reference=spec["page_id"],computation_input=False) for f in m["formulas"]],
            worked_example=dict(required=True,omission_reason=None,student_rendering="Esempio aggiunto",items=[{**result["didactic_plan"]["examples"][0],"display_label":"Esempio aggiunto","mathematical_status":"Modello esplicito verificato, senza dati numerici attribuiti alla fonte."}]),
            controls=[{k:v for k,v in c.items() if k!="effect"} for c in m["controls"]],
            expected_parameter_effects=[dict(control_id=c["id"],effect=c["effect"],changes=[c["effect"]],output_context=[m["visual"]],invariants=["Stesso modello in formule, grafici e risultati."],edge_cases=[x[0] for x in m["edges"]]) for c in m["controls"]],
            edge_cases=result["didactic_plan"]["edge_cases"],takeaway=m["takeaway"],reusable_components=vis["reusableVisualizationComponents"],
            source_warning=dict(type=issue[0] if issue else "NO_WARNING",student_notices=notices),visualization=vis,
            interaction=dict(enabled=True,effective_enabled=True),relation_to_previous_page=dict(source_page=n-1,role="Contesto e prerequisito"),
            relation_to_next_page=dict(source_page=n+1,role="Sviluppo successivo"),implementation_status="batch_B_in_progress")
        pages.append(p)
        progress=ROOT/"Docs/OPTIMIZATION_PROGRESS.md"
        content=progress.read_text(encoding="utf-8")
        lines=content.splitlines()
        lines=[f"- Pagina in lavorazione: {n}; analisi e progetto salvati, implementazione/revisione B in corso." if l.startswith("- Pagina in lavorazione:") else l for l in lines]
        progress.write_text("\n".join(lines)+"\n",encoding="utf-8")
        print(f"p{n}: analisi e design validati",flush=True)
    manifest["pages"]=preserved+pages
    manifest["warning_handling"]["correction_pages"]=[p["source_page"] for p in manifest["pages"] if p["source_warning"]["type"]=="CORRECTION_WARNING"]
    manifest["warning_handling"]["info_pages"]=[p["source_page"] for p in manifest["pages"] if p["source_warning"]["type"]=="INFO_WARNING"]
    assert manifest["pages"][:9]==preserved
    write_json(manifest_path,manifest)
    dest=ROOT/"frontend/src/companion/optimization/convexityNotes.ts"
    dest.write_text("import type {FormulaExplanation} from '../../components/ExplainedEquation';\nexport const convexityFormulaNotes = "+json.dumps({n:m["formulas"] for n,m in P.items()},ensure_ascii=False,indent=2)+" as const satisfies Readonly<Record<number,readonly FormulaExplanation[]>>;\n",encoding="utf-8")

if __name__=="__main__":main()
