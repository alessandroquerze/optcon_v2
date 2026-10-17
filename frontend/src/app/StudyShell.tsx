import { useEffect, useRef, useState, type CSSProperties } from 'react';
import type { ManifestRepository } from '../data/manifest';
import { usePageState, parsePageInput } from './PageState';
import { PdfViewer } from '../pdf/PdfViewer';
import { CompanionViewer } from '../companion/CompanionViewer';

export function StudyShell({ repository }: { repository: ManifestRepository }) {
  const { currentSourcePage, pageCount, next, previous, goToPage } = usePageState();
  const definition = repository.getPage(currentSourcePage);
  const [draft, setDraft] = useState(String(currentSourcePage));
  const [invalid, setInvalid] = useState(false);
  const [split, setSplit] = useState(50);
  const layout = useRef<HTMLDivElement>(null);
  useEffect(() => { setDraft(String(currentSourcePage)); setInvalid(false); }, [currentSourcePage]);
  return <main className="study-shell">
    <nav className="study-toolbar" aria-label="Navigazione pagine">
      <div className="toolbar-document"><span className="document-mark">PDF</span><span>{repository.manifest.pages[0].title}</span></div>
      <div className="page-navigation">
        <button onClick={previous} disabled={currentSourcePage === 1} aria-label="Pagina precedente">← <span>Previous</span></button>
        <form onSubmit={e => {
          e.preventDefault();
          const page = parsePageInput(draft, pageCount);
          if (page === null) { setInvalid(true); return; }
          goToPage(page); setDraft(String(page)); setInvalid(false);
        }}>
          <label htmlFor="page-jump">Pagina</label>
          <input id="page-jump" aria-label="Numero pagina" inputMode="numeric" value={draft} aria-invalid={invalid}
            onChange={e => setDraft(e.target.value)} />
          <span className="page-total">/ {pageCount}</span><button type="submit" aria-label="Vai alla pagina">Vai</button>
        </form>
        <button onClick={next} disabled={currentSourcePage === pageCount} aria-label="Pagina successiva"><span>Next</span> →</button>
      </div>
      {invalid && <span role="alert">Inserisci un numero intero.</span>}
    </nav>
    <div className="study-layout" ref={layout} style={{ '--split': split + '%' } as CSSProperties}>
      <PdfViewer url={repository.pdfUrl} sourcePage={currentSourcePage} expectedPageCount={pageCount} />
      <div className="panel-divider" role="separator" aria-label="Ridimensiona pannelli" aria-orientation="vertical"
        tabIndex={0} aria-valuemin={35} aria-valuemax={65} aria-valuenow={Math.round(split)}
        onKeyDown={e => {
          if (e.key === 'ArrowLeft') setSplit(v => Math.max(35, v - 2));
          if (e.key === 'ArrowRight') setSplit(v => Math.min(65, v + 2));
          if (e.key === 'Home') setSplit(50);
        }}
        onPointerDown={e => { e.currentTarget.setPointerCapture(e.pointerId); }}
        onPointerMove={e => {
          if (!e.currentTarget.hasPointerCapture(e.pointerId) || !layout.current) return;
          const bounds = layout.current.getBoundingClientRect();
          setSplit(Math.max(35, Math.min(65, (e.clientX - bounds.left) / bounds.width * 100)));
        }}
        onPointerUp={e => e.currentTarget.releasePointerCapture(e.pointerId)} />
      <CompanionViewer definition={definition} repository={repository}/>
    </div>
  </main>;
}
