"""Source inspection and authored design for physical pages 55–62 only.

All eight renders, extracted texts and layouts inspected, with 54/63 as context.
59–62 are overlays of printed slide 55, not four copies to discard.
"""
import importlib.util
from pathlib import Path
loader=importlib.util.spec_from_file_location('optimization_authoring',Path(__file__).with_name('optimization-authoring.py'))
H=importlib.util.module_from_spec(loader);loader.loader.exec_module(H)
formula,control=H.formula,H.control
PROBLEM=r"\begin{aligned}\min_{z\in\mathbb R^d}\;&\ell(z)\\\text{subj.to }&g_j(z)\le0,\ j\in\{1,\ldots,r\}\\&h_i(z)=0,\ i\in\{1,\ldots,m\}\end{aligned}"
LAGR=r"L(z,\mu,\lambda)=\ell(z)+\sum_{j=1}^r\mu_j g_j(z)+\sum_{i=1}^m\lambda_i h_i(z)"
KKT=r"\begin{aligned}\nabla_1L(z^\star,\mu^\star,\lambda^\star)&=0\\\mu_j^\star&\ge0\\\mu_j^\star g_j(z^\star)&=0,\quad j\in\{1,\ldots,r\}\end{aligned}"
SEGMENT=r"g_1(z)=-z_1,\quad g_2(z)=z_1-1,\quad h_1(z)=z_2"
FAMILY=r"\ell_\kappa(z)=\frac\kappa2 z_1^2+\frac14 z_1^4+\frac12 z_2^2"
def example_formula(n,expr,explanation):
 return formula(f'opt{n}-example',expr,explanation,'Specificare il modello aggiunto e i suoi limiti.',origin='enrichment')
def progressive(n,added,removed=()):
 related={59:[60],60:[59,61],61:[60,62],62:[61]}[n]
 return dict(assessment='progressive',related_page_ids=[f'{H.DOC}:p{p:04}' for p in related],added=[added],removed=list(removed),changed=[],rationale='Confronto individuale dei quattro rendering con stessa etichetta 55|73: contenuto comune conservato, aggiunte e rimozioni identificate. Ogni pagina fisica ha un focus proprio.')
