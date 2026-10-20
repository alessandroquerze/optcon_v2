import type {FormulaExplanation} from '../../components/ExplainedEquation';
export const sqpFormulaNotes = {
  "69": [],
  "70": [
    {
      "formulaId": "opt70-residual",
      "latex": "\\nabla L(z,\\lambda)=\\begin{bmatrix}\\nabla\\ell(z)+\\nabla h(z)\\lambda\\\\h(z)\\end{bmatrix}=0",
      "conceptualExplanation": "La parte superiore impone stazionarietà, quella inferiore h=0. ∇h∈Rᵈˣᵐ e ∇L∈Rᵈ⁺ᵐ.",
      "purpose": "Separare le due condizioni e le dimensioni.",
      "symbolDefinitions": [],
      "assumptions": [
        "Per dedurre KKT da un minimo servono le condizioni di regolarità del contesto 57–60."
      ],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt70-x",
          "explanation": "Cambia punto, gradiente del vincolo, residuo e sistema locale; non cambia il problema."
        },
        {
          "controlId": "opt70-y",
          "explanation": "Modifica h e il termine noto; il vincolo linearizzato corregge il residuo solo al primo ordine."
        },
        {
          "controlId": "opt70-lambda",
          "explanation": "Cambia B=diag(1−2λ,1), il residuo di stazionarietà e la direzione; costo e vincolo restano fissi."
        }
      ],
      "origin": "source",
      "sourceFormulaIds": [
        "opt70-residual"
      ]
    },
    {
      "formulaId": "opt70-problem",
      "latex": "\\min_{z\\in\\mathbb R^d}\\ell(z)\\quad\\text{subj.to }h(z)=0",
      "conceptualExplanation": "Qui ci sono solo uguaglianze: λ è libero nel segno.",
      "purpose": "Fissare il problema a cui appartiene il residuo.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt70-x",
          "explanation": "Cambia punto, gradiente del vincolo, residuo e sistema locale; non cambia il problema."
        },
        {
          "controlId": "opt70-y",
          "explanation": "Modifica h e il termine noto; il vincolo linearizzato corregge il residuo solo al primo ordine."
        },
        {
          "controlId": "opt70-lambda",
          "explanation": "Cambia B=diag(1−2λ,1), il residuo di stazionarietà e la direzione; costo e vincolo restano fissi."
        }
      ],
      "origin": "source",
      "sourceFormulaIds": [
        "opt70-problem"
      ]
    },
    {
      "formulaId": "opt70-example",
      "latex": "\\ell(z)=\\tfrac12(z_1^2+(z_2-1)^2),\\qquad h(z)=z_2-z_1^2",
      "conceptualExplanation": "Nel modello aggiunto, r=((1−2λ)z₁,z₂−1+λ,z₂−z₁²). λ modifica il residuo, non ℓ o il vincolo.",
      "purpose": "Definire il modello aggiunto comune alle pagine 70–74.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt70-x",
          "explanation": "Cambia punto, gradiente del vincolo, residuo e sistema locale; non cambia il problema."
        },
        {
          "controlId": "opt70-y",
          "explanation": "Modifica h e il termine noto; il vincolo linearizzato corregge il residuo solo al primo ordine."
        },
        {
          "controlId": "opt70-lambda",
          "explanation": "Cambia B=diag(1−2λ,1), il residuo di stazionarietà e la direzione; costo e vincolo restano fissi."
        }
      ],
      "origin": "enrichment",
      "sourceFormulaIds": []
    },
    {
      "formulaId": "opt70-roots",
      "latex": "(z,\\lambda)=((\\pm1/\\sqrt2,1/2),1/2),\\quad((0,0),1)",
      "conceptualExplanation": "I primi due punti sono minimi sul vincolo, il terzo è massimo locale sul vincolo: tutti annullano r.",
      "purpose": "Dare esempi numerici di radici con classificazioni diverse.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt70-x",
          "explanation": "Cambia punto, gradiente del vincolo, residuo e sistema locale; non cambia il problema."
        },
        {
          "controlId": "opt70-y",
          "explanation": "Modifica h e il termine noto; il vincolo linearizzato corregge il residuo solo al primo ordine."
        },
        {
          "controlId": "opt70-lambda",
          "explanation": "Cambia B=diag(1−2λ,1), il residuo di stazionarietà e la direzione; costo e vincolo restano fissi."
        }
      ],
      "origin": "enrichment",
      "sourceFormulaIds": []
    }
  ],
  "71": [
    {
      "formulaId": "opt71-update",
      "latex": "\\begin{bmatrix}z^{k+1}\\\\\\lambda^{k+1}\\end{bmatrix}=\\begin{bmatrix}z^k\\\\\\lambda^k\\end{bmatrix}+\\begin{bmatrix}\\Delta z^k\\\\\\Delta\\lambda^k\\end{bmatrix}",
      "conceptualExplanation": "Δλᵏ si somma a λᵏ. Si aggiorna anche z; k conta iterazioni.",
      "purpose": "Rendere esplicito il significato del passo congiunto.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt71-x",
          "explanation": "Muove il punto iniziale e ricalcola l’intera sequenza con gli stessi costo e vincolo."
        },
        {
          "controlId": "opt71-y",
          "explanation": "Cambia l’ammissibilità iniziale e ricalcola la sequenza; al cambio dei parametri Play si ferma e k torna a zero."
        },
        {
          "controlId": "opt71-lambda",
          "explanation": "Inizializza anche λ⁰, necessario per B⁰. Cambia i QP e ricalcola la sequenza, senza cambiare ℓ o h."
        }
      ],
      "origin": "source",
      "sourceFormulaIds": [
        "opt71-update"
      ]
    },
    {
      "formulaId": "opt71-newton",
      "latex": "\\nabla^2L(z^k,\\lambda^k)\\begin{bmatrix}\\Delta z\\\\\\Delta\\lambda\\end{bmatrix}=-\\nabla L(z^k,\\lambda^k)",
      "conceptualExplanation": "È Newton per il residuo r=∇L; il suo Jacobiano è la Hessiana congiunta. Servono derivabilità adeguata e sistema risolvibile.",
      "purpose": "Collegare il metodo al root finding non vincolato.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [
        "La formula scritta presuppone la disponibilità delle derivate seconde; per un passo unico il sistema deve essere non singolare.",
        "Con singolarità compatibile possono esserci infinite direzioni; con singolarità incompatibile nessuna. Non si sceglie arbitrariamente un’inversa."
      ],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt71-x",
          "explanation": "Muove il punto iniziale e ricalcola l’intera sequenza con gli stessi costo e vincolo."
        },
        {
          "controlId": "opt71-y",
          "explanation": "Cambia l’ammissibilità iniziale e ricalcola la sequenza; al cambio dei parametri Play si ferma e k torna a zero."
        },
        {
          "controlId": "opt71-lambda",
          "explanation": "Inizializza anche λ⁰, necessario per B⁰. Cambia i QP e ricalcola la sequenza, senza cambiare ℓ o h."
        }
      ],
      "origin": "source",
      "sourceFormulaIds": [
        "opt71-newton"
      ]
    },
    {
      "formulaId": "opt71-block",
      "latex": "\\nabla^2L(z^k,\\lambda^k)=\\begin{bmatrix}B^k&\\nabla h(z^k)\\\\\\nabla h(z^k)^\\top&0\\end{bmatrix},\\quad B^k=\\nabla^2_{11}L(z^k,\\lambda^k)",
      "conceptualExplanation": "Bᵏ include la curvatura dei vincoli pesata da λᵏ; il blocco zero deriva dalla linearità di L nei moltiplicatori.",
      "purpose": "Leggere i blocchi senza scambiare la convenzione d×m di ∇h.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt71-x",
          "explanation": "Muove il punto iniziale e ricalcola l’intera sequenza con gli stessi costo e vincolo."
        },
        {
          "controlId": "opt71-y",
          "explanation": "Cambia l’ammissibilità iniziale e ricalcola la sequenza; al cambio dei parametri Play si ferma e k torna a zero."
        },
        {
          "controlId": "opt71-lambda",
          "explanation": "Inizializza anche λ⁰, necessario per B⁰. Cambia i QP e ricalcola la sequenza, senza cambiare ℓ o h."
        }
      ],
      "origin": "source",
      "sourceFormulaIds": [
        "opt71-block"
      ]
    },
    {
      "formulaId": "opt71-example",
      "latex": "\\ell(z)=\\tfrac12(z_1^2+(z_2-1)^2),\\qquad h(z)=z_2-z_1^2",
      "conceptualExplanation": "Si usa B=diag(1−2λ,1). Play seleziona iterati precalcolati; cambiare l’inizializzazione mette in pausa e riparte da k=0.",
      "purpose": "Definire il modello aggiunto comune alle pagine 70–74.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt71-x",
          "explanation": "Muove il punto iniziale e ricalcola l’intera sequenza con gli stessi costo e vincolo."
        },
        {
          "controlId": "opt71-y",
          "explanation": "Cambia l’ammissibilità iniziale e ricalcola la sequenza; al cambio dei parametri Play si ferma e k torna a zero."
        },
        {
          "controlId": "opt71-lambda",
          "explanation": "Inizializza anche λ⁰, necessario per B⁰. Cambia i QP e ricalcola la sequenza, senza cambiare ℓ o h."
        }
      ],
      "origin": "enrichment",
      "sourceFormulaIds": []
    }
  ],
  "72": [
    {
      "formulaId": "opt72-system",
      "latex": "\\begin{bmatrix}B^k&\\nabla h(z^k)\\\\\\nabla h(z^k)^\\top&0\\end{bmatrix}\\begin{bmatrix}\\Delta z\\\\\\Delta\\lambda\\end{bmatrix}=-\\begin{bmatrix}\\nabla\\ell(z^k)+\\nabla h(z^k)\\lambda^k\\\\h(z^k)\\end{bmatrix}",
      "conceptualExplanation": "Sopra: bilancio linearizzato. Sotto: vincolo al primo ordine.",
      "purpose": "Separare le due righe e il segno del termine noto.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt72-x",
          "explanation": "Cambia punto, gradiente del vincolo, residuo e sistema locale; non cambia il problema."
        },
        {
          "controlId": "opt72-y",
          "explanation": "Modifica h e il termine noto; il vincolo linearizzato corregge il residuo solo al primo ordine."
        },
        {
          "controlId": "opt72-lambda",
          "explanation": "Cambia B=diag(1−2λ,1), il residuo di stazionarietà e la direzione; costo e vincolo restano fissi."
        }
      ],
      "origin": "source",
      "sourceFormulaIds": [
        "opt72-system"
      ]
    },
    {
      "formulaId": "opt72-example",
      "latex": "\\ell(z)=\\tfrac12(z_1^2+(z_2-1)^2),\\qquad h(z)=z_2-z_1^2",
      "conceptualExplanation": "Nel modello, h(zᵏ+Δz)=−(Δz₁)² dopo un passo che annulla il vincolo linearizzato. Il residuo reale è di secondo ordine.",
      "purpose": "Definire il modello aggiunto comune alle pagine 70–74.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt72-x",
          "explanation": "Cambia punto, gradiente del vincolo, residuo e sistema locale; non cambia il problema."
        },
        {
          "controlId": "opt72-y",
          "explanation": "Modifica h e il termine noto; il vincolo linearizzato corregge il residuo solo al primo ordine."
        },
        {
          "controlId": "opt72-lambda",
          "explanation": "Cambia B=diag(1−2λ,1), il residuo di stazionarietà e la direzione; costo e vincolo restano fissi."
        }
      ],
      "origin": "enrichment",
      "sourceFormulaIds": []
    },
    {
      "formulaId": "opt72-reduction",
      "latex": "D=1-2\\lambda+4z_1^2,\\quad D\\Delta z_1=z_1(1-2z_1^2),\\quad\\Delta z_2=-h(z)+2z_1\\Delta z_1",
      "conceptualExplanation": "È l’eliminazione esatta delle tre equazioni del modello. D=0 richiede un controllo di compatibilità, non una divisione.",
      "purpose": "Verificare il sistema con un caso numerico esplicito.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt72-x",
          "explanation": "Cambia punto, gradiente del vincolo, residuo e sistema locale; non cambia il problema."
        },
        {
          "controlId": "opt72-y",
          "explanation": "Modifica h e il termine noto; il vincolo linearizzato corregge il residuo solo al primo ordine."
        },
        {
          "controlId": "opt72-lambda",
          "explanation": "Cambia B=diag(1−2λ,1), il residuo di stazionarietà e la direzione; costo e vincolo restano fissi."
        }
      ],
      "origin": "enrichment",
      "sourceFormulaIds": []
    },
    {
      "formulaId": "opt72-remainder",
      "latex": "h(z+\\theta\\Delta z)=h(z)+\\theta\\nabla h(z)^\\top\\Delta z-\\theta^2(\\Delta z_1)^2",
      "conceptualExplanation": "Il grafico confronta residuo esatto e residuo linearizzato lungo il segmento; θ è solo un parametro del confronto aggiunto.",
      "purpose": "Mostrare il termine che la linearizzazione trascura.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt72-x",
          "explanation": "Cambia punto, gradiente del vincolo, residuo e sistema locale; non cambia il problema."
        },
        {
          "controlId": "opt72-y",
          "explanation": "Modifica h e il termine noto; il vincolo linearizzato corregge il residuo solo al primo ordine."
        },
        {
          "controlId": "opt72-lambda",
          "explanation": "Cambia B=diag(1−2λ,1), il residuo di stazionarietà e la direzione; costo e vincolo restano fissi."
        }
      ],
      "origin": "enrichment",
      "sourceFormulaIds": []
    }
  ],
  "73": [
    {
      "formulaId": "opt73-qp",
      "latex": "\\begin{aligned}\\min_{\\Delta z}\\;&\\nabla\\ell(z^k)^\\top\\Delta z+\\tfrac12\\Delta z^\\top B^k\\Delta z\\\\\\text{subj.to }&h(z^k)+\\nabla h(z^k)^\\top\\Delta z=0\\end{aligned}",
      "conceptualExplanation": "Moltiplicatore: λᵏ⁺¹. Verde h=0; rosso vincolo affine; viola stazionario.",
      "purpose": "Dare il significato di entrambe le uscite del QP.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [
        "Il QP usa un costo quadratico locale e il vincolo linearizzato. Il suo moltiplicatore è il nuovo λ, non l’incremento Newton.",
        "Il punto viola è uno stazionario del modello: è minimo soltanto con la curvatura appropriata."
      ],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt73-x",
          "explanation": "Cambia punto, gradiente del vincolo, residuo e sistema locale; non cambia il problema."
        },
        {
          "controlId": "opt73-y",
          "explanation": "Modifica h e il termine noto; il vincolo linearizzato corregge il residuo solo al primo ordine."
        },
        {
          "controlId": "opt73-lambda",
          "explanation": "Cambia B=diag(1−2λ,1), il residuo di stazionarietà e la direzione; costo e vincolo restano fissi."
        }
      ],
      "origin": "source",
      "sourceFormulaIds": [
        "opt73-qp"
      ]
    },
    {
      "formulaId": "opt73-kkt",
      "latex": "\\begin{aligned}\\nabla\\ell(z^k)+B^k\\Delta z+\\nabla h(z^k)\\lambda&=0\\\\h(z^k)+\\nabla h(z^k)^\\top\\Delta z&=0\\end{aligned}",
      "conceptualExplanation": "Sono le equazioni stazionarie del QP. La fonte le chiama necessarie e sufficienti senza la condizione di curvatura.",
      "purpose": "Conservare le equazioni corrette della fonte.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt73-x",
          "explanation": "Cambia punto, gradiente del vincolo, residuo e sistema locale; non cambia il problema."
        },
        {
          "controlId": "opt73-y",
          "explanation": "Modifica h e il termine noto; il vincolo linearizzato corregge il residuo solo al primo ordine."
        },
        {
          "controlId": "opt73-lambda",
          "explanation": "Cambia B=diag(1−2λ,1), il residuo di stazionarietà e la direzione; costo e vincolo restano fissi."
        }
      ],
      "origin": "source",
      "sourceFormulaIds": [
        "opt73-kkt"
      ]
    },
    {
      "formulaId": "opt73-literal",
      "latex": "\\text{necessary and sufficient optimality conditions for the QP}",
      "conceptualExplanation": "Trascrizione della frase problematica, conservata nei riferimenti; non viene usata come garanzia senza ipotesi.",
      "purpose": "Tracciare l’affermazione che richiede precisazione.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt73-x",
          "explanation": "Cambia punto, gradiente del vincolo, residuo e sistema locale; non cambia il problema."
        },
        {
          "controlId": "opt73-y",
          "explanation": "Modifica h e il termine noto; il vincolo linearizzato corregge il residuo solo al primo ordine."
        },
        {
          "controlId": "opt73-lambda",
          "explanation": "Cambia B=diag(1−2λ,1), il residuo di stazionarietà e la direzione; costo e vincolo restano fissi."
        }
      ],
      "origin": "source",
      "sourceFormulaIds": [
        "opt73-literal"
      ]
    },
    {
      "formulaId": "opt73-validity",
      "latex": "y^\\top B^k y\\ge0\\quad\\forall y:\\ \\nabla h(z^k)^\\top y=0",
      "conceptualExplanation": "Su un vincolo affine compatibile, questa condizione rende sufficienti le equazioni KKT del QP; la stretta positività sulle direzioni non nulle dà unicità del passo.",
      "purpose": "Usare la versione matematicamente valida nei calcoli e nei casi mostrati.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [
        "Non occorre B^k≥0 in tutto lo spazio: basta sullo spazio nullo del Jacobiano del vincolo linearizzato.",
        "La 68 già distingue la curvatura ridotta da quella completa. Il sistema Newton resta un sistema di radici anche con curvatura ridotta negativa.",
        "Unicità del passo e unicità del moltiplicatore sono distinte: con z=0,λ=.5, Δz=(s,0) è una famiglia di minimi del QP, ma il moltiplicatore QP è sempre 1."
      ],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt73-x",
          "explanation": "Cambia punto, gradiente del vincolo, residuo e sistema locale; non cambia il problema."
        },
        {
          "controlId": "opt73-y",
          "explanation": "Modifica h e il termine noto; il vincolo linearizzato corregge il residuo solo al primo ordine."
        },
        {
          "controlId": "opt73-lambda",
          "explanation": "Cambia B=diag(1−2λ,1), il residuo di stazionarietà e la direzione; costo e vincolo restano fissi."
        }
      ],
      "origin": "correction",
      "sourceFormulaIds": [
        "opt73-validity"
      ]
    },
    {
      "formulaId": "opt73-multiplier",
      "latex": "\\lambda^{k+1}=\\lambda^k+\\Delta\\lambda^k",
      "conceptualExplanation": "L’incremento Newton e il moltiplicatore del QP sono due quantità diverse.",
      "purpose": "Evitare una doppia somma di λᵏ.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt73-x",
          "explanation": "Cambia punto, gradiente del vincolo, residuo e sistema locale; non cambia il problema."
        },
        {
          "controlId": "opt73-y",
          "explanation": "Modifica h e il termine noto; il vincolo linearizzato corregge il residuo solo al primo ordine."
        },
        {
          "controlId": "opt73-lambda",
          "explanation": "Cambia B=diag(1−2λ,1), il residuo di stazionarietà e la direzione; costo e vincolo restano fissi."
        }
      ],
      "origin": "source",
      "sourceFormulaIds": [
        "opt73-multiplier"
      ]
    },
    {
      "formulaId": "opt73-example",
      "latex": "\\ell(z)=\\tfrac12(z_1^2+(z_2-1)^2),\\qquad h(z)=z_2-z_1^2",
      "conceptualExplanation": "Lungo Δz=(s,−h+2z₁s), il modello è m(s)=Ds²/2−z₁(1−2z₁²)s+C, con D=1−2λ+4z₁².",
      "purpose": "Definire il modello aggiunto comune alle pagine 70–74.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt73-x",
          "explanation": "Cambia punto, gradiente del vincolo, residuo e sistema locale; non cambia il problema."
        },
        {
          "controlId": "opt73-y",
          "explanation": "Modifica h e il termine noto; il vincolo linearizzato corregge il residuo solo al primo ordine."
        },
        {
          "controlId": "opt73-lambda",
          "explanation": "Cambia B=diag(1−2λ,1), il residuo di stazionarietà e la direzione; costo e vincolo restano fissi."
        }
      ],
      "origin": "enrichment",
      "sourceFormulaIds": []
    },
    {
      "formulaId": "opt73-counterexample",
      "latex": "z=(0,0),\\ \\lambda=1:\\quad B=\\operatorname{diag}(-1,1),\\quad\\Delta z_2=0,\\quad m=-\\tfrac12(\\Delta z_1)^2",
      "conceptualExplanation": "Newton ha direzione stazionaria zero e sistema invertibile, ma il QP non ha minimo: il costo tende a −∞.",
      "purpose": "Verificare perché la sufficienza incondizionata è falsa.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt73-x",
          "explanation": "Cambia punto, gradiente del vincolo, residuo e sistema locale; non cambia il problema."
        },
        {
          "controlId": "opt73-y",
          "explanation": "Modifica h e il termine noto; il vincolo linearizzato corregge il residuo solo al primo ordine."
        },
        {
          "controlId": "opt73-lambda",
          "explanation": "Cambia B=diag(1−2λ,1), il residuo di stazionarietà e la direzione; costo e vincolo restano fissi."
        }
      ],
      "origin": "enrichment",
      "sourceFormulaIds": []
    }
  ],
  "74": [
    {
      "formulaId": "opt74-update",
      "latex": "\\begin{aligned}z^{k+1}&=z^k+\\Delta z^k\\\\\\lambda^{k+1}&=\\Delta\\lambda_{\\mathrm{QP}}^k\\end{aligned}",
      "conceptualExplanation": "Δλ_QPᵏ è λᵏ⁺¹: si assegna, senza sommarlo a λᵏ.",
      "purpose": "Preservare esattamente il significato della notazione della slide.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt74-x",
          "explanation": "Muove il punto iniziale e ricalcola l’intera sequenza con gli stessi costo e vincolo."
        },
        {
          "controlId": "opt74-y",
          "explanation": "Cambia l’ammissibilità iniziale e ricalcola la sequenza; al cambio dei parametri Play si ferma e k torna a zero."
        },
        {
          "controlId": "opt74-lambda",
          "explanation": "Inizializza anche λ⁰, necessario per B⁰. Cambia i QP e ricalcola la sequenza, senza cambiare ℓ o h."
        }
      ],
      "origin": "source",
      "sourceFormulaIds": [
        "opt74-update"
      ]
    },
    {
      "formulaId": "opt74-qp",
      "latex": "\\Delta z^k=\\arg\\min_{\\Delta z}\\ \\nabla\\ell(z^k)^\\top\\Delta z+\\tfrac12\\Delta z^\\top B^k\\Delta z\\quad\\text{s.t. }h(z^k)+\\nabla h(z^k)^\\top\\Delta z=0",
      "conceptualExplanation": "Il QP deve avere una soluzione; nell’esempio si usa l’esatta Bᵏ di Newton. Se il modello non ha minimo, il ciclo si arresta esplicitamente.",
      "purpose": "Non inventare un argmin quando il QP è illimitato.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt74-x",
          "explanation": "Muove il punto iniziale e ricalcola l’intera sequenza con gli stessi costo e vincolo."
        },
        {
          "controlId": "opt74-y",
          "explanation": "Cambia l’ammissibilità iniziale e ricalcola la sequenza; al cambio dei parametri Play si ferma e k torna a zero."
        },
        {
          "controlId": "opt74-lambda",
          "explanation": "Inizializza anche λ⁰, necessario per B⁰. Cambia i QP e ricalcola la sequenza, senza cambiare ℓ o h."
        }
      ],
      "origin": "source",
      "sourceFormulaIds": [
        "opt74-qp"
      ]
    },
    {
      "formulaId": "opt74-example",
      "latex": "\\ell(z)=\\tfrac12(z_1^2+(z_2-1)^2),\\qquad h(z)=z_2-z_1^2",
      "conceptualExplanation": "Si inizializza anche λ⁰, dato aggiunto necessario per B⁰. Nessuna line search o modifica nascosta di B: dodici passi massimi, tolleranza ||r||≤10⁻¹⁰.",
      "purpose": "Definire il modello aggiunto comune alle pagine 70–74.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt74-x",
          "explanation": "Muove il punto iniziale e ricalcola l’intera sequenza con gli stessi costo e vincolo."
        },
        {
          "controlId": "opt74-y",
          "explanation": "Cambia l’ammissibilità iniziale e ricalcola la sequenza; al cambio dei parametri Play si ferma e k torna a zero."
        },
        {
          "controlId": "opt74-lambda",
          "explanation": "Inizializza anche λ⁰, necessario per B⁰. Cambia i QP e ricalcola la sequenza, senza cambiare ℓ o h."
        }
      ],
      "origin": "enrichment",
      "sourceFormulaIds": []
    },
    {
      "formulaId": "opt74-two-lambdas",
      "latex": "\\Delta\\lambda_{\\mathrm{Newton}}^k=\\Delta\\lambda_{\\mathrm{QP}}^k-\\lambda^k",
      "conceptualExplanation": "Stesso aggiornamento della 71, espresso attraverso il moltiplicatore del QP. Le due quantità coincidono solo se λᵏ=0.",
      "purpose": "Confrontare in numeri assegnazione e incremento.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt74-x",
          "explanation": "Muove il punto iniziale e ricalcola l’intera sequenza con gli stessi costo e vincolo."
        },
        {
          "controlId": "opt74-y",
          "explanation": "Cambia l’ammissibilità iniziale e ricalcola la sequenza; al cambio dei parametri Play si ferma e k torna a zero."
        },
        {
          "controlId": "opt74-lambda",
          "explanation": "Inizializza anche λ⁰, necessario per B⁰. Cambia i QP e ricalcola la sequenza, senza cambiare ℓ o h."
        }
      ],
      "origin": "enrichment",
      "sourceFormulaIds": []
    }
  ]
} as const satisfies Readonly<Record<number,readonly FormulaExplanation[]>>;
