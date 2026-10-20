import type {FormulaExplanation} from '../../components/ExplainedEquation';
export const kktFormulaNotes = {
  "55": [],
  "56": [
    {
      "formulaId": "opt56-problem",
      "latex": "\\begin{aligned}\\min_{z\\in\\mathbb R^d}\\;&\\ell(z)\\\\\\text{subj.to }&g_j(z)\\le0,\\ j\\in\\{1,\\ldots,r\\}\\\\&h_i(z)=0,\\ i\\in\\{1,\\ldots,m\\}\\end{aligned}",
      "conceptualExplanation": "Tutti i gⱼ≤0 e tutti gli hᵢ=0. Il costo confronta soltanto i punti ammissibili.",
      "purpose": "Distinguere criterio e ammissibilità.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt56-a",
          "explanation": "Sposta i livelli e il minimo vincolato, saturandone l’ascissa fra 0 e 1."
        },
        {
          "controlId": "opt56-b",
          "explanation": "Sposta il minimo libero e i livelli; il minimo vincolato resta sulla stessa ascissa."
        },
        {
          "controlId": "opt56-x",
          "explanation": "Muove la sonda e i residui delle due disuguaglianze; non sposta l’insieme."
        },
        {
          "controlId": "opt56-y",
          "explanation": "Esplora anche punti fuori dall’uguaglianza; il segmento ammissibile resta fisso."
        }
      ],
      "origin": "source",
      "sourceFormulaIds": [
        "opt56-problem"
      ]
    },
    {
      "formulaId": "opt56-example",
      "latex": "\\ell(z)=\\tfrac12((z_1-a)^2+(z_2-b)^2),\\quad g_1(z)=-z_1,\\quad g_2(z)=z_1-1,\\quad h_1(z)=z_2",
      "conceptualExplanation": "Vincoli: 0≤z₁≤1, z₂=0. Il bersaglio del costo è (a,b).",
      "purpose": "Specificare il modello aggiunto e i suoi limiti.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt56-a",
          "explanation": "Sposta i livelli e il minimo vincolato, saturandone l’ascissa fra 0 e 1."
        },
        {
          "controlId": "opt56-b",
          "explanation": "Sposta il minimo libero e i livelli; il minimo vincolato resta sulla stessa ascissa."
        },
        {
          "controlId": "opt56-x",
          "explanation": "Muove la sonda e i residui delle due disuguaglianze; non sposta l’insieme."
        },
        {
          "controlId": "opt56-y",
          "explanation": "Esplora anche punti fuori dall’uguaglianza; il segmento ammissibile resta fisso."
        }
      ],
      "origin": "enrichment",
      "sourceFormulaIds": []
    },
    {
      "formulaId": "opt56-solution",
      "latex": "z^\\star=(\\min(1,\\max(0,a)),0)",
      "conceptualExplanation": "Il minimo esatto dell’esempio è la proiezione del bersaglio sul segmento; b modifica il costo minimo, non la sua ascissa.",
      "purpose": "Confrontare ammissibilità e soluzione nota.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt56-a",
          "explanation": "Sposta i livelli e il minimo vincolato, saturandone l’ascissa fra 0 e 1."
        },
        {
          "controlId": "opt56-b",
          "explanation": "Sposta il minimo libero e i livelli; il minimo vincolato resta sulla stessa ascissa."
        },
        {
          "controlId": "opt56-x",
          "explanation": "Muove la sonda e i residui delle due disuguaglianze; non sposta l’insieme."
        },
        {
          "controlId": "opt56-y",
          "explanation": "Esplora anche punti fuori dall’uguaglianza; il segmento ammissibile resta fisso."
        }
      ],
      "origin": "enrichment",
      "sourceFormulaIds": []
    }
  ],
  "57": [
    {
      "formulaId": "opt57-active",
      "latex": "A(z)=\\{j\\in\\{1,\\ldots,r\\}\\mid g_j(z)=0\\}",
      "conceptualExplanation": "Attivi: gⱼ=0. Per la regolarità si aggiungono tutti i gradienti delle uguaglianze, anche se nulli.",
      "purpose": "Selezionare i vettori pertinenti.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [
        "Per applicare KKT si considera un punto ammissibile. Un punto con g>0 non diventa ammissibile perché quel vincolo non compare in A(z)."
      ],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt57-x",
          "explanation": "Muove il punto ammissibile; cambia A(z), l’elenco dei gradienti e il loro rango, mantenendo il segmento."
        }
      ],
      "origin": "source",
      "sourceFormulaIds": [
        "opt57-active"
      ]
    },
    {
      "formulaId": "opt57-regular",
      "latex": "\\nabla h_i(z),\\ i\\in\\{1,\\ldots,m\\},\\quad\\nabla g_j(z),\\ j\\in A(z)\\quad\\text{linearly independent}",
      "conceptualExplanation": "I vettori sono colonne in Rᵈ, secondo la convenzione del corso. Il loro numero non può superare d.",
      "purpose": "Leggere la condizione di regolarità senza trasporre la convenzione del corso.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt57-x",
          "explanation": "Muove il punto ammissibile; cambia A(z), l’elenco dei gradienti e il loro rango, mantenendo il segmento."
        }
      ],
      "origin": "source",
      "sourceFormulaIds": [
        "opt57-regular"
      ]
    },
    {
      "formulaId": "opt57-example",
      "latex": "g_1(z)=-z_1,\\quad g_2(z)=z_1-1,\\quad h_1(z)=z_2",
      "conceptualExplanation": "Sul segmento, il modello standard ha una normale verticale e, soltanto agli estremi, una normale orizzontale.",
      "purpose": "Specificare il modello aggiunto e i suoi limiti.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt57-x",
          "explanation": "Muove il punto ammissibile; cambia A(z), l’elenco dei gradienti e il loro rango, mantenendo il segmento."
        }
      ],
      "origin": "enrichment",
      "sourceFormulaIds": []
    },
    {
      "formulaId": "opt57-variants",
      "latex": "g_3=-2z_1\\quad\\text{o}\\quad h_1=z_2^3\\quad\\text{o}\\quad g_1=-z_1^3",
      "conceptualExplanation": "Duplicare la normale o annullarne il gradiente può distruggere la regolarità pur lasciando identico il segmento.",
      "purpose": "Mostrare che la regolarità dipende dalla rappresentazione.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt57-x",
          "explanation": "Muove il punto ammissibile; cambia A(z), l’elenco dei gradienti e il loro rango, mantenendo il segmento."
        }
      ],
      "origin": "enrichment",
      "sourceFormulaIds": []
    }
  ],
  "58": [
    {
      "formulaId": "opt58-lagrangian",
      "latex": "L(z,\\mu,\\lambda)=\\ell(z)+\\sum_{j=1}^r\\mu_j g_j(z)+\\sum_{i=1}^m\\lambda_i h_i(z)",
      "conceptualExplanation": "μ e λ sono “prezzi” dei residui: μ∈Rʳ e λ∈Rᵐ. Il requisito μ≥0 delle KKT arriva dopo.",
      "purpose": "Collegare ogni moltiplicatore al suo vincolo.",
      "symbolDefinitions": [
        {
          "symbol": "\\nabla_1L",
          "meaning": "Gradiente rispetto alla prima variabile z, tenendo μ e λ fissati."
        }
      ],
      "assumptions": [],
      "optionalDetails": [
        "L non è una penalità non negativa: μg può essere negativo in punti ammissibili.",
        "Minimizzare congiuntamente in z,μ,λ non recupera in generale il problema originale. Con g≠0 o h≠0, un moltiplicatore libero può far tendere L a −∞.",
        "È invece lecito definire e studiare inf_z L(z,μ,λ) per moltiplicatori fissati; nessun algoritmo duale viene implementato qui."
      ],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt58-mu",
          "explanation": "Inclina L rispetto a z₁ e muove il suo minimo libero; il costo originale e il vincolo restano fissi. Qui μ è reale, come nella definizione."
        },
        {
          "controlId": "opt58-lambda",
          "explanation": "Inclina L rispetto a z₂; nessun vincolo di segno su λ."
        },
        {
          "controlId": "opt58-x",
          "explanation": "Cambia costo, termine μg e valore L alla sonda."
        },
        {
          "controlId": "opt58-y",
          "explanation": "Cambia residuo h, termine λh e valore L alla sonda."
        }
      ],
      "origin": "source",
      "sourceFormulaIds": [
        "opt58-lagrangian"
      ]
    },
    {
      "formulaId": "opt58-example",
      "latex": "\\ell=\\tfrac12((z_1+0.5)^2+(z_2-0.6)^2),\\quad g_1=-z_1,\\ h_1=z_2",
      "conceptualExplanation": "Il problema originale ammette la semiretta z₁≥0, z₂=0 e ha minimo (0,0). Il grafico mostra L con moltiplicatori fissati.",
      "purpose": "Specificare il modello aggiunto e i suoi limiti.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt58-mu",
          "explanation": "Inclina L rispetto a z₁ e muove il suo minimo libero; il costo originale e il vincolo restano fissi. Qui μ è reale, come nella definizione."
        },
        {
          "controlId": "opt58-lambda",
          "explanation": "Inclina L rispetto a z₂; nessun vincolo di segno su λ."
        },
        {
          "controlId": "opt58-x",
          "explanation": "Cambia costo, termine μg e valore L alla sonda."
        },
        {
          "controlId": "opt58-y",
          "explanation": "Cambia residuo h, termine λh e valore L alla sonda."
        }
      ],
      "origin": "enrichment",
      "sourceFormulaIds": []
    },
    {
      "formulaId": "opt58-free-minimum",
      "latex": "\\arg\\min_z L(z,\\mu,\\lambda)=(-0.5+\\mu,\\ 0.6-\\lambda)",
      "conceptualExplanation": "La Hessiana rispetto a z è I. Questo minimo di L a prezzi fissati è spesso inammissibile per il problema originale.",
      "purpose": "Separare il minimo del modello dalla soluzione vincolata.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt58-mu",
          "explanation": "Inclina L rispetto a z₁ e muove il suo minimo libero; il costo originale e il vincolo restano fissi. Qui μ è reale, come nella definizione."
        },
        {
          "controlId": "opt58-lambda",
          "explanation": "Inclina L rispetto a z₂; nessun vincolo di segno su λ."
        },
        {
          "controlId": "opt58-x",
          "explanation": "Cambia costo, termine μg e valore L alla sonda."
        },
        {
          "controlId": "opt58-y",
          "explanation": "Cambia residuo h, termine λh e valore L alla sonda."
        }
      ],
      "origin": "enrichment",
      "sourceFormulaIds": []
    }
  ],
  "59": [
    {
      "formulaId": "opt59-problem",
      "latex": "\\begin{aligned}\\min_{z\\in\\mathbb R^d}\\;&\\ell(z)\\\\\\text{subj.to }&g_j(z)\\le0,\\ j\\in\\{1,\\ldots,r\\}\\\\&h_i(z)=0,\\ i\\in\\{1,\\ldots,m\\}\\end{aligned}",
      "conceptualExplanation": "Il teorema parte da un minimo locale regolare, con ℓ, gⱼ e hᵢ di classe C¹. Qui la conclusione non è ancora comparsa.",
      "purpose": "Tenere distinte ipotesi e conclusione della progressiva.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [],
      "origin": "source",
      "sourceFormulaIds": [
        "opt59-problem"
      ]
    },
    {
      "formulaId": "opt59-example",
      "latex": "\\ell(z)=z_1,\\quad h_1(z)=z_2,\\quad g_1(z)=-z_1\\ \\text{o}\\ -z_1^3",
      "conceptualExplanation": "Entrambe le rappresentazioni danno z₁≥0, z₂=0 e lo stesso minimo globale z⋆=(0,0). Tutte le funzioni sono C∞.",
      "purpose": "Specificare il modello aggiunto e i suoi limiti.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [],
      "origin": "enrichment",
      "sourceFormulaIds": []
    },
    {
      "formulaId": "opt59-balance",
      "latex": "(1,0)+\\mu\\nabla g_1(0)+\\lambda(0,1)=0",
      "conceptualExplanation": "Con g₁=−z₁ si ottiene μ=1, λ=0. Con g₁=−z₁³, ∇g₁(0)=0: nessuna coppia soddisfa il bilancio. È un controesempio aggiunto.",
      "purpose": "Mostrare perché non si può eliminare la regolarità.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [],
      "origin": "enrichment",
      "sourceFormulaIds": []
    }
  ],
  "60": [
    {
      "formulaId": "opt60-kkt",
      "latex": "\\begin{aligned}\\nabla_1L(z^\\star,\\mu^\\star,\\lambda^\\star)&=0\\\\\\mu_j^\\star&\\ge0\\\\\\mu_j^\\star g_j(z^\\star)&=0,\\quad j\\in\\{1,\\ldots,r\\}\\end{aligned}",
      "conceptualExplanation": "Per un minimo locale regolare di funzioni C¹ esistono moltiplicatori unici. ∇₁ deriva in z; λ non ha vincoli di segno.",
      "purpose": "Collegare le tre condizioni al problema ammissibile.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [
        "Primal feasibility: g_j(z⋆)≤0, h_i(z⋆)=0 è nell’ipotesi, non una condizione da omettere.",
        "La regolarità assicura l’unicità dei moltiplicatori; non l’unicità del minimo.",
        "Senza convessità queste condizioni sono necessarie, non sufficienti."
      ],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt60-a",
          "explanation": "Muove il minimo vincolato e il gradiente del costo. I moltiplicatori provati restano invariati finché non si usa il pulsante analitico."
        },
        {
          "controlId": "opt60-mu1",
          "explanation": "Modifica il contributo di ∇g₁, il residuo di stazionarietà e il prodotto μ₁g₁."
        },
        {
          "controlId": "opt60-mu2",
          "explanation": "Modifica il contributo di ∇g₂ e permette di violare la complementarità su un vincolo inattivo."
        },
        {
          "controlId": "opt60-lambda",
          "explanation": "Modifica il bilancio verticale, senza vincoli di segno."
        }
      ],
      "origin": "source",
      "sourceFormulaIds": [
        "opt60-kkt"
      ]
    },
    {
      "formulaId": "opt60-problem",
      "latex": "\\begin{aligned}\\min_{z\\in\\mathbb R^d}\\;&\\ell(z)\\\\\\text{subj.to }&g_j(z)\\le0,\\ j\\in\\{1,\\ldots,r\\}\\\\&h_i(z)=0,\\ i\\in\\{1,\\ldots,m\\}\\end{aligned}",
      "conceptualExplanation": "Le condizioni si applicano al problema della 59, non a una minimizzazione libera di L.",
      "purpose": "Conservare il contesto del teorema.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt60-a",
          "explanation": "Muove il minimo vincolato e il gradiente del costo. I moltiplicatori provati restano invariati finché non si usa il pulsante analitico."
        },
        {
          "controlId": "opt60-mu1",
          "explanation": "Modifica il contributo di ∇g₁, il residuo di stazionarietà e il prodotto μ₁g₁."
        },
        {
          "controlId": "opt60-mu2",
          "explanation": "Modifica il contributo di ∇g₂ e permette di violare la complementarità su un vincolo inattivo."
        },
        {
          "controlId": "opt60-lambda",
          "explanation": "Modifica il bilancio verticale, senza vincoli di segno."
        }
      ],
      "origin": "source",
      "sourceFormulaIds": [
        "opt60-problem"
      ]
    },
    {
      "formulaId": "opt60-example",
      "latex": "\\ell=\\tfrac12((z_1-a)^2+(z_2-0.6)^2),\\quad g_1(z)=-z_1,\\quad g_2(z)=z_1-1,\\quad h_1(z)=z_2",
      "conceptualExplanation": "Il minimo esatto z⋆=(clip(a,0,1),0) resta ammissibile. I controlli dei moltiplicatori possono invece violare le KKT.",
      "purpose": "Specificare il modello aggiunto e i suoi limiti.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt60-a",
          "explanation": "Muove il minimo vincolato e il gradiente del costo. I moltiplicatori provati restano invariati finché non si usa il pulsante analitico."
        },
        {
          "controlId": "opt60-mu1",
          "explanation": "Modifica il contributo di ∇g₁, il residuo di stazionarietà e il prodotto μ₁g₁."
        },
        {
          "controlId": "opt60-mu2",
          "explanation": "Modifica il contributo di ∇g₂ e permette di violare la complementarità su un vincolo inattivo."
        },
        {
          "controlId": "opt60-lambda",
          "explanation": "Modifica il bilancio verticale, senza vincoli di segno."
        }
      ],
      "origin": "enrichment",
      "sourceFormulaIds": []
    },
    {
      "formulaId": "opt60-multipliers",
      "latex": "\\mu_1^\\star=\\max(0,-a),\\quad\\mu_2^\\star=\\max(0,a-1),\\quad\\lambda_1^\\star=0.6",
      "conceptualExplanation": "Questa è l’unica terna KKT dell’esempio. La si può confrontare con i valori provati nei controlli.",
      "purpose": "Dare un riferimento analitico al bilancio.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt60-a",
          "explanation": "Muove il minimo vincolato e il gradiente del costo. I moltiplicatori provati restano invariati finché non si usa il pulsante analitico."
        },
        {
          "controlId": "opt60-mu1",
          "explanation": "Modifica il contributo di ∇g₁, il residuo di stazionarietà e il prodotto μ₁g₁."
        },
        {
          "controlId": "opt60-mu2",
          "explanation": "Modifica il contributo di ∇g₂ e permette di violare la complementarità su un vincolo inattivo."
        },
        {
          "controlId": "opt60-lambda",
          "explanation": "Modifica il bilancio verticale, senza vincoli di segno."
        }
      ],
      "origin": "enrichment",
      "sourceFormulaIds": []
    }
  ],
  "61": [
    {
      "formulaId": "opt61-kkt",
      "latex": "\\begin{aligned}\\nabla_1L(z^\\star,\\mu^\\star,\\lambda^\\star)&=0\\\\\\mu_j^\\star&\\ge0\\\\\\mu_j^\\star g_j(z^\\star)&=0,\\quad j\\in\\{1,\\ldots,r\\}\\end{aligned}",
      "conceptualExplanation": "Con funzioni due volte differenziabili, la slide richiama il secondo ordine; non ne enuncia qui le condizioni.",
      "purpose": "Mantenere visibile il risultato comune della progressiva.",
      "symbolDefinitions": [],
      "assumptions": [
        "Le KKT richiedono le ipotesi precedenti: minimo locale regolare e funzioni C¹."
      ],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt61-kappa",
          "explanation": "Modifica la curvatura lungo la retta, il costo e il tipo del punto; regolarità e KKT a zero restano valide."
        },
        {
          "controlId": "opt61-t",
          "explanation": "Muove (t,0) e misura la variazione esatta del costo; la curvatura locale resta κ."
        }
      ],
      "origin": "source",
      "sourceFormulaIds": [
        "opt61-kkt"
      ]
    },
    {
      "formulaId": "opt61-problem",
      "latex": "\\begin{aligned}\\min_{z\\in\\mathbb R^d}\\;&\\ell(z)\\\\\\text{subj.to }&g_j(z)\\le0,\\ j\\in\\{1,\\ldots,r\\}\\\\&h_i(z)=0,\\ i\\in\\{1,\\ldots,m\\}\\end{aligned}",
      "conceptualExplanation": "Il problema vincolato e le sue ipotesi restano quelli delle due progressive precedenti.",
      "purpose": "Conservare il contesto completo.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt61-kappa",
          "explanation": "Modifica la curvatura lungo la retta, il costo e il tipo del punto; regolarità e KKT a zero restano valide."
        },
        {
          "controlId": "opt61-t",
          "explanation": "Muove (t,0) e misura la variazione esatta del costo; la curvatura locale resta κ."
        }
      ],
      "origin": "source",
      "sourceFormulaIds": [
        "opt61-problem"
      ]
    },
    {
      "formulaId": "opt61-example",
      "latex": "\\ell_\\kappa(z)=\\frac\\kappa2 z_1^2+\\frac14 z_1^4+\\frac12 z_2^2,\\quad g_1=z_1-1,\\ h_1=z_2",
      "conceptualExplanation": "Con z₁≤1, z₂=0, l’origine è regolare e KKT per ogni κ (μ=λ=0).",
      "purpose": "Specificare il modello aggiunto e i suoi limiti.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt61-kappa",
          "explanation": "Modifica la curvatura lungo la retta, il costo e il tipo del punto; regolarità e KKT a zero restano valide."
        },
        {
          "controlId": "opt61-t",
          "explanation": "Muove (t,0) e misura la variazione esatta del costo; la curvatura locale resta κ."
        }
      ],
      "origin": "enrichment",
      "sourceFormulaIds": []
    },
    {
      "formulaId": "opt61-curvature",
      "latex": "d=(1,0),\\quad d^\\top\\nabla_{11}^2L(0,0,0)d=\\kappa",
      "conceptualExplanation": "d è tangente alla retta ammissibile e g resta inattivo vicino a 0. κ negativo dà discesa locale; κ positivo dà minimo locale.",
      "purpose": "Illustrare la curvatura ammissibile in un caso semplice, senza anticipare le condizioni generali del batch I.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [
        "Nel modello h è affine e i moltiplicatori sono zero: la Hessiana di L coincide con quella di ℓ.",
        "Per κ=0 la derivata seconda lungo d è nulla ma il termine z₁⁴/4 dà comunque un minimo stretto sulla retta. La sola curvatura nulla è inconclusiva.",
        "Non si sostituisce il cono critico generale con tutto lo spazio, né si enuncia una condizione generale di sufficienza dalla sola remark."
      ],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt61-kappa",
          "explanation": "Modifica la curvatura lungo la retta, il costo e il tipo del punto; regolarità e KKT a zero restano valide."
        },
        {
          "controlId": "opt61-t",
          "explanation": "Muove (t,0) e misura la variazione esatta del costo; la curvatura locale resta κ."
        }
      ],
      "origin": "enrichment",
      "sourceFormulaIds": []
    }
  ],
  "62": [
    {
      "formulaId": "opt62-kkt",
      "latex": "\\begin{aligned}\\nabla_1L(z^\\star,\\mu^\\star,\\lambda^\\star)&=0\\\\\\mu_j^\\star&\\ge0\\\\\\mu_j^\\star g_j(z^\\star)&=0,\\quad j\\in\\{1,\\ldots,r\\}\\end{aligned}",
      "conceptualExplanation": "Un punto ammissibile che soddisfa queste condizioni con opportuni moltiplicatori è un punto KKT. Questo da solo non implica minimo.",
      "purpose": "Distinguere appartenenza all’insieme KKT e classificazione del costo.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt62-t",
          "explanation": "Muove la sonda (t,0) e aggiorna il confronto di costo. KKT e punto selezionato restano quelli dell’origine."
        }
      ],
      "origin": "source",
      "sourceFormulaIds": [
        "opt62-kkt"
      ]
    },
    {
      "formulaId": "opt62-problem",
      "latex": "\\begin{aligned}\\min_{z\\in\\mathbb R^d}\\;&\\ell(z)\\\\\\text{subj.to }&g_j(z)\\le0,\\ j\\in\\{1,\\ldots,r\\}\\\\&h_i(z)=0,\\ i\\in\\{1,\\ldots,m\\}\\end{aligned}",
      "conceptualExplanation": "Anche un punto KKT deve soddisfare i vincoli originali; le sole tre righe isolate non bastano.",
      "purpose": "Esplicitare l’ammissibilità già presente nel contesto.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt62-t",
          "explanation": "Muove la sonda (t,0) e aggiorna il confronto di costo. KKT e punto selezionato restano quelli dell’origine."
        }
      ],
      "origin": "source",
      "sourceFormulaIds": [
        "opt62-problem"
      ]
    },
    {
      "formulaId": "opt62-example",
      "latex": "\\ell_\\kappa(z)=\\frac\\kappa2 z_1^2+\\frac14 z_1^4+\\frac12 z_2^2,\\quad g_1=z_1-1,\\ h_1=z_2",
      "conceptualExplanation": "Vincoli: z₁≤1, z₂=0. All’origine: μ=λ=0 e regolarità in tutti i casi.",
      "purpose": "Specificare il modello aggiunto e i suoi limiti.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt62-t",
          "explanation": "Muove la sonda (t,0) e aggiorna il confronto di costo. KKT e punto selezionato restano quelli dell’origine."
        }
      ],
      "origin": "enrichment",
      "sourceFormulaIds": []
    },
    {
      "formulaId": "opt62-types",
      "latex": "\\ell_\\kappa(t,0)=\\tfrac\\kappa2 t^2+\\tfrac14t^4,\\qquad\\ell_{\\rm piatta}(t,0)=0",
      "conceptualExplanation": "κ=1 dà minimo stretto, κ=−1 massimo locale sulla retta, κ=0 minimo stretto piatto; l’ultimo caso ha tutti i punti ammissibili minimi.",
      "purpose": "Confrontare classificazioni mantenendo fisse KKT e vincoli.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt62-t",
          "explanation": "Muove la sonda (t,0) e aggiorna il confronto di costo. KKT e punto selezionato restano quelli dell’origine."
        }
      ],
      "origin": "enrichment",
      "sourceFormulaIds": []
    }
  ]
} as const satisfies Readonly<Record<number,readonly FormulaExplanation[]>>;
