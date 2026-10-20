import { lazy, type ComponentType } from 'react';
import type { CompanionDefinition } from '../data/manifest';
import { documentFromId } from '../data/documents';
export interface CompanionRendererProps { definition: CompanionDefinition; }
const optimizationRenderers: Readonly<Record<number,ComponentType<CompanionRendererProps>>> = Object.freeze(Object.fromEntries(
  [...Array.from({length:9},(_,i)=>[i+1,lazy(()=>import('./optimization/lessons').then(m=>({default:m.OptimizationLesson})))]),
   ...Array.from({length:9},(_,i)=>[i+10,lazy(()=>import('./optimization/convexity').then(m=>({default:m.ConvexityLesson})))]),
   ...Array.from({length:7},(_,i)=>[i+19,lazy(()=>import('./optimization/minimization').then(m=>({default:m.MinimizationLesson})))]),
   ...Array.from({length:8},(_,i)=>[i+26,lazy(()=>import('./optimization/descent').then(m=>({default:m.DescentLesson})))]),
   ...Array.from({length:4},(_,i)=>[i+34,lazy(()=>import('./optimization/newton').then(m=>({default:m.NewtonLesson})))]),
   ...Array.from({length:9},(_,i)=>[i+38,lazy(()=>import('./optimization/stepSize').then(m=>({default:m.StepSizeLesson})))]),
   ...Array.from({length:8},(_,i)=>[i+47,lazy(()=>import('./optimization/projection').then(m=>({default:m.ProjectionLesson})))]),
   ...Array.from({length:8},(_,i)=>[i+55,lazy(()=>import('./optimization/kkt').then(m=>({default:m.KktLesson})))]),
   ...Array.from({length:6},(_,i)=>[i+63,lazy(()=>import('./optimization/constrainedQp').then(m=>({default:m.ConstrainedQpLesson})))]),
   ...Array.from({length:6},(_,i)=>[i+69,lazy(()=>import('./optimization/sqp').then(m=>({default:m.SqpLesson})))]),
   ...Array.from({length:7},(_,i)=>[i+75,lazy(()=>import('./optimization/merit').then(m=>({default:m.MeritLessonPage})))])]
));
export function rendererForDocument(documentId:string,page:number) {
  return documentFromId(documentId)==='optimization'?optimizationRenderers[page]:companionRenderers[page];
}
/** Introduction renderers; additional pages are registered after each implementation batch. */
export const companionRenderers: Readonly<Record<number, ComponentType<CompanionRendererProps>>> = Object.freeze({
  1: lazy(() => import('./lessons/motivation').then(m => ({ default: m.CourseOrientation }))),
  2: lazy(() => import('./lessons/concepts').then(m => ({ default: m.FeedbackLesson }))),
  3: lazy(() => import('./lessons/motivation').then(m => ({ default: m.DomainMotivation }))),
  4: lazy(() => import('./lessons/motivation').then(m => ({ default: m.DomainMotivation }))),
  5: lazy(() => import('./lessons/motivation').then(m => ({ default: m.DomainMotivation }))),
  6: lazy(() => import('./lessons/motivation').then(m => ({ default: m.AerialGeometry }))),
  7: lazy(() => import('./lessons/motivation').then(m => ({ default: m.DomainMotivation }))),
  8: lazy(() => import('./lessons/concepts').then(m => ({ default: m.ContinuousResponseLesson }))),
  9: lazy(() => import('./lessons/motivation').then(m => ({ default: m.DiscreteTransition }))),
  10: lazy(() => import('./lessons/decisionFoundations').then(m => ({ default: m.HorizonInspector }))),
  11: lazy(() => import('./lessons/decisionFoundations').then(m => ({ default: m.EquilibriumExplorer }))),
  12: lazy(() => import('./lessons/optimization').then(m => ({ default: m.LinearizationLesson }))),
  13: lazy(() => import('./lessons/decisionFoundations').then(m => ({ default: m.ControlRecap }))),
  14: lazy(() => import('./lessons/decisionFoundations').then(m => ({ default: m.DecisionSetExplorer }))),
  15: lazy(() => import('./lessons/decisionFoundations').then(m => ({ default: m.ScalarCostExplorer }))),
  16: lazy(() => import('./lessons/optimization').then(m => ({ default: m.WeightedCostLesson }))),
  17: lazy(() => import('./lessons/optimization').then(m => ({ default: m.ConstraintSetsLesson }))),
  18: lazy(() => import('./lessons/decisionFoundations').then(m => ({ default: m.ConstrainedMinimumExplorer }))),
  19: lazy(() => import('./lessons/decisionFoundations').then(m => ({ default: m.DynamicsEqualities }))),
  20: lazy(() => import('./lessons/ocp').then(m => ({ default: m.StageCostExplorer }))),
  21: lazy(() => import('./lessons/ocp').then(m => ({ default: m.EndpointExplorer }))),
  22: lazy(() => import('./lessons/ocp').then(m => ({ default: m.TrackingExplorer }))),
  23: lazy(() => import('./lessons/ocp').then(m => ({ default: m.CompleteOcpExplorer }))),
  24: lazy(() => import('./lessons/ocp').then(m => ({ default: m.OutputTrajectoryExplorer }))),
  25: lazy(() => import('./lessons/ocp').then(m => ({ default: m.TrackingExplorer }))),
  26: lazy(() => import('./lessons/ocp').then(m => ({ default: m.DroneForceExplorer }))),
  27: lazy(() => import('./lessons/dynamics').then(m => ({ default: m.EulerDiscretizationLesson }))),
  28: lazy(() => import('./lessons/continuous').then(m => ({ default: m.DroneRequirementsExplorer }))),
  29: lazy(() => import('./lessons/continuous').then(m => ({ default: m.DroneStageExplorer }))),
  30: lazy(() => import('./lessons/dynamics').then(m => ({ default: m.PathConstraintsLesson }))),
  31: lazy(() => import('./lessons/continuous').then(m => ({ default: m.ContinuousFunctionalExplorer }))),
  32: lazy(() => import('./lessons/continuous').then(m => ({ default: m.FunctionSpaceExplorer }))),
  33: lazy(() => import('./lessons/continuous').then(m => ({ default: m.PendulumDynamicsExplorer }))),
  34: lazy(() => import('./lessons/dynamics').then(m => ({ default: m.PendulumEquilibriumLesson }))),
  35: lazy(() => import('./lessons/continuous').then(m => ({ default: m.PendulumReferenceExplorer }))),
  36: lazy(() => import('./lessons/continuous').then(m => ({ default: m.PendulumCostExplorer }))),
});
