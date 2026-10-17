> Aggiornamento F04.1: il supporto nativo 2D/3D e le decisioni attuali sono nella sezione finale F04.1 e nel report collegato. Le sezioni F04 qui sotto sono conservate come baseline storica.

# F04 — Introduction Companion Design

Progetto delle 36 companion, una per pagina fisica del PDF. Sono specifiche di contenuto, layout e comportamento: nessuna pagina o interazione è implementata.
Questa F04 è la fase richiesta dopo la SOURCE WARNING POLICY; la numerazione storica di IMPLEMENTATION_PLAN.md appartiene al precedente piano della pipeline.

Fonti primarie: [review F03](INTRODUCTION_SOURCE_WARNING_REVIEW.md), [report PAGE ANALYSIS](../Data/reports/page_analysis_introduction.json) e tutti i 36 PAGE_SPEC indicizzati nel manifest.
Il contratto completo e verificabile è [introduction_companion_manifest.json](../Data/introduction_companion_manifest.json). L'audit ripetibile è [introduction_companion_design_audit.json](../Data/reports/introduction_companion_design_audit.json).

## 1. DESIGN PRINCIPLES

- Una pagina fisica → una companion; PDF.js futuro mostra il PDF originale a sinistra.
- Ogni pagina ha un obiettivo osservabile, un focus visivo e un esempio quando utile.
- Fonte, correzione F03 ed enrichment hanno provenienza distinta; lo studente vede brevi etichette, non motivazioni editoriali.
- Interazione solo per un effetto matematico o dinamico esplicito; confronto statico quando sufficiente.
- Valutazione di candidata, riferimento e ottimo analitico dell'esempio hanno sempre etichette distinte.
- Nessun algoritmo generale, modello 3D o risultato ottimo inventato.
- Le pagine simili mantengono la propria identità; il riuso avviene nelle rappresentazioni e nei componenti.

Le spiegazioni intuitive, le deduzioni e tutti i valori assegnati sono enrichment. Le affermazioni della fonte hanno riferimenti puntuali alle osservazioni del PAGE_SPEC. Le formule del corso conservano simboli, indici, fattori e separatori di riga TeX, senza riscrivere la trascrizione.

**Sequenza motivation — pagine [1, 2, 3, 4, 5, 6, 7].** Mappa iniziale, anello di feedback e matrice costo/vincoli nei cinque domini. Nessun parametro condiviso.

**Sequenza dynamics — pagine [8, 9, 10, 11, 12, 13].** Stesso vocabolario stato/ingresso/uscita; timeline discreta e nominale. Profili espliciti della famiglia scalare: continuo p8, affine p9/p11, integratore p10, nonlineare p12. Non trasferire coefficienti tra profili.

**Sequenza optimization — pagine [14, 15, 16, 17, 18].** z, ℓ, Z; parabola p15 ripresa con vincolo p18; estensione vettoriale p16 e insieme p17. Profili didattici fissi; z̄=2 condiviso p15/p18, ma z̄=(0,0) locale p16. I parametri locali restano salvati per pagina.

**Sequenza discrete_ocp — pagine [19, 20, 21, 22, 23, 24, 25].** Timeline integratore, residui, costi e limiti; stesso esempio T=1 fra p22 e p25. p22 valuta u=.5 fissato, p25 ricalcola u*. Reset esplicito passando di profilo; il target d di p23 e a di p25 sono nomi locali.

**Sequenza drone — pagine [26, 27, 28, 29, 30].** Stesso ordine (p_x,v_x,p_y,v_y,θ,ω), schema planare, poi campioni, requisiti, costo e banda ammissibile. M=1,J=.02,L=.4,g=9.81 condivisi e non modificabili in questa fase. p26 istantanea, p27 moto verticale, p29 snapshot normalizzato, p30 verifica puntuale: nessun trasferimento automatico dei numeri.

**Sequenza continuous — pagine [31, 32].** Coppie di funzioni e funzionale; esempio integratore continuo. p31 ingresso costante e T variabile, p32 confronto statico a due tratti su T=2.

**Sequenza pendulum — pagine [33, 34, 35, 36].** Stesso modello, due equilibri, riferimento a gradino e costo della candidata. Unica lunghezza l≡ℓ=1, unica massa m≡M=1,g=9.81; p34/p35 salvano localmente angoli, p36 usa fixture esplicita 0→π/6,T=2. Nessun trasferimento invisibile che invalidi la candidata costante.

## 2. PAGE-BY-PAGE DESIGN

Le pagine indicate sono fisiche (1–36); la label PDF corrispondente è 0–35. Tutte hanno companionPageCount=1. Ogni scheda contiene le 20 proprietà richieste; dettagli di provenienza e domini strutturati restano nel manifest.

### Pagina 01 — Introduction to Optimal Control

**source_page:** 1; label PDF 0; mapping 1:1.

**learning_objective:** Orientarsi nel documento e riconoscerne autore, ambito e uso.

**prerequisite:** Nessuno: copertina.

**key_ideas:** Corso Optimal Control and Reinforcement Learning.; Introduzione al controllo ottimo; autore Giuseppe Notarstefano.

**intuitive_explanation — enrichment:** Il percorso va dai sistemi dinamici alla scelta di una traiettoria mediante costo e vincoli.

**mathematical_explanation:** Copertina: nessuna equazione. La mappa del percorso è un orientamento aggiunto, non un programma dichiarato dalla slide.

**formulas_to_show** (source = contenuto della fonte; correction/policy = F03; enrichment = aggiunta):

Nessuna formula della fonte; eventuali espressioni dell'esempio sono enrichment.

**worked_example — Esempio aggiunto:**
Una copertina non contiene un concetto tecnico per il quale un esempio migliori la comprensione.

**visualization:** Mappa statica in quattro tappe: motivazione → modelli → costo/vincoli → drone e pendolo. Crediti e uso interno in una riga leggibile.

**interaction:** Statica. Nessun contenuto dinamico; i comandi di navigazione appartengono al lettore e non a un'interazione didattica.

**controls / expected_parameter_effects:**

Nessun controllo; nessun parametro dello studente da propagare.

**edge_cases:**

- Confusione fra numero fisico e label 0: La copertina è pagina fisica 1; non eliminarla dalla copertura.

**takeaway:** Studieremo come scegliere il comportamento di un sistema rispettandone la dinamica.

**source_warning:** NO_WARNING.
Nessun avviso allo studente.

**reusable_components:** ModelDiagram

**relation_to_previous_page:** Nessuna: prima pagina.

**relation_to_next_page:** Prepara Che cosa rende un controllo ottimo?. La pagina 2 passa dalla copertina al confronto fra feedback control e optimal control.

**estimated_density:** LOW. Un focus, fino a tre idee, un esempio principale; formula e grafico condividono simboli e legenda.

**Layout:** EXPLANATION; HEADER → EXPLANATION → MAIN_VISUAL → TAKEAWAY.

**Moduli matematici condivisi:** Nessuno necessario.

**Fonte e limiti:** Nessuna definizione, equazione, obiettivo numerico o simulazione è contenuta nella copertina.; Il titolo del corso non implica che questa pagina esponga algoritmi di Reinforcement Learning.

**PAGE_SPEC:** [0001](../Data/documents/OPTCON-RL_introduction_optimal_control_2026_09_14--ae169f3492dc/pages/0001/page_spec.json).

### Pagina 02 — Che cosa rende un controllo ottimo?

**source_page:** 2; label PDF 1; mapping 1:1.

**learning_objective:** Distinguere dinamica, prestazione e ammissibilità.

**prerequisite:** Feedback, tracking, equilibrio

**key_ideas:** Il feedback usa stato/uscita per scegliere l'ingresso.; Il costo esprime una preferenza.; I vincoli delimitano le decisioni ammesse.

**intuitive_explanation — enrichment:** Raggiungere un obiettivo non basta: bisogna dire che cosa significa raggiungerlo bene e quali limiti rispettare.

**mathematical_explanation:** Il piccolo problema scalare illustra la scelta migliore fra decisioni ammissibili; non è ancora un OCP dinamico.

**formulas_to_show** (source = contenuto della fonte; correction/policy = F03; enrichment = aggiunta):

Nessuna formula della fonte; eventuali espressioni dell'esempio sono enrichment.

**worked_example — Esempio aggiunto:**
Enrichment scalare: desiderare u=1, confrontando J(u)=(u−1)^2 con il limite |u|≤0.6; i simboli e i valori sono introdotti solo per l'esempio.

- Senza vincolo il minimo è u=1 e J=0.
- Con |u|≤0.6 il punto ammissibile più vicino a 1 è u=0.6.
- J(0.6)=0.16.

Limiti: Non è una formula né un esempio della fonte.; Nessuna conclusione sulla stabilità del sistema.

**visualization:** Anello reference–controller–system–output con disturbo e feedback, poi due riquadri costo/vincoli; esempio risolto in tre righe.

**interaction:** Statica. Un diagramma annotato e il piccolo esempio statico chiariscono il messaggio; una simulazione richiederebbe un modello assente.

**controls / expected_parameter_effects:**

Nessun controllo; nessun parametro dello studente da propagare.

**edge_cases:**

- Nessuna decisione soddisfa i vincoli: Segnalare infeasibilità; non presentare come ammissibile la decisione meno costosa.
- Più decisioni con lo stesso indice: L'indice da solo può non selezionare una soluzione unica.

**takeaway:** Il controllo ottimo combina un modello con un criterio di scelta e vincoli.

**source_warning:** NO_WARNING.
Nessun avviso allo studente.

**reusable_components:** ModelDiagram, EquationCard, ComparisonTable

**relation_to_previous_page:** Riprende Introduction to Optimal Control. La pagina 1 fornisce solo identità e crediti, non una definizione del controllo ottimo.

**relation_to_next_page:** Prepara Velivoli: prestazioni entro i limiti. La pagina 3 concretizza indice e vincoli negli aircraft systems, senza ancora equazioni di dinamica.

**estimated_density:** MEDIUM. Un focus, fino a tre idee, un esempio principale; formula e grafico condividono simboli e legenda.

**Layout:** EXPLANATION; HEADER → EXPLANATION → MAIN_VISUAL → WORKED_EXAMPLE → TAKEAWAY.

**Moduli matematici condivisi:** Nessuno necessario.

**Fonte e limiti:** La fonte non afferma che ogni tradizionale controllore sia incapace di trattare performance o vincoli: descrive il paradigma didattico discusso finora.; Non sono forniti funzionale di costo, algoritmo ottimizzatore, garanzie di stabilità o legge di feedback.

**PAGE_SPEC:** [0002](../Data/documents/OPTCON-RL_introduction_optimal_control_2026_09_14--ae169f3492dc/pages/0002/page_spec.json).

### Pagina 03 — Velivoli: prestazioni entro i limiti

**source_page:** 3; label PDF 2; mapping 1:1.

**learning_objective:** Classificare gli ingredienti del problema aeronautico senza inventare un modello.

**prerequisite:** Distinzione fra indice e vincolo

**key_ideas:** Tracking, tempo, consumo e comfort sono criteri.; Ostacoli, assetto e stallo sono limiti.; Thrust e flaps sono ingressi citati.

**intuitive_explanation — enrichment:** Una manovra più rapida può essere esclusa prima del confronto dei costi, se viola un limite imposto.

**mathematical_explanation:** Nessuna formula aerodinamica o somma pesata è assegnata; la tabella distingue criteri e famiglie di vincoli.

**formulas_to_show** (source = contenuto della fonte; correction/policy = F03; enrichment = aggiunta):

Nessuna formula della fonte; eventuali espressioni dell'esempio sono enrichment.

**worked_example — Esempio aggiunto:**
Enrichment: confrontare due manovre candidate, A più rapida ma oltre un limite di stallo e B più lenta ma rispettosa dei limiti.

- Verificare prima i limiti per entrambe le manovre.
- Escludere A se viola un vincolo imposto.
- Confrontare tempo, energia e comfort fra le sole candidate ammissibili.

Limiti: Nessun calcolo aerodinamico o dato sperimentale è fornito dalla fonte.

**visualization:** Matrice comune alle pagine 3–7: obiettivo / geometria / ingresso / limiti interni; confronto A rapida inammissibile, B più lenta ammissibile.

**interaction:** Statica. Senza una dinamica o dati di traiettoria, slider di assetto o thrust suggerirebbero una simulazione fisica non sostenuta dalla pagina.

**controls / expected_parameter_effects:**

Nessun controllo; nessun parametro dello studente da propagare.

**edge_cases:**

- Obiettivi incompatibili: Esplicitare che scegliere pesi o priorità sarebbe un enrichment, non una scelta della fonte.
- Traiettoria al limite di stallo: Non attribuire alla slide una soglia numerica o una legge di stallo non specificata.

**takeaway:** Si confrontano le prestazioni fra alternative ammissibili.

**source_warning:** NO_WARNING.
Nessun avviso allo studente.

**reusable_components:** ComparisonTable

**relation_to_previous_page:** Riprende Che cosa rende un controllo ottimo?. La pagina 2 spiega perché considerare simultaneamente indice di prestazione e vincoli.

**relation_to_next_page:** Prepara Robot: il percorso non basta. La pagina 4 mantiene la struttura obiettivi/vincoli, ma passa alla robotica: è un diverso dominio, non un overlay.

**estimated_density:** MEDIUM. Un focus, fino a tre idee, un esempio principale; formula e grafico condividono simboli e legenda.

**Layout:** COMPARISON; HEADER → EXPLANATION → MAIN_VISUAL → WORKED_EXAMPLE → TAKEAWAY.

**Moduli matematici condivisi:** Nessuno necessario.

**Fonte e limiti:** Non sono assegnati coefficienti, equazioni aerodinamiche o una formula per il comfort.; Le voci elencate non sono dichiarate contemporaneamente sommate in un particolare costo pesato.

**PAGE_SPEC:** [0003](../Data/documents/OPTCON-RL_introduction_optimal_control_2026_09_14--ae169f3492dc/pages/0003/page_spec.json).

### Pagina 04 — Robot: il percorso non basta

**source_page:** 4; label PDF 3; mapping 1:1.

**learning_objective:** Riconoscere il ruolo di geometria, attuatori e variabili interne.

**prerequisite:** Obiettivo e vincolo; End-effector e workspace

**key_ideas:** Tracking dell'end-effector e tempo sono criteri.; Workspace, ostacoli e payload impongono geometria.; Motori e giunti hanno limiti distinti.

**intuitive_explanation — enrichment:** Un punto può attraversare un passaggio mentre il carico trasportato urta un ostacolo: la geometria da considerare dipende dal sistema.

**mathematical_explanation:** La figura aggiunta è schematica e non deriva una cinematica o un piano di movimento.

**formulas_to_show** (source = contenuto della fonte; correction/policy = F03; enrichment = aggiunta):

Nessuna formula della fonte; eventuali espressioni dell'esempio sono enrichment.

**worked_example — Esempio aggiunto:**
Enrichment: un manipolatore deve trasferire un oggetto fra due posizioni; il percorso dell'end-effector evita un ostacolo, ma l'ingombro dell'oggetto può ancora urtarlo.

- Confrontare il percorso del punto end-effector con l'ingombro trasportato.
- Considerare la collisione del payload come vincolo geometrico.
- Scartare una traiettoria rapida se richiede saturazioni o giunti fuori limite.

Limiti: Esempio concettuale aggiunto; nessuna cinematica o dimensione è indicata dalla fonte.

**visualization:** Stessa matrice della pagina 3; piccolo schema statico punto/carico/passaggio con una collisione del solo ingombro.

**interaction:** Statica. La pagina motiva il problema; un simulatore robotico richiederebbe cinematica e geometria che la fonte qui non assegna.

**controls / expected_parameter_effects:**

Nessun controllo; nessun parametro dello studente da propagare.

**edge_cases:**

- Payload di dimensione non trascurabile: Controllare l'ingombro, non soltanto il percorso di un punto.
- Target fuori workspace: Segnalare target non ammissibile, senza promettere che un diverso ottimizzatore possa raggiungerlo.

**takeaway:** Una traiettoria dell'end-effector va valutata insieme al sistema che la realizza.

**source_warning:** NO_WARNING.
Nessun avviso allo studente.

**reusable_components:** ComparisonTable, ModelDiagram

**relation_to_previous_page:** Riprende Velivoli: prestazioni entro i limiti. La pagina 3 descrive velivoli: il parallelismo è concettuale, non uguaglianza delle dinamiche.

**relation_to_next_page:** Prepara Guida autonoma: criteri che competono. La pagina 5 applica lo stesso schema alla guida autonoma, aggiungendo comfort e consumo.

**estimated_density:** MEDIUM. Un focus, fino a tre idee, un esempio principale; formula e grafico condividono simboli e legenda.

**Layout:** COMPARISON; HEADER → EXPLANATION → MAIN_VISUAL → WORKED_EXAMPLE → TAKEAWAY.

**Moduli matematici condivisi:** Nessuno necessario.

**Fonte e limiti:** La fonte non specifica cinematica, Jacobiano, numero di giunti, algoritmo collision avoidance o traiettoria ottima calcolata.; Non viene identificato un modello quantitativo comune ai tre robot raffigurati.

**PAGE_SPEC:** [0004](../Data/documents/OPTCON-RL_introduction_optimal_control_2026_09_14--ae169f3492dc/pages/0004/page_spec.json).

### Pagina 05 — Guida autonoma: criteri che competono

**source_page:** 5; label PDF 4; mapping 1:1.

**learning_objective:** Separare preferenze di guida e limiti fisici.

**prerequisite:** Indice di prestazione contro vincolo

**key_ideas:** Corsia/velocità, tempo, comfort e consumo sono criteri.; Corsia e ostacoli limitano la geometria.; Throttle, steering e pneumatici pongono altri limiti.

**intuitive_explanation — enrichment:** Preferire un giro più rapido richiede decidere come confrontare tempo e comfort, dopo aver rispettato i limiti.

**mathematical_explanation:** I 20 s e 23 s dell'esempio sono ipotesi aggiunte; i colori della fonte indicano accelerazione/frenata senza fornire una scala numerica da ricostruire.

**formulas_to_show** (source = contenuto della fonte; correction/policy = F03; enrichment = aggiunta):

Nessuna formula della fonte; eventuali espressioni dell'esempio sono enrichment.

**worked_example — Esempio aggiunto:**
Enrichment: due profili di guida rispettano corsia e attuatori; A percorre una tratta in 20 s con frenate brusche, B in 23 s con variazioni più dolci.

- Per il solo tempo, A è preferibile.
- Per includere il comfort serve specificare un indice aggiuntivo.
- La fonte non assegna pesi né una formula per scegliere fra A e B.

Limiti: Tempi e profili sono ipotetici; nessuna simulazione di veicolo è eseguita.

**visualization:** Matrice comune e due righe A/B con tempo e comfort qualitativo; legenda statica che spiega come leggere la figura originale senza ricavarne dati.

**interaction:** Statica. Per questa pagina basta una lettura statica del grafico; slider di aderenza o sterzo richiederebbero un modello non presente.

**controls / expected_parameter_effects:**

Nessun controllo; nessun parametro dello studente da propagare.

**edge_cases:**

- Obiettivo racing confuso con guida passeggeri: Mostrare che minimum time è esplicitamente associato ai race vehicles, senza estenderlo a ogni caso.
- Percorso entro corsia ma oltre limiti degli pneumatici: Non confondere ammissibilità geometrica con ammissibilità dinamica.

**takeaway:** La scelta del criterio cambia che cosa significa guidare meglio.

**source_warning:** NO_WARNING.
Nessun avviso allo studente.

**reusable_components:** ComparisonTable

**relation_to_previous_page:** Riprende Robot: il percorso non basta. La pagina 4 parla di robot: condivide la struttura ma non i vincoli specifici.

**relation_to_next_page:** Prepara Droni: percorso, energia e ostacoli. La pagina 6 passa ai droni e aggiunge exploration cost; nessun modello automobilistico prosegue nelle equazioni successive.

**estimated_density:** MEDIUM. Un focus, fino a tre idee, un esempio principale; formula e grafico condividono simboli e legenda.

**Layout:** COMPARISON; HEADER → EXPLANATION → MAIN_VISUAL → WORKED_EXAMPLE → TAKEAWAY.

**Moduli matematici condivisi:** Nessuno necessario.

**Fonte e limiti:** Non sono fornite equazioni di pneumatici, velocità target, valori di aderenza o prova di ottimalità della traiettoria disegnata.; I grafici illustrano traiettorie: non inferire dai colori valori di accelerazione o dati sperimentali non leggibili.

**PAGE_SPEC:** [0005](../Data/documents/OPTCON-RL_introduction_optimal_control_2026_09_14--ae169f3492dc/pages/0005/page_spec.json).

### Pagina 06 — Droni: percorso, energia e ostacoli

**source_page:** 6; label PDF 5; mapping 1:1.

**learning_objective:** Leggere gli ingredienti di un task aereo prima del suo modello.

**prerequisite:** Obiettivi e vincoli; Posizione 3D e ostacoli

**key_ideas:** La motivazione considera percorsi 3D.; Consumo ed exploration cost sono solo elencati.; Edifici, assetto e thrust introducono limiti.

**intuitive_explanation — enrichment:** Il segmento più corto può attraversare un edificio; un percorso più lungo può essere l'unico ammissibile.

**mathematical_explanation:** Nessuna funzione di exploration cost o dinamica è definita qui. Il caso planare delle pagine 26–30 sarà una specializzazione.

**formulas_to_show** (source = contenuto della fonte; correction/policy = F03; enrichment = aggiunta):

Nessuna formula della fonte; eventuali espressioni dell'esempio sono enrichment.

**worked_example — Esempio aggiunto:**
Enrichment: fra due punti, un segmento diretto attraversa un edificio mentre una deviazione lo aggira.

- Classificare l'edificio come vincolo geometrico.
- Escludere il segmento che lo attraversa.
- Confrontare eventuali percorsi rimanenti con l'indice scelto; la lunghezza non coincide automaticamente con consumo o exploration cost.

Limiti: Nessun algoritmo di routing o modello energetico è specificato dalla fonte.

**visualization:** Matrice comune; schema statico di percorso diretto interrotto dall'edificio e deviazione ipotetica, senza suggerire un path planner eseguito.

**interaction:** Statica. Rimandare la simulazione alle pagine con dinamica e parametri assegnati; qui l'interazione sarebbe decorativa.

**controls / expected_parameter_effects:**

Nessun controllo; nessun parametro dello studente da propagare.

**edge_cases:**

- Edificio invalicabile fra partenza e arrivo: Indicare che può non esistere un percorso ammissibile nell'ambiente considerato.
- Confusione fra costo energetico e exploration cost: Mantenerli distinti, perché la fonte li elenca separatamente senza formule.

**takeaway:** Il task precede la scelta del modello e del criterio quantitativo.

**source_warning:** NO_WARNING.
Nessun avviso allo studente.

**reusable_components:** ComparisonTable, ModelDiagram

**relation_to_previous_page:** Riprende Guida autonoma: criteri che competono. La pagina 5 parla di guida autonoma su piano e usa vincoli legati a pneumatici e corsia; qui compaiono percorso 3D ed exploration cost.

**relation_to_next_page:** Prepara Sistemi spaziali: orbita e orientamento. La pagina 7 passa a Space systems e sostituisce gli esempi con orbita e orientamento rispetto a Sole/Terra. La somiglianza del layout non la rende una progressiva.

**estimated_density:** MEDIUM. Un focus, fino a tre idee, un esempio principale; formula e grafico condividono simboli e legenda.

**Layout:** COMPARISON; HEADER → EXPLANATION → MAIN_VISUAL → WORKED_EXAMPLE → TAKEAWAY.

**Moduli matematici condivisi:** Nessuno necessario.

**Fonte e limiti:** Exploration cost è soltanto elencato: nessuna formula o politica esplorativa è definita.; Non sono ancora presenti modello quadrotor, massa, gravità, limiti di thrust numerici o algoritmo di pianificazione.

**PAGE_SPEC:** [0006](../Data/documents/OPTCON-RL_introduction_optimal_control_2026_09_14--ae169f3492dc/pages/0006/page_spec.json).

### Pagina 07 — Sistemi spaziali: orbita e orientamento

**source_page:** 7; label PDF 6; mapping 1:1.

**learning_objective:** Trasferire la distinzione costo/vincoli a un altro dominio.

**prerequisite:** Performance index e constraints; Orbita e orientamento

**key_ideas:** Orbita/velocità, energia e tempo sono criteri.; Orientamento Sole/Terra e orbita compaiono nei vincoli.; Thrust e velocità hanno limiti.

**intuitive_explanation — enrichment:** Due manovre ipotetiche possono avere consumi diversi ma solo una rispettare l'orientamento richiesto.

**mathematical_explanation:** Nessuna dinamica orbitale, missione o costante fisica è assegnata.

**formulas_to_show** (source = contenuto della fonte; correction/policy = F03; enrichment = aggiunta):

Nessuna formula della fonte; eventuali espressioni dell'esempio sono enrichment.

