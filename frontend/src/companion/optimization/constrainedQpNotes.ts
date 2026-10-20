import type {FormulaExplanation} from '../../components/ExplainedEquation';
export const constrainedQpFormulaNotes = {
  "63": [
    {
      "formulaId": "opt63-balance",
      "latex": "\\nabla\\ell(z^\\star)+\\sum_{j=1}^r\\mu_j^\\star\\nabla g_j(z^\\star)+\\sum_{i=1}^m\\lambda_i^\\star\\nabla h_i(z^\\star)=0",
      "conceptualExplanation": "Si deriva rispetto a z, a moltiplicatori fissati. Il bilancio deve accompagnarsi ad ammissibilità, μ≥0 e complementarità.",
      "purpose": "Associare ogni vettore al vincolo pertinente.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt63-a",
          "explanation": "Sposta il minimo e il suo insieme attivo; ricalcola i moltiplicatori esatti o entrambi i pesi perturbati."
        }
      ],
      "origin": "source",
      "sourceFormulaIds": [
        "opt63-balance"
      ]
    },
    {
      "formulaId": "opt63-literal",
      "latex": "\\mu_j^\\star g_j^\\star(z^\\star)=0,\\quad j\\in\\{1,\\ldots,r\\}",
      "conceptualExplanation": "La remark denomina questa relazione complementarità. Nel contesto gⱼ⋆ indica lo stesso residuo gⱼ valutato in z⋆.",
      "purpose": "Conservare la trascrizione letterale senza introdurre una nuova funzione g⋆.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt63-a",
          "explanation": "Sposta il minimo e il suo insieme attivo; ricalcola i moltiplicatori esatti o entrambi i pesi perturbati."
        }
      ],
      "origin": "source",
      "sourceFormulaIds": [
        "opt63-literal"
      ]
    },
    {
      "formulaId": "opt63-example",
      "latex": "\\ell=\\tfrac12((z_1-a)^2+(z_2-0.6)^2),\\quad 0\\le z_1\\le1,\\ z_2=0",
      "conceptualExplanation": "Si usa il problema della 60. g₁=−z₁, g₂=z₁−1, h₁=z₂ e z⋆=(clip(a,0,1),0).",
      "purpose": "Specificare i dati dell’esempio aggiunto.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt63-a",
          "explanation": "Sposta il minimo e il suo insieme attivo; ricalcola i moltiplicatori esatti o entrambi i pesi perturbati."
        }
      ],
      "origin": "enrichment",
      "sourceFormulaIds": []
    },
    {
      "formulaId": "opt63-perturbation",
      "latex": "\\widehat\\mu_1=\\mu_1^\\star+0.4,\\quad\\widehat\\mu_2=\\mu_2^\\star+0.4,\\quad\\widehat\\lambda=0.6",
      "conceptualExplanation": "Le due normali opposte cancellano l’aumento dei pesi: la somma resta zero, ma almeno un vincolo inattivo ha μ>0.",
      "purpose": "Dare un controesempio controllato alla sola stazionarietà.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt63-a",
          "explanation": "Sposta il minimo e il suo insieme attivo; ricalcola i moltiplicatori esatti o entrambi i pesi perturbati."
        }
      ],
      "origin": "enrichment",
      "sourceFormulaIds": []
    }
  ],
  "64": [
    {
      "formulaId": "opt64-kkt",
      "latex": "\\begin{gathered}\\nabla_1L(z^\\star,\\mu^\\star,\\lambda^\\star)=0\\\\\\mu_j^\\star\\ge0,\\quad\\mu_j^\\star g_j(z^\\star)=0,\\quad j\\in\\{1,\\ldots,r\\}\\end{gathered}",
      "conceptualExplanation": "Minimo locale regolare e funzioni C¹: esistono moltiplicatori unici. Questa progressiva non mostra ancora il secondo ordine.",
      "purpose": "Distinguere il titolo dal contenuto effettivamente visibile.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt64-alpha",
          "explanation": "Modifica ℓ e il costo sulla circonferenza. λ=β e stazionarietà in (0,−1) restano invariati."
        },
        {
          "controlId": "opt64-beta",
          "explanation": "Modifica il costo e il moltiplicatore λ=β; il vincolo e la regolarità restano fissi."
        },
        {
          "controlId": "opt64-theta",
          "explanation": "Muove soltanto z(θ) sulla circonferenza e aggiorna la variazione di costo; il punto KKT rimane (0,−1)."
        }
      ],
      "origin": "source",
      "sourceFormulaIds": [
        "opt64-kkt"
      ]
    },
    {
      "formulaId": "opt64-problem",
      "latex": "\\min_{z\\in\\mathbb R^d}\\ell(z),\\quad g_j(z)\\le0,\\ j=1,\\ldots,r,\\quad h_i(z)=0,\\ i=1,\\ldots,m",
      "conceptualExplanation": "Rimangono r disuguaglianze e m uguaglianze; le tre righe KKT non sostituiscono l’ammissibilità.",
      "purpose": "Conservare le ipotesi del teorema.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt64-alpha",
          "explanation": "Modifica ℓ e il costo sulla circonferenza. λ=β e stazionarietà in (0,−1) restano invariati."
        },
        {
          "controlId": "opt64-beta",
          "explanation": "Modifica il costo e il moltiplicatore λ=β; il vincolo e la regolarità restano fissi."
        },
        {
          "controlId": "opt64-theta",
          "explanation": "Muove soltanto z(θ) sulla circonferenza e aggiorna la variazione di costo; il punto KKT rimane (0,−1)."
        }
      ],
      "origin": "source",
      "sourceFormulaIds": [
        "opt64-problem"
      ]
    },
    {
      "formulaId": "opt64-example",
      "latex": "\\ell(z)=\\tfrac\\alpha2 z_1^2+\\beta z_2,\\quad h_1(z)=\\tfrac12(z_1^2+z_2^2-1)",
      "conceptualExplanation": "Sola uguaglianza: v=(0,−1) è regolare e KKT con λ=β per ogni α,β.",
      "purpose": "Specificare i dati dell’esempio aggiunto.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt64-alpha",
          "explanation": "Modifica ℓ e il costo sulla circonferenza. λ=β e stazionarietà in (0,−1) restano invariati."
        },
        {
          "controlId": "opt64-beta",
          "explanation": "Modifica il costo e il moltiplicatore λ=β; il vincolo e la regolarità restano fissi."
        },
        {
          "controlId": "opt64-theta",
          "explanation": "Muove soltanto z(θ) sulla circonferenza e aggiorna la variazione di costo; il punto KKT rimane (0,−1)."
        }
      ],
      "origin": "enrichment",
      "sourceFormulaIds": []
    },
    {
      "formulaId": "opt64-probe",
      "latex": "z(\\theta)=(\\sin\\theta,-\\cos\\theta),\\quad\\ell(z(\\theta))-\\ell(z^\\star)=\\tfrac\\alpha2\\sin^2\\theta+\\beta(1-\\cos\\theta)",
      "conceptualExplanation": "La sonda resta esattamente sulla circonferenza. Un costo inferiore confuta il minimo, pur mantenendo le KKT nell’origine della parametrizzazione.",
      "purpose": "Confrontare primo ordine e un punto ammissibile reale.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt64-alpha",
          "explanation": "Modifica ℓ e il costo sulla circonferenza. λ=β e stazionarietà in (0,−1) restano invariati."
        },
        {
          "controlId": "opt64-beta",
          "explanation": "Modifica il costo e il moltiplicatore λ=β; il vincolo e la regolarità restano fissi."
        },
        {
          "controlId": "opt64-theta",
          "explanation": "Muove soltanto z(θ) sulla circonferenza e aggiorna la variazione di costo; il punto KKT rimane (0,−1)."
        }
      ],
      "origin": "enrichment",
      "sourceFormulaIds": []
    }
  ],
  "65": [
    {
      "formulaId": "opt65-second",
      "latex": "y^\\top\\nabla^2_{11}L(z^\\star,\\mu^\\star,\\lambda^\\star)y\\ge0",
      "conceptualExplanation": "Con minimo locale regolare e funzioni C², vale sulle y ortogonali a ∇hᵢ e a tutti i ∇gⱼ attivi, valutati in z⋆.",
      "purpose": "Identificare matrice, direzioni e ipotesi del test.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt65-alpha",
          "explanation": "Cambia la curvatura del costo lungo x e quella ridotta α+β; il vincolo resta fisso."
        },
        {
          "controlId": "opt65-beta",
          "explanation": "Cambia λ=β, il contributo λ∇²h e la forma quadratica."
        },
        {
          "controlId": "opt65-phi",
          "explanation": "Ruota la direzione unitaria y: il residuo ∇h(v)ᵀy decide se appartiene al test. Una direzione esclusa non confuta il criterio."
        }
      ],
      "origin": "source",
      "sourceFormulaIds": [
        "opt65-second"
      ]
    },
    {
      "formulaId": "opt65-space",
      "latex": "\\nabla h_i(z)^\\top y=0,\\ i=1,\\ldots,m,\\qquad\\nabla g_j(z)^\\top y=0,\\ j\\in A(z)",
      "conceptualExplanation": "Nel teorema z è il punto z⋆. La fonte restringe il test anche imponendo uguaglianza per tutti i vincoli attivi.",
      "purpose": "Conservare il sottospazio effettivamente indicato dalla fonte.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [
        "È una condizione necessaria valida, potenzialmente più debole del test sul cono critico generale. Non si sostituisce l’uguaglianza con una disuguaglianza senza dichiararlo.",
        "Con vincoli attivi a moltiplicatore nullo, questo sottospazio può escludere direzioni ammissibili verso l’interno. Il test non diventa sufficiente neppure se è vacuo.",
        "Il caso y=0 soddisfa sempre il confronto e non certifica nulla da solo."
      ],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt65-alpha",
          "explanation": "Cambia la curvatura del costo lungo x e quella ridotta α+β; il vincolo resta fisso."
        },
        {
          "controlId": "opt65-beta",
          "explanation": "Cambia λ=β, il contributo λ∇²h e la forma quadratica."
        },
        {
          "controlId": "opt65-phi",
          "explanation": "Ruota la direzione unitaria y: il residuo ∇h(v)ᵀy decide se appartiene al test. Una direzione esclusa non confuta il criterio."
        }
      ],
      "origin": "source",
      "sourceFormulaIds": [
        "opt65-space"
      ]
    },
    {
      "formulaId": "opt65-kkt",
      "latex": "\\begin{gathered}\\nabla_1L(z^\\star,\\mu^\\star,\\lambda^\\star)=0\\\\\\mu_j^\\star\\ge0,\\quad\\mu_j^\\star g_j(z^\\star)=0,\\quad j\\in\\{1,\\ldots,r\\}\\end{gathered}",
      "conceptualExplanation": "Le condizioni del primo ordine della progressiva precedente restano richieste.",
      "purpose": "Non usare la forma quadratica isolata come criterio sufficiente.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt65-alpha",
          "explanation": "Cambia la curvatura del costo lungo x e quella ridotta α+β; il vincolo resta fisso."
        },
        {
          "controlId": "opt65-beta",
          "explanation": "Cambia λ=β, il contributo λ∇²h e la forma quadratica."
        },
        {
          "controlId": "opt65-phi",
          "explanation": "Ruota la direzione unitaria y: il residuo ∇h(v)ᵀy decide se appartiene al test. Una direzione esclusa non confuta il criterio."
        }
      ],
      "origin": "source",
      "sourceFormulaIds": [
        "opt65-kkt"
      ]
    },
    {
      "formulaId": "opt65-example",
      "latex": "\\ell(z)=\\tfrac\\alpha2 z_1^2+\\beta z_2,\\quad h_1(z)=\\tfrac12(z_1^2+z_2^2-1)",
      "conceptualExplanation": "Al candidato v=(0,−1), λ=β e ∇²₁₁L=diag(α+β,β). Le direzioni del test hanno y₂=0.",
      "purpose": "Specificare i dati dell’esempio aggiunto.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt65-alpha",
          "explanation": "Cambia la curvatura del costo lungo x e quella ridotta α+β; il vincolo resta fisso."
        },
        {
          "controlId": "opt65-beta",
          "explanation": "Cambia λ=β, il contributo λ∇²h e la forma quadratica."
        },
        {
          "controlId": "opt65-phi",
          "explanation": "Ruota la direzione unitaria y: il residuo ∇h(v)ᵀy decide se appartiene al test. Una direzione esclusa non confuta il criterio."
        }
      ],
      "origin": "enrichment",
      "sourceFormulaIds": []
    },
    {
      "formulaId": "opt65-reduced",
      "latex": "y=(\\cos\\varphi,\\sin\\varphi),\\quad y^\\top\\nabla^2_{11}Ly=(\\alpha+\\beta)\\cos^2\\varphi+\\beta\\sin^2\\varphi",
      "conceptualExplanation": "Solo sin φ=0 dà una direzione tangente al punto. Lungo y=(1,0), il valore è α+β e include la curvatura del vincolo.",
      "purpose": "Confrontare direzioni incluse ed escluse e Hessiana di ℓ contro Hessiana di L.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [
        "Con α=−0.5, β=1, la curvatura del solo costo lungo x è −0.5; quella della Lagrangiana è +0.5.",
        "Con α=2, β=−1 la Hessiana di L è diag(1,−1), indefinita nello spazio, ma positiva sulla tangente: v è minimo locale sul cerchio.",
        "Con α=−1,β=1 il test tangente è zero, ma il costo sul vincolo cresce come (1−cos θ)²/2: minimo stretto piatto."
      ],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt65-alpha",
          "explanation": "Cambia la curvatura del costo lungo x e quella ridotta α+β; il vincolo resta fisso."
        },
        {
          "controlId": "opt65-beta",
          "explanation": "Cambia λ=β, il contributo λ∇²h e la forma quadratica."
        },
        {
          "controlId": "opt65-phi",
          "explanation": "Ruota la direzione unitaria y: il residuo ∇h(v)ᵀy decide se appartiene al test. Una direzione esclusa non confuta il criterio."
        }
      ],
      "origin": "enrichment",
      "sourceFormulaIds": []
    }
  ],
  "66": [
    {
      "formulaId": "opt66-qp",
      "latex": "\\begin{aligned}\\min_{z\\in\\mathbb R^d}\\;&\\tfrac12z^TQz+q^Tz\\\\\\text{subj.to }&Az=b\\end{aligned}",
      "conceptualExplanation": "Q=Qᵀ, q∈Rᵈ, A∈Rᵐˣᵈ e b∈Rᵐ. Per avere una soluzione, Az=b deve essere compatibile.",
      "purpose": "Associare matrici e dimensioni senza aggiungere convessità alla fonte.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt66-kappa",
          "explanation": "Cambia la curvatura lungo la retta, i livelli e il profilo; non cambia il vincolo."
        },
        {
          "controlId": "opt66-nu",
          "explanation": "Cambia Q nelle direzioni normali. Sulla retta modifica solo la costante νb²/4, senza cambiarne la curvatura."
        },
        {
          "controlId": "opt66-b",
          "explanation": "Trasla la retta z₁+z₂=b; costo e matrici Q,q restano fissi."
        },
        {
          "controlId": "opt66-s",
          "explanation": "Muove la sonda ammissibile e il suo valore sullo stesso profilo; non cambia Q o la retta."
        }
      ],
      "origin": "source",
      "sourceFormulaIds": [
        "opt66-qp"
      ]
    },
    {
      "formulaId": "opt66-example",
      "latex": "Q=\\tfrac12\\begin{bmatrix}\\nu+\\kappa&\\nu-\\kappa\\\\\\nu-\\kappa&\\nu+\\kappa\\end{bmatrix},\\quad A=\\begin{bmatrix}1&1\\end{bmatrix}",
      "conceptualExplanation": "Nell’esempio d=2,m=1; q=−v/2, con n=(1,1)/√2 e v=(1,−1)/√2. κ è curvatura tangente, ν normale.",
      "purpose": "Specificare i dati dell’esempio aggiunto.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt66-kappa",
          "explanation": "Cambia la curvatura lungo la retta, i livelli e il profilo; non cambia il vincolo."
        },
        {
          "controlId": "opt66-nu",
          "explanation": "Cambia Q nelle direzioni normali. Sulla retta modifica solo la costante νb²/4, senza cambiarne la curvatura."
        },
        {
          "controlId": "opt66-b",
          "explanation": "Trasla la retta z₁+z₂=b; costo e matrici Q,q restano fissi."
        },
        {
          "controlId": "opt66-s",
          "explanation": "Muove la sonda ammissibile e il suo valore sullo stesso profilo; non cambia Q o la retta."
        }
      ],
      "origin": "enrichment",
      "sourceFormulaIds": []
    },
    {
      "formulaId": "opt66-basis",
      "latex": "n=\\tfrac1{\\sqrt2}(1,1)^\\top,\\quad v=\\tfrac1{\\sqrt2}(1,-1)^\\top",
      "conceptualExplanation": "Q=κvvᵀ+νnnᵀ. n è normale alla retta e v ne genera le direzioni ammissibili.",
      "purpose": "Leggere la simmetria e gli autovalori del modello aggiunto.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt66-kappa",
          "explanation": "Cambia la curvatura lungo la retta, i livelli e il profilo; non cambia il vincolo."
        },
        {
          "controlId": "opt66-nu",
          "explanation": "Cambia Q nelle direzioni normali. Sulla retta modifica solo la costante νb²/4, senza cambiarne la curvatura."
        },
        {
          "controlId": "opt66-b",
          "explanation": "Trasla la retta z₁+z₂=b; costo e matrici Q,q restano fissi."
        },
        {
          "controlId": "opt66-s",
          "explanation": "Muove la sonda ammissibile e il suo valore sullo stesso profilo; non cambia Q o la retta."
        }
      ],
      "origin": "enrichment",
      "sourceFormulaIds": []
    },
    {
      "formulaId": "opt66-profile",
      "latex": "z(s)=\\tfrac b2(1,1)^\\top+s\\,v,\\quad\\ell(z(s))=\\tfrac\\kappa2s^2-\\tfrac12s+\\tfrac\\nu4b^2",
      "conceptualExplanation": "Sul vincolo, ν cambia solo una costante; κ dà la curvatura.",
      "purpose": "Mostrare il costo effettivamente confrontato sul vincolo.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt66-kappa",
          "explanation": "Cambia la curvatura lungo la retta, i livelli e il profilo; non cambia il vincolo."
        },
        {
          "controlId": "opt66-nu",
          "explanation": "Cambia Q nelle direzioni normali. Sulla retta modifica solo la costante νb²/4, senza cambiarne la curvatura."
        },
        {
          "controlId": "opt66-b",
          "explanation": "Trasla la retta z₁+z₂=b; costo e matrici Q,q restano fissi."
        },
        {
          "controlId": "opt66-s",
          "explanation": "Muove la sonda ammissibile e il suo valore sullo stesso profilo; non cambia Q o la retta."
        }
      ],
      "origin": "enrichment",
      "sourceFormulaIds": []
    }
  ],
  "67": [
    {
      "formulaId": "opt67-system",
      "latex": "\\begin{bmatrix}Qz^\\star+q+A^\\top\\lambda^\\star\\\\Az^\\star-b\\end{bmatrix}=0",
      "conceptualExplanation": "La prima riga è ∇₁L=0; la seconda ∇₂L=0 impone Az=b. λ è libero nel segno.",
      "purpose": "Distinguere le due variabili di derivazione.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt67-kappa",
          "explanation": "Cambia il sistema ridotto e la sua classificazione; a zero si usano rami espliciti, nessuna divisione per zero."
        },
        {
          "controlId": "opt67-sigma",
          "explanation": "Cambia q e il termine noto del sistema; con κ=0 decide compatibilità o incompatibilità."
        },
        {
          "controlId": "opt67-b",
          "explanation": "Trasla la retta e cambia λ_eff=b/2, senza modificare la curvatura."
        }
      ],
      "origin": "source",
      "sourceFormulaIds": [
        "opt67-system"
      ]
    },
    {
      "formulaId": "opt67-lagrangian",
      "latex": "L(z,\\lambda)=\\tfrac12z^TQz+q^Tz+\\lambda^\\top(Az-b)",
      "conceptualExplanation": "Q è simmetrica, quindi il gradiente del costo è Qz+q; la derivata del termine vincolante è Aᵀλ.",
      "purpose": "Verificare il segno e la trasposizione della stazionarietà.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt67-kappa",
          "explanation": "Cambia il sistema ridotto e la sua classificazione; a zero si usano rami espliciti, nessuna divisione per zero."
        },
        {
          "controlId": "opt67-sigma",
          "explanation": "Cambia q e il termine noto del sistema; con κ=0 decide compatibilità o incompatibilità."
        },
        {
          "controlId": "opt67-b",
          "explanation": "Trasla la retta e cambia λ_eff=b/2, senza modificare la curvatura."
        }
      ],
      "origin": "source",
      "sourceFormulaIds": [
        "opt67-lagrangian"
      ]
    },
    {
      "formulaId": "opt67-block",
      "latex": "\\begin{bmatrix}Q&A^\\top\\\\A&0\\end{bmatrix}\\begin{bmatrix}z\\\\\\lambda\\end{bmatrix}=\\begin{bmatrix}-q\\\\b\\end{bmatrix}",
      "conceptualExplanation": "È la stessa coppia di equazioni raccolta in forma matriciale. Non si usa l’inversa se il sistema è singolare.",
      "purpose": "Rendere il sistema risolvibile senza ipotesi fittizie.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt67-kappa",
          "explanation": "Cambia il sistema ridotto e la sua classificazione; a zero si usano rami espliciti, nessuna divisione per zero."
        },
        {
          "controlId": "opt67-sigma",
          "explanation": "Cambia q e il termine noto del sistema; con κ=0 decide compatibilità o incompatibilità."
        },
        {
          "controlId": "opt67-b",
          "explanation": "Trasla la retta e cambia λ_eff=b/2, senza modificare la curvatura."
        }
      ],
      "origin": "enrichment",
      "sourceFormulaIds": []
    },
    {
      "formulaId": "opt67-example",
      "latex": "Q=\\tfrac12\\begin{bmatrix}\\nu+\\kappa&\\nu-\\kappa\\\\\\nu-\\kappa&\\nu+\\kappa\\end{bmatrix},\\quad A=\\begin{bmatrix}1&1\\end{bmatrix},\\quad\\nu=-1,\\ q=\\sigma v",
      "conceptualExplanation": "Si riusa la famiglia della 66 con v=(1,−1)/√2. Un secondo caso aggiunge il vincolo ridondante 2(z₁+z₂)=2b.",
      "purpose": "Specificare i dati dell’esempio aggiunto.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt67-kappa",
          "explanation": "Cambia il sistema ridotto e la sua classificazione; a zero si usano rami espliciti, nessuna divisione per zero."
        },
        {
          "controlId": "opt67-sigma",
          "explanation": "Cambia q e il termine noto del sistema; con κ=0 decide compatibilità o incompatibilità."
        },
        {
          "controlId": "opt67-b",
          "explanation": "Trasla la retta e cambia λ_eff=b/2, senza modificare la curvatura."
        }
      ],
      "origin": "enrichment",
      "sourceFormulaIds": []
    },
    {
      "formulaId": "opt67-reduced",
      "latex": "\\kappa s+\\sigma=0,\\quad\\lambda_{\\rm eff}=b/2",
      "conceptualExplanation": "κ≠0 dà s=−σ/κ. κ=0,σ≠0 è incompatibile; κ=σ=0 ammette tutta la retta.",
      "purpose": "Separare i casi senza dividere per zero.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [
        "Per la sola riga A=(1,1), λ=λ_eff=b/2. Il determinante della matrice KKT è −2κ, indipendente da ν.",
        "Con A=[[1,1],[2,2]], b_vec=(b,2b), le soluzioni hanno λ₁+2λ₂=b/2. La famiglia (b/2−2τ,τ) è non unica anche se il punto z è unico.",
        "Per vincoli affini l’esistenza dei moltiplicatori in un minimo segue dall’ortogonalità del gradiente a ker(A), senza richiedere rango pieno. Il rango pieno serve all’unicità dei moltiplicatori.",
        "κ<0 può dare un sistema invertibile e un massimo lungo la retta, senza minimo."
      ],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt67-kappa",
          "explanation": "Cambia il sistema ridotto e la sua classificazione; a zero si usano rami espliciti, nessuna divisione per zero."
        },
        {
          "controlId": "opt67-sigma",
          "explanation": "Cambia q e il termine noto del sistema; con κ=0 decide compatibilità o incompatibilità."
        },
        {
          "controlId": "opt67-b",
          "explanation": "Trasla la retta e cambia λ_eff=b/2, senza modificare la curvatura."
        }
      ],
      "origin": "enrichment",
      "sourceFormulaIds": []
    }
  ],
  "68": [
    {
      "formulaId": "opt68-hessian",
      "latex": "y^\\top\\nabla^2_{11}L(z^\\star,\\lambda^\\star)y=y^\\top Qy\\ge0",
      "conceptualExplanation": "Poiché il vincolo è affine, non aggiunge termini alla Hessiana in z. La condizione necessaria vale soltanto sulle direzioni ammissibili.",
      "purpose": "Identificare la matrice senza richiedere Q≥0 in tutto Rᵈ.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt68-kappa",
          "explanation": "Cambia la forma su ker(A), il costo sul vincolo e il tipo del punto."
        },
        {
          "controlId": "opt68-nu",
          "explanation": "Cambia il costo fuori dal vincolo, ma con b=0 non modifica il profilo ammissibile."
        },
        {
          "controlId": "opt68-sigma",
          "explanation": "Sposta il punto stazionario se κ≠0; per κ=0 separa minimi multipli e costo illimitato."
        },
        {
          "controlId": "opt68-phi",
          "explanation": "Ruota il vettore unitario y fra tangente v e normale n; cambia Ay e la forma, mantenendo Q e il vincolo."
        }
      ],
      "origin": "source",
      "sourceFormulaIds": [
        "opt68-hessian"
      ]
    },
    {
      "formulaId": "opt68-literal",
      "latex": "\\nabla h_i(z)^\\top y=0,\\ i=1,\\ldots,m\\ \\Longrightarrow\\ A^\\top y=0,\\quad y\\in\\ker(A^\\top)",
      "conceptualExplanation": "Trascrizione della fonte: il passaggio ad Aᵀ è un probabile refuso, conservato solo come riferimento.",
      "purpose": "Mantenere tracciabile la formula originale senza usarla nei calcoli.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt68-kappa",
          "explanation": "Cambia la forma su ker(A), il costo sul vincolo e il tipo del punto."
        },
        {
          "controlId": "opt68-nu",
          "explanation": "Cambia il costo fuori dal vincolo, ma con b=0 non modifica il profilo ammissibile."
        },
        {
          "controlId": "opt68-sigma",
          "explanation": "Sposta il punto stazionario se κ≠0; per κ=0 separa minimi multipli e costo illimitato."
        },
        {
          "controlId": "opt68-phi",
          "explanation": "Ruota il vettore unitario y fra tangente v e normale n; cambia Ay e la forma, mantenendo Q e il vincolo."
        }
      ],
      "origin": "source",
      "sourceFormulaIds": [
        "opt68-literal"
      ]
    },
    {
      "formulaId": "opt68-corrected",
      "latex": "y^\\top Qy\\ge0\\quad\\forall y\\in\\ker(A),\\qquad Ay=0",
      "conceptualExplanation": "A∈Rᵐˣᵈ agisce su y∈Rᵈ. È Ay=0 a mantenere il vincolo lungo z+ty.",
      "purpose": "Usare la versione dimensionalmente e matematicamente coerente.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [
        "Ogni gradiente ∇h_i è la trasposta della i-esima riga di A. La matrice dei gradienti del corso è ∇h=Aᵀ; quindi le derivate direzionali sono (∇h)ᵀy=Ay.",
        "Nel caso d=2,m=1, A=(1,1): Ay è uno scalare, mentre Aᵀy non è un prodotto compatibile.",
        "Con una base N delle colonne di ker(A), la matrice ridotta è NᵀQN. Non confonderla con Q intera."
      ],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt68-kappa",
          "explanation": "Cambia la forma su ker(A), il costo sul vincolo e il tipo del punto."
        },
        {
          "controlId": "opt68-nu",
          "explanation": "Cambia il costo fuori dal vincolo, ma con b=0 non modifica il profilo ammissibile."
        },
        {
          "controlId": "opt68-sigma",
          "explanation": "Sposta il punto stazionario se κ≠0; per κ=0 separa minimi multipli e costo illimitato."
        },
        {
          "controlId": "opt68-phi",
          "explanation": "Ruota il vettore unitario y fra tangente v e normale n; cambia Ay e la forma, mantenendo Q e il vincolo."
        }
      ],
      "origin": "correction",
      "sourceFormulaIds": [
        "opt68-corrected"
      ]
    },
    {
      "formulaId": "opt68-example",
      "latex": "Q=\\tfrac12\\begin{bmatrix}\\nu+\\kappa&\\nu-\\kappa\\\\\\nu-\\kappa&\\nu+\\kappa\\end{bmatrix},\\quad A=\\begin{bmatrix}1&1\\end{bmatrix},\\quad b=0,\\ q=\\sigma v",
      "conceptualExplanation": "Si mantiene la famiglia 66–67. v=(1,−1)/√2 genera ker(A), n=(1,1)/√2 ne è normale.",
      "purpose": "Specificare i dati dell’esempio aggiunto.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt68-kappa",
          "explanation": "Cambia la forma su ker(A), il costo sul vincolo e il tipo del punto."
        },
        {
          "controlId": "opt68-nu",
          "explanation": "Cambia il costo fuori dal vincolo, ma con b=0 non modifica il profilo ammissibile."
        },
        {
          "controlId": "opt68-sigma",
          "explanation": "Sposta il punto stazionario se κ≠0; per κ=0 separa minimi multipli e costo illimitato."
        },
        {
          "controlId": "opt68-phi",
          "explanation": "Ruota il vettore unitario y fra tangente v e normale n; cambia Ay e la forma, mantenendo Q e il vincolo."
        }
      ],
      "origin": "enrichment",
      "sourceFormulaIds": []
    },
    {
      "formulaId": "opt68-direction",
      "latex": "y=\\cos\\varphi\\,v+\\sin\\varphi\\,n,\\quad Ay=\\sqrt2\\sin\\varphi,\\quad y^\\top Qy=\\kappa\\cos^2\\varphi+\\nu\\sin^2\\varphi",
      "conceptualExplanation": "Solo sin φ=0 dà una direzione del test. κ è la curvatura ridotta; ν può essere negativa senza impedire il minimo sul vincolo.",
      "purpose": "Separare direzione esclusa e violazione effettiva.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt68-kappa",
          "explanation": "Cambia la forma su ker(A), il costo sul vincolo e il tipo del punto."
        },
        {
          "controlId": "opt68-nu",
          "explanation": "Cambia il costo fuori dal vincolo, ma con b=0 non modifica il profilo ammissibile."
        },
        {
          "controlId": "opt68-sigma",
          "explanation": "Sposta il punto stazionario se κ≠0; per κ=0 separa minimi multipli e costo illimitato."
        },
        {
          "controlId": "opt68-phi",
          "explanation": "Ruota il vettore unitario y fra tangente v e normale n; cambia Ay e la forma, mantenendo Q e il vincolo."
        }
      ],
      "origin": "enrichment",
      "sourceFormulaIds": []
    },
    {
      "formulaId": "opt68-full-test",
      "latex": "\\kappa\\ge0\\quad\\text{e}\\quad\\exists s:\\ \\kappa s+\\sigma=0",
      "conceptualExplanation": "Per questa famiglia ammissibile, curvatura ridotta non negativa e primo ordine compatibile danno un minimo globale. κ>0 lo rende unico; κ=σ=0 dà minimi multipli.",
      "purpose": "Aggiungere una conclusione specifica del QP dichiarandola enrichment, senza attribuire sufficienza alla sola fonte.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt68-kappa",
          "explanation": "Cambia la forma su ker(A), il costo sul vincolo e il tipo del punto."
        },
        {
          "controlId": "opt68-nu",
          "explanation": "Cambia il costo fuori dal vincolo, ma con b=0 non modifica il profilo ammissibile."
        },
        {
          "controlId": "opt68-sigma",
          "explanation": "Sposta il punto stazionario se κ≠0; per κ=0 separa minimi multipli e costo illimitato."
        },
        {
          "controlId": "opt68-phi",
          "explanation": "Ruota il vettore unitario y fra tangente v e normale n; cambia Ay e la forma, mantenendo Q e il vincolo."
        }
      ],
      "origin": "enrichment",
      "sourceFormulaIds": []
    }
  ]
} as const satisfies Readonly<Record<number,readonly FormulaExplanation[]>>;
