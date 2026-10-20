import type {FormulaExplanation} from '../../components/ExplainedEquation';
export const meritFormulaNotes = {
  "75": [
    {
      "formulaId": "opt75-merit",
      "latex": "M_1(z;s)=\\ell(z)+s\\|h(z)\\|_1",
      "conceptualExplanation": "s pesa la violazione. Il modello aggiunto ha |λ⋆|=1/2.",
      "purpose": "Usare il vincolo di uguaglianza corretto nella companion.",
      "symbolDefinitions": [
        {
          "symbol": "M_1",
          "meaning": "Misura combinata di costo e violazione."
        },
        {
          "symbol": "s",
          "meaning": "Peso della penalità."
        },
        {
          "symbol": "h",
          "meaning": "Vincolo di uguaglianza, nullo sui punti ammissibili."
        }
      ],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt75-s",
          "explanation": "Cambia M₁ e i suoi minimi, senza cambiare ℓ o la parabola h=0."
        },
        {
          "controlId": "opt75-x",
          "explanation": "Muove il punto di prova e aggiorna costo, violazione e merit function."
        },
        {
          "controlId": "opt75-y",
          "explanation": "Modifica il residuo h e la penalità; il punto non viene proiettato sul vincolo."
        }
      ],
      "origin": "correction",
      "sourceFormulaIds": [
        "opt75-merit"
      ]
    },
    {
      "formulaId": "opt75-literal",
      "latex": "M_1(z;s)=\\ell(z)+s\\|g(z)\\|_1",
      "conceptualExplanation": "Formula originale conservata: il simbolo g non è il vincolo di uguaglianza definito qui.",
      "purpose": "Tracciare il refuso senza usarlo nei calcoli.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt75-s",
          "explanation": "Cambia M₁ e i suoi minimi, senza cambiare ℓ o la parabola h=0."
        },
        {
          "controlId": "opt75-x",
          "explanation": "Muove il punto di prova e aggiorna costo, violazione e merit function."
        },
        {
          "controlId": "opt75-y",
          "explanation": "Modifica il residuo h e la penalità; il punto non viene proiettato sul vincolo."
        }
      ],
      "origin": "source",
      "sourceFormulaIds": [
        "opt75-literal"
      ]
    },
    {
      "formulaId": "opt75-norm",
      "latex": "\\|z\\|_1=\\sum_{i=1}^d|z_i|",
      "conceptualExplanation": "Si sommano moduli delle componenti, senza compensazione dei segni.",
      "purpose": "Interpretare la misura della violazione.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt75-s",
          "explanation": "Cambia M₁ e i suoi minimi, senza cambiare ℓ o la parabola h=0."
        },
        {
          "controlId": "opt75-x",
          "explanation": "Muove il punto di prova e aggiorna costo, violazione e merit function."
        },
        {
          "controlId": "opt75-y",
          "explanation": "Modifica il residuo h e la penalità; il punto non viene proiettato sul vincolo."
        }
      ],
      "origin": "source",
      "sourceFormulaIds": [
        "opt75-norm"
      ]
    },
    {
      "formulaId": "opt75-exact",
      "latex": "s>\\max_i|\\lambda_i^\\star|",
      "conceptualExplanation": "Soglia di esattezza locale presso un minimo regolare; non rende minimo ogni punto KKT.",
      "purpose": "Distinguere la proposizione da una garanzia algoritmica.",
      "symbolDefinitions": [],
      "assumptions": [
        "Minimo locale del problema con uguaglianze e regolarità del contesto KKT; non basta il solo annullamento del residuo."
      ],
      "optionalDetails": [
        "La slide non ripete le ipotesi locali di regolarità. La companion le dichiara come condizioni d’uso, senza attribuirle al testo della proposizione.",
        "M₁ dipende da z e s, non da λ: il punto che minimizza localmente M₁ è z⋆."
      ],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt75-s",
          "explanation": "Cambia M₁ e i suoi minimi, senza cambiare ℓ o la parabola h=0."
        },
        {
          "controlId": "opt75-x",
          "explanation": "Muove il punto di prova e aggiorna costo, violazione e merit function."
        },
        {
          "controlId": "opt75-y",
          "explanation": "Modifica il residuo h e la penalità; il punto non viene proiettato sul vincolo."
        }
      ],
      "origin": "source",
      "sourceFormulaIds": [
        "opt75-exact"
      ]
    },
    {
      "formulaId": "opt75-example",
      "latex": "\\ell(z)=\\tfrac12(z_1^2+(z_2-1)^2),\\quad h(z)=z_2-z_1^2",
      "conceptualExplanation": "Costo e parabola sono quelli di 70–74. Per s>1/2 i due minimi della merit function coincidono con quelli vincolati.",
      "purpose": "Conservare il problema numerico aggiunto del batch J.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt75-s",
          "explanation": "Cambia M₁ e i suoi minimi, senza cambiare ℓ o la parabola h=0."
        },
        {
          "controlId": "opt75-x",
          "explanation": "Muove il punto di prova e aggiorna costo, violazione e merit function."
        },
        {
          "controlId": "opt75-y",
          "explanation": "Modifica il residuo h e la penalità; il punto non viene proiettato sul vincolo."
        }
      ],
      "origin": "enrichment",
      "sourceFormulaIds": []
    },
    {
      "formulaId": "opt75-minima",
      "latex": "\\begin{cases}z=(0,1-s),&0\\le s<1/2\\\\z=(x,1/2),\\ |x|\\le1/\\sqrt2,&s=1/2\\\\z=(\\pm1/\\sqrt2,1/2),&s>1/2\\end{cases}",
      "conceptualExplanation": "Sono i minimi globali del solo esempio. Alla soglia ci sono anche minimi non ammissibili; sotto soglia il minimo della merit function viola h=0.",
      "purpose": "Verificare il ruolo della disuguaglianza stretta.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [
        "Ponendo v=z₁²≥0, si minimizza v/2+(z₂−1)²/2+s|z₂−v|. Per z₂≥0 il minimo in v è 0 se s<1/2, v=z₂ se s>1/2, ogni v∈[0,z₂] se s=1/2. La successiva minimizzazione in z₂ dà i tre casi."
      ],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt75-s",
          "explanation": "Cambia M₁ e i suoi minimi, senza cambiare ℓ o la parabola h=0."
        },
        {
          "controlId": "opt75-x",
          "explanation": "Muove il punto di prova e aggiorna costo, violazione e merit function."
        },
        {
          "controlId": "opt75-y",
          "explanation": "Modifica il residuo h e la penalità; il punto non viene proiettato sul vincolo."
        }
      ],
      "origin": "enrichment",
      "sourceFormulaIds": []
    }
  ],
  "76": [
    {
      "formulaId": "opt76-accept",
      "latex": "M_1(z^k+\\bar\\gamma^i d^k;s)<M_1(z^k;s)+c\\bar\\gamma^i D M_1",
      "conceptualExplanation": "DM₁ è la derivata direzionale; si accetta sotto la soglia.",
      "purpose": "Esprimere la condizione d’uscita del while ≥.",
      "symbolDefinitions": [
        {
          "symbol": "\\bar\\gamma^i",
          "meaning": "Candidato al tentativo interno i."
        },
        {
          "symbol": "c",
          "meaning": "Frazione della diminuzione lineare richiesta."
        },
        {
          "symbol": "DM_1",
          "meaning": "Derivata unilaterale di M₁ nella direzione dᵏ, a s fissato."
        }
      ],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt76-s",
          "explanation": "Cambia il profilo M₁ e il numero di rifiuti; punto e direzione restano fissi."
        },
        {
          "controlId": "opt76-beta",
          "explanation": "Cambia la sequenza dei candidati; non cambia curva o soglia come funzioni di γ."
        },
        {
          "controlId": "opt76-c",
          "explanation": "Cambia la soglia lineare; β non cambia la sua pendenza."
        }
      ],
      "origin": "source",
      "sourceFormulaIds": [
        "opt76-accept"
      ]
    },
    {
      "formulaId": "opt76-slope",
      "latex": "D M_1=\\nabla\\ell(z^k)^\\top d^k-s\\|h(z^k)\\|_1",
      "conceptualExplanation": "Derivata unilaterale lungo dᵏ, se ∇h(zᵏ)ᵀdᵏ=−h(zᵏ). In generale non è la derivata per una direzione arbitraria.",
      "purpose": "Esplicitare l’ipotesi che rende valida la formula.",
      "symbolDefinitions": [],
      "assumptions": [
        "Direzione SQP che annulla il vincolo linearizzato; γ≥0."
      ],
      "optionalDetails": [
        "Se hⱼ≠0, la derivata di |hⱼ| lungo la direzione è −|hⱼ|. Se hⱼ=0, la derivata lineare del vincolo è zero, quindi il contributo direzionale della norma è zero."
      ],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt76-s",
          "explanation": "Cambia il profilo M₁ e il numero di rifiuti; punto e direzione restano fissi."
        },
        {
          "controlId": "opt76-beta",
          "explanation": "Cambia la sequenza dei candidati; non cambia curva o soglia come funzioni di γ."
        },
        {
          "controlId": "opt76-c",
          "explanation": "Cambia la soglia lineare; β non cambia la sua pendenza."
        }
      ],
      "origin": "source",
      "sourceFormulaIds": [
        "opt76-slope"
      ]
    },
    {
      "formulaId": "opt76-shrink",
      "latex": "\\bar\\gamma^{i+1}=\\beta\\bar\\gamma^i,\\quad\\gamma^k=\\bar\\gamma^i",
      "conceptualExplanation": "i è il contatore interno, k l’iterazione esterna.",
      "purpose": "Leggere i due indici senza scambiarli.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt76-s",
          "explanation": "Cambia il profilo M₁ e il numero di rifiuti; punto e direzione restano fissi."
        },
        {
          "controlId": "opt76-beta",
          "explanation": "Cambia la sequenza dei candidati; non cambia curva o soglia come funzioni di γ."
        },
        {
          "controlId": "opt76-c",
          "explanation": "Cambia la soglia lineare; β non cambia la sua pendenza."
        }
      ],
      "origin": "source",
      "sourceFormulaIds": [
        "opt76-shrink"
      ]
    },
    {
      "formulaId": "opt76-weight",
      "latex": "s^k>\\|\\lambda^k\\|_\\infty",
      "conceptualExplanation": "La fonte lo suggerisce come adattamento pratico; λᵏ non è necessariamente λ⋆.",
      "purpose": "Evitare una falsa garanzia di esattezza.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt76-s",
          "explanation": "Cambia il profilo M₁ e il numero di rifiuti; punto e direzione restano fissi."
        },
        {
          "controlId": "opt76-beta",
          "explanation": "Cambia la sequenza dei candidati; non cambia curva o soglia come funzioni di γ."
        },
        {
          "controlId": "opt76-c",
          "explanation": "Cambia la soglia lineare; β non cambia la sua pendenza."
        }
      ],
      "origin": "source",
      "sourceFormulaIds": [
        "opt76-weight"
      ]
    },
    {
      "formulaId": "opt76-example",
      "latex": "\\ell(z)=\\tfrac12(z_1^2+(z_2-1)^2),\\quad h(z)=z_2-z_1^2",
      "conceptualExplanation": "Fissi z=(1,1), λ=.2, d=(−5/23,−10/23), γ̄⁰=1. La direzione soddisfa la fattibilità linearizzata.",
      "purpose": "Conservare il problema numerico aggiunto del batch J.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt76-s",
          "explanation": "Cambia il profilo M₁ e il numero di rifiuti; punto e direzione restano fissi."
        },
        {
          "controlId": "opt76-beta",
          "explanation": "Cambia la sequenza dei candidati; non cambia curva o soglia come funzioni di γ."
        },
        {
          "controlId": "opt76-c",
          "explanation": "Cambia la soglia lineare; β non cambia la sua pendenza."
        }
      ],
      "origin": "enrichment",
      "sourceFormulaIds": []
    },
    {
      "formulaId": "opt76-profile",
      "latex": "\\ell(z+\\gamma d)=\\tfrac12-\\tfrac5{23}\\gamma+\\tfrac{125}{1058}\\gamma^2,\\quad h(z+\\gamma d)=-\\tfrac{25}{529}\\gamma^2",
      "conceptualExplanation": "Il vincolo iniziale è zero; la sua violazione lungo il passo compare al secondo ordine.",
      "purpose": "Calcolare curva e test da formule esatte del modello.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt76-s",
          "explanation": "Cambia il profilo M₁ e il numero di rifiuti; punto e direzione restano fissi."
        },
        {
          "controlId": "opt76-beta",
          "explanation": "Cambia la sequenza dei candidati; non cambia curva o soglia come funzioni di γ."
        },
        {
          "controlId": "opt76-c",
          "explanation": "Cambia la soglia lineare; β non cambia la sua pendenza."
        }
      ],
      "origin": "enrichment",
      "sourceFormulaIds": []
    },
    {
      "formulaId": "opt76-gap",
      "latex": "\\mathrm{gap}=\\frac{\\gamma}{1058}\\big[\\gamma(125+50s)-230(1-c)\\big]",
      "conceptualExplanation": "Gap = M₁ candidato meno soglia. Si accetta solo se negativo; il pareggio non usa una tolleranza di comodo.",
      "purpose": "Conservare i casi di uguaglianza evitando cancellazioni numeriche.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt76-s",
          "explanation": "Cambia il profilo M₁ e il numero di rifiuti; punto e direzione restano fissi."
        },
        {
          "controlId": "opt76-beta",
          "explanation": "Cambia la sequenza dei candidati; non cambia curva o soglia come funzioni di γ."
        },
        {
          "controlId": "opt76-c",
          "explanation": "Cambia la soglia lineare; β non cambia la sua pendenza."
        }
      ],
      "origin": "enrichment",
      "sourceFormulaIds": []
    }
  ],
  "77": [
    {
      "formulaId": "opt77-update",
      "latex": "\\begin{aligned}z^{k+1}&=z^k+\\gamma^k\\Delta z^k\\\\\\lambda^{k+1}&=(1-\\gamma^k)\\lambda^k+\\gamma^k\\Delta\\lambda_{\\mathrm{QP}}^k\\end{aligned}",
      "conceptualExplanation": "Δλ_QPᵏ è il moltiplicatore completo, non l’incremento Newton.",
      "purpose": "Usare il medesimo γᵏ nei due aggiornamenti.",
      "symbolDefinitions": [
        {
          "symbol": "\\Delta z^k",
          "meaning": "Passo primale restituito dal QP."
        },
        {
          "symbol": "\\Delta\\lambda_{\\mathrm{QP}}^k",
          "meaning": "Moltiplicatore completo del QP, non incremento."
        },
        {
          "symbol": "\\gamma^k",
          "meaning": "Lunghezza accettata da Armijo."
        }
      ],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt77-x",
          "explanation": "Ricalcola l’intera sequenza con λ⁰=.2; ferma Play e torna a k=0."
        },
        {
          "controlId": "opt77-y",
          "explanation": "Cambia fattibilità e QP iniziali; non cambia il problema."
        },
        {
          "controlId": "opt77-floor",
          "explanation": "Cambia il peso adattivo e i passi Armijo; costo e vincolo restano fissi."
        }
      ],
      "origin": "source",
      "sourceFormulaIds": [
        "opt77-update"
      ]
    },
    {
      "formulaId": "opt77-qp",
      "latex": "\\min_{\\Delta z}\\ \\nabla\\ell(z^k)^\\top\\Delta z+\\tfrac12\\Delta z^\\top B^k\\Delta z\\quad\\text{s.t. }h(z^k)+\\nabla h(z^k)^\\top\\Delta z=0",
      "conceptualExplanation": "Il QP deve avere un minimo. Resta valida la condizione di curvatura chiarita nella 73.",
      "purpose": "Conservare il modello della fonte senza regolarizzarlo di nascosto.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt77-x",
          "explanation": "Ricalcola l’intera sequenza con λ⁰=.2; ferma Play e torna a k=0."
        },
        {
          "controlId": "opt77-y",
          "explanation": "Cambia fattibilità e QP iniziali; non cambia il problema."
        },
        {
          "controlId": "opt77-floor",
          "explanation": "Cambia il peso adattivo e i passi Armijo; costo e vincolo restano fissi."
        }
      ],
      "origin": "source",
      "sourceFormulaIds": [
        "opt77-qp"
      ]
    },
    {
      "formulaId": "opt77-search",
      "latex": "\\gamma^k:\\ \\text{Armijo su }M_1(z^k+\\gamma\\Delta z^k;s)",
      "conceptualExplanation": "Il peso rimane fisso nei tentativi della singola ricerca; può cambiare all’iterazione successiva.",
      "purpose": "Collegare 75–76 al ciclo SQP.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt77-x",
          "explanation": "Ricalcola l’intera sequenza con λ⁰=.2; ferma Play e torna a k=0."
        },
        {
          "controlId": "opt77-y",
          "explanation": "Cambia fattibilità e QP iniziali; non cambia il problema."
        },
        {
          "controlId": "opt77-floor",
          "explanation": "Cambia il peso adattivo e i passi Armijo; costo e vincolo restano fissi."
        }
      ],
      "origin": "source",
      "sourceFormulaIds": [
        "opt77-search"
      ]
    },
    {
      "formulaId": "opt77-example",
      "latex": "\\ell(z)=\\tfrac12(z_1^2+(z_2-1)^2),\\quad h(z)=z_2-z_1^2",
      "conceptualExplanation": "λ⁰=.2, β=.5, c=.1, γ̄⁰=1 sono fissati nell’esempio; punto iniziale e peso minimo sono modificabili.",
      "purpose": "Conservare il problema numerico aggiunto del batch J.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt77-x",
          "explanation": "Ricalcola l’intera sequenza con λ⁰=.2; ferma Play e torna a k=0."
        },
        {
          "controlId": "opt77-y",
          "explanation": "Cambia fattibilità e QP iniziali; non cambia il problema."
        },
        {
          "controlId": "opt77-floor",
          "explanation": "Cambia il peso adattivo e i passi Armijo; costo e vincolo restano fissi."
        }
      ],
      "origin": "enrichment",
      "sourceFormulaIds": []
    },
    {
      "formulaId": "opt77-penalty",
      "latex": "s^k=\\max\\{s_{\\min},|\\lambda^k|+0.1,|\\Delta\\lambda_{\\mathrm{QP}}^k|+0.1\\}",
      "conceptualExplanation": "Scelta aggiunta: include anche il moltiplicatore del QP oltre al suggerimento della 76. Non è una garanzia globale.",
      "purpose": "Dichiarare esattamente il peso usato nel codice.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [
        "Se la direzione non è di discesa per M₁, il calcolo si ferma. Se il QP è illimitato o il sistema è singolare, non si fabbrica un passo.",
        "Non confrontare valori di M₁ con pesi diversi come se fossero la stessa funzione monotona. Il grafico destro mostra il residuo KKT; la superficie usa sᵏ selezionato."
      ],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt77-x",
          "explanation": "Ricalcola l’intera sequenza con λ⁰=.2; ferma Play e torna a k=0."
        },
        {
          "controlId": "opt77-y",
          "explanation": "Cambia fattibilità e QP iniziali; non cambia il problema."
        },
        {
          "controlId": "opt77-floor",
          "explanation": "Cambia il peso adattivo e i passi Armijo; costo e vincolo restano fissi."
        }
      ],
      "origin": "enrichment",
      "sourceFormulaIds": []
    },
    {
      "formulaId": "opt77-blend",
      "latex": "\\gamma^0=1/2,\\quad\\lambda^1=\\tfrac12(0.2)+\\tfrac12(10/23)\\simeq0.317391",
      "conceptualExplanation": "Con s_min=3 e z⁰=(1,1), il primo passo è dimezzato; anche il moltiplicatore viene rilassato.",
      "purpose": "Verificare numericamente la formula di aggiornamento.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt77-x",
          "explanation": "Ricalcola l’intera sequenza con λ⁰=.2; ferma Play e torna a k=0."
        },
        {
          "controlId": "opt77-y",
          "explanation": "Cambia fattibilità e QP iniziali; non cambia il problema."
        },
        {
          "controlId": "opt77-floor",
          "explanation": "Cambia il peso adattivo e i passi Armijo; costo e vincolo restano fissi."
        }
      ],
      "origin": "enrichment",
      "sourceFormulaIds": []
    }
  ],
  "78": [
    {
      "formulaId": "opt78-barrier",
      "latex": "\\min_z\\ \\ell(z)-\\varepsilon\\sum_{j=1}^r\\log(-g_j(z))\\quad\\text{s.t. }h(z)=0",
      "conceptualExplanation": "Serve gⱼ<0 ed ε>0. La barriera non impone h=0 da sola.",
      "purpose": "Dichiarare dominio e uguaglianza residua.",
      "symbolDefinitions": [
        {
          "symbol": "\\varepsilon",
          "meaning": "Peso positivo della barriera."
        },
        {
          "symbol": "g_j",
          "meaning": "Disuguaglianza; il log richiede gⱼ<0."
        },
        {
          "symbol": "h",
          "meaning": "Uguaglianza che resta imposta."
        }
      ],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt78-epsilon",
          "explanation": "Cambia la superficie e il minimo interno, non il bordo z₁=0 o la retta z₂=.6."
        },
        {
          "controlId": "opt78-x",
          "explanation": "Muove il punto; a zero il costo con barriera non viene valutato."
        },
        {
          "controlId": "opt78-y",
          "explanation": "Cambia h senza modificare l’ammissibilità stretta della disuguaglianza."
        }
      ],
      "origin": "source",
      "sourceFormulaIds": [
        "opt78-barrier"
      ]
    },
    {
      "formulaId": "opt78-log",
      "latex": "-\\varepsilon\\log(z),\\quad z>0",
      "conceptualExplanation": "Diverge a +∞ vicino a zero; può essere negativa per z>1.",
      "purpose": "Interpretare la figura originale senza inventarne coordinate.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt78-epsilon",
          "explanation": "Cambia la superficie e il minimo interno, non il bordo z₁=0 o la retta z₂=.6."
        },
        {
          "controlId": "opt78-x",
          "explanation": "Muove il punto; a zero il costo con barriera non viene valutato."
        },
        {
          "controlId": "opt78-y",
          "explanation": "Cambia h senza modificare l’ammissibilità stretta della disuguaglianza."
        }
      ],
      "origin": "source",
      "sourceFormulaIds": [
        "opt78-log"
      ]
    },
    {
      "formulaId": "opt78-example",
      "latex": "\\ell=\\tfrac12((z_1+1)^2+(z_2-0.6)^2),\\quad g=-z_1,\\quad h=z_2-0.6",
      "conceptualExplanation": "Esempio aggiunto: semipiano e retta orizzontale. Un punto può rispettare g<0 e violare h=0.",
      "purpose": "Mostrare perché l’uguaglianza resta necessaria.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt78-epsilon",
          "explanation": "Cambia la superficie e il minimo interno, non il bordo z₁=0 o la retta z₂=.6."
        },
        {
          "controlId": "opt78-x",
          "explanation": "Muove il punto; a zero il costo con barriera non viene valutato."
        },
        {
          "controlId": "opt78-y",
          "explanation": "Cambia h senza modificare l’ammissibilità stretta della disuguaglianza."
        }
      ],
      "origin": "enrichment",
      "sourceFormulaIds": []
    },
    {
      "formulaId": "opt78-minimum",
      "latex": "z_{1,\\varepsilon}=\\frac{2\\varepsilon}{1+\\sqrt{1+4\\varepsilon}},\\quad z_{2,\\varepsilon}=0.6",
      "conceptualExplanation": "Minimo interno analitico del modello, non un solver generico. Si avvicina al minimo originale (0,.6) quando ε↓0.",
      "purpose": "Collegare il parametro alla soluzione evitando cancellazioni.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [
        "Derivando lungo h=0: z₁+1−ε/z₁=0, dunque z₁²+z₁−ε=0. La formula razionalizzata resta stabile per ε piccolo positivo.",
        "Il punto (0,.6) è ammissibile per il problema originale, ma non è nel dominio della barriera e non viene valutato sulla superficie 3D."
      ],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt78-epsilon",
          "explanation": "Cambia la superficie e il minimo interno, non il bordo z₁=0 o la retta z₂=.6."
        },
        {
          "controlId": "opt78-x",
          "explanation": "Muove il punto; a zero il costo con barriera non viene valutato."
        },
        {
          "controlId": "opt78-y",
          "explanation": "Cambia h senza modificare l’ammissibilità stretta della disuguaglianza."
        }
      ],
      "origin": "enrichment",
      "sourceFormulaIds": []
    }
  ],
  "79": [],
  "80": [
    {
      "formulaId": "opt80-notation",
      "latex": "z\\in\\mathbb R^d,\\qquad z^k\\in\\mathbb R^d",
      "conceptualExplanation": "Stesso spazio decisionale; k numera la stima, senza elevare z a potenza.",
      "purpose": "Leggere il significato dell’apice.",
      "symbolDefinitions": [
        {
          "symbol": "z",
          "meaning": "Decisione generica."
        },
        {
          "symbol": "z^k",
          "meaning": "Stima all’iterazione k; non una potenza."
        },
        {
          "symbol": "d",
          "meaning": "Dimensione della decisione."
        }
      ],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt80-k",
          "explanation": "Seleziona un campione della sequenza aggiunta; non cambia il punto di prova libero."
        },
        {
          "controlId": "opt80-z",
          "explanation": "Sposta solo il punto di prova sul costo; non ricalcola l’algoritmo."
        }
      ],
      "origin": "source",
      "sourceFormulaIds": [
        "opt80-notation"
      ]
    },
    {
      "formulaId": "opt80-problem",
      "latex": "\\min_{z\\in\\mathbb R^d}\\ell(z),\\qquad\\ell:\\mathbb R^d\\to\\mathbb R",
      "conceptualExplanation": "La variabile e il costo sono generici; la slide non assegna un algoritmo.",
      "purpose": "Conservare il livello di generalità della fonte.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt80-k",
          "explanation": "Seleziona un campione della sequenza aggiunta; non cambia il punto di prova libero."
        },
        {
          "controlId": "opt80-z",
          "explanation": "Sposta solo il punto di prova sul costo; non ricalcola l’algoritmo."
        }
      ],
      "origin": "source",
      "sourceFormulaIds": [
        "opt80-problem"
      ]
    },
    {
      "formulaId": "opt80-example",
      "latex": "\\ell(z)=\\tfrac12(z-1)^2,\\quad z^{k+1}=z^k-\\tfrac12(z^k-1),\\quad z^0=-2",
      "conceptualExplanation": "Esempio scalare aggiunto: gradient method a passo 1/2. Si distinguono il punto di prova z e il campione zᵏ.",
      "purpose": "Dare un algoritmo concreto senza attribuirlo alla fonte.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt80-k",
          "explanation": "Seleziona un campione della sequenza aggiunta; non cambia il punto di prova libero."
        },
        {
          "controlId": "opt80-z",
          "explanation": "Sposta solo il punto di prova sul costo; non ricalcola l’algoritmo."
        }
      ],
      "origin": "enrichment",
      "sourceFormulaIds": []
    },
    {
      "formulaId": "opt80-sequence",
      "latex": "z^k=1-3\\,2^{-k}",
      "conceptualExplanation": "Formula esatta della sequenza aggiunta. k indica la posizione nella sequenza; 2⁻ᵏ è invece una vera potenza.",
      "purpose": "Verificare i valori di ogni stima.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt80-k",
          "explanation": "Seleziona un campione della sequenza aggiunta; non cambia il punto di prova libero."
        },
        {
          "controlId": "opt80-z",
          "explanation": "Sposta solo il punto di prova sul costo; non ricalcola l’algoritmo."
        }
      ],
      "origin": "enrichment",
      "sourceFormulaIds": []
    }
  ],
  "81": [
    {
      "formulaId": "opt81-index",
      "latex": "\\begin{gathered}x_{t+1}=f_t(x_t,u_t)\\\\(x,u),\\quad(x^k,u^k),\\quad(x_t^k,u_t^k)\\end{gathered}",
      "conceptualExplanation": "k cambia la stima completa; t ne sceglie una componente temporale.",
      "purpose": "Distinguere i due indici senza aggiungere dimensioni fisiche.",
      "symbolDefinitions": [
        {
          "symbol": "k",
          "meaning": "Indice dell’algoritmo."
        },
        {
          "symbol": "t",
          "meaning": "Indice temporale del sistema."
        },
        {
          "symbol": "f_t",
          "meaning": "Mappa dinamica al tempo t."
        },
        {
          "symbol": "(x^k,u^k)",
          "meaning": "Stima completa delle sequenze di stati e ingressi."
        }
      ],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt81-k",
          "explanation": "Cambia tutta la riga di stati e ingressi e la traiettoria selezionata; t resta fisso."
        },
        {
          "controlId": "opt81-t",
          "explanation": "Seleziona una componente della stessa stima; non esegue un aggiornamento dell’algoritmo."
        }
      ],
      "origin": "source",
      "sourceFormulaIds": [
        "opt81-index"
      ]
    },
    {
      "formulaId": "opt81-time",
      "latex": "x_t:=x(t),\\quad u_t:=u(t),\\quad t\\in\\mathbb N",
      "conceptualExplanation": "Il pedice è una notazione compatta per il tempo discreto.",
      "purpose": "Collegare la scrittura di controllo a quella usata nel corso.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt81-k",
          "explanation": "Cambia tutta la riga di stati e ingressi e la traiettoria selezionata; t resta fisso."
        },
        {
          "controlId": "opt81-t",
          "explanation": "Seleziona una componente della stessa stima; non esegue un aggiornamento dell’algoritmo."
        }
      ],
      "origin": "source",
      "sourceFormulaIds": [
        "opt81-time"
      ]
    },
    {
      "formulaId": "opt81-example",
      "latex": "x_0=2,\\quad x_{t+1}=x_t+u_t,\\quad T=3,\\quad J=\\tfrac12\\sum_{t=0}^{2}u_t^2+\\tfrac12x_3^2",
      "conceptualExplanation": "Problema aggiunto. Eliminata la dinamica, si applica il gradiente agli ingressi con passo .2 e u⁰=0.",
      "purpose": "Generare stime reali di un algoritmo, tutte coerenti con la dinamica.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt81-k",
          "explanation": "Cambia tutta la riga di stati e ingressi e la traiettoria selezionata; t resta fisso."
        },
        {
          "controlId": "opt81-t",
          "explanation": "Seleziona una componente della stessa stima; non esegue un aggiornamento dell’algoritmo."
        }
      ],
      "origin": "enrichment",
      "sourceFormulaIds": []
    },
    {
      "formulaId": "opt81-iterates",
      "latex": "u_t^k=-\\tfrac12(1-0.2^k),\\quad x_t^k=2+t\\,u_0^k",
      "conceptualExplanation": "Formula esatta dell’esempio: ingressi t=0,1,2 e stati t=0,1,2,3. Non esiste u₃ in questo orizzonte.",
      "purpose": "Verificare ogni cella della matrice e il bordo temporale.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [
        "J(u)=||u||²/2+(2+Σu)²/2, quindi ∇J=u+(2+Σu)1. Per ingressi uguali q, il passo .2 dà q_new=.2q−.4 e q_k=−(1−.2^k)/2.",
        "Hessiana I+11ᵀ con autovalori 1,1,4: il passo .2 è stabile per questo esempio. Il minimo ha u_t=−.5, x_3=.5.",
        "Le stime mostrate sono già ammissibili perché la dinamica è stata eliminata: non è una proprietà generale di tutte le stime di algoritmi di controllo ottimo."
      ],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt81-k",
          "explanation": "Cambia tutta la riga di stati e ingressi e la traiettoria selezionata; t resta fisso."
        },
        {
          "controlId": "opt81-t",
          "explanation": "Seleziona una componente della stessa stima; non esegue un aggiornamento dell’algoritmo."
        }
      ],
      "origin": "enrichment",
      "sourceFormulaIds": []
    }
  ]
} as const satisfies Readonly<Record<number,readonly FormulaExplanation[]>>;
