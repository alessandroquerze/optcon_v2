# F04.1 — 2D/3D Visualization Audit

Estensione del design F04 già completo: 36 pagine riesaminate, nessuna riprogettazione delle spiegazioni o modifica del mapping. Le 27 pagine con 3D usano una quantità esplicitamente definita; 5 pagine prima statiche acquistano interazioni didattiche.
PDF, testo, immagini, tutti i PAGE_SPEC e policy F03 rimangono immutabili. Nessun componente, grafico, simulatore o frontend è implementato.

## 1. VISUALIZATION PHILOSOPHY

Il 3D è una capacità nativa e una scelta normale per superfici, residui, relazioni fra stato e ingresso e embedding temporali. La terza coordinata può essere un valore matematico o uno stato già esistente: non occorre inventare un'altra direzione fisica.
Le decisioni F04 sono conservate integralmente. Nei campi nuovi le viste attuali prevalgono sui precedenti rinvii di StateSpacePlot/TrajectoryPlot e sulla scelta originaria statica delle pagine 6,14,24,28,32. Il loro contenuto ed esempio restano disponibili.
Le 6 modalità sono alternative di presentazione, non tipi di modello. 2D_ONLY include mappe simboliche e tabelle; quindi non c'è alcuna pagina NONE: tutte le 36 avevano già almeno una rappresentazione nel design F04.
Tutte le nuove geometrie, famiglie parametriche e coordinate derivate sono enrichment. Il badge Esempio aggiunto e il significato degli assi sono visibili; le motivazioni tecniche non entrano nella UI.
La camera non altera i dati. Unità diverse su assi diversi non definiscono una distanza fisica euclidea: evitare deduzioni da inclinazioni prospettiche o rapporti visivi fra unità.

## 2. PAGE-BY-PAGE 2D/3D DECISIONS

| Pagina | Modalità | Interattività F04 → attuale | Decisione e scopo |
| ---: | --- | --- | --- |
| 1 | 2D_ONLY | no → no | La mappa del percorso e i crediti sono simbolici: una profondità non codificherebbe alcun dato. |
| 2 | 2D_ONLY | no → no | Anello di feedback e piccolo confronto scalare sono più leggibili nel piano. |
| 3 | 2D_ONLY | no → no | Il focus è distinguere categorie di criteri e limiti, non descrivere una manovra. |
| 4 | 2D_ONLY | no → no | Il controesempio punto/payload/passaggio è già spiegato dalla sezione planare dell'ingombro. |
| 5 | 2D_ONLY | no → no | Il confronto tempo/comfort è elementare e il grafico originale non fornisce energia o accelerazioni numeriche. |
| 6 | 3D_PRIMARY | no → sì | L'esempio motivazionale riguarda esplicitamente percorsi 3D: la quota rende visibile il passaggio sopra o accanto all'ostacolo. |
| 7 | 2D_ONLY | no → no | La pagina classifica criteri e limiti senza assegnare un'orbita o una manovra. |
| 8 | 2D_PRIMARY_WITH_3D | sì → sì | La superficie mostra come l'intera risposta dipende dall'ingresso costante, mentre la sezione temporale conserva la lettura della ODE. |
| 9 | 2D_PRIMARY_WITH_3D | sì → sì | Il piano stato–ingresso–stato successivo rende geometrica la mappa di aggiornamento; la timeline resta il riferimento per gli indici. |
| 10 | 2D_ONLY | sì → sì | Stack e numero di componenti sono oggetti simbolici: profondità prospettica renderebbe meno chiari indici e dimensioni. |
| 11 | 2D_AND_3D_EQUAL | sì → sì | Lo zero del residuo è una linea nel piano stato–ingresso e l'intersezione di due piani nella vista 3D. |
| 12 | 3D_PRIMARY_WITH_2D | sì → sì | Due perturbazioni indipendenti generano una superficie e un piano tangente; il grafico 2D misura lo scarto sulla sezione. |
| 13 | 2D_ONLY | no → no | Il riepilogo di strumenti e task è una mappa concettuale senza funzione o geometria da esplorare. |
| 14 | 2D_AND_3D_EQUAL | no → sì | Costo e insieme ammissibile diventano leggibili insieme: punti nel piano, valori sulla superficie e uguaglianza sollevata. |
| 15 | 2D_ONLY | sì → sì | Una parabola e il riferimento mobile spiegano direttamente la distinzione tra scegliere z e assegnare z̄. |
| 16 | 3D_PRIMARY_WITH_2D | sì → sì | La superficie rende immediata la curvatura imposta dai pesi; livelli e sezione 2D permettono letture esatte. |
| 17 | 2D_AND_3D_EQUAL | sì → sì | La regione g≤0 è la proiezione dei punti della superficie che stanno sotto il piano zero. |
| 18 | 2D_PRIMARY_WITH_3D | sì → sì | La famiglia di costi al variare del riferimento mostra dove il minimo passa dal riferimento al bordo del vincolo. |
| 19 | 3D_PRIMARY_WITH_2D | sì → sì | Il residuo come quota distingue una sequenza nello spazio delle decisioni da una traiettoria coerente. |
| 20 | 2D_PRIMARY_WITH_3D | sì → sì | Una superficie sui pesi mostra come due scelte di penalizzazione contribuiscono allo stesso costo, senza muovere la candidata. |
| 21 | 2D_PRIMARY_WITH_3D | sì → sì | Nel piano dei due ingressi il limite è un box; il residuo terminale come altezza mostra se quel box raggiunge zero. |
| 22 | 2D_PRIMARY_WITH_3D | sì → sì | Il costo su stato e ingresso mostra perché il riferimento a costo nullo può essere fuori dalla dinamica. |
| 23 | 3D_PRIMARY_WITH_2D | sì → sì | Costo, box degli ingressi ed endpoint diventano oggetti geometrici nello stesso spazio. |
| 24 | 2D_PRIMARY_WITH_3D | no → sì | Tempo, uscita ed errore separano il percorso di valori dalla precisione del tracking a ogni istante. |
| 25 | 2D_AND_3D_EQUAL | sì → sì | La superficie riprende p22 e la sezione imposta dalla dinamica rende visibile il minimo ora calcolato. |
| 26 | 2D_PRIMARY_WITH_3D | sì → sì | La somma degli ingressi si legge come superficie di accelerazione verticale, senza trasformare il drone in un sistema spaziale 3D. |
| 27 | 3D_PRIMARY_WITH_2D | sì → sì | La curva tempo–quota–velocità mostra simultaneamente i due stati verticali e distingue Euler dal moto continuo. |
| 28 | 2D_PRIMARY_WITH_3D | no → sì | La stessa traiettoria verticale di p27 permette di leggere separatamente errore di posizione e di velocità a un istante scelto. |
| 29 | 3D_PRIMARY_WITH_2D | sì → sì | La sezione costo–errore di posizione–angolo mostra curvatura e contributo degli ingressi nello stesso snapshot. |
| 30 | 2D_PRIMARY_WITH_3D | sì → sì | La superficie del residuo massimo rende visibili bordo, violazione e intervallo vuoto al variare del limite inferiore. |
| 31 | 2D_PRIMARY_WITH_3D | sì → sì | La superficie raccoglie la famiglia di funzioni ammissibili dell'esempio, mentre il 2D conserva area integrale e terminale. |
| 32 | 3D_PRIMARY_WITH_2D | no → sì | Variare coefficienti fa vedere una famiglia finita di funzioni dentro lo spazio funzionale, senza confondere orizzonte finito e dimensione. |
| 33 | 3D_PRIMARY_WITH_2D | sì → sì | Angolo e coppia sono due variabili significative: il seno genera una superficie di accelerazione, non un pendolo fisico con un altro stato. |
| 34 | 3D_PRIMARY_WITH_2D | sì → sì | La curva nello spazio stato–ingresso rende esplicito che la componente nulla è la velocità e l'angolo può variare. |
| 35 | 2D_PRIMARY_WITH_3D | sì → sì | L'embedding temporale associa i livelli di angolo e coppia desiderati senza presentare il salto come moto fisico. |
| 36 | 3D_PRIMARY_WITH_2D | sì → sì | La superficie del running cost rende visibili tempo, errore e penalità; la curva della candidata e il terminale restano distinti. |

