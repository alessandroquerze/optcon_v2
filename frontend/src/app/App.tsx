import { Component, lazy, Suspense, useEffect, useState, type ReactNode } from 'react';
import { loadManifest, type ManifestRepository } from '../data/manifest';
import { PageProvider, usePageState } from './PageState';
import { StudyShell } from './StudyShell';
const DevPlayground = lazy(() => import('../dev/DevPlayground'));
class ErrorBoundary extends Component<{ children: ReactNode }, { error: string }> {
  state = { error: '' };
  static getDerivedStateFromError(error: Error) { return { error: error.message }; }
  render() { return this.state.error ? <div className="error-card" role="alert">{this.state.error}<p><a href="/">Ricarica l'applicazione</a></p></div> : this.props.children; }
}
function Workspace({ repository }: { repository: ManifestRepository }) {
  const [dev, setDev] = useState(location.hash.startsWith('#/dev'));
  const { currentSourcePage } = usePageState();
  useEffect(() => {
    const change = () => setDev(location.hash.startsWith('#/dev'));
    window.addEventListener('hashchange', change); return () => window.removeEventListener('hashchange', change);
  }, []);
  return <div className="app">
    <header className="app-header"><a className="brand" href={'#/study?page=' + currentSourcePage}><span className="brand-symbol">∫</span><span>OPTCON <span className="brand-muted">STUDIO</span></span></a>
      <span className="app-subtitle">Optimal Control and Reinforcement Learning</span>
      <a className="workspace-link" href={dev ? '#/study?page=' + currentSourcePage : '#/dev'}>{dev ? '← Torna allo studio' : 'DEV playground ↗'}</a></header>
    <ErrorBoundary><Suspense fallback={<div className="loading-screen" role="status">Caricamento componenti grafici…</div>}>
      {dev ? <DevPlayground /> : <StudyShell repository={repository} />}
    </Suspense></ErrorBoundary>
  </div>;
}
export function App() {
  const [repository, setRepository] = useState<ManifestRepository|null>(null);
  const [error, setError] = useState('');
  useEffect(() => { let active = true; loadManifest().then(value => { if (active) setRepository(value); }).catch(reason => { if (active) setError(String(reason)); }); return () => { active = false; }; }, []);
  if (error) return <div className="error-card" role="alert">{error}</div>;
  if (!repository) return <div className="loading-screen" role="status">Caricamento del corso…</div>;
  return <PageProvider pageCount={repository.pageCount}><Workspace repository={repository} /></PageProvider>;
}
