import type {FormulaExplanation} from '../../components/ExplainedEquation';
export const convexityFormulaNotes = {
  "10": [
    {
      "formulaId": "opt10-segment",
      "latex": "\\theta z_A+(1-\\theta)z_B\\in\\mathbb Z,\\quad\\theta\\in[0,1]",
      "conceptualExplanation": "θ percorre il segmento: da B per θ=0 ad A per θ=1. La proprietà deve valere per tutte le coppie dell’insieme.",
      "purpose": "Applicare la definizione geometrica di convessità.",
      "symbolDefinitions": [
        {
          "symbol": "\\mathbb Z",
          "meaning": "Insieme di decisioni del corso, non un asse temporale."
        }
      ],
      "assumptions": [
        "Entrambi gli estremi appartengono all’insieme."
      ],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [],
      "origin": "source",
      "sourceFormulaIds": [
        "opt10-segment"
      ]
    },
    {
      "formulaId": "opt10-example",
      "latex": "\\mathbb Z_1=\\{z:(z_1/1.8)^2+(z_2/1.2)^2\\le1\\},\\quad\\mathbb Z_2=\\{z:0.65^2\\le z_1^2+z_2^2\\le1.5^2\\}",
      "conceptualExplanation": "L’ellisse piena è convessa. La corona ha un foro: il segmento fra (−1.2,0) e (1.2,0) lo attraversa.",
      "purpose": "Dare un controesempio esplicito senza attribuire coordinate ai disegni originali.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [],
      "origin": "enrichment",
      "sourceFormulaIds": []
    }
  ],
  "11": [
    {
      "formulaId": "opt11-jensen",
      "latex": "\\ell(\\theta z_A+(1-\\theta)z_B)\\le\\theta\\ell(z_A)+(1-\\theta)\\ell(z_B)",
      "conceptualExplanation": "Sul dominio convesso, per ogni coppia il costo del punto intermedio non supera la media pesata dei costi: così definiamo ℓ convessa.",
      "purpose": "Separare decisione interpolata e costo interpolato.",
      "symbolDefinitions": [
        {
          "symbol": "\\theta",
          "meaning": "Peso del punto z_A, fra zero e uno."
        }
      ],
      "assumptions": [
        "Dominio convesso, z_A,z_B nel dominio."
      ],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [],
      "origin": "source",
      "sourceFormulaIds": [
        "opt11-jensen"
      ]
    },
    {
      "formulaId": "opt11-strict",
      "latex": "\\ell(\\theta z_A+(1-\\theta)z_B)<\\theta\\ell(z_A)+(1-\\theta)\\ell(z_B),\\quad z_A\\ne z_B,\\quad0<\\theta<1",
      "conceptualExplanation": "La disuguaglianza stretta riguarda punti distinti e pesi interni. Agli estremi il pareggio è inevitabile.",
      "purpose": "Chiarire quando stretto ha significato.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [],
      "origin": "source",
      "sourceFormulaIds": [
        "opt11-strict"
      ]
    },
    {
      "formulaId": "opt11-concave",
      "latex": "\\ell\\ \\text{concava}\\quad\\Longleftrightarrow\\quad-\\ell\\ \\text{convessa}",
      "conceptualExplanation": "Cambiare il segno riflette il grafico e scambia sopra e sotto la corda.",
      "purpose": "Interpretare la remark della fonte.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [],
      "origin": "source",
      "sourceFormulaIds": [
        "opt11-concave"
      ]
    },
    {
      "formulaId": "opt11-case-0",
      "latex": "\\ell(z)=z^2,\\quad z_A=-1,\\ z_B=1",
      "conceptualExplanation": "La quadratica è strettamente convessa: il margine è positivo per θ interno.",
      "purpose": "Confrontare funzioni esplicite sullo stesso segmento.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [],
      "origin": "enrichment",
      "sourceFormulaIds": []
    },
    {
      "formulaId": "opt11-case-1",
      "latex": "\\ell(z)=z,\\quad z_A=-1,\\ z_B=1",
      "conceptualExplanation": "Una funzione affine coincide con ogni sua corda: convessa, senza strettezza.",
      "purpose": "Confrontare funzioni esplicite sullo stesso segmento.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [],
      "origin": "enrichment",
      "sourceFormulaIds": []
    },
    {
      "formulaId": "opt11-case-2",
      "latex": "\\ell(z)=-z^2,\\quad z_A=-1,\\ z_B=1",
      "conceptualExplanation": "La quadratica concava sta sopra la corda e viola il confronto di convessità.",
      "purpose": "Confrontare funzioni esplicite sullo stesso segmento.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [],
      "origin": "enrichment",
      "sourceFormulaIds": []
    }
  ],
  "12": [
    {
      "formulaId": "opt12-set",
      "latex": "\\mathbb Z_{\\mathrm{ineq}}=\\{z\\in\\mathbb R^d\\mid g(z)\\le0\\}",
      "conceptualExplanation": "Con più componenti devono valere tutte le disequazioni. Sono ammessi tutti i punti con g≤0, non soltanto gli zeri.",
      "purpose": "Leggere l’ammissibilità di una disequazione.",
      "symbolDefinitions": [],
      "assumptions": [
        "Disuguaglianza vettoriale componente per componente."
      ],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [],
      "origin": "source",
      "sourceFormulaIds": [
        "opt12-set"
      ]
    },
    {
      "formulaId": "opt12-sufficient",
      "latex": "g_i\\ \\text{quasiconvessa per ogni }i\\ \\Longrightarrow\\ \\mathbb Z_{\\mathrm{ineq}}\\ \\text{convesso}",
      "conceptualExplanation": "Ogni sottolivello è convesso; intersecarli conserva la convessità. Un solo sottolivello convesso non basta al viceversa.",
      "purpose": "Usare solo la direzione valida dell’affermazione.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [],
      "origin": "correction",
      "sourceFormulaIds": [
        "opt12-sufficient"
      ]
    },
    {
      "formulaId": "opt12-case-0",
      "latex": "g(z)=z_1^2+2z_2^2-c",
      "conceptualExplanation": "c amplia l’ellisse; c=0 lascia soltanto l’origine.",
      "purpose": "Calcolare regione e valore del vincolo nello stesso modello.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [],
      "origin": "enrichment",
      "sourceFormulaIds": []
    },
    {
      "formulaId": "opt12-case-1",
      "latex": "g(z)=z_1+z_2-c",
      "conceptualExplanation": "c trasla la retta di bordo; il semipiano resta convesso.",
      "purpose": "Calcolare regione e valore del vincolo nello stesso modello.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [],
      "origin": "enrichment",
      "sourceFormulaIds": []
    },
    {
      "formulaId": "opt12-case-2",
      "latex": "g(z)=z_1^2(z_1^2-1)-c",
      "conceptualExplanation": "Per c≥0 il livello zero è una striscia convessa. g non è quasiconvessa: altri sottolivelli sono sconnessi.",
      "purpose": "Calcolare regione e valore del vincolo nello stesso modello.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [],
      "origin": "enrichment",
      "sourceFormulaIds": []
    }
  ],
  "13": [
    {
      "formulaId": "opt13-set",
      "latex": "\\mathbb Z_{\\mathrm{eq}}=\\{z\\in\\mathbb R^d\\mid h(z)=0\\}",
      "conceptualExplanation": "Sono ammessi soltanto gli zeri. In 2D una retta o una circonferenza non ammettono automaticamente il loro interno.",
      "purpose": "Distinguere uguaglianza e disequazione.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [],
      "origin": "source",
      "sourceFormulaIds": [
        "opt13-set"
      ]
    },
    {
      "formulaId": "opt13-affine",
      "latex": "h(z)=Az-c\\ \\Longrightarrow\\ \\mathbb Z_{\\mathrm{eq}}=\\{z:Az=c\\}\\ \\text{convesso}",
      "conceptualExplanation": "Se non vuoto, il sistema affine dà un insieme affine. Passa per l’origine, e diventa sottospazio, quando c=0. h affine è sufficiente, non necessario.",
      "purpose": "Correggere necessità e classificazione geometrica.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [
        "Per p>1 l’intersezione può avere codimensione diversa da uno o essere vuota; non è sempre un singolo iperpiano."
      ],
      "relatedFormulaIds": [],
      "parameterInterpretation": [],
      "origin": "correction",
      "sourceFormulaIds": [
        "opt13-affine"
      ]
    },
    {
      "formulaId": "opt13-case-0",
      "latex": "h(z)=z_1+z_2-c",
      "conceptualExplanation": "La retta traslata è affine; c=0 la fa passare per l’origine.",
      "purpose": "Mostrare come dipendono gli zeri dalla funzione scelta.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [],
      "origin": "enrichment",
      "sourceFormulaIds": []
    },
    {
      "formulaId": "opt13-case-1",
      "latex": "h(z)=(z_1+z_2-c)^3",
      "conceptualExplanation": "Il cubo cambia i valori di h ma non i suoi zeri: stessa retta, funzione non affine.",
      "purpose": "Mostrare come dipendono gli zeri dalla funzione scelta.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [],
      "origin": "enrichment",
      "sourceFormulaIds": []
    },
    {
      "formulaId": "opt13-case-2",
      "latex": "h(z)=z_1^2+z_2^2-c",
      "conceptualExplanation": "Con c>0 gli zeri sono una circonferenza non convessa. Con c=0 resta il singleton origine.",
      "purpose": "Mostrare come dipendono gli zeri dalla funzione scelta.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [],
      "origin": "enrichment",
      "sourceFormulaIds": []
    }
  ],
  "14": [
    {
      "formulaId": "opt14-support",
      "latex": "\\ell(z_B)\\ge\\ell(z_A)+\\nabla\\ell(z_A)^\\top(z_B-z_A)",
      "conceptualExplanation": "Per ℓ differenziabile e convessa, la tangente in A usa valore e pendenza locali e non sovrastima il costo in B.",
      "purpose": "Interpretare geometricamente il limite del primo ordine.",
      "symbolDefinitions": [],
      "assumptions": [
        "ℓ differenziabile e convessa sul dominio convesso considerato."
      ],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [],
      "origin": "source",
      "sourceFormulaIds": [
        "opt14-support"
      ]
    },
    {
      "formulaId": "opt14-monotone",
      "latex": "(\\nabla\\ell(z_A)-\\nabla\\ell(z_B))^\\top(z_A-z_B)\\ge0",
      "conceptualExplanation": "Il prodotto scalare mette insieme tutte le coordinate: non richiede un confronto componente per componente dei gradienti.",
      "purpose": "Capire la monotonia dell’operatore gradiente.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [
        "Sommare le disuguaglianze di supporto scambiando A e B; i valori dei costi si cancellano."
      ],
      "relatedFormulaIds": [],
      "parameterInterpretation": [],
      "origin": "source",
      "sourceFormulaIds": [
        "opt14-monotone"
      ]
    },
    {
      "formulaId": "opt14-example",
      "latex": "\\ell(z)=\\frac14z^4+\\frac12z^2,\\quad\\nabla\\ell(z)=z^3+z",
      "conceptualExplanation": "La pendenza cresce con z. La stessa funzione alimenta curva, tangente e confronti numerici.",
      "purpose": "Collegare i due risultati sulla stessa coppia di punti.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [],
      "origin": "enrichment",
      "sourceFormulaIds": []
    }
  ],
  "15": [
    {
      "formulaId": "opt15-strict",
      "latex": "\\ell(\\theta z_A+(1-\\theta)z_B)<\\theta\\ell(z_A)+(1-\\theta)\\ell(z_B),\\quad z_A\\ne z_B,\\ 0<\\theta<1",
      "conceptualExplanation": "Il confronto è stretto soltanto fra punti distinti e lungo la parte interna del segmento.",
      "purpose": "Ricollegare monotonia e definizione di convessità stretta.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [],
      "origin": "source",
      "sourceFormulaIds": [
        "opt15-strict"
      ]
    },
    {
      "formulaId": "opt15-literal",
      "latex": "(\\nabla\\ell(z_A)-\\nabla\\ell(z_B))^\\top(z_A-z_B)>0\\quad\\forall z_A,z_B\\in\\mathbb Z",
      "conceptualExplanation": "La formulazione stampata sottintende punti distinti; presa letteralmente include una coppia per cui il prodotto è zero.",
      "purpose": "Registrare la formula della fonte senza usarla sulle coppie coincidenti.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [],
      "origin": "source",
      "sourceFormulaIds": [
        "opt15-literal"
      ]
    },
    {
      "formulaId": "opt15-distinct",
      "latex": "(\\nabla\\ell(z_A)-\\nabla\\ell(z_B))^\\top(z_A-z_B)>0,\\quad z_A\\ne z_B",
      "conceptualExplanation": "Per ℓ strettamente convessa e differenziabile, il confronto è stretto fra punti distinti. Se coincidono, il prodotto è zero.",
      "purpose": "Applicare la precisazione necessaria alla lettura della slide.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [],
      "origin": "correction",
      "sourceFormulaIds": [
        "opt15-distinct"
      ]
    },
    {
      "formulaId": "opt15-example",
      "latex": "\\ell(z)=\\frac14z^4,\\quad z_A=-h,\\ z_B=h,\\quad\\frac{M}{\\|z_A-z_B\\|^2}=h^2\\ (h>0)",
      "conceptualExplanation": "Il gradiente z³ è strettamente crescente. Il rapporto tende a zero con h: nessun modulo uniforme positivo sull’intero dominio.",
      "purpose": "Mostrare una funzione strettamente convessa che non è fortemente convessa.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [
        "M è il prodotto monotono; per h=0 il rapporto è 0/0 e non viene calcolato."
      ],
      "relatedFormulaIds": [],
      "parameterInterpretation": [],
      "origin": "enrichment",
      "sourceFormulaIds": []
    }
  ],
  "16": [
    {
      "formulaId": "opt16-literal",
      "latex": "\\ell(\\theta z_A+(1-\\theta)z_B)<\\theta\\ell(z_A)+(1-\\theta)\\ell(z_B)-\\mu\\theta(1-\\theta)\\|z_A-z_B\\|^2",
      "conceptualExplanation": "La slide usa questa normalizzazione, più restrittiva. La companion adotta µ/2 e ≤ per mantenere µ coerente con monotonia e pagine successive.",
      "purpose": "Conservare il letterale della definizione.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [],
      "origin": "source",
      "sourceFormulaIds": [
        "opt16-literal"
      ]
    },
    {
      "formulaId": "opt16-normalized",
      "latex": "\\ell(\\theta z_A+(1-\\theta)z_B)\\le\\theta\\ell(z_A)+(1-\\theta)\\ell(z_B)-\\frac{\\mu}{2}\\theta(1-\\theta)\\|z_A-z_B\\|^2",
      "conceptualExplanation": "Il margine rispetto alla corda è almeno µ/2 volte θ(1−θ) e la distanza quadratica. La stessa µ compare nel limite di monotonia.",
      "purpose": "Fissare la convenzione dei calcoli della companion.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [],
      "origin": "correction",
      "sourceFormulaIds": [
        "opt16-normalized"
      ]
    },
    {
      "formulaId": "opt16-monotone",
      "latex": "(\\nabla\\ell(z_A)-\\nabla\\ell(z_B))^\\top(z_A-z_B)\\ge\\mu\\|z_A-z_B\\|^2",
      "conceptualExplanation": "Per ℓ µ-fortemente convessa e differenziabile, un’unica µ>0 garantisce questo limite per tutte le coppie.",
      "purpose": "Distinguere forte monotonia e semplice strettezza.",
      "symbolDefinitions": [],
      "assumptions": [
        "ℓ differenziabile, µ>0, normalizzazione µ/2 nella definizione."
      ],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [],
      "origin": "source",
      "sourceFormulaIds": [
        "opt16-monotone"
      ]
    },
    {
      "formulaId": "opt16-example",
      "latex": "\\ell(z)=\\frac{\\mu}{2}z^2+\\frac14z^4,\\quad\\nabla\\ell(z)=\\mu z+z^3",
      "conceptualExplanation": "La derivata seconda è µ+3z²: µ è una soglia uniforme. Il termine quartico aggiunge curvatura.",
      "purpose": "Confrontare una funzione con la sua base quadratica.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [],
      "origin": "enrichment",
      "sourceFormulaIds": []
    }
  ],
  "17": [
    {
      "formulaId": "opt17-lipschitz",
      "latex": "\\|\\nabla\\ell(z_A)-\\nabla\\ell(z_B)\\|\\le L\\|z_A-z_B\\|",
      "conceptualExplanation": "L è un limite superiore uniforme alla variazione del gradiente, non necessariamente il valore più piccolo possibile.",
      "purpose": "Interpretare la costante di regolarità.",
      "symbolDefinitions": [],
      "assumptions": [
        "L>0 e confronto su tutto il dominio dichiarato."
      ],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [],
      "origin": "source",
      "sourceFormulaIds": [
        "opt17-lipschitz"
      ]
    },
    {
      "formulaId": "opt17-cocoercive",
      "latex": "(\\nabla\\ell(z_A)-\\nabla\\ell(z_B))^\\top(z_A-z_B)\\ge\\frac1L\\|\\nabla\\ell(z_A)-\\nabla\\ell(z_B)\\|^2",
      "conceptualExplanation": "Per ℓ convessa e differenziabile con gradiente L-Lipschitz, una variazione del gradiente richiede un allineamento quantitativo con lo spostamento.",
      "purpose": "Leggere la conclusione della slide.",
      "symbolDefinitions": [],
      "assumptions": [
        "ℓ differenziabile e convessa, gradiente L-Lipschitz."
      ],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [],
      "origin": "source",
      "sourceFormulaIds": [
        "opt17-cocoercive"
      ]
    },
    {
      "formulaId": "opt17-example",
      "latex": "\\ell(z)=\\frac12(z_1^2+Lz_2^2),\\quad z_B=0,\\quad z_A=(\\cos\\varphi,\\sin\\varphi)^\\top",
      "conceptualExplanation": "La distanza è uno; il gradiente varia con la direzione. Δg/L deve restare nel disco di diametro fra 0 e δ.",
      "purpose": "Rendere visibili cocoercività e orientamento su una quadratica.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [
        "δ=z_A−z_B, Δg=∇ℓ(z_A)−∇ℓ(z_B). Il disco è una rappresentazione aggiunta della stessa disuguaglianza, non un nuovo teorema attribuito al disegno della fonte."
      ],
      "relatedFormulaIds": [],
      "parameterInterpretation": [],
      "origin": "enrichment",
      "sourceFormulaIds": []
    }
  ],
  "18": [
    {
      "formulaId": "opt18-refined",
      "latex": "(\\nabla\\ell(z_A)-\\nabla\\ell(z_B))^\\top(z_A-z_B)\\ge\\underbrace{\\frac{\\mu L}{\\mu+L}}_{\\gamma_1}\\|z_A-z_B\\|^2+\\underbrace{\\frac1{\\mu+L}}_{\\gamma_2}\\|\\nabla\\ell(z_A)-\\nabla\\ell(z_B)\\|^2",
      "conceptualExplanation": "Con ℓ µ-fortemente convessa e gradiente L-Lipschitz, distanza e variazione del gradiente danno due contributi da sommare.",
      "purpose": "Usare contemporaneamente le due informazioni di curvatura.",
      "symbolDefinitions": [
        {
          "symbol": "\\gamma_1",
          "meaning": "µL/(µ+L), peso della distanza quadratica."
        },
        {
          "symbol": "\\gamma_2",
          "meaning": "1/(µ+L), peso della norma quadratica del gradiente."
        }
      ],
      "assumptions": [
        "µ>0, gradiente L-Lipschitz, normalizzazione µ/2; nell’esempio 0<µ≤L."
      ],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [],
      "origin": "source",
      "sourceFormulaIds": [
        "opt18-refined"
      ]
    },
    {
      "formulaId": "opt18-example",
      "latex": "\\ell(z)=\\frac{\\mu}{2}z_1^2+\\frac{\\mu+L}{4}z_2^2,\\quad z_B=0,\\quad z_A=(\\cos\\varphi,\\sin\\varphi)^\\top",
      "conceptualExplanation": "Curvature µ e (µ+L)/2: L è un limite valido, anche se non ottimale. Il confronto può avere margine positivo.",
      "purpose": "Esplorare contributi, uguaglianza e margine sullo stesso modello.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [
        "Ponendo δ=z_A−z_B e Δg=∇ℓ(z_A)−∇ℓ(z_B), la disuguaglianza equivale a ||Δg−(µ+L)δ/2||≤(L−µ)||δ||/2. Il grafico divide gradiente, centro e raggio per L; δ resta di lunghezza uno. Questa riscrittura è enrichment."
      ],
      "relatedFormulaIds": [],
      "parameterInterpretation": [],
      "origin": "enrichment",
      "sourceFormulaIds": []
    }
  ]
} as const satisfies Readonly<Record<number,readonly FormulaExplanation[]>>;
