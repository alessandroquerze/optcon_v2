import { useEffect, useRef, useState } from 'react';
import { getDocument, GlobalWorkerOptions, type PDFDocumentProxy } from 'pdfjs-dist';
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
GlobalWorkerOptions.workerSrc = workerUrl;

export function PdfViewer({ url, sourcePage, expectedPageCount }: { url: string; sourcePage: number; expectedPageCount: number }) {
  const [document, setDocument] = useState<PDFDocumentProxy | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [width, setWidth] = useState(600);
  const [zoom, setZoom] = useState(1);
  const outer = useRef<HTMLDivElement>(null);
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => { if (outer.current) { outer.current.scrollTop = 0; outer.current.scrollLeft = 0; } }, [sourcePage]);
  useEffect(() => {
    const loadingTask = getDocument({
      url, cMapUrl: import.meta.env.BASE_URL + 'pdfjs/cmaps/', cMapPacked: true,
      standardFontDataUrl: import.meta.env.BASE_URL + 'pdfjs/standard_fonts/',
      wasmUrl: import.meta.env.BASE_URL + 'pdfjs/wasm/',
    });
    let cancelled = false;
    setDocument(null); setError('');
    loadingTask.promise.then(pdf => {
      if (cancelled) return;
      if (pdf.numPages !== expectedPageCount) { setError('Numero di pagine PDF diverso dal manifest.'); return; }
      setDocument(pdf);
    }).catch(reason => { if (!cancelled) setError(String(reason)); });
    return () => { cancelled = true; void loadingTask.destroy(); };
  }, [url, expectedPageCount]);
  useEffect(() => {
    const element = outer.current;
    if (!element) return;
    const observer = new ResizeObserver(entries => setWidth(Math.max(200, entries[0].contentRect.width - 40)));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!document) return;
    let cancelled = false;
    let task: ReturnType<Awaited<ReturnType<PDFDocumentProxy['getPage']>>['render']> | undefined;
    setLoading(true);
    const render = async () => {
      const page = await document.getPage(sourcePage);
      if (cancelled) return;
      const base = page.getViewport({ scale: 1 });
      const viewport = page.getViewport({ scale: width / base.width * zoom });
      const canvas = window.document.createElement('canvas');
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.ceil(viewport.width * ratio);
      canvas.height = Math.ceil(viewport.height * ratio);
      canvas.style.width = viewport.width + 'px';
      canvas.style.height = viewport.height + 'px';
      canvas.setAttribute('aria-label', 'PDF originale pagina ' + sourcePage);
      canvas.dataset.renderedPage = String(sourcePage);
      task = page.render({ canvas, viewport, transform: ratio === 1 ? undefined : [ratio, 0, 0, ratio, 0, 0] });
      await task.promise;
      if (!cancelled && host.current) {
        host.current.replaceChildren(canvas);
        setLoading(false); setError('');
      }
    };
    render().catch(reason => { if (!cancelled && reason?.name !== 'RenderingCancelledException') { setError(String(reason)); setLoading(false); } });
    return () => { cancelled = true; task?.cancel(); };
  }, [document, sourcePage, width, zoom]);
  return <section className="study-pane pdf-pane" data-source-page={sourcePage} aria-label="PDF originale">
    <header className="pane-heading"><span>PDF ORIGINALE</span><span>Pagina {sourcePage} / {expectedPageCount}</span>
      <div className="pdf-zoom"><button aria-label="Riduci PDF" disabled={zoom <= .5} onClick={() => setZoom(z => Math.max(.5, z - .25))}>−</button>
        <button onClick={() => setZoom(1)} aria-label="Adatta PDF">Adatta</button>
        <button aria-label="Ingrandisci PDF" disabled={zoom >= 3} onClick={() => setZoom(z => Math.min(3, z + .25))}>+</button></div>
    </header>
    <div className="pane-body pdf-scroll" ref={outer}>
      {error && <p className="error-card" role="alert">Impossibile visualizzare il PDF: {error}</p>}
      {!error && <div className="pdf-status" aria-live="polite">{loading ? 'Rendering della pagina…' : 'Documento originale · ' + Math.round(zoom * 100) + '%'}</div>}
      <div className="pdf-canvas-host" ref={host} style={{ visibility: loading || error ? 'hidden' : 'visible' }} />
    </div>
  </section>;
}
