"""Individually inspected physical pages 75–81; preserve every completed batch."""
import importlib.util
from pathlib import Path
loader=importlib.util.spec_from_file_location('optimization_authoring',Path(__file__).with_name('optimization-authoring.py'))
H=importlib.util.module_from_spec(loader);loader.loader.exec_module(H)
formula,control=H.formula,H.control
MODEL=r'\ell(z)=\tfrac12(z_1^2+(z_2-1)^2),\quad h(z)=z_2-z_1^2'
MERIT=r'M_1(z;s)=\ell(z)+s\|h(z)\|_1'
QP=r'\min_{\Delta z}\ \nabla\ell(z^k)^\top\Delta z+\tfrac12\Delta z^\top B^k\Delta z\quad\text{s.t. }h(z^k)+\nabla h(z^k)^\top\Delta z=0'
def c(n,key,label,symbol,low,high,default,step,effect):return control(f'opt{n}-{key}',label,symbol,low,high,default,step,effect)
def ex(n,text):return formula(f'opt{n}-example',MODEL,text,'Conservare il problema numerico aggiunto del batch J.',origin='enrichment')
P={
75:dict(title='Merit function: costo e violazione insieme',objective='Leggere una penalità esatta senza confondere diminuzione della merit function e diminuzione separata di costo e vincolo.',
 explanation='La merit function somma costo e violazione pesata. Il peso s cambia il compromesso; una diminuzione della somma può accompagnarsi a un aumento del solo costo.',
 takeaway='Diminuire M₁ non impone che costo e violazione calino entrambi.',
 obs=[('concept','Obiettivo dichiarato: scegliere γ^k per diminuire costo e violazione; propone una merit function come misura del progresso. Non enuncia una garanzia di discesa separata.','Measure progress'),
  ('equation','Per il problema con uguaglianza h(z)=0 stampa M₁=ℓ+s||g(z)||₁: g è incoerente con il vincolo dichiarato.','M1(z; s)'),
  ('definition','Definisce la norma 1 come somma dei valori assoluti e permette s∈R. La soglia di esattezza richiede s>max_i |λ_i*|.','exact merit function'),
  ('concept','La proposizione riguarda soluzioni del problema originale, non qualunque punto KKT. La minimizzazione locale di M₁ riguarda z*, poiché λ non è argomento di M₁.',None)],
 formulas=[formula('opt75-merit',MERIT,'s pesa la violazione. Il modello aggiunto ha |λ⋆|=1/2.','Usare il vincolo di uguaglianza corretto nella companion.',origin='correction'),
  formula('opt75-literal',r'M_1(z;s)=\ell(z)+s\|g(z)\|_1','Formula originale conservata: il simbolo g non è il vincolo di uguaglianza definito qui.','Tracciare il refuso senza usarlo nei calcoli.'),
  formula('opt75-norm',r'\|z\|_1=\sum_{i=1}^d|z_i|','Si sommano moduli delle componenti, senza compensazione dei segni.','Interpretare la misura della violazione.'),
  formula('opt75-exact',r's>\max_i|\lambda_i^\star|','Soglia di esattezza locale presso un minimo regolare; non rende minimo ogni punto KKT.','Distinguere la proposizione da una garanzia algoritmica.',assumptions=['Minimo locale del problema con uguaglianze e regolarità del contesto KKT; non basta il solo annullamento del residuo.'],details=['La slide non ripete le ipotesi locali di regolarità. La companion le dichiara come condizioni d’uso, senza attribuirle al testo della proposizione.','M₁ dipende da z e s, non da λ: il punto che minimizza localmente M₁ è z⋆.']),
  ex(75,'Costo e parabola sono quelli di 70–74. Per s>1/2 i due minimi della merit function coincidono con quelli vincolati.'),
  formula('opt75-minima',r'\begin{cases}z=(0,1-s),&0\le s<1/2\\z=(x,1/2),\ |x|\le1/\sqrt2,&s=1/2\\z=(\pm1/\sqrt2,1/2),&s>1/2\end{cases}',
   'Sono i minimi globali del solo esempio. Alla soglia ci sono anche minimi non ammissibili; sotto soglia il minimo della merit function viola h=0.','Verificare il ruolo della disuguaglianza stretta.',origin='enrichment',details=['Ponendo v=z₁²≥0, si minimizza v/2+(z₂−1)²/2+s|z₂−v|. Per z₂≥0 il minimo in v è 0 se s<1/2, v=z₂ se s>1/2, ogni v∈[0,z₂] se s=1/2. La successiva minimizzazione in z₂ dà i tre casi.'])],
 controls=[c(75,'s','Peso della penalità','s',0,1.5,.8,.05,'Cambia M₁ e i suoi minimi, senza cambiare ℓ o la parabola h=0.'),c(75,'x','Ascissa di prova','z_1',-1.2,1.2,1,.1,'Muove il punto di prova e aggiorna costo, violazione e merit function.'),c(75,'y','Ordinata di prova','z_2',-.2,1.5,1,.1,'Modifica il residuo h e la penalità; il punto non viene proiettato sul vincolo.')],
 choices=[('Soglia esatta','preset','s=1/2','s=.8','Porta s alla soglia e mostra l’intera famiglia di minimi, senza scegliere arbitrariamente un punto.')],
 prerequisites=[('Moltiplicatore ottimo e regolarità','La soglia usa λ⋆, non un moltiplicatore corrente qualsiasi.',[57,60]),('SQP locale','Serve una misura del progresso oltre al solo costo.',[74])],
 example=('Modello 70–74, s≥0',['I minimi vincolati sono (±1/√2,1/2), costo 3/8, |λ⋆|=1/2.','Per s=.2 il minimo di M₁ è (0,.8), h=.8 e M₁=.18.','Per s=.5, ogni (x,.5) con |x|≤1/√2 minimizza M₁: non tutti sono ammissibili.','Per s=.8 i minimi sono i due punti vincolati.'],'Il peso può rendere esatta la penalità; uguaglianza alla soglia non dà l’equivalenza completa dei minimi.'),
 visual='Livelli 2D e superficie 3D di M₁, stessa parabola e stessi punti. Barre di ℓ e s|h| al punto di prova. Minimi noti e famiglia alla soglia distinti dal punto corrente.',
 axes=('z₁','z₂','decision'),three=True,camera_elevation=50,
 scope=['CORRECTION_WARNING: g→h solo nella companion. Fonte e SOURCE_LITERAL intatti.','s≥0 è il dominio operativo dell’esempio, non una modifica del dichiarato s∈R.','La regolarità è una condizione d’uso esplicita, non un’ipotesi testuale inventata. La proposizione non promette discesa separata di ℓ e ||h||.'],
 edges=[('s=0','Nessuna penalità; minimo libero non ammissibile.'),('s=1/2','Famiglia di minimi, inclusi punti non ammissibili.'),('s>1/2','Due minimi vincolati nel modello, non uno solo.'),('h=0','M₁=ℓ al punto, senza garantire stazionarietà.')],interaction_reason='Variare s rende visibile il passaggio dalla penalità debole alla famiglia di soglia e ai minimi ammissibili.'),
76:dict(title='Armijo riduce il passo sulla merit function',objective='Seguire il backtracking con M₁ e distinguere tentativo i da iterazione k.',
 explanation='Il problema e la direzione restano fissi durante la ricerca. Si riduce γ̄ finché la merit function scende strettamente sotto la soglia lineare.',
 takeaway='Il while rifiuta anche il pareggio; i conta tentativi sullo stesso passo.',
 obs=[('algorithm','Fissa γ̄⁰>0, β∈(0,1), c∈(0,1); riduce γ̄^{i+1}=βγ̄^i finché vale il confronto ≥.','Backtracking line-search'),
  ('equation','La quantità chiamata derivata direzionale è ∇ℓ(z^k)^T d^k−s||h(z^k)||₁. È valida per direzioni che soddisfano la fattibilità linearizzata nel contesto SQP.','derivative of M1'),
  ('concept','Suggerisce di adattare s^k>||λ^k||∞; è good practice, non una prova di esattezza con il moltiplicatore ottimo sconosciuto.','Good practice')],
 formulas=[formula('opt76-accept',r'M_1(z^k+\bar\gamma^i d^k;s)<M_1(z^k;s)+c\bar\gamma^i D M_1',
   'DM₁ è la derivata direzionale; si accetta sotto la soglia.','Esprimere la condizione d’uscita del while ≥.'),
  formula('opt76-slope',r'D M_1=\nabla\ell(z^k)^\top d^k-s\|h(z^k)\|_1','Derivata unilaterale lungo dᵏ, se ∇h(zᵏ)ᵀdᵏ=−h(zᵏ). In generale non è la derivata per una direzione arbitraria.','Esplicitare l’ipotesi che rende valida la formula.',assumptions=['Direzione SQP che annulla il vincolo linearizzato; γ≥0.'],details=['Se hⱼ≠0, la derivata di |hⱼ| lungo la direzione è −|hⱼ|. Se hⱼ=0, la derivata lineare del vincolo è zero, quindi il contributo direzionale della norma è zero.']),
  formula('opt76-shrink',r'\bar\gamma^{i+1}=\beta\bar\gamma^i,\quad\gamma^k=\bar\gamma^i','i è il contatore interno, k l’iterazione esterna.','Leggere i due indici senza scambiarli.'),
  formula('opt76-weight',r's^k>\|\lambda^k\|_\infty','La fonte lo suggerisce come adattamento pratico; λᵏ non è necessariamente λ⋆.','Evitare una falsa garanzia di esattezza.'),
  ex(76,'Fissi z=(1,1), λ=.2, d=(−5/23,−10/23), γ̄⁰=1. La direzione soddisfa la fattibilità linearizzata.'),
  formula('opt76-profile',r'\ell(z+\gamma d)=\tfrac12-\tfrac5{23}\gamma+\tfrac{125}{1058}\gamma^2,\quad h(z+\gamma d)=-\tfrac{25}{529}\gamma^2',
   'Il vincolo iniziale è zero; la sua violazione lungo il passo compare al secondo ordine.','Calcolare curva e test da formule esatte del modello.',origin='enrichment'),
  formula('opt76-gap',r'\mathrm{gap}=\frac{\gamma}{1058}\big[\gamma(125+50s)-230(1-c)\big]',
   'Gap = M₁ candidato meno soglia. Si accetta solo se negativo; il pareggio non usa una tolleranza di comodo.','Conservare i casi di uguaglianza evitando cancellazioni numeriche.',origin='enrichment')],
 controls=[c(76,'s','Peso della penalità','s',.1,6,3,.05,'Cambia il profilo M₁ e il numero di rifiuti; punto e direzione restano fissi.'),c(76,'beta','Fattore di riduzione',r'\beta',.2,.8,.5,.1,'Cambia la sequenza dei candidati; non cambia curva o soglia come funzioni di γ.'),c(76,'c','Diminuzione richiesta','c',.05,.9,.1,.05,'Cambia la soglia lineare; β non cambia la sua pendenza.')],
 choices=[('Tentativo / Play / Passo / Riparti','i','Tentativi disponibili, fino a sessanta','i=0','Seleziona un candidato precalcolato, non un nuovo iterato z^k.'),('Pareggio Armijo','preset','s=.95,c=.25','s=3,c=.1','Fa coincidere esattamente il candidato γ=1 con la soglia; il while lo rifiuta.')],
 prerequisites=[('Merit function corretta','Si penalizza h, come chiarito nella 75.',[75]),('Direzione Newton/SQP','d è la direzione della 72–74.',[72,74])],
 example=('s=3, β=.5, c=.1',['γ=1: gap=68/1058>0, rifiutato.','γ=.5: gap<0, accettato.','Con s=.95,c=.25, γ=1 dà gap=0 ed è rifiutato.'],'La ricerca cambia la lunghezza del passo; non cambia il QP o il peso durante i tentativi.'),
 visual='Profilo 2D di M₁ lungo γ e soglia Armijo, candidati colorati e selezione i; nessun asse 3D artificiale. Letture del passo, gap e violazione reale.',
 axes=('γ','M₁','step_size'),three=False,
 scope=['Nessuna superficie 3D per un profilo scalare.','La formula direzionale richiede la fattibilità linearizzata; la fonte la usa nel contesto SQP.','Sessanta tentativi massimi e arresti numerici sono scelte operative, non teoremi di fallimento.'],
 edges=[('Gap=0','Rifiutato, come il while ≥ della fonte.'),('β piccolo','Candidati più distanti; il primo accettato può essere più piccolo.'),('s aumenta','Può servire un passo minore perché il resto nonlineare del vincolo costa di più.'),('Direzione non di discesa','Il solver generale si arresta esplicitamente; nessuna ricerca infinita.')],interaction_reason='Il candidato selezionato e la soglia mostrano perché ogni riduzione è accettata o rifiutata.'),
77:dict(title='SQP con passo e moltiplicatore coerenti',objective='Seguire un passo SQP globalizzato e l’aggiornamento rilassato del moltiplicatore.',
 explanation='Si risolve il QP, si sceglie γᵏ con Armijo su M₁, poi si applica lo stesso γᵏ alle decisioni e all’aggiornamento duale.',
 takeaway='γᵏ pesa anche il moltiplicatore; il test controlla M₁, non il solo costo.',
 obs=[('algorithm','Riprende il QP con vincolo linearizzato della 74, rinumerato (3), e aggiunge la scelta Armijo del passo su M₁.','Choose'),
  ('equation','Aggiorna z^{k+1}=z^k+γ^kΔz^k e λ^{k+1}=(1−γ^k)λ^k+γ^kΔλ_QP^k. Δλ_QP è il moltiplicatore completo.','Update'),
  ('concept','Non specifica inizializzazione di λ, tolleranze, scelta numerica del peso o regolarizzazione di B; questi non sono dati della fonte.',None)],
 formulas=[formula('opt77-update',r'\begin{aligned}z^{k+1}&=z^k+\gamma^k\Delta z^k\\\lambda^{k+1}&=(1-\gamma^k)\lambda^k+\gamma^k\Delta\lambda_{\mathrm{QP}}^k\end{aligned}',
   'Δλ_QPᵏ è il moltiplicatore completo, non l’incremento Newton.','Usare il medesimo γᵏ nei due aggiornamenti.'),
  formula('opt77-qp',QP,'Il QP deve avere un minimo. Resta valida la condizione di curvatura chiarita nella 73.','Conservare il modello della fonte senza regolarizzarlo di nascosto.'),
  formula('opt77-search',r'\gamma^k:\ \text{Armijo su }M_1(z^k+\gamma\Delta z^k;s)',
   'Il peso rimane fisso nei tentativi della singola ricerca; può cambiare all’iterazione successiva.','Collegare 75–76 al ciclo SQP.'),
  ex(77,'λ⁰=.2, β=.5, c=.1, γ̄⁰=1 sono fissati nell’esempio; punto iniziale e peso minimo sono modificabili.'),
  formula('opt77-penalty',r's^k=\max\{s_{\min},|\lambda^k|+0.1,|\Delta\lambda_{\mathrm{QP}}^k|+0.1\}',
   'Scelta aggiunta: include anche il moltiplicatore del QP oltre al suggerimento della 76. Non è una garanzia globale.','Dichiarare esattamente il peso usato nel codice.',origin='enrichment',details=['Se la direzione non è di discesa per M₁, il calcolo si ferma. Se il QP è illimitato o il sistema è singolare, non si fabbrica un passo.','Non confrontare valori di M₁ con pesi diversi come se fossero la stessa funzione monotona. Il grafico destro mostra il residuo KKT; la superficie usa sᵏ selezionato.']),
  formula('opt77-blend',r'\gamma^0=1/2,\quad\lambda^1=\tfrac12(0.2)+\tfrac12(10/23)\simeq0.317391',
   'Con s_min=3 e z⁰=(1,1), il primo passo è dimezzato; anche il moltiplicatore viene rilassato.','Verificare numericamente la formula di aggiornamento.',origin='enrichment')],
 controls=[c(77,'x','Ascissa iniziale','z_1^0',-1.2,1.2,1,.1,'Ricalcola l’intera sequenza con λ⁰=.2; ferma Play e torna a k=0.'),c(77,'y','Ordinata iniziale','z_2^0',.1,1.5,1,.1,'Cambia fattibilità e QP iniziali; non cambia il problema.'),c(77,'floor','Peso minimo',r's_{\min}',.1,4,3,.1,'Cambia il peso adattivo e i passi Armijo; costo e vincolo restano fissi.')],
 choices=[('Iterazione / Play / Passo / Riparti','k','Fino a dodici passi','k=0','Seleziona un iterato e il suo peso, mantenendo distinta la norma KKT dalla merit function.')],
 prerequisites=[('SQP a passo pieno','Il moltiplicatore del QP si assegna con γ=1.',[74]),('Merit e Armijo','Test e peso provengono da 75–76.',[75,76])],
 example=('z⁰=(1,1), λ⁰=.2, s_min=3',['Il QP dà Δz=(−5/23,−10/23), moltiplicatore 10/23.','Armijo rifiuta γ=1 e accetta γ=.5.','z¹=(41/46,18/23), λ¹≈.317391, h(z¹)=−25/2116.','Da (.4,1.1) la merit function può scendere mentre il costo aumenta.','Da (.1,1) con peso minimo .1, un successivo QP può diventare illimitato; il ciclo si arresta.'],'Il grafico segue il criterio reale del solver, non una promessa di convergenza a un minimo.'),
 visual='Livelli/superficie M₁ con peso sᵏ corrente, stessa parabola e iterati; a destra norma KKT contro k, non valori di merit con pesi diversi. Stato di arresto e rilassamento λ leggibili.',
 axes=('z₁','z₂','decision'),three=True,camera_elevation=50,animation=True,
 progression=dict(assessment='unique',related_page_ids=[],added=['Armijo sulla merit function e γᵏ in entrambi gli aggiornamenti.'],removed=[],changed=['Rispetto al prerequisito 74: QP rinumerato (3); λ passa da assegnazione piena a rilassamento.'],rationale='Ripresa dell’algoritmo dopo due pagine sul passo: non è un overlay progressivo adiacente. Il confronto con la 74 è registrato anche nei prerequisiti e nelle osservazioni.'),
 scope=['Nessuna modifica alla Hessiana originale dell’esempio.','La scelta sᵏ, λ⁰, cap di dodici passi e tolleranza KKT 10⁻¹⁰ sono enrichment.','Armijo non certifica un minimo: una radice KKT può essere non minimale; i fallimenti del QP restano visibili.'],
 edges=[('γ=1','Assegnazione piena del moltiplicatore QP, come nella 74.'),('γ<1','Rilassare anche λ, senza doppia somma.'),('Costo aumenta','Consentito se il test sulla stessa M₁ accetta.'),('QP senza minimo unico','Arresto esplicito.'),('Radice al massimo','Residuo nullo non certifica minimo.')],interaction_reason='Punto iniziale e peso cambiano la sequenza e mostrano il ruolo reale della merit function.'),
78:dict(title='La barriera conserva le uguaglianze',objective='Capire dominio stretto, limite ε→0 e permanenza del vincolo h=0.',
 explanation='La barriera logaritmica penalizza l’avvicinamento al bordo delle disuguaglianze dall’interno. Le uguaglianze continuano a essere imposte separatamente.',
 takeaway='Nell’esempio ε↓0 avvicina il minimo al bordo; h=0 resta imposto.',
 obs=[('definition','Problema con gⱼ≤0 e h=0; trasforma soltanto le disuguaglianze aggiungendo εΣ−log(−gⱼ).','Inequality constraints'),
  ('equation','h(z)=0 rimane scritto sotto il costo modificato, benché il testo chiami il problema unconstrained.','unconstrained problem'),
  ('diagram','Il grafico di −ε log(z) mostra dominio positivo, crescita al bordo, valori negativi per z>1 e famiglia ε→0; nessuna scala numerica affidabile deducibile.',None),
  ('algorithm','Suggerisce di ridurre ε ogni poche iterazioni; non specifica un solver interno o una frequenza numerica.','every few iterations')],
 formulas=[formula('opt78-barrier',r'\min_z\ \ell(z)-\varepsilon\sum_{j=1}^r\log(-g_j(z))\quad\text{s.t. }h(z)=0',
   'Serve gⱼ<0 ed ε>0. La barriera non impone h=0 da sola.','Dichiarare dominio e uguaglianza residua.'),
  formula('opt78-log',r'-\varepsilon\log(z),\quad z>0','Diverge a +∞ vicino a zero; può essere negativa per z>1.','Interpretare la figura originale senza inventarne coordinate.'),
  formula('opt78-example',r'\ell=\tfrac12((z_1+1)^2+(z_2-0.6)^2),\quad g=-z_1,\quad h=z_2-0.6',
   'Esempio aggiunto: semipiano e retta orizzontale. Un punto può rispettare g<0 e violare h=0.','Mostrare perché l’uguaglianza resta necessaria.',origin='enrichment'),
  formula('opt78-minimum',r'z_{1,\varepsilon}=\frac{2\varepsilon}{1+\sqrt{1+4\varepsilon}},\quad z_{2,\varepsilon}=0.6',
   'Minimo interno analitico del modello, non un solver generico. Si avvicina al minimo originale (0,.6) quando ε↓0.','Collegare il parametro alla soluzione evitando cancellazioni.',origin='enrichment',details=['Derivando lungo h=0: z₁+1−ε/z₁=0, dunque z₁²+z₁−ε=0. La formula razionalizzata resta stabile per ε piccolo positivo.','Il punto (0,.6) è ammissibile per il problema originale, ma non è nel dominio della barriera e non viene valutato sulla superficie 3D.'])],
 controls=[c(78,'epsilon','Peso della barriera',r'\varepsilon',.01,1,.4,.01,'Cambia la superficie e il minimo interno, non il bordo z₁=0 o la retta z₂=.6.'),c(78,'x','Ascissa di prova','z_1',0,2,.4,.05,'Muove il punto; a zero il costo con barriera non viene valutato.'),c(78,'y','Ordinata di prova','z_2',-.5,1.5,1.2,.1,'Cambia h senza modificare l’ammissibilità stretta della disuguaglianza.')],
 choices=[('Dimezza ε','preset','ε/2 entro il dominio [.01,1]','ε=.4','Riduce ε e ricalcola il minimo analitico; non finge di aver eseguito iterazioni di un solver interno.')],
 prerequisites=[('Dominio logaritmico','Argomento strettamente positivo.',[54]),('Uguaglianze','La trasformazione conserva h=0.',[74])],
 example=('ε=.4, h=z₂−.6',['Minimo interno z₁=2ε/(1+√(1+4ε))≈.306226, z₂=.6.','Punto di prova (.4,1.2): g=−.4<0, ma h=.6≠0.','A z₁=0 il problema originale ammette il bordo, mentre log(0) non è definito.'],'Costo trasformato e fattibilità dell’uguaglianza sono controlli distinti.'),
 visual='Livelli 2D e superficie 3D del costo con barriera soltanto per z₁>0, retta h=0, punto di prova e minimo interno. Profilo lungo h=0 confrontato al costo originale. Bordo x=0 escluso dal dominio, senza log fittizi.',
 axes=('z₁','z₂','decision'),three=True,camera_elevation=45,
 scope=['INFO_WARNING: unconstrained significa soltanto rimozione delle disuguaglianze; h=0 resta esplicito.','Modello e minimo analitico aggiunti; nessuna coordinata dedotta dal disegno qualitativo.','Il limite del minimo è dimostrato per l’esempio, non attribuito a problemi generici senza ipotesi.'],
 edges=[('z₁=0','Originale ammissibile, barriera fuori dominio.'),('z₁>1','Contributo logaritmico negativo possibile.'),('h≠0','Punto non ammissibile anche se costo trasformato finito.'),('ε piccolo positivo','Usare formula stabile; non sostituire ε con zero.')],interaction_reason='Il parametro muove il minimo interno; i due controlli del punto separano dominio e uguaglianza.'),
79:dict(title='Due indici, due significati diversi',objective='Preparare la distinzione fra variabile, iterazione e tempo.',
 explanation='Nell’ottimizzazione si aggiorna una stima. Nel controllo ottimo ogni stima contiene anche una sequenza nel tempo: leggere gli indici evita di confondere i due avanzamenti.',
 takeaway='Prima di leggere un indice, identifica cosa sta contando.',
 obs=[('structure','Solo titolo centrale Concluding Remarks on Notation; nessuna formula, figura o footer.','Concluding Remarks on Notation')],
 formulas=[],controls=[],choices=[],prerequisites=[('Iterazioni degli algoritmi','k ha contato aggiornamenti, non tempo del sistema.',[27,77])],example=None,
 visual='Tre schede statiche: decisione; iterazione dell’algoritmo; tempo del sistema. La mappa è aggiunta al titolo.',
 scope=['Divisoria: nessun modello dinamico attribuito alla fonte.'],edges=[],interaction_reason='Mappa statica sufficiente.'),
80:dict(title='z è la variabile; zᵏ è una sua stima',objective='Distinguere variabile libera e stima numerata nello stesso spazio decisionale.',
 explanation='z indica una decisione generica. L’apice k di zᵏ identifica l’iterazione dell’algoritmo, non una potenza e non un istante del sistema.',
 takeaway='Cambiare k seleziona una stima; cambiare z esplora il costo.',
 obs=[('definition','z∈R^d è la variabile generica del problema min ℓ(z), con costo ℓ:R^d→R.','generic optimization variable'),('definition','z^k∈R^d è la stima della soluzione all’iterazione k∈N di un algoritmo.','solution estimate')],
 formulas=[formula('opt80-notation',r'z\in\mathbb R^d,\qquad z^k\in\mathbb R^d',
   'Stesso spazio decisionale; k numera la stima, senza elevare z a potenza.','Leggere il significato dell’apice.'),
  formula('opt80-problem',r'\min_{z\in\mathbb R^d}\ell(z),\qquad\ell:\mathbb R^d\to\mathbb R','La variabile e il costo sono generici; la slide non assegna un algoritmo.','Conservare il livello di generalità della fonte.'),
  formula('opt80-example',r'\ell(z)=\tfrac12(z-1)^2,\quad z^{k+1}=z^k-\tfrac12(z^k-1),\quad z^0=-2',
   'Esempio scalare aggiunto: gradient method a passo 1/2. Si distinguono il punto di prova z e il campione zᵏ.','Dare un algoritmo concreto senza attribuirlo alla fonte.',origin='enrichment'),
  formula('opt80-sequence',r'z^k=1-3\,2^{-k}',
   'Formula esatta della sequenza aggiunta. k indica la posizione nella sequenza; 2⁻ᵏ è invece una vera potenza.','Verificare i valori di ogni stima.',origin='enrichment')],
 controls=[c(80,'k','Iterazione selezionata','k',0,6,2,1,'Seleziona un campione della sequenza aggiunta; non cambia il punto di prova libero.'),c(80,'z','Decisione di prova','z',-2,2,.5,.1,'Sposta solo il punto di prova sul costo; non ricalcola l’algoritmo.')],choices=[],
 prerequisites=[('Variabile di decisione','Il suo ruolo è distinto dall’indice.',[5]),('Iterazione','Le stime sono prodotte da un algoritmo.',[27])],
 example=('d=1, costo quadratico, z⁰=−2',['z¹=−.5, z²=.25, z³=.625.','Con k=2 e z=.5, il punto di prova e la stima sono diversi.','L’algoritmo e i dati sono enrichment; la definizione della fonte vale per d generico.'],'Nessun tempo fisico compare nel grafico.'),
 visual='A sinistra costo scalare rispetto alla decisione z, con punto di prova e stima zᵏ distinti. A destra sequenza delle stime contro k. Solo 2D, senza terza coordinata artificiale.',
 axes=('z','ℓ(z)','decision'),three=False,
 scope=['Il titolo Warning on notation non è una source_issue: nessun warning editoriale inutile.','80 e 81 hanno lo stesso titolo ma contenuti e footer distinti, non overlay duplicati.','k è intero; d=1 è solo l’esempio.'],edges=[('k=0','Stima iniziale, non potenza zero.'),('z=zᵏ','I due punti coincidono, ma i ruoli restano distinti.')],interaction_reason='Due selettori indipendenti rendono concreta la differenza fra variabile e stima.'),
81:dict(title='k aggiorna la traiettoria; t sceglie il tempo',objective='Leggere (x,u), (xᵏ,uᵏ) e (xᵏ_t,uᵏ_t) come livelli diversi della stessa decisione.',
 explanation='Una stima dell’algoritmo contiene un’intera sequenza di stati e ingressi. k seleziona la stima completa; t seleziona una componente temporale al suo interno.',
 takeaway='xₜᵏ: apice k per l’algoritmo, pedice t per il sistema.',
 obs=[('definition','Definisce x_t:=x(t),u_t:=u(t) per un sistema a tempo discreto con t∈N.','discrete-time system'),('equation','La dinamica è x_{t+1}=f_t(x_t,u_t).','xt+1'),('definition','La decisione del controllo ottimo è (x,u); (x^k,u^k) è la stima all’iterazione k e (x_t^k,u_t^k) la sua componente al tempo t.','vector component')],
 formulas=[formula('opt81-index',r'\begin{gathered}x_{t+1}=f_t(x_t,u_t)\\(x,u),\quad(x^k,u^k),\quad(x_t^k,u_t^k)\end{gathered}',
   'k cambia la stima completa; t ne sceglie una componente temporale.','Distinguere i due indici senza aggiungere dimensioni fisiche.'),
  formula('opt81-time',r'x_t:=x(t),\quad u_t:=u(t),\quad t\in\mathbb N','Il pedice è una notazione compatta per il tempo discreto.','Collegare la scrittura di controllo a quella usata nel corso.'),
  formula('opt81-example',r'x_0=2,\quad x_{t+1}=x_t+u_t,\quad T=3,\quad J=\tfrac12\sum_{t=0}^{2}u_t^2+\tfrac12x_3^2',
   'Problema aggiunto. Eliminata la dinamica, si applica il gradiente agli ingressi con passo .2 e u⁰=0.','Generare stime reali di un algoritmo, tutte coerenti con la dinamica.',origin='enrichment'),
  formula('opt81-iterates',r'u_t^k=-\tfrac12(1-0.2^k),\quad x_t^k=2+t\,u_0^k',
   'Formula esatta dell’esempio: ingressi t=0,1,2 e stati t=0,1,2,3. Non esiste u₃ in questo orizzonte.','Verificare ogni cella della matrice e il bordo temporale.',origin='enrichment',details=['J(u)=||u||²/2+(2+Σu)²/2, quindi ∇J=u+(2+Σu)1. Per ingressi uguali q, il passo .2 dà q_new=.2q−.4 e q_k=−(1−.2^k)/2.','Hessiana I+11ᵀ con autovalori 1,1,4: il passo .2 è stabile per questo esempio. Il minimo ha u_t=−.5, x_3=.5.','Le stime mostrate sono già ammissibili perché la dinamica è stata eliminata: non è una proprietà generale di tutte le stime di algoritmi di controllo ottimo.'])],
 controls=[c(81,'k','Iterazione selezionata','k',0,5,2,1,'Cambia tutta la riga di stati e ingressi e la traiettoria selezionata; t resta fisso.'),c(81,'t','Tempo selezionato','t',0,3,1,1,'Seleziona una componente della stessa stima; non esegue un aggiornamento dell’algoritmo.')],choices=[],
 prerequisites=[('Stima zᵏ','Ora la decisione contiene sequenze complete.',[80]),('Dinamica discreta','Stato e ingresso hanno indici temporali.',[])],
 example=('Integratore scalare, T=3, u⁰=(0,0,0)',['A k=0: x=(2,2,2,2), u=(0,0,0).','A k=1: u=(−.4,−.4,−.4), x=(2,1.6,1.2,.8).','A k=2: u=(−.48,−.48,−.48), x=(2,1.52,1.04,.56).','Con k=2,t=1 si leggono x₁²=1.52 e u₁²=−.48.','Con t=3 si legge x₃²=.56, ma nessun ingresso u₃.'],'k e t si muovono indipendentemente e ogni riga rispetta la dinamica.'),
 visual='Matrice 2D: colonne t, righe k, celle x_t^k. Evidenza di riga e componente selezionate; accanto traiettoria nel tempo della stima k. Nessun 3D necessario.',
 axes=('t','k','decision'),three=False,
 scope=['Il modello, il costo, l’orizzonte, il passo e la sequenza sono enrichment; la fonte definisce solo la notazione.','Le unità di tempo sono passi discreti, non secondi.','Stato iniziale e terminale presenti; ingresso terminale assente.','Stesso titolo della 80 ma nuove definizioni, non duplicato. Pagina finale: nessuna pagina successiva inventata.'],
 edges=[('k=0','Stima iniziale, con t ancora selezionabile.'),('t=0','Stato iniziale identico in tutte le stime.'),('t=T','Stato terminale definito, ingresso assente.'),('Cambio k','Non avanza il tempo del sistema.')],interaction_reason='Selezionare riga e colonna rende verificabile la distinzione fra aggiornamento e componente temporale.')
}
SYMBOLS={
 'opt75-merit':[(r'M_1','Misura combinata di costo e violazione.'),('s','Peso della penalità.'),('h','Vincolo di uguaglianza, nullo sui punti ammissibili.')],
 'opt76-accept':[(r'\bar\gamma^i','Candidato al tentativo interno i.'),('c','Frazione della diminuzione lineare richiesta.'),(r'DM_1','Derivata unilaterale di M₁ nella direzione dᵏ, a s fissato.')],
 'opt77-update':[(r'\Delta z^k','Passo primale restituito dal QP.'),(r'\Delta\lambda_{\mathrm{QP}}^k','Moltiplicatore completo del QP, non incremento.'),(r'\gamma^k','Lunghezza accettata da Armijo.')],
 'opt78-barrier':[(r'\varepsilon','Peso positivo della barriera.'),(r'g_j','Disuguaglianza; il log richiede gⱼ<0.'),('h','Uguaglianza che resta imposta.')],
 'opt80-notation':[('z','Decisione generica.'),(r'z^k','Stima all’iterazione k; non una potenza.'),('d','Dimensione della decisione.')],
 'opt81-index':[('k','Indice dell’algoritmo.'),('t','Indice temporale del sistema.'),(r'f_t','Mappa dinamica al tempo t.'),(r'(x^k,u^k)','Stima completa delle sequenze di stati e ingressi.')]
}
for meta in P.values():
 for f in meta['formulas']:
  if f['formulaId'] in SYMBOLS:f['symbolDefinitions']=[dict(symbol=s,meaning=m) for s,m in SYMBOLS[f['formulaId']]]
