import type {FormulaExplanation} from '../../components/ExplainedEquation';
export const projectionFormulaNotes = {
  "47": [],
  "48": [
    {
      "formulaId": "opt48-condition",
      "latex": "\\nabla\\ell(z^*)^\\top(\\bar z-z^*)\\ge0,\\quad\\forall\\bar z\\in\\mathbb Z",
      "conceptualExplanation": "Su Z non vuoto, chiuso e convesso, ogni minimo locale di ℓ∈C¹ soddisfa il confronto. ℓ può essere non convessa.",
      "purpose": "Leggere ipotesi e necessità della condizione.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [
        "La convessità di Z mantiene ammissibile il segmento da z* a ogni z̄. La derivata destra del costo lungo quel segmento non può essere negativa.",
        "Se anche ℓ è convessa, il supporto del primo ordine rende la condizione sufficiente al minimo globale.",
        "Per un costo non convesso, gradiente zero può rendere tutti i prodotti nulli anche in un massimo."
      ],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt48-theta",
          "explanation": "Muove z̄ sul bordo del disco; costo, candidato e minimo analitico del prodotto restano fissi."
        }
      ],
      "origin": "source",
      "sourceFormulaIds": [
        "opt48-condition"
      ]
    },
    {
      "formulaId": "opt48-problem",
      "latex": "\\min_{z\\in\\mathbb Z}\\ell(z)",
      "conceptualExplanation": "Si minimizza solo tra punti ammissibili, non su tutto Rᵈ.",
      "purpose": "Distinguere insieme convesso e costo convesso.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt48-theta",
          "explanation": "Muove z̄ sul bordo del disco; costo, candidato e minimo analitico del prodotto restano fissi."
        }
      ],
      "origin": "source",
      "sourceFormulaIds": [
        "opt48-problem"
      ]
    },
    {
      "formulaId": "opt48-example",
      "latex": "\\mathbb Z=\\{z:\\|z\\|\\le1\\},\\quad\\ell_1(z)=\\tfrac12((z_1-2)^2+z_2^2),\\quad\\ell_2(z)=-\\tfrac12\\|z\\|^2",
      "conceptualExplanation": "Sul disco, ℓ₁ ha minimo (1,0) con gradiente (−1,0). Per ℓ₂, l’origine è un massimo con gradiente zero.",
      "purpose": "Dare sia un caso al bordo sia un controesempio alla sufficienza.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt48-theta",
          "explanation": "Muove z̄ sul bordo del disco; costo, candidato e minimo analitico del prodotto restano fissi."
        }
      ],
      "origin": "enrichment",
      "sourceFormulaIds": []
    },
    {
      "formulaId": "opt48-test",
      "latex": "\\min_{\\bar z\\in\\mathbb Z}g^\\top(\\bar z-v)=-\\|g\\|-g^\\top v",
      "conceptualExplanation": "Sul disco unitario si può verificare il confronto universale analiticamente. Il solo punto di prova non basta a dimostrarlo.",
      "purpose": "Separare sonda numerica e quantificatore universale.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [
        "g è il gradiente nel candidato v. La formula segue da min_{||z̄||≤1}gᵀz̄=−||g||, inclusa g=0.",
        "Con v=(1,0),ℓ₁ il minimo del prodotto è zero; con v=0,ℓ₁ è −2; con v=0,ℓ₂ è zero ma il punto non è minimo."
      ],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt48-theta",
          "explanation": "Muove z̄ sul bordo del disco; costo, candidato e minimo analitico del prodotto restano fissi."
        }
      ],
      "origin": "enrichment",
      "sourceFormulaIds": []
    }
  ],
  "49": [
    {
      "formulaId": "opt49-projection",
      "latex": "P_{\\mathbb Z}(z):=\\operatorname*{arg\\,min}_{y\\in\\mathbb Z}\\|y-z\\|^2",
      "conceptualExplanation": "Con Z non vuoto, chiuso e convesso, esiste un solo punto più vicino a z. Se z è già ammissibile, resta invariato.",
      "purpose": "Leggere la definizione e rispondere alla domanda della fonte.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [
        "Esistenza: una successione minimizzante resta in una palla limitata attorno a z; una sottosuccessione converge e la chiusura mantiene il limite in Z.",
        "Unicità: la distanza quadratica è strettamente convessa in y; due minimi distinti avrebbero un punto medio ammissibile con valore minore.",
        "Z non vuoto è essenziale, ereditato dalla pagina 48. Z non deve essere compatto.",
        "Su un insieme non convesso la proiezione può non essere unica; su un insieme aperto può non essere raggiunta."
      ],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt49-x",
          "explanation": "Muove z e ricalcola proiezione, distanze e segmento; insieme e candidato angolare restano fissi."
        },
        {
          "controlId": "opt49-y",
          "explanation": "Muove z nella seconda direzione e ricalcola la proiezione."
        },
        {
          "controlId": "opt49-theta",
          "explanation": "Muove y sul bordo per confrontare la sua distanza con quella minima; non cambia la proiezione."
        }
      ],
      "origin": "source",
      "sourceFormulaIds": [
        "opt49-projection"
      ]
    },
    {
      "formulaId": "opt49-example",
      "latex": "\\mathbb Z_1=\\{y:\\|y\\|\\le1\\},\\qquad\\mathbb Z_2=[-1,1]^2",
      "conceptualExplanation": "Disco e quadrato hanno proiezioni analitiche. Il punto viola è un altro candidato ammissibile, non un secondo minimo.",
      "purpose": "Dare coordinate alla geometria senza attribuirle alla figura della fonte.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt49-x",
          "explanation": "Muove z e ricalcola proiezione, distanze e segmento; insieme e candidato angolare restano fissi."
        },
        {
          "controlId": "opt49-y",
          "explanation": "Muove z nella seconda direzione e ricalcola la proiezione."
        },
        {
          "controlId": "opt49-theta",
          "explanation": "Muove y sul bordo per confrontare la sua distanza con quella minima; non cambia la proiezione."
        }
      ],
      "origin": "enrichment",
      "sourceFormulaIds": []
    },
    {
      "formulaId": "opt49-characterization",
      "latex": "(z-p)^\\top(y-p)\\le0,\\quad p=P_{\\mathbb Z}(z),\\ y\\in\\mathbb Z",
      "conceptualExplanation": "Lo spostamento da p verso z forma un angolo non acuto con ogni direzione ammissibile da p. Al bordo del quadrato non serve inventare una tangente unica.",
      "purpose": "Spiegare la geometria della proiezione.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [
        "Sul disco la proiezione è z/max(1,||z||); sul quadrato si proietta ogni coordinata su [−1,1].",
        "Per p proiezione, ||z−y||²−||z−p||²=||y−p||²−2(z−p)ᵀ(y−p)≥0."
      ],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt49-x",
          "explanation": "Muove z e ricalcola proiezione, distanze e segmento; insieme e candidato angolare restano fissi."
        },
        {
          "controlId": "opt49-y",
          "explanation": "Muove z nella seconda direzione e ricalcola la proiezione."
        },
        {
          "controlId": "opt49-theta",
          "explanation": "Muove y sul bordo per confrontare la sua distanza con quella minima; non cambia la proiezione."
        }
      ],
      "origin": "enrichment",
      "sourceFormulaIds": []
    }
  ],
  "50": [
    {
      "formulaId": "opt50-update",
      "latex": "z^{k+1}=P_{\\mathbb Z}\\big(z^k-\\gamma^k\\nabla\\ell(z^k)\\big)",
      "conceptualExplanation": "Si proietta il passo libero sull’insieme. Il risultato è ammissibile; la discesa richiede un passo adeguato.",
      "purpose": "Separare le due operazioni senza interpretare la proiezione come una garanzia su ogni γ.",
      "symbolDefinitions": [],
      "assumptions": [
        "Z non vuoto, chiuso e convesso; γᵏ>0; costo differenziabile."
      ],
      "optionalDetails": [
        "La frase della fonte esprime lo scopo del metodo; il contesto sulla scelta del passo non autorizza valori arbitrari.",
        "Un punto fisso proiettato può avere gradiente non nullo, come un minimo al bordo.",
        "La proiezione è esatta sui due insiemi dell’esempio."
      ],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt50-gamma",
          "explanation": "Sposta w e la sua proiezione; costo, Z e zᵏ restano fissi. Non corregge un passo che aumenta il costo."
        }
      ],
      "origin": "source",
      "sourceFormulaIds": [
        "opt50-update"
      ]
    },
    {
      "formulaId": "opt50-example",
      "latex": "\\ell(z)=\\tfrac12(z_1^2+4z_2^2),\\quad z^k=(0.6,0.8)^\\top",
      "conceptualExplanation": "Il punto corrente è ammissibile per disco e quadrato. γ cambia il passo, non costo o punto iniziale.",
      "purpose": "Riusare un costo noto con geometria vincolata esplicita.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt50-gamma",
          "explanation": "Sposta w e la sua proiezione; costo, Z e zᵏ restano fissi. Non corregge un passo che aumenta il costo."
        }
      ],
      "origin": "enrichment",
      "sourceFormulaIds": []
    },
    {
      "formulaId": "opt50-split",
      "latex": "w=z^k-\\gamma^k\\nabla\\ell(z^k),\\quad z^{k+1}=P_{\\mathbb Z}(w)",
      "conceptualExplanation": "w è il tentativo libero, che può uscire; il punto arancio è la sua proiezione, sempre in Z.",
      "purpose": "Leggere colori e risultati del grafico.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt50-gamma",
          "explanation": "Sposta w e la sua proiezione; costo, Z e zᵏ restano fissi. Non corregge un passo che aumenta il costo."
        }
      ],
      "origin": "enrichment",
      "sourceFormulaIds": []
    }
  ],
  "51": [
    {
      "formulaId": "opt51-update",
      "latex": "z^{k+1}=z^k+\\gamma^k(\\tilde z-z^k)",
      "conceptualExplanation": "Si percorre il segmento verso z̃. La convessità garantisce ammissibilità per 0≤γᵏ≤1; non garantisce diminuzione per ogni γ.",
      "purpose": "Distinguere geometria ammissibile e discesa.",
      "symbolDefinitions": [],
      "assumptions": [
        "Punto corrente e z̃ in Z, Z convesso; per la costruzione di z̃ valgono le ipotesi della proiezione."
      ],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt51-gamma",
          "explanation": "Muove il nuovo punto lungo e poi oltre il segmento; zᵏ, z̃ e direzione restano fissi."
        }
      ],
      "origin": "source",
      "sourceFormulaIds": [
        "opt51-update"
      ]
    },
    {
      "formulaId": "opt51-qp",
      "latex": "\\tilde z=\\operatorname*{argmin}_{z\\in\\mathbb Z}\\ell(z^k)+\\nabla\\ell(z^k)^\\top(z-z^k)+\\tfrac12(z-z^k)^\\top(z-z^k)",
      "conceptualExplanation": "La costante barrata non cambia il minimizzatore; il termine quadratico rende unico il problema del punto ammissibile.",
      "purpose": "Conservare il modello completo della fonte, incluso il termine barrato.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt51-gamma",
          "explanation": "Muove il nuovo punto lungo e poi oltre il segmento; zᵏ, z̃ e direzione restano fissi."
        }
      ],
      "origin": "source",
      "sourceFormulaIds": [
        "opt51-qp"
      ]
    },
    {
      "formulaId": "opt51-combination",
      "latex": "z^{k+1}=(1-\\gamma^k)z^k+\\gamma^k\\tilde z",
      "conceptualExplanation": "Con pesi non negativi che sommano a uno, ogni punto sul segmento appartiene a Z.",
      "purpose": "Motivare la nota della fonte con una garanzia esplicita.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt51-gamma",
          "explanation": "Muove il nuovo punto lungo e poi oltre il segmento; zᵏ, z̃ e direzione restano fissi."
        }
      ],
      "origin": "source",
      "sourceFormulaIds": [
        "opt51-combination"
      ]
    },
    {
      "formulaId": "opt51-projection",
      "latex": "\\tilde z=P_{\\mathbb Z}(z^k-\\nabla\\ell(z^k))",
      "conceptualExplanation": "Completare il quadrato mostra una proiezione con passo unitario. γ scala dopo lo spostamento verso z̃.",
      "purpose": "Non confondere l’algoritmo con la proiezione del passo γ della pagina 50.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [
        "Se d=z̃−zᵏ, la caratterizzazione della proiezione dà ∇ℓ(zᵏ)ᵀd≤−||d||²: con d≠0 è una direzione di discesa.",
        "Per differenziabilità, passi positivi sufficientemente piccoli riducono il costo. Per tutti i γ∈[0,1] vale solo l’ammissibilità.",
        "γ=1 porta a z̃; γ>1 esce dal segmento e può uscire da Z."
      ],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt51-gamma",
          "explanation": "Muove il nuovo punto lungo e poi oltre il segmento; zᵏ, z̃ e direzione restano fissi."
        }
      ],
      "origin": "enrichment",
      "sourceFormulaIds": []
    },
    {
      "formulaId": "opt51-example",
      "latex": "\\ell(z)=\\tfrac12(z_1^2+4z_2^2),\\quad z^k=(0.6,0.8)^\\top,\\quad\\tilde z=(0,-1)^\\top",
      "conceptualExplanation": "Stessi costo e punto della pagina 50. La direzione è (−0.6,−1.8) e il prodotto col gradiente vale −6.12.",
      "purpose": "Confrontare le due operazioni senza cambiare problema.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt51-gamma",
          "explanation": "Muove il nuovo punto lungo e poi oltre il segmento; zᵏ, z̃ e direzione restano fissi."
        }
      ],
      "origin": "enrichment",
      "sourceFormulaIds": []
    }
  ],
  "52": [
    {
      "formulaId": "opt52-update",
      "latex": "z^{k+1}=P_{\\mathbb Z}\\big(z^k-\\gamma^k(Qz^k+q)\\big)",
      "conceptualExplanation": "Si usa il gradiente Qzᵏ+q e si proietta su Z. Serve un passo adeguato.",
      "purpose": "Leggere insieme algebra del QP e geometria dei vincoli.",
      "symbolDefinitions": [],
      "assumptions": [
        "Q=Qᵀ≥0, Z non vuoto chiuso convesso; γᵏ>0."
      ],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt52-lambda",
          "explanation": "Cambia Q e ricalcola dal medesimo z⁰; pausa e ritorno a k=0."
        },
        {
          "controlId": "opt52-a",
          "explanation": "Cambia q₁=−a e il minimo sul quadrato, mantenendo λ e γ; ritorno a k=0."
        },
        {
          "controlId": "opt52-gamma",
          "explanation": "Cambia il percorso, non il costo o l’insieme; nessuna correzione nascosta di passi instabili."
        }
      ],
      "origin": "source",
      "sourceFormulaIds": [
        "opt52-update"
      ]
    },
    {
      "formulaId": "opt52-qp",
      "latex": "\\min_{z\\in\\mathbb Z}\\tfrac12z^TQz+q^Tz,\\qquad Q=Q^T\\ge0",
      "conceptualExplanation": "Q semidefinita positiva dà convessità, ma non impone unicità del minimo.",
      "purpose": "Mantenere il caso PSD della fonte.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt52-lambda",
          "explanation": "Cambia Q e ricalcola dal medesimo z⁰; pausa e ritorno a k=0."
        },
        {
          "controlId": "opt52-a",
          "explanation": "Cambia q₁=−a e il minimo sul quadrato, mantenendo λ e γ; ritorno a k=0."
        },
        {
          "controlId": "opt52-gamma",
          "explanation": "Cambia il percorso, non il costo o l’insieme; nessuna correzione nascosta di passi instabili."
        }
      ],
      "origin": "source",
      "sourceFormulaIds": [
        "opt52-qp"
      ]
    },
    {
      "formulaId": "opt52-general",
      "latex": "z^{k+1}=P_{\\mathbb Z}\\big(z^k-\\gamma^k\\nabla\\ell(z^k)\\big)",
      "conceptualExplanation": "È lo stesso algoritmo della pagina 50 con gradiente ora esplicito.",
      "purpose": "Non aggiungere un diverso metodo numerico.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt52-lambda",
          "explanation": "Cambia Q e ricalcola dal medesimo z⁰; pausa e ritorno a k=0."
        },
        {
          "controlId": "opt52-a",
          "explanation": "Cambia q₁=−a e il minimo sul quadrato, mantenendo λ e γ; ritorno a k=0."
        },
        {
          "controlId": "opt52-gamma",
          "explanation": "Cambia il percorso, non il costo o l’insieme; nessuna correzione nascosta di passi instabili."
        }
      ],
      "origin": "source",
      "sourceFormulaIds": [
        "opt52-general"
      ]
    },
    {
      "formulaId": "opt52-example",
      "latex": "\\mathbb Z=[-1,1]^2,\\quad Q=\\operatorname{diag}(1,\\lambda),\\quad q=(-a,0)^\\top",
      "conceptualExplanation": "Si parte da z⁰=(0.6,0.8); λ cambia curvatura e a sposta il minimo.",
      "purpose": "Mostrare compatibilità, minimi multipli e gradiente al bordo.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [
        "Per λ>0 il minimo è (min(a,1),0), con 0≤a≤2.",
        "Per λ=0, tutti i punti (min(a,1),y), −1≤y≤1 sono minimi. La coordinata piatta resta inizialmente 0.8 se l’iterazione non la muove.",
        "La compattezza del quadrato e la continuità del costo danno esistenza anche con Q singolare.",
        "Un passo 0<γ<2/max(1,λ) è sufficiente per questo esempio; oltre la soglia la proiezione può mantenere limitate oscillazioni senza convergenza."
      ],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt52-lambda",
          "explanation": "Cambia Q e ricalcola dal medesimo z⁰; pausa e ritorno a k=0."
        },
        {
          "controlId": "opt52-a",
          "explanation": "Cambia q₁=−a e il minimo sul quadrato, mantenendo λ e γ; ritorno a k=0."
        },
        {
          "controlId": "opt52-gamma",
          "explanation": "Cambia il percorso, non il costo o l’insieme; nessuna correzione nascosta di passi instabili."
        }
      ],
      "origin": "enrichment",
      "sourceFormulaIds": []
    },
    {
      "formulaId": "opt52-residual",
      "latex": "R_{\\mathbb Z}(z)=\\|z-P_{\\mathbb Z}(z-\\nabla\\ell(z))\\|",
      "conceptualExplanation": "Questo residuo verifica il punto fisso proiettato: non chiede di annullare il gradiente al bordo.",
      "purpose": "Leggere correttamente il criterio di arresto illustrativo.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt52-lambda",
          "explanation": "Cambia Q e ricalcola dal medesimo z⁰; pausa e ritorno a k=0."
        },
        {
          "controlId": "opt52-a",
          "explanation": "Cambia q₁=−a e il minimo sul quadrato, mantenendo λ e γ; ritorno a k=0."
        },
        {
          "controlId": "opt52-gamma",
          "explanation": "Cambia il percorso, non il costo o l’insieme; nessuna correzione nascosta di passi instabili."
        }
      ],
      "origin": "enrichment",
      "sourceFormulaIds": []
    }
  ],
  "53": [
    {
      "formulaId": "opt53-square",
      "latex": "\\ell(z)=z^2",
      "conceptualExplanation": "Costo scalare strettamente convesso, con minimo in zero. La classificazione segue dalle derivate.",
      "purpose": "Interpretare la prima formula.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [
        "Gradiente 2z e derivata seconda 2: calcoli aggiunti, non formule stampate."
      ],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt53-a",
          "explanation": "Muove il punto sulle funzioni scalari; formula e stazionari restano fissi."
        },
        {
          "controlId": "opt53-x",
          "explanation": "Muove il punto sulle funzioni in due variabili; stessa selezione in 2D/3D."
        },
        {
          "controlId": "opt53-y",
          "explanation": "Muove solo la seconda coordinata della sonda sulla funzione selezionata."
        }
      ],
      "origin": "source",
      "sourceFormulaIds": [
        "opt53-square"
      ]
    },
    {
      "formulaId": "opt53-quartic",
      "latex": "\\ell(z)=z^4+2z^3-12z^2-2z+6",
      "conceptualExplanation": "Il polinomio non è convesso su tutta R e ha due valli. Un grafico ritagliato non basta a certificarne i minimi.",
      "purpose": "Preservare tutti i coefficienti della seconda formula.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [
        "Derivata 4z³+6z²−24z−2, seconda 12z²+12z−24.",
        "I tre stazionari vengono isolati con bisezione su intervalli con cambio di segno; si mostrano approssimazioni numeriche dichiarate.",
        "Coercività del polinomio e confronto di tutti gli stazionari giustificano il minimo globale, non il solo grafico."
      ],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt53-a",
          "explanation": "Muove il punto sulle funzioni scalari; formula e stazionari restano fissi."
        },
        {
          "controlId": "opt53-x",
          "explanation": "Muove il punto sulle funzioni in due variabili; stessa selezione in 2D/3D."
        },
        {
          "controlId": "opt53-y",
          "explanation": "Muove solo la seconda coordinata della sonda sulla funzione selezionata."
        }
      ],
      "origin": "source",
      "sourceFormulaIds": [
        "opt53-quartic"
      ]
    },
    {
      "formulaId": "opt53-exponential",
      "latex": "\\ell(z)=e^{z_1+3z_2-0.1}+e^{z_1-3z_2-0.1}+e^{-z_1-0.1}",
      "conceptualExplanation": "Tre esponenziali di forme affini: costo in due variabili. Il 3D rappresenta proprio il valore di questa somma.",
      "purpose": "Mostrare la superficie corretta, con tutte le costanti della fonte.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [
        "La Hessiana è una somma di e^{aᵀz−0.1}aaᵀ; i vettori (1,3),(1,−3),(−1,0) generano R², quindi è PD in ogni punto.",
        "Il minimo unico è (−log(2)/2,0), costo 2√2 e^{−0.1}; queste sono deduzioni aggiunte.",
        "Non si attribuisce automaticamente forte convessità globale con modulo positivo uniforme."
      ],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt53-a",
          "explanation": "Muove il punto sulle funzioni scalari; formula e stazionari restano fissi."
        },
        {
          "controlId": "opt53-x",
          "explanation": "Muove il punto sulle funzioni in due variabili; stessa selezione in 2D/3D."
        },
        {
          "controlId": "opt53-y",
          "explanation": "Muove solo la seconda coordinata della sonda sulla funzione selezionata."
        }
      ],
      "origin": "source",
      "sourceFormulaIds": [
        "opt53-exponential"
      ]
    },
    {
      "formulaId": "opt53-quadratic",
      "latex": "\\ell(z)=\\tfrac12z^TQz+r^Tz",
      "conceptualExplanation": "La fonte qui non assegna Q e r. La companion dichiara i dati scelti per disegnare un esempio.",
      "purpose": "Non presumere convessità di qualunque Q.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt53-a",
          "explanation": "Muove il punto sulle funzioni scalari; formula e stazionari restano fissi."
        },
        {
          "controlId": "opt53-x",
          "explanation": "Muove il punto sulle funzioni in due variabili; stessa selezione in 2D/3D."
        },
        {
          "controlId": "opt53-y",
          "explanation": "Muove solo la seconda coordinata della sonda sulla funzione selezionata."
        }
      ],
      "origin": "source",
      "sourceFormulaIds": [
        "opt53-quadratic"
      ]
    },
    {
      "formulaId": "opt53-qp-data",
      "latex": "Q=\\operatorname{diag}(1,4),\\quad r=(-1,-1)^\\top",
      "conceptualExplanation": "Solo per l’esempio visualizzato: Q è PD e il minimo è (1,0.25). Nella formula di questa pagina il termine lineare si chiama r.",
      "purpose": "Rendere esplicita l’istanza numerica aggiunta.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt53-a",
          "explanation": "Muove il punto sulle funzioni scalari; formula e stazionari restano fissi."
        },
        {
          "controlId": "opt53-x",
          "explanation": "Muove il punto sulle funzioni in due variabili; stessa selezione in 2D/3D."
        },
        {
          "controlId": "opt53-y",
          "explanation": "Muove solo la seconda coordinata della sonda sulla funzione selezionata."
        }
      ],
      "origin": "enrichment",
      "sourceFormulaIds": []
    }
  ],
  "54": [
    {
      "formulaId": "opt54-barrier",
      "latex": "\\min_{z\\in\\mathbb R^d}\\ell(z)+\\varepsilon\\sum_{j=1}^r-\\log(-g_j(z))",
      "conceptualExplanation": "Il problema non ha vincoli espliciti, ma il log impone gⱼ(z)<0. Con ε>0 il bordo resta escluso.",
      "purpose": "Esplicitare il dominio implicito senza modificare la fonte.",
      "symbolDefinitions": [],
      "assumptions": [
        "ε>0 e disponibilità di punti strettamente ammissibili."
      ],
      "optionalDetails": [
        "Si usa la convenzione −εlog(s) per s>0; per s≤0 non si produce un valore reale finito.",
        "A ogni s>0 fissato il termine tende a zero per ε→0; il limite non è uniforme vicino al bordo.",
        "Una barriera può essere negativa quando lo slack supera 1: non tagliare il termine a zero.",
        "La strategia non costituisce da sola un teorema di convergenza per qualsiasi problema; un insieme senza interno stretto richiede altre considerazioni."
      ],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt54-epsilon",
          "explanation": "Cambia barriera, costo totale e minimo interno; costo originale e vincolo restano fissi."
        },
        {
          "controlId": "opt54-z",
          "explanation": "Valuta una sonda, anche al bordo o fuori dominio per chiarire la distinzione; non modifica il minimo interno."
        }
      ],
      "origin": "source",
      "sourceFormulaIds": [
        "opt54-barrier"
      ]
    },
    {
      "formulaId": "opt54-source",
      "latex": "\\min_{z\\in\\mathbb R^d}\\ell(z),\\qquad g_j(z)\\le0,\\quad j\\in\\{1,\\ldots,r\\}",
      "conceptualExplanation": "Il problema originale ammette anche il bordo gⱼ=0; il modello logaritmico lavora nell’interno.",
      "purpose": "Separare ammissibilità originale e dominio della barriera.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt54-epsilon",
          "explanation": "Cambia barriera, costo totale e minimo interno; costo originale e vincolo restano fissi."
        },
        {
          "controlId": "opt54-z",
          "explanation": "Valuta una sonda, anche al bordo o fuori dominio per chiarire la distinzione; non modifica il minimo interno."
        }
      ],
      "origin": "source",
      "sourceFormulaIds": [
        "opt54-source"
      ]
    },
    {
      "formulaId": "opt54-log",
      "latex": "-\\varepsilon\\log(z)",
      "conceptualExplanation": "La figura della fonte usa lo slack positivo z, non direttamente un residuo g≤0.",
      "purpose": "Leggere correttamente il segno nell’argomento.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt54-epsilon",
          "explanation": "Cambia barriera, costo totale e minimo interno; costo originale e vincolo restano fissi."
        },
        {
          "controlId": "opt54-z",
          "explanation": "Valuta una sonda, anche al bordo o fuori dominio per chiarire la distinzione; non modifica il minimo interno."
        }
      ],
      "origin": "source",
      "sourceFormulaIds": [
        "opt54-log"
      ]
    },
    {
      "formulaId": "opt54-example",
      "latex": "g(z)=-z,\\quad\\ell(z)=\\tfrac12(z+1)^2,\\quad F_\\varepsilon(z)=\\ell(z)-\\varepsilon\\log z",
      "conceptualExplanation": "Il vincolo ammette z=0; il modello logaritmico richiede z>0.",
      "purpose": "Dare un modello scalare esplicito alla strategia.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [
        "Il costo originale è ℓ(z)=(z+1)²/2 e il suo minimo vincolato è z=0, costo 0.5."
      ],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt54-epsilon",
          "explanation": "Cambia barriera, costo totale e minimo interno; costo originale e vincolo restano fissi."
        },
        {
          "controlId": "opt54-z",
          "explanation": "Valuta una sonda, anche al bordo o fuori dominio per chiarire la distinzione; non modifica il minimo interno."
        }
      ],
      "origin": "enrichment",
      "sourceFormulaIds": []
    },
    {
      "formulaId": "opt54-minimum",
      "latex": "z_\\varepsilon=\\frac{2\\varepsilon}{1+\\sqrt{1+4\\varepsilon}}>0",
      "conceptualExplanation": "È il minimo esatto del modello aggiunto. Diminuendo ε si avvicina al bordo, restando positivo.",
      "purpose": "Mostrare l’effetto del parametro senza simulare un metodo generale non specificato.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [
        "Derivata F′=z+1−ε/z; l’equazione z²+z−ε=0 ha una radice positiva.",
        "F″=1+ε/z²>0: il minimo è unico. Si usa la formula razionalizzata per evitare cancellazione numerica.",
        "La curva non viene valutata a z≤0. Il pulsante Riduci ε cambia la famiglia; i minimi interni sono risolti analiticamente, non mediante un algoritmo inventato."
      ],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt54-epsilon",
          "explanation": "Cambia barriera, costo totale e minimo interno; costo originale e vincolo restano fissi."
        },
        {
          "controlId": "opt54-z",
          "explanation": "Valuta una sonda, anche al bordo o fuori dominio per chiarire la distinzione; non modifica il minimo interno."
        }
      ],
      "origin": "enrichment",
      "sourceFormulaIds": []
    }
  ]
} as const satisfies Readonly<Record<number,readonly FormulaExplanation[]>>;
