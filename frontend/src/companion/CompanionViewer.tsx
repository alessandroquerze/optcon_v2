import type { CompanionDefinition, ManifestRepository } from '../data/manifest';
import { Suspense, useEffect, useRef } from 'react';
import { CompanionHeader, CompanionPage, ExplanationBlock } from '../components/CompanionPage';
import { SlideViewport } from '../components/SlideViewport';
import { companionRenderers } from './registry';
export function CompanionViewer({ definition, repository }: { definition: CompanionDefinition; repository: ManifestRepository }) {
  const currentSourcePage=definition.source_page;
  const Renderer=companionRenderers[currentSourcePage];
  const dimensions=repository.manifest.visual_layout_system;
  const scroll = useRef<HTMLDivElement>(null);
  useEffect(() => { if (scroll.current) { scroll.current.scrollTop = 0; scroll.current.scrollLeft = 0; } }, [currentSourcePage]);
  return <section className="study-pane companion-pane" data-source-page={currentSourcePage} aria-label="Companion">
    <header className="pane-heading"><span>COMPANION</span><span>Pagina {currentSourcePage} / {repository.pageCount}</span><span className="subtle-badge">{Renderer ? 'Esplora' : 'In preparazione'}</span></header>
    <div className="pane-body companion-scroll" ref={scroll}>
      <SlideViewport width={dimensions.canvas_design_px.width} height={dimensions.canvas_design_px.height} minimumDisplayWidth={dimensions.min_display_width_px}>
        {Renderer ? <Suspense fallback={<div className="loading-screen" role="status">Caricamento companion…</div>}><Renderer key={definition.page_id} definition={definition}/></Suspense> :
          <CompanionPage sourcePage={currentSourcePage} archetype={definition.layout.archetype} blockOrder={definition.layout.visual_block_order}
            blocks={{
              HEADER:<CompanionHeader subtitle={'PAGINA '+String(currentSourcePage).padStart(2,'0')} title={definition.title}/>,
              EXPLANATION:<ExplanationBlock><div className="placeholder-message">
                <span className="placeholder-icon" aria-hidden="true">▤</span>
                <h2>{repository.verticalSlicePages.has(currentSourcePage)?'Companion prevista nella vertical slice F06':'Companion pianificata'}</h2>
                <p>La pagina originale è disponibile a sinistra. La spiegazione e le attività interattive verranno aggiunte nella fase successiva.</p>
              </div></ExplanationBlock>,
            }}/>}
      </SlideViewport>
    </div>
  </section>;
}