P={
55:dict(title='Vincoli, geometria e condizioni di ottimalità',objective='Orientarsi nel passaggio dagli algoritmi su insiemi alle condizioni per uguaglianze e disuguaglianze.',
 explanation='Descrivere i vincoli come funzioni permette di collegare la geometria dell’insieme ai gradienti. Da qui si costruiscono le condizioni KKT.',
 takeaway='Prima l’ammissibilità, poi la regolarità, infine il bilancio dei gradienti.',
 obs=[('structure','Divisoria con il solo titolo centrato su uguaglianze, disuguaglianze e condizioni di ottimalità. Nessun footer, formula o figura.',None)],
 formulas=[],controls=[],choices=[],prerequisites=[('Proiezione e barriere','Finora i vincoli influenzavano gli aggiornamenti; ora si caratterizzano le soluzioni.',[48,54])],example=None,
 visual='Tre schede di orientamento statiche: insieme ammissibile; vincoli attivi e regolarità; Lagrangiana e condizioni KKT. Tutto il raccordo è enrichment.',
 scope=['La fonte contiene soltanto il titolo della sezione. Nessun enunciato KKT né esempio numerico è presente.'],edges=[],interaction_reason='Nessuna interazione necessaria per una mappa di orientamento.'),
56:dict(title='Un punto deve rispettare tutti i vincoli',objective='Separare costo, disuguaglianze componente per componente e uguaglianze, visualizzandone l’intersezione.',
 explanation='Le disuguaglianze ammettono regioni, le uguaglianze soltanto i loro zeri. Si cerca il costo minore nell’intersezione di tutte queste condizioni.',
 takeaway='Un costo basso fuori dall’insieme ammissibile non è una soluzione.',
 obs=[('equation','Unico contenuto tecnico: min su z∈R^d di ℓ(z), g_j(z)≤0 per j=1,…,r, h_i(z)=0 per i=1,…,m. Nessun dato, ipotesi di convessità o disegno.',None)],
 formulas=[formula('opt56-problem',PROBLEM,'Tutti i gⱼ≤0 e tutti gli hᵢ=0. Il costo confronta soltanto i punti ammissibili.','Distinguere criterio e ammissibilità.'),
  example_formula(56,r'\ell(z)=\tfrac12((z_1-a)^2+(z_2-b)^2),\quad '+SEGMENT,'Vincoli: 0≤z₁≤1, z₂=0. Il bersaglio del costo è (a,b).'),
  formula('opt56-solution',r'z^\star=(\min(1,\max(0,a)),0)','Il minimo esatto dell’esempio è la proiezione del bersaglio sul segmento; b modifica il costo minimo, non la sua ascissa.','Confrontare ammissibilità e soluzione nota.',origin='enrichment')],
 controls=[control('opt56-a','Bersaglio orizzontale','a',-.5,1.5,-.5,.1,'Sposta i livelli e il minimo vincolato, saturandone l’ascissa fra 0 e 1.'),
  control('opt56-b','Bersaglio verticale','b',-1,1,.6,.1,'Sposta il minimo libero e i livelli; il minimo vincolato resta sulla stessa ascissa.'),
  control('opt56-x','Ascissa della sonda','z_1',-.4,1.4,.5,.1,'Muove la sonda e i residui delle due disuguaglianze; non sposta l’insieme.'),
  control('opt56-y','Ordinata della sonda','z_2',-1,1,0,.1,'Esplora anche punti fuori dall’uguaglianza; il segmento ammissibile resta fisso.')],choices=[],
 prerequisites=[('Insiemi definiti da vincoli','Intersecare sottolivelli e zeri.',[12,13]),('Proiezione','Leggere il minimo di un costo di distanza.',[49])],
 example=('a=−0.5, b=0.6, sonda (0.5,0)',['g₁=−0.5, g₂=−0.5, h₁=0: sonda ammissibile.','Minimo libero (−0.5,0.6), escluso.','Minimo vincolato (0,0), costo 0.305.'],'La soluzione soddisfa insieme costo e vincoli.'),
 visual='Stessi livelli 2D e superficie 3D di ℓ; linea verde soltanto sul segmento ammissibile, minimo vincolato e sonda. Residui separati, nessuna area riempita come se l’uguaglianza fosse una regione.',
 axes=('z₁','z₂','decision'),three=True,camera_elevation=55,
 scope=['Fonte senza convessità dichiarata; la convessità e l’unicità valgono per il solo esempio esplicito.','La sonda non è presentata come ottimo.'],
 edges=[('Sonda fuori segmento','Costo valutabile ma punto inammissibile.'),('a=0 o 1','Minimo al bordo anche quando il gradiente orizzontale è nullo.'),('b cambia','Il minimo vincolato non si muove verticalmente.')],
 interaction_reason='Spostare bersaglio e sonda separa effetto sul costo ed effetto sull’ammissibilità.'),
57:dict(title='Attivo non significa indipendente',objective='Distinguere vincolo attivo, punto ammissibile e indipendenza lineare dei gradienti pertinenti.',
 explanation='Un vincolo di disuguaglianza è attivo quando vale zero. La regolarità richiede gradienti indipendenti delle uguaglianze e delle sole disuguaglianze attive.',
 takeaway='La stessa geometria ammissibile può avere rappresentazioni regolari o degeneri.',
 obs=[('definition','A(z) contiene esattamente gli indici j dei g_j(z)=0; la definizione non include tutti i vincoli soddisfatti.','Set of active inequality constraints'),
  ('definition','Regolare significa che ∇h_i(z), per ogni uguaglianza, e ∇g_j(z), solo j∈A(z), sono linearmente indipendenti.','Regular point')],
 formulas=[formula('opt57-active',r'A(z)=\{j\in\{1,\ldots,r\}\mid g_j(z)=0\}','Attivi: gⱼ=0. Per la regolarità si aggiungono tutti i gradienti delle uguaglianze, anche se nulli.','Selezionare i vettori pertinenti.',details=['Per applicare KKT si considera un punto ammissibile. Un punto con g>0 non diventa ammissibile perché quel vincolo non compare in A(z).']),
  formula('opt57-regular',r'\nabla h_i(z),\ i\in\{1,\ldots,m\},\quad\nabla g_j(z),\ j\in A(z)\quad\text{linearly independent}','I vettori sono colonne in Rᵈ, secondo la convenzione del corso. Il loro numero non può superare d.','Leggere la condizione di regolarità senza trasporre la convenzione del corso.'),
  example_formula(57,SEGMENT,'Sul segmento, il modello standard ha una normale verticale e, soltanto agli estremi, una normale orizzontale.'),
  formula('opt57-variants',r'g_3=-2z_1\quad\text{o}\quad h_1=z_2^3\quad\text{o}\quad g_1=-z_1^3','Duplicare la normale o annullarne il gradiente può distruggere la regolarità pur lasciando identico il segmento.','Mostrare che la regolarità dipende dalla rappresentazione.',origin='enrichment')],
 controls=[control('opt57-x','Punto sul segmento','z_1',0,1,0,.1,'Muove il punto ammissibile; cambia A(z), l’elenco dei gradienti e il loro rango, mantenendo il segmento.')],
 choices=[('Rappresentazione','s','Standard / disuguaglianza ridondante / uguaglianza cubica / disuguaglianza cubica','Standard','Cambia le funzioni dei vincoli e i gradienti, conservando esattamente lo stesso insieme ammissibile.')],
 prerequisites=[('Gradiente vettoriale','Colonne dei gradienti in Rᵈ.',[7]),('Uguaglianze equivalenti','La stessa retta può essere lo zero di y oppure y³.',[13]),('Problema vincolato','La regolarità non sostituisce l’ammissibilità.',[56])],
 example=('z=(0,0) sul segmento',['Standard: ∇h₁=(0,1), ∇g₁=(−1,0), indipendenti.','Aggiungendo g₃=−2z₁: tre vettori in R², rango due.','h₁=z₂³ ha gradiente nullo su tutta la retta; g₁=−z₁³ ha gradiente nullo al bordo sinistro.'],'Geometria uguale, regolarità diversa.'),
 visual='Diagramma 2D del segmento e delle normali effettive con frecce di lunghezza reale; elenco dei gradienti inclusi e rango/numero. Vettori nulli segnalati testualmente, senza frecce inventate.',
 axes=('z₁','z₂','decision'),scope=['Il rango numerico è esatto per i vettori assiali del modello; nessuna tolleranza sul residuo cubico crea falsi vincoli attivi.','Nessuna necessità di un asse 3D per l’indipendenza di vettori nel piano.'],
 edges=[('Punto interno','Le disuguaglianze non attive non entrano nel test.'),('Tre gradienti in R²','Non possono essere indipendenti.'),('Gradiente nullo','Rende dipendente una famiglia non vuota.'),('Bordo con moltiplicatore nullo','Attività non implica un moltiplicatore strettamente positivo; sviluppato nella 60.')],
 interaction_reason='Cambiare punto e rappresentazione distingue attività, rango e geometria senza alterare l’insieme.'),
58:dict(title='Lagrangiana: vincoli pesati nel costo',objective='Interpretare μ e λ senza confondere L con una penalità da minimizzare congiuntamente.',
 explanation='Ogni residuo entra con il proprio moltiplicatore. A moltiplicatori fissati si ottiene una funzione di z; questo non equivale a risolvere il problema vincolato.',
 takeaway='Costruire L serve alle condizioni di ottimalità; minimizzarla liberamente in tutte le variabili può essere illimitato.',
 obs=[('concept','La Lagrangiana è introdotta per enunciare condizioni necessarie del primo ordine per uguaglianze e disuguaglianze.','first-order necessary conditions'),
  ('equation','L(z,μ,λ)=ℓ(z)+∑μ_jg_j(z)+∑λ_ih_i(z), con z∈R^d, μ∈R^r e λ∈R^m. Qui non è ancora imposto μ≥0.','Lagrangian function'),
  ('concept','I moltiplicatori sono descritti come prezzi della violazione dei vincoli.','prices'),
  ('concept','La seconda remark dice senza precisare le variabili che non si può minimizzare la Lagrangiana. È necessaria un’interpretazione contestuale; non vieta inf_z L a μ,λ fissati.','cannot minimize the Lagrangian')],
 formulas=[formula('opt58-lagrangian',LAGR,'μ e λ sono “prezzi” dei residui: μ∈Rʳ e λ∈Rᵐ. Il requisito μ≥0 delle KKT arriva dopo.','Collegare ogni moltiplicatore al suo vincolo.',[(r'\nabla_1L','Gradiente rispetto alla prima variabile z, tenendo μ e λ fissati.')],details=['L non è una penalità non negativa: μg può essere negativo in punti ammissibili.','Minimizzare congiuntamente in z,μ,λ non recupera in generale il problema originale. Con g≠0 o h≠0, un moltiplicatore libero può far tendere L a −∞.','È invece lecito definire e studiare inf_z L(z,μ,λ) per moltiplicatori fissati; nessun algoritmo duale viene implementato qui.']),
  example_formula(58,r'\ell=\tfrac12((z_1+0.5)^2+(z_2-0.6)^2),\quad g_1=-z_1,\ h_1=z_2','Il problema originale ammette la semiretta z₁≥0, z₂=0 e ha minimo (0,0). Il grafico mostra L con moltiplicatori fissati.'),
  formula('opt58-free-minimum',r'\arg\min_z L(z,\mu,\lambda)=(-0.5+\mu,\ 0.6-\lambda)','La Hessiana rispetto a z è I. Questo minimo di L a prezzi fissati è spesso inammissibile per il problema originale.','Separare il minimo del modello dalla soluzione vincolata.',origin='enrichment')],
 controls=[control('opt58-mu','Moltiplicatore disuguaglianza',r'\mu',-1,2,.5,.1,'Inclina L rispetto a z₁ e muove il suo minimo libero; il costo originale e il vincolo restano fissi. Qui μ è reale, come nella definizione.'),
  control('opt58-lambda','Moltiplicatore uguaglianza',r'\lambda',-1,2,.6,.1,'Inclina L rispetto a z₂; nessun vincolo di segno su λ.'),
  control('opt58-x','Ascissa della sonda','z_1',-.5,1.5,.5,.1,'Cambia costo, termine μg e valore L alla sonda.'),
  control('opt58-y','Ordinata della sonda','z_2',-1,1,0,.1,'Cambia residuo h, termine λh e valore L alla sonda.')],choices=[],
 prerequisites=[('Residui dei vincoli','Il segno g≤0 e l’uguaglianza h=0 hanno ruoli distinti.',[56])],
 example=('μ=0.5, λ=0.6 e sonda (0.5,0)',['ℓ=0.68, μg=−0.25, λh=0, L=0.43.','Minimo di L a prezzi fissati (0,0), uguale al minimo vincolato per questa coppia.','Con μ=0 il minimo libero di L ha z₁=−0.5 e viola g≤0.'],'L non è una somma di penalità positive; la coincidenza dei minimi dipende dai moltiplicatori.'),
 visual='Livelli e superficie dello stesso L(z,μ,λ), semiretta ammissibile del problema originale, minimo a prezzi fissati e sonda. Asse verticale e colori indicano L, non ℓ.',
 axes=('z₁','z₂','decision'),three=True,camera_elevation=55,
 scope=['La remark assoluta sulla minimizzazione riceve INFO_WARNING: precisare la minimizzazione congiunta, senza sostituire formule corrette.','La semiretta non ha il vincolo superiore delle 56–57; è un esempio distinto dichiarato.','Il grafico non prova un teorema sui prezzi ombra.'],
 edges=[('μ negativo','Consentito nella definizione di L; non soddisfa la condizione duale KKT.'),('Minimo libero inammissibile','Non presentarlo come soluzione vincolata.'),('μg negativo','Preservare il segno senza tagliarlo a zero.'),('Minimo fuori ritaglio','Dichiararlo e conservarne i valori nei readout.')],
 interaction_reason='I moltiplicatori inclinano la funzione; la sonda separa costo e contributi senza cambiare i vincoli.'),
59:dict(title='KKT: prima controllare le ipotesi',objective='Riconoscere che il teorema parte da un minimo locale ammissibile e regolare, con tutte le funzioni C¹.',
 explanation='La prima progressiva enuncia soltanto le ipotesi. La regolarità riguarda la rappresentazione dei vincoli: cambiarla può rendere inapplicabile il teorema anche allo stesso minimo.',
 takeaway='Un minimo locale non regolare può non ammettere moltiplicatori KKT.',
 obs=[('assumption','La slide assume che z⋆ sia un minimo locale regolare del problema vincolato.','regular local minimum'),
  ('equation','Ripete il problema con r disuguaglianze e m uguaglianze.',None),
  ('assumption','ℓ, g_j, h_i sono C¹. Questa pagina non contiene ancora la conclusione sui moltiplicatori.','C1')],
 formulas=[formula('opt59-problem',PROBLEM,'Il teorema parte da un minimo locale regolare, con ℓ, gⱼ e hᵢ di classe C¹. Qui la conclusione non è ancora comparsa.','Tenere distinte ipotesi e conclusione della progressiva.'),
  example_formula(59,r'\ell(z)=z_1,\quad h_1(z)=z_2,\quad g_1(z)=-z_1\ \text{o}\ -z_1^3','Entrambe le rappresentazioni danno z₁≥0, z₂=0 e lo stesso minimo globale z⋆=(0,0). Tutte le funzioni sono C∞.'),
  formula('opt59-balance',r'(1,0)+\mu\nabla g_1(0)+\lambda(0,1)=0','Con g₁=−z₁ si ottiene μ=1, λ=0. Con g₁=−z₁³, ∇g₁(0)=0: nessuna coppia soddisfa il bilancio. È un controesempio aggiunto.','Mostrare perché non si può eliminare la regolarità.',origin='enrichment')],
 controls=[],choices=[('Rappresentazione','s','Vincolo lineare / stesso vincolo cubico','Vincolo lineare','Conserva costo, insieme e minimo; cambia il gradiente del vincolo attivo e l’applicabilità del teorema.')],
 prerequisites=[('Regolarità','Il gradiente nullo di un vincolo attivo rende il punto non regolare.',[57]),('Lagrangiana','Il bilancio riguarda la derivata in z.',[58])],
 example=('Minimo (0,0) sulla semiretta',['Con −z₁≤0: normali (−1,0) e (0,1), rango due.','Con −z₁³≤0: la prima normale è nulla, rango uno.','La componente orizzontale di ∇ℓ resta 1 e non si cancella con il gradiente nullo.'],'Fallire la regolarità non significa fallire il minimo; qui fallisce l’esistenza dei moltiplicatori.'),
 visual='Geometria 2D della semiretta, minimo e gradienti reali; schede ammissibilità, C¹, minimo e regolarità. Nessuna conclusione attribuita alla sola prima progressiva.',
 axes=('z₁','z₂','decision'),progressive=True,progression=progressive(59,'Ipotesi: minimo locale regolare, ℓ,g_j,h_i∈C¹; la conclusione compare solo nella 60.'),
 scope=['Il controesempio e il bilancio espanso sono enrichment, non testo della 59.','Non mostrare il minimo noto come un candidato generico non verificato.'],
 edges=[('Vincolo cubico','Insieme e minimo invariati, ma nessun moltiplicatore KKT nel modello scelto.'),('C∞ ma non regolare','La regolarità del punto non coincide con la sola differenziabilità delle funzioni.')],
 interaction_reason='Due rappresentazioni dello stesso problema isolano il ruolo dell’ipotesi di regolarità.'),
60:dict(title='KKT: bilanciare costo e vincoli',objective='Leggere stazionarietà, non negatività e complementarità, ricordando l’ammissibilità del minimo e l’unicità sotto regolarità.',
 explanation='Nel minimo regolare i gradienti si bilanciano con moltiplicatori unici. Quelli delle disuguaglianze sono non negativi e devono annullarsi sui vincoli inattivi.',
 takeaway='Vincolo attivo: μ può essere zero. Vincolo inattivo: μ deve essere zero.',
 obs=[('assumption','Mantiene minimo locale regolare, problema vincolato e funzioni C¹ della 59.','regular local minimum'),
  ('concept','Aggiunge esistenza e unicità dei moltiplicatori di Lagrange μ⋆ e λ⋆.','Lagrange multipliers'),
  ('equation','Le tre righe nuove sono ∇₁L(z⋆,μ⋆,λ⋆)=0, μ⋆_j≥0, μ⋆_jg_j(z⋆)=0 per j=1,…,r. La fattibilità è già nell’ipotesi di minimo vincolato.',None)],
 formulas=[formula('opt60-kkt',KKT,'Per un minimo locale regolare di funzioni C¹ esistono moltiplicatori unici. ∇₁ deriva in z; λ non ha vincoli di segno.','Collegare le tre condizioni al problema ammissibile.',details=['Primal feasibility: g_j(z⋆)≤0, h_i(z⋆)=0 è nell’ipotesi, non una condizione da omettere.','La regolarità assicura l’unicità dei moltiplicatori; non l’unicità del minimo.','Senza convessità queste condizioni sono necessarie, non sufficienti.']),
  formula('opt60-problem',PROBLEM,'Le condizioni si applicano al problema della 59, non a una minimizzazione libera di L.','Conservare il contesto del teorema.'),
  example_formula(60,r'\ell=\tfrac12((z_1-a)^2+(z_2-0.6)^2),\quad '+SEGMENT,'Il minimo esatto z⋆=(clip(a,0,1),0) resta ammissibile. I controlli dei moltiplicatori possono invece violare le KKT.'),
  formula('opt60-multipliers',r'\mu_1^\star=\max(0,-a),\quad\mu_2^\star=\max(0,a-1),\quad\lambda_1^\star=0.6','Questa è l’unica terna KKT dell’esempio. La si può confrontare con i valori provati nei controlli.','Dare un riferimento analitico al bilancio.',origin='enrichment')],
 controls=[control('opt60-a','Bersaglio orizzontale','a',-.5,1.5,-.5,.1,'Muove il minimo vincolato e il gradiente del costo. I moltiplicatori provati restano invariati finché non si usa il pulsante analitico.'),
  control('opt60-mu1','Moltiplicatore sinistro',r'\mu_1',0,1,.5,.1,'Modifica il contributo di ∇g₁, il residuo di stazionarietà e il prodotto μ₁g₁.'),
  control('opt60-mu2','Moltiplicatore destro',r'\mu_2',0,1,0,.1,'Modifica il contributo di ∇g₂ e permette di violare la complementarità su un vincolo inattivo.'),
  control('opt60-lambda','Moltiplicatore uguaglianza',r'\lambda_1',-1,1,.6,.1,'Modifica il bilancio verticale, senza vincoli di segno.')],
 choices=[('Usa moltiplicatori KKT','μ⋆,λ⋆','Terna analitica per il bersaglio corrente','μ₁=.5, μ₂=0, λ₁=.6','Aggiorna soltanto i tre moltiplicatori alla soluzione esatta; il bersaglio resta fisso.')],
 prerequisites=[('Ipotesi del teorema','Minimo locale, C¹ e regolarità.',[59]),('Lagrangiana','∇₁ significa gradiente in z.',[58]),('Attività','Non negatività distinta da complementarità.',[57])],
 example=('a=−0.5: z⋆=(0,0)',['∇ℓ=(0.5,−0.6).','μ₁=.5, μ₂=0, λ₁=.6 bilanciano il gradiente.','Per a=0 il vincolo sinistro resta attivo ma μ₁⋆=0.','Per 0<a<1 entrambi i g sono inattivi e μ₁⋆=μ₂⋆=0.'],'Il moltiplicatore positivo non è obbligatorio su ogni vincolo attivo.'),
 visual='Livelli 2D e superficie 3D del costo; segmento e minimo comune. Solo in 2D frecce reali ∇ℓ, μ₁∇g₁, μ₂∇g₂, λ₁∇h₁. Residui separati di stazionarietà, complementarità e fattibilità.',
 axes=('z₁','z₂','decision'),three=True,camera_elevation=55,progressive=True,progression=progressive(60,'Conclusione: esistenza/unicità, stazionarietà in z, μ≥0 e prodotti nulli.'),
 scope=['Bilancio espanso nella 63 consultato solo per verificare ∇₁ e segni; non implementare I.','Il candidato z⋆ è risolto analiticamente; moltiplicatori di prova non vengono etichettati come μ⋆.'],
 edges=[('a=0 o 1','Vincolo attivo con μ⋆=0.'),('μ positivo su inattivo','Viola complementarità anche se è non negativo.'),('λ negativo','È lecito, ma non necessariamente stazionario.'),('Gradiente o contributo nullo','Non disegnare una freccia normalizzata inventata.')],
 interaction_reason='Spostare il bersaglio e provare i moltiplicatori rende visibile il bilancio; il pulsante analitico separa prova numerica e soluzione esatta.'),
61:dict(title='Il primo ordine non vede tutta la curvatura',objective='Interpretare il nuovo richiamo al secondo ordine senza attribuire alla fonte un teorema che qui non viene enunciato.',
 explanation='La progressiva aggiunge solo un richiamo: con derivate seconde si può studiare il secondo ordine. L’esempio esplora la curvatura lungo una direzione ammissibile.',
 takeaway='Stesse KKT al punto, curvatura diversa: un test nullo può restare inconclusivo.',
 obs=[('assumption','Ripete integralmente ipotesi e conclusione KKT della 60, compresa unicità dei moltiplicatori.','Lagrange multipliers'),
  ('equation','Le condizioni stampate rimangono ∇₁L=0, μ⋆≥0, μ⋆_jg_j=0.',None),
  ('concept','Aggiunge esclusivamente la remark: se ℓ,h_i,g_j sono due volte differenziabili, condizioni del secondo ordine. Non ne fornisce formula né teorema.','second order conditions')],
 formulas=[formula('opt61-kkt',KKT,'Con funzioni due volte differenziabili, la slide richiama il secondo ordine; non ne enuncia qui le condizioni.','Mantenere visibile il risultato comune della progressiva.',assumptions=['Le KKT richiedono le ipotesi precedenti: minimo locale regolare e funzioni C¹.']),
  formula('opt61-problem',PROBLEM,'Il problema vincolato e le sue ipotesi restano quelli delle due progressive precedenti.','Conservare il contesto completo.'),
  example_formula(61,FAMILY+r',\quad g_1=z_1-1,\ h_1=z_2','Con z₁≤1, z₂=0, l’origine è regolare e KKT per ogni κ (μ=λ=0).'),
  formula('opt61-curvature',r'd=(1,0),\quad d^\top\nabla_{11}^2L(0,0,0)d=\kappa','d è tangente alla retta ammissibile e g resta inattivo vicino a 0. κ negativo dà discesa locale; κ positivo dà minimo locale.','Illustrare la curvatura ammissibile in un caso semplice, senza anticipare le condizioni generali del batch I.',origin='enrichment',details=['Nel modello h è affine e i moltiplicatori sono zero: la Hessiana di L coincide con quella di ℓ.','Per κ=0 la derivata seconda lungo d è nulla ma il termine z₁⁴/4 dà comunque un minimo stretto sulla retta. La sola curvatura nulla è inconclusiva.','Non si sostituisce il cono critico generale con tutto lo spazio, né si enuncia una condizione generale di sufficienza dalla sola remark.'])],
 controls=[control('opt61-kappa','Curvatura tangente',r'\kappa',-2,2,-1,.25,'Modifica la curvatura lungo la retta, il costo e il tipo del punto; regolarità e KKT a zero restano valide.'),
  control('opt61-t','Spostamento ammissibile','t',-1,1,.5,.1,'Muove (t,0) e misura la variazione esatta del costo; la curvatura locale resta κ.')],choices=[],
 prerequisites=[('KKT necessarie','Non costituiscono una certificazione di minimo.',[60]),('Secondo ordine non vincolato','Curvatura nulla può essere inconclusiva.',[8,9]),('Regolarità','Il vincolo attivo di uguaglianza ha gradiente non nullo.',[57])],
 example=('κ=−1 e t=0.5',['La stazionarietà in 0 e tutti i prodotti KKT sono zero.','Curvatura tangente −1.','ℓ(0.5,0)−ℓ(0,0)=−0.109375: 0 non è un minimo.','κ=0 lascia curvatura zero ma costo t⁴/4>0 per t≠0.'],'Le derivate seconde aggiungono informazione; il caso nullo richiede altro.'),
 visual='Stesso costo in livelli 2D e superficie 3D, retta ammissibile troncata a z₁≤1, punto KKT e sonda (t,0). La sonda percorre punti realmente ammissibili, senza un algoritmo fittizio.',
 axes=('z₁','z₂','decision'),three=True,camera_elevation=55,progressive=True,progression=progressive(61,'Remark sul secondo ordine sotto due volte differenziabilità; nessuna formula generale aggiunta dalla fonte.'),
 scope=['La famiglia, la direzione e la curvatura ridotta sono enrichment. La fonte qui non dà le condizioni del secondo ordine.','Una variazione positiva a un t lontano non smentisce la curvatura negativa locale.'],
 edges=[('κ=0','Test quadratico nullo, ma il termine quartico dà minimo stretto.'),('t=0','Variazione zero per ogni κ; non certifica il minimo.'),('κ<0 e t grande','La variazione può anche essere positiva: la classificazione è locale.')],
 interaction_reason='κ cambia il tipo del punto senza cambiare le KKT; t separa curvatura locale e variazione finita.'),
62:dict(title='Un punto KKT può non essere un minimo',objective='Dare significato alla denominazione punto KKT e distinguerla dall’ottimalità.',
 explanation='La slide chiama punti KKT quelli che soddisfano le condizioni necessarie. Come per gli stazionari non vincolati, il nome non certifica che il costo sia minimo.',
 takeaway='Punto KKT significa condizioni soddisfatte; per concludere minimo serve altro.',
 obs=[('assumption','Ripete ipotesi, problema, C¹ ed esistenza/unicità dei moltiplicatori della 60.','Lagrange multipliers'),
  ('equation','Mantiene tutte le tre condizioni KKT stampate.',None),
  ('definition','La remark sul secondo ordine della 61 scompare. La nuova Notation definisce KKT points come punti che soddisfano le condizioni necessarie, controparte dei punti stazionari nei problemi vincolati.','KKT points')],
 formulas=[formula('opt62-kkt',KKT,'Un punto ammissibile che soddisfa queste condizioni con opportuni moltiplicatori è un punto KKT. Questo da solo non implica minimo.','Distinguere appartenenza all’insieme KKT e classificazione del costo.'),
  formula('opt62-problem',PROBLEM,'Anche un punto KKT deve soddisfare i vincoli originali; le sole tre righe isolate non bastano.','Esplicitare l’ammissibilità già presente nel contesto.'),
  example_formula(62,FAMILY+r',\quad g_1=z_1-1,\ h_1=z_2','Vincoli: z₁≤1, z₂=0. All’origine: μ=λ=0 e regolarità in tutti i casi.'),
  formula('opt62-types',r'\ell_\kappa(t,0)=\tfrac\kappa2 t^2+\tfrac14t^4,\qquad\ell_{\rm piatta}(t,0)=0','κ=1 dà minimo stretto, κ=−1 massimo locale sulla retta, κ=0 minimo stretto piatto; l’ultimo caso ha tutti i punti ammissibili minimi.','Confrontare classificazioni mantenendo fisse KKT e vincoli.',origin='enrichment')],
 controls=[control('opt62-t','Sonda ammissibile','t',-1,1,.5,.1,'Muove la sonda (t,0) e aggiorna il confronto di costo. KKT e punto selezionato restano quelli dell’origine.')],
 choices=[('Tipo di costo','s','Minimo stretto / massimo locale / minimo piatto / minimi multipli','Massimo locale','Sostituisce soltanto il costo, mantenendo insieme, punto KKT, μ=λ=0 e regolarità.')],
 prerequisites=[('KKT','Condizioni necessarie e fattibilità.',[60]),('Curvatura','Può distinguere punti con stesse KKT.',[61]),('Punti stazionari','Analogia tra necessario e sufficiente.',[8])],
 example=('κ=−1, z=0 e μ=λ=0',['g₁(0)=−1, h₁(0)=0: ammissibile, disuguaglianza inattiva.','∇ℓ(0)=0, quindi stazionarietà e complementarità soddisfatte.','Per t=0.5, il costo è −0.109375<0.','Il punto è KKT ma è un massimo locale lungo la retta, non un minimo.'],'Un controesempio concreto al salto logico KKT⇒minimo.'),
 visual='Quattro costi sugli stessi assi, vincolo di uguaglianza come linea verde e medesima sonda 2D/3D. Il punto viola o soddisfa l’ottimalità ma conserva sempre tutti i residui KKT nulli.',
 axes=('z₁','z₂','decision'),three=True,camera_elevation=55,progressive=True,progression=progressive(62,'Definizione dei punti KKT come controparte degli stazionari vincolati.',['Remark sul secondo ordine presente nella 61; non più visibile nella 62.']),
 scope=['Le classificazioni e i costi specifici sono enrichment, non esempi della slide.','Massimo locale rispetto alla retta ammissibile; nello spazio libero il caso κ=−1 è una sella.','La regolarità è sufficiente per l’implicazione dal minimo alle KKT, non parte necessaria della definizione generale di punto KKT.'],
 edges=[('Minimi multipli','Tutti i punti ammissibili minimizzano il costo; non inventare unicità.'),('Minimo piatto','La Hessiana tangente nulla non esclude il minimo.'),('Sonda all’origine','Confronto nullo non prova ottimalità.')],
 interaction_reason='Cambiare costo mantenendo invariati vincoli, KKT e punto mostra esattamente che cosa le condizioni non garantiscono.')
}
def warning(n,text):
 if n==58:
  return ('INFO_WARNING','We are relaxing the constrained problem, but we cannot minimize the Lagrangian.',
   'Non minimizzare congiuntamente in z, μ, λ; inf_z L a μ,λ fissati è un’operazione lecita e distinta.',
   'Nota: L non si minimizza liberamente in tutte le variabili. Qui μ e λ sono fissati.',
   'La frase stampata non precisa rispetto a quali variabili. Interpretata letteralmente come divieto di minimizzare in z sarebbe falsa: nel modello mostrato la Hessiana in z è I e il minimo esiste per ogni μ,λ fissati. La minimizzazione libera congiunta, invece, non impone i vincoli e può essere illimitata inferiormente: per z=(1,0), g=−1 e μ→+∞ si ha L→−∞ anche imponendo μ≥0. λ libero dà analoga illimitatezza quando h≠0. Non si corregge alcuna formula originale; INFO_WARNING risolve l’ambiguità della remark e rende esplicite le variabili fissate. Non viene introdotto un algoritmo duale né un problema di sella generale.')
 return None