Casi mantenuti 2D e alternativa 3D valutata:

- Pagina 1: Una timeline 3D dei capitoli aggiungerebbe un asse senza quantità matematica.
- Pagina 2: Una superficie costo–ingresso–tempo richiederebbe una dinamica e un tempo assenti dall'esempio.
- Pagina 3: Uno spazio tempo–energia–comfort non ha dati o scale assegnati; un volo 3D non chiarisce la classificazione.
- Pagina 4: Un volume 3D richiederebbe nuove dimensioni del carico e del passaggio senza aggiungere un requisito al controesempio.
- Pagina 5: Un asse consumo renderebbe quantitative informazioni solo qualitative.
- Pagina 7: Una traiettoria orbitale 3D introdurrebbe un modello e dati di missione non necessari alla classificazione.
- Pagina 10: Usare n,m,T come tre assi confonderebbe dimensione del blocco, tempo e numero di decisioni.
- Pagina 13: Un asse sforzo/tempo non è definito per i due controllori ipotetici dell'esempio.
- Pagina 15: La superficie (z,z̄,ℓ) sarebbe una famiglia di problemi: qui complicherebbe il primo incontro con un costo scalare; sarà utile a p18 per il cambio di vincolo attivo.

## 3. MEANING OF THIRD DIMENSION

| Pagina | Assi x; y; z (unità) | Definizione e significato |
| ---: | --- | --- |
| 6 | X_geom [m]; Y_geom [m]; Z_geom [m] | Polilinea A: (−2,0,h)→(2,0,h). B: (−2,0,h)→(−1,1,h)→(1,1,h)→(2,0,h). Ostacolo chiuso [−.5,.5]×[−.5,.5]×[0,2]. |
| 8 | t [s]; u [state unit/s]; x(t;u) [state unit] | x(t;u)=u/a+(x⁰−u/a)e^(−at) se a>0; x(t;u)=x⁰+ut se a=0. |
| 9 | x_t [state unit]; u_t [state unit]; x_{t+1} [state unit] | x_{t+1}=a x_t+u_t; punto selezionato della prima transizione (x⁰,u,a x⁰+u). |
| 11 | x_e [state unit]; u_e [input unit]; r_e [state unit] | r_e=x_e−f(x_e,u_e)=0.5x_e−u_e. |
| 12 | Δx [1]; Δu [1]; Δx_next [1] | S(Δx,Δu)=2Δx+(Δx)²+Δu; P(Δx,Δu)=2Δx+Δu; S−P=(Δx)². |
| 14 | z₁ [1]; z₂ [1]; ℓ(z) [normalized cost] | ℓ=.5(z₁²+z₂²), h=z₁+z₂−1=0, g=−z₁≤0; Z={(z₁,1−z₁):z₁≥0}; sollevamento (z₁,z₂,ℓ). |
| 16 | z₁ [1]; z₂ [1]; ℓ(z) [normalized cost] | ℓ=.5w₁(z₁−z̄₁)²+.5w₂(z₂−z̄₂)², z̄=(0,0). Solo formula corretta F03. |
| 17 | z₁ [1]; z₂ [1]; g(z) [normalized residual] | g=az₁²+bz₂²−c; Z={g≤0}; il luogo g=0 è il bordo quando non degenere. |
| 18 | z [1]; z̄ [1]; ℓ(z;z̄) [normalized cost] | ℓ=.5(z−z̄)², z≤b; per ogni sezione di riferimento z*=min(z̄,b). z̄ è parametro, non seconda decisione. |
| 19 | x₁ [state unit]; x₂ [state unit]; r₁_dyn [state unit] | Con x₀=0,u₀=1,u₁=−.5: r₀=1−x₁, r₁_dyn=x₁−.5−x₂. Validità congiunta richiede x₁=1 e r₁_dyn=0. |
| 20 | α [normalized weight]; β [normalized weight]; ℓ [normalized cost] | Per la candidata F04 fissata: ℓ=.625α+.125β+.125γ. |
| 21 | u₀ [input unit]; u₁ [input unit]; r_T [state unit] | r_T=u₀+u₁−1 con x₀=0,T=2; endpoint realizzabile se il piano r_T=0 interseca il box. |
| 22 | u₀ [input unit]; x₁ [state unit]; ℓ [normalized cost] | T=1,Q=0,x₀des=x⁰=0,u₀des=0,x₁des=1; superficie di costo con vincolo x₁=u₀ e candidata (.5,.5). |
| 23 | u₀ [input unit]; u₁ [input unit]; ℓ [normalized cost] | ℓ=.5(u₀²+u₁²); ∣u₀∣,∣u₁∣≤b; u₀+u₁=d_target. Ottimo solo se ∣d_target∣≤2b. |
| 24 | t [step]; y_t [state unit]; e_t [state unit] | Integratore F04 x₀=0,u₀=u₁=c∈[0,1], y=(0,c,2c); riferimento aggiunto ydes=(0,2,2); e=(0,c−2,2c−2). |
| 25 | u₀ [input unit]; x₁ [state unit]; ℓ [normalized cost] | ℓ=.5Ru₀²+.5Q_T(x₁−a)², x₁=u₀; u₀*=Q_T a/(R+Q_T), x₁*=u₀*. |
| 26 | u₁ [N]; u₂ [N]; p̈_y [m/s²] | p̈_y=(u₁+u₂)cosθ/M−g, M=1,g=9.81; altre letture invariate p̈_x=−(u₁+u₂)sinθ/M e θ̈=L(u₁−u₂)/(2J). |
| 27 | τ=kδ [s]; p_y [m]; v_y [m/s] | Euler: (τ_k,p_{y,k},v_{y,k})=(kδ,2.19δ²k(k−1)/2,2.19kδ). Continuo: (τ,1.095τ²,2.19τ). |
| 28 | τ=k·.1 [s]; p_y [m]; v_y [m/s] | Fixture p27 con δ=.1; riferimento aggiunto p_y^{des}(τ)=1.095τ²,v_y^{des}(τ)=2.19τ. Si ispezionano k=1,…,10 e gli scarti del modello Euler. |
| 29 | e_px=x₁-p_x_des [normalized position error]; θ=x₅ [rad]; ℓ_t [normalized cost] | Altri errori e ω nulli, u₁=u₂=2: ℓ_t=.5q₁e_px²+.5q₅θ²+2r₁+2r₂. Punto fisso e_px=1,θ=.1. |
| 30 | p_y [m]; b_min=p_y_min [m]; V [m] | V(p_y,b_min;b_max)=max(b_min−p_y,p_y−b_max); ammissibile se V≤0. La sezione b_min corrente rappresenta il vincolo effettivo. |
| 31 | t [s]; c [state unit/s]; x(t;c) [state unit] | Famiglia aggiunta u(t)=c,x(t;c)=ct,x(0)=0; costo=.5c²T+.5c²T². |
| 32 | t [s]; c₂ [state unit/s]; x(t;c₁,c₂) [state unit] | u=c₁ su [0,1),u=c₂ su [1,2]; x=c₁t per t≤1, x=c₁+c₂(t−1) per t≥1. Superficie (t,c₂,x) con c₁ fissato al suo valore corrente. |
| 33 | θ=x₁ [rad]; u [N m]; ẋ₂ [rad/s²] | ẋ₂=−9.81sinθ+u con l≡ℓ=1,m=1,g=9.81 e velocità dell'istantanea zero. |
| 34 | x₁,e=θ_e [rad]; x₂,e [rad/s]; u_e [N m] | Curva E={(θ_e,0,9.81sinθ_e)}; marker dei due equilibri F04, senza traiettoria di collegamento. |
| 35 | t [s]; x₁_des [rad]; u_des [N m] | Due segmenti separati: (t,θ_e¹,u_e¹),0≤t<T/2 e (t,θ_e²,u_e²),T/2≤t≤T; x₂des=0. |
| 36 | t [s]; e_θ=x₁-x₁_des [rad]; ℓ_t [normalized running cost] | Sezione x₂=0,u=0: ℓ_t(t,e)=q₁e²+r(udes(t))². Candidata fisica fissa x=(0,0),u=0: e=0 nel primo secondo, e=−π/6 nel secondo; terminale=q_T1(π/6)². |