**worked_example — Esempio aggiunto:**
Enrichment: confrontare due manovre di assetto, una energeticamente più economica ma incompatibile con un orientamento imposto verso Sole/Terra e una ammissibile.

- Verificare prima l'orientamento richiesto.
- Confrontare consumo o tempo soltanto fra le manovre ammissibili.

Limiti: Esempio concettuale; non è un modello orbitale o un dato della fonte.

**visualization:** Ultima matrice della sequenza: orbita, energia, tempo e orientamento; confronto qualitativo senza grafico orbitale quantitativo.

**interaction:** Statica. Una simulazione orbitale aggiungerebbe quasi tutto il modello fisico; la pagina richiede soltanto una lettura concettuale.

**controls / expected_parameter_effects:**

Nessun controllo; nessun parametro dello studente da propagare.

**edge_cases:**

- Orientamenti incompatibili simultaneamente: Dichiarare che i requisiti potrebbero non essere realizzabili, senza inventare una soluzione.

**takeaway:** La struttura decisione–costo–vincoli ricorre in domini diversi.

**source_warning:** NO_WARNING.
Nessun avviso allo studente.

**reusable_components:** ComparisonTable

**relation_to_previous_page:** Riprende Droni: percorso, energia e ostacoli. La pagina 6 tratta droni; qui cambiano dominio, esempi di indice, vincoli geometrici e immagini. Il candidato di somiglianza non è un overlay.

**relation_to_next_page:** Prepara Continuo: stato, ingresso, uscita. La pagina 8 introduce stato, ingresso, uscita ed equazioni a tempo continuo; queste equazioni non sono ancora specifiche del satellite.

**estimated_density:** MEDIUM. Un focus, fino a tre idee, un esempio principale; formula e grafico condividono simboli e legenda.

**Layout:** COMPARISON; HEADER → EXPLANATION → MAIN_VISUAL → WORKED_EXAMPLE → TAKEAWAY.

**Moduli matematici condivisi:** Nessuno necessario.

**Fonte e limiti:** Nessuna orbita, costante gravitazionale, modello energetico o legge di orientamento viene assegnata.; Non si può dedurre che il satellite raffigurato sia la soluzione di un problema ottimo presentato nella slide.

**PAGE_SPEC:** [0007](../Data/documents/OPTCON-RL_introduction_optimal_control_2026_09_14--ae169f3492dc/pages/0007/page_spec.json).

### Pagina 08 — Continuo: stato, ingresso, uscita

**source_page:** 8; label PDF 7; mapping 1:1.

**learning_objective:** Leggere una ODE e distinguere stato e uscita.

**prerequisite:** Derivata e vettore colonna; Stato/ingresso/uscita nel feedback

**key_ideas:** f determina la variazione dello stato.; h determina l'uscita.; Time-invariant non significa traiettoria costante.

**intuitive_explanation — enrichment:** L'ingresso agisce sulla velocità di cambiamento; l'uscita è ciò che il modello rende osservabile per il task.

**mathematical_explanation:** Esempio aggiunto: ẋ=−ax+u, y=x. Per a>0, x(t)=u/a+(x⁰−u/a)e^(−at); per a=0, x=x⁰+ut.

**formulas_to_show** (source = contenuto della fonte; correction/policy = F03; enrichment = aggiunta):

- source: \(\dot{x}(t)=f(x(t),u(t),t),\qquad x(0)=x^0\)
- source: \(y(t)=h(x(t),u(t),t)\)
- source: \(x(t)\in\mathbb{R}^n,\quad u(t)\in\mathbb{R}^m,\quad y(t)\in\mathbb{R}^p\)
- source: \(\dot{x}(t)=f(x(t),u(t))\)
- enrichment: \(\dot x=-ax+u,\quad y=x;\quad x(t)=u/a+(x^0-u/a)e^{-at}\ (a>0);\quad x(t)=x^0+ut\ (a=0)\)

**worked_example — Esempio aggiunto:**
Enrichment: n=m=p=1, ẋ=−a x+u, y=x, ingresso costante; questi f e h non sono assegnati dalla fonte.

- Per a>0: x(t)=u/a+(x⁰−u/a)e^(−a t).
- Con i valori scelti: x(t)=1−e^(−t).
- x(1)≈0.6321 e y(1)=x(1) soltanto per la scelta h=x.

Limiti: Modello e numeri sono enrichment; nessuna proprietà di un velivolo o drone viene dedotta.

**visualization:** Curva x(t)=y(t), t in [0,5] s; ingresso costante in una traccia allineata; condizioni iniziali e dimensioni vicino alla formula, assi con unità convenzionali.

**interaction:** Sì. Variare stato iniziale, ingresso e coefficiente rende osservabile la differenza fra dinamica f e traiettoria x(t).

**controls / expected_parameter_effects:**

| Controllo | Dominio; default; unità | Effetto osservabile |
| --- | --- | --- |
| a | [0, 2], passo indicativo 0.1; default 1; s⁻¹ | Ricalcolare la soluzione esatta e la velocità di convergenza; per a=0 usare x=x⁰+ut senza dividere per a. |
| u | [-1, 1], passo indicativo 0.1; default 1; state unit/s | Ricalcolare x(t), y(t) e il livello u/a quando a>0. |
| x^0 | [-2, 2], passo indicativo 0.1; default 0; state unit | Cambiare il valore di partenza e il transitorio, mantenendo invariata la dinamica scelta. |

Invarianti: y=x soltanto nell'esempio; Orizzonte illustrativo fisso di 5 s; Nessuna modifica alle equazioni generali della fonte

**edge_cases:**

- a=0 nell'esempio: Usare il limite integratore x⁰+ut.
- Stato e ingresso costanti di equilibrio: Non confondere l'equilibrio particolare con la proprietà generale di invarianza temporale.

**takeaway:** Un modello continuo specifica come evolve lo stato, non il suo costo.

**source_warning:** NO_WARNING.
Nessun avviso allo studente.

**reusable_components:** EquationCard, TimeSeriesPlot, ParameterControl

**relation_to_previous_page:** Riprende Sistemi spaziali: orbita e orientamento. La pagina 7 chiude le motivazioni; nessuna sua dinamica spaziale è necessaria per la definizione generale.

**relation_to_next_page:** Prepara Discreto: un ingresso, un aggiornamento. La pagina 9 sostituisce la derivata con un aggiornamento discreto e introduce indici compatti; non è dichiarato un metodo di discretizzazione.

**estimated_density:** HIGH. Un focus, fino a tre idee, un esempio principale; formula e grafico condividono simboli e legenda.

**Layout:** SIMULATION; HEADER → EXPLANATION → FORMULA → MAIN_VISUAL → CONTROLS → WORKED_EXAMPLE → TAKEAWAY.

**Moduli matematici condivisi:** scalar_dynamics

**Fonte e limiti:** La fonte non assegna f, h, parametri numerici, regolarità sufficiente o algoritmo di integrazione.; Time-invariant non significa che stato e ingresso siano costanti.; Non si può identificare in generale y(t) con x(t).

**PAGE_SPEC:** [0008](../Data/documents/OPTCON-RL_introduction_optimal_control_2026_09_14--ae169f3492dc/pages/0008/page_spec.json).

### Pagina 09 — Discreto: un ingresso, un aggiornamento

**source_page:** 9; label PDF 8; mapping 1:1.

**learning_objective:** Associare ogni u_t alla transizione x_t → x_{t+1}.

**prerequisite:** Funzione e successione; Stato e ingresso

**key_ideas:** Due notazioni descrivono lo stesso modello discreto.; f_t può cambiare con t.; L'indice temporale non è una derivata.

**intuitive_explanation — enrichment:** Il sistema avanza di un passo applicando una mappa allo stato e all'ingresso correnti.

**mathematical_explanation:** Esempio x_{t+1}=a x_t+u, sei passi. Non presentarlo come discretizzazione della ODE precedente: nessun campionamento è assegnato dalla fonte.

**formulas_to_show** (source = contenuto della fonte; correction/policy = F03; enrichment = aggiunta):

- source: \(x(t+1)=f(x(t),u(t),t),\quad x(0)=x^0,\quad t\in\mathbb{N}_0\)
- source: \(x_{t+1}=f_t(x_t,u_t),\quad x_0=x^0,\quad t\in\mathbb{N}_0\)
- source: \(x_t\in\mathbb{R}^n,\quad u_t\in\mathbb{R}^m\)
- enrichment: \(x_{t+1}=a x_t+u\)

**worked_example — Esempio aggiunto:**
Enrichment scalare xₜ₊₁=0.8xₜ+uₜ, con x⁰=1 e uₜ=0.2 costante.

- x₀=x⁰=1.
- x₁=0.8·1+0.2=1.
- x₂=0.8·1+0.2=1.

Limiti: La ricorrenza lineare è aggiunta per l'esempio, non sostituisce la fₜ generale della fonte.

**visualization:** Timeline con sette nodi x₀…x₆ e sei archi u₀…u₅; campioni isolati con collegamenti schematici, mai una curva continua attribuita al modello.

**interaction:** Sì. Un passo alla volta rende concreto l'indice t+1 e la dipendenza dall'ingresso al tempo t.

**controls / expected_parameter_effects:**

| Controllo | Dominio; default; unità | Effetto osservabile |
| --- | --- | --- |
| a | [-1.2, 1.2], passo indicativo 0.1; default 0.8; 1 | Ricalcolare sei aggiornamenti xₜ₊₁=a xₜ+u e mostrare i valori nella timeline. |
| u | [-1, 1], passo indicativo 0.1; default 0.2; state unit | Aggiornare tutti gli stati successivi, lasciando invariato x₀. |
| x^0 | [-2, 2], passo indicativo 0.1; default 1; state unit | Cambiare x₀ e propagare nuovamente la ricorrenza. |

Invarianti: Numero di aggiornamenti fissato per l'esempio; Indici interi a partire da zero; La fonte non fornisce a

**edge_cases:**

- a=0 nell'esempio: Il nuovo stato coincide con l'ingresso corrente, indipendentemente dallo stato precedente.
- a=1 e ingresso non nullo: Mostrare l'accumulo, senza etichettare ogni sistema discreto come convergente.

**takeaway:** La notazione compatta conserva stato, ingresso e istante dell'aggiornamento.

**source_warning:** NO_WARNING.
Nessun avviso allo studente.

**reusable_components:** EquationCard, StateInputTimeline, ParameterControl

**relation_to_previous_page:** Riprende Continuo: stato, ingresso, uscita. La pagina 8 era a tempo continuo; la fonte qui introduce un altro modello generale, senza indicare Euler o un passo di campionamento.

**relation_to_next_page:** Prepara Orizzonte finito: contare senza errori. La pagina 10 limita il tempo a un orizzonte finito e impila stati e ingressi.

**estimated_density:** MEDIUM. Un focus, fino a tre idee, un esempio principale; formula e grafico condividono simboli e legenda.

**Layout:** FORMULA_EXPLORER; HEADER → EXPLANATION → FORMULA → MAIN_VISUAL → CONTROLS → WORKED_EXAMPLE → TAKEAWAY.

**Moduli matematici condivisi:** scalar_dynamics, horizon_indexing

**Fonte e limiti:** Non è indicato un tempo di campionamento o uno schema di integrazione.; fₜ può dipendere dal tempo; il sottoscritto non è una derivata.; Nessuna condizione di stabilità è formulata.

**PAGE_SPEC:** [0009](../Data/documents/OPTCON-RL_introduction_optimal_control_2026_09_14--ae169f3492dc/pages/0009/page_spec.json).

### Pagina 10 — Orizzonte finito: contare senza errori

**source_page:** 10; label PDF 9; mapping 1:1.

**learning_objective:** Costruire gli stack di stati e ingressi con indici corretti.

**prerequisite:** Notazione discreta e condizione iniziale; Dimensione dei vettori

**key_ideas:** T transizioni usano T ingressi.; La timeline comprende T+1 stati.; Lo stack 𝐱 esclude x₀.

**intuitive_explanation — enrichment:** Ogni arco ha un ingresso; ogni nuovo nodo entra nello stack degli stati.

**mathematical_explanation:** 𝐱=col(x₁,…,x_T) ha nT componenti; 𝐮=col(u₀,…,u_{T−1}) ne ha mT. Il caso numerico n=m=1,T=3 è un'istantanea separata dall'ispettore simbolico.

**formulas_to_show** (source = contenuto della fonte; correction/policy = F03; enrichment = aggiunta):

- source: \(x_{t+1}=f_t(x_t,u_t),\quad x_0=x^0,\quad t=0,\ldots,T-1\tag{1}\)
- source: \(\mathbf{x}\in\mathbb{R}^{nT},\quad \mathbf{u}\in\mathbb{R}^{mT}\)
- source: \(\mathbf{x}:=\operatorname{col}(x_1,\ldots,x_T),\qquad\mathbf{u}:=\operatorname{col}(u_0,\ldots,u_{T-1})\)

**worked_example — Esempio aggiunto:**
Enrichment: n=m=1, T=3, x⁰=1, xₜ₊₁=xₜ+uₜ e 𝐮=col(0.5,−0.25,0).

- x₁=1.5, x₂=1.25, x₃=1.25.
- 𝐱=col(1.5,1.25,1.25)∈R³.
- La timeline contiene quattro stati x₀,x₁,x₂,x₃ e tre ingressi.

Limiti: La dinamica integratore e i numeri sono enrichment.

**visualization:** Timeline e due stack verticali compatti affiancati; x₀ appare come dato esterno. Cambiare n,m altera dimensioni e blocchi simbolici, senza inventare una dinamica vettoriale.

**interaction:** Sì. Cambiare T e le dimensioni rende immediato il conteggio dei blocchi senza simulare una dinamica non assegnata.

**controls / expected_parameter_effects:**

| Controllo | Dominio; default; unità | Effetto osservabile |
| --- | --- | --- |
| T | [1, 6], passo indicativo 1; default 3; steps | Ridisegnare T transizioni, T+1 nodi di stato e T blocchi per ciascuno stack; aggiornare nT e mT. |
| n | [1, 3], passo indicativo 1; default 1; components | Aggiornare la dimensione di ogni blocco xₜ e quella dello stack nT, senza cambiare gli indici temporali. |
| m | [1, 3], passo indicativo 1; default 1; components | Aggiornare i blocchi uₜ e mT lasciando invariata la dimensione dello stato. |

Invarianti: x₀ escluso da 𝐱; Ultimo ingresso u_{T−1}; Range e default dei controlli sono scelte di enrichment, non della fonte

**edge_cases:**

- T=1: Mostrare un solo ingresso u₀ e uno stato impilato x₁.
- T=0: Escluderlo dal controllo proposto; gli stack vuoti richiederebbero una convenzione non discussa dalla fonte.

**takeaway:** Ultimo stato x_T, ultimo ingresso u_{T−1}.

**source_warning:** NO_WARNING.
Nessun avviso allo studente.

**reusable_components:** EquationCard, VectorVisualizer, StateInputTimeline, ParameterControl

**relation_to_previous_page:** Riprende Discreto: un ingresso, un aggiornamento. La pagina 9 introduceva indici su N₀; qui si considera solo un intervallo finito.

**relation_to_next_page:** Prepara Traiettoria ed equilibrio. La pagina 11 usa le coppie di stack per definire quando una sequenza è una traiettoria.

**estimated_density:** MEDIUM. Un focus, fino a tre idee, un esempio principale; formula e grafico condividono simboli e legenda.

**Layout:** FORMULA_EXPLORER; HEADER → EXPLANATION → FORMULA → MAIN_VISUAL → CONTROLS → WORKED_EXAMPLE → TAKEAWAY.

**Moduli matematici condivisi:** horizon_indexing

**Fonte e limiti:** T transizioni generano T+1 stati se si conta anche x₀, ma 𝐱 ne contiene solo T.; Non aggiungere uᵀ allo stack né includere x₀ come variabile libera.; La pagina non assegna una funzione di costo.

**PAGE_SPEC:** [0010](../Data/documents/OPTCON-RL_introduction_optimal_control_2026_09_14--ae169f3492dc/pages/0010/page_spec.json).

### Pagina 11 — Traiettoria ed equilibrio

**source_page:** 11; label PDF 10; mapping 1:1.

**learning_objective:** Verificare quando una coppia costante genera una traiettoria.

**prerequisite:** Stack e dinamica (1)

**key_ideas:** Una traiettoria soddisfa tutti gli aggiornamenti.; Un equilibrio è una traiettoria costante.; La barra non significa ottimalità.

**intuitive_explanation — enrichment:** Tenere costante un ingresso non obbliga lo stato a restare costante: occorre una coppia compatibile.

**mathematical_explanation:** Per f(x,u)=0.5x+u il residuo x_e−f(x_e,u_e)=0.5x_e−u_e è nullo quando u_e=0.5x_e.

**formulas_to_show** (source = contenuto della fonte; correction/policy = F03; enrichment = aggiunta):

- source: \((\bar{\mathbf{x}},\bar{\mathbf{u}})\in\mathbb{R}^{nT}\times\mathbb{R}^{mT},\qquad\bar{x}_{t+1}=f_t(\bar{x}_t,\bar{u}_t),\quad t=0,\ldots,T-1\)
- source: \((x_e,u_e)\in\mathbb{R}^n\times\mathbb{R}^m,\qquad(x_t,u_t)=(x_e,u_e),\quad t\in\mathbb{N}_0\)
- source: \(x_e=f(x_e,u_e)\)
- enrichment: \(f(x,u)=0.5x+u,\quad x_e-f(x_e,u_e)=0.5x_e-u_e\)

**worked_example — Esempio aggiunto:**
Enrichment scalare f(x,u)=0.5x+u; scegliere xₑ=2, uₑ=1.

- f(2,1)=0.5·2+1=2, quindi la coppia è di equilibrio.
- Con x⁰=0 e uₜ=1, gli stati 0,1,1.5,1.75,… formano una traiettoria non costante.
- La sequenza che imponesse x₁=2 a partire da x⁰=0 e u₀=1 non rispetterebbe l'aggiornamento.

Limiti: Modello e numeri sono aggiunti, non dati dalla fonte.

**visualization:** Confronto statico fra sequenza 0,1,1.5,1.75 e coppia (2,1); ispettore corrente con candidato x_e, stato successivo f e residuo.

**interaction:** Sì. Il residuo rende verificabile il requisito xₑ=f(xₑ,uₑ), senza introdurre un algoritmo di controllo.

**controls / expected_parameter_effects:**

| Controllo | Dominio; default; unità | Effetto osservabile |
| --- | --- | --- |
| x_e | [-3, 3], passo indicativo 0.1; default 2; state unit | Ricalcolare f(xₑ,uₑ), il residuo xₑ−f(xₑ,uₑ) e l'indicatore di equilibrio. |
| u_e | [-2, 2], passo indicativo 0.1; default 1; input unit | Cambiare il residuo e il livello di ingresso; non mantenere artificiosamente l'etichetta di equilibrio. |

Invarianti: Il coefficiente 0.5 appartiene all'esempio enrichment; Tolleranza numerica dichiarata; Non visualizzare stabilità come conseguenza della sola verifica di equilibrio

**edge_cases:**

- Coppia costante incompatibile con x⁰: Per generare quella traiettoria costante l'inizializzazione deve coincidere con xₑ.
- Equilibrio instabile in un diverso modello: Può soddisfare l'uguaglianza; non dichiararlo stabile per questo.

**takeaway:** Equilibrio richiede coerenza della coppia e inizializzazione nello stesso stato.

**source_warning:** NO_WARNING.
Nessun avviso allo studente.

**reusable_components:** EquationCard, ComparisonTable, StateInputTimeline, ParameterControl

**relation_to_previous_page:** Riprende Orizzonte finito: contare senza errori. La pagina 10 definisce gli stack e il sistema (1), inclusa la condizione iniziale fissata.

**relation_to_next_page:** Prepara Linearizzazione: misurare l'errore locale. La pagina 12 sceglie una traiettoria nominale per linearizzare la dinamica attorno ad essa.

**estimated_density:** MEDIUM. Un focus, fino a tre idee, un esempio principale; formula e grafico condividono simboli e legenda.

**Layout:** COMPARISON; HEADER → EXPLANATION → FORMULA → MAIN_VISUAL → CONTROLS → WORKED_EXAMPLE → TAKEAWAY.

**Moduli matematici condivisi:** scalar_dynamics, constraint_residuals

**Fonte e limiti:** La barra non significa ottimalità: indica la traiettoria considerata.; Essere equilibrio non implica stabilità, attrattività o ottimalità.; Per il sistema time-varying una coppia costante deve soddisfare tutte le mappe temporali; la formula finale senza t è esplicitamente per il caso time-invariant.

**PAGE_SPEC:** [0011](../Data/documents/OPTCON-RL_introduction_optimal_control_2026_09_14--ae169f3492dc/pages/0011/page_spec.json).

### Pagina 12 — Linearizzazione: misurare l'errore locale

**source_page:** 12; label PDF 11; mapping 1:1.

**learning_objective:** Confrontare variazione esatta e previsione al primo ordine.

**prerequisite:** Traiettoria nominale; Jacobiano e approssimazione al primo ordine

**key_ideas:** La nominale deve essere una traiettoria.; A_t,B_t sono Jacobiani lungo la nominale.; Le variazioni seguono un'approssimazione locale.

**intuitive_explanation — enrichment:** La tangente descrive bene piccoli spostamenti; lo scarto rende visibile che cosa si perde.

**mathematical_explanation:** Esempio f=x²+u, nominale (1,0), A=2,B=1. Esatta: 2Δx+(Δx)²+Δu; lineare: 2Δx+Δu; errore=(Δx)².

**formulas_to_show** (source = contenuto della fonte; correction/policy = F03; enrichment = aggiunta):

- source: \(x_{t+1}=f_t(x_t,u_t),\quad t\in\mathbb{N}_0\)
- source: \(\bar{x}_{t+1}=f_t(\bar{x}_t,\bar{u}_t)\)
- source: \(\Delta x_{t+1}=A_t\Delta x_t+B_t\Delta u_t,\quad t\in\mathbb{N}_0\)
- enrichment: \(\Delta x_t=x_t-\bar x_t,\quad\Delta u_t=u_t-\bar u_t\)
- enrichment: \(A_t=\left.\frac{\partial f_t}{\partial x}\right|_{(\bar x_t,\bar u_t)},\quad B_t=\left.\frac{\partial f_t}{\partial u}\right|_{(\bar x_t,\bar u_t)}\)
- enrichment: \(f(x,u)=x^2+u,\quad\Delta x_{t+1}^{\rm exact}=2\Delta x+(\Delta x)^2+\Delta u,\quad\Delta x_{t+1}^{\rm lin}=2\Delta x+\Delta u\)

**worked_example — Esempio aggiunto:**
Enrichment: f(x,u)=x²+u, nominale di equilibrio x̄=1, ū=0; Δx=0.1, Δu=0.

- f(1,0)=1: la nominale è coerente.
- A=2x̄=2, B=1.
- Variazione prevista: 2·0.1=0.2.
- Variazione esatta: f(1.1,0)−f(1,0)=0.21; errore=0.01=(Δx)².

Limiti: Modello, perturbazioni e calcolo dell'errore sono enrichment; il risultato è di un singolo passo.

**visualization:** FunctionPlot con ascissa Δx e ordinata Δx_{t+1}: parabola e retta, punto corrente e segmento dello scarto. Tre valori numerici, nessuna percentuale con denominatore nullo.

**interaction:** Sì. Variare piccole perturbazioni mostra quando il modello delle variazioni approssima bene la dinamica.

**controls / expected_parameter_effects:**

| Controllo | Dominio; default; unità | Effetto osservabile |
| --- | --- | --- |
| \Delta x | [-0.25, 0.25], passo indicativo 0.01; default 0.1; 1 | Aggiornare variazione esatta, lineare e residuo (Δx)²; mantenere fisso A=2. |
| \Delta u | [-0.1, 0.1], passo indicativo 0.01; default 0; 1 | Traslare entrambe le predizioni di Δu; il residuo resta (Δx)² per questo esempio. |

Invarianti: Nominale (1,0) e Jacobiani fissati; Modello x²+u esplicitamente enrichment; Nessuna simulazione di stabilità o ottimalità

**edge_cases:**

- Perturbazione nulla: La variazione è nulla e il modello lineare coincide con la nominale.
- Perturbazioni grandi: Segnalare la perdita possibile di accuratezza; non estrapolare garanzie globali.
- fₜ non differenziabile: Il Jacobiano richiesto può non esistere; prerequisito matematico da dichiarare come enrichment.

**takeaway:** La linearizzazione descrive variazioni attorno a una nominale coerente.

**source_warning:** NO_WARNING.
Nessun avviso allo studente.

**reusable_components:** EquationCard, FunctionPlot, ParameterControl

**relation_to_previous_page:** Riprende Traiettoria ed equilibrio. La pagina 11 spiega che la nominale deve soddisfare la dinamica e che un equilibrio è soltanto un caso particolare.

**relation_to_next_page:** Prepara Dagli strumenti di controllo all'ottimizzazione. La pagina 13 riepiloga gli strumenti di analisi/controllo e ne distingue gli obiettivi dall'ottimizzazione vincolata.