def visual(n,vis,m):
 if m.get('three'):
  vis['threeDRequirements']['trajectory'].update(enabled=False,kind='none')
  vis['threeDRequirements']['animation'].update(enabled=False)
  vis['twoDRequirements'].update(plotType='cost_contours_and_feasible_profile',relationshipTo3D='Stessa funzione, stessi vincoli e punti. In 2D: livelli e profilo sulla linea ammissibile, con scale fisse. L’uguaglianza non viene riempita come area.')
  vis['visualizationSemantics']['explanation']='Il terzo asse è il valore della funzione, non una terza variabile o il tempo.'
 if n==58:
  vis['visualizationSemantics']['zAxis'].update(label='L(z,μ,λ)',symbol='L',role='cost')
  vis['twoDRequirements']['relationshipTo3D']='Stessa L a μ,λ fissati, stessa sonda e stesso minimo libero; vincoli originali disegnati separatamente.'
 if n in (57,59):vis['twoDRequirements']['plotType']='constraint_gradient_geometry'
if __name__=='__main__':
 H.persist_batch(P,55,62,'H',{54:'Barriere per disuguaglianze e loro dominio implicito; chiusura G.',63:'Espansione di ∇₁L rispetto a z e denominazione complementary slackness; solo verifica di notazione, batch I non implementato.'},
  'kktNotes.ts','kktFormulaNotes',warning_resolver=warning,configure_visualization=visual,analysis_date='2026-10-19')
