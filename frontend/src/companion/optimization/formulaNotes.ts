import type { FormulaExplanation } from '../../components/ExplainedEquation';
/** Individually authored source/enrichment explanations for Optimization batch A. */
export const optimizationFormulaNotes = {
  "1": [],
  "2": [],
  "3": [
    {
      "formulaId": "opt03-problem",
      "latex": "\\min_{z\\in\\mathbb R^d}\\ell(z)",
      "conceptualExplanation": "Si sceglie z nello spazio delle decisioni per ottenere il costo più basso; il problema non contiene vincoli aggiuntivi.",
      "purpose": "Identificare decisione, dominio e quantità da minimizzare.",
      "symbolDefinitions": [
        {
          "symbol": "z",
          "meaning": "Vettore decisionale con d componenti."
        },
        {
          "symbol": "\\ell",
          "meaning": "Costo scalare."
        }
      ],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [],
      "origin": "source",
      "sourceFormulaIds": [
        "opt03-problem"
      ]
    },
    {
      "formulaId": "opt03-local",
      "latex": "\\exists\\epsilon>0:\\quad\\ell(z^\\star)\\le\\ell(z)\\quad\\forall z\\in B(z^\\star,\\epsilon)",
      "conceptualExplanation": "Per il minimo locale basta un intorno in cui nessun punto costi meno. Non si stanno confrontando tutte le decisioni.",
      "purpose": "Leggere correttamente esistenza dell’intorno e confronto locale.",
      "symbolDefinitions": [
        {
          "symbol": "B(z^\\star,\\epsilon)",
          "meaning": "Palla aperta centrata nel punto, di raggio ε."
        },
        {
          "symbol": "z^\\star",
          "meaning": "Punto che si vuole classificare."
        }
      ],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [],
      "origin": "source",
      "sourceFormulaIds": [
        "opt03-local"
      ]
    },
    {
      "formulaId": "opt03-ball",
      "latex": "B(z^\\star,\\epsilon)=\\{z\\in\\mathbb R^d:\\|z-z^\\star\\|<\\epsilon\\}",
      "conceptualExplanation": "La palla è aperta: il bordo a distanza esattamente ε non appartiene all’intorno.",
      "purpose": "Definire il dominio del confronto locale.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [],
      "origin": "source",
      "sourceFormulaIds": [
        "opt03-ball"
      ]
    },
    {
      "formulaId": "opt03-global",
      "latex": "\\ell(z^\\star)\\le\\ell(z)\\quad\\forall z\\in\\mathbb R^d",
      "conceptualExplanation": "Il confronto globale riguarda tutto lo spazio, non soltanto il ritaglio disegnato.",
      "purpose": "Distinguere un minimo globale da uno locale.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [],
      "origin": "source",
      "sourceFormulaIds": [
        "opt03-global"
      ]
    },
    {
      "formulaId": "opt03-strict",
      "latex": "\\ell(z^\\star)<\\ell(z)\\quad\\forall z\\ne z^\\star",
      "conceptualExplanation": "La disuguaglianza stretta rende unico il vincitore nel dominio del confronto; per la versione locale quel dominio è l’intorno.",
      "purpose": "Separare la nozione di stretto dalla nozione di locale/globale.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [],
      "origin": "source",
      "sourceFormulaIds": [
        "opt03-strict"
      ]
    },
    {
      "formulaId": "opt03-strict-local",
      "latex": "\\exists\\epsilon>0:\\ \\ell(z^\\star)<\\ell(z)\\quad\\forall z\\in B(z^\\star,\\epsilon)\\setminus\\{z^\\star\\}",
      "conceptualExplanation": "Ogni altro punto sufficientemente vicino ha un costo maggiore; possono esistere soluzioni lontane migliori o di pari costo.",
      "purpose": "Precisare il minimo locale stretto senza imporre unicità globale.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [],
      "origin": "source",
      "sourceFormulaIds": [
        "opt03-strict-local"
      ]
    },
    {
      "formulaId": "opt03-example",
      "latex": "\\ell(z)=(z^2-1)^2+\\tau z",
      "conceptualExplanation": "L’inclinazione τ rompe il pareggio fra i due pozzi. Un pozzo può restare un minimo locale pur diventando peggiore dell’altro.",
      "purpose": "Esplorare locale e globale su una funzione coerciva esplicita.",
      "symbolDefinitions": [
        {
          "symbol": "\\tau",
          "meaning": "Parametro dell’esempio aggiunto, non della slide."
        }
      ],
      "assumptions": [
        "τ∈[−0.5,0.5]: due minimi stretti e un massimo intermedio.",
        "I punti stazionari risolvono esattamente il modello cubico; la griglia serve soltanto a disegnare."
      ],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [],
      "origin": "enrichment",
      "sourceFormulaIds": []
    }
  ],
  "4": [
    {
      "formulaId": "opt04-problem",
      "latex": "\\min_{z\\in\\mathbb R^d}\\ell(z)",
      "conceptualExplanation": "Il problema rimane scegliere il costo più basso su tutto lo spazio delle decisioni; la figura ne illustra diversi punti notevoli.",
      "purpose": "Collegare il profilo alle definizioni della pagina precedente.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [],
      "origin": "source",
      "sourceFormulaIds": [
        "opt04-problem"
      ]
    },
    {
      "formulaId": "opt04-sign",
      "latex": "\\operatorname*{arg\\,max}_z\\ell(z)=\\operatorname*{arg\\,min}_z[-\\ell(z)]",
      "conceptualExplanation": "Cambiare segno inverte ogni confronto: il punto più alto diventa il più basso. I punti restano gli stessi, i valori cambiano segno.",
      "purpose": "Esplicitare la remark della fonte con una scrittura equivalente.",
      "symbolDefinitions": [],
      "assumptions": [
        "Identità fra insiemi di ottimi quando questi esistono."
      ],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [],
      "origin": "enrichment",
      "sourceFormulaIds": []
    },
    {
      "formulaId": "opt04-profile",
      "latex": "\\ell(z)=\\begin{cases}(z+2)^2&z<-2\\\\3s((z+2)/2)&-2\\le z<0\\\\3-2s(z/2)&0\\le z<2\\\\1&2\\le z\\le3\\\\1+(z-3)^2&z>3\\end{cases}",
      "conceptualExplanation": "Il profilo aggiunto ha un minimo globale unico a −2, una cima a 0 e un plateau di costo 1. Nessun numero è ricavato dal disegno della fonte.",
      "purpose": "Rendere esplicito il modello che alimenta il grafico.",
      "symbolDefinitions": [
        {
          "symbol": "s(t)",
          "meaning": "s(t)=3t²−2t³, usata solo fra 0 e 1 per raccordare i tratti."
        }
      ],
      "assumptions": [
        "Profilo C¹ costruito per l’esempio; non usarlo per applicare indiscriminatamente condizioni C² ai raccordi."
      ],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [],
      "origin": "enrichment",
      "sourceFormulaIds": []
    }
  ],
  "5": [
    {
      "formulaId": "opt05-value",
      "latex": "\\ell(z^*)=\\min_{z\\in\\mathbb R^d}\\ell(z)",
      "conceptualExplanation": "Min restituisce il costo più basso, una quantità scalare: l’altezza del minimo nel grafico.",
      "purpose": "Leggere il valore ottimo senza confonderlo con la decisione.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [],
      "origin": "source",
      "sourceFormulaIds": [
        "opt05-value"
      ]
    },
    {
      "formulaId": "opt05-point",
      "latex": "z^*=\\operatorname*{arg\\,min}_{z\\in\\mathbb R^d}\\ell(z)",
      "conceptualExplanation": "Argmin identifica dove si ottiene il valore minimo. Qui il minimizzatore è unico; con più soluzioni si considera l’insieme dei minimizzatori.",
      "purpose": "Interpretare la coordinata del punto ottimo.",
      "symbolDefinitions": [],
      "assumptions": [
        "La notazione puntuale della slide è usata nell’esempio con soluzione unica."
      ],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [],
      "origin": "source",
      "sourceFormulaIds": [
        "opt05-point"
      ]
    },
    {
      "formulaId": "opt05-example",
      "latex": "\\ell(z)=(z-a)^2+c,\\qquad z^*=a,\\quad\\ell(z^*)=c",
      "conceptualExplanation": "Il quadrato è sempre non negativo e si annulla solo in a. La traslazione verticale c cambia il valore minimo senza muovere il minimizzatore.",
      "purpose": "Separare visivamente posizione e valore con due parametri indipendenti.",
      "symbolDefinitions": [
        {
          "symbol": "a",
          "meaning": "Posizione del vertice."
        },
        {
          "symbol": "c",
          "meaning": "Costo del vertice, anche negativo."
        }
      ],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [],
      "origin": "enrichment",
      "sourceFormulaIds": []
    }
  ],
  "6": [
    {
      "formulaId": "opt06-gradient",
      "latex": "\\nabla r(z)=\\begin{bmatrix}\\frac{\\partial r(z)}{\\partial z_1}\\\\\\vdots\\\\\\frac{\\partial r(z)}{\\partial z_d}\\end{bmatrix}\\in\\mathbb R^{d\\times1}",
      "conceptualExplanation": "Ogni componente misura la variazione del valore quando si modifica quella coordinata, mantenendo fisse le altre.",
      "purpose": "Fissare la convenzione del corso: gradiente scalare come vettore colonna.",
      "symbolDefinitions": [
        {
          "symbol": "r",
          "meaning": "Funzione scalare; qui r è la notazione della fonte, non un vettore di vincoli."
        },
        {
          "symbol": "d",
          "meaning": "Dimensione del dominio."
        }
      ],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [],
      "origin": "source",
      "sourceFormulaIds": [
        "opt06-gradient"
      ]
    },
    {
      "formulaId": "opt06-hessian",
      "latex": "\\nabla^2(r(z))=\\left[\\frac{\\partial^2r(z)}{\\partial z_i\\partial z_j}\\right]_{i,j=1}^d\\in\\mathbb R^{d\\times d}",
      "conceptualExplanation": "La Hessiana descrive curvature e accoppiamenti. È simmetrica se le derivate seconde sono continue.",
      "purpose": "Usare una Hessiana coerente con d e con l’ordine due delle derivate.",
      "symbolDefinitions": [
        {
          "symbol": "i,j",
          "meaning": "Indici entrambi da 1 a d."
        }
      ],
      "assumptions": [
        "r∈C² nell’intorno considerato per la simmetria."
      ],
      "optionalDetails": [
        "La diagonale misura le curvature coordinate; gli elementi fuori diagonale misurano l’accoppiamento."
      ],
      "relatedFormulaIds": [],
      "parameterInterpretation": [],
      "origin": "correction",
      "sourceFormulaIds": [
        "opt06-hessian"
      ]
    },
    {
      "formulaId": "opt06-example",
      "latex": "r(z)=\\tfrac12(z_1^2+2\\rho z_1z_2+2z_2^2),\\quad\\nabla r(z)=\\begin{bmatrix}z_1+\\rho z_2\\\\\\rho z_1+2z_2\\end{bmatrix},\\quad\\nabla^2(r(z))=\\begin{bmatrix}1&\\rho\\\\\\rho&2\\end{bmatrix}",
      "conceptualExplanation": "Muovi z: varia il gradiente. Varia ρ: cambiano Hessiana e livelli. La Hessiana non dipende da z perché r è quadratica.",
      "purpose": "Collegare derivate, valori numerici e geometria della stessa funzione.",
      "symbolDefinitions": [
        {
          "symbol": "\\rho",
          "meaning": "Accoppiamento adimensionale dell’esempio."
        }
      ],
      "assumptions": [
        "ρ∈[−1,1]; r è un polinomio C∞."
      ],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [],
      "origin": "enrichment",
      "sourceFormulaIds": []
    }
  ],
  "7": [
    {
      "formulaId": "opt07-convention",
      "latex": "\\nabla r(z)=[\\nabla r_1(z)\\ \\cdots\\ \\nabla r_m(z)]\\in\\mathbb R^{d\\times m}",
      "conceptualExplanation": "Le colonne seguono le componenti in uscita; le righe seguono le variabili di ingresso. La forma della matrice è parte della convenzione del corso.",
      "purpose": "Evitare di scambiare gradiente vettoriale e Jacobiano.",
      "symbolDefinitions": [
        {
          "symbol": "d",
          "meaning": "Numero di variabili."
        },
        {
          "symbol": "m",
          "meaning": "Numero di componenti della funzione."
        }
      ],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [],
      "origin": "source",
      "sourceFormulaIds": [
        "opt07-convention"
      ]
    },
    {
      "formulaId": "opt07-jacobian",
      "latex": "J_r(z)=[\\nabla r(z)]^\\top\\in\\mathbb R^{m\\times d}",
      "conceptualExplanation": "Trasporre scambia righe e colonne: la derivata della stessa componente rispetto alla stessa variabile rimane lo stesso numero.",
      "purpose": "Dare un nome esplicito al Jacobiano descritto nella fonte.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [],
      "origin": "enrichment",
      "sourceFormulaIds": []
    },
    {
      "formulaId": "opt07-example",
      "latex": "r(z)=\\begin{bmatrix}z_1^2+z_2\\\\z_1z_2\\\\2z_2\\end{bmatrix},\\qquad\\nabla r(z)=\\begin{bmatrix}2z_1&z_2&0\\\\1&z_1&2\\end{bmatrix}",
      "conceptualExplanation": "Le tre colonne derivano separatamente r₁, r₂ e r₃. Selezionare una cella mostra dove ricompare il medesimo valore nella matrice trasposta.",
      "purpose": "Rendere concreta la convenzione con una matrice rettangolare.",
      "symbolDefinitions": [],
      "assumptions": [
        "Esempio aggiunto r:R²→R³, polinomiale."
      ],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [],
      "origin": "enrichment",
      "sourceFormulaIds": []
    }
  ],
  "8": [
    {
      "formulaId": "opt08-necessary",
      "latex": "\\nabla\\ell(z^\\star)=0,\\qquad\\nabla^2\\ell(z^\\star)\\ge0",
      "conceptualExplanation": "Sono conseguenze del minimo locale sotto le ipotesi di regolarità. La freccia logica parte dal minimo, non dal semplice annullamento delle derivate.",
      "purpose": "Leggere insieme FNC e SNC senza confonderle con condizioni sufficienti.",
      "symbolDefinitions": [
        {
          "symbol": "\\ge0",
          "meaning": "Positività semidefinita come forma quadratica, non confronto elemento per elemento."
        }
      ],
      "assumptions": [
        "ℓ∈C¹ in B(z⋆,ε) per il gradiente; ℓ∈C² per la Hessiana."
      ],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [],
      "origin": "source",
      "sourceFormulaIds": [
        "opt08-necessary"
      ]
    },
    {
      "formulaId": "opt08-stationary",
      "latex": "\\nabla\\ell(\\bar z)=0",
      "conceptualExplanation": "Stazionario significa che le variazioni del primo ordine si annullano; la geometria può ancora essere una valle, una cima o una sella.",
      "purpose": "Separare l’etichetta stazionario da minimo.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [],
      "origin": "source",
      "sourceFormulaIds": [
        "opt08-stationary"
      ]
    },
    {
      "formulaId": "opt08-preset-0",
      "latex": "\\ell(z)=z_1^2+z_2^2,\\quad\\nabla\\ell(0)=0,\\quad\\nabla^2\\ell(0)=\\operatorname{diag}(2,2)",
      "conceptualExplanation": "La curvatura è positiva in tutte le direzioni: l’origine è un minimo globale stretto.",
      "purpose": "Interpretare un caso esplicito della famiglia di controesempi.",
      "symbolDefinitions": [],
      "assumptions": [
        "Funzione polinomiale C∞ su R²; candidato fisso nell’origine."
      ],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [],
      "origin": "enrichment",
      "sourceFormulaIds": [],
      "displayLatex": "\\begin{gathered}\\ell(z)=z_1^2+z_2^2,\\quad\\nabla\\ell(0)=0\\\\\\nabla^2\\ell(0)=\\operatorname{diag}(2,2)\\end{gathered}"
    },
    {
      "formulaId": "opt08-preset-1",
      "latex": "\\ell(z)=z_1^2-z_2^2,\\quad\\nabla\\ell(0)=0,\\quad\\nabla^2\\ell(0)=\\operatorname{diag}(2,-2)",
      "conceptualExplanation": "La funzione sale lungo z₁ e scende lungo z₂: il punto è una sella.",
      "purpose": "Interpretare un caso esplicito della famiglia di controesempi.",
      "symbolDefinitions": [],
      "assumptions": [
        "Funzione polinomiale C∞ su R²; candidato fisso nell’origine."
      ],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [],
      "origin": "enrichment",
      "sourceFormulaIds": [],
      "displayLatex": "\\begin{gathered}\\ell(z)=z_1^2-z_2^2,\\quad\\nabla\\ell(0)=0\\\\\\nabla^2\\ell(0)=\\operatorname{diag}(2,-2)\\end{gathered}"
    },
    {
      "formulaId": "opt08-preset-2",
      "latex": "\\ell(z)=-z_1^2-z_2^2,\\quad\\nabla\\ell(0)=0,\\quad\\nabla^2\\ell(0)=\\operatorname{diag}(-2,-2)",
      "conceptualExplanation": "La curvatura è negativa in tutte le direzioni: l’origine è un massimo globale stretto.",
      "purpose": "Interpretare un caso esplicito della famiglia di controesempi.",
      "symbolDefinitions": [],
      "assumptions": [
        "Funzione polinomiale C∞ su R²; candidato fisso nell’origine."
      ],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [],
      "origin": "enrichment",
      "sourceFormulaIds": [],
      "displayLatex": "\\begin{gathered}\\ell(z)=-z_1^2-z_2^2,\\quad\\nabla\\ell(0)=0\\\\\\nabla^2\\ell(0)=\\operatorname{diag}(-2,-2)\\end{gathered}"
    },
    {
      "formulaId": "opt08-preset-3",
      "latex": "\\ell(z)=z_1^4+z_2^4,\\quad\\nabla\\ell(0)=0,\\quad\\nabla^2\\ell(0)=0",
      "conceptualExplanation": "Il costo cresce fuori dall’origine, pur avendo Hessiana nulla nel punto: minimo stretto degenere.",
      "purpose": "Interpretare un caso esplicito della famiglia di controesempi.",
      "symbolDefinitions": [],
      "assumptions": [
        "Funzione polinomiale C∞ su R²; candidato fisso nell’origine."
      ],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [],
      "origin": "enrichment",
      "sourceFormulaIds": [],
      "displayLatex": "\\begin{gathered}\\ell(z)=z_1^4+z_2^4,\\quad\\nabla\\ell(0)=0\\\\\\nabla^2\\ell(0)=0\\end{gathered}"
    },
    {
      "formulaId": "opt08-preset-4",
      "latex": "\\ell(z)=-z_1^4-z_2^4,\\quad\\nabla\\ell(0)=0,\\quad\\nabla^2\\ell(0)=0",
      "conceptualExplanation": "Il costo diminuisce fuori dall’origine: massimo stretto con gradiente e Hessiana nulli. FNC e SNC non bastano.",
      "purpose": "Interpretare un caso esplicito della famiglia di controesempi.",
      "symbolDefinitions": [],
      "assumptions": [
        "Funzione polinomiale C∞ su R²; candidato fisso nell’origine."
      ],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [],
      "origin": "enrichment",
      "sourceFormulaIds": [],
      "displayLatex": "\\begin{gathered}\\ell(z)=-z_1^4-z_2^4,\\quad\\nabla\\ell(0)=0\\\\\\nabla^2\\ell(0)=0\\end{gathered}"
    }
  ],
  "9": [
    {
      "formulaId": "opt09-sufficient",
      "latex": "\\nabla\\ell(z^\\star)=0,\\quad\\nabla^2\\ell(z^\\star)>0\\quad\\Longrightarrow\\quad z^\\star\\text{ minimo locale stretto}",
      "conceptualExplanation": "La curvatura è positiva in ogni direzione non nulla: vicino al punto domina i termini di ordine superiore e fa aumentare il costo.",
      "purpose": "Capire il ruolo congiunto di stazionarietà, C² e positività definita.",
      "symbolDefinitions": [
        {
          "symbol": ">0",
          "meaning": "Tutti gli autovalori della matrice simmetrica sono positivi."
        }
      ],
      "assumptions": [
        "ℓ∈C² in un intorno aperto del punto."
      ],
      "optionalDetails": [
        "Il teorema è sufficiente, non necessario: un minimo quartico può avere Hessiana nulla."
      ],
      "relatedFormulaIds": [],
      "parameterInterpretation": [],
      "origin": "source",
      "sourceFormulaIds": [
        "opt09-sufficient"
      ]
    },
    {
      "formulaId": "opt09-example",
      "latex": "\\ell(z)=\\tfrac12(z_1^2+\\alpha z_2^2)+\\beta z_2^4,\\quad\\nabla\\ell(0)=0,\\quad\\nabla^2\\ell(0)=\\operatorname{diag}(1,\\alpha)",
      "conceptualExplanation": "α governa la curvatura nell’origine. β modifica il costo lontano dal punto, lasciando invariati gradiente e Hessiana nell’origine.",
      "purpose": "Separare garanzia locale, degenerazione e comportamento globale.",
      "symbolDefinitions": [
        {
          "symbol": "\\alpha",
          "meaning": "Secondo autovalore della Hessiana all’origine."
        },
        {
          "symbol": "\\beta",
          "meaning": "Coefficiente quartico, invisibile nella Hessiana all’origine."
        }
      ],
      "assumptions": [
        "Famiglia polinomiale C∞; dominio R²."
      ],
      "optionalDetails": [
        "Per α>0 il teorema garantisce un minimo locale stretto anche se β<0 rende il costo illimitato inferiormente."
      ],
      "relatedFormulaIds": [],
      "parameterInterpretation": [],
      "origin": "enrichment",
      "sourceFormulaIds": []
    }
  ]
} as const satisfies Readonly<Record<number, readonly FormulaExplanation[]>>;