**estimated_density:** HIGH. Un focus, fino a tre idee, un esempio principale; formula e grafico condividono simboli e legenda.

**Layout:** GRAPH_AND_CONTROLS; HEADER → EXPLANATION → FORMULA → MAIN_VISUAL → CONTROLS → WORKED_EXAMPLE → TAKEAWAY.

**Moduli matematici condivisi:** local_linearization

**Fonte e limiti:** La fonte non fornisce una stima dell'errore, un raggio di validità o un teorema di stabilità.; Le formule esplicite delle derivate parziali e Δx=x−x̄ sono chiarimenti derivati, non equazioni scritte nella slide.; Anche una dinamica time-invariant può dare Aₜ,Bₜ variabili lungo una traiettoria non costante.

**PAGE_SPEC:** [0012](../Data/documents/OPTCON-RL_introduction_optimal_control_2026_09_14--ae169f3492dc/pages/0012/page_spec.json).

### Pagina 13 — Dagli strumenti di controllo all'ottimizzazione

**source_page:** 13; label PDF 12; mapping 1:1.

**learning_objective:** Collocare gli strumenti richiamati rispetto a costo e vincoli.

**prerequisite:** Traiettorie, equilibri e linearizzazione; Tracking e stabilizzazione

**key_ideas:** Traiettorie, equilibri e linearizzazione sono strumenti.; Stabilizzazione e tracking sono task.; La scelta quantitativa richiede altri ingredienti.

**intuitive_explanation — enrichment:** Due controllori già verificati stabilizzanti possono avere sforzi diversi: serve un indice per ordinarli.

**mathematical_explanation:** Conservare 'typically' nelle associazioni stabilizzazione/time-invariant e tracking/time-varying; nessuna esclusione generale.

**formulas_to_show** (source = contenuto della fonte; correction/policy = F03; enrichment = aggiunta):

Nessuna formula della fonte; eventuali espressioni dell'esempio sono enrichment.

**worked_example — Esempio aggiunto:**
Enrichment: assumere che due controllori siano già stati verificati stabilizzanti, ma producano consumi o sforzi diversi.

- La stabilizzazione da sola non ordina i due sforzi.
- Definire un indice se si vuole scegliere il controllo meno costoso.
- Verificare separatamente le saturazioni richieste.

Limiti: Nessun controllore, prova di stabilità o consumo è fornito nella fonte.

**visualization:** Due colonne: strumenti/task richiamati e domande ancora aperte su prestazioni/limiti; freccia verso z,ℓ,Z della pagina seguente.

**interaction:** Statica. Il contenuto è una mappa concettuale, non un problema numerico da simulare.

**controls / expected_parameter_effects:**

Nessun controllo; nessun parametro dello studente da propagare.

**edge_cases:**

- Trattare typically come sempre: Conservare la natura indicativa dell'associazione fra tipo di sistema e compito.

**takeaway:** Soddisfare un task e scegliere la soluzione preferita sono passaggi distinti.

**source_warning:** NO_WARNING.
Nessun avviso allo studente.

**reusable_components:** ComparisonTable, ModelDiagram

**relation_to_previous_page:** Riprende Linearizzazione: misurare l'errore locale. La pagina 12 ha definito la linearizzazione lungo una traiettoria; il riepilogo la colloca fra gli strumenti già noti.

**relation_to_next_page:** Prepara Ottimizzazione: decisione, costo, insieme. La pagina 14 definisce decisione, costo e vincoli di un problema di ottimizzazione.

**estimated_density:** MEDIUM. Un focus, fino a tre idee, un esempio principale; formula e grafico condividono simboli e legenda.

**Layout:** CONCEPT_SUMMARY; HEADER → EXPLANATION → MAIN_VISUAL → WORKED_EXAMPLE → TAKEAWAY.

**Moduli matematici condivisi:** Nessuno necessario.

**Fonte e limiti:** 'Typically' non è un'impossibilità di tracking con modelli time-invariant o di stabilizzazione in altri casi.; La fonte non afferma che tutto il controllo non ottimo ignori sempre performance o vincoli.; Non viene assegnato un nuovo modello matematico.

**PAGE_SPEC:** [0013](../Data/documents/OPTCON-RL_introduction_optimal_control_2026_09_14--ae169f3492dc/pages/0013/page_spec.json).

### Pagina 14 — Ottimizzazione: decisione, costo, insieme

**source_page:** 14; label PDF 13; mapping 1:1.

**learning_objective:** Identificare i tre ingredienti e leggere i vincoli impilati.

**prerequisite:** Vettori, funzioni reali e uguaglianze/disequazioni; Perché ottimizzare nel controllo

**key_ideas:** z raccoglie le decisioni.; ℓ associa un valore scalare.; h=0 e g≤0 definiscono Z.

**intuitive_explanation — enrichment:** Prima di cercare il migliore, descrivi le scelte e quali sono consentite.

**mathematical_explanation:** Adottare la dimensione d per tutti i domini con n≡d locale secondo F03. Nell'esempio z=(.5,.5), h=z₁+z₂−1, g=−z₁, costo=.25.

**formulas_to_show** (source = contenuto della fonte; correction/policy = F03; enrichment = aggiunta):

- policy_clarification: \(z\in\mathbb R^d,\quad \ell:\mathbb R^d\to\mathbb R,\quad Z=\{z\in\mathbb R^d:h(z)=0,\ g(z)\le0\},\quad h:\mathbb R^d\to\mathbb R^m,\quad g:\mathbb R^d\to\mathbb R^r\)

**worked_example — Esempio aggiunto:**
Enrichment con d=n=2: z=(z₁,z₂), ℓ(z)=0.5(z₁²+z₂²), h₁(z)=z₁+z₂−1, g₁(z)=−z₁.

- h₁(0.5,0.5)=0.
- g₁(0.5,0.5)=−0.5≤0.
- ℓ(0.5,0.5)=0.25.

Limiti: Formule e numeri dell'esempio sono enrichment.; Non attribuire alla fonte la scelta d=n=2.

**visualization:** Tre riquadri decisione/costo/insieme e tabella di verifica di un punto; nota dimensionale accanto ai domini, nessun algoritmo.

**interaction:** Statica. La classificazione degli ingredienti è prioritaria; l'esplorazione geometrica dei vincoli è proposta nella pagina 17.

**controls / expected_parameter_effects:**

Nessun controllo; nessun parametro dello studente da propagare.

**edge_cases:**

- gⱼ(z)=0: Il vincolo ≤0 è soddisfatto anche sul bordo.
- Insieme Z vuoto: Non vi sono decisioni ammissibili; non cercare un minimo inesistente.
- m o r nulli: Famiglia assente come convenzione di enrichment, non caso discusso nella slide.

**takeaway:** Un costo è confrontabile fra decisioni dello stesso insieme ammissibile.

**source_warning:** INFO_WARNING.
Avviso rosso vicino a domini z,h,g e dimensione d: ⚠ Nota: d e n indicano qui la stessa dimensione.

**reusable_components:** EquationCard, ComparisonTable, InfoNote

**relation_to_previous_page:** Riprende Dagli strumenti di controllo all'ottimizzazione. La pagina 13 motiva perché servano costo e vincoli espliciti.

**relation_to_next_page:** Prepara Costo scalare: distanza da z̄. La pagina 15 assegna una specifica funzione di costo nel caso scalare; qui il costo resta generale.

**estimated_density:** MEDIUM. Un focus, fino a tre idee, un esempio principale; formula e grafico condividono simboli e legenda.

**Layout:** EXPLANATION; HEADER → EXPLANATION → MAIN_VISUAL → FORMULA → WORKED_EXAMPLE → TAKEAWAY.

**Moduli matematici condivisi:** Nessuno necessario.

**Fonte e limiti:** Non viene ancora formulato un algoritmo di soluzione o una condizione di ottimalità.; L'uso alternato di n e d è mantenuto e segnalato; per l'esempio si dichiarano esplicitamente uguali.; g(z)≤0 va letto componente per componente.

**PAGE_SPEC:** [0014](../Data/documents/OPTCON-RL_introduction_optimal_control_2026_09_14--ae169f3492dc/pages/0014/page_spec.json).

### Pagina 15 — Costo scalare: distanza da z̄

**source_page:** 15; label PDF 14; mapping 1:1.

**learning_objective:** Separare la decisione z dal riferimento assegnato z̄.

**prerequisite:** Funzione di costo e variabile decisionale; Quadrato e grafico di una parabola

**key_ideas:** La distanza è elevata al quadrato.; Il costo è simmetrico rispetto a z̄.; Cambiare z̄ ridefinisce la funzione.

**intuitive_explanation — enrichment:** Spostare z cambia il punto valutato; spostare z̄ sposta l'intera parabola.

**mathematical_explanation:** ℓ(z)=½(z−z̄)²; con z̄=2 i valori per z=0,2,3 sono 2,0,.5.

**formulas_to_show** (source = contenuto della fonte; correction/policy = F03; enrichment = aggiunta):

- source: \(d=1,\quad z\in\mathbb{R}^d=\mathbb{R}\)
- source: \(\ell(z)=\frac12(z-\bar z)^2,\qquad\bar z\in\mathbb{R}\)

**worked_example — Esempio aggiunto:**
Enrichment numerico della formula sorgente: z̄=2.

- ℓ(0)=½(−2)²=2.
- ℓ(2)=0.
- ℓ(3)=½·1²=0.5.

Limiti: I valori e l'osservazione sul minimo sono enrichment derivati dalla formula.

**visualization:** Parabola su z∈[−5,5], punto corrente, proiezione orizzontale di z̄ e valore ℓ(z); scala verticale determinata dall'intero dominio dei controlli.

**interaction:** Sì. Il movimento del punto e del riferimento mostra la distinzione fra scegliere z e definire il costo.

**controls / expected_parameter_effects:**

| Controllo | Dominio; default; unità | Effetto osservabile |
| --- | --- | --- |
| z | [-4, 4], passo indicativo 0.1; default 0; 1 | Spostare il punto sulla parabola e ricalcolare ℓ(z); non traslare la parabola. |
| \bar z | [-3, 3], passo indicativo 0.1; default 2; 1 | Traslare orizzontalmente la parabola e ricalcolare il costo del medesimo z. |

Invarianti: Fattore 1/2; Nessun vincolo aggiunto; Range/default sono enrichment

**edge_cases:**

- z=z̄: Mostrare esattamente costo zero, entro la tolleranza numerica.
- Scarti uguali di segno opposto: Mostrare costi uguali.

**takeaway:** Il riferimento definisce che cosa costa poco; la decisione sceglie dove valutare.

**source_warning:** NO_WARNING.
Nessun avviso allo studente.

**reusable_components:** EquationCard, FunctionPlot, ParameterControl

**relation_to_previous_page:** Riprende Ottimizzazione: decisione, costo, insieme. La pagina 14 distingue costo e vincoli; questa pagina specifica solo il primo.

**relation_to_next_page:** Prepara Costo vettoriale: che cosa fanno i pesi?. La pagina 16 generalizza la distanza quadratica ai vettori e ai pesi.

**estimated_density:** MEDIUM. Un focus, fino a tre idee, un esempio principale; formula e grafico condividono simboli e legenda.

**Layout:** GRAPH_AND_CONTROLS; HEADER → EXPLANATION → FORMULA → MAIN_VISUAL → CONTROLS → WORKED_EXAMPLE → TAKEAWAY.

**Moduli matematici condivisi:** quadratic_cost

**Fonte e limiti:** La pagina non impone vincoli a z.; Il minimo in z̄ e la derivata sono deduzioni dalla formula, non enunciati espliciti aggiuntivi della slide.; Non sostituire ℓ con J né rinominare z̄ come x_ref nella trascrizione della fonte.

**PAGE_SPEC:** [0015](../Data/documents/OPTCON-RL_introduction_optimal_control_2026_09_14--ae169f3492dc/pages/0015/page_spec.json).

### Pagina 16 — Costo vettoriale: che cosa fanno i pesi?

**source_page:** 16; label PDF 15; mapping 1:1.

**learning_objective:** Leggere una forma quadratica e la sua geometria.

**prerequisite:** Costo quadratico scalare; Prodotto matriciale e positività (semi-)definita

**key_ideas:** Ogni peso penalizza la propria coordinata.; Le curve di livello rappresentano lo stesso costo.; Pesi nulli creano direzioni non penalizzate.

**intuitive_explanation — enrichment:** Aumentare w₂ rende più costoso lo stesso scarto verticale e comprime le curve lungo z₂.

**mathematical_explanation:** Usare esclusivamente ½w₁(z₁−z̄₁)²+½w₂(z₂−z̄₂)². W=diag(1,4), e=(1,1): .5+2=2.5. Lo zero dei pesi esplora il caso semidefinito generale.

**formulas_to_show** (source = contenuto della fonte; correction/policy = F03; enrichment = aggiunta):

- source: \(\ell(z)=\frac12\|z-\bar z\|^2=\frac12(z-\bar z)^\top(z-\bar z),\quad z,\bar z\in\mathbb{R}^d\)
- source: \(\ell(z)=\frac12\|z-\bar z\|_W^2=\frac12(z-\bar z)^\top W(z-\bar z),\quad W\in\mathbb{R}^{d\times d}\)
- source: \(z=\begin{bmatrix}z_1\\z_2\end{bmatrix},\quad W=\begin{bmatrix}w_1&0\\0&w_2\end{bmatrix}>0,\quad w_1>0,\ w_2>0\)
- correction: \(\ell(z)=\frac12\|z-\bar z\|_W^2=\frac12w_1(z_1-\bar z_1)^2+\frac12w_2(z_2-\bar z_2)^2\)

**worked_example — Esempio aggiunto:**
Enrichment derivato dalla formula matriciale: z̄=(0,0), z=(1,1), W=diag(1,4).

- Con W=diag(1,4) ed e=(1,1): ℓ=½w₁e₁²+½w₂e₂².
- Primo contributo: 0.5; secondo contributo: 2.
- Il costo totale corretto è 2.5.

Limiti: La numerica è aggiunta.; Il grafico proposto segue dichiaratamente la definizione matriciale, non la riga incoerente.

**visualization:** Curve ℓ=.5,1,2,4 su piano z₁,z₂∈[−3,3], centro z̄=(0,0), punto fisso (1,1), due contributi numerici; warning rosso subito dopo l'espansione corretta.

**interaction:** Sì. Comprendere l'effetto distinto di w₁ e w₂ sulla stessa forma quadratica corretta.

**controls / expected_parameter_effects:**

| Controllo | Dominio; default; unità | Effetto osservabile |
| --- | --- | --- |
| w_1 | [0, 5], passo indicativo 0.1; default 1; normalized weight | Ricalcolare ellissi/livelli e costo dalla matrice, modificando la penalizzazione del primo scarto. |
| w_2 | [0, 5], passo indicativo 0.1; default 4; normalized weight | Ricalcolare costo e compressione delle curve lungo la seconda coordinata; non sostituire w₂ con w₁. |

Invarianti: z=(1,1), z̄=(0,0) nell'esempio; Matrice diagonale; Trascrizione della fonte conservata; Range/default sono enrichment

**edge_cases:**

- w₁=w₂>0: Le due espressioni coincidono accidentalmente e le curve sono circolari.
- Un peso nullo: Le curve possono essere non chiuse; mostrare la perdita di positività definita.
- Entrambi i pesi nulli: Costo identicamente zero; nessun minimo unico deducibile.

**takeaway:** I pesi cambiano la metrica del costo, non il punto candidato.

**source_warning:** CORRECTION_WARNING.
Avviso rosso vicino a espansione con il secondo peso w₂: ⚠ Warning: possibile errore nella slide originale. Qui usiamo w₂ nel secondo termine invece di w₁.

**reusable_components:** EquationCard, ContourPlot, CostBreakdown, ParameterControl, WarningBanner

**relation_to_previous_page:** Riprende Costo scalare: distanza da z̄. La pagina 15 contiene il caso d=1 e il fattore 1/2.

**relation_to_next_page:** Prepara Vincoli: regione e curva. La pagina 17 introduce insiemi di vincolo; i pesi di costo non sono parametri di quei vincoli.

**estimated_density:** HIGH. Un focus, fino a tre idee, un esempio principale; formula e grafico condividono simboli e legenda.

**Layout:** GRAPH_AND_CONTROLS; HEADER → EXPLANATION → FORMULA → MAIN_VISUAL → CONTROLS → WORKED_EXAMPLE → TAKEAWAY.

**Moduli matematici condivisi:** quadratic_cost

**Fonte e limiti:** L'espansione finale contiene un probabile refuso; non presentare come letteralmente presente la versione con w₂ nel secondo termine.; La frase positiva (semi-)definita è generale, mentre il caso diagonale successivo richiede entrambi i pesi strettamente positivi.; Per W singolare l'espressione può essere una seminorma; questa precisazione è enrichment matematico.

**PAGE_SPEC:** [0016](../Data/documents/OPTCON-RL_introduction_optimal_control_2026_09_14--ae169f3492dc/pages/0016/page_spec.json).

### Pagina 17 — Vincoli: regione e curva

**source_page:** 17; label PDF 16; mapping 1:1.

**learning_objective:** Distinguere disequazione, uguaglianza e figura qualitativa.

**prerequisite:** Vincoli scalari e insieme Z; Grafico di una disequazione in due variabili

**key_ideas:** g≤0 seleziona una regione, anche il bordo.; h=0 seleziona il luogo a residuo nullo.; La geometria dipende dai coefficienti.

**intuitive_explanation — enrichment:** Nel disco puoi stare dentro o sul bordo; sulla circonferenza devi stare esattamente sul bordo.

**mathematical_explanation:** Pannello principale: az₁²+bz₂²≤c. Inserto fisso: Q=I₂,q=0,c=1 per l'uguaglianza. L'inserto non cambia con a,b,c: didascalia esplicita 'confronto unitario fisso'.

**formulas_to_show** (source = contenuto della fonte; correction/policy = F03; enrichment = aggiunta):

- source: \(Z=\{z\in\mathbb{R}^2\mid a z_1^2+b z_2^2-c\leq0\},\quad a,b,c\in\mathbb{R}\)
- source: \(z^\top Qz+q^\top z-c=0,\quad Q\in\mathbb{R}^{d\times d},\ q\in\mathbb{R}^d,\ c\in\mathbb{R}\)
- enrichment: \(Q=I_2,\quad q=0,\quad c=1\quad\Longrightarrow\quad z_1^2+z_2^2=1\)

**worked_example — Esempio aggiunto:**
Enrichment: a=b=c=1, quindi z₁²+z₂²≤1; confrontare con z₁²+z₂²=1 ottenuto scegliendo Q=I₂,q=0,c=1.

- (0,0) soddisfa ≤1 ma non =1.
- (1,0) soddisfa entrambe.
- (2,0) non soddisfa nessuna delle due.

Limiti: Parametri e disco unitario sono enrichment, non il disegno letterale della fonte.

**visualization:** Piano principale [−3,3]² campito dal segno del residuo e curva zero; inserto circonferenza e tre punti di prova. Nota locale sulla figura qualitativa; indicare ritaglio se insieme non limitato.

**interaction:** Sì. Variare i coefficienti mostra perché una disequazione non corrisponde sempre a un'ellisse e distingue l'insieme dal suo bordo.

**controls / expected_parameter_effects:**

| Controllo | Dominio; default; unità | Effetto osservabile |
| --- | --- | --- |
| a | [-2, 2], passo indicativo 0.1; default 1; 1 | Ricalcolare il segno di az₁²+bz₂²−c sulla griglia e la curva zero; con cambio di segno può cambiare la classe geometrica. |
| b | [-2, 2], passo indicativo 0.1; default 1; 1 | Aggiornare campitura e bordo lungo la seconda coordinata senza spostare arbitrariamente il centro. |
| c | [-2, 2], passo indicativo 0.1; default 1; 1 | Ricalcolare l'insieme ammissibile e indicare quando è vuoto, degenere o non limitato. |

Invarianti: Assi z₁,z₂; Forma senza termine incrociato o lineare; Il grafico di uguaglianza nell'esempio statico usa parametri dichiarati; Range/default sono enrichment

**edge_cases:**

- a,b>0,c=0: L'insieme si riduce all'origine.
- a,b>0,c<0: Insieme vuoto.
- a=b=0: Tutto il piano se c≥0, vuoto se c<0.
- a o b non positivo: Non etichettare automaticamente il risultato come ellisse; il ritaglio grafico non ne prova la limitatezza.

**takeaway:** Il grafico si calcola dalla formula: la sagoma disegnata non assegna i parametri.

**source_warning:** INFO_WARNING.
Avviso rosso vicino a grafico calcolato della disequazione: ⚠ Nota: la figura è qualitativa; il grafico segue la formula.

**reusable_components:** EquationCard, ContourPlot, ConstraintVisualizer, ParameterControl, InfoNote

**relation_to_previous_page:** Riprende Costo vettoriale: che cosa fanno i pesi?. La pagina 16 definiva costi: le curve di livello di un costo non sono automaticamente vincoli.

**relation_to_next_page:** Prepara Minimizzare dentro l'insieme ammissibile. La pagina 18 combina costo e famiglie di vincoli in una minimizzazione.

**estimated_density:** HIGH. Un focus, fino a tre idee, un esempio principale; formula e grafico condividono simboli e legenda.

**Layout:** GRAPH_AND_CONTROLS; HEADER → EXPLANATION → FORMULA → MAIN_VISUAL → CONTROLS → WORKED_EXAMPLE → TAKEAWAY.

**Moduli matematici condivisi:** quadratic_sets, constraint_residuals

**Fonte e limiti:** La fonte non impone a>0,b>0,c>0; non ogni insieme della prima forma è un'ellisse.; Un'ellisse non degenere della forma az₁²+bz₂²≤c è centrata nell'origine e allineata agli assi: il disegno inclinato e traslato è qualitativo.; L'uguaglianza quadratica può generare insiemi diversi dalla parabola disegnata.; Conservare Z nelle formule senza cancellare il riferimento testuale X.

**PAGE_SPEC:** [0017](../Data/documents/OPTCON-RL_introduction_optimal_control_2026_09_14--ae169f3492dc/pages/0017/page_spec.json).

### Pagina 18 — Minimizzare dentro l'insieme ammissibile

**source_page:** 18; label PDF 17; mapping 1:1.

**learning_objective:** Unire costo e vincoli in un problema di minimizzazione.

**prerequisite:** Decisione, costo e vincoli

**key_ideas:** Le forme estesa e compatta sono equivalenti.; Il minimo libero può violare i vincoli.; L'esempio chiuso non è un algoritmo generale.

**intuitive_explanation — enrichment:** Cerca il punto consentito più vicino al fondo della parabola.

**mathematical_explanation:** Nel solo esempio min ½(z−z̄)² con z≤b, z*=min(z̄,b). Con z̄=2,b=1: z*=1, costo=.5.

**formulas_to_show** (source = contenuto della fonte; correction/policy = F03; enrichment = aggiunta):

- source: \(\begin{aligned}\min_{z\in\mathbb{R}^d}\;&\ell(z)\\\text{subj.to }&h(z)=0\\&g(z)\leq0\end{aligned}\)
- source: \(h:\mathbb{R}^d\to\mathbb{R}^m,\quad g:\mathbb{R}^d\to\mathbb{R}^r\)
- enrichment: \(\min_{z\le b}\frac12(z-\bar z)^2,\quad z^\star=\min(\bar z,b)\)

**worked_example — Esempio aggiunto:**
Enrichment scalare: min ℓ(z)=½(z−z̄)² soggetto a z−b≤0, con z̄=2 e b=1.

- Il minimo senza vincolo è z=2, ma non è ammissibile.
- L'ammissibile più vicino a 2 è z=1.
- Il costo al minimo vincolato è ½(1−2)²=0.5.

Limiti: Costo, vincolo e soluzione esplicita sono enrichment.; Non estendere la regola min a problemi generali.

**visualization:** Stessa parabola della pagina 15 con semiretta ammissibile e marcatori di minimo libero/vincolato; formulazione generale impilata sopra.

**interaction:** Sì. Muovere il riferimento e il bordo mostra il passaggio fra vincolo inattivo e attivo.

**controls / expected_parameter_effects:**

| Controllo | Dominio; default; unità | Effetto osservabile |
| --- | --- | --- |
| \bar z | [-2, 2], passo indicativo 0.1; default 2; 1 | Traslare il costo e ricalcolare z*=min(z̄,b) e il valore ottimo. |
| b | [-2, 2], passo indicativo 0.1; default 1; 1 | Spostare la regione z≤b, aggiornare fattibilità del minimo libero e soluzione dell'esempio. |

Invarianti: Il problema generale della fonte resta simbolico; Solo la famiglia scalare aggiunta è risolta; Il singolo limite superiore non rende vuota R

**edge_cases:**

- Problema generale infeasible: Non mostrare un minimizzatore.
- Costo illimitato inferiormente o infimo non raggiunto: Non confondere la scrittura min della fonte con una garanzia di esistenza.
- g(z)=0: Il bordo è incluso dalla disuguaglianza non stretta.