La pagina 6 usa un ambiente geometrico 3D esplicitamente assegnato come esempio: non un modello dinamico nuovo. Le pagine 26–30 mantengono il drone planare: p26 usa l'accelerazione come quota; p27/p28 tempo, quota e velocità esistente; p29 il costo; p30 il residuo. Nessuna coordinata p_z o dinamica fuori piano.
P19 mostra candidati nello spazio delle decisioni, non tutte traiettorie. P31/p32 mostrano famiglie finite dentro uno spazio di funzioni, non una dimostrazione globale di manifold. P34 mostra un luogo di equilibri, non un trasferimento. P35 mostra riferimenti discontinui: i segmenti non sono raccordati come moto fisico. P36 separa lo stato costante dal salto del costo/riferimento.

## 4. 2D/3D COMBINED VIEWS

Un toggle 2D | 3D usa lo stesso MAIN_VISUAL nelle pagine combinate: parametri, selezione e numeri persistono cambiando vista. I due pulsanti hanno pari rilievo nelle pagine 2D_AND_3D_EQUAL. Le modalità primary indicano la vista iniziale. P6 usa una scena 3D principale, senza un secondo grafico 2D ridondante.
Le sovrapposizioni simultanee sono matematiche: contorni, piani zero, sezioni e marker nella stessa scena. Le letture numeriche restano visibili. Non si aggiungono due canvas piccoli a scapito di formule o warning. Il budget F04 resta il vincolo: barra modalità/camera entro 32 px nel blocco visuale.
Orbit, zoom, pan, reset camera, tooltip e coordinate sono requisiti di tutte le 27 viste 3D. Surface/wireframe/mesh sono modalità dello stesso oggetto. Sezioni e contour projection compaiono solo dove definiti; gradienti e frecce non vengono aggiunti senza uno scopo.
L'unico playback nuovo è p27: pausa iniziale, play/pause, cursore temporale e restart ispezionano i campioni già definiti. P35 non anima salti del pendolo; p34 non inventa una traiettoria di trasferimento.

### Pagina 6 — contratto delle viste

**Presentazione:** 3d_scene; iniziale 3D.
**2D:** none.
**Superficie/traiettoria:** curva/percorso .
**Piani/sezioni:** Non necessari.
**Proiezioni/letture:** Nessun grafico 2D aggiuntivo.
**Parametri e cambiamenti:**

- h: Ricalcola solo i vertici Z_geom=h, stato di intersezione e distanza h−2; l'edificio resta fisso.

**Nuovi controlli — enrichment:**

- h: [0.5,3], default 1 m.

**Invarianti e limiti:**

- Geometria giocattolo dichiarata enrichment, non stato/modello del drone del corso.
- Parametrizzazione geometrica dei segmenti: nessuna legge temporale, spinta o fattibilità dinamica.
- Percorsi di un punto: nessuna certificazione per l'ingombro di un veicolo.
- h=2 tocca il tetto: intersezione perché l'ostacolo è chiuso.
- A interseca per h≤2; B evita l'ostacolo per tutta la gamma.
- Non chiamare B ottimo né le distanze energia/consumo.

### Pagina 8 — contratto delle viste

**Presentazione:** linked_toggle; iniziale 2D.
**2D:** time_series_at_current_u.
**Superficie/traiettoria:** superficie .
**Piani/sezioni:** Sezione u=u_corrente.
**Proiezioni/letture:** (t,x) della sezione selezionata
**Parametri e cambiamenti:**

- a: a aggiorna tutta la superficie e la curva selezionata; ramo a=0 analitico.
- u: u seleziona la sezione, la curva temporale e il punto corrente; non cambia la famiglia campionata in u.
- x^0: x⁰ aggiorna tutta la superficie e la condizione iniziale di ogni risposta.

**Invarianti e limiti:**

- Stesso esempio F04, y=x solo per questa istanza.
- Nessuna nuova coordinata fisica; l'asse u è un parametro della famiglia.
- a=0 senza divisione per zero.
- Scale e tooltip mantengono unità distinte.

### Pagina 9 — contratto delle viste

**Presentazione:** linked_toggle; iniziale 2D.
**2D:** state_input_timeline.
**Superficie/traiettoria:** superficie .
**Piani/sezioni:** Sezione u_t=u corrente.
**Proiezioni/letture:** (x_t,x_{t+1}) a ingresso fissato
**Parametri e cambiamenti:**

