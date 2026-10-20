"""Source inspection and companion design for physical pages 69–74 only."""
import importlib.util
from pathlib import Path
loader=importlib.util.spec_from_file_location('optimization_authoring',Path(__file__).with_name('optimization-authoring.py'))
H=importlib.util.module_from_spec(loader);loader.loader.exec_module(H)
formula,control=H.formula,H.control
RESIDUAL=r'\nabla L(z,\lambda)=\begin{bmatrix}\nabla\ell(z)+\nabla h(z)\lambda\\h(z)\end{bmatrix}=0'
BLOCK=r'\begin{bmatrix}B^k&\nabla h(z^k)\\\nabla h(z^k)^\top&0\end{bmatrix}\begin{bmatrix}\Delta z\\\Delta\lambda\end{bmatrix}=-\begin{bmatrix}\nabla\ell(z^k)+\nabla h(z^k)\lambda^k\\h(z^k)\end{bmatrix}'
UPDATE=r'\begin{bmatrix}z^{k+1}\\\lambda^{k+1}\end{bmatrix}=\begin{bmatrix}z^k\\\lambda^k\end{bmatrix}+\begin{bmatrix}\Delta z^k\\\Delta\lambda^k\end{bmatrix}'
MODEL=r'\ell(z)=\tfrac12(z_1^2+(z_2-1)^2),\qquad h(z)=z_2-z_1^2'
QP=r'\begin{aligned}\min_{\Delta z}\;&\nabla\ell(z^k)^\top\Delta z+\tfrac12\Delta z^\top B^k\Delta z\\\text{subj.to }&h(z^k)+\nabla h(z^k)^\top\Delta z=0\end{aligned}'
def ex(n,text):return formula(f'opt{n}-example',MODEL,text,'Definire il modello aggiunto comune alle pagine 70–74.',origin='enrichment')
def parameters(n,initial=False,l0=.2):
 s='0' if initial else 'k'
 return [control(f'opt{n}-x','Ascissa iniziale' if initial else 'Ascissa corrente',f'z_1^{s}',-1.2,1.2,1,.1,'Muove il punto iniziale e ricalcola l’intera sequenza con gli stessi costo e vincolo.' if initial else 'Cambia punto, gradiente del vincolo, residuo e sistema locale; non cambia il problema.'),
  control(f'opt{n}-y','Ordinata iniziale' if initial else 'Ordinata corrente',f'z_2^{s}',-.2,1.5,1,.1,'Cambia l’ammissibilità iniziale e ricalcola la sequenza; al cambio dei parametri Play si ferma e k torna a zero.' if initial else 'Modifica h e il termine noto; il vincolo linearizzato corregge il residuo solo al primo ordine.'),
  control(f'opt{n}-lambda','Moltiplicatore iniziale' if initial else 'Moltiplicatore corrente',f'\lambda^{s}',-.5,1.5,l0,.1,'Inizializza anche λ⁰, necessario per B⁰. Cambia i QP e ricalcola la sequenza, senza cambiare ℓ o h.' if initial else 'Cambia B=diag(1−2λ,1), il residuo di stazionarietà e la direzione; costo e vincolo restano fissi.')]