**takeaway:** Il migliore va cercato fra le scelte consentite.

**source_warning:** NO_WARNING.
Nessun avviso allo studente.

**reusable_components:** EquationCard, FunctionPlot, ConstraintVisualizer, ParameterControl

**relation_to_previous_page:** Riprende Vincoli: regione e curva. La pagina 17 mostra esempi di insiemi ammissibili senza costo.

**relation_to_next_page:** Prepara La dinamica è un insieme di uguaglianze. La pagina 19 riporta il quadro all'optimal control, dove la dinamica stessa genera uguaglianze.

**estimated_density:** HIGH. Un focus, fino a tre idee, un esempio principale; formula e grafico condividono simboli e legenda.

**Layout:** GRAPH_AND_CONTROLS; HEADER → EXPLANATION → FORMULA → MAIN_VISUAL → CONTROLS → WORKED_EXAMPLE → TAKEAWAY.

**Moduli matematici condivisi:** quadratic_cost, closed_form_examples

**Fonte e limiti:** La fonte non dà algoritmo, condizioni KKT, convessità, esistenza o unicità del minimo.; I domini sono ora tutti Rᵈ; ciò non autorizza a riscrivere retroattivamente il n stampato a pagina 14.

**PAGE_SPEC:** [0018](../Data/documents/OPTCON-RL_introduction_optimal_control_2026_09_14--ae169f3492dc/pages/0018/page_spec.json).

### Pagina 19 — La dinamica è un insieme di uguaglianze

**source_page:** 19; label PDF 18; mapping 1:1.

**learning_objective:** Valutare la coerenza di una sequenza candidata.

**prerequisite:** Minimizzazione vincolata; Orizzonte e stack discreti

**key_ideas:** Ogni transizione fornisce un vincolo vettoriale.; T aggiornamenti danno nT uguaglianze scalari.; Ogni riga usa la propria f_t.

**intuitive_explanation — enrichment:** Elencare stati e ingressi non li rende indipendenti: ogni arco della timeline impone un legame.

**mathematical_explanation:** Residui f₀(x₀,u₀)−x₁,…,f_{T−1}(x_{T−1},u_{T−1})−x_T. Esempio integratore: x₂=.8 rompe solo il secondo residuo, che diventa −.3.

**formulas_to_show** (source = contenuto della fonte; correction/policy = F03; enrichment = aggiunta):

- source: \(x_{t+1}=f_t(x_t,u_t),\quad t=0,\ldots,T-1\)
- source: \(0<T<+\infty,\qquad T=+\infty\ \text{in alcuni casi}\)
- enrichment: \(f_0(x_0,u_0)-x_1=0,\quad f_1(x_1,u_1)-x_2=0\)

**worked_example — Esempio aggiunto:**
Enrichment: x_{t+1}=x_t+u_t, T=2, x₀=0, 𝐮=(1,−0.5), stati candidati (x₁,x₂)=(1,0.5).

- Primo residuo: x₀+u₀−x₁=0.
- Secondo residuo: x₁+u₁−x₂=0.
- Se si cambia solo x₂ a 0.8, il secondo residuo diventa −0.3 e la sequenza non è una traiettoria del modello.

Limiti: Dinamica e numeri sono enrichment.

**visualization:** Timeline di due passi con residuo sotto ciascun arco e x₂ candidato modificabile; nota accanto alle mappe indicizzate. Orizzonte infinito solo menzionato, non simulato.

**interaction:** Sì. Cambiare un solo stato candidato mostra quale uguaglianza si rompe.

**controls / expected_parameter_effects:**

| Controllo | Dominio; default; unità | Effetto osservabile |
| --- | --- | --- |
| x_2 | [-1, 2], passo indicativo 0.1; default 0.5; state unit | Ricalcolare soltanto il secondo residuo per la sequenza scelta e aggiornare l'indicatore di coerenza; non propagare automaticamente x₂. |

Invarianti: x₀=0, x₁=1, u₀=1, u₁=−0.5; Un residuo nullo non certifica ottimalità

**edge_cases:**

- T=1: Un vincolo vettoriale, n componenti scalari.
- T=+∞: Non rappresentarlo come uno stack finito di dimensione nT; servirà un trattamento successivo.

**takeaway:** Una traiettoria candidata è coerente quando tutti i residui dinamici sono nulli.

**source_warning:** INFO_WARNING.
Avviso rosso vicino a righe f₀,f₁,…,f_{T−1}: ⚠ Nota: ogni transizione usa la propria mappa f_t.

**reusable_components:** EquationCard, StateInputTimeline, ParameterControl, InfoNote

**relation_to_previous_page:** Riprende Minimizzare dentro l'insieme ammissibile. La pagina 18 scrive vincoli h(z)=0 in forma astratta; qui si riconoscono uguaglianze specifiche del controllo.

**relation_to_next_page:** Prepara Costo di stadio e costo terminale. La pagina 20 aggiunge variabili decisionali, costo di stadio e costo terminale.

**estimated_density:** HIGH. Un focus, fino a tre idee, un esempio principale; formula e grafico condividono simboli e legenda.

**Layout:** FORMULA_EXPLORER; HEADER → EXPLANATION → FORMULA → MAIN_VISUAL → CONTROLS → WORKED_EXAMPLE → TAKEAWAY.

**Moduli matematici condivisi:** horizon_indexing, constraint_residuals

**Fonte e limiti:** T uguaglianze significa T uguaglianze vettoriali; per stato n-dimensionale corrispondono a nT equazioni scalari, come chiarimento di enrichment.; Lo schema delle righe non assegna a ogni riga l'indice numerico di f; non trattare quel t ripetuto come una scelta di un unico istante.; Non è fornito un algoritmo per l'orizzonte infinito.

**PAGE_SPEC:** [0019](../Data/documents/OPTCON-RL_introduction_optimal_control_2026_09_14--ae169f3492dc/pages/0019/page_spec.json).

### Pagina 20 — Costo di stadio e costo terminale

**source_page:** 20; label PDF 19; mapping 1:1.

**learning_objective:** Contare e sommare esattamente i contributi di una candidata.

**prerequisite:** Stack e orizzonte; Dinamica come vincolo

**key_ideas:** T stage cost usano x₀…x_{T−1}.; Il terminal cost usa x_T.; x₀ è un dato solo quando viene assegnato.

**intuitive_explanation — enrichment:** Valuta ogni tratto del viaggio, poi aggiungi il valore dell'arrivo.

**mathematical_explanation:** Candidata integratore x=(1,.5,.5), u=(−.5,0). Con ℓ_t=½(αx_t²+βu_t²), ℓ_T=½γx_T² e α=β=1,γ=4: .625+.125+.5=1.25.

**formulas_to_show** (source = contenuto della fonte; correction/policy = F03; enrichment = aggiunta):

- source: \(\ell(x_0,\mathbf{x},\mathbf{u})=\sum_{t=0}^{T-1}\ell_t(x_t,u_t)+\ell_T(x_T)\)
- source: \(\ell_t:\mathbb{R}^n\times\mathbb{R}^m\to\mathbb{R},\quad\ell_T:\mathbb{R}^n\to\mathbb{R}\)
- source: \(x_0=x^0,\qquad\ell(\mathbf{x},\mathbf{u})=\sum_{t=0}^{T-1}\ell_t(x_t,u_t)+\ell_T(x_T)\)
- enrichment: \(\ell_t=\frac12(\alpha x_t^2+\beta u_t^2),\quad\ell_T=\frac12\gamma x_T^2\)

**worked_example — Esempio aggiunto:**
Enrichment: T=2, x_{t+1}=x_t+u_t, x⁰=1, u₀=−0.5,u₁=0; ℓ_t=½(x_t²+u_t²), ℓ_T=2x_T².

- Stage t=0: ½(1+0.25)=0.625.
- Stage t=1: ½(0.25+0)=0.125.
- Terminale: 2·0.25=0.5.
- Totale: 0.625+0.125+0.5=1.25.

Limiti: Funzioni e numeri sono enrichment; la traiettoria non è dichiarata ottima.

**visualization:** Timeline comune e tre barre per stage 0, stage 1, terminale; ogni barra separa stato/ingresso. Etichetta permanente 'candidata fissa'.

**interaction:** Sì. Variare coefficienti su una traiettoria fissa mostra quali addendi cambiano, senza confondere valutazione e ottimizzazione.

**controls / expected_parameter_effects:**

| Controllo | Dominio; default; unità | Effetto osservabile |
| --- | --- | --- |
| α | [0, 4], passo indicativo 0.1; default 1; normalized weight | Nell'esempio ℓ_t=½(αx_t²+βu_t²), aggiornare solo i contributi di stato degli stadi. |
| β | [0, 4], passo indicativo 0.1; default 1; normalized weight | Aggiornare solo le barre dei contributi di ingresso e il totale. |
| γ | [0, 8], passo indicativo 0.1; default 4; normalized weight | Usare ℓ_T=½γx_T² e aggiornare solo la barra terminale e il totale. |

Invarianti: Traiettoria fissata ai valori dell'esempio; Nessun ricalcolo di un ottimo; α,β,γ non sono simboli della slide

**edge_cases:**

- Stato iniziale non dato: Conservare x₀ fra le decisioni; non ometterlo come se fosse un parametro.
- Terminal cost nullo: Mantenere il concetto di contributo terminale senza inventare un valore diverso.
- T=1: Un solo stage cost e un terminal cost.

**takeaway:** Valutare un costo non significa ottimizzare la traiettoria.

**source_warning:** NO_WARNING.
Nessun avviso allo studente.

**reusable_components:** EquationCard, StateInputTimeline, CostBreakdown, ParameterControl

**relation_to_previous_page:** Riprende La dinamica è un insieme di uguaglianze. La pagina 19 impone che le variabili di stato e ingresso rispettino la dinamica.

**relation_to_next_page:** Prepara Vincoli agli estremi e lungo il percorso. La pagina 21 aggiunge end-point e path constraints, senza cambiare questa decomposizione del costo.

**estimated_density:** HIGH. Un focus, fino a tre idee, un esempio principale; formula e grafico condividono simboli e legenda.

**Layout:** WORKED_EXAMPLE; HEADER → EXPLANATION → FORMULA → MAIN_VISUAL → CONTROLS → WORKED_EXAMPLE → TAKEAWAY.

**Moduli matematici condivisi:** additive_cost

**Fonte e limiti:** Il costo non è ancora necessariamente quadratico, positivo o time-invariant.; Non includere automaticamente un ingresso u_T nel costo terminale.; Cambiare pesi di un costo valutato su una traiettoria fissa non significa aver ricalcolato una traiettoria ottima.

**PAGE_SPEC:** [0020](../Data/documents/OPTCON-RL_introduction_optimal_control_2026_09_14--ae169f3492dc/pages/0020/page_spec.json).

### Pagina 21 — Vincoli agli estremi e lungo il percorso

**source_page:** 21; label PDF 20; mapping 1:1.

**learning_objective:** Verificare se endpoint e path constraints sono compatibili.

**prerequisite:** Uguaglianze e disuguaglianze; Stati iniziale e terminale e orizzonte

**key_ideas:** r riguarda gli estremi.; g_t riguarda ogni istante indicato.; Vincoli comprensibili separatamente possono essere incompatibili.

**intuitive_explanation — enrichment:** Un obiettivo finale può essere troppo lontano per gli ingressi consentiti.

**mathematical_explanation:** Integratore, T=2,x₀=0,x₂=1, |u_t|≤b. Raggiungibile [−2b,2b]: b=.4 non basta; b=.5 ammette u₀=u₁=.5.

**formulas_to_show** (source = contenuto della fonte; correction/policy = F03; enrichment = aggiunta):

- source: \(r(x_0,x_T)=0\)
- source: \(g_t(x_t,u_t)\leq0,\quad t=0,\ldots,T-1\)
- enrichment: \(x_{t+1}=x_t+u_t,\quad r=\operatorname{col}(x_0,x_2-1),\quad g_t=\operatorname{col}(u_t-b,-u_t-b),\quad x_2\in[-2b,2b]\)

**worked_example — Esempio aggiunto:**
Enrichment: x_{t+1}=x_t+u_t, T=2, r=col(x₀,x₂−1), g_t=col(u_t−b,−u_t−b), b=0.4.

- r=0 impone x₀=0 e x₂=1.
- g_t≤0 impone |u_t|≤0.4.
- In due passi x₂≤0.8: endpoint irraggiungibile.
- Con b=0.5, u₀=u₁=0.5 soddisfa entrambi i tipi di vincolo.

Limiti: Modello e valori sono enrichment; la fonte non assegna questi limiti.

**visualization:** Timeline con endpoint e limiti sugli archi; retta del raggiungibile con target 1 e test di appartenenza. Non aggiungere automaticamente un path constraint su x_T.

**interaction:** Sì. Variare il limite d'ingresso mostra quando i vincoli agli estremi sono compatibili con quelli lungo il percorso.

**controls / expected_parameter_effects:**

| Controllo | Dominio; default; unità | Effetto osservabile |
| --- | --- | --- |
| b | [0, 1], passo indicativo 0.05; default 0.4; input unit | Aggiornare la regione raggiungibile x₂∈[−2b,2b] e l'indicatore di fattibilità per il target 1. |

Invarianti: Dinamica integratore e T=2; Stato iniziale 0 e terminale richiesto 1; Non viene valutato un costo

**edge_cases:**

- Nessun terminal path constraint esplicito: Non marcare x_T come automaticamente limitato da g_t indicizzato fino a T−1.
- b esattamente alla soglia: Il vincolo ≤ include il valore di bordo.
- Endpoint impossibile: Mostrare infeasibilità, non una traiettoria approssimata spacciata per ammissibile.

**takeaway:** La fattibilità va verificata congiuntamente per tutte le famiglie di vincoli.

**source_warning:** NO_WARNING.
Nessun avviso allo studente.

**reusable_components:** EquationCard, StateInputTimeline, ConstraintVisualizer, ParameterControl

**relation_to_previous_page:** Riprende Costo di stadio e costo terminale. La pagina 20 ha definito variabili e costo: i vincoli di questa pagina sono condizioni aggiuntive, non termini di costo.

**relation_to_next_page:** Prepara Tracking: valutare una candidata. La pagina 22 specifica un costo di tracking prima del problema completo della pagina 23.

**estimated_density:** MEDIUM. Un focus, fino a tre idee, un esempio principale; formula e grafico condividono simboli e legenda.

**Layout:** GRAPH_AND_CONTROLS; HEADER → EXPLANATION → FORMULA → MAIN_VISUAL → CONTROLS → WORKED_EXAMPLE → TAKEAWAY.

**Moduli matematici condivisi:** constraint_residuals, closed_form_examples

**Fonte e limiti:** L'intervallo scritto per g_t si ferma a T−1: non affermare che imponga automaticamente un vincolo su x_T.; r è un'uguaglianza; la slide non enumera tutti i possibili vincoli terminali di altri tipi.; Nessuna condizione di raggiungibilità è garantita.

**PAGE_SPEC:** [0021](../Data/documents/OPTCON-RL_introduction_optimal_control_2026_09_14--ae169f3492dc/pages/0021/page_spec.json).

### Pagina 22 — Tracking: valutare una candidata

**source_page:** 22; label PDF 21; mapping 1:1.

**learning_objective:** Separare curva desiderata, candidata e contributi quadratici.

**prerequisite:** Costo additivo; Forme quadratiche pesate; Traiettoria dinamica

**key_ideas:** Il desiderato può violare la dinamica.; Q,Q_T sono semidefinite; R è definita positiva.; Il primo riferimento va dichiarato.

**intuitive_explanation — enrichment:** Volere x₁=1 con u₀=0 non lo rende possibile nell'integratore inizializzato a zero.

**mathematical_explanation:** T=1,Q=0,x₀^{des}=x⁰=0,x₁^{des}=1,u₀^{des}=0. La candidata u₀=x₁=.5 ha costo ½R·.25+½Q_T·.25; default=.25.

**formulas_to_show** (source = contenuto della fonte; correction/policy = F03; enrichment = aggiunta):

- source: \(\ell(\mathbf{x},\mathbf{u})=\sum_{t=0}^{T-1}\left[\frac12\|x_t-x_t^{\mathrm{des}}\|_Q^2+\frac12\|u_t-u_t^{\mathrm{des}}\|_R^2\right]+\frac12\|x_T-x_T^{\mathrm{des}}\|_{Q_T}^2\)
- source: \(\frac12\|x_t-x_t^{\mathrm{des}}\|_Q^2=\frac12(x_t-x_t^{\mathrm{des}})^\top Q(x_t-x_t^{\mathrm{des}})\)
- source: \(x_0=x^0\)
- enrichment: \(x_0^{\mathrm{des}}=x^0=0,\quad Q=0,\quad T=1\)

**worked_example — Esempio aggiunto:**
Enrichment con T=1: x⁰=0, x₀^{des}=0, x₁^{des}=1, u₀^{des}=0; dinamica x₁=x₀+u₀; Q=0,Q_T=1,R=1.

- Il desiderato (x₁^{des},u₀^{des})=(1,0) non rispetta la dinamica con x⁰=0.
- Costo ingresso: ½·0.5²=0.125.
- Costo terminale: ½(0.5−1)²=0.125.
- Costo totale della traiettoria candidata=0.25.

Limiti: Modello, pesi e valori sono enrichment; questa pagina non viene presentata come soluzione del problema completo.

**visualization:** Timeline candidato/desiderato e due barre costo; piccola nota vicino a x₀^{des}=x⁰. Gli slider dei pesi lasciano immutata la candidata.

**interaction:** Sì. Modificare R e Q_T mostra il compromesso nell'indice, mantenendo distinta la valutazione di una candidata dalla ricerca dell'ottimo.

**controls / expected_parameter_effects:**

| Controllo | Dominio; default; unità | Effetto osservabile |
| --- | --- | --- |
| R | [0.1, 5], passo indicativo 0.1; default 1; normalized weight | Aggiornare il contributo ½R(u₀−u₀^{des})² e il totale sulla candidata fissata. |
| Q_T | [0, 5], passo indicativo 0.1; default 1; normalized weight | Aggiornare il termine terminale e il totale, senza cambiare stati/ingressi candidati. |

Invarianti: Traiettoria candidata e riferimento fissi; Q=0 consentito come semidefinito; Nessuna garanzia che la candidata sia ottima; Range/default sono enrichment

**edge_cases:**

- Q o Q_T singolare: Alcune direzioni possono non essere penalizzate.
- Curva desiderata non fattibile: Mantenere il riferimento come obiettivo, senza imporlo come dinamica.
- R=0: Escluderlo dal controllo perché la pagina richiede R positiva definita.

**takeaway:** Un riferimento guida il costo; una traiettoria deve rispettare anche il modello.

**source_warning:** INFO_WARNING.
Avviso rosso vicino a default x₀des=x⁰: ⚠ Nota: negli esempi il riferimento iniziale coincide con x⁰.

**reusable_components:** EquationCard, StateInputTimeline, CostBreakdown, ParameterControl, InfoNote

**relation_to_previous_page:** Riprende Vincoli agli estremi e lungo il percorso. La pagina 21 dà vincoli espliciti: pesare una distanza nel costo non equivale a imporre un vincolo esatto.

**relation_to_next_page:** Prepara L'OCP discreto completo. La pagina 23 combina costi e vincoli nella formulazione completa, che resta più generale di questo esempio quadratico.

**estimated_density:** HIGH. Un focus, fino a tre idee, un esempio principale; formula e grafico condividono simboli e legenda.

**Layout:** WORKED_EXAMPLE; HEADER → EXPLANATION → FORMULA → MAIN_VISUAL → CONTROLS → WORKED_EXAMPLE → TAKEAWAY.

**Moduli matematici condivisi:** quadratic_cost, additive_cost, constraint_residuals

**Fonte e limiti:** Non chiamare traiettoria la curva desiderata senza verificarne la dinamica.; R>0 non basta da solo a garantire una soluzione unica per dinamiche o vincoli generali non lineari.; Non assegnare implicitamente un x_0^{des} assente dall'elenco: dichiararlo negli esempi.

**PAGE_SPEC:** [0022](../Data/documents/OPTCON-RL_introduction_optimal_control_2026_09_14--ae169f3492dc/pages/0022/page_spec.json).

### Pagina 23 — L'OCP discreto completo

**source_page:** 23; label PDF 22; mapping 1:1.

**learning_objective:** Riconoscere variabili, obiettivo e tre famiglie di vincoli.

**prerequisite:** Dinamica come uguaglianza; Costo additivo; End-point e path constraints

**key_ideas:** Dinamica, endpoint e path sono vincoli.; Lo stato iniziale può essere incluso in r.; L'esempio analitico vale solo per il suo modello.

**intuitive_explanation — enrichment:** La formulazione mette insieme ciò che finora abbiamo letto separatamente.

**mathematical_explanation:** Nell'esempio T=2,r=col(x₀,x₂−d_target), |u_t|≤b, costo ½(u₀²+u₁²). Se |d_target|≤2b: u₀=u₁=d_target/2, costo=d_target²/4; altrimenti infeasible.

**formulas_to_show** (source = contenuto della fonte; correction/policy = F03; enrichment = aggiunta):

- source: \(\begin{aligned}\min_{\substack{x_0,x_1,\ldots,x_T\\u_0,\ldots,u_{T-1}}}\;&\sum_{t=0}^{T-1}\ell_t(x_t,u_t)+\ell_T(x_T)\\\text{subj.to }&x_{t+1}=f_t(x_t,u_t),\quad t=0,\ldots,T-1\\&r(x_0,x_T)=0\\&g_t(x_t,u_t)\leq0,\quad t=0,\ldots,T-1\end{aligned}\)
- source: \(\ell_t:\mathbb{R}^n\times\mathbb{R}^m\to\mathbb{R},\quad\ell_T:\mathbb{R}^n\to\mathbb{R}\)
- enrichment: \(u_0^\star=u_1^\star=\frac{d_{\mathrm{target}}}{2},\quad\ell^\star=\frac{d_{\mathrm{target}}^2}{4}\quad\text{if }|d_{\mathrm{target}}|\le2b\)

**worked_example — Esempio aggiunto:**
Enrichment: T=2, x_{t+1}=x_t+u_t, r=col(x₀,x₂−1), |u_t|≤0.8, ℓ_t=½u_t², ℓ_T=0.

- Dinamica ed endpoint richiedono u₀+u₁=1.
- ½(u₀²+u₁²) è minimo con u₀=u₁=0.5.
- La soluzione rispetta |u_t|≤0.8.
- x₀=0,x₁=0.5,x₂=1 e costo=0.25.

Limiti: Soluzione analitica specifica dell'esempio, non algoritmo generale della fonte.

**visualization:** Formulazione suddivisa in decisioni, costo, dinamica, endpoint/path; sotto, timeline dell'unico esempio e stato di fattibilità.

**interaction:** Sì. Nel solo esempio chiuso si può mostrare come un vincolo renda il problema fattibile o impossibile.

**controls / expected_parameter_effects:**

| Controllo | Dominio; default; unità | Effetto osservabile |
| --- | --- | --- |
| d_{\mathrm{target}} | [-1.5, 1.5], passo indicativo 0.1; default 1; state unit | Ricalcolare u₀=u₁=d_target/2 quando ∣d_target∣≤2b, gli stati e il costo d_target²/4; altrimenti mostrare infeasibilità. |
| b | [0, 1], passo indicativo 0.05; default 0.8; input unit | Aggiornare la fattibilità ∣d_target∣≤2b; non tagliare semplicemente i controlli e dichiararli soluzione con endpoint soddisfatto. |

Invarianti: T=2 e dinamica integratore; Costo solo di sforzo; La formula chiusa non è estesa all'OCP generale

**edge_cases:**

- Target esattamente raggiungibile al limite: Accettare la soluzione sul bordo dei vincoli ≤.
- Problema infeasible: Non produrre un valore ottimo finito o una traiettoria etichettata ottima.
- Stato iniziale non fissato in un'altra istanza: Conservarlo come variabile della formulazione generale.

**takeaway:** Ottimo e fattibilità appartengono allo stesso problema.

**source_warning:** NO_WARNING.
Nessun avviso allo studente.

**reusable_components:** EquationCard, StateInputTimeline, ConstraintVisualizer, CostBreakdown, ParameterControl

**relation_to_previous_page:** Riprende Tracking: valutare una candidata. La pagina 22 fornisce un esempio di costo quadratico; qui ℓ_t e ℓ_T restano generali.

**relation_to_next_page:** Prepara Generare una traiettoria di uscita. La pagina 24 interpreta la ricerca di una traiettoria per un'uscita desiderata, prima di un problema più specifico.

**estimated_density:** HIGH. Un focus, fino a tre idee, un esempio principale; formula e grafico condividono simboli e legenda.

**Layout:** FORMULA_EXPLORER; HEADER → EXPLANATION → FORMULA → MAIN_VISUAL → CONTROLS → WORKED_EXAMPLE → TAKEAWAY.

**Moduli matematici condivisi:** closed_form_examples, constraint_residuals, horizon_indexing