- a: a inclina il piano e ricalcola i sei aggiornamenti.
- u: u sposta la sezione e ricalcola punti e sequenza.
- x^0: x⁰ sposta il punto della prima transizione e tutta la sequenza; non cambia il piano.

**Invarianti e limiti:**

- Non deriva dalla ODE di p8.
- I segmenti della timeline sono guide discrete, non una traiettoria continua.
- |a|≥1 non implica una garanzia di stabilità; mantenere i valori anche se escono dal riquadro, con indicatore di clipping.

### Pagina 11 — contratto delle viste

**Presentazione:** linked_toggle; iniziale 2D.
**2D:** residual_zero_line_and_original_comparison.
**Superficie/traiettoria:** superficie .
**Piani/sezioni:** r_e=0
**Proiezioni/letture:** Linea u_e=.5x_e nel piano (x_e,u_e).
**Parametri e cambiamenti:**

- x_e: Muove il candidato sul piano residuo e aggiorna f e r_e; piano e linea zero restano fissi.
- u_e: Muove il candidato e aggiorna f e r_e; non mantenerlo sulla linea zero se la coppia è incoerente.

**Invarianti e limiti:**

- Residuo nullo certifica solo equilibrio per il modello e l'inizializzazione appropriati.
- Stabilità e ottimalità non sono dedotte.

### Pagina 12 — contratto delle viste

**Presentazione:** linked_toggle; iniziale 3D.
**2D:** exact_and_linear_section_at_current_delta_u.
**Superficie/traiettoria:** superficie .
**Piani/sezioni:** Piano tangente P=2Δx+Δu alla nominale (0,0).; Sezione Δu corrente.
**Proiezioni/letture:** Curva esatta/retta della sezione; errore assoluto (Δx)².
**Parametri e cambiamenti:**

- \Delta x: Muove i due punti esatto/lineare e il segmento di errore; superfici e Jacobiani restano fissi.
- \Delta u: Cambia la sezione e le due quote correnti; lo scarto resta (Δx)².

**Invarianti e limiti:**

- Nominale (x̄,ū)=(1,0), A=2,B=1.
- La superficie è la variazione di un passo, non un landscape di stabilità.
- Δx=0: coincidenza esatta anche se Δu≠0; nessun errore relativo indefinito.

### Pagina 14 — contratto delle viste

**Presentazione:** linked_toggle; iniziale 2D.
**2D:** feasible_line_and_current_point.
**Superficie/traiettoria:** superficie .
**Piani/sezioni:** Piano verticale h=0; maschera z₁≥0.
**Proiezioni/letture:** Z nel piano (z₁,z₂), troncato dal solo viewport.
**Parametri e cambiamenti:**

- z₁: Aggiorna (z₁,z₂,ℓ), h e g; superficie e insieme restano fissi.
- z₂: Aggiorna la seconda coordinata, quota di costo e appartenenza; non proiettare automaticamente su Z.

**Nuovi controlli — enrichment:**

- z₁: [-1,2], default 0.5 1.
- z₂: [-1,2], default 0.5 1.

**Invarianti e limiti:**

- Stesso esempio numerico F04; nessuna ricerca del minimo in questa pagina.
- F03: n≡d solo localmente; d=2 è enrichment.
- Semiretta ammissibile non limitata, anche se il viewport è finito.
- z₁=.5,z₂=.5: ℓ=.25,h=0,g=−.5.
- h=0 da solo non basta se z₁<0.

### Pagina 16 — contratto delle viste

**Presentazione:** linked_toggle; iniziale 3D.
**2D:** contours_at_cost_.5_1_2_4.
**Superficie/traiettoria:** superficie .
**Piani/sezioni:** Non necessari.
**Proiezioni/letture:** Curve di livello sul piano base; costo del punto fisso (1,1).
**Parametri e cambiamenti:**

- w_1: Ricalcola superficie, livelli e contributo .5w₁; modifica curvatura lungo z₁.
- w_2: Ricalcola superficie, livelli e contributo .5w₂; modifica curvatura lungo z₂.

**Invarianti e limiti:**

- Punto (1,1), riferimento (0,0) fissi.
- Warning F03 vicino alla formula anche nella vista 3D.
- Nessun valore calcolato dalla riga errata.
- Un peso zero: cilindro parabolico e livelli non chiusi.
- Entrambi zero: piano a quota zero; non inventare curvatura per il rendering.
- Default: ℓ(1,1)=2.5.

### Pagina 17 — contratto delle viste

**Presentazione:** linked_toggle; iniziale 2D.
**2D:** feasible_mask_and_zero_contour.
**Superficie/traiettoria:** superficie .
**Piani/sezioni:** g=0
**Proiezioni/letture:** Maschera g≤0 sul piano (z₁,z₂); contorno g=0.
**Parametri e cambiamenti:**

- a: a cambia superficie, segno e regione lungo la prima coordinata.
- b: b cambia superficie e regione lungo la seconda coordinata.
- c: c trasla verticalmente g e aggiorna regione, degenerazioni e contorno zero.

**Invarianti e limiti:**

- Inserto unitario dell'uguaglianza Q=I₂,q=0,c=1 rimane fisso e separato.
- Nota F03 sulla figura qualitativa resta locale.
- Non è un insieme con una terza variabile decisionale.
- a=b=c=0: superficie zero, piano interamente ammissibile; contorno zero è il piano intero, non una curva.
- a,b>0,c=0: solo origine; c<0: vuoto.
- Segni misti: segnalare non limitatezza, non dedurla dal ritaglio.

### Pagina 18 — contratto delle viste

**Presentazione:** linked_toggle; iniziale 2D.
**2D:** constrained_parabola_at_current_reference.
**Superficie/traiettoria:** superficie .
**Piani/sezioni:** z=b sul primo asse (decisione z), non sull'asse verticale ℓ: separazione delle decisioni ammissibili.; z̄ corrente: singolo problema scalare.
**Proiezioni/letture:** Sezione del costo e minimo vincolato, come in F04.
**Parametri e cambiamenti:**

- \bar z: Seleziona sezione di riferimento e relativo minimo; la famiglia completa resta fissa.
- b: Sposta il taglio z=b, aggiorna regione ammissibile e curva dei minimi della famiglia.

**Invarianti e limiti:**

- Soluzione chiusa solo dell'esempio scalare; nessun solver generale.
- z̄=b: cambio di vincolo attivo senza salto della soluzione.

### Pagina 19 — contratto delle viste

**Presentazione:** linked_toggle; iniziale 3D.
**2D:** timeline_with_two_residuals.
**Superficie/traiettoria:** superficie .
**Piani/sezioni:** x₁=1 impone il primo aggiornamento.; r₁_dyn=0 impone il secondo.
**Proiezioni/letture:** Piano (x₁,x₂) con i due vincoli distinti.
**Parametri e cambiamenti:**

- x_2: Muove il punto solo sulla sezione x₁=1 e aggiorna il residuo della seconda transizione; non propaga stati.

