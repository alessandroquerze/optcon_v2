import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
interface LinkedSelection { selectedId: string | null; select: (id: string | null) => void; }
const Context = createContext<LinkedSelection | null>(null);
export function ProjectionLink({ initialId = null, selectedId: controlled, onSelect, children }: {
  initialId?: string|null; selectedId?: string|null; onSelect?: (id: string|null) => void; children: ReactNode;
}) {
  const [internal, setInternal] = useState(initialId);
  const select = useCallback((id: string|null) => { if (onSelect) onSelect(id); else setInternal(id); }, [onSelect]);
  const selectedId = controlled === undefined ? internal : controlled;
  const value = useMemo(() => ({ selectedId, select }), [selectedId, select]);
  return <Context value={value}>{children}</Context>;
}
export function useLinkedSelection() { return useContext(Context); }
export const Projection2D3D = ProjectionLink;