**Fonte e limiti:** Non è scritta separatamente l'uguaglianza x₀=x⁰: non attribuirla come vincolo aggiuntivo letterale della pagina; può essere codificata in r.; Non sono garantite fattibilità, unicità, convessità o soluzione tramite un algoritmo specifico.; Lo schema non contiene automaticamente vincoli su x_T non inclusi in r.

**PAGE_SPEC:** [0023](../Data/documents/OPTCON-RL_introduction_optimal_control_2026_09_14--ae169f3492dc/pages/0023/page_spec.json).

### Pagina 24 — Generare una traiettoria di uscita

**source_page:** 24; label PDF 23; mapping 1:1.

**learning_objective:** Distinguere un percorso geometrico da una legge temporale.

**prerequisite:** Dinamica discreta e traiettoria; Uscita del sistema

**key_ideas:** y_t=h_t(x_t,u_t) è l'uscita di prestazione.; La candidata rispetta la dinamica.; ≈ non assegna da solo una metrica.

**intuitive_explanation — enrichment:** Dire dove passare non dice ancora quando arrivarci; un riferimento temporale pone entrambe le richieste.

**mathematical_explanation:** Integratore con y_t=x_t e limite aggiunto |u_t|≤1: y₁^{des}=2 è irrealizzabile in un passo; u₀=u₁=1 produce y₁=1,y₂=2.

**formulas_to_show** (source = contenuto della fonte; correction/policy = F03; enrichment = aggiunta):

- source: \(x_{t+1}=f_t(x_t,u_t),\quad t\in\mathbb{N}_0\)
- source: \(y_t=h_t(x_t,u_t),\quad t\in\mathbb{N}_0\)
- source: \(y_t\approx y_t^{\mathrm{des}},\quad t\in\mathbb{N}_0\)

**worked_example — Esempio aggiunto:**
Enrichment: x_{t+1}=x_t+u_t, y_t=x_t, x₀=0 e limite aggiunto |u_t|≤1; desiderare y₁=2.

- In un passo y₁≤1, quindi il salto desiderato non è esattamente realizzabile.
- Scegliendo u₀=u₁=1 si ottengono y₁=1,y₂=2.
- Questa è una candidata fattibile, non un ottimo: la pagina non ha assegnato un indice per confrontarla.

Limiti: Modello, limite e numeri sono enrichment; la fonte non fornisce questa istanza.

**visualization:** Grafico temporale statico di due passi con riferimento e candidata, ingresso allineato; accanto alla figura originale spiegare che il percorso blu non fornisce una legge di controllo.

**interaction:** Statica. Un confronto statico basta a chiarire il task; l'esplorazione di un ottimo è proposta nella pagina successiva con un costo esplicito.

**controls / expected_parameter_effects:**

Nessun controllo; nessun parametro dello studente da propagare.

**edge_cases:**

- h_t non iniettiva: Più coppie stato-ingresso possono produrre la stessa uscita; non dedurre un'unica traiettoria dal solo y^{des}.
- Desiderato irraggiungibile: Distinguere approssimazione dell'uscita e violazione della dinamica: la seconda non è ammessa.

**takeaway:** La generazione cerca una coppia stato–ingresso coerente, non soltanto una linea nello spazio.

**source_warning:** NO_WARNING.
Nessun avviso allo studente.

**reusable_components:** EquationCard, TimeSeriesPlot, StateInputTimeline

**relation_to_previous_page:** Riprende L'OCP discreto completo. La pagina 23 formula il controllo ottimo generale; questa pagina spiega il significato di un compito concreto.

**relation_to_next_page:** Prepara Tracking: ora scegliere la candidata. La pagina 25 assegna un costo quadratico e una condizione iniziale per la generazione di traiettoria.

**estimated_density:** MEDIUM. Un focus, fino a tre idee, un esempio principale; formula e grafico condividono simboli e legenda.

**Layout:** EXPLANATION; HEADER → EXPLANATION → MAIN_VISUAL → FORMULA → WORKED_EXAMPLE → TAKEAWAY.

**Moduli matematici condivisi:** scalar_dynamics

**Fonte e limiti:** Il simbolo ≈ non specifica metrica, tolleranza o esistenza di tracking esatto.; Non sono scritti vincoli di ostacolo o un modello di drone nella formulazione di questa pagina, pur essendo presenti nella figura.; Una legge temporale contiene quando raggiungere i punti, non solo la forma geometrica del percorso.; La fonte scrive t∈N₀; una finestra finita di visualizzazione sarebbe un enrichment.

**PAGE_SPEC:** [0024](../Data/documents/OPTCON-RL_introduction_optimal_control_2026_09_14--ae169f3492dc/pages/0024/page_spec.json).

### Pagina 25 — Tracking: ora scegliere la candidata

**source_page:** 25; label PDF 24; mapping 1:1.

**learning_objective:** Osservare un compromesso ottimo in un problema scalare chiuso.

**prerequisite:** OCP e tracking quadratico; Performance output

**key_ideas:** Si minimizza il costo rispettando la dinamica.; x₀=x⁰ è esplicito.; Il desiderato non diventa automaticamente fattibile.

**intuitive_explanation — enrichment:** Riprendi la candidata della pagina 22: ora il piccolo problema permette di scegliere l'ingresso che minimizza il costo.

**mathematical_explanation:** T=1,x⁰=0,Q=0,u₀^{des}=0,x₁^{des}=a. ℓ=½Ru₀²+½Q_T(u₀−a)²; u₀*=Q_T a/(R+Q_T), x₁*=u₀*. Non è un solver generale.

**formulas_to_show** (source = contenuto della fonte; correction/policy = F03; enrichment = aggiunta):

- source: \(\begin{aligned}\min_{\mathbf{x}\in\mathbb{R}^{nT},\mathbf{u}\in\mathbb{R}^{mT}}\;&\sum_{t=0}^{T-1}\left[\frac12\|x_t-x_t^{\mathrm{des}}\|_Q^2+\frac12\|u_t-u_t^{\mathrm{des}}\|_R^2\right]+\frac12\|x_T-x_T^{\mathrm{des}}\|_{Q_T}^2\\\text{subj.to }&x_{t+1}=f_t(x_t,u_t),\quad t=0,\ldots,T-1\\&x_0=x^0\end{aligned}\)
- source: \(y_t^{\mathrm{des}}=h_t(x_t^{\mathrm{des}},u_t^{\mathrm{des}}),\quad t\in\mathbb{N}_0\)
- enrichment: \(\ell(u_0)=\frac12Ru_0^2+\frac12Q_T(u_0-a)^2,\quad u_0^\star=\frac{Q_Ta}{R+Q_T}\)

**worked_example — Esempio aggiunto:**
Enrichment a un passo: x⁰=0, x₁=u₀, x₀^{des}=0,x₁^{des}=1,u₀^{des}=0, Q=0,R=1,Q_T=1.

- Il costo è ½u₀²+½(u₀−1)².
- Derivando nell'esempio: 2u₀−1=0.
- u₀*=x₁*=0.5, costo=0.25.
- La curva desiderata (1,0) non è dinamicamente coerente, mentre la soluzione sì.

Limiti: Istanza, derivata e soluzione sono enrichment; nessuna soluzione generale viene attribuita alla slide.

**visualization:** Grafico del costo in funzione di u₀ con minimo analitico, timeline ottima dell'esempio e due contributi. Confronto esplicito con 'candidata fissa' a pagina 22.

**interaction:** Sì. Qui il costo è esplicito: cambiare i pesi può ricalcolare davvero l'ottimo della sola istanza scalare, distinguendolo dalla rivalutazione fissa della pagina 22.

**controls / expected_parameter_effects:**

| Controllo | Dominio; default; unità | Effetto osservabile |
| --- | --- | --- |
| R | [0.1, 5], passo indicativo 0.1; default 1; normalized weight | Ricalcolare u₀*=Q_T a/(R+Q_T), x₁* e costo; aumentando R rispetto a Q_T si privilegia l'ingresso vicino a zero. |
| Q_T | [0, 5], passo indicativo 0.1; default 1; normalized weight | Ricalcolare soluzione e costo; con Q_T=0 si ottiene u₀*=0. |
| a | [-2, 2], passo indicativo 0.1; default 1; state unit | Cambiare x₁^{des}=a e ricalcolare soluzione, errore e costo; non modificare x⁰. |

Invarianti: Dinamica x₁=u₀ e T=1; Q=0; Formula chiusa valida solo per l'esempio; Range/default sono enrichment

**edge_cases:**

- R+Q_T=0 se si estendesse il dominio: La formula chiusa divide per zero; il controllo proposto lo evita imponendo R>0.
- Riferimento dinamicamente non fattibile: Non imporre simultaneamente x₁=1 e u₀=0 al modello x₁=u₀.

**takeaway:** Cambiare i pesi modifica la scelta ottima solo quando si risolve un problema.

**source_warning:** NO_WARNING.
Nessun avviso allo studente.

**reusable_components:** EquationCard, FunctionPlot, StateInputTimeline, CostBreakdown, ParameterControl

**relation_to_previous_page:** Riprende Generare una traiettoria di uscita. La pagina 24 chiede y≈y^{des}; qui si assegna un costo sulle curve stato-ingresso che producono il desiderato d'uscita.

**relation_to_next_page:** Prepara Drone planare: somma e differenza degli ingressi. La pagina 26 introduce una dinamica concreta di drone, ancora continua e da discretizzare.

**estimated_density:** HIGH. Un focus, fino a tre idee, un esempio principale; formula e grafico condividono simboli e legenda.

**Layout:** GRAPH_AND_CONTROLS; HEADER → EXPLANATION → FORMULA → MAIN_VISUAL → CONTROLS → WORKED_EXAMPLE → TAKEAWAY.

**Moduli matematici condivisi:** closed_form_examples, quadratic_cost

**Fonte e limiti:** Non sono presenti path constraints o endpoint terminali aggiuntivi nella formulazione di questa pagina.; Il legame tramite h_t non prova che una curva desiderata di stato-ingresso esista per ogni y^{des}, né che sia unica.; Non dichiarare che tracking perfetto o costo zero siano sempre realizzabili.; Non è assegnato un algoritmo di soluzione.

**PAGE_SPEC:** [0025](../Data/documents/OPTCON-RL_introduction_optimal_control_2026_09_14--ae169f3492dc/pages/0025/page_spec.json).

### Pagina 26 — Drone planare: somma e differenza degli ingressi

**source_page:** 26; label PDF 25; mapping 1:1.

**learning_objective:** Leggere l'effetto istantaneo di thrust e inclinazione.

**prerequisite:** Equazioni continue e performance output; Seno, coseno e accelerazione angolare

**key_ideas:** La somma agisce sulla traslazione.; La differenza agisce sull'accelerazione angolare.; L'uscita ha due coordinate.

**intuitive_explanation — enrichment:** Due spinte uguali evitano il momento netto; l'inclinazione ruota la direzione della forza totale.

**mathematical_explanation:** M=1,J=.02,L=.4,g=9.81 sono valori aggiunti. θ=0,u₁=u₂=4.905 annulla le accelerazioni; u₁=5,u₂=4 dà p̈_y=−.81, θ̈=10.

**formulas_to_show** (source = contenuto della fonte; correction/policy = F03; enrichment = aggiunta):

- source: \(\ddot p_x=-\frac{u_1+u_2}{M}\sin\theta\)
- source: \(\ddot p_y=\frac{u_1+u_2}{M}\cos\theta-g\)
- source: \(\ddot\theta=\frac{L}{2J}(u_1-u_2)\)
- source: \(y_t=\begin{bmatrix}p_{x,t}\\p_{y,t}\end{bmatrix},\quad t\in\mathbb{N}_0\)

**worked_example — Esempio aggiunto:**
Enrichment con interpretazioni fisiche convenzionali: M=1 kg, g=9.81 m/s², L=0.4 m, J=0.02 kg·m², θ=0, u₁=u₂=4.905 N.

- p̈_x=0 perché sin0=0.
- p̈_y=(4.905+4.905)−9.81=0.
- θ̈=0 perché u₁−u₂=0.
- Con u₁=5,u₂=4, θ̈=10 rad/s² e p̈_y=−0.81 m/s² nell'istante a θ=0.

Limiti: Valori, unità e interpretazioni dei parametri sono enrichment.; Accelerazione nulla è condizione di hover solo con velocità iniziali nulle; non è una prova di stabilità.

**visualization:** Schema planare con due frecce u₁,u₂ e vettore accelerazione; tre letture p̈_x,p̈_y,θ̈. Nota 2D vicino all'uscita. Nessuna evoluzione temporale prima della discretizzazione.

**interaction:** Sì. Modificare separatamente u₁,u₂ e θ mostra somma, differenza e proiezioni, senza fingere di aver risolto un tracking ottimo.

**controls / expected_parameter_effects:**

| Controllo | Dominio; default; unità | Effetto osservabile |
| --- | --- | --- |
| u_1 | [0, 10], passo indicativo 0.005; default 4.905; N | Ricalcolare entrambe le accelerazioni traslazionali e θ̈ con segno positivo nel termine u₁−u₂. |
| u_2 | [0, 10], passo indicativo 0.005; default 4.905; N | Ricalcolare la somma per la traslazione e il contributo negativo nella differenza angolare. |
| θ | [-1.0471975512, 1.0471975512], passo indicativo 0.01; default 0; rad | Ruotare il drone e aggiornare seno/coseno delle accelerazioni; θ̈ resta indipendente da θ a ingressi fissati in questo modello. |

Invarianti: Parametri M,J,L,g fissati ai valori enrichment; Calcolo istantaneo, senza integrazione o ottimizzazione; Nessuna terza coordinata introdotta; Range/default sono enrichment

**edge_cases:**

- M=0 o J=0: Valori non validi per le formule: escluderli se si aggiungono controlli sui parametri.
- Ingressi nulli: Non mantenere il drone fermo: p̈_y=−g.
- Thrust di equilibrio con velocità non nulle: Accelerazione nulla non equivale a posizione costante.

**takeaway:** Somma, differenza e assetto hanno effetti distinti.

**source_warning:** INFO_WARNING.
Avviso rosso vicino a uscita planare (p_x,p_y): ⚠ Nota: il modello usato qui è planare, in due dimensioni.

**reusable_components:** EquationCard, ModelDiagram, VectorVisualizer, ParameterControl, InfoNote

**relation_to_previous_page:** Riprende Tracking: ora scegliere la candidata. La pagina 25 formula il tracking su dinamica generica; qui si assegnano equazioni continue ma non ancora una f_t discreta.

**relation_to_next_page:** Prepara Drone: dal continuo ai passi di Euler. La pagina 27 introduce Euler e ordina lo stato in sei componenti; non anticipare quell'ordine come se fosse già scritto qui.

**estimated_density:** HIGH. Un focus, fino a tre idee, un esempio principale; formula e grafico condividono simboli e legenda.

**Layout:** FORMULA_EXPLORER; HEADER → EXPLANATION → FORMULA → MAIN_VISUAL → CONTROLS → WORKED_EXAMPLE → TAKEAWAY.

**Moduli matematici condivisi:** planar_drone

**Fonte e limiti:** Il modello esplicito è planare, non un modello completo 3D.; Il testo non fornisce valori, unità, saturazioni né definizioni dei parametri M,J,L,g; le interpretazioni fisiche e i numeri dell'esempio sono dichiarati enrichment.; Non sostituire la prima somma con −u₁+u₂: sarebbe un errore di lettura del text layer.; I limiti sono un obiettivo qualitativo, non disuguaglianze numeriche assegnate.

**PAGE_SPEC:** [0026](../Data/documents/OPTCON-RL_introduction_optimal_control_2026_09_14--ae169f3492dc/pages/0026/page_spec.json).

### Pagina 27 — Drone: dal continuo ai passi di Euler

**source_page:** 27; label PDF 26; mapping 1:1.

**learning_objective:** Leggere l'ordine dello stato e l'errore dovuto al passo.

**prerequisite:** Modello planare continuo; Notazione discreta e vettori

**key_ideas:** Il nuovo stato include x_t.; Le posizioni usano le velocità correnti.; δ cambia accuratezza e numero di campioni.

**intuitive_explanation — enrichment:** Euler usa la pendenza all'inizio di ogni passo; riducendo il passo si riduce l'errore di questo esempio.

**mathematical_explanation:** Caso verticale con θ=ω=0,u₁=u₂=6 e stato iniziale nullo: a_y=2.19. δ=.1: (p_y,v_y)₁=(0,.219), ₂=(.0219,.438); a 1 s: .9855 contro 1.095 continuo.

**formulas_to_show** (source = contenuto della fonte; correction/policy = F03; enrichment = aggiunta):

- source: \(x_{t+1}=\underbrace{x_t+\delta f_{\mathrm{CT}}(x_t,u_t,t)}_{f_t(x_t,u_t)}\)
- source: \(\delta>0\)
- source: \(x_t=\begin{bmatrix}p_{x,t}\\v_{x,t}\\p_{y,t}\\v_{y,t}\\\theta_t\\\omega_t\end{bmatrix}=\begin{bmatrix}x_{1,t}\\x_{2,t}\\x_{3,t}\\x_{4,t}\\x_{5,t}\\x_{6,t}\end{bmatrix},\qquad u_t=\begin{bmatrix}u_{1,t}\\u_{2,t}\end{bmatrix}\)
- enrichment: \(p_{y,t+1}=p_{y,t}+\delta v_{y,t},\quad v_{y,t+1}=v_{y,t}+\delta a_y,\quad a_y=2.19\)

**worked_example — Esempio aggiunto:**
Enrichment con M=1,g=9.81,u₁=u₂=6, θ=ω=0 e p_y=v_y=0 iniziali; accelerazione verticale costante 2.19. Scegliere δ=0.1 s.

- Primo passo Euler: p_{y,1}=0+0.1·0=0, v_{y,1}=0.219.
- Secondo passo: p_{y,2}=0.0219, v_{y,2}=0.438.
- Dopo 1 s e 10 passi: p_y=0.9855; soluzione continua=½·2.19·1²=1.095.

Limiti: Numeri e confronto con la soluzione continua sono enrichment.; Non è un risultato di ottimalità o una garanzia generale di stabilità di Euler.

**visualization:** Dizionario compatto x₁…x₆ e due tracce temporali quota/velocità; campioni Euler sovrapposti al riferimento analitico. Primi due aggiornamenti sotto il grafico. Durata fisica fissa di 1 s.

**interaction:** Sì. Un passo selezionabile rende visibile l'errore numerico e il significato di 'sufficientemente piccolo'.

**controls / expected_parameter_effects:**

| Controllo | Dominio; default; unità | Effetto osservabile |
| --- | --- | --- |
| δ | [0.01, 0.02, 0.05, 0.1, 0.2]; default 0.1; s | Ricalcolare il numero di passi per la durata fisica fissa di 1 s, i campioni Euler e l'errore finale rispetto alla soluzione continua. |

Invarianti: Durata fisica di 1 s e accelerazione 2.19; Ingressi uguali, quindi θ=ω=0; Ordine dello stato della fonte; Range/default sono enrichment

**edge_cases:**

- δ=0 o negativo: Escludere come passo non consentito.
- Passo grande: Mostrare possibile inaccuratezza senza promettere stabilità o fedeltà della traiettoria.
- Cambiare numero di passi confondendolo con durata: Mantenere fissa la durata fisica nel confronto di accuratezza.

**takeaway:** p_y è x₃; Euler non aggiunge ½δ²a alla posizione.

**source_warning:** NO_WARNING.
Nessun avviso allo studente.

**reusable_components:** EquationCard, VectorVisualizer, TimeSeriesPlot, ParameterControl

**relation_to_previous_page:** Riprende Drone planare: somma e differenza degli ingressi. La pagina 26 dà accelerazioni del drone: per Euler vanno interpretate in uno stato di primo ordine, chiarimento di enrichment.

**relation_to_next_page:** Prepara Drone: dai requisiti alle variabili. La pagina 28 descrive gli obiettivi di tracking per posizione, velocità, angolo, velocità angolare e ingressi.

**estimated_density:** HIGH. Un focus, fino a tre idee, un esempio principale; formula e grafico condividono simboli e legenda.

**Layout:** SIMULATION; HEADER → EXPLANATION → FORMULA → MAIN_VISUAL → CONTROLS → WORKED_EXAMPLE → TAKEAWAY.

**Moduli matematici condivisi:** planar_drone, discrete_step, horizon_indexing

**Fonte e limiti:** La fonte non assegna un valore a δ né una soglia quantitativa per 'sufficientemente piccolo'.; Forward Euler è un esempio, non l'unica discretizzazione consentita.; Non scambiare p_y=x₃ con x₂: l'ordine alterna posizione e velocità per asse.; Non includere automaticamente un termine ½δ²a nell'aggiornamento di posizione di forward Euler.

**PAGE_SPEC:** [0027](../Data/documents/OPTCON-RL_introduction_optimal_control_2026_09_14--ae169f3492dc/pages/0027/page_spec.json).

### Pagina 28 — Drone: dai requisiti alle variabili

**source_page:** 28; label PDF 27; mapping 1:1.

**learning_objective:** Collegare ogni requisito qualitativo al componente corretto.

**prerequisite:** Dizionario dello stato e degli ingressi del drone; Desiderato contro traiettoria realizzabile

**key_ideas:** Posizione: x₁,x₃.; Velocità: x₂,x₄.; Assetto, rotazione e ingressi non devono essere troppo grandi.

**intuitive_explanation — enrichment:** La stessa posizione non assicura lo stesso comportamento: contano anche quando ci arrivi e con quale velocità.

**mathematical_explanation:** La slide elenca desideri, non assegna pesi o limiti numerici; non introduce ancora esplicitamente θ^{des}=ω^{des}=0.

**formulas_to_show** (source = contenuto della fonte; correction/policy = F03; enrichment = aggiunta):

- source: \((p_{x,t}^{\mathrm{des}},p_{y,t}^{\mathrm{des}}),\quad t=1,\ldots,T\)
- source: \((v_{x,t}^{\mathrm{des}},v_{y,t}^{\mathrm{des}}),\quad t=1,\ldots,T\)
- source: \(\theta_t,\omega_t;\qquad u_{1,t},u_{2,t}\)

**worked_example — Esempio aggiunto:**
Enrichment concettuale: confrontare candidate con errori di posizione simili ma diversa velocità desiderata, oscillazione angolare e ampiezza degli ingressi.

- Valutare separatamente errore di posizione ed errore di velocità.
- Controllare anche θ,ω e ingressi.
- Per ordinarle serve una scelta esplicita di costo o vincoli, non presente in questa pagina.

Limiti: Non si afferma l'esistenza o fattibilità dinamica delle candidate senza verifica.; Nessun peso o soglia è attribuito alla fonte.

**visualization:** Stesso dizionario dello stato della pagina 27, arricchito da quattro righe requisito→variabili→domanda da valutare; confronto qualitativo di due candidate ipotetiche.

**interaction:** Statica. Qui i requisiti sono qualitativi; i controlli sui pesi sono progettati nella pagina 29, dove il costo è esplicito.

**controls / expected_parameter_effects:**

Nessun controllo; nessun parametro dello studente da propagare.

**edge_cases:**

- Peso elevato confuso con limite hard: Non anticipare che una grande penalità garantisca una soglia, che qui non è assegnata.
- Percorso geometrico senza velocità temporali: Evidenziare che il task richiede anche un profilo temporale e di velocità.

**takeaway:** Un requisito va tradotto in costo o vincolo prima di poterlo verificare quantitativamente.

**source_warning:** NO_WARNING.
Nessun avviso allo studente.

**reusable_components:** VectorVisualizer, ComparisonTable

**relation_to_previous_page:** Riprende Drone: dal continuo ai passi di Euler. La pagina 27 fissa l'ordine x=(p_x,v_x,p_y,v_y,θ,ω) che permette di associare i requisiti alle componenti.

**relation_to_next_page:** Prepara Drone: leggere ogni contributo al costo. La pagina 29 sceglie un costo diagonale che penalizza questi errori e valori; la presente pagina non assegna ancora i pesi.

**estimated_density:** MEDIUM. Un focus, fino a tre idee, un esempio principale; formula e grafico condividono simboli e legenda.

**Layout:** CONCEPT_SUMMARY; HEADER → EXPLANATION → FORMULA → MAIN_VISUAL → WORKED_EXAMPLE → TAKEAWAY.

**Moduli matematici condivisi:** Nessuno necessario.

**Fonte e limiti:** 'Not too high' non è un limite numerico né una disuguaglianza hard.; La pagina non assegna esplicitamente θ^{des}=ω^{des}=0: lo si riconoscerà dalla forma del costo nella pagina 29.; I requisiti non costituiscono da soli una soluzione o un algoritmo.

**PAGE_SPEC:** [0028](../Data/documents/OPTCON-RL_introduction_optimal_control_2026_09_14--ae169f3492dc/pages/0028/page_spec.json).

### Pagina 29 — Drone: leggere ogni contributo al costo

**source_page:** 29; label PDF 28; mapping 1:1.

**learning_objective:** Associare i pesi diagonali alle variabili senza alterare il riferimento degli ingressi.