**Invarianti e limiti:**

- x₁=1,x₀=0,u₀=1,u₁=−.5 restano fissi per la candidata.
- La superficie esplora candidati: non tutti i suoi punti sono traiettorie.
- INFO F03: mappe f₀,f₁ correttamente indicizzate.
- x₂=.8: quota residuo −.3.
- Il solo piano residuo zero non impone r₀=0.

### Pagina 20 — contratto delle viste

**Presentazione:** linked_toggle; iniziale 2D.
**2D:** stage_and_terminal_cost_bars.
**Superficie/traiettoria:** superficie .
**Piani/sezioni:** Non necessari.
**Proiezioni/letture:** Barre F04 alla coppia di pesi corrente.
**Parametri e cambiamenti:**

- α: Sposta il punto lungo l'asse α e aggiorna contributi di stato; famiglia α,β invariata.
- β: Sposta il punto lungo β e aggiorna contributi d'ingresso; famiglia invariata.
- γ: Trasla tutta la superficie di .125Δγ e aggiorna il solo terminale.

**Invarianti e limiti:**

- Stati e ingressi della candidata non cambiano.
- α,β sono parametri di valutazione, non variabili dell'OCP.

### Pagina 21 — contratto delle viste

**Presentazione:** linked_toggle; iniziale 2D.
**2D:** reachable_interval_and_target.
**Superficie/traiettoria:** superficie .
**Piani/sezioni:** r_T=0
**Proiezioni/letture:** Box degli ingressi e linea u₀+u₁=1.
**Parametri e cambiamenti:**

- b: b cambia dominio del box e porzione di superficie visibile; aggiorna intersezione e raggiungibile [−2b,2b].

**Invarianti e limiti:**

- Nessun costo assegnato.
- Non aggiungere un path constraint implicito sullo stato terminale.
- b=0: box ridotto a un punto, residuo −1.
- b=.5: unica intersezione sul vertice (.5,.5).

### Pagina 22 — contratto delle viste

**Presentazione:** linked_toggle; iniziale 2D.
**2D:** fixed_candidate_and_cost_bars.
**Superficie/traiettoria:** superficie .
**Piani/sezioni:** Piano verticale x₁=u₀; linea sollevata sulla superficie.
**Proiezioni/letture:** (u₀,x₁): candidato, desiderato e relazione dinamica.
**Parametri e cambiamenti:**

- R: R cambia curvatura lungo u₀ e altezza della candidata, ma non le sue coordinate u₀,x₁.
- Q_T: Q_T cambia curvatura lungo x₁ e costo terminale; candidata e riferimento restano fissi.

**Invarianti e limiti:**

- Nessun marcatore di minimo vincolato in p22: qui si valuta, non si ottimizza.
- Nota F03 sul riferimento iniziale visibile.
- Q_T=0: cilindro; R resta positivo.

### Pagina 23 — contratto delle viste

**Presentazione:** linked_toggle; iniziale 3D.
**2D:** box_endpoint_line_and_timeline.
**Superficie/traiettoria:** superficie .
**Piani/sezioni:** u₀+u₁=d_target
**Proiezioni/letture:** Box e segmento ammissibile nel piano degli ingressi.
**Parametri e cambiamenti:**

- d_{\mathrm{target}}: Muove il piano endpoint e, se fattibile, il punto (d/2,d/2,d²/4); superficie costo fissa.
- b: Cambia box/maschera e fattibilità; non tagliare gli ingressi per fingere di soddisfare l'endpoint.

**Invarianti e limiti:**

- Soluzione analitica della sola istanza F04.
- x₀=0 imposto in r nell'esempio, non attribuito come vincolo separato della formula generale.
- Infeasible: nessun minimo/valore ottimo mostrato.
- |d_target|=2b: soluzione sul bordo incluso.

### Pagina 24 — contratto delle viste

**Presentazione:** linked_toggle; iniziale 2D.
**2D:** desired_and_actual_time_series.
**Superficie/traiettoria:** curva/percorso .
**Piani/sezioni:** Non necessari.
**Proiezioni/letture:** (t,y_t) e (t,e_t), stesso indice.
**Parametri e cambiamenti:**

- c: Aggiorna i tre punti (t,y_t,e_t) e la proiezione temporale; nessun ingresso u₂.

**Nuovi controlli — enrichment:**

- c: [0,1], default 1 input unit.

**Invarianti e limiti:**

- y₂des=2 è una scelta aggiunta per completare il confronto; non un dato della fonte.
- Candidata fattibile per il limite aggiunto |u_t|≤1; nessun ottimo calcolato.
- Guide tra campioni senza interpolazione attribuita al modello discreto.
- c=0: stato fermo con errore −2 agli ultimi due campioni.
- Default c=1: errori (0,−1,0).

### Pagina 25 — contratto delle viste

**Presentazione:** linked_toggle; iniziale 2D.
**2D:** reduced_cost_section_on_dynamics.
**Superficie/traiettoria:** superficie .
**Piani/sezioni:** x₁=u₀
**Proiezioni/letture:** ℓ(u₀,u₀) e minimo analitico.
**Parametri e cambiamenti:**

- R: R aggiorna superficie, sezione, minimo e contributi.
- Q_T: Q_T aggiorna superficie e soluzione; se zero il minimo vincolato è u₀=0.
- a: a trasla il riferimento lungo x₁; ricalcola superficie e minimo vincolato.

**Invarianti e limiti:**

- Stesso modello e scala di p22; differisce la scelta ottima, non la dinamica.
- R>0,Q_T≥0 garantiscono denominatore positivo solo nel piccolo esempio.

### Pagina 26 — contratto delle viste

**Presentazione:** linked_toggle; iniziale 2D.
**2D:** planar_drone_and_acceleration_vectors.
**Superficie/traiettoria:** superficie .
**Piani/sezioni:** p̈_y=0
**Proiezioni/letture:** (u₁,u₂) con quota di accelerazione e punto corrente.
**Parametri e cambiamenti:**

- u_1: u₁ muove il punto e aggiorna tutte le accelerazioni; superficie a θ fissato invariata.
- u_2: u₂ muove il punto e aggiorna somma/differenza degli ingressi.
- θ: θ aggiorna tutta la superficie verticale, p̈_x e vettore planare; non aggiunge una posizione fuori piano.

**Invarianti e limiti:**

- Modello fisico sempre 2D e a sei stati nel seguito.
- La terza coordinata del grafico è accelerazione, non p_z.
- INFO F03 planare conservata; niente simulazione temporale in p26.
- p̈_y=0 da sola non implica hover: verificare anche p̈_x,θ̈ e velocità.

### Pagina 27 — contratto delle viste

**Presentazione:** linked_toggle; iniziale 3D.
**2D:** altitude_and_velocity_time_series.
**Superficie/traiettoria:** curva/percorso .
**Piani/sezioni:** Non necessari.
**Proiezioni/letture:** (τ,p_y), (τ,v_y); selezione temporale comune.
**Parametri e cambiamenti:**

