import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { documentFromHash,studyHref,type DocumentKey } from '../data/documents';
const documentPages=new Map<DocumentKey,number>();
export const rememberedDocumentPage=(key:DocumentKey)=>documentPages.get(key)??1;
export function boundedPage(value: number, count: number): number {
  if (!Number.isInteger(count) || count < 1) throw new RangeError('Conteggio pagine non valido.');
  return Number.isFinite(value) ? Math.min(count, Math.max(1, Math.trunc(value))) : 1;
}
export function parsePageInput(text: string, count: number): number | null {
  if (!/^\d+$/.test(text.trim())) return null;
  const value = Number(text);
  return Number.isSafeInteger(value) ? boundedPage(value, count) : null;
}
interface PageState {
  currentSourcePage: number; pageCount: number;
  documentKey: DocumentKey;
  goToPage: (page: number) => void; next: () => void; previous: () => void;
}
const PageContext = createContext<PageState | null>(null);
export function PageProvider({ pageCount, children,documentKey='introduction' }: { pageCount: number; children: ReactNode;documentKey?:DocumentKey }) {
  const readPage = () => boundedPage(Number(new URLSearchParams(location.hash.split('?')[1]).get('page') ?? rememberedDocumentPage(documentKey)), pageCount);
  const [currentSourcePage, setPage] = useState(readPage);
  const goToPage = useCallback((page: number) => setPage(boundedPage(page, pageCount)), [pageCount]);
  useEffect(() => {
    const change = () => { if (location.hash.startsWith('#/study')&&documentFromHash()===documentKey) setPage(readPage()); };
    window.addEventListener('hashchange', change);
    return () => window.removeEventListener('hashchange', change);
  }, [pageCount,documentKey]);
  useEffect(() => {
    documentPages.set(documentKey,currentSourcePage);
    if (!location.hash.startsWith('#/dev')&&documentFromHash()===documentKey) history.replaceState(null, '', studyHref(documentKey,currentSourcePage));
  }, [currentSourcePage,documentKey]);
  const value = useMemo(() => ({
    currentSourcePage, pageCount, goToPage,documentKey,
    next: () => setPage(p => boundedPage(p + 1, pageCount)),
    previous: () => setPage(p => boundedPage(p - 1, pageCount)),
  }), [currentSourcePage, pageCount, goToPage,documentKey]);
  return <PageContext value={value}>{children}</PageContext>;
}
export function usePageState() {
  const value = useContext(PageContext);
  if (!value) throw new Error('PageProvider richiesto.');
  return value;
}