**prerequisite:** Ordine esatto dello stato; Requisiti di tracking; Costo additivo e pesato

**key_ideas:** I primi quattro termini penalizzano errori di tracking.; θ,ω,u₁,u₂ sono penalizzati come valori.; Il terminale resta un termine distinto.

**intuitive_explanation — enrichment:** Il costo assegna prezzi diversi agli stessi scarti; un prezzo alto non impone una soglia rigida.

**mathematical_explanation:** Snapshot normalizzato: errori (1,0,0,0), θ=.1,ω=0,u₁=u₂=2; q₁=2,q₅=10,r₁=r₂=.5. Contributi 1,.05,1,1: stage cost=3.05.

**formulas_to_show** (source = contenuto della fonte; correction/policy = F03; enrichment = aggiunta):

- source: \(Q=\begin{bmatrix}q_1&&\\&\ddots&\\&&q_6\end{bmatrix},\quad Q_T=\begin{bmatrix}q_{T1}&&\\&\ddots&\\&&q_{T6}\end{bmatrix},\quad R=\begin{bmatrix}r_1&0\\0&r_2\end{bmatrix}\)
- source: \(\begin{aligned}\ell(\mathbf{x},\mathbf{u})=\sum_{t=0}^{T-1}\frac12\big[&q_1(x_{1,t}-p_{x,t}^{\mathrm{des}})^2+q_2(x_{2,t}-v_{x,t}^{\mathrm{des}})^2+q_3(x_{3,t}-p_{y,t}^{\mathrm{des}})^2+q_4(x_{4,t}-v_{y,t}^{\mathrm{des}})^2\\&+q_5x_{5,t}^2+q_6x_{6,t}^2+r_1u_{1,t}^2+r_2u_{2,t}^2\big]+\frac12\|x_T-x_T^{\mathrm{des}}\|_{Q_T}^2\end{aligned}\)

**worked_example — Esempio aggiunto:**
Enrichment su un singolo stadio normalizzato: errori delle prime quattro componenti (1,0,0,0), x₅=0.1,x₆=0, u₁=u₂=2; q₁=2,q₅=10,r₁=r₂=0.5 e altri q=1.

- Posizione orizzontale: ½·2·1²=1.
- Angolo: ½·10·0.1²=0.05.
- Ciascun ingresso: ½·0.5·2²=1.
- Gli altri contributi sono zero; stage cost=3.05.

Limiti: Valori e normalizzazione sono enrichment.; Il singolo punto non è certificato come parte di una traiettoria dinamicamente ammissibile.

**visualization:** Otto barre per i sei termini di stato e due ingressi, raggruppate in tracking/assetto/ingressi. Formula completa e terminale simbolico separato, escluso dal totale di questo singolo stadio.

**interaction:** Sì. Variare pochi pesi sulla stessa candidata chiarisce le priorità e la differenza fra penalità e vincolo.

**controls / expected_parameter_effects:**

| Controllo | Dominio; default; unità | Effetto osservabile |
| --- | --- | --- |
| q_1 | [0, 10], passo indicativo 0.1; default 2; normalized weight | Aggiornare solo la barra ½q₁·1² e il totale; non spostare il drone né dichiarare un nuovo ottimo. |
| q_5 | [0, 20], passo indicativo 0.1; default 10; normalized weight | Aggiornare solo ½q₅·0.1² e il totale; x₅ resta invariato. |
| r_1 | [0.01, 2], passo indicativo 0.01; default 0.5; normalized weight | Aggiornare ½r₁·2² e il totale, mantenendo u₁ fissato. |
| r_2 | [0.01, 2], passo indicativo 0.01; default 0.5; normalized weight | Aggiornare ½r₂·2² e il totale senza rinominare r₂ come r₁. |

Invarianti: Tutte le componenti candidate fisse; Nessuna saturazione aggiunta; Nessun ottimizzatore eseguito; Pesi non controllati restano ai valori dichiarati dell'esempio

**edge_cases:**

- Errore nullo in una componente: Cambiarne il peso non cambia il costo della candidata.
- Angolo grande con peso piccolo: Può avere un contributo piccolo senza rispettare eventuali limiti hard.
- Hover con ingressi non nulli: La penalità sugli ingressi può essere positiva anche quando la forza bilancia la gravità.

**takeaway:** Valutiamo uno snapshot fisso; i pesi non ricalcolano una traiettoria ottima.

**source_warning:** NO_WARNING.
Nessun avviso allo studente.

**reusable_components:** EquationCard, VectorVisualizer, CostBreakdown, ParameterControl

**relation_to_previous_page:** Riprende Drone: dai requisiti alle variabili. La pagina 28 elenca posizione, velocità, angoli e ingressi; qui viene assegnata la forma del costo.

**relation_to_next_page:** Prepara Drone: vincoli hard e indici corretti. La pagina 30 distingue i limiti espliciti di path dalle penalizzazioni di questa pagina.

**estimated_density:** HIGH. Un focus, fino a tre idee, un esempio principale; formula e grafico condividono simboli e legenda.

**Layout:** WORKED_EXAMPLE; HEADER → EXPLANATION → FORMULA → MAIN_VISUAL → CONTROLS → WORKED_EXAMPLE → TAKEAWAY.

**Moduli matematici condivisi:** quadratic_cost, additive_cost

**Fonte e limiti:** La slide non assegna valori numerici ai pesi.; Penalizzare u₁,u₂ rispetto a zero non equivale a penalizzare deviazioni da una spinta di hover; non sostituire i termini con u−u_hover.; Non viene garantito che pesi grandi rispettino soglie hard.; Il terminal target x_T^{des} resta generale; non imporre componenti terminali aggiuntive non specificate.

**PAGE_SPEC:** [0029](../Data/documents/OPTCON-RL_introduction_optimal_control_2026_09_14--ae169f3492dc/pages/0029/page_spec.json).

### Pagina 30 — Drone: vincoli hard e indici corretti

**source_page:** 30; label PDF 29; mapping 1:1.

**learning_objective:** Verificare quota e saturazioni sugli istanti appropriati.

**prerequisite:** Path constraints; Ordine dello stato del drone; Penalità di costo

**key_ideas:** Ingressi: t=0,…,T−1.; Quote previste: t=1,…,T.; p_y=x₃; il bordo è incluso.

**intuitive_explanation — enrichment:** La fascia ammissibile esclude una quota, anche se il suo costo fosse basso.

**mathematical_explanation:** Usare i due domini temporali corretti. Nel controllo puntuale p_y^{min}=1,p_y^{max}=3: p_y=2 ammissibile; 3.2 viola di .2; 3 è sul bordo.

**formulas_to_show** (source = contenuto della fonte; correction/policy = F03; enrichment = aggiunta):

- correction: \(u_t^{\min}\leq u_t\leq u_t^{\max},\quad t=0,\ldots,T-1;\qquad p_{y,t}^{\min}\leq p_{y,t}\leq p_{y,t}^{\max},\quad t=1,\ldots,T\)
- enrichment: \(p_{y,t}=x_{3,t},\quad r_{\min}=p_y^{\min}-p_y,\quad r_{\max}=p_y-p_y^{\max}\)

**worked_example — Esempio aggiunto:**
Enrichment a un istante di stato previsto t∈{1,…,T}: p_y^{min}=1,p_y^{max}=3; confrontare p_y=2 con p_y=3.2.

- p_y=2 è compreso fra i limiti.
- p_y=3.2 viola il limite superiore di 0.2.
- Il bordo p_y=3 è ammissibile perché ≤ è non stretta.

Limiti: Limiti e valori sono enrichment.; Verifica puntuale, non certificazione di una traiettoria o di assenza di collisioni.

**visualization:** Banda di quota e punto centro di massa, residui min−p_y e p_y−max; timeline statica T=3 con u₀,u₁,u₂ e quote x₃,₁,x₃,₂,x₃,₃. Seconda riga statica di saturazione u∈[0,6]² con u=(5,4). Warning presso i domini corretti.

**interaction:** Sì. Spostare stato e limiti chiarisce inclusione del bordo, violazione e vincoli incompatibili senza una simulazione dinamica.

**controls / expected_parameter_effects:**

| Controllo | Dominio; default; unità | Effetto osservabile |
| --- | --- | --- |
| p_y^{min} | [0, 4], passo indicativo 0.1; default 1; m | Muovere il bordo inferiore, ricalcolare appartenenza e violazione; se supera il massimo, mostrare banda vuota. |
| p_y^{max} | [0, 4], passo indicativo 0.1; default 3; m | Muovere il bordo superiore e aggiornare lo stato di ammissibilità. |
| p_y | [0, 4], passo indicativo 0.1; default 2; m | Spostare il centro di massa e aggiornare i residui min−p_y e p_y−max. |

Invarianti: Istante di stato t∈{1,…,T}; Ingressi indicizzati 0,…,T−1, senza u_T; p_y=x₃; Nessuna integrazione del drone; Range/default sono enrichment

**edge_cases:**

- min=max: Il centro di massa deve coincidere con la quota unica.
- min>max: Insieme ammissibile vuoto.
- Vincoli soddisfatti ai campioni: Non dichiarare sicurezza fra campioni senza un controllo ulteriore, non trattato dalla fonte.
- Centro di massa entro limiti: Non certifica che tutto l'ingombro del drone sia lontano dagli ostacoli.

**takeaway:** Una penalità preferisce; un vincolo hard ammette o esclude.

**source_warning:** CORRECTION_WARNING.
Avviso rosso vicino a due domini temporali dei vincoli: ⚠ Warning: possibile errore nella slide originale. Gli ingressi usano t=0,…,T−1; le quote t=1,…,T.

**reusable_components:** EquationCard, ConstraintVisualizer, StateInputTimeline, ParameterControl, WarningBanner

**relation_to_previous_page:** Riprende Drone: leggere ogni contributo al costo. La pagina 29 può scoraggiare valori elevati ma non impone i limiti di questa pagina.

**relation_to_next_page:** Prepara Continuo: un costo sulle funzioni. La pagina 31 passa al controllo ottimo continuo e introduce un funzionale su uno spazio di funzioni.

**estimated_density:** HIGH. Un focus, fino a tre idee, un esempio principale; formula e grafico condividono simboli e legenda.

**Layout:** GRAPH_AND_CONTROLS; HEADER → EXPLANATION → FORMULA → MAIN_VISUAL → CONTROLS → WORKED_EXAMPLE → TAKEAWAY.

**Moduli matematici condivisi:** constraint_residuals, horizon_indexing

**Fonte e limiti:** La fonte non fornisce numeri per i limiti.; Il range temporale 1,…,T scritto nella prosa non coincide con 0,…,T−1 usato prima per gli ingressi; non inventare u_T.; Un semplice limite su p_y non rappresenta tutte le possibili collisioni o la geometria completa del drone.

**PAGE_SPEC:** [0030](../Data/documents/OPTCON-RL_introduction_optimal_control_2026_09_14--ae169f3492dc/pages/0030/page_spec.json).

### Pagina 31 — Continuo: un costo sulle funzioni

**source_page:** 31; label PDF 30; mapping 1:1.

**learning_objective:** Leggere un funzionale, il suo integrale e il termine terminale.

**prerequisite:** ODE e uscita di stato; OCP discreto; Integrale e funzione di una funzione

**key_ideas:** Le decisioni sono funzioni.; Il running cost è integrato.; 𝓣 raccoglie le coppie che rispettano la dinamica.

**intuitive_explanation — enrichment:** Una coppia di curve viene trasformata in un numero: questo è il ruolo del funzionale.

**mathematical_explanation:** Nella famiglia aggiunta ẋ=u,x(0)=0,u(t)=c,x(t)=ct, ℓ_τ=½u², ℓ_T=½x(T)²: costo=½c²T+½c²T².

**formulas_to_show** (source = contenuto della fonte; correction/policy = F03; enrichment = aggiunta):

- source: \(\dot x(t)=f_t(x(t),u(t)),\ t\in[0,T];\quad r(x(0),x(T))=0;\quad g_t(x(t),u(t))\leq0,\ t\in[0,T)\)
- source: \(\ell:\mathcal F\to\mathbb R,\qquad\ell(x(\cdot),u(\cdot))=\int_0^T\ell_\tau(x(\tau),u(\tau))\,d\tau+\ell_T(x(T))\)
- policy_clarification: \(\mathcal T=\{(x(\cdot),u(\cdot))\in\mathcal F\mid\dot x(t)=f_t(x(t),u(t)),\ t\in[0,T]\}\)
- enrichment: \(u(t)=c,\quad x(t)=ct,\quad\ell=\frac12c^2T+\frac12c^2T^2\)

**worked_example — Esempio aggiunto:**
Enrichment: ẋ=u, x(0)=0, T=1, u(t)=1 e x(t)=t; ℓ_τ=½u², ℓ_T=½x(T)².

- La coppia soddisfa ẋ=u.
- Integrale di ½ su [0,1]: 0.5.
- Terminale: ½·1²=0.5.
- Il funzionale restituisce 1.

Limiti: Dinamica, condizione iniziale, funzioni di costo e numeri sono enrichment.

**visualization:** Tracce x/u e area del running cost, con barra terminale separata; riquadro dei domini: dinamica [0,T], path [0,T). Nessuna nota sulle parentesi tipografiche.

**interaction:** Sì. Una famiglia semplice permette di osservare come cambiano le funzioni e il loro costo, senza chiamarla l'intero spazio 𝓕.

**controls / expected_parameter_effects:**

| Controllo | Dominio; default; unità | Effetto osservabile |
| --- | --- | --- |
| c | [-2, 2], passo indicativo 0.1; default 1; state unit/s | Ricalcolare u(t)=c, x(t)=ct, integrale ½c²T e terminale ½c²T². |
| T | [0.5, 3], passo indicativo 0.1; default 1; s | Cambiare intervallo temporale, stato finale, area e termine terminale mantenendo la stessa legge d'ingresso. |

Invarianti: Solo una sott famiglia di funzioni è esplorata; Nessuna ottimizzazione generale; La dinamica e i costi numerici sono enrichment

**edge_cases:**

- Violazione della dinamica: La coppia non appartiene a 𝓣, anche se il costo è valutabile.
- Path constraint al tempo terminale: Non includerlo automaticamente quando il dominio stampato è [0,T).
- Funzionale non finito: L'appartenenza a un generico spazio di funzioni non garantisce integrabilità; la fonte non specifica i dettagli.

**takeaway:** Orizzonte finito e variabili funzionali sono concetti diversi.

**source_warning:** NO_WARNING.
Nessun avviso allo studente.

**reusable_components:** EquationCard, TimeSeriesPlot, CostBreakdown, ParameterControl

**relation_to_previous_page:** Riprende Drone: vincoli hard e indici corretti. La pagina 30 conclude i path constraints discreti; qui i domini temporali sono intervalli reali.

**relation_to_next_page:** Prepara Perché il problema è infinito-dimensionale?. La pagina 32 trascura path e terminal constraints e usa l'appartenenza a 𝓣 per scrivere il problema compatto.

**estimated_density:** HIGH. Un focus, fino a tre idee, un esempio principale; formula e grafico condividono simboli e legenda.

**Layout:** SIMULATION; HEADER → EXPLANATION → FORMULA → MAIN_VISUAL → CONTROLS → WORKED_EXAMPLE → TAKEAWAY.

**Moduli matematici condivisi:** continuous_functional

**Fonte e limiti:** La fonte non specifica regolarità, norma o topologia di 𝓕; non assumere che trajectory manifold sia una dimostrazione di struttura differenziabile.; L'intervallo dei path constraints è [0,T), distinto da [0,T] della dinamica.; Le parentesi in più vengono conservate e segnalate, senza cambiare i simboli della formula.; Tempo finale T e insieme 𝓣 non sono lo stesso oggetto.

**PAGE_SPEC:** [0031](../Data/documents/OPTCON-RL_introduction_optimal_control_2026_09_14--ae169f3492dc/pages/0031/page_spec.json).

### Pagina 32 — Perché il problema è infinito-dimensionale?

**source_page:** 32; label PDF 31; mapping 1:1.

**learning_objective:** Distinguere il problema sulle funzioni da una parametrizzazione finita.

**prerequisite:** Funzionale e insieme delle traiettorie; Vettore finito contro funzione

**key_ideas:** Su [0,T] si sceglie una funzione intera.; K coefficienti descrivono solo una sottofamiglia.; Rimuovere vincoli terminali non rimuove il terminal cost.

**intuitive_explanation — enrichment:** Fissare due valori costanti dell'ingresso è una scelta finita dentro uno spazio molto più ricco.

**mathematical_explanation:** Esempio statico ẋ=u,x(0)=0,T=2: u=1 su [0,1), u=−1 su [1,2]; x va 0→1→0. Due coefficienti non rappresentano tutto 𝓕.

**formulas_to_show** (source = contenuto della fonte; correction/policy = F03; enrichment = aggiunta):

- source: \(\begin{aligned}\min_{(x(\cdot),u(\cdot))\in\mathcal F}\;&\ell(x(\cdot),u(\cdot))\\\text{subj.to }&(x(\cdot),u(\cdot))\in\mathcal T\end{aligned}\)

**worked_example — Esempio aggiunto:**
Enrichment: ẋ=u,x(0)=0 su [0,2]; restringere u a due tratti costanti, u=1 su [0,1), u=−1 su [1,2].

- Integrare la dinamica: x sale da 0 a 1 e poi ritorna a 0.
- Questa coppia appartiene all'insieme dinamico dell'esempio.
- I due coefficienti descrivono solo una sott famiglia finita, non tutte le funzioni ammesse dal problema generale.

Limiti: Modello e parametrizzazione sono enrichment.; Non è una dimostrazione di convergenza di una discretizzazione.

**visualization:** Confronto fra funzioni generali e parametrizzazione a due tratti; tracce statiche u/x con numero di coefficienti esplicito. Nessuno slider K: il confronto basta al concetto.

**interaction:** Statica. Confronto statico sufficiente a distinguere dimensione finita e spazio di funzioni; eliminata la proposta di slider K per non ripetere un laboratorio numerico senza necessità.

**controls / expected_parameter_effects:**

Nessun controllo; nessun parametro dello studente da propagare.

**edge_cases:**

- T finito: Il problema originale resta di dimensione infinita.
- K finito molto grande: Rimane una parametrizzazione finita; non attribuire accuratezza o ottimalità senza analisi.
- Terminal cost presente: Non confonderlo con un terminal constraint trascurato.

**takeaway:** Infinito-dimensionale non significa tempo finale infinito.

**source_warning:** NO_WARNING.
Nessun avviso allo studente.

**reusable_components:** EquationCard, ComparisonTable, TimeSeriesPlot

**relation_to_previous_page:** Riprende Continuo: un costo sulle funzioni. La pagina 31 definisce 𝓕, ℓ e 𝓣; senza quelle definizioni la formula compatta non è autosufficiente.

**relation_to_next_page:** Prepara Pendolo: angolo, velocità, coppia. La pagina 33 fornisce il modello continuo di un pendolo per un esempio di generazione di traiettoria.

**estimated_density:** MEDIUM. Un focus, fino a tre idee, un esempio principale; formula e grafico condividono simboli e legenda.

**Layout:** COMPARISON; HEADER → EXPLANATION → FORMULA → MAIN_VISUAL → WORKED_EXAMPLE → TAKEAWAY.

**Moduli matematici condivisi:** continuous_functional

**Fonte e limiti:** Trascurare terminal constraints non significa rimuovere il terminal cost dal funzionale.; Infinito-dimensionale non significa orizzonte T infinito: anche su un intervallo finito si scelgono funzioni.; La fonte non specifica una parametrizzazione finita o un algoritmo numerico.; La formula compatta non mostra una condizione iniziale separata; non aggiungerla come se fosse stampata.

**PAGE_SPEC:** [0032](../Data/documents/OPTCON-RL_introduction_optimal_control_2026_09_14--ae169f3492dc/pages/0032/page_spec.json).

### Pagina 33 — Pendolo: angolo, velocità, coppia

**source_page:** 33; label PDF 32; mapping 1:1.

**learning_objective:** Passare dalla derivata seconda al modello a due stati.

**prerequisite:** ODE e rappresentazione di stato; Seno, coppia e accelerazione angolare

**key_ideas:** x₁ rappresenta θ, x₂ la sua velocità.; La gravità dipende da sinθ.; L'ingresso è la coppia.

**intuitive_explanation — enrichment:** La stessa coppia ha un effetto diverso secondo l'angolo, perché cambia il contributo della gravità.

**mathematical_explanation:** Con un solo parametro di lunghezza l≡ℓ=1, massa m=1,g=9.81: ẋ₂=−9.81sinθ+u. A θ=π/6,u=0: −4.905; u=4.905 annulla solo l'accelerazione.

**formulas_to_show** (source = contenuto della fonte; correction/policy = F03; enrichment = aggiunta):

- source: \(\ddot\theta=-\frac{g}{l}\sin\theta+\frac{1}{m\ell^2}\tau\)
- source: \(\dot x_1=x_2,\qquad\dot x_2=-\frac{g}{l}\sin x_1+\frac{1}{m\ell^2}u\)
- source: \(y=\theta\)
- enrichment: \(x_1=\theta,\quad x_2=\dot\theta,\quad u=\tau\)

**worked_example — Esempio aggiunto:**
Enrichment: assumere l=ℓ=1 m, m=1 kg, g=9.81 m/s²; θ=π/6, u=0.

- sin(π/6)=0.5.
- ẋ₂=−9.81·0.5=−4.905 rad/s².
- Con u=4.905 l'accelerazione istantanea si annulla.

Limiti: Valori, unità e identificazioni l=ℓ,m=M sono enrichment.; Accelerazione nulla da sola non certifica equilibrio o stabilità.

**visualization:** Schema angolo/coppia e FunctionPlot di ẋ₂ contro θ in [−π,π], punto corrente. Lettura ẋ₁=x₂ con velocità dell'istantanea fissata a zero. Nessun attrito o piccolo angolo.

**interaction:** Sì. Muovere angolo e coppia mostra il ruolo del seno senza anticipare un ottimizzatore o una linearizzazione non scritta.

**controls / expected_parameter_effects:**

| Controllo | Dominio; default; unità | Effetto osservabile |
| --- | --- | --- |
| θ | [-3.1415926536, 3.1415926536], passo indicativo 0.01; default 0.5235987755982988; rad | Ruotare il disegno e aggiornare −9.81sinθ+u; mantenere il modello non lineare. |
| u | [-12, 12], passo indicativo 0.005; default 0; N m | Aggiornare l'accelerazione con contributo additivo u e la freccia di coppia. |

Invarianti: l=ℓ=1,m=1,g=9.81 come enrichment; Calcolo istantaneo, non integrazione temporale; Nessuno smorzamento aggiunto; Range/default sono enrichment

**edge_cases:**

- l=0,ℓ=0 o m=0: Parametri non validi per le formule, da escludere nei futuri controlli.
- Seno nullo: Non dedurre stabilità dalla sola accelerazione gravitazionale nulla.
- Velocità non nulla con accelerazione zero: La configurazione non è un equilibrio del sistema a due stati.

**takeaway:** Accelerazione nulla richiede anche velocità nulla per definire un equilibrio.

**source_warning:** NO_WARNING.
Nessun avviso allo studente.

**reusable_components:** EquationCard, ModelDiagram, FunctionPlot, ParameterControl

**relation_to_previous_page:** Riprende Perché il problema è infinito-dimensionale?. La pagina 32 spiega la formulazione su funzioni; qui si assegna una dinamica non lineare specifica.

**relation_to_next_page:** Prepara Pendolo: due coppie di equilibrio. La pagina 34 cerca coppie di equilibrio e pone il trasferimento fra due di esse.

**estimated_density:** MEDIUM. Un focus, fino a tre idee, un esempio principale; formula e grafico condividono simboli e legenda.

**Layout:** GRAPH_AND_CONTROLS; HEADER → EXPLANATION → FORMULA → MAIN_VISUAL → CONTROLS → WORKED_EXAMPLE → TAKEAWAY.

**Moduli matematici condivisi:** pendulum_model

**Fonte e limiti:** La fonte non include smorzamento, attrito, saturazioni o valori numerici.; Le identificazioni x₁=θ,x₂=θ̇,u=τ seguono dal confronto delle rappresentazioni, ma non sono stampate come tre uguaglianze separate.; L'uso l/ℓ e m/M è conservato; per i calcoli aggiunti si dichiarano le identificazioni necessarie.; Nessuna stabilità o linearizzazione sinθ≈θ è affermata in questa pagina.

**PAGE_SPEC:** [0033](../Data/documents/OPTCON-RL_introduction_optimal_control_2026_09_14--ae169f3492dc/pages/0033/page_spec.json).

### Pagina 34 — Pendolo: due coppie di equilibrio

**source_page:** 34; label PDF 33; mapping 1:1.

**learning_objective:** Determinare ingresso e velocità per un angolo di equilibrio.

**prerequisite:** Equilibrio come stato e ingresso costanti; Dinamica e identificazione dello stato del pendolo

**key_ideas:** La velocità di equilibrio è x₂,e=0.; u_e bilancia la gravità.; Definire gli estremi non costruisce il trasferimento.

