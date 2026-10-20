import type {FormulaExplanation} from '../../components/ExplainedEquation';
export const stepSizeFormulaNotes = {
  "38": [
    {
      "formulaId": "opt38-accept",
      "latex": "\\ell(z^k+\\bar\\gamma^id^k)<\\ell(z^k)+c\\bar\\gamma^i\\nabla\\ell(z^k)^\\top d^k",
      "conceptualExplanation": "Si prova γ̄⁰=1. Il costo deve essere sotto la soglia: diminuire rispetto al solo valore iniziale non basta.",
      "purpose": "Leggere l’uscita dal while senza cambiare la convenzione stretta.",
      "symbolDefinitions": [],
      "assumptions": [
        "Costo differenziabile e direzione di discesa, ∇ℓ(zᵏ)ᵀdᵏ<0; β,c interni a (0,1)."
      ],
      "optionalDetails": [
        "La condizione < è la negazione del ≥ stampato nel while, non una sostituzione con una diversa versione di Armijo.",
        "Con gradiente nullo si arresta prima della ricerca: il test stretto non deve generare un ciclo infinito.",
        "k conta le iterazioni esterne, i i tentativi di passo all’interno della stessa iterazione."
      ],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt38-beta",
          "explanation": "Ricalcola tutti i candidati moltiplicando per β; funzione, direzione e soglia fissata da c restano invariate."
        },
        {
          "controlId": "opt38-c",
          "explanation": "Cambia soltanto la soglia e quindi il primo candidato accettabile; curva del costo e direzione restano fisse."
        }
      ],
      "origin": "enrichment",
      "sourceFormulaIds": []
    },
    {
      "formulaId": "opt38-while",
      "latex": "\\ell(z^k+\\bar\\gamma^id^k)\\ge\\ell(z^k)+c\\bar\\gamma^i\\nabla\\ell(z^k)^\\top d^k",
      "conceptualExplanation": "Il candidato viene rifiutato quando il suo costo è maggiore o uguale alla soglia di sufficiente diminuzione.",
      "purpose": "Conservare esattamente il test stampato.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt38-beta",
          "explanation": "Ricalcola tutti i candidati moltiplicando per β; funzione, direzione e soglia fissata da c restano invariate."
        },
        {
          "controlId": "opt38-c",
          "explanation": "Cambia soltanto la soglia e quindi il primo candidato accettabile; curva del costo e direzione restano fisse."
        }
      ],
      "origin": "source",
      "sourceFormulaIds": [
        "opt38-while"
      ]
    },
    {
      "formulaId": "opt38-shrink",
      "latex": "\\bar\\gamma^{i+1}=\\beta\\bar\\gamma^i,\\qquad \\gamma^k=\\bar\\gamma^i",
      "conceptualExplanation": "β riduce geometricamente il candidato. All’uscita il valore corrente diventa il passo dell’iterazione esterna.",
      "purpose": "Separare tentativi i e iterazioni k.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt38-beta",
          "explanation": "Ricalcola tutti i candidati moltiplicando per β; funzione, direzione e soglia fissata da c restano invariate."
        },
        {
          "controlId": "opt38-c",
          "explanation": "Cambia soltanto la soglia e quindi il primo candidato accettabile; curva del costo e direzione restano fisse."
        }
      ],
      "origin": "source",
      "sourceFormulaIds": [
        "opt38-shrink"
      ]
    },
    {
      "formulaId": "opt38-parameters",
      "latex": "\\bar\\gamma^0>0,\\quad\\beta\\in(0,1),\\quad c\\in(0,1)",
      "conceptualExplanation": "c determina la diminuzione richiesta; β determina quanto si riduce a ogni rifiuto. La fonte indica 0.7 e 0.5 come valori tipici.",
      "purpose": "Chiarire i ruoli dei due parametri.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt38-beta",
          "explanation": "Ricalcola tutti i candidati moltiplicando per β; funzione, direzione e soglia fissata da c restano invariate."
        },
        {
          "controlId": "opt38-c",
          "explanation": "Cambia soltanto la soglia e quindi il primo candidato accettabile; curva del costo e direzione restano fisse."
        }
      ],
      "origin": "source",
      "sourceFormulaIds": [
        "opt38-parameters"
      ]
    },
    {
      "formulaId": "opt38-example",
      "latex": "\\ell(z)=z^2,\\quad z^k=1,\\quad d^k=-2",
      "conceptualExplanation": "Stesso esempio nelle tre pagine: punto e direzione restano fissi durante tutti i tentativi.",
      "purpose": "Fornire numeri alla figura qualitativa senza attribuirli alla fonte.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt38-beta",
          "explanation": "Ricalcola tutti i candidati moltiplicando per β; funzione, direzione e soglia fissata da c restano invariate."
        },
        {
          "controlId": "opt38-c",
          "explanation": "Cambia soltanto la soglia e quindi il primo candidato accettabile; curva del costo e direzione restano fisse."
        }
      ],
      "origin": "enrichment",
      "sourceFormulaIds": []
    },
    {
      "formulaId": "opt38-profile",
      "latex": "\\phi(\\gamma)=(1-2\\gamma)^2,\\quad A(\\gamma)=1-4c\\gamma",
      "conceptualExplanation": "La curva blu è il costo effettivo; la retta rossa è la soglia. Il test equivale a 0<γ<1−c in questo esempio.",
      "purpose": "Verificare anche rifiuti al bordo con un confronto analitico.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [
        "La tangente viola è 1−4γ. Il margine esatto φ−A è 4γ(γ−(1−c)).",
        "Con β=0.7,c=0.5: γ̄⁰=1 rifiutato, γ̄¹=0.7 rifiutato, γ̄²=0.49 accettato.",
        "Con β=c=0.5, γ=0.5 è un pareggio e viene rifiutato; il primo accettato è 0.25.",
        "Il minimo lungo la retta è γ=0.5; il test di Armijo non è una ricerca esatta del minimo."
      ],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt38-beta",
          "explanation": "Ricalcola tutti i candidati moltiplicando per β; funzione, direzione e soglia fissata da c restano invariate."
        },
        {
          "controlId": "opt38-c",
          "explanation": "Cambia soltanto la soglia e quindi il primo candidato accettabile; curva del costo e direzione restano fisse."
        }
      ],
      "origin": "enrichment",
      "sourceFormulaIds": []
    }
  ],
  "39": [
    {
      "formulaId": "opt39-accept",
      "latex": "\\ell(z^k+\\bar\\gamma^id^k)<\\ell(z^k)+c\\bar\\gamma^i\\nabla\\ell(z^k)^\\top d^k",
      "conceptualExplanation": "Dopo un rifiuto il passo è β volte il precedente. Si ricalcola il costo e si ripete lo stesso confronto.",
      "purpose": "Leggere l’uscita dal while senza cambiare la convenzione stretta.",
      "symbolDefinitions": [],
      "assumptions": [
        "Costo differenziabile e direzione di discesa, ∇ℓ(zᵏ)ᵀdᵏ<0; β,c interni a (0,1)."
      ],
      "optionalDetails": [
        "La condizione < è la negazione del ≥ stampato nel while, non una sostituzione con una diversa versione di Armijo.",
        "Con gradiente nullo si arresta prima della ricerca: il test stretto non deve generare un ciclo infinito.",
        "k conta le iterazioni esterne, i i tentativi di passo all’interno della stessa iterazione."
      ],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt39-beta",
          "explanation": "Ricalcola tutti i candidati moltiplicando per β; funzione, direzione e soglia fissata da c restano invariate."
        },
        {
          "controlId": "opt39-c",
          "explanation": "Cambia soltanto la soglia e quindi il primo candidato accettabile; curva del costo e direzione restano fisse."
        }
      ],
      "origin": "enrichment",
      "sourceFormulaIds": []
    },
    {
      "formulaId": "opt39-while",
      "latex": "\\ell(z^k+\\bar\\gamma^id^k)\\ge\\ell(z^k)+c\\bar\\gamma^i\\nabla\\ell(z^k)^\\top d^k",
      "conceptualExplanation": "Il candidato viene rifiutato quando il suo costo è maggiore o uguale alla soglia di sufficiente diminuzione.",
      "purpose": "Conservare esattamente il test stampato.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt39-beta",
          "explanation": "Ricalcola tutti i candidati moltiplicando per β; funzione, direzione e soglia fissata da c restano invariate."
        },
        {
          "controlId": "opt39-c",
          "explanation": "Cambia soltanto la soglia e quindi il primo candidato accettabile; curva del costo e direzione restano fisse."
        }
      ],
      "origin": "source",
      "sourceFormulaIds": [
        "opt39-while"
      ]
    },
    {
      "formulaId": "opt39-shrink",
      "latex": "\\bar\\gamma^{i+1}=\\beta\\bar\\gamma^i,\\qquad \\gamma^k=\\bar\\gamma^i",
      "conceptualExplanation": "β riduce geometricamente il candidato. All’uscita il valore corrente diventa il passo dell’iterazione esterna.",
      "purpose": "Separare tentativi i e iterazioni k.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt39-beta",
          "explanation": "Ricalcola tutti i candidati moltiplicando per β; funzione, direzione e soglia fissata da c restano invariate."
        },
        {
          "controlId": "opt39-c",
          "explanation": "Cambia soltanto la soglia e quindi il primo candidato accettabile; curva del costo e direzione restano fisse."
        }
      ],
      "origin": "source",
      "sourceFormulaIds": [
        "opt39-shrink"
      ]
    },
    {
      "formulaId": "opt39-parameters",
      "latex": "\\bar\\gamma^0>0,\\quad\\beta\\in(0,1),\\quad c\\in(0,1)",
      "conceptualExplanation": "c determina la diminuzione richiesta; β determina quanto si riduce a ogni rifiuto. La fonte indica 0.7 e 0.5 come valori tipici.",
      "purpose": "Chiarire i ruoli dei due parametri.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt39-beta",
          "explanation": "Ricalcola tutti i candidati moltiplicando per β; funzione, direzione e soglia fissata da c restano invariate."
        },
        {
          "controlId": "opt39-c",
          "explanation": "Cambia soltanto la soglia e quindi il primo candidato accettabile; curva del costo e direzione restano fisse."
        }
      ],
      "origin": "source",
      "sourceFormulaIds": [
        "opt39-parameters"
      ]
    },
    {
      "formulaId": "opt39-example",
      "latex": "\\ell(z)=z^2,\\quad z^k=1,\\quad d^k=-2",
      "conceptualExplanation": "Stesso esempio nelle tre pagine: punto e direzione restano fissi durante tutti i tentativi.",
      "purpose": "Fornire numeri alla figura qualitativa senza attribuirli alla fonte.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt39-beta",
          "explanation": "Ricalcola tutti i candidati moltiplicando per β; funzione, direzione e soglia fissata da c restano invariate."
        },
        {
          "controlId": "opt39-c",
          "explanation": "Cambia soltanto la soglia e quindi il primo candidato accettabile; curva del costo e direzione restano fisse."
        }
      ],
      "origin": "enrichment",
      "sourceFormulaIds": []
    },
    {
      "formulaId": "opt39-profile",
      "latex": "\\phi(\\gamma)=(1-2\\gamma)^2,\\quad A(\\gamma)=1-4c\\gamma",
      "conceptualExplanation": "La curva blu è il costo effettivo; la retta rossa è la soglia. Il test equivale a 0<γ<1−c in questo esempio.",
      "purpose": "Verificare anche rifiuti al bordo con un confronto analitico.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [
        "La tangente viola è 1−4γ. Il margine esatto φ−A è 4γ(γ−(1−c)).",
        "Con β=0.7,c=0.5: γ̄⁰=1 rifiutato, γ̄¹=0.7 rifiutato, γ̄²=0.49 accettato.",
        "Con β=c=0.5, γ=0.5 è un pareggio e viene rifiutato; il primo accettato è 0.25.",
        "Il minimo lungo la retta è γ=0.5; il test di Armijo non è una ricerca esatta del minimo."
      ],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt39-beta",
          "explanation": "Ricalcola tutti i candidati moltiplicando per β; funzione, direzione e soglia fissata da c restano invariate."
        },
        {
          "controlId": "opt39-c",
          "explanation": "Cambia soltanto la soglia e quindi il primo candidato accettabile; curva del costo e direzione restano fisse."
        }
      ],
      "origin": "enrichment",
      "sourceFormulaIds": []
    }
  ],
  "40": [
    {
      "formulaId": "opt40-accept",
      "latex": "\\ell(z^k+\\bar\\gamma^id^k)<\\ell(z^k)+c\\bar\\gamma^i\\nabla\\ell(z^k)^\\top d^k",
      "conceptualExplanation": "Il while della fonte rifiuta anche l’uguaglianza. Si accetta il primo candidato strettamente sotto la soglia.",
      "purpose": "Leggere l’uscita dal while senza cambiare la convenzione stretta.",
      "symbolDefinitions": [],
      "assumptions": [
        "Costo differenziabile e direzione di discesa, ∇ℓ(zᵏ)ᵀdᵏ<0; β,c interni a (0,1)."
      ],
      "optionalDetails": [
        "La condizione < è la negazione del ≥ stampato nel while, non una sostituzione con una diversa versione di Armijo.",
        "Con gradiente nullo si arresta prima della ricerca: il test stretto non deve generare un ciclo infinito.",
        "k conta le iterazioni esterne, i i tentativi di passo all’interno della stessa iterazione."
      ],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt40-beta",
          "explanation": "Ricalcola tutti i candidati moltiplicando per β; funzione, direzione e soglia fissata da c restano invariate."
        },
        {
          "controlId": "opt40-c",
          "explanation": "Cambia soltanto la soglia e quindi il primo candidato accettabile; curva del costo e direzione restano fisse."
        }
      ],
      "origin": "enrichment",
      "sourceFormulaIds": []
    },
    {
      "formulaId": "opt40-while",
      "latex": "\\ell(z^k+\\bar\\gamma^id^k)\\ge\\ell(z^k)+c\\bar\\gamma^i\\nabla\\ell(z^k)^\\top d^k",
      "conceptualExplanation": "Il candidato viene rifiutato quando il suo costo è maggiore o uguale alla soglia di sufficiente diminuzione.",
      "purpose": "Conservare esattamente il test stampato.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt40-beta",
          "explanation": "Ricalcola tutti i candidati moltiplicando per β; funzione, direzione e soglia fissata da c restano invariate."
        },
        {
          "controlId": "opt40-c",
          "explanation": "Cambia soltanto la soglia e quindi il primo candidato accettabile; curva del costo e direzione restano fisse."
        }
      ],
      "origin": "source",
      "sourceFormulaIds": [
        "opt40-while"
      ]
    },
    {
      "formulaId": "opt40-shrink",
      "latex": "\\bar\\gamma^{i+1}=\\beta\\bar\\gamma^i,\\qquad \\gamma^k=\\bar\\gamma^i",
      "conceptualExplanation": "β riduce geometricamente il candidato. All’uscita il valore corrente diventa il passo dell’iterazione esterna.",
      "purpose": "Separare tentativi i e iterazioni k.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt40-beta",
          "explanation": "Ricalcola tutti i candidati moltiplicando per β; funzione, direzione e soglia fissata da c restano invariate."
        },
        {
          "controlId": "opt40-c",
          "explanation": "Cambia soltanto la soglia e quindi il primo candidato accettabile; curva del costo e direzione restano fisse."
        }
      ],
      "origin": "source",
      "sourceFormulaIds": [
        "opt40-shrink"
      ]
    },
    {
      "formulaId": "opt40-parameters",
      "latex": "\\bar\\gamma^0>0,\\quad\\beta\\in(0,1),\\quad c\\in(0,1)",
      "conceptualExplanation": "c determina la diminuzione richiesta; β determina quanto si riduce a ogni rifiuto. La fonte indica 0.7 e 0.5 come valori tipici.",
      "purpose": "Chiarire i ruoli dei due parametri.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt40-beta",
          "explanation": "Ricalcola tutti i candidati moltiplicando per β; funzione, direzione e soglia fissata da c restano invariate."
        },
        {
          "controlId": "opt40-c",
          "explanation": "Cambia soltanto la soglia e quindi il primo candidato accettabile; curva del costo e direzione restano fisse."
        }
      ],
      "origin": "source",
      "sourceFormulaIds": [
        "opt40-parameters"
      ]
    },
    {
      "formulaId": "opt40-example",
      "latex": "\\ell(z)=z^2,\\quad z^k=1,\\quad d^k=-2",
      "conceptualExplanation": "Stesso esempio nelle tre pagine: punto e direzione restano fissi durante tutti i tentativi.",
      "purpose": "Fornire numeri alla figura qualitativa senza attribuirli alla fonte.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt40-beta",
          "explanation": "Ricalcola tutti i candidati moltiplicando per β; funzione, direzione e soglia fissata da c restano invariate."
        },
        {
          "controlId": "opt40-c",
          "explanation": "Cambia soltanto la soglia e quindi il primo candidato accettabile; curva del costo e direzione restano fisse."
        }
      ],
      "origin": "enrichment",
      "sourceFormulaIds": []
    },
    {
      "formulaId": "opt40-profile",
      "latex": "\\phi(\\gamma)=(1-2\\gamma)^2,\\quad A(\\gamma)=1-4c\\gamma",
      "conceptualExplanation": "La curva blu è il costo effettivo; la retta rossa è la soglia. Il test equivale a 0<γ<1−c in questo esempio.",
      "purpose": "Verificare anche rifiuti al bordo con un confronto analitico.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [
        "La tangente viola è 1−4γ. Il margine esatto φ−A è 4γ(γ−(1−c)).",
        "Con β=0.7,c=0.5: γ̄⁰=1 rifiutato, γ̄¹=0.7 rifiutato, γ̄²=0.49 accettato.",
        "Con β=c=0.5, γ=0.5 è un pareggio e viene rifiutato; il primo accettato è 0.25.",
        "Il minimo lungo la retta è γ=0.5; il test di Armijo non è una ricerca esatta del minimo."
      ],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt40-beta",
          "explanation": "Ricalcola tutti i candidati moltiplicando per β; funzione, direzione e soglia fissata da c restano invariate."
        },
        {
          "controlId": "opt40-c",
          "explanation": "Cambia soltanto la soglia e quindi il primo candidato accettabile; curva del costo e direzione restano fisse."
        }
      ],
      "origin": "enrichment",
      "sourceFormulaIds": []
    }
  ],
  "41": [
    {
      "formulaId": "opt41-conditions",
      "latex": "\\gamma^k\\to0,\\qquad\\sum_{t=0}^{\\infty}\\gamma^k=\\infty",
      "conceptualExplanation": "Il passo svanisce, ma la somma totale deve restare infinita. Sono due condizioni distinte.",
      "purpose": "Preservare l’enunciato, chiarendo gli indici nel calcolo.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt41-alpha",
          "explanation": "Cambia l’intera successione e le due somme parziali; il numero di campioni resta fisso."
        },
        {
          "controlId": "opt41-n",
          "explanation": "Estende la finestra finita senza cambiare α o la classificazione asintotica."
        }
      ],
      "origin": "source",
      "sourceFormulaIds": [
        "opt41-conditions"
      ]
    },
    {
      "formulaId": "opt41-constant",
      "latex": "\\gamma^k=\\gamma>0",
      "conceptualExplanation": "Il passo costante non svanisce. La sua efficacia richiede un valore adatto al problema.",
      "purpose": "Confrontare le famiglie di passi.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt41-alpha",
          "explanation": "Cambia l’intera successione e le due somme parziali; il numero di campioni resta fisso."
        },
        {
          "controlId": "opt41-n",
          "explanation": "Estende la finestra finita senza cambiare α o la classificazione asintotica."
        }
      ],
      "origin": "source",
      "sourceFormulaIds": [
        "opt41-constant"
      ]
    },
    {
      "formulaId": "opt41-squares",
      "latex": "\\sum_{t=0}^{\\infty}\\gamma^k=\\infty,\\qquad\\sum_{t=0}^{\\infty}(\\gamma^k)^2<\\infty",
      "conceptualExplanation": "La prima serie impone persistenza; la seconda limita l’accumulo dei quadrati. La fonte la presenta come scelta tipica.",
      "purpose": "Separare requisito e scelta più restrittiva.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt41-alpha",
          "explanation": "Cambia l’intera successione e le due somme parziali; il numero di campioni resta fisso."
        },
        {
          "controlId": "opt41-n",
          "explanation": "Estende la finestra finita senza cambiare α o la classificazione asintotica."
        }
      ],
      "origin": "source",
      "sourceFormulaIds": [
        "opt41-squares"
      ]
    },
    {
      "formulaId": "opt41-literal",
      "latex": "\\gamma^k=\\frac1{k^\\alpha},\\qquad\\frac12<\\alpha\\le1",
      "conceptualExplanation": "L’esempio letterale è definito per k≥1. Un indice iniziale finito non cambia il carattere delle serie.",
      "purpose": "Conservare la formula originale senza dividere per zero.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt41-alpha",
          "explanation": "Cambia l’intera successione e le due somme parziali; il numero di campioni resta fisso."
        },
        {
          "controlId": "opt41-n",
          "explanation": "Estende la finestra finita senza cambiare α o la classificazione asintotica."
        }
      ],
      "origin": "source",
      "sourceFormulaIds": [
        "opt41-literal"
      ]
    },
    {
      "formulaId": "opt41-shift",
      "latex": "\\gamma^k=\\frac1{(k+1)^\\alpha},\\qquad k=0,1,\\ldots",
      "conceptualExplanation": "Il traslato k+1 parte da zero senza cambiare il carattere delle serie.",
      "purpose": "Rendere l’esempio operativo sullo stesso indice delle iterazioni.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [
        "Si assume α>0 nel controllo: tutte le successioni mostrate tendono a zero.",
        "Gli indici t e k della fonte si riferiscono alla medesima serie: nei calcoli l’indice muto è k.",
        "Le somme parziali sono finite per ogni N: i verdetti sulle serie derivano dal criterio analitico delle serie p.",
        "α>1 dà passi con somma finita; α=1/2 dà quadrati con serie armonica divergente."
      ],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt41-alpha",
          "explanation": "Cambia l’intera successione e le due somme parziali; il numero di campioni resta fisso."
        },
        {
          "controlId": "opt41-n",
          "explanation": "Estende la finestra finita senza cambiare α o la classificazione asintotica."
        }
      ],
      "origin": "correction",
      "sourceFormulaIds": [
        "opt41-shift"
      ]
    }
  ],
  "42": [
    {
      "formulaId": "opt42-limit",
      "latex": "\\nabla\\ell(\\bar z)=0",
      "conceptualExplanation": "Con ℓ∈C¹, Armijo e 0<d₁I≤Dᵏ≤d₂I, ogni eventuale punto limite è stazionario.",
      "purpose": "Leggere la portata precisa della conclusione.",
      "symbolDefinitions": [],
      "assumptions": [
        "ℓ∈C¹; Armijo con parametri fissati interni ai domini; Dᵏ simmetrica con 0<d₁I≤Dᵏ≤d₂I."
      ],
      "optionalDetails": [
        "d₁ e d₂ sono costanti positive indipendenti da k. La conclusione non afferma che la sequenza intera converga."
      ],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt42-beta",
          "explanation": "Ricalcola tutte le ricerche di Armijo dal medesimo z⁰; mette in pausa e torna a k=0."
        }
      ],
      "origin": "source",
      "sourceFormulaIds": [
        "opt42-limit"
      ]
    },
    {
      "formulaId": "opt42-update",
      "latex": "z^{k+1}=z^k-\\gamma^kD^k\\nabla\\ell(z^k)",
      "conceptualExplanation": "La matrice cambia la direzione; Armijo sceglie il passo a ogni iterazione.",
      "purpose": "Connettere ipotesi e algoritmo.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt42-beta",
          "explanation": "Ricalcola tutte le ricerche di Armijo dal medesimo z⁰; mette in pausa e torna a k=0."
        }
      ],
      "origin": "source",
      "sourceFormulaIds": [
        "opt42-update"
      ]
    },
    {
      "formulaId": "opt42-bounds",
      "latex": "d_1I\\le D^k\\le d_2I,\\qquad d_1>0,\\ d_2>0",
      "conceptualExplanation": "Gli stessi d₁,d₂ valgono per ogni k: nessuna direzione può degenerare o crescere senza controllo.",
      "purpose": "Spiegare il significato uniforme delle disuguaglianze fra matrici.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt42-beta",
          "explanation": "Ricalcola tutte le ricerche di Armijo dal medesimo z⁰; mette in pausa e torna a k=0."
        }
      ],
      "origin": "source",
      "sourceFormulaIds": [
        "opt42-bounds"
      ]
    },
    {
      "formulaId": "opt42-example",
      "latex": "\\ell(z)=\\tfrac12(z_1^2+4z_2^2),\\quad z^0=(1.5,1),\\quad D^k=I",
      "conceptualExplanation": "Questo costo coercivo e strettamente convesso ha un unico minimo.",
      "purpose": "Mostrare un caso concreto senza promuoverlo a prova generale.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [
        "La direzione è −∇ℓ; β varia, c=0.5 e γ̄⁰=1 sono fissi.",
        "Ogni iterazione svolge una ricerca completa di Armijo: i tentativi interni non sono iterazioni k.",
        "Si visualizzano 25 iterati da k=0 a 24, non una dimostrazione del limite.",
        "Gradiente numericamente nullo: arresto dichiarato, nessun ciclo di test stretti a passo zero."
      ],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt42-beta",
          "explanation": "Ricalcola tutte le ricerche di Armijo dal medesimo z⁰; mette in pausa e torna a k=0."
        }
      ],
      "origin": "enrichment",
      "sourceFormulaIds": []
    }
  ],
  "43": [
    {
      "formulaId": "opt43-limit",
      "latex": "\\nabla\\ell(\\bar z)=0",
      "conceptualExplanation": "Con gradiente L-Lipschitz, 0<d₁I≤Dᵏ≤d₂I e passi adatti, ogni eventuale punto limite è stazionario.",
      "purpose": "Leggere un enunciato condizionale.",
      "symbolDefinitions": [],
      "assumptions": [
        "Gradiente globalmente L-Lipschitz; Dᵏ simmetrica uniformemente PD e limitata; uno dei due regimi di passo."
      ],
      "optionalDetails": [
        "Passi adatti: costante sufficientemente piccolo, oppure decrescente verso zero con somma infinita. d₁,d₂ sono costanti positive indipendenti da k. Una sequenza che va all’infinito può soddisfare le ipotesi senza avere punti limite."
      ],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt43-gamma",
          "explanation": "Cambia la ricorrenza soltanto nel regime costante. γ≥2 esce dalla garanzia illustrata per il quadratico."
        },
        {
          "controlId": "opt43-alpha",
          "explanation": "Cambia γᵏ=1/(k+1)^α soltanto nel regime decrescente; la somma è infinita in tutto il dominio."
        }
      ],
      "origin": "source",
      "sourceFormulaIds": [
        "opt43-limit"
      ]
    },
    {
      "formulaId": "opt43-lipschitz",
      "latex": "\\|\\nabla\\ell(z)-\\nabla\\ell(y)\\|\\le L\\|z-y\\|,\\quad\\forall z,y\\in\\mathbb R^d",
      "conceptualExplanation": "L controlla quanto può cambiare il gradiente su tutto il dominio.",
      "purpose": "Rendere concreta la regolarità richiesta.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt43-gamma",
          "explanation": "Cambia la ricorrenza soltanto nel regime costante. γ≥2 esce dalla garanzia illustrata per il quadratico."
        },
        {
          "controlId": "opt43-alpha",
          "explanation": "Cambia γᵏ=1/(k+1)^α soltanto nel regime decrescente; la somma è infinita in tutto il dominio."
        }
      ],
      "origin": "source",
      "sourceFormulaIds": [
        "opt43-lipschitz"
      ]
    },
    {
      "formulaId": "opt43-update",
      "latex": "z^{k+1}=z^k-\\gamma^kD^k\\nabla\\ell(z^k)",
      "conceptualExplanation": "Dᵏ e γᵏ hanno gli stessi ruoli delle pagine precedenti.",
      "purpose": "Preservare il metodo del corso.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt43-gamma",
          "explanation": "Cambia la ricorrenza soltanto nel regime costante. γ≥2 esce dalla garanzia illustrata per il quadratico."
        },
        {
          "controlId": "opt43-alpha",
          "explanation": "Cambia γᵏ=1/(k+1)^α soltanto nel regime decrescente; la somma è infinita in tutto il dominio."
        }
      ],
      "origin": "source",
      "sourceFormulaIds": [
        "opt43-update"
      ]
    },
    {
      "formulaId": "opt43-bounds",
      "latex": "d_1I\\le D^k\\le d_2I,\\qquad d_1>0,\\ d_2>0",
      "conceptualExplanation": "d₁,d₂ sono costanti comuni a tutte le iterazioni.",
      "purpose": "Distinguere positività puntuale da controllo uniforme.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt43-gamma",
          "explanation": "Cambia la ricorrenza soltanto nel regime costante. γ≥2 esce dalla garanzia illustrata per il quadratico."
        },
        {
          "controlId": "opt43-alpha",
          "explanation": "Cambia γᵏ=1/(k+1)^α soltanto nel regime decrescente; la somma è infinita in tutto il dominio."
        }
      ],
      "origin": "source",
      "sourceFormulaIds": [
        "opt43-bounds"
      ]
    },
    {
      "formulaId": "opt43-regimes",
      "latex": "\\gamma^k=\\gamma>0\\ \\text{sufficiently small},\\quad\\text{or}\\quad\\gamma^k\\to0,\\ \\sum_{t=0}^\\infty\\gamma^k=\\infty",
      "conceptualExplanation": "Il primo caso richiede una soglia adatta al costo; il secondo richiede persistenza, non solo passi a zero.",
      "purpose": "Non introdurre la sommabilità dei quadrati come nuova ipotesi della proposizione.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt43-gamma",
          "explanation": "Cambia la ricorrenza soltanto nel regime costante. γ≥2 esce dalla garanzia illustrata per il quadratico."
        },
        {
          "controlId": "opt43-alpha",
          "explanation": "Cambia γᵏ=1/(k+1)^α soltanto nel regime decrescente; la somma è infinita in tutto il dominio."
        }
      ],
      "origin": "source",
      "sourceFormulaIds": [
        "opt43-regimes"
      ]
    },
    {
      "formulaId": "opt43-linear-source",
      "latex": "\\min_{z\\in\\mathbb R^d}c^\\top z,\\qquad c\\in\\mathbb R^\\top",
      "conceptualExplanation": "L’esercizio è un costo lineare; il vettore dei coefficienti deve avere la dimensione della decisione. La scritta del tipo è conservata nel letterale.",
      "purpose": "Mantenere il refuso tipografico nei metadata senza un warning invasivo.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt43-gamma",
          "explanation": "Cambia la ricorrenza soltanto nel regime costante. γ≥2 esce dalla garanzia illustrata per il quadratico."
        },
        {
          "controlId": "opt43-alpha",
          "explanation": "Cambia γᵏ=1/(k+1)^α soltanto nel regime decrescente; la somma è infinita in tutto il dominio."
        }
      ],
      "origin": "source",
      "sourceFormulaIds": [
        "opt43-linear-source"
      ]
    },
    {
      "formulaId": "opt43-example",
      "latex": "\\ell_1(z)=\\tfrac12z^2,\\qquad\\ell_2(z)=z,\\qquad D^k=1,\\ z^0=1",
      "conceptualExplanation": "Il quadratico ha L=1 e minimo in zero; il lineare ha gradiente costante 1 e nessun minimo su R.",
      "purpose": "Verificare la remark con due costi espliciti.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [
        "Per il lineare il gradiente è Lipschitz con qualsiasi L>0: la differenza dei gradienti è zero.",
        "Con passi positivi e somma infinita, zᵏ=1−Σ_{j<k}γʲ→−∞ e non esistono punti limite in R.",
        "Nel quadratico, un passo costante 0<γ<2 dà zᵏ=(1−γ)^k; a 2 si alterna senza convergere, oltre 2 diverge.",
        "La soglia 2 appartiene a questo costo con D=1, non è una soglia universale.",
        "La scelta decrescente è γᵏ=1/(k+1)^α, 0.55≤α≤1. Nei calcoli l’indice muto delle somme è k."
      ],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt43-gamma",
          "explanation": "Cambia la ricorrenza soltanto nel regime costante. γ≥2 esce dalla garanzia illustrata per il quadratico."
        },
        {
          "controlId": "opt43-alpha",
          "explanation": "Cambia γᵏ=1/(k+1)^α soltanto nel regime decrescente; la somma è infinita in tutto il dominio."
        }
      ],
      "origin": "enrichment",
      "sourceFormulaIds": []
    }
  ],
  "44": [
    {
      "formulaId": "opt44-subsequence",
      "latex": "z^{k_p}\\to\\bar z\\quad\\Longrightarrow\\quad\\nabla\\ell(\\bar z)=0",
      "conceptualExplanation": "La conclusione vale per sottosuccessioni che convergono. La sequenza intera può avere più punti limite.",
      "purpose": "Usare il quantificatore corretto preservando la fonte.",
      "symbolDefinitions": [],
      "assumptions": [
        "Si applicano le ipotesi delle proposizioni precedenti; l’implicazione considera una sottosuccessione effettivamente convergente."
      ],
      "optionalDetails": [
        "La compattezza fornisce l’esistenza di sottosuccessioni convergenti, non la convergenza di ogni sottosuccessione.",
        "La coercività di un costo continuo rende compatti i sottolivelli e garantisce un minimo globale per Weierstrass.",
        "Per ottenere iterati limitati si usa anche il fatto che restino in un sottolivello limitato (Armijo o regime di discesa). Non attribuire questa proprietà alla sola parola coercività.",
        "Per costi non convessi, un limite stazionario può essere un massimo o una sella; il teorema non assicura un minimo."
      ],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt44-n",
          "explanation": "Estende la sequenza finita, senza cambiare i valori ±1 e i limiti delle sottosuccessioni."
        }
      ],
      "origin": "correction",
      "sourceFormulaIds": [
        "opt44-subsequence"
      ]
    },
    {
      "formulaId": "opt44-literal",
      "latex": "\\text{any subsequence }\\{z^{k_p}\\}\\text{ converges to some stationary point }\\bar z",
      "conceptualExplanation": "La remark stampata dice ‘any subsequence’. La companion conserva il letterale e precisa ‘ogni sottosuccessione convergente’.",
      "purpose": "Tracciare la modifica del quantificatore.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt44-n",
          "explanation": "Estende la sequenza finita, senza cambiare i valori ±1 e i limiti delle sottosuccessioni."
        }
      ],
      "origin": "source",
      "sourceFormulaIds": [
        "opt44-literal"
      ]
    },
    {
      "formulaId": "opt44-coercive",
      "latex": "\\lim_{\\|z\\|\\to\\infty}\\ell(z)=+\\infty",
      "conceptualExplanation": "Lontano dall’origine il costo cresce senza limite. Per un costo continuo questo impedisce ai suoi sottolivelli di estendersi all’infinito.",
      "purpose": "Spiegare il ruolo di coercività ed esistenza.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt44-n",
          "explanation": "Estende la sequenza finita, senza cambiare i valori ±1 e i limiti delle sottosuccessioni."
        }
      ],
      "origin": "source",
      "sourceFormulaIds": [
        "opt44-coercive"
      ]
    },
    {
      "formulaId": "opt44-alternatives",
      "latex": "\\ell(z^k)\\to-\\infty\\quad\\text{or}\\quad\\ell(z^k)\\to\\ell_\\infty\\in\\mathbb R,\\ \\nabla\\ell(z^k)\\to0",
      "conceptualExplanation": "La fonte distingue fuga del costo e avvicinamento alla stazionarietà. Sono conclusioni nel contesto dei metodi e delle loro ipotesi, non per successioni arbitrarie.",
      "purpose": "Non trasferire ipotesi algoritmiche alla sequenza alternante.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [
        "Questa è una riscrittura matematica delle frasi della remark: ℓ∞ è un nome aggiunto per il valore finito, non un simbolo stampato nella slide."
      ],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt44-n",
          "explanation": "Estende la sequenza finita, senza cambiare i valori ±1 e i limiti delle sottosuccessioni."
        }
      ],
      "origin": "enrichment",
      "sourceFormulaIds": []
    },
    {
      "formulaId": "opt44-example",
      "latex": "z^k=(-1)^k,\\quad z^{2p}=1,\\quad z^{2p+1}=-1",
      "conceptualExplanation": "La sequenza completa alterna; i campioni pari e dispari sono due sottosuccessioni costanti con limiti diversi.",
      "purpose": "Esplicitare la figura della fonte.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [
        "Questa è un’illustrazione di successioni, non un’esecuzione certificata di un gradient method sotto le ipotesi delle proposizioni.",
        "Si include k=0 per chiarezza del selettore; la figura usa n>0. Il comportamento asintotico non cambia.",
        "N finito mostra il pattern; l’identità esatta (−1)^k dimostra i due limiti."
      ],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt44-n",
          "explanation": "Estende la sequenza finita, senza cambiare i valori ±1 e i limiti delle sottosuccessioni."
        }
      ],
      "origin": "enrichment",
      "sourceFormulaIds": []
    }
  ],
  "45": [
    {
      "formulaId": "opt45-subsequence",
      "latex": "z^{k_p}\\to\\bar z\\quad\\Longrightarrow\\quad\\nabla\\ell(\\bar z)=0",
      "conceptualExplanation": "La conclusione vale per sottosuccessioni che convergono. La sequenza intera può avere più punti limite.",
      "purpose": "Usare il quantificatore corretto preservando la fonte.",
      "symbolDefinitions": [],
      "assumptions": [
        "Si applicano le ipotesi delle proposizioni precedenti; l’implicazione considera una sottosuccessione effettivamente convergente."
      ],
      "optionalDetails": [
        "La compattezza fornisce l’esistenza di sottosuccessioni convergenti, non la convergenza di ogni sottosuccessione.",
        "La coercività di un costo continuo rende compatti i sottolivelli e garantisce un minimo globale per Weierstrass.",
        "Per ottenere iterati limitati si usa anche il fatto che restino in un sottolivello limitato (Armijo o regime di discesa). Non attribuire questa proprietà alla sola parola coercività.",
        "Per costi non convessi, un limite stazionario può essere un massimo o una sella; il teorema non assicura un minimo."
      ],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt45-a",
          "explanation": "Muove il punto e rivaluta costo/gradiente; funzione, minimi noti e proprietà restano fissi."
        }
      ],
      "origin": "correction",
      "sourceFormulaIds": [
        "opt45-subsequence"
      ]
    },
    {
      "formulaId": "opt45-literal",
      "latex": "\\text{any subsequence }\\{z^{k_p}\\}\\text{ converges to some stationary point }\\bar z",
      "conceptualExplanation": "La remark stampata dice ‘any subsequence’. La companion conserva il letterale e precisa ‘ogni sottosuccessione convergente’.",
      "purpose": "Tracciare la modifica del quantificatore.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt45-a",
          "explanation": "Muove il punto e rivaluta costo/gradiente; funzione, minimi noti e proprietà restano fissi."
        }
      ],
      "origin": "source",
      "sourceFormulaIds": [
        "opt45-literal"
      ]
    },
    {
      "formulaId": "opt45-coercive",
      "latex": "\\lim_{\\|z\\|\\to\\infty}\\ell(z)=+\\infty",
      "conceptualExplanation": "Lontano dall’origine il costo cresce senza limite. Per un costo continuo questo impedisce ai suoi sottolivelli di estendersi all’infinito.",
      "purpose": "Spiegare il ruolo di coercività ed esistenza.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt45-a",
          "explanation": "Muove il punto e rivaluta costo/gradiente; funzione, minimi noti e proprietà restano fissi."
        }
      ],
      "origin": "source",
      "sourceFormulaIds": [
        "opt45-coercive"
      ]
    },
    {
      "formulaId": "opt45-alternatives",
      "latex": "\\ell(z^k)\\to-\\infty\\quad\\text{or}\\quad\\ell(z^k)\\to\\ell_\\infty\\in\\mathbb R,\\ \\nabla\\ell(z^k)\\to0",
      "conceptualExplanation": "La fonte distingue fuga del costo e avvicinamento alla stazionarietà. Sono conclusioni nel contesto dei metodi e delle loro ipotesi, non per successioni arbitrarie.",
      "purpose": "Non trasferire ipotesi algoritmiche alla sequenza alternante.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [
        "Questa è una riscrittura matematica delle frasi della remark: ℓ∞ è un nome aggiunto per il valore finito, non un simbolo stampato nella slide."
      ],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt45-a",
          "explanation": "Muove il punto e rivaluta costo/gradiente; funzione, minimi noti e proprietà restano fissi."
        }
      ],
      "origin": "enrichment",
      "sourceFormulaIds": []
    },
    {
      "formulaId": "opt45-convex",
      "latex": "\\nabla\\ell(\\bar z)=0\\quad\\Longrightarrow\\quad\\bar z\\in\\operatorname*{arg\\,min}_{z\\in\\mathbb R^d}\\ell(z)",
      "conceptualExplanation": "Per ℓ convessa e differenziabile, stazionarietà è sufficiente alla globalità. Coercività aggiunge esistenza, non unicità.",
      "purpose": "Leggere la nuova remark della progressiva.",
      "symbolDefinitions": [],
      "assumptions": [
        "ℓ convessa e differenziabile; la remark considera anche coercività."
      ],
      "optionalDetails": [
        "L’implicazione con argmin rende esplicita la remark testuale; la fonte non stampa questa formula aggiuntiva."
      ],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt45-a",
          "explanation": "Muove il punto e rivaluta costo/gradiente; funzione, minimi noti e proprietà restano fissi."
        }
      ],
      "origin": "enrichment",
      "sourceFormulaIds": []
    },
    {
      "formulaId": "opt45-example",
      "latex": "\\ell_1(z)=\\tfrac12z^2,\\quad\\ell_2(z)=\\tfrac14(z^2-1)^2,\\quad\\ell_3(z)=e^{-z}",
      "conceptualExplanation": "Tre costi separano le proprietà: quadratico convesso coercivo, doppia valle coerciva non convessa, esponenziale convessa non coerciva.",
      "purpose": "Evitare di confondere esistenza e classificazione dello stazionario.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [
        "ℓ₁ ha minimo globale unico 0; ℓ₂ ha minimi globali ±1 e massimo locale 0.",
        "ℓ₃ ha infimo 0 non raggiunto: non ha punti stazionari né minimo globale su R.",
        "Il selettore cambia il problema: gli intervalli verticali sono dichiarati per funzione; muovere a non cambia alcuna scala.",
        "Il grafico valuta un punto, non implementa un algoritmo né ne garantisce la convergenza."
      ],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt45-a",
          "explanation": "Muove il punto e rivaluta costo/gradiente; funzione, minimi noti e proprietà restano fissi."
        }
      ],
      "origin": "enrichment",
      "sourceFormulaIds": []
    }
  ],
  "46": [
    {
      "formulaId": "opt46-update",
      "latex": "z^{k+1}=z^k-\\gamma^k(Qz^k+q)",
      "conceptualExplanation": "Qzᵏ+q è il gradiente del QP. Il passo scala questo vettore a ogni aggiornamento.",
      "purpose": "Collegare dati del QP e algoritmo.",
      "symbolDefinitions": [],
      "assumptions": [
        "Q simmetrica semidefinita positiva; un passo adatto è necessario per la convergenza."
      ],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt46-lambda",
          "explanation": "Cambia Q e il gradiente, ricalcola dal medesimo z⁰; mette in pausa e torna a k=0."
        },
        {
          "controlId": "opt46-b",
          "explanation": "Cambia q e il minimo/deriva; conserva Q e ricalcola il percorso da z⁰."
        },
        {
          "controlId": "opt46-gamma",
          "explanation": "Cambia la ricorrenza mantenendo costo e z⁰; nessuna correzione nascosta di passi instabili."
        }
      ],
      "origin": "source",
      "sourceFormulaIds": [
        "opt46-update"
      ]
    },
    {
      "formulaId": "opt46-qp",
      "latex": "\\min_{z\\in\\mathbb R^d}\\tfrac12z^\\top Qz+q^\\top z,\\qquad Q=Q^\\top\\ge0",
      "conceptualExplanation": "La simmetria dà il gradiente Qz+q; la semidefinita positività dà convessità, non automaticamente un minimo.",
      "purpose": "Mantenere il caso PSD della fonte.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt46-lambda",
          "explanation": "Cambia Q e il gradiente, ricalcola dal medesimo z⁰; mette in pausa e torna a k=0."
        },
        {
          "controlId": "opt46-b",
          "explanation": "Cambia q e il minimo/deriva; conserva Q e ricalcola il percorso da z⁰."
        },
        {
          "controlId": "opt46-gamma",
          "explanation": "Cambia la ricorrenza mantenendo costo e z⁰; nessuna correzione nascosta di passi instabili."
        }
      ],
      "origin": "source",
      "sourceFormulaIds": [
        "opt46-qp"
      ]
    },
    {
      "formulaId": "opt46-steepest",
      "latex": "z^{k+1}=z^k-\\gamma^k\\nabla\\ell(z^k)",
      "conceptualExplanation": "L’espressione generale resta la stessa: cambia solo la disponibilità esplicita del gradiente.",
      "purpose": "Leggere la sostituzione della formula.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt46-lambda",
          "explanation": "Cambia Q e il gradiente, ricalcola dal medesimo z⁰; mette in pausa e torna a k=0."
        },
        {
          "controlId": "opt46-b",
          "explanation": "Cambia q e il minimo/deriva; conserva Q e ricalcola il percorso da z⁰."
        },
        {
          "controlId": "opt46-gamma",
          "explanation": "Cambia la ricorrenza mantenendo costo e z⁰; nessuna correzione nascosta di passi instabili."
        }
      ],
      "origin": "source",
      "sourceFormulaIds": [
        "opt46-steepest"
      ]
    },
    {
      "formulaId": "opt46-example",
      "latex": "Q=\\operatorname{diag}(1,\\lambda),\\quad q=(0,b)^\\top,\\quad z^0=(1.5,1)^\\top",
      "conceptualExplanation": "λ cambia curvatura; b può creare deriva nella direzione piatta.",
      "purpose": "Esplorare positività e compatibilità senza omettere il caso singolare.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [
        "λ>0: unico minimo (0,−b/λ). λ=0,b=0: tutta la retta z₁=0 è minima. λ=0,b≠0: nessun minimo, costo illimitato inferiormente.",
        "Con λ>0 e componenti attive, il passo costante 0<γ<2/max(1,λ) è sufficiente alla convergenza. Al bordo possono apparire oscillazioni; oltre il bordo instabilità.",
        "Per λ=0,b=0 la componente piatta resta quella iniziale: non sostituirla arbitrariamente con zero.",
        "Scale fisse: z₁,z₂∈[−2,2], costo∈[−2,16]; punti fuori ritaglio dichiarati e valori conservati senza clamp.",
        "Con λ molto piccolo non nullo il minimo −b/λ può essere enorme: non trattarlo come λ=0 con una tolleranza.",
        "k conta aggiornamenti, non tempo fisico; la simulazione seleziona 21 campioni calcolati."
      ],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt46-lambda",
          "explanation": "Cambia Q e il gradiente, ricalcola dal medesimo z⁰; mette in pausa e torna a k=0."
        },
        {
          "controlId": "opt46-b",
          "explanation": "Cambia q e il minimo/deriva; conserva Q e ricalcola il percorso da z⁰."
        },
        {
          "controlId": "opt46-gamma",
          "explanation": "Cambia la ricorrenza mantenendo costo e z⁰; nessuna correzione nascosta di passi instabili."
        }
      ],
      "origin": "enrichment",
      "sourceFormulaIds": []
    }
  ]
} as const satisfies Readonly<Record<number,readonly FormulaExplanation[]>>;
