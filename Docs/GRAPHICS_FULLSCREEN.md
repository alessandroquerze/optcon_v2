# Fullscreen dei grafici

## Inventario prima delle modifiche

Inventariati i punti di utilizzo prima di modificare il codice applicativo. Dettagli e righe sorgenti in [fullscreen_inventory_before.json](../Data/reports/fullscreen_inventory_before.json).

105 punti di utilizzo; 36 renderer mappati. Sono inclusi i componenti usati nel playground per future companion. Le tabelle e le schede di solo testo non sono grafici.

Le chiamate dei renderer polimorfici sono elencate anche quando il relativo ramo dipende dalla pagina. Gli SVG inline sono a p4, p21 e p26; p21/p26 si trovano nel toggle condiviso, p4 richiede copertura automatica nella cornice comune della companion.

| Pagina | Renderer | Chiamate grafiche dirette |
| --- | --- | --- |
| 1 | CourseOrientation |  |
| 2 | FeedbackLesson | FeedbackDiagram |
| 3 | DomainMotivation | ModelDiagram, svg |
| 4 | DomainMotivation | ModelDiagram, svg |
| 5 | DomainMotivation | ModelDiagram, svg |
| 6 | AerialGeometry | TrajectoryViewer |
| 7 | DomainMotivation | ModelDiagram, svg |
| 8 | ContinuousResponseLesson | AlignedTimeSeries, FunctionExplorer, SurfacePlot3D |
| 9 | DiscreteTransition | CourseExplorer, StateInputTimeline, TrajectoryViewer |
| 10 | HorizonInspector | StateInputTimeline |
| 11 | EquilibriumExplorer | CourseExplorer, TrajectoryViewer |
| 12 | LinearizationLesson | FunctionExplorer, SurfacePlot3D, TrajectoryViewer |
| 13 | ControlRecap | ModelDiagram |
| 14 | DecisionSetExplorer | CourseExplorer, TrajectoryViewer |
| 15 | ScalarCostExplorer | TrajectoryViewer |
| 16 | WeightedCostLesson | ContourPlot2D, CostBreakdown, FunctionExplorer |
| 17 | ConstraintSetsLesson | ConstraintVisualizer, FunctionExplorer, UnitCircleInset |
| 18 | ConstrainedMinimumExplorer | CourseExplorer, TrajectoryViewer |
| 19 | DynamicsEqualities | CourseExplorer, StateInputTimeline, TrajectoryViewer |
| 20 | StageCostExplorer | CostBreakdown, CourseExplorer, StateInputTimeline |
| 21 | EndpointExplorer | CourseExplorer, svg |
| 22 | TrackingExplorer | CostBreakdown, CourseExplorer, StateInputTimeline, TrajectoryViewer |
| 23 | CompleteOcpExplorer | CourseExplorer, StateInputTimeline, TrajectoryViewer |
| 24 | OutputTrajectoryExplorer |  |
| 25 | TrackingExplorer | CostBreakdown, CourseExplorer, StateInputTimeline, TrajectoryViewer |
| 26 | DroneForceExplorer | CourseExplorer, DroneSnapshot |
| 27 | EulerDiscretizationLesson | AlignedTimeSeries, TrajectoryViewer, VisualizationSwitch |
| 28 | DroneRequirementsExplorer | AlignedTimeSeries, TrajectoryViewer, VisualizationSwitch |
| 29 | DroneStageExplorer | CostBreakdown, CourseExplorer |
| 30 | PathConstraintsLesson | FunctionExplorer, IntervalBand, StateInputTimeline, SurfacePlot3D |
| 31 | ContinuousFunctionalExplorer | AlignedTimeSeries, CostBreakdown, CourseExplorer |
| 32 | FunctionSpaceExplorer | AlignedTimeSeries, CourseExplorer |
| 33 | PendulumDynamicsExplorer | CourseExplorer, TrajectoryViewer |
| 34 | PendulumEquilibriumLesson | EquilibriumPoses, TrajectoryViewer, VisualizationSwitch |
| 35 | PendulumReferenceExplorer | AlignedTimeSeries, TrajectoryViewer, VisualizationSwitch |
| 36 | PendulumCostExplorer | CostBreakdown, CourseExplorer |

## Implementazione

`GraphicViewport` è il confine condiviso per `SceneViewport`, viste combinate e componenti grafici SVG/HTML. `CompanionPage` applica inoltre `AutoGraphicFullscreen` agli SVG inline accessibili (`svg[role="img"]`) che non appartengono già a un wrapper. Nessun renderer delle 36 pagine è stato modificato o rigenerato.

Il pulsante ⛶ apre il grafico; **Esc** oppure **Esci da schermo intero** ripristina la slide. Rimangono disponibili i parametri e i comandi della simulazione. Il toggle 2D/3D resta utilizzabile; le viste affiancate entrano insieme nel fullscreen, con un solo pulsante. Il contesto React elimina pulsanti duplicati nei wrapper annidati.

La Fullscreen API porta nel top layer la cornice della companion e il CSS espone soltanto il grafico scelto, i relativi controlli e la barra di uscita. Il fallback usa la Popover API, utile anche quando la richiesta nativa viene rifiutata. Se nessuna delle due API è disponibile, compare uno stato sintetico senza lasciare overlay o bloccare lo scroll.

Grafici e controlli non vengono clonati, spostati nel DOM o rimontati per aprire/chiudere il fullscreen. Il portal contiene soltanto la barra di uscita. Zoom, camera, parametri e playback conservano la propria istanza. Focus, ruoli ARIA, attributi, scroll e blocco del body vengono ripristinati anche all'uscita del browser e allo smontaggio/cambio pagina. Una richiesta ancora pendente viene annullata se il grafico non esiste più.