**intuitive_explanation — enrichment:** L'angolo può essere diverso da zero se una coppia costante sostiene il pendolo.

**mathematical_explanation:** Usare 0=x₂,e e u_e=mgℓsinθ_e con l≡ℓ. Per θ_e¹=0,θ_e²=π/6: u_e¹=0,u_e²=4.905; entrambe le componenti dinamiche sono nulle.

**formulas_to_show** (source = contenuto della fonte; correction/policy = F03; enrichment = aggiunta):

- source: \(0=-\frac{g}{l}\sin x_{1,e}+\frac{1}{m\ell^2}u_e\)
- source: \(x_e^1=\begin{bmatrix}\theta_e^1\\0\end{bmatrix},\qquad u_e^1=mg\ell\sin\theta_e^1\)
- correction: \(0=x_{2,e}\)
- enrichment: \(x_e^2=\operatorname{col}(\theta_e^2,0),\quad u_e^2=mg\ell\sin\theta_e^2\)

**worked_example — Esempio aggiunto:**
Enrichment con l=ℓ=1,m=1,g=9.81: θ_e¹=0 e θ_e²=π/6.

- Prima coppia: x_e¹=(0,0), u_e¹=0.
- Seconda coppia: x_e²=(π/6,0), u_e²=4.905.
- Per entrambe ẋ₁=0 e ẋ₂=0; la velocità di equilibrio è x₂,e=0.

Limiti: Valori e identificazione l=ℓ sono enrichment.; Non è una costruzione del trasferimento o una prova di stabilità.

**visualization:** Due configurazioni statiche affiancate con angolo/coppia e due residui per ciascuna. Warning rosso adiacente a x₂,e=0; nessuna animazione di trasferimento o confronto con il residuo errato.

**interaction:** Sì. Mostrare come l'angolo scelto determina la coppia che annulla l'accelerazione con velocità nulla.

**controls / expected_parameter_effects:**

| Controllo | Dominio; default; unità | Effetto osservabile |
| --- | --- | --- |
| θ_e^1 | [-1.5707963268, 1.5707963268], passo indicativo 0.01; default 0; rad | Aggiornare la prima configurazione, u_e¹=9.81sinθ_e¹ e i residui delle due equazioni dinamiche corrette, con x₂,e=0. |
| θ_e^2 | [-1.5707963268, 1.5707963268], passo indicativo 0.01; default 0.5235987755982988; rad | Aggiornare la seconda configurazione e u_e²=9.81sinθ_e²; non animare ancora un trasferimento. |

Invarianti: l=ℓ=1,m=1,g=9.81 come enrichment; Velocità di equilibrio zero; Nessuna traiettoria intermedia o stabilità garantita; Range/default sono enrichment

**edge_cases:**

- Due equilibri coincidenti: Il trasferimento è degenere e può essere la traiettoria costante.
- Angolo con coppia richiesta oltre un limite aggiunto: Non considerarlo automaticamente raggiungibile con attuatori saturi; la fonte qui non impone tali limiti.
- Equilibrio instabile: Può ancora soddisfare le equazioni di equilibrio.

**takeaway:** Gli equilibri definiscono gli estremi del task; il moto intermedio resta da scegliere.

**source_warning:** CORRECTION_WARNING.
Avviso rosso vicino a condizione x₂,e=0: ⚠ Warning: possibile errore nella slide originale. La condizione di equilibrio corretta è x₂,e=0.

**reusable_components:** EquationCard, ModelDiagram, ComparisonTable, ParameterControl, WarningBanner

**relation_to_previous_page:** Riprende Pendolo: angolo, velocità, coppia. La pagina 33 dà ẋ₁=x₂: all'equilibrio questa equazione impone x₂,e=0, in contrasto con la prima riga qui stampata.

**relation_to_next_page:** Prepara Desiderato a gradino: un obiettivo, non un moto. La pagina 35 usa i due equilibri per una curva desiderata a gradino, dichiaratamente non una traiettoria.

**estimated_density:** HIGH. Un focus, fino a tre idee, un esempio principale; formula e grafico condividono simboli e legenda.

**Layout:** COMPARISON; HEADER → EXPLANATION → FORMULA → MAIN_VISUAL → CONTROLS → WORKED_EXAMPLE → TAKEAWAY.

**Moduli matematici condivisi:** pendulum_model, constraint_residuals

**Fonte e limiti:** Non correggere silenziosamente 0=x_{1,e} in 0=x_{2,e}.; La formula u_e=mgℓsinθ_e è coerente con la dinamica se l e ℓ sono identificati; la fonte alterna i glifi.; Non sono specificati angoli numerici, durata, vincoli d'ingresso, traiettoria di trasferimento o stabilità degli equilibri.

**PAGE_SPEC:** [0034](../Data/documents/OPTCON-RL_introduction_optimal_control_2026_09_14--ae169f3492dc/pages/0034/page_spec.json).

### Pagina 35 — Desiderato a gradino: un obiettivo, non un moto

**source_page:** 35; label PDF 34; mapping 1:1.

**learning_objective:** Leggere il riferimento e capire perché non è una traiettoria.

**prerequisite:** Coppie di equilibrio del pendolo; Curva desiderata contro traiettoria; Funzione a tratti e continuità delle soluzioni ODE ordinarie

**key_ideas:** Il secondo ramo include T/2.; x₂^{des}=0 nei due intervalli.; Un salto di angolo fra equilibri distinti non è un moto del modello.

**intuitive_explanation — enrichment:** Il riferimento dice di cambiare obiettivo a metà intervallo; il sistema deve compiere un trasferimento reale.

**mathematical_explanation:** Riutilizzare u_e^i=mgℓsinθ_e^i di pagina 34. T=2,angoli 0 e π/6: a t=1 il desiderato passa al secondo equilibrio. Se coincidono il riferimento diventa costante.

**formulas_to_show** (source = contenuto della fonte; correction/policy = F03; enrichment = aggiunta):

- source: \(x_1^{\mathrm{des}}(t)=\begin{cases}\theta_e^1&0\leq t<T/2\\\theta_e^2&T/2\leq t\leq T\end{cases},\qquad x_2^{\mathrm{des}}(t)=0\)
- source: \(u^{\mathrm{des}}(t)=\begin{cases}u_e^1&0\leq t<T/2\\u_e^2&T/2\leq t\leq T\end{cases}\)

**worked_example — Esempio aggiunto:**
Enrichment con T=2 s, θ_e¹=0,θ_e²=π/6, l=ℓ=m=1,g=9.81; livelli di ingresso 0 e 4.905.

- Per 0≤t<1: x₁^{des}=0,u^{des}=0.
- A t=1 e fino a 2: x₁^{des}=π/6,u^{des}=4.905.
- x₂^{des}=0 in entrambi i rami.
- Il salto di angolo non è una traiettoria della dinamica; serve una traiettoria effettiva diversa.

Limiti: Numeri, unità e interpretazione l=ℓ sono enrichment.; Non è stata calcolata una traiettoria ottima.

**visualization:** Due TimeSeriesPlot allineati per angolo e coppia desiderati; marker aperto sul primo ramo e chiuso sul secondo. Etichetta 'riferimento' e nessun corpo animato che salta.

**interaction:** Sì. Cambiare livelli e tempo rende evidente che si modifica un obiettivo, non si produce automaticamente un moto del sistema.

**controls / expected_parameter_effects:**

| Controllo | Dominio; default; unità | Effetto osservabile |
| --- | --- | --- |
| θ_e^1 | [-1.5707963268, 1.5707963268], passo indicativo 0.01; default 0; rad | Cambiare il livello iniziale x₁^{des} e calcolare il corrispondente u_e¹=9.81sinθ_e¹ nell'esempio dichiarato. |
| θ_e^2 | [-1.5707963268, 1.5707963268], passo indicativo 0.01; default 0.5235987755982988; rad | Cambiare il secondo ramo e u_e²=9.81sinθ_e²; aggiornare l'ampiezza del salto senza animare una soluzione. |
| T | [1, 8], passo indicativo 0.1; default 2; s | Spostare T e T/2 e ridisegnare gli intervalli; l'ampiezza del salto resta invariata. |

Invarianti: Velocità desiderata zero; Nessuna traiettoria fisica o ottima calcolata; Formula di coppia con identificazioni enrichment esplicite; Range/default sono enrichment

**edge_cases:**

- t=T/2: Usare il secondo ramo come stampato.
- Equilibri coincidenti: Il riferimento diventa costante e può essere una traiettoria di equilibrio: non mantenere indiscriminatamente l'avviso di salto.
- T=0: Escludere dall'interazione progettata; la divisione in due intervalli non avrebbe il significato del trasferimento.

**takeaway:** Una curva desiderata può essere irrealizzabile pur esprimendo correttamente il task.

**source_warning:** NO_WARNING.
Nessun avviso allo studente.

**reusable_components:** EquationCard, TimeSeriesPlot, ParameterControl

**relation_to_previous_page:** Riprende Pendolo: due coppie di equilibrio. La pagina 34 fornisce gli equilibri, con refuso d'indice da conservare nella revisione; qui essi determinano i livelli del riferimento.

**relation_to_next_page:** Prepara Pendolo: valutare il problema completo. La pagina 36 usa questi desiderati nel costo, imponendo la dinamica solo alla traiettoria effettivamente cercata.

**estimated_density:** MEDIUM. Un focus, fino a tre idee, un esempio principale; formula e grafico condividono simboli e legenda.

**Layout:** GRAPH_AND_CONTROLS; HEADER → EXPLANATION → FORMULA → MAIN_VISUAL → CONTROLS → WORKED_EXAMPLE → TAKEAWAY.

**Moduli matematici condivisi:** pendulum_reference

**Fonte e limiti:** Non animare il pendolo saltando istantaneamente fra gli angoli e chiamandolo soluzione.; L'ingresso a gradino desiderato non è il solo motivo d'inammissibilità: lo stato angolare desiderato salta mentre x₂^{des}=0.; I grafici sono qualitativi; non dedurre numeri o relazioni di segno generali dai livelli disegnati.; Il caso dichiarato non traiettoria è un trasferimento fra equilibri distinti; se coincidono il caso degenere va trattato separatamente.

**PAGE_SPEC:** [0035](../Data/documents/OPTCON-RL_introduction_optimal_control_2026_09_14--ae169f3492dc/pages/0035/page_spec.json).

### Pagina 36 — Pendolo: valutare il problema completo

**source_page:** 36; label PDF 35; mapping 1:1.

**learning_objective:** Leggere obiettivo e dinamica senza confondere penalità e vincolo finale.

**prerequisite:** Funzionale continuo e 𝓕; Dinamica del pendolo; Curva desiderata a gradino

**key_ideas:** Il costo non ha fattori ½.; La dinamica resta non lineare.; Il terminale è penalizzato, non fissato.

**intuitive_explanation — enrichment:** La traiettoria ferma è una candidata ammissibile del piccolo esempio, anche se non arriva al secondo equilibrio; il costo misura quanto è sgradita.

**mathematical_explanation:** Candidata x=(0,0),u=0, riferimento 0→α=π/6, T=2. Integrale=q₁α²+r·4.905² sul secondo secondo; terminale=q_{T1}α². Default totale=3.22836953.

**formulas_to_show** (source = contenuto della fonte; correction/policy = F03; enrichment = aggiunta):

- source: \(\begin{aligned}\min_{(x(\cdot),u(\cdot))\in\mathcal F}\;&\int_0^T\big[q_1(x_1(\tau)-x_1^{\mathrm{des}}(\tau))^2+q_2x_2(\tau)^2+r(u(\tau)-u^{\mathrm{des}}(\tau))^2\big]d\tau\\&+q_{T1}(x_1(T)-x_1^{\mathrm{des}}(T))^2+q_{T2}x_2(T)^2\\\text{subj.to }&\dot x_1(t)=x_2(t)\\&\dot x_2(t)=-\frac{g}{l}\sin x_1(t)+\frac{1}{m\ell^2}u(t)\\&x(0)=x^0\end{aligned}\)
- source: \(Q=\begin{bmatrix}q_1&0\\0&q_2\end{bmatrix},\quad Q_T=\begin{bmatrix}q_{T1}&0\\0&q_{T2}\end{bmatrix},\quad R=r\)
- enrichment: \(\alpha=\pi/6,\quad\ell_{\rm candidate}=q_1\alpha^2+r\,(4.905)^2+q_{T1}\alpha^2\)

**worked_example — Esempio aggiunto:**
Enrichment: l=ℓ=m=1,g=9.81,T=2,x⁰=(0,0); riferimento di pagina 35 da θ_e¹=0 a θ_e²=π/6 a t=1, con u_e¹=0,u_e²=4.905. Candidata costante x=(0,0),u=0; q₁=q₂=q_{T2}=1,r=0.1,q_{T1}=2.

- La candidata soddisfa la dinamica e l'inizializzazione; non raggiunge il secondo equilibrio, ma non esiste un vincolo terminale hard in questa istanza.
- Primo secondo: costo corrente zero.
- Secondo secondo: q₁α²+r·4.905²≈2.68005818.
- Termine terminale: q_{T1}α²≈0.54831136.
- Totale≈3.22836953; i termini su x₂ sono nulli.

Limiti: Tutti i numeri e la candidata sono enrichment.; Non è una soluzione dell'OCP.; La scelta degli equilibri usa la dinamica e le identificazioni esplicite, tenendo distinto il refuso della pagina 34.

**visualization:** Formulazione in zone obiettivo/dinamica/inizializzazione, mini-tracce statiche candidata e riferimento, barre running/terminale. Pesi modificabili, candidata immutata; nessuna curva etichettata ottima.

**interaction:** Sì. Su una candidata esattamente fattibile e analitica si possono modificare alcuni pesi e vedere quali addendi cambiano, senza simulare un ottimizzatore inesistente.

**controls / expected_parameter_effects:**

| Controllo | Dominio; default; unità | Effetto osservabile |
| --- | --- | --- |
| q_1 | [0, 5], passo indicativo 0.1; default 1; normalized weight | Aggiornare il contributo integrale q₁α² su un secondo e il totale; la candidata resta ferma. |
| r | [0.01, 2], passo indicativo 0.01; default 0.1; normalized weight | Aggiornare il contributo r·4.905² sul secondo intervallo; non cambiare u della candidata. |
| q_{T1} | [0, 5], passo indicativo 0.1; default 2; normalized weight | Aggiornare il solo contributo q_{T1}α² e il totale. |

Invarianti: Candidata x=0,u=0 e riferimento fissati; q₂ e q_{T2} fissati con contributo zero perché x₂=0; Nessun ricalcolo di ottimo; Nessun fattore 1/2; Range/default sono enrichment

**edge_cases:**

- Terminal target non raggiunto: Può ancora essere una candidata ammissibile perché qui c'è penalità e non uguaglianza terminale.
- Pesi nulli su alcune componenti: Non garantire unicità o tracking esatto.
- Sostituire il riferimento a gradino alla soluzione: Viola la dinamica per equilibri distinti, anche se darebbe basso costo formale.
- Fattori 1/2 aggiunti per abitudine: Non cambiare la formula sorgente; ogni eventuale normalizzazione va dichiarata come enrichment.

**takeaway:** Per ottenere l'ottimo occorre risolvere l'OCP; qui ne rendiamo leggibili costo e vincoli.

**source_warning:** NO_WARNING.
Nessun avviso allo studente.

**reusable_components:** EquationCard, TimeSeriesPlot, CostBreakdown, ParameterControl

**relation_to_previous_page:** Riprende Desiderato a gradino: un obiettivo, non un moto. La pagina 35 definisce x₁^{des},x₂^{des}=0 e u^{des}; il costo usa i riferimenti, non li impone come traiettoria.

**relation_to_next_page:** Nessuna: conclusione del documento.

**estimated_density:** HIGH. Un focus, fino a tre idee, un esempio principale; formula e grafico condividono simboli e legenda.

**Layout:** WORKED_EXAMPLE; HEADER → EXPLANATION → FORMULA → MAIN_VISUAL → CONTROLS → WORKED_EXAMPLE → TAKEAWAY.

**Moduli matematici condivisi:** pendulum_model, pendulum_reference, continuous_functional

**Fonte e limiti:** Non è mostrata una soluzione, una simulazione, un algoritmo o un risultato di convergenza.; Non sono imposti esplicitamente x(T)=x_e², saturazioni o altri path constraints: il terminale qui è penalizzato, non fissato.; Nessun peso o dato iniziale numerico è assegnato.; Non inserire fattori 1/2 né sostituire sinx₁ con x₁.; Mantenere la variazione l/ℓ e dichiarare l'identificazione negli esempi.

**PAGE_SPEC:** [0036](../Data/documents/OPTCON-RL_introduction_optimal_control_2026_09_14--ae169f3492dc/pages/0036/page_spec.json).

## 3. COMPONENT INVENTORY

13 componenti da realizzare, tutti configurabili e riusati. Header, griglia e takeaway appartengono al contenitore comune, non sono mini-app per pagina.

| Componente | Responsabilità | Pagine |
| --- | --- | --- |
| EquationCard | Formula, domini, legenda dei simboli e riferimenti di provenienza. Titolo, righe raggruppate, origine, anchor; nessun calcolo dal LaTeX. | [2, 8, 9, 10, 11, 12, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 29, 30, 31, 32, 33, 34, 35, 36] |
| WarningBanner | Solo CORRECTION_WARNING locale. Testo F03 esatto, rosso, icona e testo; adiacente al gruppo corretto. | [16, 30, 34] |
| InfoNote | Solo INFO_WARNING pertinente. Testo F03 esatto, rosso discreto, una nota locale per issue. | [14, 17, 19, 22, 26] |
| ParameterControl | Un solo controllo numerico con slider e campo sincronizzati, oppure select. Dominio, default, unità, passo indicativo, etichetta, effect id; input numerico prevale sulla griglia slider. | [8, 9, 10, 11, 12, 15, 16, 17, 18, 19, 20, 21, 22, 23, 25, 26, 27, 29, 30, 31, 33, 34, 35, 36] |
| FunctionPlot | Grafico cartesiano 1D di una funzione scalare. Dominio, assi, curve, punti, segmenti di errore; stessa base per parabola, linearizzazione e seno. | [12, 15, 18, 25, 33] |
| ContourPlot | Livelli e segno di un residuo in due dimensioni. Griglia, livelli, maschera, dominio visibile, degenerazioni; calcolo esterno. | [16, 17] |
| TimeSeriesPlot | Tracce temporali continue, campionate o a gradino. Stesso tempo, unità per traccia, discontinuità esplicite, marcatori aperti/chiusi, eventuale area. | [8, 24, 27, 31, 32, 35, 36] |
| ConstraintVisualizer | Appartenenza e residui di vincoli. Banda 1D, regione 2D via ContourPlot o box; tolleranza esplicita, vuoto/bordo/esterno. | [17, 18, 21, 23, 30] |
| VectorVisualizer | Vettori, stack, dimensioni e dizionari delle componenti. Ordine preservato, simboli LaTeX, legenda fisica; nessun ordinamento automatico. | [10, 26, 27, 28, 29] |
| CostBreakdown | Contributi e totale di costo. Stadio/terminale, unità normalizzate, candidato fisso/ottimo dell'esempio, fattore di scala esplicito. | [16, 20, 22, 23, 25, 29, 31, 36] |
| StateInputTimeline | Indici di stato e ingresso, transizioni e residui. T+1 nodi, T archi, stack con x₀ escluso, domini di vincolo indipendenti. | [9, 10, 11, 19, 20, 21, 22, 23, 24, 25, 30] |
| ModelDiagram | Schema statico o aggiornato dai valori del modello. Anello di feedback, mappa concettuale, drone o pendolo mediante configurazione; nessun motore fisico interno. | [1, 2, 4, 6, 13, 26, 33, 34] |
| ComparisonTable | Confronti concettuali e numerici leggibili. Colonne dichiarate, unità, righe brevi, niente selettori decorativi. | [2, 3, 4, 5, 6, 7, 11, 13, 14, 28, 32, 34] |

Valutazione di tutti i componenti richiesti:

| Proposta | Decisione | Riuso |
| --- | --- | --- |
| EquationCard | ADOPT | EquationCard |
| WarningBanner | ADOPT | WarningBanner |
| InfoNote | ADOPT | InfoNote |
| ParameterSlider | VARIANT | ParameterControl: slider + campo sincronizzato |
| NumericInput | VARIANT | ParameterControl: stesso valore, parsing e validazione |
| FunctionPlot | ADOPT | FunctionPlot |
| ContourPlot | ADOPT | ContourPlot |
| TimeSeriesPlot | ADOPT | TimeSeriesPlot |
| StateSpacePlot | DEFER | Nessuna traiettoria di fase necessaria al focus delle pagine; futura variante cartesiana, non un simulatore distinto. |
| TrajectoryPlot | DEFER | Il caso dinamico scelto è verticale: bastano le tracce temporali. Le figure spaziali qualitative restano schemi. |
| ConstraintVisualizer | ADOPT | ConstraintVisualizer |
| VectorVisualizer | ADOPT | VectorVisualizer |
| CostBreakdown | ADOPT | CostBreakdown |
| ContinuousVsDiscrete | COMPOSE | TimeSeriesPlot + EquationCard; campioni/curva su stesso tempo fisico |
| LinearizationVisualizer | COMPOSE | FunctionPlot + EquationCard + letture numeriche |
| StepSimulation | COMPOSE | Modulo discrete_step + StateInputTimeline/TimeSeriesPlot |
| StateInputTimeline | ADOPT | StateInputTimeline |

## 4. SHARED SIMULATION/MATH MODULES

Sono contratti per la fase successiva, non implementazioni. I moduli producono dati, i componenti li rappresentano. La UI non interpreta formule LaTeX come codice. I fixture sono verificati ora con aritmetica indipendente; il futuro motore dovrà superarli prima di mostrare risultati.

### scalar_dynamics

**Pagine:** [8, 9, 11, 24]

**Input:** Profilo, x⁰, coefficiente a, ingresso costante u, tempo/numero di passi.

**Output:** Stati e ingresso coerenti con il profilo; soluzione continua analitica oppure ricorrenza discreta.

**Regole:** P8: ẋ=−ax+u, ramo a=0 separato. P9: x_next=a x+u. P10/P19–25 integratore quando dichiarato. Non associare automaticamente a discreto ad a continuo.

**Oracolo:** P8 x(1)=1−exp(−1); p9 x₁=1; p10 stack=(1.5,1.25,1.25).

### horizon_indexing

**Pagine:** [9, 10, 19, 23, 27, 30]

**Input:** T intero positivo, n,m; domini distinti di dinamica/input/stato/path.

**Output:** T ingressi, T+1 stati, stack nT/mT; indici controllati.

**Regole:** Mai u_T; x₀ escluso da 𝐱. P30 input 0…T−1 e quote 1…T, p21/p23 path 0…T−1.

**Oracolo:** T=1: u₀ e stato previsto x₁; p30 include vincolo sullo stato terminale.

### constraint_residuals

**Pagine:** [11, 17, 19, 21, 22, 23, 30, 34]

**Input:** Punto/candidato, funzioni h,g oppure limiti inferiore/superiore.

**Output:** Residui vettoriali, classe e tolleranza; nessun suggerimento automatico di ottimalità.

**Regole:** h=0, g≤0 componente per componente; eps=1e−9 nei fixture normalizzati, con bordo dichiarato. min>max è insieme vuoto, non riordinare limiti.

**Oracolo:** P19 r₂=.5−.8=−.3; p30 rmax=3.2−3=.2.

### quadratic_cost

**Pagine:** [15, 16, 18, 22, 25, 29]

**Input:** Errori, pesi simmetrici/diagonali, fattore di scala e modalità riferimento.

**Output:** Forma matriciale, contributi, costo e livelli.

**Regole:** P16 secondo termine w₂. Matrici del tracking: Q,Q_T≥0,R>0. P29 ingressi rispetto a zero. P36 nessun ½; non applicare default globali di normalizzazione.

**Oracolo:** P16 diag(1,4),e=(1,1): .5+2=2.5; entrambi pesi zero: costo nullo.

### local_linearization

**Pagine:** [12]

**Input:** Δx,Δu; nominale (1,0), modello f=x²+u.

**Output:** A=2,B=1, esatta 2Δx+(Δx)²+Δu, lineare 2Δx+Δu, scarto (Δx)².

**Regole:** Un passo, nessuna garanzia di stabilità; nominale fissata e coerente. Non calcolare errore relativo quando la quantità di riferimento è zero.

**Oracolo:** Δx=.1,Δu=0: .21,.2,.01.

### quadratic_sets

**Pagine:** [17]

**Input:** a,b,c reali su dominio di visualizzazione; inserto unitario fisso.

**Output:** Residuo az₁²+bz₂²−c, maschera ≤0 e luogo zero; classificazione limitato/vuoto/degenere/non limitato.

**Regole:** Non assumere ellisse per coefficienti arbitrari. a,b>0,c=0: origine; c<0: vuoto. a=b=0: piano se c≥0, altrimenti vuoto. Segni misti: possibile regione non limitata.

