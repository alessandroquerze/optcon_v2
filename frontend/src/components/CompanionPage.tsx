import { useMemo, type ReactNode } from 'react';
import katex from 'katex';
import type { Archetype, StudentNotice } from '../data/manifest';
function mathMarkup(latex: string, displayMode: boolean) {
  try { return { html: katex.renderToString(latex, { displayMode, throwOnError: true, trust: false, strict: 'warn', output: 'htmlAndMathml' }), error: '' }; }
  catch { return { html: '', error: 'Formula non renderizzabile: controllare la notazione.' }; }
}
export function InlineMath({ latex }: { latex: string }) {
  const result = useMemo(() => mathMarkup(latex, false), [latex]);
  return result.error ? <span role="alert">{result.error}</span> : <span className="inline-math" dangerouslySetInnerHTML={{ __html: result.html }}/>;
}

export function WarningBanner({ shortWarning }: { shortWarning: string }) {
  return <aside className="source-warning" role="note">{shortWarning}</aside>;
}
export function InfoNote({ text }: { text: string }) {
  return <aside className="source-note" role="note">{text}</aside>;
}
export function SourceWarnings({ notices, anchor }: { notices: readonly StudentNotice[]; anchor: string }) {
  return <>{notices.filter(n => n.adjacent_to === anchor).map(n =>
    n.component === 'WarningBanner'
      ? <WarningBanner key={n.issue_id} shortWarning={n.text} />
      : <InfoNote key={n.issue_id} text={n.text} />)}</>;
}
export function EquationCard({ latex, label, notices = [], anchor = '' }: {
  latex: string; label?: string; notices?: readonly StudentNotice[]; anchor?: string;
}) {
  const result = useMemo(() => mathMarkup(latex, true), [latex]);
  return <section className="equation-card" aria-label={label ?? 'Formula'}>
    {label && <div className="card-label">{label}</div>}
    {result.error ? <p role="alert">{result.error}</p> : <div className="equation" dangerouslySetInnerHTML={{ __html: result.html }} />}
    <SourceWarnings notices={notices} anchor={anchor} />
  </section>;
}
export function CompanionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return <header className="companion-header">{subtitle && <p className="eyebrow">{subtitle}</p>}<h1>{title}</h1></header>;
}
export function ExplanationBlock({ children }: { children: ReactNode }) { return <section className="explanation">{children}</section>; }
export function ControlsBlock({ children }: { children: ReactNode }) { return <section className="controls-block" aria-label="Parametri">{children}</section>; }
export function ExampleBlock({ children, title = 'Esempio aggiunto' }: { children: ReactNode; title?: string }) {
  return <section className="example-block"><h3>{title}</h3>{children}</section>;
}
export function TakeawayBlock({ children }: { children: ReactNode }) { return <footer className="takeaway">{children}</footer>; }
export type CompanionSlot = 'HEADER'|'EXPLANATION'|'FORMULA'|'MAIN_VISUAL'|'CONTROLS'|'WORKED_EXAMPLE'|'TAKEAWAY';
export interface CompanionPageProps {
  archetype: Archetype;
  blocks: Partial<Record<CompanionSlot, ReactNode>>;
  blockOrder: readonly string[];
  sourcePage?: number;
  className?: string;
}
export function CompanionPage({ archetype, blocks, blockOrder, sourcePage, className = '' }: CompanionPageProps) {
  return <article className={'companion-page archetype-' + archetype.toLowerCase() + ' ' + className} data-source-page={sourcePage}
    aria-label={sourcePage ? 'Companion pagina ' + sourcePage : 'Companion generica'}>
    {blockOrder.map(name => blocks[name as CompanionSlot] == null ? null :
      <div className={'slide-block block-' + name.toLowerCase()} key={name}>{blocks[name as CompanionSlot]}</div>)}
  </article>;
}
