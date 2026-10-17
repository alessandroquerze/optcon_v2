import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import createPlotlyComponent from 'react-plotly.js/factory';
import Plotly from 'plotly.js-dist-min';
import type { Data, Layout, PlotlyHTMLElement, PlotMouseEvent, PlotRelayoutEvent } from 'plotly.js';
import { useLinkedSelection } from '../shared/ProjectionLink';
import { numericCopy } from './numericCopy';

/** The only module importing or calling the graphics backend. */
export interface PlotTrace { type: string; [key: string]: unknown; }
export interface PlotLayout { [key: string]: unknown; }
const Plot = createPlotlyComponent(Plotly);
const initialCamera = { eye: { x: 1.6, y: 1.6, z: 1.1 }, up: { x: 0, y: 0, z: 1 }, projection: { type: 'orthographic' as const } };
export interface CameraSpecification {
  projection: 'orthographic'|'perspective'; initialAzimuthDeg: number; initialElevationDeg: number;
}
const savedCameras = new Map<string, NonNullable<Partial<Layout>['scene']>['camera']>();
function configuredCamera(spec?: CameraSpecification) {
  if (!spec) return structuredClone(initialCamera);
  const azimuth = spec.initialAzimuthDeg * Math.PI / 180, elevation = spec.initialElevationDeg * Math.PI / 180;
  return { eye: { x: 2 * Math.cos(elevation) * Math.cos(azimuth),
    y: 2 * Math.cos(elevation) * Math.sin(azimuth), z: 2 * Math.sin(elevation) },
    up: { x: 0, y: 0, z: 1 }, projection: { type: spec.projection } };
}
const config = { displaylogo: false, responsive: true, scrollZoom: true, plotGlPixelRatio: 1, modeBarButtonsToRemove: ['lasso2d', 'select2d'] as const };
export interface SceneViewportProps {
  id: string; traces: PlotTrace[]; layout: PlotLayout; is3D?: boolean; label: string; height?: number;
  camera?: CameraSpecification; fontSize?: number;
  axisLegend?: readonly string[];
}
export const SceneViewport = memo(function SceneViewport({ id, traces, layout, is3D = false, label, height = 360, camera, fontSize = 12, axisLegend }: SceneViewportProps) {
  const graph = useRef<PlotlyHTMLElement|null>(null);
  const outer = useRef<HTMLDivElement>(null);
  const renders = useRef(0);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState('');
  const linked = useLinkedSelection();
  const numericBuffers = useRef(new WeakMap<object, unknown>());
  const resetCamera = useMemo(() => configuredCamera(camera), [camera]);
  useEffect(() => {
    if (!ready || !outer.current) return;
    let width = 0;
    const observer = new ResizeObserver(entries => {
      const next = entries[0].contentRect.width;
      if (Math.abs(next-width) > 1 && graph.current) { width = next; void Plotly.Plots.resize(graph.current); }
    });
    observer.observe(outer.current);
    return () => observer.disconnect();
  }, [ready]);
  // Plotly can mutate its inputs. Numeric datasets are never passed by reference.
  const data = useMemo(() => numericCopy(traces, numericBuffers.current) as Data[], [traces]);
  const figureLayout = useMemo(() => ({
    autosize: true, margin: { l: fontSize >= 20 ? 80 : 52, r: 28, t: 15, b: fontSize >= 20 ? 65 : 48 }, paper_bgcolor: '#fff', plot_bgcolor: '#fff',
    font: { family: 'Segoe UI, sans-serif', size: fontSize, color: '#294658' },
    uirevision: id, hovermode: 'closest', showlegend: false, ...layout,
    ...(is3D ? { margin: { l: 12, r: 12, t: 8, b: 28 } } : {}),
    ...(is3D ? { scene: { camera: structuredClone(savedCameras.get(id) ?? resetCamera), dragmode: 'orbit', aspectmode: 'cube',
      bgcolor: '#fff', uirevision: id, ...(layout.scene as object ?? {}),
      ...Object.fromEntries(['xaxis','yaxis','zaxis'].map(axis => [axis, {
        // gl3d labels are rasterized/projected differently from SVG text.
        // Calibrated against the exported 960x1280 slides, not just DOM font metrics.
        nticks: 3, showspikes: false, tickfont: { size: Math.max(12, Math.round(fontSize * .64)) },
        ...((layout.scene as Record<string, unknown> | undefined)?.[axis] as object ?? {}),
        title: { ...(((layout.scene as Record<string, Record<string, unknown>> | undefined)?.[axis]?.title) as object ?? {}),
          font: { size: fontSize } },
      }])),
    } } : {}),
  } as Partial<Layout>), [id, layout, is3D, resetCamera, fontSize]);
  const initialized = useCallback((_: unknown, element: HTMLElement) => {
    graph.current = element as PlotlyHTMLElement; setReady(true);
    if (outer.current) outer.current.dataset.renderCount = String(++renders.current);
  }, []);
  const updated = useCallback(() => {
    if (outer.current) outer.current.dataset.renderCount = String(++renders.current);
  }, []);
  const relayout = useCallback((event: Readonly<PlotRelayoutEvent>) => {
    if (outer.current && Object.keys(event).some(k => k.startsWith('scene.camera'))) {
      outer.current.dataset.camera = JSON.stringify(graph.current?.layout.scene?.camera ?? event);
      if (graph.current?.layout.scene?.camera) savedCameras.set(id, structuredClone(graph.current.layout.scene.camera));
    }
  }, [id]);
  const pick = useCallback((event: Readonly<PlotMouseEvent>) => {
    const value = event.points[0]?.customdata;
    if (typeof value === 'string') linked?.select(value);
  }, [linked]);
  const cameraAction = (action: 'reset'|'in'|'out'|'orbit'|'pan') => {
    const div = graph.current; if (!div) return;
    // Plotly supports dotted scene patches; community types omit those keys.
    const patch = (value: Record<string, unknown>) => Plotly.relayout(div, value as Partial<Layout>);
    if (action === 'orbit' || action === 'pan') {
      void patch({ 'scene.dragmode': action }); return;
    }
    if (action === 'reset') { void patch({ 'scene.camera': structuredClone(resetCamera) }); return; }
    const current = div.layout.scene?.camera ?? resetCamera;
    const eye = current.eye ?? initialCamera.eye;
    const factor = action === 'in' ? .8 : 1.25;
    void patch({ 'scene.camera': { ...current, eye: {
      x: (eye.x ?? 1.6) * factor, y: (eye.y ?? 1.6) * factor, z: (eye.z ?? 1.1) * factor,
    } } });
  };
  return <div className="scene-viewport" ref={outer} data-plot-id={id} data-plot-ready={ready} data-plot-dimension={is3D ? 3 : 2}>
    {is3D && <div className="camera-toolbar" aria-label={'Camera ' + label}>
      <button onClick={() => cameraAction('orbit')}>Ruota</button><button onClick={() => cameraAction('pan')}>Pan</button>
      <button aria-label={'Zoom avanti ' + label} onClick={() => cameraAction('in')}>+</button>
      <button aria-label={'Zoom indietro ' + label} onClick={() => cameraAction('out')}>−</button>
      <button onClick={() => cameraAction('reset')}>Ripristina camera</button>
    </div>}
    {is3D && axisLegend && <div className="scene-unit-legend" aria-label="Assi e unità del grafico 3D" style={{fontSize}}>
      {axisLegend.map((text, i) => <span key={i}>{text}</span>)}
    </div>}
    {error && <p className="error-card" role="alert">{error}</p>}
    <div role="img" aria-label={label} style={{ height: is3D ? height - 32 : height }}>
      <Plot data={data} layout={figureLayout} config={{ ...config, modeBarButtonsToRemove: [...config.modeBarButtonsToRemove] }}
        style={{ width: '100%', height: '100%' }} useResizeHandler
        onInitialized={initialized} onUpdate={updated} onRelayout={relayout} onClick={pick}
        onError={reason => setError('Errore del renderer grafico: ' + reason.message)}
        onWebGlContextLost={() => setError('Contesto 3D non disponibile. Puoi continuare nella vista 2D.')}
        onPurge={() => { graph.current = null; }} />
    </div>
  </div>;
});