**Oracolo:** a=b=c=1: residui ai punti (0,0),(1,0),(2,0): −1,0,3.

### closed_form_examples

**Pagine:** [18, 21, 23, 25]

**Input:** Identificativo dell'esempio e parametri del suo dominio.

**Output:** Soluzione analitica, costo e stato di fattibilità solo per quella istanza.

**Regole:** P18 z*=min(z̄,b). P23 u₀=u₁=d_target/2 se |d_target|≤2b. P25 u*=Q_T a/(R+Q_T), denominatore positivo. Nessun backend di ottimizzazione generale.

**Oracolo:** P18 z*=1,costo .5; p23 .5,.5,costo .25; p25 .5,costo .25.

### additive_cost

**Pagine:** [20, 22, 29]

**Input:** Candidata o snapshot, stage cost, terminal cost, pesi, indici e scala.

**Output:** Contributi e totale; modo di valutazione esplicito.

**Regole:** P20/p22/p29 aggiornano solo costo. P29 è un singolo stadio: terminale simbolico escluso dal totale. Non cambiare una candidata quando cambia un peso.

**Oracolo:** P20 .625+.125+.5=1.25; p22 .125+.125=.25; p29 1+.05+1+1=3.05.

### planar_drone

**Pagine:** [26, 27]

**Input:** Stato nell'ordine (p_x,v_x,p_y,v_y,θ,ω), u₁,u₂,M,J,L,g.

**Output:** f_CT=col(v_x,−(u₁+u₂)sinθ/M,v_y,(u₁+u₂)cosθ/M−g,ω,L(u₁−u₂)/(2J)); y=(p_x,p_y).

**Regole:** Piano 2D, M,J,L>0. In p26–27 parametri fissi aggiunti M=1,J=.02,L=.4,g=9.81. Somma interamente negata in accelerazione x.

**Oracolo:** θ=0,u₁=u₂=4.905: accelerazioni zero; u₁=5,u₂=4: a_y=−.81,a_θ=10.

### discrete_step

**Pagine:** [27]

**Input:** f_CT, stato, input, δ>0, durata fisica fissata.

**Output:** Euler simultaneo x_next=x+δ f_CT(x,u,t); campioni e errore rispetto all'oracolo analitico del caso verticale.

**Regole:** Tutti i componenti usano il vecchio stato. Nessun ½δ²a nella posizione. P27 δ divide 1 s; N=1/δ è numero di passi dell'esempio, distinto dal T generico del corso.

**Oracolo:** δ=.1,a_y=2.19: p₁=0,v₁=.219,p₂=.0219,v₂=.438,p₁₀=.9855; continuo a 1 s=1.095.

### continuous_functional

**Pagine:** [31, 32, 36]

**Input:** Famiglia analitica, intervalli, running/terminal cost, scala e riferimento.

**Output:** Valori del funzionale e contributi; punti di discontinuità separati.

**Regole:** P31: ½c²T+½c²T². P36 integrare separatamente [0,T/2) e [T/2,T], senza ½; il singolo punto di salto non cambia l'integrale ma definisce il riferimento terminale.

**Oracolo:** P31 c=T=1:1. P36 candidata ferma con fixture:3.2283695334.

### pendulum_model

**Pagine:** [33, 34, 36]

**Input:** θ,velocità,coppia; un parametro lunghezza l≡ℓ, uno massa m≡M,g.

**Output:** ẋ₁=x₂, ẋ₂=−g/l sinx₁+u/(mℓ²); coppie di equilibrio (θ_e,0),u_e=mgℓsinθ_e.

**Regole:** Alias locali F03; l=ℓ=m=1,g=9.81 nei fixture. P34 condizione x₂,e=0, mai x₁,e=0. Niente smorzamento, approssimazione del seno o stabilità dedotta.

**Oracolo:** θ=π/6,u=0:−4.905; u=4.905,velocità zero: entrambe componenti nulle.

### pendulum_reference

**Pagine:** [35, 36]

**Input:** θ_e¹,θ_e²,T>0 e coppie di equilibrio dallo stesso modello.

**Output:** x₁des a gradino, x₂des=0, udes a gradino, con secondo ramo incluso a T/2.

**Regole:** Sono riferimenti, non traiettorie per angoli distinti. Nessun wrapping automatico degli angoli: il costo della fonte usa differenza ordinaria. Se livelli uguali mostrare il caso costante.

**Oracolo:** T=2,0→π/6: switch1 s,torque0→4.905; a t=1 usare secondo ramo.

Nessun ottimizzatore generale è richiesto dal primo design. Le pagine 18, 23 e 25 usano soluzioni analitiche di piccoli esempi; le pagine 20, 22, 29 e 36 rivalutano candidate fisse. p26 e p33 sono ispettori istantanei, p27 è il laboratorio temporale Euler, p35 genera solo riferimenti.

## 5. WARNING HANDLING

La policy F03 è vincolante. Il pannello PDF conserva la fonte; nella companion si mostra soltanto il testo breve previsto. correction_reason, source_expression e discussioni tecniche restano esclusivamente nei metadata.

| Pagina | Tipo | Punto di applicazione e testo esatto |
| --- | --- | --- |
| 14 | INFO_WARNING | domini z,h,g e dimensione d: ⚠ Nota: d e n indicano qui la stessa dimensione. |
| 16 | CORRECTION_WARNING | espansione con il secondo peso w₂: ⚠ Warning: possibile errore nella slide originale. Qui usiamo w₂ nel secondo termine invece di w₁. |
| 17 | INFO_WARNING | grafico calcolato della disequazione: ⚠ Nota: la figura è qualitativa; il grafico segue la formula. |
| 19 | INFO_WARNING | righe f₀,f₁,…,f_{T−1}: ⚠ Nota: ogni transizione usa la propria mappa f_t. |
| 22 | INFO_WARNING | default x₀des=x⁰: ⚠ Nota: negli esempi il riferimento iniziale coincide con x⁰. |
| 26 | INFO_WARNING | uscita planare (p_x,p_y): ⚠ Nota: il modello usato qui è planare, in due dimensioni. |
| 30 | CORRECTION_WARNING | due domini temporali dei vincoli: ⚠ Warning: possibile errore nella slide originale. Gli ingressi usano t=0,…,T−1; le quote t=1,…,T. |
| 34 | CORRECTION_WARNING | condizione x₂,e=0: ⚠ Warning: possibile errore nella slide originale. La condizione di equilibrio corretta è x₂,e=0. |

Nessun avviso per le issue NO_WARNING, comprese quelle aggiuntive a pagine 17 e 34 e le pagine 31,33,36. Nessun confronto numerico con il refuso.
Tracciabilità: source_literal/source_math originale → issue F03 → corrected_expression/companion_uses → formula mostrata → contratto matematico → esempio e output.
P16 usa w₂ sul secondo scarto; p30 separa input 0…T−1 e quote 1…T; p34 usa x₂,e=0. Negli esempi p22 assegna x₀des=x⁰; p26 è planare; nel pendolo una sola lunghezza e una sola massa, e p36 conserva il costo senza ½.

## 6. VISUAL/LAYOUT SYSTEM

Tela logica 960×1280, verticale 3:4; margini 40 px, 1200 px interni e separazioni 12 px. Titolo 34 px, corpo 24, formule 28, didascalie/avvisi 22. A larghezza 720 px corrispondono corpo 18 e didascalie 16.5 px. Sotto tale larghezza si usa zoom/scorrimento o pannelli alternati, senza comprimere ulteriormente il testo.

Un solo grafico principale; massimo quattro controlli. Formule spezzate in righe matematiche, simboli coerenti e valori con unità. Fino a 170 parole di prosa studente nelle pagine dense, oltre alle formule e al piccolo esempio. I campi tecnici completi del manifest non devono apparire tutti nella slide.
Le motivazioni e le fonti dettagliate restano nei metadata; nessun passaggio necessario alla comprensione viene nascosto per far entrare il contenuto.

| Archetipo | Ordine base dei blocchi |
| --- | --- |
| EXPLANATION | HEADER → EXPLANATION → MAIN_VISUAL → FORMULA → WORKED_EXAMPLE → TAKEAWAY |
| COMPARISON | HEADER → EXPLANATION → FORMULA → MAIN_VISUAL → CONTROLS → WORKED_EXAMPLE → TAKEAWAY |
| FORMULA_EXPLORER | HEADER → EXPLANATION → FORMULA → MAIN_VISUAL → CONTROLS → WORKED_EXAMPLE → TAKEAWAY |
| GRAPH_AND_CONTROLS | HEADER → EXPLANATION → FORMULA → MAIN_VISUAL → CONTROLS → WORKED_EXAMPLE → TAKEAWAY |
| SIMULATION | HEADER → EXPLANATION → FORMULA → MAIN_VISUAL → CONTROLS → WORKED_EXAMPLE → TAKEAWAY |
| WORKED_EXAMPLE | HEADER → EXPLANATION → FORMULA → MAIN_VISUAL → CONTROLS → WORKED_EXAMPLE → TAKEAWAY |
| CONCEPT_SUMMARY | HEADER → EXPLANATION → FORMULA → MAIN_VISUAL → WORKED_EXAMPLE → TAKEAWAY |

Le entry riportano budget per blocco: p27 dedica più spazio al dizionario di stato; p36 alla formulazione completa. Gli avvisi sono interni al budget del blocco pertinente e prevedono fino a 64 px.
Blu per stato/esatto, arancio per ingresso, grigio tratteggiato per desiderato, viola tratteggiato per approssimazione. Ammissibilità e violazioni hanno sempre anche testo/marker. Tabelle numeriche e descrizione alternativa accompagnano i grafici; controlli accessibili da tastiera.
ParameterControl accetta input numerici finiti anche se non sulla griglia indicativa dello slider: π/6 e 4.905 restano esatti ai default. Valori fuori dominio sono rifiutati con un errore locale, senza ricalcolare. Minimo maggiore del massimo è invece un caso matematico valido: insieme vuoto.
Il reset ripristina i default del profilo. Tornare a una pagina nella stessa sessione ripristina i suoi valori salvati; una nuova sessione parte dai default. Nessuna propagazione implicita fra istantanee, modelli o esempi con assunzioni diverse.

Il controllo attuale prova i budget strutturali. La verifica reale di wrapping, leggibilità, tastiera e overflow rimane criterio di accettazione della vertical slice, perché F04 non crea DOM o grafici.

## 7. PROPOSED VERTICAL SLICE

Otto pagine, nell'ordine fisico seguente. Coprono testo, formule, grafici 1D/2D, dinamica, linearizzazione, costi, vincoli e simulazione temporale; includono tutte e tre le correzioni F03.

| Pagina | Che cosa valida |
| --- | --- |
| 2 | Pagina testuale: schema di feedback, arricchimento statico, layout e fonte sincronizzata. |
| 8 | Sistema continuo e grafico 1D: controllo numerico, ramo a=0, assi e stato iniziale. |
| 12 | Linearizzazione: curva e retta con errore locale verificabile e nominale fissa. |
| 16 | Costo e livelli 2D: formula corretta, warning rosso, due contributi e pesi degeneri. |
| 17 | Vincoli 2D: campitura/uguaglianza, nota F03, casi vuoto/degenere/non limitato. |
| 27 | Simulazione temporale Euler: ordine delle sei componenti, stesso tempo fisico, oracolo continuo. |
| 30 | Vincoli e mapping temporale: input 0…T−1, quote 1…T, bordo e intervallo vuoto; secondo warning correttivo. |
| 34 | Pendolo e terzo warning correttivo: equilibrio con angolo non nullo, residui e riuso dello schema fisico. |

Completamento della futura vertical slice: 8 mapping navigabili sul PDF originale; formule e warning conformi al manifest; tutti gli oracoli e casi limite delle pagine scelte verificati; leggibilità senza overflow a 720 px per pannello; tastiera e alternative testuali funzionanti. Nessuna implementazione è stata eseguita in questa fase.

**Audit finale F04.** 218 controlli strutturali/policy più 38 fixture aritmetici. Baseline F03: 821 file immutabili, 137 PAGE_SPEC originali; errori=[].
Tutte le pagine hanno le 20 proprietà, il proprio PAGE_SPEC e i vicini corretti. Mapping 1:1, testi F03 esatti, formule corrette tracciabili, domini/default/effetti dei controlli espliciti, nessun componente ad hoc duplicato. PDF, immagini, testo estratto, source_literal e analisi precedenti sono immutati.
READY_FOR_VERTICAL_SLICE indica che il design è pronto per la prossima fase, non che l'applicazione o le verifiche di rendering siano complete.

Audit ripetibile: .venv/Scripts/python.exe -m pipeline.introduction_companion_design audit

DESIGNED_PAGES = 36/36

COMPANION_SUBPAGES = 0

INTERACTIVE_PAGES = 24

STATIC_PAGES = 12

REUSABLE_COMPONENTS = 13

UNRESOLVED_DESIGN_ISSUES = 0

READY_FOR_VERTICAL_SLICE = YES


## F04.1 — Aggiornamento vincolante delle visualizzazioni

Questa sezione estende le sette sezioni F04 precedenti, conservate integralmente come baseline. Le decisioni seguenti prevalgono sulle precedenti scelte 2D e sui rinvii dei componenti di traiettoria/spazio di stato. Non si rifà F04.
Report completo con significato degli assi, formule, controlli e casi limite: [F04_1_VISUALIZATION_AUDIT.md](F04_1_VISUALIZATION_AUDIT.md).
Nel manifest sono effettivi visualization.visualizationMode/visualizationSemantics/threeDRequirements/twoDRequirements, interaction.effective_enabled e visualization_architecture. I campi e le metriche F04 precedenti rimangono storici.
GRAPHICS_REQUIREMENT = FULL_2D_AND_3D_SUPPORT

3D_VISUALIZATION_POLICY = "Prefer 3D or combined 2D/3D whenever a meaningful third mathematical dimension exists; avoid it only when it would be irrelevant or misleading."

Supporto 3D progettato su 27 pagine; interazioni aggiunte a [6, 14, 24, 28, 32]. Stato effettivo: 29 interattive, 7 statiche; 36 mapping 1:1 e zero nuove sottopagine.

| Pagina | Modalità | Terzo asse / motivo del 2D |
| ---: | --- | --- |
| 1 | 2D_ONLY | La mappa del percorso e i crediti sono simbolici: una profondità non codificherebbe alcun dato. |
| 2 | 2D_ONLY | Anello di feedback e piccolo confronto scalare sono più leggibili nel piano. |
| 3 | 2D_ONLY | Il focus è distinguere categorie di criteri e limiti, non descrivere una manovra. |
| 4 | 2D_ONLY | Il controesempio punto/payload/passaggio è già spiegato dalla sezione planare dell'ingombro. |
| 5 | 2D_ONLY | Il confronto tempo/comfort è elementare e il grafico originale non fornisce energia o accelerazioni numeriche. |
| 6 | 3D_PRIMARY | Z_geom — Polilinea A: (−2,0,h)→(2,0,h). B: (−2,0,h)→(−1,1,h)→(1,1,h)→(2,0,h). Ostacolo chiuso [−.5,.5]×[−.5,.5]×[0,2]. |
| 7 | 2D_ONLY | La pagina classifica criteri e limiti senza assegnare un'orbita o una manovra. |
| 8 | 2D_PRIMARY_WITH_3D | x(t;u) — x(t;u)=u/a+(x⁰−u/a)e^(−at) se a>0; x(t;u)=x⁰+ut se a=0. |
| 9 | 2D_PRIMARY_WITH_3D | x_{t+1} — x_{t+1}=a x_t+u_t; punto selezionato della prima transizione (x⁰,u,a x⁰+u). |
| 10 | 2D_ONLY | Stack e numero di componenti sono oggetti simbolici: profondità prospettica renderebbe meno chiari indici e dimensioni. |
| 11 | 2D_AND_3D_EQUAL | r_e — r_e=x_e−f(x_e,u_e)=0.5x_e−u_e. |
| 12 | 3D_PRIMARY_WITH_2D | Δx_next — S(Δx,Δu)=2Δx+(Δx)²+Δu; P(Δx,Δu)=2Δx+Δu; S−P=(Δx)². |
| 13 | 2D_ONLY | Il riepilogo di strumenti e task è una mappa concettuale senza funzione o geometria da esplorare. |
| 14 | 2D_AND_3D_EQUAL | ℓ(z) — ℓ=.5(z₁²+z₂²), h=z₁+z₂−1=0, g=−z₁≤0; Z={(z₁,1−z₁):z₁≥0}; sollevamento (z₁,z₂,ℓ). |
| 15 | 2D_ONLY | Una parabola e il riferimento mobile spiegano direttamente la distinzione tra scegliere z e assegnare z̄. |
| 16 | 3D_PRIMARY_WITH_2D | ℓ(z) — ℓ=.5w₁(z₁−z̄₁)²+.5w₂(z₂−z̄₂)², z̄=(0,0). Solo formula corretta F03. |
| 17 | 2D_AND_3D_EQUAL | g(z) — g=az₁²+bz₂²−c; Z={g≤0}; il luogo g=0 è il bordo quando non degenere. |
| 18 | 2D_PRIMARY_WITH_3D | ℓ(z;z̄) — ℓ=.5(z−z̄)², z≤b; per ogni sezione di riferimento z*=min(z̄,b). z̄ è parametro, non seconda decisione. |
| 19 | 3D_PRIMARY_WITH_2D | r₁_dyn — Con x₀=0,u₀=1,u₁=−.5: r₀=1−x₁, r₁_dyn=x₁−.5−x₂. Validità congiunta richiede x₁=1 e r₁_dyn=0. |
| 20 | 2D_PRIMARY_WITH_3D | ℓ — Per la candidata F04 fissata: ℓ=.625α+.125β+.125γ. |
| 21 | 2D_PRIMARY_WITH_3D | r_T — r_T=u₀+u₁−1 con x₀=0,T=2; endpoint realizzabile se il piano r_T=0 interseca il box. |
| 22 | 2D_PRIMARY_WITH_3D | ℓ — T=1,Q=0,x₀des=x⁰=0,u₀des=0,x₁des=1; superficie di costo con vincolo x₁=u₀ e candidata (.5,.5). |
| 23 | 3D_PRIMARY_WITH_2D | ℓ — ℓ=.5(u₀²+u₁²); ∣u₀∣,∣u₁∣≤b; u₀+u₁=d_target. Ottimo solo se ∣d_target∣≤2b. |
| 24 | 2D_PRIMARY_WITH_3D | e_t — Integratore F04 x₀=0,u₀=u₁=c∈[0,1], y=(0,c,2c); riferimento aggiunto ydes=(0,2,2); e=(0,c−2,2c−2). |
| 25 | 2D_AND_3D_EQUAL | ℓ — ℓ=.5Ru₀²+.5Q_T(x₁−a)², x₁=u₀; u₀*=Q_T a/(R+Q_T), x₁*=u₀*. |
| 26 | 2D_PRIMARY_WITH_3D | p̈_y — p̈_y=(u₁+u₂)cosθ/M−g, M=1,g=9.81; altre letture invariate p̈_x=−(u₁+u₂)sinθ/M e θ̈=L(u₁−u₂)/(2J). |
| 27 | 3D_PRIMARY_WITH_2D | v_y — Euler: (τ_k,p_{y,k},v_{y,k})=(kδ,2.19δ²k(k−1)/2,2.19kδ). Continuo: (τ,1.095τ²,2.19τ). |
| 28 | 2D_PRIMARY_WITH_3D | v_y — Fixture p27 con δ=.1; riferimento aggiunto p_y^{des}(τ)=1.095τ²,v_y^{des}(τ)=2.19τ. Si ispezionano k=1,…,10 e gli scarti del modello Euler. |
| 29 | 3D_PRIMARY_WITH_2D | ℓ_t — Altri errori e ω nulli, u₁=u₂=2: ℓ_t=.5q₁e_px²+.5q₅θ²+2r₁+2r₂. Punto fisso e_px=1,θ=.1. |
| 30 | 2D_PRIMARY_WITH_3D | V — V(p_y,b_min;b_max)=max(b_min−p_y,p_y−b_max); ammissibile se V≤0. La sezione b_min corrente rappresenta il vincolo effettivo. |
| 31 | 2D_PRIMARY_WITH_3D | x(t;c) — Famiglia aggiunta u(t)=c,x(t;c)=ct,x(0)=0; costo=.5c²T+.5c²T². |
| 32 | 3D_PRIMARY_WITH_2D | x(t;c₁,c₂) — u=c₁ su [0,1),u=c₂ su [1,2]; x=c₁t per t≤1, x=c₁+c₂(t−1) per t≥1. Superficie (t,c₂,x) con c₁ fissato al suo valore corrente. |
| 33 | 3D_PRIMARY_WITH_2D | ẋ₂ — ẋ₂=−9.81sinθ+u con l≡ℓ=1,m=1,g=9.81 e velocità dell'istantanea zero. |
| 34 | 3D_PRIMARY_WITH_2D | u_e — Curva E={(θ_e,0,9.81sinθ_e)}; marker dei due equilibri F04, senza traiettoria di collegamento. |
| 35 | 2D_PRIMARY_WITH_3D | u_des — Due segmenti separati: (t,θ_e¹,u_e¹),0≤t<T/2 e (t,θ_e²,u_e²),T/2≤t≤T; x₂des=0. |
| 36 | 3D_PRIMARY_WITH_2D | ℓ_t — Sezione x₂=0,u=0: ℓ_t(t,e)=q₁e²+r(udes(t))². Candidata fisica fissa x=(0,0),u=0: e=0 nel primo secondo, e=−π/6 nel secondo; terminale=q_T1(π/6)². |

### Inventario effettivo per F05

9 astrazioni visuali canoniche: FunctionExplorer, TrajectoryViewer, ProjectionLink, SceneViewport, ModelDiagram, VectorVisualizer, CostBreakdown, StateInputTimeline, ComparisonTable. EquationCard, WarningBanner, InfoNote e ParameterControl rimangono condivisi.
FunctionExplorer copre curve, contorni, superfici, residui, maschere e campi vettoriali 2D/3D. TrajectoryViewer copre serie temporali, xy/xyt/xyz e spazi di stato. Sezioni, piani tangenti e vincoli sono configurazioni, non componenti separati. ProjectionLink condivide selezioni e SceneViewport gestisce camera e coordinate.
La selezione dello stack F05 deve includere 3D nativo già nella vertical slice, non come estensione futura; dettagli e criteri di accettazione nel report F04.1.

### Viste e layout

Le viste combinate usano un toggle 2D | 3D nello stesso MAIN_VISUAL. Contorni/proiezioni possono comparire nella scena; letture numeriche e warning restano visibili. Nessun pannello 3D aggiuntivo a scapito della leggibilità. Non cambia il mapping.
Orbit, zoom, pan e reset camera sono distinti da modifica/reset dei parametri. Tooltip e coordinate hanno unità; camera e toggle non alterano dati o formule. Solo p27 ha playback temporale; p34 mostra equilibri, p35 riferimenti discontinui senza teletrasporto fisico.
Il drone delle pagine 26–30 resta planare: la terza coordinata del grafico è accelerazione, velocità, costo o residuo. Il 3D geometrico illustrativo di p6 non è una nuova dinamica del veicolo.
PDF, PAGE_SPEC e F03 intatti; superfici e simulazioni future useranno sempre le formule corrette. I limiti di layout e le verifiche nel browser rimangono gate F05.

### Impatto sulla vertical slice

Pagine confermate: 2,8,12,16,17,27,30,34. P2 verifica il caso simbolico 2D; p8 una famiglia di risposte; p12 superficie/piano tangente; p16 costo/contorni corretti; p17 superficie del vincolo; p27 traiettoria tempo–quota–velocità; p30 residuo e intervallo vuoto; p34 curva degli equilibri con velocità nulla.
Audit F04.1: preservazione completa F04, fonti e PAGE_SPEC immutati, tutte le 36 decisioni presenti, assi/effetti dei parametri espliciti, 9 componenti visuali senza duplicazioni. Nessuna implementazione eseguita.

PAGES_2D_ONLY = [1, 2, 3, 4, 5, 7, 10, 13, 15]

PAGES_3D_PRIMARY = [6]

PAGES_2D_PRIMARY_WITH_3D = [8, 9, 18, 20, 21, 22, 24, 26, 28, 30, 31, 35]

PAGES_3D_PRIMARY_WITH_2D = [12, 16, 19, 23, 27, 29, 32, 33, 34, 36]

PAGES_2D_AND_3D_EQUAL = [11, 14, 17, 25]

PAGES_WITH_NO_VISUALIZATION = []

PAGES_GAINING_3D_AFTER_AUDIT = [6, 8, 9, 11, 12, 14, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36]

PAGES_GAINING_INTERACTIVITY_AFTER_AUDIT = [6, 14, 24, 28, 32]

REUSABLE_VISUALIZATION_COMPONENTS = 9

UNRESOLVED_VISUALIZATION_ISSUES = 0

GRAPHICS_REQUIREMENT = FULL_2D_AND_3D_SUPPORT

READY_FOR_F05 = YES
