import { useEffect, useState, type ReactNode } from 'react';
import type { VisualizationMode } from '../../data/manifest';
import type { Point, ScalarGrid, SurfaceLayer } from '../core/types';
import { ContourPlot2D } from '../2d/ContourPlot2D';
import { SurfacePlot3D } from '../3d/SurfacePlot3D';
import type { CameraSpecification } from '../core/SceneViewport';
import { GraphicViewport } from '../core/GraphicViewport';
export function initialView(mode: VisualizationMode): '2D'|'3D' {
  return mode === '3D_PRIMARY' || mode === '3D_PRIMARY_WITH_2D' ? '3D' : '2D';
}
export function VisualizationSwitch({ id, policy, display = 'toggle', twoDView, threeDView }: {
  id: string; policy: VisualizationMode; display?: 'toggle'|'side-by-side'; twoDView: ReactNode; threeDView: ReactNode;
}) {
  const [view, setView] = useState<'2D'|'3D'>(() => initialView(policy));
  useEffect(() => { setView(initialView(policy)); },[id,policy]);
  if (policy === 'NONE') return null;
  const can2D = policy !== '3D_PRIMARY', can3D = policy !== '2D_ONLY';
  const both = display === 'side-by-side' && can2D && can3D;
  const effectiveView=policy==='2D_ONLY'?'2D':policy==='3D_PRIMARY'?'3D':view;
  return <GraphicViewport label={both?'Viste collegate 2D e 3D':'Visualizzazione 2D / 3D'}><section className="function-explorer" data-current-view={both ? 'combined' : effectiveView}>
    {!both && can2D && can3D && <div className="view-toggle" role="group" aria-label="Vista grafica">
      <button aria-pressed={view === '2D'} onClick={() => setView('2D')}>2D</button>
      <button aria-pressed={view === '3D'} onClick={() => setView('3D')}>3D</button>
    </div>}
    <div className={both ? 'visualization-views combined-plots' : 'visualization-views'}>
      {can2D && (both || effectiveView === '2D') && <div className="plot-cell">{twoDView}</div>}
      {can3D && (both || effectiveView === '3D') && <div className="plot-cell">{threeDView}</div>}
    </div>
  </section></GraphicViewport>;
}
export function FunctionExplorer({ id, grid, points, layers, policy, display = 'toggle', twoDView, threeDView,
  representation = 'surface', height, fontSize, camera }: {
  id: string; grid: ScalarGrid; points?: readonly Point[]; layers?: readonly SurfaceLayer[];
  policy: VisualizationMode; display?: 'toggle'|'side-by-side'; twoDView?: ReactNode; threeDView?: ReactNode;
  representation?: 'surface'|'wireframe'|'mesh'; height?: number; fontSize?: number; camera?: CameraSpecification;
}) {
  return <VisualizationSwitch id={id} policy={policy} display={display}
    twoDView={twoDView ?? <ContourPlot2D id={id + '-2d'} grid={grid} points={points} height={height} fontSize={fontSize}/>}
    threeDView={threeDView ?? <SurfacePlot3D id={id + '-3d'} grid={grid} points={points} layers={layers}
      representation={representation} contourProjection height={height} fontSize={fontSize} camera={camera}/>} />;
}