P={
69:dict(title='Dalle condizioni KKT agli aggiornamenti',objective='Orientarsi fra residuo KKT, sistema Newton e sequenza di QP locali.',
 explanation='Le condizioni di ottimalità diventano equazioni da risolvere. Per le uguaglianze, Newton costruisce un sistema lineare; la stessa struttura collega il passo a un QP locale.',
 takeaway='Punto KKT, direzione Newton e minimo del QP hanno ruoli da distinguere.',
 obs=[('structure','Titolo centrale di sezione: algoritmi con uguaglianze e disuguaglianze; nessuna formula, figura o footer.',None)],
 formulas=[],controls=[],choices=[],prerequisites=[('KKT e QP vincolati','Ora si costruiscono algoritmi, a partire dalle condizioni già studiate.',[60,67,68])],example=None,
 visual='Tre schede statiche: residuo da annullare; sistema Newton locale; sequenza di QP e aggiornamenti. Mappa aggiunta al titolo.',
 scope=['La fonte contiene solo una divisoria; non attribuirle algoritmi o garanzie tecniche.'],edges=[],interaction_reason='La mappa statica è sufficiente per orientarsi.'),
70:dict(title='Un residuo per decisioni e moltiplicatori',objective='Leggere ∇L come gradiente congiunto in z e λ, composto da stazionarietà e fattibilità.',
 explanation='Annullare solo il bilancio dei gradienti non impone il vincolo. Il residuo congiunto raccoglie entrambe le equazioni e vive in R^{d+m}.',
 takeaway='Un residuo KKT nullo non certifica da solo che il punto sia minimo.',
 obs=[('definition','Minimizzazione di ℓ:R^d→R soggetta a h:R^d→R^m con h(z)=0.','equality-constrained minimization'),
  ('equation','Le condizioni del primo ordine sono ∇ℓ(z)+∇h(z)λ=0 e h(z)=0.',None),
  ('equation','Le raccoglie nel gradiente congiunto ∇L(z,λ); ∇h ha forma d×m nella convenzione del corso.','which can be written')],
 formulas=[formula('opt70-residual',RESIDUAL,'La parte superiore impone stazionarietà, quella inferiore h=0. ∇h∈Rᵈˣᵐ e ∇L∈Rᵈ⁺ᵐ.','Separare le due condizioni e le dimensioni.',assumptions=['Per dedurre KKT da un minimo servono le condizioni di regolarità del contesto 57–60.']),
  formula('opt70-problem',r'\min_{z\in\mathbb R^d}\ell(z)\quad\text{subj.to }h(z)=0','Qui ci sono solo uguaglianze: λ è libero nel segno.','Fissare il problema a cui appartiene il residuo.'),
  ex(70,'Nel modello aggiunto, r=((1−2λ)z₁,z₂−1+λ,z₂−z₁²). λ modifica il residuo, non ℓ o il vincolo.'),
  formula('opt70-roots',r'(z,\lambda)=((\pm1/\sqrt2,1/2),1/2),\quad((0,0),1)',
   'I primi due punti sono minimi sul vincolo, il terzo è massimo locale sul vincolo: tutti annullano r.','Dare esempi numerici di radici con classificazioni diverse.',origin='enrichment')],
 controls=parameters(70,l0=.2),choices=[('Mostra minimo KKT / Mostra massimo KKT','preset','Due radici analitiche','Punto corrente (1,1), λ=.2','Imposta punto e moltiplicatore a una radice nota, conservando costo e parabola.')],
 prerequisites=[('Moltiplicatori e gradiente congiunto','∇L non coincide con la sola ∇₁L.',[58,63]),('Necessità e sufficienza','Un punto KKT può non essere minimo.',[62])],
 example=('z=(1,1), λ=0.2',['r=(0.6,0.2,0).','Il punto è ammissibile ma non stazionario; ||r||=√0.4≈0.632456.','Nel punto (0,0),λ=1, r=0 ma ℓ(x,x²)=0.5−0.5x²+0.5x⁴ ha massimo locale all’origine.'],'Annullare il residuo non risolve la classificazione del punto.'),
 visual='Livelli del costo e parabola h=0 in 2D; accanto barre con segno dei tre residui. Superficie 3D dello stesso costo con lo stesso punto. λ non è l’altezza e non modifica la superficie.',
 axes=('z₁','z₂','decision'),three=True,camera_elevation=50,
 scope=['Il problema numerico e le tre radici sono enrichment. Non chiamare ottimo un punto di prova.','Le norme quasi nulle da arrotondamento sono indicate come approssimate.'],
 edges=[('h=0 ma gradiente non nullo','Ammissibile, non KKT.'),('r=0 al massimo','KKT valido, minimo assente.'),('λ cambia','Il costo resta fisso; cambiano i residui.')],
 interaction_reason='Le tre barre distinguono i residui; i preset confrontano minimo e massimo con le stesse equazioni nulle.'),
71:dict(title='Newton cerca una radice anche nei moltiplicatori',objective='Comprendere l’aggiornamento congiunto e il ruolo della Hessiana completa della Lagrangiana come Jacobiano del residuo.',
 explanation='Newton risolve un sistema per gli incrementi di z e λ. È un metodo per trovare una radice KKT: una radice trovata può ancora non essere un minimo.',
 takeaway='Newton cerca una radice KKT: il minimo non è garantito.',
 obs=[('concept','Definisce r(z,λ)=∇L(z,λ) e tratta i punti KKT come radici in entrambe le variabili.','root finding'),
  ('equation','Aggiorna z e λ sommando rispettivamente Δz e Δλ.',None),
  ('equation','Gli incrementi risolvono ∇²L(z^k,λ^k)[Δz;Δλ]=−∇L(z^k,λ^k).',None),
  ('definition','La Hessiana completa ha blocchi B^k, ∇h, ∇hᵀ,0; B^k=∇²₁₁L. Il residuo espanso è riportato a destra.',None)],
 formulas=[formula('opt71-update',UPDATE,'Δλᵏ si somma a λᵏ. Si aggiorna anche z; k conta iterazioni.','Rendere esplicito il significato del passo congiunto.'),
  formula('opt71-newton',r'\nabla^2L(z^k,\lambda^k)\begin{bmatrix}\Delta z\\\Delta\lambda\end{bmatrix}=-\nabla L(z^k,\lambda^k)',
   'È Newton per il residuo r=∇L; il suo Jacobiano è la Hessiana congiunta. Servono derivabilità adeguata e sistema risolvibile.','Collegare il metodo al root finding non vincolato.',details=['La formula scritta presuppone la disponibilità delle derivate seconde; per un passo unico il sistema deve essere non singolare.','Con singolarità compatibile possono esserci infinite direzioni; con singolarità incompatibile nessuna. Non si sceglie arbitrariamente un’inversa.']),
  formula('opt71-block',r'\nabla^2L(z^k,\lambda^k)=\begin{bmatrix}B^k&\nabla h(z^k)\\\nabla h(z^k)^\top&0\end{bmatrix},\quad B^k=\nabla^2_{11}L(z^k,\lambda^k)',
   'Bᵏ include la curvatura dei vincoli pesata da λᵏ; il blocco zero deriva dalla linearità di L nei moltiplicatori.','Leggere i blocchi senza scambiare la convenzione d×m di ∇h.'),
  ex(71,'Si usa B=diag(1−2λ,1). Play seleziona iterati precalcolati; cambiare l’inizializzazione mette in pausa e riparte da k=0.')],
 controls=parameters(71,True,0),choices=[('Iterazione / Play-Pausa / Passo / Riparti','k','Iterati disponibili, massimo dodici passi','k=0','Seleziona un campione algoritmico già calcolato; non integra una dinamica.')],
 prerequisites=[('Residuo congiunto','Due variabili da aggiornare insieme.',[70]),('Newton per radici','Si risolve un sistema lineare, non necessariamente un problema di minimo.',[34])],
 example=('z⁰=(1,1), λ⁰=0',['B⁰=I; Δz⁰=(−0.2,−0.4), Δλ⁰=0.4.','z¹=(0.8,0.6), λ¹=0.4, h(z¹)=−0.04.','Il modello lineare del vincolo era zero, ma il vincolo reale non lo è.','Da (0,0.4),λ=1 si arriva invece alla radice (0,0),λ=1, massimo locale sul vincolo.'],'Newton per KKT può convergere a una radice non ottima.'),
 visual='Iterati z^k sui livelli 2D, parabola ammissibile e norma del residuo rispetto a k; vista 3D del costo con gli stessi campioni. λ corrente nei risultati, mai come altezza della superficie.',
 axes=('z₁','z₂','decision'),three=True,camera_elevation=50,animation=True,progressive=True,
 progression=dict(assessment='progressive',related_page_ids=[f'{H.DOC}:p0072'],added=['Definizione del root finding, aggiornamento e Hessiana a blocchi.'],removed=[],changed=[],rationale='Sviluppo in due pagine con stesso titolo ma footer 63|73 e 64|73 distinti: non sono raster duplicati. La 72 riprende ed espande il sistema.'),
 scope=['Dodici passi massimi e tolleranza 10⁻¹⁰ sono scelte operative dell’esempio. Nessuna garanzia globale attribuita alla fonte.','Singolarità esatta distinta da valori piccoli non nulli; arresti numerici distinti da teoremi di divergenza.'],
 edges=[('Radice massimo','Fermarsi come radice KKT, senza dichiarare minimo.'),('Sistema singolare','Distinguere famiglia e incompatibilità; nessuna direzione inventata.'),('Valori fuori ritaglio','Conservare i numeri e omettere le coordinate estreme dai buffer grafici.'),('Cambio parametri','Pausa e ritorno a k=0.')],
 interaction_reason='L’iterazione collega movimento delle decisioni, moltiplicatore e residuo; i valori iniziali cambiano il bacino e la solvibilità.'),
72:dict(title='Il vincolo si annulla solo nel modello lineare',objective='Leggere le due righe del sistema Newton e distinguere fattibilità linearizzata e fattibilità dopo il passo.',
 explanation='La riga inferiore impone h(zᵏ)+∇h(zᵏ)ᵀΔz=0. Se h è non lineare, il punto aggiornato può ancora violare il vincolo reale.',
 takeaway='Risolvere esattamente il sistema locale non impone h(zᵏ+Δz)=0.',
 obs=[('equation','Esplicita il sistema a blocchi con incognite Δz,Δλ e termine noto negativo del residuo congiunto.','Namely'),
  ('concept','Conclude che i due incrementi si ricavano come soluzione di un sistema di equazioni lineari.','linear system of equations')],
 formulas=[formula('opt72-system',BLOCK,'Sopra: bilancio linearizzato. Sotto: vincolo al primo ordine.','Separare le due righe e il segno del termine noto.'),
  ex(72,'Nel modello, h(zᵏ+Δz)=−(Δz₁)² dopo un passo che annulla il vincolo linearizzato. Il residuo reale è di secondo ordine.'),
  formula('opt72-reduction',r'D=1-2\lambda+4z_1^2,\quad D\Delta z_1=z_1(1-2z_1^2),\quad\Delta z_2=-h(z)+2z_1\Delta z_1',
   'È l’eliminazione esatta delle tre equazioni del modello. D=0 richiede un controllo di compatibilità, non una divisione.','Verificare il sistema con un caso numerico esplicito.',origin='enrichment'),
  formula('opt72-remainder',r'h(z+\theta\Delta z)=h(z)+\theta\nabla h(z)^\top\Delta z-\theta^2(\Delta z_1)^2',
   'Il grafico confronta residuo esatto e residuo linearizzato lungo il segmento; θ è solo un parametro del confronto aggiunto.','Mostrare il termine che la linearizzazione trascura.',origin='enrichment')],
 controls=parameters(72),choices=[('Preset singolari','preset','D=0 compatibile / D=0 incompatibile','Punto (1,1), λ=.2','Imposta punti analitici per distinguere nessuna soluzione e infinite direzioni; conserva costo e vincolo.')],
 prerequisites=[('Newton KKT','Il sistema espanso viene dalla Hessiana congiunta.',[71]),('Linearizzazione','Un’approssimazione affine non coincide con il vincolo nonlineare.',[5,29])],
 example=('z=(1,1), λ=.2',['D=4.6, Δz=(−5/23,−10/23), Δλ≈0.234783.','Residuo linearizzato del vincolo zero.','Il punto aggiornato (18/23,13/23) ha h=−25/529≈−0.047259.','Con z₁=0,λ=.5 il sistema singolare è compatibile; con z₁=.5,λ=1 è incompatibile.'],'Un residuo del sistema piccolo non è il residuo nonlineare finale.'),
 visual='Livelli del costo, parabola, retta del vincolo linearizzato e segmento del passo; a destra residui reale e lineare lungo θ∈[0,1]. 3D con lo stesso costo e passo, senza altezze interpolate artificialmente.',
 axes=('z₁','z₂','decision'),three=True,camera_elevation=50,progressive=True,
 progression=dict(assessment='progressive',related_page_ids=[f'{H.DOC}:p0071'],added=['Sistema Newton espanso e conclusione sul sistema lineare.'],removed=['Non ripete la formula di aggiornamento e la definizione separata di r.'],changed=['Focus sul sistema da risolvere, non sul ciclo completo.'],rationale='Continuazione con stesso titolo e footer diverso, non overlay eliminabile. Ogni pagina fisica mantiene una propria companion.'),
 scope=['Il confronto su θ è enrichment, non una scelta del passo o una merit function della fonte. Non implementare K.','Il residuo del modello lineare e quello reale restano distinti anche quando il punto iniziale è già ammissibile.'],
 edges=[('Δz₁=0','La parabola non introduce resto quadratico nel passo.'),('D=0, termine noto zero','Infinite direzioni; non selezionarne una arbitrariamente.'),('D=0, termine noto nonzero','Nessuna soluzione al sistema.'),('D piccolo nonzero','Calcolare il passo finito quando possibile e dichiarare eventuali limiti numerici.')],
 interaction_reason='Punto e λ cambiano il sistema; i preset isolano le singolarità mentre il grafico mostra esattamente il resto nonlineare.'),
73:dict(title='Il QP locale richiede la curvatura giusta',objective='Collegare il sistema Newton alle KKT del QP, correggendo l’affermazione di sufficienza priva di ipotesi.',
 explanation='Il moltiplicatore del QP è λᵏ⁺¹=λᵏ+Δλᵏ. Le equazioni del QP sono necessarie; diventano sufficienti al minimo con curvatura non negativa sulle direzioni ammissibili.',
 takeaway='Sistema Newton invertibile non significa QP con minimo.',
 obs=[('equation','Riscrive le due righe del sistema e sostituisce λ^k+Δλ^k con λ^{k+1}.',None),
  ('equation','Introduce il QP con costo ∇ℓ(z^k)ᵀΔz+ΔzᵀB^kΔz/2 e vincolo linearizzato.','Quadratic Program'),
  ('concept','Afferma necessary and sufficient senza esplicitare la semidefinitezza di B^k sulle direzioni del vincolo lineare; B^k=∇²₁₁L non la garantisce.','necessary and sufficient'),
  ('concept','Conclude che Newton può ottenere (Δz^k,λ^{k+1}) risolvendo il QP: questa interpretazione richiede che il QP abbia un minimo.',None)],
 formulas=[formula('opt73-qp',QP,'Moltiplicatore: λᵏ⁺¹. Verde h=0; rosso vincolo affine; viola stazionario.','Dare il significato di entrambe le uscite del QP.',details=['Il QP usa un costo quadratico locale e il vincolo linearizzato. Il suo moltiplicatore è il nuovo λ, non l’incremento Newton.','Il punto viola è uno stazionario del modello: è minimo soltanto con la curvatura appropriata.']),
  formula('opt73-kkt',r'\begin{aligned}\nabla\ell(z^k)+B^k\Delta z+\nabla h(z^k)\lambda&=0\\h(z^k)+\nabla h(z^k)^\top\Delta z&=0\end{aligned}',
   'Sono le equazioni stazionarie del QP. La fonte le chiama necessarie e sufficienti senza la condizione di curvatura.','Conservare le equazioni corrette della fonte.'),
  formula('opt73-literal',r'\text{necessary and sufficient optimality conditions for the QP}',
   'Trascrizione della frase problematica, conservata nei riferimenti; non viene usata come garanzia senza ipotesi.','Tracciare l’affermazione che richiede precisazione.'),
  formula('opt73-validity',r'y^\top B^k y\ge0\quad\forall y:\ \nabla h(z^k)^\top y=0',
   'Su un vincolo affine compatibile, questa condizione rende sufficienti le equazioni KKT del QP; la stretta positività sulle direzioni non nulle dà unicità del passo.','Usare la versione matematicamente valida nei calcoli e nei casi mostrati.',origin='correction',details=['Non occorre B^k≥0 in tutto lo spazio: basta sullo spazio nullo del Jacobiano del vincolo linearizzato.','La 68 già distingue la curvatura ridotta da quella completa. Il sistema Newton resta un sistema di radici anche con curvatura ridotta negativa.','Unicità del passo e unicità del moltiplicatore sono distinte: con z=0,λ=.5, Δz=(s,0) è una famiglia di minimi del QP, ma il moltiplicatore QP è sempre 1.']),
  formula('opt73-multiplier',r'\lambda^{k+1}=\lambda^k+\Delta\lambda^k',
   'L’incremento Newton e il moltiplicatore del QP sono due quantità diverse.','Evitare una doppia somma di λᵏ.'),
  ex(73,'Lungo Δz=(s,−h+2z₁s), il modello è m(s)=Ds²/2−z₁(1−2z₁²)s+C, con D=1−2λ+4z₁².'),
  formula('opt73-counterexample',r'z=(0,0),\ \lambda=1:\quad B=\operatorname{diag}(-1,1),\quad\Delta z_2=0,\quad m=-\tfrac12(\Delta z_1)^2',
   'Newton ha direzione stazionaria zero e sistema invertibile, ma il QP non ha minimo: il costo tende a −∞.','Verificare perché la sufficienza incondizionata è falsa.',origin='enrichment')],
 controls=parameters(73),choices=[('Preset del modello','preset','QP illimitato / D=0 compatibile / D=0 incompatibile','Punto (1,1), λ=.2','Imposta casi analitici del sistema e del QP senza modificare ℓ o h.')],
 prerequisites=[('Sistema Newton','Passo e incremento λ dalla 72.',[72]),('Curvatura dei QP','Serve non negatività sulle direzioni del vincolo.',[67,68])],
 example=('z=(1,1), λ=.2',['D=4.6>0: minimo unico del QP.','Δz₁=−5/23; λ_QP=10/23≈0.434783.','Δλ_Newton=λ_QP−0.2≈0.234783.','Nel controesempio z=0,λ=1, D=−1: sistema unico ma QP illimitato.','Con z=0,λ=.5 il QP ha minimi Δz=(s,0), ma moltiplicatore unico λ_QP=1.'],'Equivalenza al minimo del QP soltanto sotto l’ipotesi dichiarata.'),
 visual='Geometria del passo e costo originale in 2D/3D; profilo del modello QP lungo tutte le direzioni linearizzate, con stazionario e curvatura ridotta. Minimo, massimo e assenza di un punto unico distinti.',
 axes=('z₁','z₂','decision'),three=True,camera_elevation=50,
 scope=['CORRECTION_WARNING sulla sufficienza e sull’interpretazione come argmin. Nessuna modifica a formule, testo o PDF originali.','Non regolarizzare B di nascosto per forzare un QP convesso; se il QP è illimitato, dichiararlo.'],
 edges=[('D<0','QP illimitato, stazionario Newton eventualmente unico.'),('D=0, termine lineare nonzero','QP illimitato e KKT incompatibili.'),('D=0, termine lineare zero','Famiglia di minimi del QP, direzione non unica. Per z₁=0 il moltiplicatore è comunque unico: λ_QP=1.'),('B indefinita ma D>0','QP vincolato con minimo unico: la positività globale non serve.')],
 interaction_reason='I parametri cambiano la curvatura ridotta e il modello; i preset separano invertibilità del sistema ed esistenza del minimo.'),
74:dict(title='SQP: un QP locale a ogni iterazione',objective='Seguire il ciclo SQP senza scambiare il moltiplicatore del QP per un incremento da accumulare.',
 explanation='Si aggiornano derivate e QP, poi z avanza del passo e λ prende il valore del moltiplicatore del QP. Il ciclo richiede QP risolvibili; il passo pieno non dà garanzie globali.',
 takeaway='Il moltiplicatore del QP sostituisce λᵏ; soltanto Δλ_Newton si somma.',
 obs=[('algorithm','Parte da z⁰ e ripete il calcolo di ∇ℓ, B^k e ∇h; l’inizializzazione di λ non è esplicitata.','Start from'),
  ('equation','Δz^k minimizza il QP con gradiente del costo e vincolo linearizzato. Il simbolo Δλ_QP^k denomina il moltiplicatore del QP.','Lagrange multiplier'),
  ('equation','Aggiornamenti stampati: z^{k+1}=z^k+Δz^k e λ^{k+1}=Δλ_QP^k. Il secondo è un’assegnazione, non una somma.',None)],
 formulas=[formula('opt74-update',r'\begin{aligned}z^{k+1}&=z^k+\Delta z^k\\\lambda^{k+1}&=\Delta\lambda_{\mathrm{QP}}^k\end{aligned}',
   'Δλ_QPᵏ è λᵏ⁺¹: si assegna, senza sommarlo a λᵏ.','Preservare esattamente il significato della notazione della slide.'),
  formula('opt74-qp',r'\Delta z^k=\arg\min_{\Delta z}\ \nabla\ell(z^k)^\top\Delta z+\tfrac12\Delta z^\top B^k\Delta z\quad\text{s.t. }h(z^k)+\nabla h(z^k)^\top\Delta z=0',
   'Il QP deve avere una soluzione; nell’esempio si usa l’esatta Bᵏ di Newton. Se il modello non ha minimo, il ciclo si arresta esplicitamente.','Non inventare un argmin quando il QP è illimitato.'),
  ex(74,'Si inizializza anche λ⁰, dato aggiunto necessario per B⁰. Nessuna line search o modifica nascosta di B: dodici passi massimi, tolleranza ||r||≤10⁻¹⁰.'),
  formula('opt74-two-lambdas',r'\Delta\lambda_{\mathrm{Newton}}^k=\Delta\lambda_{\mathrm{QP}}^k-\lambda^k',
   'Stesso aggiornamento della 71, espresso attraverso il moltiplicatore del QP. Le due quantità coincidono solo se λᵏ=0.','Confrontare in numeri assegnazione e incremento.',origin='enrichment')],
 controls=parameters(74,True,.2),choices=[('Iterazione / Play-Pausa / Passo / Riparti','k','Campioni disponibili, fino a dodici passi','k=0','Seleziona gli iterati SQP precalcolati; cambiare l’inizializzazione ferma Play e riporta a k=0.')],
 prerequisites=[('Equivalenza Newton/QP','Stesse direzioni se il QP ha minimo unico.',[73]),('Iterazioni','k è indice algoritmico, non tempo fisico.',[27,71])],
 example=('z⁰=(1,1), λ⁰=.2',['Il primo QP dà Δz=(−5/23,−10/23), Δλ_QP=10/23≈.434783.','λ¹=.434783, non .2+.434783.','L’incremento Newton è invece .234783.','Un avvio con D<0 rende il QP illimitato: nessun passo SQP viene fabbricato.'],'La notazione con Δ non cambia il ruolo di moltiplicatore completo del QP.'),
 visual='Sequenza dei punti SQP sui livelli e sulla superficie del costo, parabola e norma del residuo rispetto a k. Risultati affiancano λ corrente, nuovo moltiplicatore QP e incremento Newton; stato del ciclo sempre esplicito.',
 axes=('z₁','z₂','decision'),three=True,camera_elevation=50,animation=True,
 scope=['La definizione di Bᵏ viene dalla 71; λ⁰ è enrichment dichiarato, non un dato originale.','La notazione Δλ_QP della fonte è corretta con il suo aggiornamento: chiarimento locale, nessun warning rosso inutile.','Nessun passo di merit function/Armijo e nessuna implementazione delle pagine 75–81.','Nessuna promessa di discesa del costo o fattibilità esatta a ogni passo pieno.'],
 edges=[('QP illimitato','Arresto esplicito, nessuna direzione stazionaria spacciata per argmin.'),('QP con minimi multipli','Direzione non unica: arresto con motivazione, senza scelta arbitraria.'),('Residuo piccolo','Arresto numerico, non certificazione automatica di minimo.'),('Inizializzazione diversa','Possibili radici o fallimenti diversi; nessuna garanzia globale.')],
 interaction_reason='Le iterazioni rendono visibile la sequenza di modelli; il confronto dei moltiplicatori impedisce l’errore della doppia somma.')
}
def warning(n,text):
 if n==73:return ('CORRECTION_WARNING','are the necessary and sufficient optimality conditions for the Quadratic Program (QP)',
  r'\text{KKT sufficienti se }y^\top B^k y\ge0\ \forall y:\nabla h(z^k)^\top y=0',
  '⚠ Warning: possibile errore nella slide originale. Serve curvatura non negativa sulle direzioni ammissibili.',
  'Le due equazioni sono sempre le condizioni stazionarie del QP affine, ma la fonte non assume B^k positiva semidefinita sullo spazio nullo di ∇h(z^k)ᵀ. B^k=∇²₁₁L può essere indefinita. Su un insieme affine compatibile, la non negatività della forma ridotta rende le KKT sufficienti al minimo globale del QP; con stretta positività si ha unicità. Nel modello aggiunto, z=(0,0),λ=1 produce B=diag(−1,1), vincolo Δz₂=0 e costo −(Δz₁)²/2: il sistema Newton è invertibile e ha soluzione zero, ma il QP è illimitato. Il criterio dichiarato e tutti gli esempi distinguono D>0, D<0 e i due casi D=0. Non viene regolarizzata la Hessiana per nascondere il problema. Fonte e SOURCE_LITERAL restano intatti.')
 return None
def visual(n,vis,m):
 if m.get('three'):
  vis['twoDRequirements'].update(plotType='primal_dual_geometry_and_residual_or_local_model',relationshipTo3D='Stesso costo, parabola, punti e passi. Il pannello destro 2D mostra residui o modello locale, dichiarati separatamente dal costo 3D.')
  vis['visualizationSemantics']['explanation']='Il terzo asse è ℓ(z); λ è un moltiplicatore nei readout, k un indice algoritmico.'
  if n not in (71,74):
   vis['threeDRequirements']['trajectory'].update(enabled=n in (72,73),kind='single_update' if n in (72,73) else 'none')
   vis['threeDRequirements']['animation'].update(enabled=False)
if __name__=='__main__':
 H.persist_batch(P,69,74,'J',{68:'Curvatura ridotta dei QP: versione corretta Ay=0 e ker(A).',75:'Merit function e scelta del passo: consultata solo come contesto futuro, non implementata.'},
  'sqpNotes.ts','sqpFormulaNotes',warning_resolver=warning,configure_visualization=visual,analysis_date='2026-10-19')