for n in (80,81):P[n]['controls'][0]['unit']='iter.'
P[81]['controls'][1]['unit']='passi'
def warning(n,text):
 if n==75:return ('CORRECTION_WARNING',r'M_1(z;s)=\ell(z)+s\|g(z)\|_1',MERIT,
  '⚠ Warning: possibile errore nella slide originale. Qui penalizziamo h(z), il vincolo di uguaglianza.',
  'La slide introduce esclusivamente h(z)=0, ma la definizione usa g. La pagina successiva usa correttamente ||h||₁ nella derivata; 74 e 77 hanno il QP con h. Usare M₁=ℓ+s||h||₁ in esempi, grafici, line search e SQP. Il testo originale e SOURCE_LITERAL sono conservati. La soglia della proposizione è interpretata presso un minimo regolare, senza trasformare una radice KKT in un minimo né promettere discesa separata di costo e violazione.')
 if n==78:return ('INFO_WARNING','The resulting unconstrained problem reads as','Problema con sole uguaglianze: h(z)=0 resta imposto.',
  '⚠ Nota: la barriera assorbe solo le disuguaglianze. h(z)=0 resta imposto.',
  'La parola unconstrained è imprecisa in presenza di h(z)=0, che resta correttamente stampato nella formulazione. Nessuna correzione aritmetica: si chiarisce l’ambito della trasformazione, usando sempre gⱼ<0 per il dominio del log e mantenendo h separato. Il modello aggiunto dimostra che un punto può avere costo trasformato finito e violare l’uguaglianza.')
 return None
