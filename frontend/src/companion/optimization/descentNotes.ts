import type {FormulaExplanation} from '../../components/ExplainedEquation';
export const descentFormulaNotes = {
  "26": [],
  "27": [
    {
      "formulaId": "opt27-descent",
      "latex": "\\ell(z^{k+1})<\\ell(z^k),\\quad k=1,2,\\ldots",
      "conceptualExplanation": "La discesa confronta i costi successivi; da sola non garantisce convergenza.",
      "purpose": "Separare diminuzione del costo e raggiungimento del minimo.",
      "symbolDefinitions": [
        {
          "symbol": "z^k",
          "meaning": "Stima vettoriale all’iterazione k, non potenza o stato al tempo k."
        }
      ],
      "assumptions": [],
      "optionalDetails": [
        "La fonte indicizza il confronto da k=1. Il visualizzatore mostra anche il primo aggiornamento da z⁰: scelta operativa dichiarata, senza modificare il letterale.",
        "Una sequenza decrescente di costi può avere infimo non raggiunto; per esempio exp(−k) lungo z^k=−k per ℓ(z)=exp(z)."
      ],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt27-gamma",
          "explanation": "Ricalcola il percorso dal medesimo z⁰ e mette in pausa a k=0; costo e minimo restano fissi."
        }
      ],
      "origin": "source",
      "sourceFormulaIds": [
        "opt27-descent"
      ]
    },
    {
      "formulaId": "opt27-example",
      "latex": "\\ell(z)=\\frac12(z_1^2+4z_2^2),\\quad z^0=(1.5,1)^T",
      "conceptualExplanation": "Per questa quadratica, i passi selezionabili riducono il costo verso zero.",
      "purpose": "Dare un percorso numerico ai livelli qualitativi della fonte.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [
        "Gradiente (z₁,4z₂)ᵀ; aggiornamento z₁^{k+1}=(1−γ)z₁^k, z₂^{k+1}=(1−4γ)z₂^k.",
        "Le due curvature sono 1 e 4; 0<γ<1/2 contrae entrambe le componenti. La garanzia si giustifica sul modello, non dai soli punti del grafico."
      ],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt27-gamma",
          "explanation": "Ricalcola il percorso dal medesimo z⁰ e mette in pausa a k=0; costo e minimo restano fissi."
        }
      ],
      "origin": "enrichment",
      "sourceFormulaIds": []
    }
  ],
  "28": [
    {
      "formulaId": "opt28-update",
      "latex": "z^{k+1}=z^k+\\gamma^k d^k,\\quad k=1,2,\\ldots",
      "conceptualExplanation": "La direzione stabilisce verso dove andare; il passo positivo ne scala lo spostamento. Occorre scegliere entrambi per ottenere una diminuzione effettiva.",
      "purpose": "Leggere i due ingredienti dell’aggiornamento.",
      "symbolDefinitions": [
        {
          "symbol": "\\gamma^k",
          "meaning": "Passo scalare positivo."
        },
        {
          "symbol": "d^k",
          "meaning": "Vettore direzione nello spazio delle decisioni."
        }
      ],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt28-angle",
          "explanation": "Ruota la direzione unitaria, ricostruisce profilo e pendenza; punto corrente e costo restano fissi."
        },
        {
          "controlId": "opt28-gamma",
          "explanation": "Muove solo il punto sul profilo e aggiorna il costo finale; direzione e curva restano fisse. Zero esplora il confine senza aggiornamento."
        }
      ],
      "origin": "source",
      "sourceFormulaIds": [
        "opt28-update"
      ]
    },
    {
      "formulaId": "opt28-profile",
      "latex": "\\varphi(\\gamma)=\\ell(z^k+\\gamma d^k),\\quad\\varphi'(0)=\\nabla\\ell(z^k)^T d^k",
      "conceptualExplanation": "Il profilo confronta il costo lungo una direzione fissata. Una pendenza iniziale negativa è locale; il punto scelto deve anche stare sotto il costo iniziale.",
      "purpose": "Rendere leggibile la ricerca lungo una retta.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt28-angle",
          "explanation": "Ruota la direzione unitaria, ricostruisce profilo e pendenza; punto corrente e costo restano fissi."
        },
        {
          "controlId": "opt28-gamma",
          "explanation": "Muove solo il punto sul profilo e aggiorna il costo finale; direzione e curva restano fisse. Zero esplora il confine senza aggiornamento."
        }
      ],
      "origin": "enrichment",
      "sourceFormulaIds": []
    },
    {
      "formulaId": "opt28-example",
      "latex": "\\ell(z)=\\frac12(z_1^2+4z_2^2),\\quad z^k=(1,0.5)^T,\\quad\\|d^k\\|=1",
      "conceptualExplanation": "Nell’esempio ψ ruota il gradiente negativo normalizzato. La curva esatta e la tangente cambiano con la direzione, mentre γ seleziona un punto sulla curva.",
      "purpose": "Isolare direzione e passo nello stesso problema numerico.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [
        "ψ=0 allinea d al gradiente negativo; ψ=±90° dà una direzione ortogonale e pendenza nulla.",
        "Il modello esatto è φ(γ)=1+sγ+cγ²/2, con s=∇ℓᵀd e c=dᵀdiag(1,4)d>0. Se s<0, diminuisce per 0<γ<−2s/c.",
        "La fonte non specifica ancora un criterio numerico di sufficiente diminuzione: non anticipare una regola Armijo."
      ],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt28-angle",
          "explanation": "Ruota la direzione unitaria, ricostruisce profilo e pendenza; punto corrente e costo restano fissi."
        },
        {
          "controlId": "opt28-gamma",
          "explanation": "Muove solo il punto sul profilo e aggiorna il costo finale; direzione e curva restano fisse. Zero esplora il confine senza aggiornamento."
        }
      ],
      "origin": "enrichment",
      "sourceFormulaIds": []
    }
  ],
  "29": [
    {
      "formulaId": "opt29-update",
      "latex": "z^{k+1}=z^k-\\gamma^k\\nabla\\ell(z^k)",
      "conceptualExplanation": "Per un costo differenziabile e gradiente non nullo, la direzione opposta al gradiente dà un contributo lineare negativo al costo.",
      "purpose": "Motivare la direzione di gradiente.",
      "symbolDefinitions": [],
      "assumptions": [
        "ℓ differenziabile nel punto corrente; ∇ℓ(z^k)≠0; γ^k>0 sufficientemente piccolo."
      ],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt29-a",
          "explanation": "Cambia gradiente e scala del profilo, mantenendo fisso il costo ℓ=z²/2."
        },
        {
          "controlId": "opt29-gamma",
          "explanation": "Seleziona il nuovo punto a(1−γ) e aggiorna contributo lineare, resto e variazione esatta."
        }
      ],
      "origin": "source",
      "sourceFormulaIds": [
        "opt29-update"
      ]
    },
    {
      "formulaId": "opt29-taylor",
      "latex": "\\ell(z^{k+1})=\\ell(z^k)+\\nabla\\ell(z^k)^T(z^{k+1}-z^k)+o(\\|z^{k+1}-z^k\\|)=\\ell(z^k)-\\gamma^k\\|\\nabla\\ell(z^k)\\|^2+o(\\gamma^k)",
      "conceptualExplanation": "Il termine lineare è negativo se il gradiente non è zero; il resto è di ordine inferiore al passo quando questo tende a zero, a punto corrente fissato.",
      "purpose": "Distinguere sviluppo locale e costo esatto del passo.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt29-a",
          "explanation": "Cambia gradiente e scala del profilo, mantenendo fisso il costo ℓ=z²/2."
        },
        {
          "controlId": "opt29-gamma",
          "explanation": "Seleziona il nuovo punto a(1−γ) e aggiorna contributo lineare, resto e variazione esatta."
        }
      ],
      "origin": "source",
      "sourceFormulaIds": [
        "opt29-taylor"
      ]
    },
    {
      "formulaId": "opt29-example",
      "latex": "\\ell(z)=\\frac12z^2,\\quad z^k=a,\\quad\\Delta\\ell=-\\gamma a^2+\\frac12\\gamma^2a^2",
      "conceptualExplanation": "Il resto è esattamente il termine quadratico positivo. Per a≠0 il costo diminuisce solo con 0<γ<2; a γ=2 pareggia, oltre aumenta.",
      "purpose": "Verificare numericamente il peso del resto.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [
        "La soglia 2 vale per questa quadratica con curvatura uno, non per ogni costo differenziabile.",
        "A a=0 la fonte non si applica alla discesa stretta: il gradiente è nullo e ogni passo lascia il punto fermo."
      ],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt29-a",
          "explanation": "Cambia gradiente e scala del profilo, mantenendo fisso il costo ℓ=z²/2."
        },
        {
          "controlId": "opt29-gamma",
          "explanation": "Seleziona il nuovo punto a(1−γ) e aggiorna contributo lineare, resto e variazione esatta."
        }
      ],
      "origin": "enrichment",
      "sourceFormulaIds": []
    }
  ],
  "30": [
    {
      "formulaId": "opt30-direction",
      "latex": "\\nabla\\ell(z^k)^T d^k<0",
      "conceptualExplanation": "Il prodotto è la pendenza iniziale lungo d. Un angolo ottuso rispetto al gradiente dà discesa per passi abbastanza piccoli, non per qualsiasi lunghezza.",
      "purpose": "Riconoscere una direzione di discesa senza imporre che sia il gradiente negativo.",
      "symbolDefinitions": [],
      "assumptions": [
        "ℓ differenziabile; gradiente non nullo; confronto locale."
      ],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt30-angle",
          "explanation": "Ruota d e aggiorna pendenza e punto d’arrivo, conservando norma unitaria, costo e punto iniziale."
        },
        {
          "controlId": "opt30-gamma",
          "explanation": "Scala solo lo spostamento arancio e aggiorna il costo nuovo; direzione e classificazione locale restano fisse."
        }
      ],
      "origin": "source",
      "sourceFormulaIds": [
        "opt30-direction"
      ]
    },
    {
      "formulaId": "opt30-update",
      "latex": "z^{k+1}=z^k+\\gamma^k d^k",
      "conceptualExplanation": "Il parametro positivo γ scala la direzione scelta. La condizione locale sulla direzione deve essere seguita dalla scelta del passo.",
      "purpose": "Tenere separate classificazione della direzione e verifica dell’aggiornamento.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt30-angle",
          "explanation": "Ruota d e aggiorna pendenza e punto d’arrivo, conservando norma unitaria, costo e punto iniziale."
        },
        {
          "controlId": "opt30-gamma",
          "explanation": "Scala solo lo spostamento arancio e aggiorna il costo nuovo; direzione e classificazione locale restano fisse."
        }
      ],
      "origin": "source",
      "sourceFormulaIds": [
        "opt30-update"
      ]
    },
    {
      "formulaId": "opt30-gradient",
      "latex": "z^{k+1}=z^k-\\gamma^k\\nabla\\ell(z^k)",
      "conceptualExplanation": "Il gradiente negativo è il caso particolare da cui parte la generalizzazione, non l’unica direzione ammessa.",
      "purpose": "Ricollegare questa pagina alla precedente.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt30-angle",
          "explanation": "Ruota d e aggiorna pendenza e punto d’arrivo, conservando norma unitaria, costo e punto iniziale."
        },
        {
          "controlId": "opt30-gamma",
          "explanation": "Scala solo lo spostamento arancio e aggiorna il costo nuovo; direzione e classificazione locale restano fisse."
        }
      ],
      "origin": "source",
      "sourceFormulaIds": [
        "opt30-gradient"
      ]
    },
    {
      "formulaId": "opt30-example",
      "latex": "\\ell(z)=\\frac12(z_1^2+4z_2^2),\\quad z^k=(1,0.5)^T",
      "conceptualExplanation": "ψ ruota una direzione unitaria rispetto al gradiente negativo. A ±90° è ortogonale; oltre diventa una direzione di salita.",
      "purpose": "Confrontare la geometria dei vettori con la variazione esatta di costo.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [
        "Il vettore rosso è g/||g||, quello viola è d unitario. La freccia arancio rappresenta γd, non il gradiente.",
        "La classificazione a ±90° è calcolata analiticamente, non dal segno di un residuo di arrotondamento."
      ],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt30-angle",
          "explanation": "Ruota d e aggiorna pendenza e punto d’arrivo, conservando norma unitaria, costo e punto iniziale."
        },
        {
          "controlId": "opt30-gamma",
          "explanation": "Scala solo lo spostamento arancio e aggiorna il costo nuovo; direzione e classificazione locale restano fisse."
        }
      ],
      "origin": "enrichment",
      "sourceFormulaIds": []
    }
  ],
  "31": [
    {
      "formulaId": "opt31-descent",
      "latex": "-\\nabla\\ell(z^k)^T D^k\\nabla\\ell(z^k)<0",
      "conceptualExplanation": "La forma quadratica è positiva per ogni gradiente non nullo; il segno meno dà discesa. A gradiente zero il prodotto è zero, non strettamente negativo.",
      "purpose": "Giustificare la direzione con la positività definita.",
      "symbolDefinitions": [],
      "assumptions": [
        "D^k simmetrica positiva definita; ∇ℓ(z^k)≠0, come nel contesto di pagina 29."
      ],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt31-s",
          "explanation": "Cambia la matrice, direzione e pendenza; rotazione, punto corrente e costo restano fissi."
        },
        {
          "controlId": "opt31-beta",
          "explanation": "Ruota gli assi di D senza cambiarne gli autovalori; aggiorna direzione e passo."
        }
      ],
      "origin": "source",
      "sourceFormulaIds": [
        "opt31-descent"
      ]
    },
    {
      "formulaId": "opt31-update",
      "latex": "z^{k+1}=z^k-\\gamma^kD^k\\nabla\\ell(z^k),\\quad k=1,2,\\ldots",
      "conceptualExplanation": "Dᵏ cambia la geometria della direzione; γᵏ ne decide la scala effettiva nell’aggiornamento.",
      "purpose": "Distinguere trasformazione del gradiente e passo.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt31-s",
          "explanation": "Cambia la matrice, direzione e pendenza; rotazione, punto corrente e costo restano fissi."
        },
        {
          "controlId": "opt31-beta",
          "explanation": "Ruota gli assi di D senza cambiarne gli autovalori; aggiorna direzione e passo."
        }
      ],
      "origin": "source",
      "sourceFormulaIds": [
        "opt31-update"
      ]
    },
    {
      "formulaId": "opt31-example",
      "latex": "D^k=R_\\beta\\begin{bmatrix}1&0\\\\0&s\\end{bmatrix}R_\\beta^T,\\quad s>0",
      "conceptualExplanation": "La rotazione cambia gli assi di D senza cambiarne gli autovalori 1 e s. Modificare s ne cambia l’anisotropia; la matrice resta positiva definita.",
      "purpose": "Costruire una famiglia controllabile di matrici valide.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [
        "Rβ=[[cosβ,−sinβ],[sinβ,cosβ]]; costo (z₁²+4z₂²)/2, punto iniziale (1,0.5) oppure origine.",
        "Il grafico usa d/||d|| per mostrare l’orientamento; lo spostamento effettivo è 0.2d e usa la norma originale.",
        "Il passo 0.2 diminuisce il costo per questa famiglia (autovalori D≤2 e L=4); non è una soglia generale della fonte."
      ],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt31-s",
          "explanation": "Cambia la matrice, direzione e pendenza; rotazione, punto corrente e costo restano fissi."
        },
        {
          "controlId": "opt31-beta",
          "explanation": "Ruota gli assi di D senza cambiarne gli autovalori; aggiorna direzione e passo."
        }
      ],
      "origin": "enrichment",
      "sourceFormulaIds": []
    }
  ],
  "32": [
    {
      "formulaId": "opt32-identity",
      "latex": "D^k=I_d",
      "conceptualExplanation": "Si segue il gradiente negativo senza riscalarlo secondo la curvatura. Anche con una direzione valida, un passo unitario può essere eccessivo.",
      "purpose": "Identificare steepest descent nel quadro matriciale.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt32-gamma",
          "explanation": "Scala l’unico aggiornamento per il metodo selezionato; costo e punto iniziale restano identici."
        },
        {
          "controlId": "opt32-h",
          "explanation": "Solo nel metodo discretizzato: ricostruisce H_h e direzione. Non è il passo γ dell’algoritmo; nascosto negli altri metodi."
        }
      ],
      "origin": "source",
      "sourceFormulaIds": [
        "opt32-identity"
      ]
    },
    {
      "formulaId": "opt32-newton",
      "latex": "D^k=\\big(\\nabla^2\\ell(z^k)\\big)^{-1}",
      "conceptualExplanation": "La curvatura locale riscalibra il gradiente. Occorre Hessiana positiva definita per ottenere la direzione di discesa descritta nella pagina precedente.",
      "purpose": "Identificare Newton e le sue ipotesi.",
      "symbolDefinitions": [],
      "assumptions": [
        "Hessiana esistente e positiva definita al punto corrente; γ^k=1 per Newton puro."
      ],
      "optionalDetails": [
        "La fonte parla di rapidità asintotica tipica. Non basta l’invertibilità per dare una direzione di discesa, né la positività locale garantisce un passo pieno globalmente valido."
      ],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt32-gamma",
          "explanation": "Scala l’unico aggiornamento per il metodo selezionato; costo e punto iniziale restano identici."
        },
        {
          "controlId": "opt32-h",
          "explanation": "Solo nel metodo discretizzato: ricostruisce H_h e direzione. Non è il passo γ dell’algoritmo; nascosto negli altri metodi."
        }
      ],
      "origin": "source",
      "sourceFormulaIds": [
        "opt32-newton"
      ]
    },
    {
      "formulaId": "opt32-finite",
      "latex": "D^k=\\big(H(z^k)\\big)^{-1}",
      "conceptualExplanation": "Il metodo discretizzato sostituisce la Hessiana con una stima simmetrica positiva definita da differenze finite. È questa matrice che viene usata nel sistema lineare.",
      "purpose": "Separare Hessiana esatta e approssimazione, senza chiamare questa procedura quasi-Newton.",
      "symbolDefinitions": [],
      "assumptions": [
        "H(z^k) simmetrica positiva definita, non una matrice numerica arbitraria."
      ],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt32-gamma",
          "explanation": "Scala l’unico aggiornamento per il metodo selezionato; costo e punto iniziale restano identici."
        },
        {
          "controlId": "opt32-h",
          "explanation": "Solo nel metodo discretizzato: ricostruisce H_h e direzione. Non è il passo γ dell’algoritmo; nascosto negli altri metodi."
        }
      ],
      "origin": "source",
      "sourceFormulaIds": [
        "opt32-finite"
      ]
    },
    {
      "formulaId": "opt32-example",
      "latex": "\\ell(z)=\\frac12(z_1^2+4z_2^2)+\\frac14z_1^4,\\quad z^k=(0.8,0.6)^T",
      "conceptualExplanation": "Un solo aggiornamento: stesso costo, punto iniziale e passo γ nei tre metodi.",
      "purpose": "Evitare un confronto fra problemi o passi diversi.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt32-gamma",
          "explanation": "Scala l’unico aggiornamento per il metodo selezionato; costo e punto iniziale restano identici."
        },
        {
          "controlId": "opt32-h",
          "explanation": "Solo nel metodo discretizzato: ricostruisce H_h e direzione. Non è il passo γ dell’algoritmo; nascosto negli altri metodi."
        }
      ],
      "origin": "enrichment",
      "sourceFormulaIds": []
    },
    {
      "formulaId": "opt32-fd-model",
      "latex": "[H_h(z)]_{ii}=\\frac{\\ell(z+he_i)-2\\ell(z)+\\ell(z-he_i)}{h^2}",
      "conceptualExplanation": "Si valuta il costo in tre punti per stimare una derivata seconda. Nel quartico, la prima diagonale è 1+3z₁²+h²/2; la seconda è 4 e le miste sono nulle.",
      "purpose": "Rendere verificabile la stima numerica realmente usata dal laboratorio.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [
        "Le miste sono calcolate con (ℓ(z+he₁+he₂)−ℓ(z+he₁−he₂)−ℓ(z−he₁+he₂)+ℓ(z−he₁−he₂))/(4h²).",
        "Per questo modello H_h è positiva definita per ogni h>0. In generale una differenza finita non ne garantisce la positività.",
        "Il calcolo risolve un sistema lineare SPD: non applica un’inversa singolare e non finge un errore h identicamente nullo."
      ],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt32-gamma",
          "explanation": "Scala l’unico aggiornamento per il metodo selezionato; costo e punto iniziale restano identici."
        },
        {
          "controlId": "opt32-h",
          "explanation": "Solo nel metodo discretizzato: ricostruisce H_h e direzione. Non è il passo γ dell’algoritmo; nascosto negli altri metodi."
        }
      ],
      "origin": "enrichment",
      "sourceFormulaIds": []
    }
  ],
  "33": [
    {
      "formulaId": "opt33-normalized",
      "latex": "d^k=-\\frac{\\nabla\\ell(z^k)}{\\|\\nabla\\ell(z^k)\\|}",
      "conceptualExplanation": "Con gradiente non nullo, questa è la direzione unitaria di pendenza minima. La normalizzazione serve al confronto; il passo resta da scegliere.",
      "purpose": "Dare un significato preciso a steepest.",
      "symbolDefinitions": [],
      "assumptions": [
        "Norma euclidea; ∇ℓ(z^k)≠0."
      ],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt33-r",
          "explanation": "Muove il punto corrente (r,0) e scala tutte le pendenze; il cerchio delle direzioni resta unitario."
        },
        {
          "controlId": "opt33-angle",
          "explanation": "Ruota solo il vettore unitario di prova e aggiorna pendenza e scarto dal minimo; g resta fisso."
        }
      ],
      "origin": "source",
      "sourceFormulaIds": [
        "opt33-normalized"
      ]
    },
    {
      "formulaId": "opt33-update",
      "latex": "z^{k+1}=z^k-\\gamma^k\\nabla\\ell(z^k)",
      "conceptualExplanation": "Nell’aggiornamento della fonte si usa il gradiente non normalizzato. Il passo scala anche la sua norma, mentre il confronto geometrico usa norma unitaria.",
      "purpose": "Distinguere la proprietà delle direzioni dalla lunghezza dell’aggiornamento.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt33-r",
          "explanation": "Muove il punto corrente (r,0) e scala tutte le pendenze; il cerchio delle direzioni resta unitario."
        },
        {
          "controlId": "opt33-angle",
          "explanation": "Ruota solo il vettore unitario di prova e aggiorna pendenza e scarto dal minimo; g resta fisso."
        }
      ],
      "origin": "source",
      "sourceFormulaIds": [
        "opt33-update"
      ]
    },
    {
      "formulaId": "opt33-minimum",
      "latex": "\\min_{\\|d\\|=1}\\nabla\\ell(z^k)^T d=-\\|\\nabla\\ell(z^k)\\|",
      "conceptualExplanation": "Cauchy–Schwarz dà una pendenza non inferiore a meno la norma del gradiente; la direzione opposta la raggiunge. A gradiente zero tutte le direzioni pareggiano.",
      "purpose": "Giustificare analiticamente il minimo della pendenza.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt33-r",
          "explanation": "Muove il punto corrente (r,0) e scala tutte le pendenze; il cerchio delle direzioni resta unitario."
        },
        {
          "controlId": "opt33-angle",
          "explanation": "Ruota solo il vettore unitario di prova e aggiorna pendenza e scarto dal minimo; g resta fisso."
        }
      ],
      "origin": "enrichment",
      "sourceFormulaIds": []
    },
    {
      "formulaId": "opt33-example",
      "latex": "\\ell(z)=\\frac12(z_1^2+z_2^2),\\quad z^k=(r,0)^T,\\quad d=(\\cos\\psi,\\sin\\psi)^T",
      "conceptualExplanation": "Qui g=(r,0): pendenza di prova r cos ψ, minima −r. Il costo resta fisso.",
      "purpose": "Mostrare l’effetto di orientamento e norma del gradiente sul confronto.",
      "symbolDefinitions": [],
      "assumptions": [],
      "optionalDetails": [],
      "relatedFormulaIds": [],
      "parameterInterpretation": [
        {
          "controlId": "opt33-r",
          "explanation": "Muove il punto corrente (r,0) e scala tutte le pendenze; il cerchio delle direzioni resta unitario."
        },
        {
          "controlId": "opt33-angle",
          "explanation": "Ruota solo il vettore unitario di prova e aggiorna pendenza e scarto dal minimo; g resta fisso."
        }
      ],
      "origin": "enrichment",
      "sourceFormulaIds": []
    }
  ]
} as const satisfies Readonly<Record<number,readonly FormulaExplanation[]>>;
