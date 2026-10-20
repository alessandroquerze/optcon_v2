import type {FormulaExplanation} from '../../components/ExplainedEquation';
export const minimizationFormulaNotes = {
  "19": [
    {
      "formulaId": "opt19-affine",
      "latex": "\\ell(z_B)\\ge\\ell(z_A)+\\nabla\\ell(z_A)^\\top(z_B-z_A)",
      "conceptualExplanation": "Per una funzione differenziabile e convessa, ogni tangente resta sotto il costo su tutto il dominio convesso.",
      "purpose": "Riconoscere il supporto affine.",
      "symbolDefinitions": [],
      "assumptions": [
        "ℓ differenziabile e convessa; dominio convesso."
      ],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [],
      "origin": "source",
      "sourceFormulaIds": [
        "opt19-affine"
      ]
    },
    {
      "formulaId": "opt19-lower",
      "latex": "\\ell(z_B)\\ge\\ell(z_A)+\\nabla\\ell(z_A)^\\top(z_B-z_A)+\\frac{\\mu}{2}\\|z_B-z_A\\|^2",
      "conceptualExplanation": "Con µ-forte convessità il costo supera la tangente almeno di un termine quadratico. Per punti coincidenti tutti i valori pareggiano.",
      "purpose": "Trasformare la curvatura minima in una garanzia sul costo.",
      "symbolDefinitions": [
        {
          "symbol": "\\mu",
          "meaning": "Modulo di forte convessità con convenzione µ/2."
        },
        {
          "symbol": "z_A",
          "meaning": "Punto in cui costruire il supporto."
        },
        {
          "symbol": "z_B",
          "meaning": "Punto in cui verificare la garanzia."
        }
      ],
      "assumptions": [
        "Dominio convesso, ℓ differenziabile e µ-fortemente convessa, µ>0."
      ],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [],
      "origin": "source",
      "sourceFormulaIds": [
        "opt19-lower"
      ]
    },
    {
      "formulaId": "opt19-example",
      "latex": "\\ell(z)=\\frac14z^2+\\frac14z^4,\\quad\\mu=\\frac12",
      "conceptualExplanation": "La derivata seconda è 1/2+3z²≥1/2 su tutta ℝ: µ=1/2 è valido globalmente.",
      "purpose": "Dare coordinate al confronto senza attribuirle alla figura originale.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [],
      "origin": "enrichment",
      "sourceFormulaIds": []
    }
  ],
  "20": [
    {
      "formulaId": "opt20-upper",
      "latex": "\\ell(z_B)\\le\\ell(z_A)+\\nabla\\ell(z_A)^\\top(z_B-z_A)+\\frac L2\\|z_B-z_A\\|^2",
      "conceptualExplanation": "Il gradiente L-Lipschitz garantisce che la parabola resti sopra il costo. Si integra la variazione del gradiente lungo il segmento; la convessità non è necessaria.",
      "purpose": "Costruire una maggiorazione quantitativa del costo.",
      "symbolDefinitions": [
        {
          "symbol": "L",
          "meaning": "Costante positiva di Lipschitz del gradiente."
        }
      ],
      "assumptions": [
        "ℓ differenziabile, gradiente L-Lipschitz; il segmento A–B appartiene al dominio."
      ],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [],
      "origin": "source",
      "sourceFormulaIds": [
        "opt20-upper"
      ]
    },
    {
      "formulaId": "opt20-example",
      "latex": "\\ell(z)=1-\\cos z,\\quad\\nabla\\ell(z)=\\sin z,\\quad L=1",
      "conceptualExplanation": "Poiché |cos z|≤1, il gradiente sin z è 1-Lipschitz su tutta la retta. Il costo non è globalmente convesso.",
      "purpose": "Mostrare che regolarità del gradiente e convessità sono ipotesi diverse.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [
        "La derivata seconda è negativa vicino a π: non dichiarare convesso questo esempio."
      ],
      "relatedFormulaIds": [],
      "parameterInterpretation": [],
      "origin": "enrichment",
      "sourceFormulaIds": []
    }
  ],
  "21": [
    {
      "formulaId": "opt21-literal",
      "latex": "\\exists\\text{ global minimum }\\bar z\\in X:\\quad\\ell(\\bar z)<\\ell(z^\\star)",
      "conceptualExplanation": "La prova stampata introduce un minimo globale e usa X, mentre il dominio dell’enunciato è Z.",
      "purpose": "Conservare la premessa letterale, senza introdurla nella prova corretta.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [],
      "origin": "source",
      "sourceFormulaIds": [
        "opt21-literal"
      ]
    },
    {
      "formulaId": "opt21-proof",
      "latex": "\\begin{aligned}\\ell(\\theta z^\\star+(1-\\theta)\\bar z)&\\le\\theta\\ell(z^\\star)+(1-\\theta)\\ell(\\bar z)\\\\&<\\theta\\ell(z^\\star)+(1-\\theta)\\ell(z^\\star)=\\ell(z^\\star)\\end{aligned}",
      "conceptualExplanation": "La convessità dà il primo confronto. Il punto migliore dà quello stretto se θ<1; con θ vicino a uno la contraddizione avviene in ogni intorno.",
      "purpose": "Mostrare perché un minimo soltanto locale non può essere peggiore.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [],
      "origin": "source",
      "sourceFormulaIds": [
        "opt21-proof"
      ]
    },
    {
      "formulaId": "opt21-better",
      "latex": "\\exists\\bar z\\in\\mathbb Z:\\ \\ell(\\bar z)<\\ell(z^\\star),\\quad\\tilde z=\\theta z^\\star+(1-\\theta)\\bar z",
      "conceptualExplanation": "Se il minimo locale non è globale, esiste un punto ammissibile migliore: non serve che quel punto sia un minimizzatore.",
      "purpose": "Usare la negazione corretta della globalità, nel dominio della proposizione.",
      "symbolDefinitions": [],
      "assumptions": [
        "Z convesso; ℓ convessa; z⋆ ipotizzato minimo locale."
      ],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [],
      "origin": "correction",
      "sourceFormulaIds": [
        "opt21-better"
      ]
    },
    {
      "formulaId": "opt21-example",
      "latex": "\\ell(z)=z^2,\\quad z^\\star=1\\ \\text{(candidato)},\\quad\\bar z=0,\\quad\\tilde z=\\theta",
      "conceptualExplanation": "Il candidato 1 non è minimo: per θ<1 il punto θ costa θ²<1 e tende a 1.",
      "purpose": "Visualizzare la contraddizione, senza chiamare minimo il candidato confutato.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [
        "Nell’esempio il punto migliore è anche ottimo, ma la prova generale non usa questa proprietà.",
        "Per mostrare l’assenza di esistenza automatica basta ℓ(z)=exp(z) su R: convessa, infimo zero non raggiunto."
      ],
      "relatedFormulaIds": [],
      "parameterInterpretation": [],
      "origin": "enrichment",
      "sourceFormulaIds": []
    }
  ],
  "22": [
    {
      "formulaId": "opt22-iff",
      "latex": "z^\\star\\text{ minimo globale}\\quad\\Longleftrightarrow\\quad\\nabla\\ell(z^\\star)=0",
      "conceptualExplanation": "Per un costo convesso e differenziabile su ℝᵈ, gradiente zero equivale al minimo globale. Esistenza e unicità richiedono altre ipotesi.",
      "purpose": "Usare un certificato globale con tutte le sue ipotesi.",
      "symbolDefinitions": [],
      "assumptions": [
        "Minimizzazione senza vincoli su R^d; ℓ convessa e differenziabile."
      ],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [],
      "origin": "source",
      "sourceFormulaIds": [
        "opt22-iff"
      ]
    },
    {
      "formulaId": "opt22-support",
      "latex": "\\ell(z)\\ge\\ell(z^\\star)+\\nabla\\ell(z^\\star)^T(z-z^\\star)",
      "conceptualExplanation": "Se il gradiente è zero, il termine lineare scompare: nessun punto ha costo minore. L’altro verso segue dalla necessità del primo ordine.",
      "purpose": "Capire perché la convessità rende sufficiente la stazionarietà.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [],
      "origin": "source",
      "sourceFormulaIds": [
        "opt22-support"
      ]
    },
    {
      "formulaId": "opt22-case-0",
      "latex": "\\ell(z)=\\frac12z^2,\\quad\\nabla\\ell(z)=z",
      "conceptualExplanation": "I tre costi sono convessi su R; confrontare stazionarietà, curvatura e unicità senza confonderle.",
      "purpose": "Esempio esplicito sul certificato globale.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [
        "Minimo globale unico in zero, curvatura uno."
      ],
      "relatedFormulaIds": [],
      "parameterInterpretation": [],
      "origin": "enrichment",
      "sourceFormulaIds": []
    },
    {
      "formulaId": "opt22-case-1",
      "latex": "\\ell(z)=\\frac14z^4,\\quad\\nabla\\ell(z)=z^3",
      "conceptualExplanation": "I tre costi sono convessi su R; confrontare stazionarietà, curvatura e unicità senza confonderle.",
      "purpose": "Esempio esplicito sul certificato globale.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [
        "Minimo globale unico in zero, ma Hessiana nulla in zero: definita positività non necessaria."
      ],
      "relatedFormulaIds": [],
      "parameterInterpretation": [],
      "origin": "enrichment",
      "sourceFormulaIds": []
    },
    {
      "formulaId": "opt22-case-2",
      "latex": "\\ell(z)=0,\\quad\\nabla\\ell(z)=0",
      "conceptualExplanation": "I tre costi sono convessi su R; confrontare stazionarietà, curvatura e unicità senza confonderle.",
      "purpose": "Esempio esplicito sul certificato globale.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [
        "Tutti i punti sono minimi globali non stretti; nessuna unicità."
      ],
      "relatedFormulaIds": [],
      "parameterInterpretation": [],
      "origin": "enrichment",
      "sourceFormulaIds": []
    }
  ],
  "23": [
    {
      "formulaId": "opt23-problem",
      "latex": "\\min_{z\\in\\mathbb R^d}\\frac12z^\\top Qz+q^\\top z,\\quad Q=Q^\\top",
      "conceptualExplanation": "Q ha dimensione d×d ed è simmetrica; q e z sono colonne di d componenti. Nessuna positività di Q è richiesta dalla definizione.",
      "purpose": "Riconoscere decisione e coefficienti del programma quadratico.",
      "symbolDefinitions": [
        {
          "symbol": "Q",
          "meaning": "Matrice simmetrica della parte quadratica."
        },
        {
          "symbol": "q",
          "meaning": "Vettore della parte lineare."
        },
        {
          "symbol": "z",
          "meaning": "Decisione libera in R^d."
        }
      ],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [],
      "origin": "source",
      "sourceFormulaIds": [
        "opt23-problem"
      ]
    },
    {
      "formulaId": "opt23-example",
      "latex": "Q=\\begin{bmatrix}2&0\\\\0&\\lambda\\end{bmatrix},\\quad q=\\begin{bmatrix}-1\\\\b\\end{bmatrix}",
      "conceptualExplanation": "In due variabili, λ cambia la seconda curvatura; b inclina il costo lungo z₂.",
      "purpose": "Separare l’effetto di curvatura e termine lineare.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [
        "ℓ(z)=z₁²+(λ/2)z₂²−z₁+bz₂; probe fisso (0.5,0.5).",
        "λ<0 rende il costo illimitato inferiormente; λ=0 richiede b=0 per l’esistenza di un minimo.",
        "Il modello diagonale non esaurisce tutte le matrici simmetriche, ma rende leggibili gli autovalori."
      ],
      "relatedFormulaIds": [],
      "parameterInterpretation": [],
      "origin": "enrichment",
      "sourceFormulaIds": []
    }
  ],
  "24": [
    {
      "formulaId": "opt24-first",
      "latex": "\\nabla\\ell(z^\\star)=0\\ \\Longrightarrow\\ Qz^\\star+q=0",
      "conceptualExplanation": "La derivata del costo quadratico con Q simmetrica è Qz+q: al minimo deve annullarsi.",
      "purpose": "Verificare il primo ordine su un candidato.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [],
      "origin": "source",
      "sourceFormulaIds": [
        "opt24-first"
      ]
    },
    {
      "formulaId": "opt24-second",
      "latex": "\\nabla^2\\ell(z^\\star)\\ge0\\ \\Longrightarrow\\ Q\\ge0",
      "conceptualExplanation": "La Hessiana è Q in ogni punto. Q≥0 significa semidefinita positiva: nessuna direzione ha curvatura negativa.",
      "purpose": "Leggere l’ordine matriciale del corso senza confonderlo con un confronto fra entrate.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [],
      "origin": "source",
      "sourceFormulaIds": [
        "opt24-second"
      ]
    },
    {
      "formulaId": "opt24-joint",
      "latex": "Q\\ge0,\\quad Qz^\\star+q=0",
      "conceptualExplanation": "Se entrambi i controlli sono soddisfatti, la convessità certifica un minimo globale. La compatibilità del sistema esclude una deriva lineare nelle direzioni piatte.",
      "purpose": "Collegare le condizioni necessarie alla sufficienza spiegata nella pagina successiva.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [],
      "origin": "enrichment",
      "sourceFormulaIds": []
    },
    {
      "formulaId": "opt24-example",
      "latex": "Q=\\begin{bmatrix}2&0\\\\0&\\lambda\\end{bmatrix},\\quad q=\\begin{bmatrix}-1\\\\b\\end{bmatrix}",
      "conceptualExplanation": "Q e q restano fissi nello scenario; la sonda percorre la retta (0.5,t).",
      "purpose": "Mostrare perché ciascuno dei due controlli serve.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [
        "Q=diag(2,1), q=(−1,−0.5): minimo unico (0.5,0.5).",
        "Q=diag(2,0), q=(−1,0): minimi (0.5,t), t reale.",
        "Q=diag(2,0), q=(−1,0.5): nessuna soluzione stazionaria, deriva verso z₂→−∞.",
        "Q=diag(2,−1), q=(−1,0): (0.5,0) è stazionario ma è una sella."
      ],
      "relatedFormulaIds": [],
      "parameterInterpretation": [],
      "origin": "enrichment",
      "sourceFormulaIds": []
    }
  ],
  "25": [
    {
      "formulaId": "opt25-unique",
      "latex": "Q>0\\quad\\Longrightarrow\\quad z^\\star=-Q^{-1}q",
      "conceptualExplanation": "Q>0: curvatura positiva in ogni direzione, inversa definita e minimo globale unico.",
      "purpose": "Sapere quando la formula con inversa è lecita.",
      "symbolDefinitions": [],
      "assumptions": [
        "Q=Qᵀ e Q>0; problema senza vincoli su R^d."
      ],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [],
      "origin": "source",
      "sourceFormulaIds": [
        "opt25-unique"
      ]
    },
    {
      "formulaId": "opt25-scope",
      "latex": "z^\\star\\text{ minimo globale}\\quad\\Longleftrightarrow\\quad Q\\ge0\\ \\text{e}\\ Qz^\\star+q=0",
      "conceptualExplanation": "Per una matrice simmetrica, i due controlli insieme sono necessari e sufficienti. Non tutti i programmi quadratici sono convessi.",
      "purpose": "Precisare l’ambito della frase iniziale senza attribuire convessità a Q indefinite.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [],
      "origin": "correction",
      "sourceFormulaIds": [
        "opt25-scope"
      ]
    },
    {
      "formulaId": "opt25-example",
      "latex": "Q=\\begin{bmatrix}2&0\\\\0&\\lambda\\end{bmatrix},\\quad q=\\begin{bmatrix}-1\\\\b\\end{bmatrix}",
      "conceptualExplanation": "λ>0: minimo in (1/2,−b/λ). A λ=0 conta la compatibilità di q.",
      "purpose": "Collegare unicità, singolarità e termine lineare nello stesso modello.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [],
      "origin": "enrichment",
      "sourceFormulaIds": []
    },
    {
      "formulaId": "opt25-complete",
      "latex": "\\ell(z)-\\ell(z^\\star)=\\frac12(z-z^\\star)^\\top Q(z-z^\\star)\\quad(Qz^\\star+q=0)",
      "conceptualExplanation": "Completare il quadrato elimina la parte lineare attorno a un punto stazionario. Q≥0 rende lo scarto non negativo; Q>0 lo rende positivo fuori dal minimo.",
      "purpose": "Giustificare globalità e unicità, non solo calcolare un’inversa.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [],
      "origin": "enrichment",
      "sourceFormulaIds": []
    }
  ]
} as const satisfies Readonly<Record<number,readonly FormulaExplanation[]>>;
