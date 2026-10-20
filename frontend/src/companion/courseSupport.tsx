import type { ReactNode } from 'react';
import type { CompanionDefinition } from '../data/manifest';
import type { CurveSeries, Point, ScalarGrid, SurfaceLayer, SurfacePatch } from '../numeric-data/types';
import { FunctionExplorer, SurfacePlot3D } from '../visualization';
export { interactiveDefinition } from './courseDefinition';
export function CourseExplorer({definition,id,grid,twoD,points=[],curves=[],patches=[],layers=[],height=280}:{
  definition:CompanionDefinition;id:string;grid:ScalarGrid;twoD:ReactNode;
  points?:readonly Point[];curves?:readonly CurveSeries[];patches?:readonly SurfacePatch[];layers?:readonly SurfaceLayer[];height?:number;
}) {
  const camera=definition.visualization.presentation.camera;
  return <FunctionExplorer id={id} grid={grid} policy={definition.visualization.visualizationMode} twoDView={twoD}
    threeDView={<SurfacePlot3D id={id+'-3d'} grid={grid} curves={curves} patches={patches} points={points}
      layers={layers} height={height} fontSize={22} camera={camera}/>} height={height} fontSize={22} camera={camera}/>;
}
