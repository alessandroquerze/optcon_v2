import type {FormulaExplanation} from '../../components/ExplainedEquation';
export const newtonFormulaNotes = {
  "34": [
    {
      "formulaId": "opt34-update",
      "latex": "z^{k+1}=z^k-\\big(\\nabla r(z^k)^\\top\\big)^{-1}r(z^k)",
      "conceptualExplanation": "Per un sistema quadrato con Jacobiano invertibile, Newton annulla il modello affine. Questo non garantisce che il residuo reale si annulli in un passo.",
      "purpose": "Leggere aggiornamento e ipotesi dell’inversa.",
      "symbolDefinitions": [
        {
          "symbol": "\\nabla r",
          "meaning": "Gradiente del campo nel corso: d×m, trasposto del Jacobiano usuale."
        },
        {
          "symbol": "\\nabla r(z^k)^\\top",
          "meaning": "Jacobiano m×d; l’inversa qui richiede m=d."
        }
      ],
      "assumptions": [
        "r differenziabile; m=d e Jacobiano invertibile al punto corrente."
      ],
      "optionalDetails": [
        "Nel calcolo si risolve il sistema lineare JΔz=−r, senza costruire materialmente una matrice inversa.",
        "Il termine ‘improved’ nella fonte esprime l’idea del procedimento, non una garanzia globale per ogni funzione o punto iniziale."
      ],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt34-c",
          "explanation": "Sposta il punto di linearizzazione, la tangente e il suo zero; la funzione resta fissa per α fissato."
        },
        {
          "controlId": "opt34-alpha",
          "explanation": "Sposta la parabola e le sue radici; aggiorna modello e passo mantenendo c."
        }
      ],
      "origin": "source",
      "sourceFormulaIds": [
        "opt34-update"
      ]
    },
    {
      "formulaId": "opt34-linear",
      "latex": "r^k(z^k+\\Delta z^k)=r(z^k)+\\nabla r(z^k)^\\top\\Delta z^k",
      "conceptualExplanation": "rᵏ è il modello affine costruito all’iterazione k. Il passo annulla questo modello: il residuo originale viene rivalutato dopo l’aggiornamento.",
      "purpose": "Separare funzione non lineare e modello locale.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt34-c",
          "explanation": "Sposta il punto di linearizzazione, la tangente e il suo zero; la funzione resta fissa per α fissato."
        },
        {
          "controlId": "opt34-alpha",
          "explanation": "Sposta la parabola e le sue radici; aggiorna modello e passo mantenendo c."
        }
      ],
      "origin": "source",
      "sourceFormulaIds": [
        "opt34-linear"
      ]
    },
    {
      "formulaId": "opt34-step",
      "latex": "\\Delta z^k=-\\big(\\nabla r(z^k)^\\top\\big)^{-1}r(z^k)",
      "conceptualExplanation": "Il segno meno risolve l’equazione affine; il vettore ottenuto si somma al punto corrente.",
      "purpose": "Distinguere spostamento e nuovo punto.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt34-c",
          "explanation": "Sposta il punto di linearizzazione, la tangente e il suo zero; la funzione resta fissa per α fissato."
        },
        {
          "controlId": "opt34-alpha",
          "explanation": "Sposta la parabola e le sue radici; aggiorna modello e passo mantenendo c."
        }
      ],
      "origin": "source",
      "sourceFormulaIds": [
        "opt34-step"
      ]
    },
    {
      "formulaId": "opt34-example",
      "latex": "r(z)=z^2-\\alpha,\\quad r^k(z)=r(c)+2c(z-c)",
      "conceptualExplanation": "Il residuo è una parabola; il modello è la tangente in c. Il suo zero può essere lontano, mentre il residuo reale nel nuovo punto è generalmente diverso da zero.",
      "purpose": "Dare un esempio scalare controllabile mantenendo la convenzione del corso.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [
        "α∈[0,2], c∈[−2,2]. Per c≠0 il passo è −(c²−α)/(2c).",
        "A c=0,α>0 la tangente è una costante non nulla: niente inversa o aggiornamento. A c=α=0 si è già su una radice, senza una scelta univoca dello zero del modello nullo.",
        "Il grafico usa un intervallo fisso [−2.5,2.5]. Un punto fuori dal ritaglio è dichiarato e non viene tagliato artificialmente.",
        "Residuo già entro 10⁻¹²: arresto numerico dichiarato, distinto da uno zero esatto."
      ],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt34-c",
          "explanation": "Sposta il punto di linearizzazione, la tangente e il suo zero; la funzione resta fissa per α fissato."
        },
        {
          "controlId": "opt34-alpha",
          "explanation": "Sposta la parabola e le sue radici; aggiorna modello e passo mantenendo c."
        }
      ],
      "origin": "enrichment",
      "sourceFormulaIds": []
    }
  ],
  "35": [
    {
      "formulaId": "opt35-newton",
      "latex": "z^{k+1}=z^k-\\nabla^2\\ell(z^k)^{-1}\\nabla\\ell(z^k)",
      "conceptualExplanation": "Con Hessiana invertibile, questo è Newton applicato al gradiente. Cerca stazionari: invertibile non significa positiva definita né minimo.",
      "purpose": "Distinguere ricerca di stazionari e direzione garantita di discesa.",
      "symbolDefinitions": [],
      "assumptions": [
        "Costo sufficientemente differenziabile e Hessiana invertibile nel punto corrente."
      ],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt35-a",
          "explanation": "Cambia gradiente, Hessiana e tangente del gradiente; il costo cubico resta fisso."
        }
      ],
      "origin": "source",
      "sourceFormulaIds": [
        "opt35-newton"
      ]
    },
    {
      "formulaId": "opt35-system",
      "latex": "\\nabla\\ell(z^k)+\\nabla^2\\ell(z^k)\\Delta z^k=0",
      "conceptualExplanation": "La Hessiana è il Jacobiano del gradiente: il sistema annulla la sua linearizzazione. Per un costo C² la simmetria rende coerente la trasposta usata nella pagina 34.",
      "purpose": "Collegare esattamente il residuo di pagina 34 alla Hessiana.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt35-a",
          "explanation": "Cambia gradiente, Hessiana e tangente del gradiente; il costo cubico resta fisso."
        }
      ],
      "origin": "source",
      "sourceFormulaIds": [
        "opt35-system"
      ]
    },
    {
      "formulaId": "opt35-stationarity",
      "latex": "r(z)=\\nabla\\ell(z),\\qquad\\nabla\\ell(\\bar z)=0",
      "conceptualExplanation": "L’equazione di radici esprime stazionarietà, una condizione necessaria al primo ordine. Non esclude massimi o selle.",
      "purpose": "Identificare che cosa viene effettivamente risolto.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt35-a",
          "explanation": "Cambia gradiente, Hessiana e tangente del gradiente; il costo cubico resta fisso."
        }
      ],
      "origin": "source",
      "sourceFormulaIds": [
        "opt35-stationarity"
      ]
    },
    {
      "formulaId": "opt35-example",
      "latex": "\\ell(z)=\\frac13z^3-z,\\quad\\nabla\\ell(z)=z^2-1,\\quad\\nabla^2\\ell(z)=2z",
      "conceptualExplanation": "Il residuo z²−1 ha due zeri: +1 è un minimo locale, −1 un massimo locale. La stessa ricerca di radici può avvicinare entrambi.",
      "purpose": "Usare la parabola precedente come gradiente di un costo, senza dichiarare un minimo globale.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [
        "Il cubico non è limitato inferiormente su R: il minimo in +1 è locale, non globale.",
        "Per a=−0.5: g=−0.75, H=−1, Δz=−0.75 e z nuovo=−1.25; il costo aumenta verso il massimo locale −1.",
        "A a=0 la Hessiana è zero e il gradiente −1: nessun passo Newton puro.",
        "Anche con Hessiana positiva il passo pieno può aumentare il costo: a=0.32 dà H=0.64 e nuovo punto 1.7225, ancora dentro il controllo, ma con costo maggiore."
      ],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt35-a",
          "explanation": "Cambia gradiente, Hessiana e tangente del gradiente; il costo cubico resta fisso."
        }
      ],
      "origin": "enrichment",
      "sourceFormulaIds": []
    }
  ],
  "36": [
    {
      "formulaId": "opt36-qp",
      "latex": "\\Delta z^k=\\operatorname*{arg\\,min}_{\\Delta z}\\nabla\\ell(z^k)^\\top\\Delta z+\\frac12\\Delta z^\\top\\nabla^2\\ell(z^k)\\Delta z",
      "conceptualExplanation": "Il QP determina lo spostamento, non la nuova coordinata. Con Hessiana positiva definita è un minimo unico; con curvatura negativa è solo uno stazionario del modello.",
      "purpose": "Leggere la variabile del problema quadratico e il significato di argmin.",
      "symbolDefinitions": [],
      "assumptions": [
        "Per il minimo unico e la formula Newton con inversa: ∇²ℓ(z^k)>0."
      ],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt36-a",
          "explanation": "Ricostruisce la variazione reale e il QP; aggiorna passo, tipo di stazionario e nuovo punto, mantenendo il cubico."
        }
      ],
      "origin": "source",
      "sourceFormulaIds": [
        "opt36-qp"
      ]
    },
    {
      "formulaId": "opt36-system",
      "latex": "\\nabla\\ell(z^k)+\\nabla^2\\ell(z^k)\\Delta z^k=0",
      "conceptualExplanation": "La derivata del QP rispetto allo spostamento dà lo stesso sistema di Newton. La sufficienza richiede convessità del modello; l’unicità richiede positività definita.",
      "purpose": "Collegare condizioni del QP e sistema lineare.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt36-a",
          "explanation": "Ricostruisce la variazione reale e il QP; aggiorna passo, tipo di stazionario e nuovo punto, mantenendo il cubico."
        }
      ],
      "origin": "source",
      "sourceFormulaIds": [
        "opt36-system"
      ]
    },
    {
      "formulaId": "opt36-literal",
      "latex": "z^{k+1}=z^k-\\Delta z^k",
      "conceptualExplanation": "Questa è la riga stampata: il QP precedente ha già dato a Δzᵏ il segno del passo. La companion usa il più per sommarlo.",
      "purpose": "Conservare il letterale della fonte senza applicarlo ai calcoli.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt36-a",
          "explanation": "Ricostruisce la variazione reale e il QP; aggiorna passo, tipo di stazionario e nuovo punto, mantenendo il cubico."
        }
      ],
      "origin": "source",
      "sourceFormulaIds": [
        "opt36-literal"
      ]
    },
    {
      "formulaId": "opt36-corrected",
      "latex": "z^{k+1}=z^k+\\Delta z^k,\\qquad\\nabla^2\\ell(z^k)>0",
      "conceptualExplanation": "Il segno meno è già nel passo −H⁻¹g. Sommare Δzᵏ collega coerentemente il QP all’aggiornamento di pagina 35.",
      "purpose": "Applicare la versione coerente nei calcoli e nell’esempio.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt36-a",
          "explanation": "Ricostruisce la variazione reale e il QP; aggiorna passo, tipo di stazionario e nuovo punto, mantenendo il cubico."
        }
      ],
      "origin": "correction",
      "sourceFormulaIds": [
        "opt36-corrected"
      ]
    },
    {
      "formulaId": "opt36-example",
      "latex": "\\ell(z)=\\frac13z^3-z,\\quad q_a(\\Delta z)=(a^2-1)\\Delta z+a(\\Delta z)^2",
      "conceptualExplanation": "La curvatura del QP è 2a: positiva con a>0, negativa con a<0, nulla a zero.",
      "purpose": "Confrontare modello del passo e vera variazione di costo nello stesso spostamento.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [
        "Si è omessa la costante ℓ(a), che non cambia l’argmin. Il grafico usa Δz sull’asse orizzontale; il nuovo punto è a+Δz.",
        "La curva reale è ℓ(a+Δz)−ℓ(a); il modello q_a non è una garanzia globale sul costo.",
        "Per a<0 lo stazionario è un massimo del QP, non un argmin. A a=0 il modello è −Δz e non ha minimo.",
        "Una Hessiana PSD singolare può avere minimi non unici se il sistema è compatibile, ma non giustifica l’inversa Newton: non affermare che PD sia necessaria a ogni QP."
      ],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt36-a",
          "explanation": "Ricostruisce la variazione reale e il QP; aggiorna passo, tipo di stazionario e nuovo punto, mantenendo il cubico."
        }
      ],
      "origin": "enrichment",
      "sourceFormulaIds": []
    }
  ],
  "37": [
    {
      "formulaId": "opt37-model",
      "latex": "\\ell^k(z)=\\ell(z^k)+\\nabla\\ell(z^k)^\\top(z-z^k)+\\frac12(z-z^k)^\\top(D^k)^{-1}(z-z^k)",
      "conceptualExplanation": "Modello tangente al costo, con curvatura (Dᵏ)⁻¹. Si assume Dᵏ>0.",
      "purpose": "Separare modello locale e costo originale.",
      "symbolDefinitions": [],
      "assumptions": [
        "Dᵏ simmetrica positiva definita, come nella famiglia della pagina 31."
      ],
      "optionalDetails": [
        "La tangenza significa stesso valore e gradiente nel punto corrente; la Hessiana del modello è (Dᵏ)⁻¹ e non necessariamente quella del costo reale."
      ],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt37-d1",
          "explanation": "Cambia la prima curvatura del modello in 1/D₁₁ e la prima componente del passo; costo reale e punto corrente restano fissi."
        },
        {
          "controlId": "opt37-d2",
          "explanation": "Cambia la seconda curvatura del modello in 1/D₂₂ e la seconda componente del passo; il costo reale resta fisso."
        }
      ],
      "origin": "source",
      "sourceFormulaIds": [
        "opt37-model"
      ]
    },
    {
      "formulaId": "opt37-literal",
      "latex": "\\Delta z^k=D^k\\nabla\\ell(z^k)",
      "conceptualExplanation": "La prima riga stampa il segno positivo; il sistema e le due formule finali della stessa pagina usano il segno negativo.",
      "purpose": "Conservare il letterale della discrepanza.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt37-d1",
          "explanation": "Cambia la prima curvatura del modello in 1/D₁₁ e la prima componente del passo; costo reale e punto corrente restano fissi."
        },
        {
          "controlId": "opt37-d2",
          "explanation": "Cambia la seconda curvatura del modello in 1/D₂₂ e la seconda componente del passo; il costo reale resta fisso."
        }
      ],
      "origin": "source",
      "sourceFormulaIds": [
        "opt37-literal"
      ]
    },
    {
      "formulaId": "opt37-stationarity",
      "latex": "\\nabla\\ell(z^k)+(D^k)^{-1}(z-z^k)=0",
      "conceptualExplanation": "Annullare il gradiente del modello e moltiplicare per Dᵏ dà lo spostamento −Dᵏ∇ℓ. Con Dᵏ>0 il minimo è unico.",
      "purpose": "Ricavare il segno e l’aggiornamento dalle condizioni del modello.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt37-d1",
          "explanation": "Cambia la prima curvatura del modello in 1/D₁₁ e la prima componente del passo; costo reale e punto corrente restano fissi."
        },
        {
          "controlId": "opt37-d2",
          "explanation": "Cambia la seconda curvatura del modello in 1/D₂₂ e la seconda componente del passo; il costo reale resta fisso."
        }
      ],
      "origin": "source",
      "sourceFormulaIds": [
        "opt37-stationarity"
      ]
    },
    {
      "formulaId": "opt37-update",
      "latex": "z^{k+1}=z^k-D^k\\nabla\\ell(z^k)",
      "conceptualExplanation": "Il minimizzatore del modello diventa il prossimo iterato. Può però avere un costo reale maggiore: il modello non è automaticamente un maggiorante.",
      "purpose": "Collegare soluzione del QP e verifica del costo reale.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt37-d1",
          "explanation": "Cambia la prima curvatura del modello in 1/D₁₁ e la prima componente del passo; costo reale e punto corrente restano fissi."
        },
        {
          "controlId": "opt37-d2",
          "explanation": "Cambia la seconda curvatura del modello in 1/D₂₂ e la seconda componente del passo; il costo reale resta fisso."
        }
      ],
      "origin": "source",
      "sourceFormulaIds": [
        "opt37-update"
      ]
    },
    {
      "formulaId": "opt37-corrected",
      "latex": "\\Delta z^k=-D^k\\nabla\\ell(z^k)",
      "conceptualExplanation": "Il segno negativo è coerente con la derivata nulla e con l’aggiornamento finale della fonte. È questa la direzione usata in tutti i calcoli.",
      "purpose": "Applicare la direzione coerente della companion.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt37-d1",
          "explanation": "Cambia la prima curvatura del modello in 1/D₁₁ e la prima componente del passo; costo reale e punto corrente restano fissi."
        },
        {
          "controlId": "opt37-d2",
          "explanation": "Cambia la seconda curvatura del modello in 1/D₂₂ e la seconda componente del passo; il costo reale resta fisso."
        }
      ],
      "origin": "correction",
      "sourceFormulaIds": [
        "opt37-corrected"
      ]
    },
    {
      "formulaId": "opt37-example",
      "latex": "\\ell(z)=\\frac12(z_1^2+4z_2^2),\\quad z^k=(1,0.5)^T,\\quad D^k=\\operatorname{diag}(s_1,s_2)",
      "conceptualExplanation": "Il costo e il punto iniziale sono fissi; D è diagonale positiva.",
      "purpose": "Confrontare superfici e risultati senza cambiare problema.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [
        "Il selettore cambia soltanto la funzione mostrata, non i dati del problema o il passo.",
        "g=(1,2), Δz=(−s₁,−2s₂), z nuovo=(1−s₁,0.5−2s₂).",
        "Il minimo del modello vale 1−(s₁+4s₂)/2; non va confuso con ℓ(z nuovo).",
        "Con D=I, z nuovo=(0,−1.5), modello minimo −1.5 e costo reale 4.5, rispetto al costo iniziale 1.",
        "Con D=diag(1,0.25), D⁻¹ è la Hessiana esatta: modello e costo coincidono e il nuovo punto è l’origine.",
        "La remark sui QP richiede comunque che un modello sia disponibile: non promette di ottenere il gradiente gratuitamente. Nei domini convessi la minimizzazione deve includere il dominio; qui si visualizza il caso libero."
      ],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt37-d1",
          "explanation": "Cambia la prima curvatura del modello in 1/D₁₁ e la prima componente del passo; costo reale e punto corrente restano fissi."
        },
        {
          "controlId": "opt37-d2",
          "explanation": "Cambia la seconda curvatura del modello in 1/D₂₂ e la seconda componente del passo; il costo reale resta fisso."
        }
      ],
      "origin": "enrichment",
      "sourceFormulaIds": []
    }
  ]
} as const satisfies Readonly<Record<number,readonly FormulaExplanation[]>>;