Il `ResizeObserver` di `SceneViewport` gestisce variazioni sia di larghezza sia di altezza, ignorando nodi smontati o nascosti. I listener di resize duplicati del backend sono disattivati. I contenitori composti, compreso il diagramma di equilibrio con curva 2D della pagina 34, distribuiscono l'altezza disponibile ai grafici figli. L'audit verifica anche le dimensioni effettive del plot interno: espandere la sola cornice non basta.

### Componenti coperti

- Tutti i renderer Plotly attraverso `SceneViewport`: funzioni, contour, surface/mesh/wireframe, traiettorie, serie temporali, campi vettoriali, vincoli e simulazioni.
- `VisualizationSwitch` / `FunctionExplorer`: toggle e viste 2D/3D affiancate, con eventuali diagrammi combinati.
- `ModelDiagram`, `VectorVisualizer`, `CostBreakdown`, `StateInputTimeline`, `IntervalBand`, `EquilibriumPoses`, `UnitCircleInset`; `FeedbackDiagram` eredita `ModelDiagram`.
- SVG inline accessibili nella cornice comune, compresi i diagrammi di p4, p21 e p26. P21/p26 ereditano già il wrapper della vista composta.

Tabelle, schede di solo testo e formule non acquisiscono un pulsante grafico. Le pagine 1, 3 e 5 non contengono grafici; sono comunque incluse nell'audit delle 36 companion.

### Future companion

I componenti della libreria e `SceneViewport` ereditano automaticamente il fullscreen. Per un nuovo renderer grafico personalizzato, usare il confine esportato da `visualization`:

```tsx
<GraphicViewport label="Descrizione accessibile del grafico">
  <CustomGraphic />
</GraphicViewport>
```

Non aggiungere stato fullscreen o pulsanti nei renderer di pagina. I diagrammi SVG inline con ruolo `img` vengono coperti dalla cornice comune; è comunque preferibile usare il wrapper esplicito quando si crea un nuovo componente riutilizzabile. I layout interni personalizzati devono consentire ai grafici figli di occupare l'altezza disponibile; il test di copertura rileva figli compressi o un plot non ridimensionato.

## Verifiche riproducibili

```sh
cd frontend
npm run build
npm exec -- vitest run --reporter=default --reporter=json --outputFile=test-reports/fullscreen-unit.json
npm run test:browser -- --config=playwright.fullscreen.config.ts
node scripts/review-fullscreen.mjs
```

La configurazione browser dedicata conserva gli screenshot storici di F07 e salva le nuove immagini in `Docs/fullscreen_assets/`.

La suite fullscreen percorre tutte le 36 pagine, ciascuna modalità disponibile e ciascun confine grafico (anche esempi e SVG inline). Verifica apertura/chiusura, crescita del grafico interno, resize Plotly, istanze DOM, risultati numerici, controlli accessibili e ritorno alla geometria originale. I casi aggiuntivi verificano camera, focus e Tab, parametri, toggle, simulazione in esecuzione, fallback popover, cambio pagina e viste affiancate nel playground.

`review-fullscreen.mjs` confronta inoltre risultati numerici e formule con l'audit finale F07, verifica zoom 2D e resize della sola altezza e produce [fullscreen_coverage.json](../Data/reports/fullscreen_coverage.json). Controlla i 1.032 hash della baseline iniziale di questo task e, separatamente, i 969 file protetti della baseline F05. Non aggiorna manifest, PAGE_SPEC, PDF o sorgenti didattiche.

Test reali eseguiti con Chrome headless e SwiftShader. Il fallback viene verificato nello stesso browser disabilitando la Fullscreen API; non equivale a una certificazione su tutti i browser.

## Esito

| Verifica | Risultato |
| --- | --- |
| Build produzione e TypeScript | PASS |
| Test unitari | 137/137 PASS, inclusi 9 sul ciclo fullscreen e sugli SVG inline |
| Suite browser completa | 95/95 PASS: 56 regressioni esistenti e 39 scenari fullscreen |
| Verifica supplementare dei plot interni | 39/39 PASS, con misura dei figli grafici e corrispondenza tra dimensioni Plotly e viewport |
| Audit runtime | 36/36 pagine, 62 viste, 76 presenze grafiche coperte, nessuna esclusione |
| Comandi di ingresso | 73; i grafici delle viste composte condividono lo stesso ingresso |
| Visual review | 11 screenshot PASS, nessun problema visivo residuo |
| Formule e output | Coincidono con l'audit finale F07 su tutte le 36 pagine |
| File protetti | 1.032/1.032 invariati rispetto all'inizio del task; 969/969 invariati rispetto alla baseline F05 |

Le 76 presenze comprendono 27 scene 3D, 20 scene 2D, 10 SVG, 11 timeline e 8 grafici a barre. Sono conteggiate per pagina e modalità: lo stesso esempio condiviso fra toggle 2D e 3D compare in entrambe le viste. Non sono 76 componenti distinti.

Evidenze: [audit runtime](../Data/reports/fullscreen_coverage.json), [visual review](../Data/reports/fullscreen_visual_review.json), [riepilogo verifiche](../Data/reports/graphics_fullscreen.json).

Esempi visivi: [3D](fullscreen_assets/p16-3d-fullscreen.png), [grafico nell'esempio](fullscreen_assets/p16-example-bars-fullscreen.png), [SVG e curva nella vista composta](fullscreen_assets/p34-equilibrium-poses-and-curve-fullscreen.png), [2D/3D affiancati](fullscreen_assets/future-combined-2d-3d-fullscreen.png), [ritorno alla slide](fullscreen_assets/p16-restored.png).