- δ: δ ricampiona tutti i punti Euler a durata fisica 1 s fissa e l'errore; la curva analitica resta invariata. Playback torna in pausa a τ=0.

**Invarianti e limiti:**

- p_y=x₃,v_y=x₄; ordine dei sei stati immutato.
- Terza coordinata = velocità esistente, non quota spaziale aggiuntiva.
- Play/scrub ispeziona dati calcolati, non cambia ingresso o metodo.
- δ=.1: finale (.9855,2.19); continuo (1.095,2.19).
- Guide Euler tratteggiate tra campioni; non renderle una soluzione ODE esatta.

### Pagina 28 — contratto delle viste

**Presentazione:** linked_toggle; iniziale 2D.
**2D:** requirement_table_and_linked_time_series.
**Superficie/traiettoria:** curva/percorso .
**Piani/sezioni:** Non necessari.
**Proiezioni/letture:** (τ,p_y),(τ,v_y); tabella requisiti dello stesso campione.
**Parametri e cambiamenti:**

- k: Muove il cursore e i marker in entrambe le viste; mostra Δp_y e Δv_y, senza assegnare pesi o soglie.

**Nuovi controlli — enrichment:**

- k: [1,10], default 10 step; intero.

**Invarianti e limiti:**

- Reference numerico e profilo verticale sono enrichment, non dati della slide.
- Le componenti non visualizzate mantengono p_x=v_x=θ=ω=0 e u₁=u₂=6 del fixture.
- Non imporre θdes=ωdes=0 o limiti hard come se fossero scritti nella pagina.
- Il riferimento continuo campionato non è dichiarato una traiettoria esatta di Euler.
- Al campione 10: errore quota −.1095 m ed errore velocità zero.
- Posizione corretta da sola non verifica tutti i requisiti.

### Pagina 29 — contratto delle viste

**Presentazione:** linked_toggle; iniziale 3D.
**2D:** stage_cost_contributions.
**Superficie/traiettoria:** superficie .
**Piani/sezioni:** Non necessari.
**Proiezioni/letture:** Contorni nello spazio (e_px,θ); barre del punto fissato.
**Parametri e cambiamenti:**

- q_1: q₁ cambia la curvatura lungo e_px e il contributo di posizione.
- q_5: q₅ cambia la curvatura lungo θ e il contributo angolare.
- r_1: r₁ trasla la superficie di 2Δr₁ e aggiorna la barra del primo ingresso.
- r_2: r₂ trasla la superficie di 2Δr₂ e aggiorna la barra del secondo ingresso.

**Invarianti e limiti:**

- È una sezione del costo di stadio, non una traiettoria ottima o un costo totale con terminale.
- Ingressi penalizzati rispetto a zero, non rispetto all'hover.
- Punto e ingressi della candidata restano fissi.
- q₁=q₅=0: superficie piana a quota 2r₁+2r₂.
- Default:1+.05+1+1=3.05.

### Pagina 30 — contratto delle viste

**Presentazione:** linked_toggle; iniziale 2D.
**2D:** altitude_band_and_input_index_timeline.
**Superficie/traiettoria:** superficie .
**Piani/sezioni:** V=0; b_min corrente
**Proiezioni/letture:** Intervallo di quota della sola sezione corrente.
**Parametri e cambiamenti:**

- p_y^{min}: Il minimo seleziona una sezione della famiglia e muove il punto; aggiorna fascia e ammissibilità, non riordina i limiti.
- p_y^{max}: Il massimo aggiorna tutta la superficie, il punto e la fascia ammissibile.
- p_y: La quota muove il punto lungo la sezione corrente e aggiorna i due residui e V.

**Invarianti e limiti:**

- Nessuna nuova coordinata spaziale.
- F03: input 0…T−1, quote 1…T, x₀ separato, nessun u_T.
- Warning correttivo resta vicino agli indici, anche se il grafico cambia modalità.
- min=max: unico valore ammissibile nella sezione.
- min>max: sezione interamente inammissibile, pur potendo esistere sezioni ammissibili per altri minimi.
- 3.2 con min1,max3: V=.2.

### Pagina 31 — contratto delle viste

**Presentazione:** linked_toggle; iniziale 2D.
**2D:** time_series_running_area_and_terminal_bar.
**Superficie/traiettoria:** superficie .
**Piani/sezioni:** c corrente
**Proiezioni/letture:** x(t),u(t), running cost e valore terminale del profilo corrente.
**Parametri e cambiamenti:**

- c: c seleziona la sezione e ricalcola running/terminale; la superficie della famiglia è invariata.
- T: T cambia il dominio temporale della superficie e i due contributi al costo.

**Invarianti e limiti:**

- La famiglia a un parametro non rappresenta tutto 𝓕 o tutta 𝓣.
- Nessun terminal constraint aggiunto; domini [0,T] e [0,T) della fonte conservati.

### Pagina 32 — contratto delle viste

**Presentazione:** linked_toggle; iniziale 3D.
**2D:** selected_piecewise_input_and_state.
**Superficie/traiettoria:** superficie .
**Piani/sezioni:** c₂ corrente
**Proiezioni/letture:** u(t),x(t) della coppia selezionata.
**Parametri e cambiamenti:**

- c₁: Ricalcola l'intera superficie; cambia u nel primo tratto e x in tutto l'intervallo.
- c₂: Seleziona la sezione; cambia u solo nel secondo tratto e x dopo t=1. La famiglia campionata in c₂ non cambia.

**Nuovi controlli — enrichment:**

- c₁: [-1,1], default 1 state unit/s.
- c₂: [-1,1], default -1 state unit/s.

**Invarianti e limiti:**

- K=2 resta fisso; due coefficienti finiti, una sezione parametrica visualizzata per volta.
- Convenzione enrichment del fixture: stato assolutamente continuo e ẋ=u quasi ovunque; non si richiede una derivata classica all'istante del cambio, né si attribuisce questa regolarità a 𝓕 nella fonte.
- Nessuna prova di struttura differenziabile di 𝓣.
- Il terminal cost del problema generale non è rimosso.
- x continuo a t=1, ingresso può saltare: separare i rami nel grafico di u e usare il secondo valore esattamente a t=1.
- La mesh dello stato include t=1 e conserva la piega, senza smoothing che cambi la funzione.
- c₁=1,c₂=−1: x(1)=1,x(2)=0.
- Parametrizzazione finita non esaurisce 𝓕.

### Pagina 33 — contratto delle viste

**Presentazione:** linked_toggle; iniziale 3D.
**2D:** pendulum_diagram_and_acceleration_section.
**Superficie/traiettoria:** superficie .
**Piani/sezioni:** ẋ₂=0; u corrente
**Proiezioni/letture:** Sezione seno a coppia corrente.
**Parametri e cambiamenti:**

- θ: θ muove il punto e lo schema del pendolo; superficie globale invariata.
- u: u seleziona la sezione, muove il punto e trasla la curva 2D; famiglia globale invariata.

