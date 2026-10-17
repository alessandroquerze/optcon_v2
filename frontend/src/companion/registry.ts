import { lazy, type ComponentType } from 'react';
import type { CompanionDefinition } from '../data/manifest';
export interface CompanionRendererProps { definition: CompanionDefinition; }
/** Only the eight pages authorized for F06; the other 28 retain their placeholders. */
export const companionRenderers: Readonly<Record<number, ComponentType<CompanionRendererProps>>> = Object.freeze({
  2: lazy(() => import('./lessons/concepts').then(m => ({ default: m.FeedbackLesson }))),
  8: lazy(() => import('./lessons/concepts').then(m => ({ default: m.ContinuousResponseLesson }))),
  12: lazy(() => import('./lessons/optimization').then(m => ({ default: m.LinearizationLesson }))),
  16: lazy(() => import('./lessons/optimization').then(m => ({ default: m.WeightedCostLesson }))),
  17: lazy(() => import('./lessons/optimization').then(m => ({ default: m.ConstraintSetsLesson }))),
  27: lazy(() => import('./lessons/dynamics').then(m => ({ default: m.EulerDiscretizationLesson }))),
  30: lazy(() => import('./lessons/dynamics').then(m => ({ default: m.PathConstraintsLesson }))),
  34: lazy(() => import('./lessons/dynamics').then(m => ({ default: m.PendulumEquilibriumLesson }))),
});
