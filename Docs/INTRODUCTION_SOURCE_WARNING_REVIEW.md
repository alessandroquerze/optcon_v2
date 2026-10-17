# F03 — Source warning policy: Introduction to Optimal Control

Revisione delle 13 issue presenti nelle 11 pagine needs_review. Il PDF originale, le immagini, il testo estratto, le formule e tutta l'analisi precedente rimangono immutabili.
Le decisioni sono aggiunte in source_warning. La companion futura usa le espressioni e le proposte effettive della policy; il lettore PDF mostra sempre la fonte originale.

Le liste finali classificano ogni pagina secondo la massima severità delle sue issue e sono disgiunte. Le singole issue NO_WARNING delle pagine 17 e 34 restano visibili nella tabella, senza eliminare gli altri avvisi di quelle pagine.

## Policy per lo studente

- CORRECTION_WARNING: piccolo avviso rosso vicino alla sola espressione interessata, con il testo short_warning.
- INFO_WARNING: nota rossa breve solo nel punto in cui chiarisce la notazione o il grafico.
- NO_WARNING: nessun avviso; i dettagli tipografici restano nei metadata.
- Le motivazioni tecniche non vengono mostrate nella UI. Niente lunghi pannelli editoriali.
- source_math è esclusivamente una trascrizione della fonte: non è l'input automatico dei calcoli. In caso di correzione, corrected_expression e calculation_policy sono vincolanti per tutti i risultati della companion.
- Esempi, grafici e simulazioni usano sempre la formula corretta. Sono escluse le vecchie proposte di calcolo/confronto numerico del refuso di pagina 16 e del residuo errato di pagina 34.

## Verifica matematica dei tre casi principali

**Pagina 16.** Per e=z−z̄ e W=diag(w₁,w₂), eᵀWe=w₁e₁²+w₂e₂². Il secondo coefficiente stampato w₁ è quindi un refuso. La companion usa ½w₁e₁²+½w₂e₂². Con W=diag(1,4), e=(1,1), il costo corretto è 2.5. Non si calcola né si visualizza il valore della riga errata.

**Pagina 30.** Lo stack definito a pagina 10 contiene u₀,…,u_{T−1}, e T transizioni richiedono esattamente questi T ingressi. Si impongono le saturazioni per t=0,…,T−1. I limiti di quota del caso illustrato restano su t=1,…,T: x_T ha un limite di stato esplicito, mentre u_T non viene creato. La condizione iniziale è un dato separato; non si estende implicitamente il dominio dei vincoli. Il caso T=1 usa u₀ e lo stato previsto x₁.

**Pagina 34.** Dalla dinamica di pagina 33, ẋ₁=x₂, la prima condizione di equilibrio è x₂,e=0. La seconda dà u_e=mgℓ sinθ_e interpretando l e ℓ come la stessa lunghezza fisica. Non serve imporre θ_e=0: gli equilibri possono avere angolo generico e coppia non nulla. Questa verifica concorda con lo stato (θ_e,0) già mostrato nella fonte.

## Altre decisioni

d/n a pagina 14 sono letti come una sola dimensione; a pagina 19 ogni transizione usa la propria f_t; a pagina 22 viene dichiarato x₀^{des}=x⁰ come default degli esempi. Sono chiarimenti informativi, non nuove affermazioni attribuite alla fonte.
La figura di pagina 17 è qualitativa: i grafici numerici seguono la disequazione, con ellisse centrata nell'origine e assi coordinati solo nel caso a,b,c>0. La pagina 26 usa il modello planare effettivamente scritto; il riferimento al 3D non autorizza una terza coordinata.
X/Z, parentesi ridondanti e varianti l/ℓ, m/M non richiedono allarmi allo studente. Per il pendolo si usa un unico parametro di lunghezza e uno di massa, conservando i glifi della fonte nelle trascrizioni. La scelta è tecnica e locale al pendolo, non un'uguaglianza globale fra simboli dell'intero corso.

## Integrità e tracciabilità

Verificati 821 file immutabili e i campi preesistenti di 137 PAGE_SPEC. Ogni issue rimanda al proprio indice nelle incertezze originali e ai riferimenti sorgente. I risultati della prima analisi non sono riscritti.
Controlli delle formule corrette: 10/10. Nessun controllo valuta consapevolmente la formula errata.
Le priorità della policy sostituiscono solo gli input della progettazione futura. I vecchi flag needs_review e blocking restano come storia dell'analisi; le issue sono risolte per il design mediante le decisioni qui registrate. READY_FOR_COMPANION_DESIGN non autorizza o dichiara completata l'implementazione.

## Tabella finale