**Invarianti e limiti:**

- Una sola lunghezza e una sola massa, alias F03 locali.
- Nessun attrito, damping, seno linearizzato o quarto stato.
- Accelerazione nulla non certifica stabilità.
- θ=π/6,u=0: −4.905.
- u=4.905 annulla l'accelerazione a π/6, non una velocità arbitraria.

### Pagina 34 — contratto delle viste

**Presentazione:** linked_toggle; iniziale 3D.
**2D:** two_equilibrium_poses_and_angle_torque_projection.
**Superficie/traiettoria:** curva/percorso .
**Piani/sezioni:** x₂,e=0
**Proiezioni/letture:** (θ_e,u_e); due configurazioni planari F04.
**Parametri e cambiamenti:**

- θ_e^1: Sposta il primo marker lungo E, aggiorna u_e¹ e i due residui corretti; curva E fissa.
- θ_e^2: Sposta il secondo marker e aggiorna u_e² e residui; nessuna animazione di trasferimento.

**Invarianti e limiti:**

- CORRECTION_WARNING F03 adiacente a x₂,e=0.
- Mai imporre x₁,e=0 né calcolare il residuo della riga errata.
- La curva è un luogo di equilibri, non una traiettoria del pendolo.
- Angoli coincidenti: marker coincidenti e task degenere.
- Velocità dell'intera curva esattamente zero, anche se la camera usa un range grafico non nullo.

### Pagina 35 — contratto delle viste

**Presentazione:** linked_toggle; iniziale 2D.
**2D:** two_reference_time_series.
**Superficie/traiettoria:** curva/percorso .
**Piani/sezioni:** Non necessari.
**Proiezioni/letture:** (t,x₁des) e (t,udes), rami aperto/chiuso concordi.
**Parametri e cambiamenti:**

- θ_e^1: Cambia il primo segmento e la coppia derivata; nessun moto del corpo.
- θ_e^2: Cambia il secondo segmento e la sua coppia.
- T: Cambia dominio e posizione di T/2, non ampiezze o coppie.

**Invarianti e limiti:**

- Etichetta permanente riferimento; niente interpolazione fra i due livelli per angoli distinti.
- Il secondo ramo include T/2.
- Nessun avviso editoriale aggiuntivo: è il concetto didattico della fonte.
- Angoli uguali: un solo riferimento costante, potenzialmente traiettoria di equilibrio.
- Nessun playback di un pendolo che teletrasporta.

### Pagina 36 — contratto delle viste

**Presentazione:** linked_toggle; iniziale 3D.
**2D:** fixed_candidate_time_series_and_integral_terminal_bars.
**Superficie/traiettoria:** superficie curva/percorso .
**Piani/sezioni:** Non necessari.
**Proiezioni/letture:** (t,running cost) della candidata e barre integrale/terminale.
**Parametri e cambiamenti:**

- q_1: q₁ cambia curvatura della superficie in e e il contributo integrale; candidata fisica immutata.
- r: r trasla solo il ramo destro della superficie perché udes=0 nel sinistro; aggiorna il contributo ingresso.
- q_{T1}: q_T1 aggiorna solo barra terminale e costo totale, senza cambiare la superficie del running cost.

**Invarianti e limiti:**

- Nessun fattore ½.
- x₂=u=0 sono una candidata esattamente fattibile del fixture, non una soluzione ottima.
- Superficie su errori istantanei: i suoi punti non sono tutti traiettorie fattibili.
- Tagliare la mesh a t=1; il salto riguarda il riferimento/costo, non lo stato fisico.
- t=1 appartiene al secondo ramo.
- q₁=0: piani per ramo; q_T1=0: terminale nullo.
- Default running destro 2.68005818; terminale .54831136; totale 3.22836953.

## 5. COMPONENT INVENTORY UPDATE

9 componenti visuali canonici, oltre ai 4 componenti non visuali F04 EquationCard, WarningBanner, InfoNote e ParameterControl. La conta non somma alias, varianti 2D/3D o composizioni. L'inventario F04 resta storico; quello effettivo per F05 è visualization_architecture.
FunctionExplorer riunisce FunctionPlot, ContourPlot e la parte grafica di ConstraintVisualizer. TrajectoryViewer assorbe TimeSeriesPlot e i plot di traiettoria/stato. ProjectionLink e SceneViewport forniscono sincronizzazione e camera condivise.

| Componente canonico | Responsabilità/contratto |
| --- | --- |
| FunctionExplorer | Grafici scalari 2D, contorni, superfici/mesh 3D, maschere ammissibili, sezioni e overlay vettoriali. Un solo dataset matematico; modalità curve/contour/surface/vector_field; limiti, unità, discontinuità, livelli e sezioni espliciti. Il layer vector_field accetta campioni vettoriali 2D/3D da moduli verificati, senza inventare una dinamica. |
| TrajectoryViewer | Serie temporali, percorsi e spazi stato–ingresso in due o tre coordinate. Assi per mappa dichiarata xy/xyt/xyz/state_input; segmenti discreti o discontinui espliciti; playback solo per dataset temporali validi. Una curva di equilibri non è un moto. |
| ProjectionLink | Cursore, selezione e sezioni sincronizzati fra rappresentazioni. Unico ID di campione/punto/parametro; bidirezionalità, unità e selezione coerenti. Una proiezione non modifica il modello. |
| SceneViewport | Camera, assi, tooltip, picking e ciclo di vita del renderer nativo 3D. Orbit, zoom, pan, reset camera, vista ortografica, lettura coordinate, risorse GPU smaltite; reset camera distinto da reset dei dati. |
| ModelDiagram | Schemi concettuali, feedback e configurazioni fisiche planari F04. Mantiene la funzione F04; lo schema fisico non acquisisce nuovi stati quando si attiva un grafico 3D. |
| VectorVisualizer | Ordine e dimensioni di vettori e stack. Nessuna prospettiva decorativa sui simboli; ordine del corso immutato. |
| CostBreakdown | Contributi e totale, condivisi da tutte le viste. Fattore ½, running/terminale e modalità candidata/ottimo espliciti, senza normalizzazione globale. |
| StateInputTimeline | Indici e residui di transizione. T+1 stati, T ingressi e domini dei vincoli indipendenti; nessun u_T. |
| ComparisonTable | Confronti e alternativa testuale/numerica dei grafici. Dati numerici condivisi col grafico; accesso senza gesti 3D o colore. |

Valutazione delle 15 proposte richieste:

| Proposta | Astrazione/variante |
| --- | --- |
| FunctionPlot2D | FunctionExplorer: curve |
| SurfacePlot3D | FunctionExplorer: surface/wireframe/mesh |
| ContourPlot2D | FunctionExplorer: contour |
| FunctionExplorer2D3D | FunctionExplorer + ProjectionLink + SceneViewport |
| TrajectoryPlot2D | TrajectoryViewer: xy/time_series |
| TrajectoryPlot3D | TrajectoryViewer: xyt/xyz/state_input |
| StateSpace2D | TrajectoryViewer o FunctionExplorer, secondo dataset traiettoria/campo |
| StateSpace3D | TrajectoryViewer o FunctionExplorer, assi dichiarati, nessuna distanza euclidea implicita fra unità diverse |
| ConstraintSurface3D | FunctionExplorer: residuo + piano zero + maschera |
| FeasibleRegion2D | FunctionExplorer: maschera/contorno |
| Linearization3D | FunctionExplorer: superficie esatta + piano tangente + ProjectionLink |
| VectorField2D | FunctionExplorer: vector_field, dati di un campo matematicamente definito |
| VectorField3D | Stessa astrazione: vector_field 3D nativo, capacità richiesta allo stack F05; nessun campo fittizio aggiunto alle pagine |
| TimeSeriesPlot | TrajectoryViewer: time_series; alias della stessa base |
| Projection2D3D | ProjectionLink |

I campi vettoriali 2D/3D sono una capacità nativa dell'astrazione e un criterio di scelta F05, anche se non vengono forzati nelle 36 pagine: dove un campo non è definito, non si inventano frecce o dinamiche.
Protocollo dati comune: semantica/unità/domino di ciascun asse, funzione o campioni, segmenti discontinui, ID del punto selezionato, mappe di proiezione, provenienza e calculation_policy. Tutte le viste consumano gli stessi valori.

## 6. REQUIREMENTS FOR F05

GRAPHICS_REQUIREMENT = FULL_2D_AND_3D_SUPPORT

3D_VISUALIZATION_POLICY = "Prefer 3D or combined 2D/3D whenever a meaningful third mathematical dimension exists; avoid it only when it would be irrelevant or misleading."

- Selezionare uno stack grafico con 2D e 3D nativi già nella vertical slice: superfici, mesh, curve, campi vettoriali e proiezioni collegate.
- Verificare orbit/zoom/pan/reset, picking, tooltip e coordinate con unità; alternative da tastiera e tabella numerica.
- Unico dato matematico per tutte le viste, incluse geometrie degeneri e discontinuità senza interpolazione artificiale.
- Aggiornamenti dei controlli in tempo reale con invalidazione delle sole superfici o selezioni coinvolte; nessun ottimo ricalcolato per le candidate fisse.
- F03 obbligatoria in ogni modalità; il PDF a sinistra resta originale.
- F05 deve motivare la scelta dello stack con prove locali dei casi p12,p16,p17,p27,p30,p34; non rinviare il 3D a una fase futura.
- Misurare fluidità e uso memoria sul dispositivo target; smaltire risorse 3D al cambio pagina, testare ridimensionamento e perdita/ripristino del contesto grafico.
- Se il 3D non è disponibile, mostrare spiegazione e alternativa 2D/accessibile; questo fallback non soddisfa da solo il gate FULL_2D_AND_3D_SUPPORT.
- Nessun renderer o stack viene installato o implementato durante F04.1.

Criteri di accettazione da eseguire nell'implementazione F05:

- P16: in 2D/3D il punto (1,1) ha costo 2.5; cambiare w₂ modifica solo il secondo peso.
- P12: superficie e piano danno .21 e .2 a (.1,0), errore .01; la sezione 2D coincide.
- P17: campitura g≤0 coincide con la proiezione della superficie sotto zero, anche nei casi degeneri.
- P27: Euler a δ=.1 dà quota .9855 e velocità 2.19 a 1 s; stesso cursore in 2D/3D.
- P30: min>max produce sezione vuota e warning indici resta visibile, senza u_T.
- P34: curva con x₂,e=0 e punto (π/6,0,4.905), due residui dinamici nulli.
- Toggle/camera non cambiano alcun risultato numerico o formula; nessuna modifica al PDF o ai PAGE_SPEC.
- Nessuna mesh attraversa il salto di p36 e nessun segmento di p35 simula un trasferimento fisico.

F03 resta l'autorità: p16 superficie e contorni usano w₂ nel secondo termine; p30 separa indici input e quota; p34 usa x₂,e=0. Gli avvisi originali F03 rimangono adiacenti alle formule al cambio vista. P36 non riceve fattori ½. Nessun warning nuovo o discussione editoriale nella UI.

## 7. IMPACT ON VERTICAL SLICE

La selezione F04 rimane [2,8,12,16,17,27,30,34]. Include 7 pagine con 3D e una pagina simbolica 2D; tutte e tre le correzioni sono ancora coperte.

| Pagina | Modalità attuale | Estensione della verifica |
| ---: | --- | --- |
| 2 | 2D_ONLY | Anello di feedback e piccolo confronto scalare sono più leggibili nel piano. |
| 8 | 2D_PRIMARY_WITH_3D | La superficie mostra come l'intera risposta dipende dall'ingresso costante, mentre la sezione temporale conserva la lettura della ODE. |
| 12 | 3D_PRIMARY_WITH_2D | Due perturbazioni indipendenti generano una superficie e un piano tangente; il grafico 2D misura lo scarto sulla sezione. |
| 16 | 3D_PRIMARY_WITH_2D | La superficie rende immediata la curvatura imposta dai pesi; livelli e sezione 2D permettono letture esatte. |
| 17 | 2D_AND_3D_EQUAL | La regione g≤0 è la proiezione dei punti della superficie che stanno sotto il piano zero. |
| 27 | 3D_PRIMARY_WITH_2D | La curva tempo–quota–velocità mostra simultaneamente i due stati verticali e distingue Euler dal moto continuo. |
| 30 | 2D_PRIMARY_WITH_3D | La superficie del residuo massimo rende visibili bordo, violazione e intervallo vuoto al variare del limite inferiore. |
| 34 | 3D_PRIMARY_WITH_2D | La curva nello spazio stato–ingresso rende esplicito che la componente nulla è la velocità e l'angolo può variare. |

Le cinque nuove interazioni statiche sono test di espansione dopo la slice: geometria p6, punto ammissibile p14, ingresso del tracking p24, cursore requisiti p28, famiglia funzionale p32. Non si cambiano le otto pagine scelte per rifare F04.
Audit: 244 controlli strutturali/editoriali, 47 fixture aritmetici. 36/36 pagine; 27/36 con 3D; 29 interattive e 7 statiche nel design effettivo.
Preservazione verificata: tutti i campi F04 sono un sottoinsieme esatto del manifest aggiornato; il Markdown F04 è conservato integralmente. Protetti byte per byte anche i 137 PAGE_SPEC e la policy F03. La baseline F04.1 registra hash e contenuto F04 precedenti.
Questi controlli non sono una prova di rendering, performance o usabilità del futuro stack. READY_FOR_F05 significa audit di progetto risolto e requisiti pronti; la scelta dello stack e le prove grafiche sono compiti della fase successiva.
Audit ripetibile: .venv/Scripts/python.exe -m pipeline.introduction_visualization_audit audit.

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