def visual(n,vis,m):
 if n in (75,77):
  vis['visualizationSemantics']['zAxis'].update(symbol='M₁(z;s)',label='M₁(z;s)',role='merit_function')
  vis['visualizationSemantics']['zAxis']['domain']='Scala fissa [0,6].' if n==75 else 'Scala fissa [0,13]; porzioni esterne dichiarate e omesse dai buffer.'
  vis['visualizationSemantics'].update(zMeaning='Merit function con peso corrente, non costo originale né moltiplicatore.',mathematicalDefinition=MERIT)
  vis['threeDRequirements']['surface']['formula']=MERIT
  vis['threeDRequirements']['surface']['discontinuities']='M₁ è continua; |h| crea uno spigolo in h=0. La derivata direzionale è unilaterale, non si assume liscia la norma.'
  vis['twoDRequirements'].update(plotType='merit_contours_and_components' if n==75 else 'merit_contours_and_kkt_residual',relationshipTo3D='Stesso peso, stessi punti e stessa M₁. Barre e residuo KKT sono un pannello separato.')
  if n==75:vis['threeDRequirements']['trajectory'].update(enabled=False,kind='none')
 if n==78:
  vis['visualizationSemantics']['zAxis'].update(symbol='Fε',label='Fε(z)',role='barrier_cost',domain='Scala fissa [0,6]; porzioni esterne dichiarate, nessun valore al bordo z₁=0.')
  vis['threeDRequirements']['surface'].update(formula=r'\ell(z)-\varepsilon\log z_1',discontinuities='Mai valutare z₁≤0, né collegare il bordo escluso.')
  vis['threeDRequirements']['trajectory'].update(enabled=False,kind='none')
 if n in (75,78):vis['threeDRequirements']['animation']['enabled']=False
 if n==76:vis['visualizationSemantics']['yAxis']['role']='merit_function'
 if n==80:vis['visualizationSemantics']['yAxis']['role']='cost'
 if n==81:
  vis['visualizationSemantics']['xAxis']['role']='time_index'
  vis['visualizationSemantics']['yAxis']['role']='algorithm_iteration'
  vis['twoDRequirements'].update(plotType='iteration_time_state_matrix_and_trajectory',axes=['t [passi]','k [iter.]'])
  vis['visualizationSemantics']['explanation']='La matrice ha righe k e colonne t; colore/cella = x_t^k. Il profilo è stato rispetto al tempo nella stima selezionata.'
if __name__=='__main__':
 H.persist_batch(P,75,81,'K',{74:'SQP a passo pieno: QP e moltiplicatore completo; la 77 aggiunge la ricerca del passo.'},
  'meritNotes.ts','meritFormulaNotes',warning_resolver=warning,configure_visualization=visual,analysis_date='2026-10-19')