| PAGE | ISSUE | WARNING TYPE | SOURCE | COMPANION USES | SHORT WARNING |
| ---: | --- | --- | --- | --- | --- |
| 14 | Dimensione d/n | INFO_WARNING | z\in\mathbb{R}^d,\qquad\ell(z):\mathbb{R}^d\to\mathbb{R}; h_i:\mathbb{R}^n\to\mathbb{R},\quad g_j:\mathbb{R}^n\to\mathbb{R}; Z=\{z\in\mathbb{R}^n\mid h(z)=0,\ g(z)\leq0\} | z∈R^d; h_i,g_j:R^d→R; Z⊆R^d, con n≡d in questa definizione. | ⚠ Nota: d e n indicano qui la stessa dimensione. |
| 16 | Secondo peso della forma quadratica | CORRECTION_WARNING | \ell(z)=\frac12∥z-\bar z∥_W^2=\frac12w_1(z_1-\bar z_1)^2+\frac12w_1(z_2-\bar z_2)^2 | \ell(z)=\frac12∥z-\bar z∥_W^2=\frac12w_1(z_1-\bar z_1)^2+\frac12w_2(z_2-\bar z_2)^2 | ⚠ Warning: possibile errore nella slide originale. Qui usiamo w₂ nel secondo termine invece di w₁. |
| 17 | Figura qualitativa dell'insieme | INFO_WARNING | az₁²+bz₂²−c≤0; disegno di un'ellisse inclinata e traslata. | az₁²+bz₂²−c≤0. Per a,b,c>0: ellisse centrata nell'origine, allineata agli assi. | ⚠ Nota: la figura è qualitativa; il grafico segue la formula. |
| 17 | Nome dell'insieme X/Z | NO_WARNING | Then, the constraints set X is; Z=\{z\in\mathbb{R}^d\mid z^\top Qz+q^\top z-c=0\} | Z, come nella formula dell'insieme ammissibile. | — |
| 19 | Indice temporale della dinamica sviluppata | INFO_WARNING | x_1=f(x_0,u_0)\quad\text{i.e.}\quad f_t(x_0,u_0)-x_1=0; x_2=f(x_1,u_1)\quad\text{i.e.}\quad f_t(x_1,u_1)-x_2=0; x_T=f(x_{T-1},u_{T-1})\quad\text{i.e.}\quad f_t(x_{T-1},u_{T-1})-x_T=0 | f_t(x_t,u_t)−x_{t+1}=0, t=0,…,T−1; righe f₀, f₁, …, f_{T−1}. | ⚠ Nota: ogni transizione usa la propria mappa f_t. |
| 22 | Riferimento iniziale non elencato | INFO_WARNING | Costo con somma da t=0; x_t^{des} elencato per t=1,…,T; x₀=x⁰. | x_0^{\mathrm{des}}=x^0 come default esplicito degli esempi; il costo mantiene t=0. | ⚠ Nota: negli esempi il riferimento iniziale coincide con x⁰. |
| 26 | Ambito planare rispetto alla frase 3D | INFO_WARNING | Consider a planar drone model; given time law in the 3D space. | Moto nel piano (p_x,p_y), con θ; uscita y_t=(p_{x,t},p_{y,t}). Nessuna terza coordinata. | ⚠ Nota: il modello usato qui è planare, in due dimensioni. |
| 30 | Indici distinti per ingressi e stati previsti | CORRECTION_WARNING | g(\mathbf{x},\mathbf{u})\leq0,\quad t=1,\ldots,T\ \text{nella prosa}; u_t^{\min}\leq u_t\leq u_t^{\max} | u_t^{\min}\leq u_t\leq u_t^{\max},\quad t=0,\ldots,T-1;\qquad p_{y,t}^{\min}\leq p_{y,t}\leq p_{y,t}^{\max},\quad t=1,\ldots,T | ⚠ Warning: possibile errore nella slide originale. Gli ingressi usano t=0,…,T−1; le quote t=1,…,T. |
| 31 | Parentesi tipografiche ridondanti | NO_WARNING | \min_{(x(\cdot),u(\cdot))\in\mathcal F}\ \int_0^T\ell_\tau(x(\tau),u(\tau))\,d\tau+\ell_T(x(T))); \mathcal T=\{(x(\cdot),u(\cdot)))\in\mathcal F\mid\dot x(t)=f_t(x(t),u(t)),\ t\in[0,T]\} | \ell:\mathcal F\to\mathbb R,\qquad\ell(x(\cdot),u(\cdot))=\int_0^T\ell_\tau(x(\tau),u(\tau))\,d\tau+\ell_T(x(T)); coppia (x(·),u(·)) con delimitatori bilanciati. | — |
| 33 | Varianti tipografiche di lunghezza e massa | NO_WARNING | g/l;\quad 1/(m\ell^2);\quad Mg nel disegno. | Notazione del modello conservata; l≡ℓ è una sola lunghezza, m≡M una sola massa nel pendolo. | — |
| 34 | Componente nulla all'equilibrio | CORRECTION_WARNING | 0=x_{1,e} | 0=x_{2,e};\qquad u_e=mg\ell\sin x_{1,e}\quad(l\equiv\ell). | ⚠ Warning: possibile errore nella slide originale. La condizione di equilibrio corretta è x₂,e=0. |
| 34 | Lunghezza nella coppia di equilibrio | NO_WARNING | 0=-\frac{g}{l}\sin x_{1,e}+\frac{1}{m\ell^2}u_e; x_e^1=\begin{bmatrix}\theta_e^1\\0\end{bmatrix},\qquad u_e^1=mg\ell\sin\theta_e^1 | u_e=mg\ell\sin\theta_e,\quad l\equiv\ell. | — |
| 36 | Glifi della lunghezza nel modello finale | NO_WARNING | g/l;\qquad 1/(m\ell^2). | Equazioni e costo della fonte conservati; l≡ℓ è un solo parametro di lunghezza. | — |

PAGES_WITH_CORRECTION_WARNING = [16, 30, 34]

PAGES_WITH_INFO_WARNING = [14, 17, 19, 22, 26]

PAGES_WITH_NO_WARNING_AFTER_REVIEW = [31, 33, 36]

UNRESOLVED_ISSUES = 0

READY_FOR_COMPANION_DESIGN = YES
