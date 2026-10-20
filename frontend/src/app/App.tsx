import { Component, lazy, Suspense, useEffect, useState, type ReactNode } from 'react';
import { loadManifest, type ManifestRepository } from '../data/manifest';
import { PageProvider, usePageState,rememberedDocumentPage } from './PageState';
import { courseDocuments,documentFromHash,documentFromId,studyHref,type DocumentKey } from '../data/documents';
import { StudyShell } from './StudyShell';
const DevPlayground = lazy(() => import('../dev/DevPlayground'));
class ErrorBoundary extends Component<{ children: ReactNode }, { error: string }> {
  state = { error: '' };
  static getDerivedStateFromError(error: Error) { return { error: error.message }; }
  render() { return this.state.error ? <div className="error-card" role="alert">{this.state.error}<p><a href="/">Ricarica l'applicazione</a></p></div> : this.props.children; }
}
function Workspace({ repository }: { repository: ManifestRepository }) {
  const [dev, setDev] = useState(location.hash.startsWith('#/dev'));
  const { currentSourcePage,documentKey } = usePageState();
  useEffect(() => {
    const change = () => setDev(location.hash.startsWith('#/dev'));
    window.addEventListener('hashchange', change); return () => window.removeEventListener('hashchange', change);
  }, []);
  return <div className="app">
    <header className="app-header"><a className="brand" href={studyHref(documentKey,currentSourcePage)}><span className="brand-symbol">∫</span><span>OPTCON <span className="brand-muted">STUDIO</span></span></a>
      <span className="app-subtitle">Optimal Control and Reinforcement Learning</span>
      <select className="course-document-select" aria-label="Documento del corso" value={documentKey} onChange={e=>{
        const key=e.target.value as DocumentKey;location.hash=studyHref(key,rememberedDocumentPage(key));
      }}>{courseDocuments.map(d=><option key={d.key} value={d.key}>{d.title}</option>)}</select>
      <a className="workspace-link" href={dev ? studyHref(documentKey,currentSourcePage) : '#/dev?doc='+documentKey+'&page='+currentSourcePage}>{dev ? '← Torna allo studio' : 'DEV playground ↗'}</a></header>
    <ErrorBoundary><Suspense fallback={<div className="loading-screen" role="status">Caricamento componenti grafici…</div>}>
      {dev ? <DevPlayground /> : <StudyShell repository={repository} />}
    </Suspense></ErrorBoundary>
  </div>;
}
export function App() {
  const [documentKey,setDocumentKey]=useState<DocumentKey>(documentFromHash);
  const [repository, setRepository] = useState<ManifestRepository|null>(null);
  const [error, setError] = useState('');
  useEffect(()=>{const change=()=>setDocumentKey(documentFromHash());window.addEventListener('hashchange',change);return()=>window.removeEventListener('hashchange',change);},[]);
  useEffect(() => { let active = true;setRepository(null);setError('');loadManifest(documentKey).then(value => { if (active) setRepository(value); }).catch(reason => { if (active) setError(String(reason)); }); return () => { active = false; }; }, [documentKey]);
  if (error) return <div className="error-card" role="alert">{error}</div>;
  if (!repository||documentFromId(repository.manifest.document_id)!==documentKey) return <div className="loading-screen" role="status">Caricamento del corso…</div>;
  return <PageProvider key={repository.manifest.document_id} documentKey={documentKey} pageCount={repository.pageCount}><Workspace repository={repository} /></PageProvider>;
}
