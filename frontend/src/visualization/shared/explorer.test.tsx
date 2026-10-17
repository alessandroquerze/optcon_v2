import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
vi.mock('../core/SceneViewport',()=>({ SceneViewport:({label}:{label:string})=><div>{label}</div> }));
import { FunctionExplorer, initialView } from './FunctionExplorer';
import { ProjectionLink, useLinkedSelection } from './ProjectionLink';
const grid={id:'demo',x:[0,1],y:[0,1],z:[[0,1],[1,2]],axes:[{label:'x',unit:'1'},{label:'y',unit:'1'},{label:'f',unit:'1'}] as const};
describe('foundation 2D/3D', () => {
  it('rispetta la vista primaria definita dalla policy', () => {
    expect(initialView('3D_PRIMARY_WITH_2D')).toBe('3D');expect(initialView('2D_PRIMARY_WITH_3D')).toBe('2D');
  });
  it('toggle cambia vista senza alterare dati', () => {
    render(<FunctionExplorer id="test" grid={grid} policy="2D_AND_3D_EQUAL"/>);
    expect(screen.getByText('Contorno 2D')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button',{name:'3D'}));expect(screen.getByText('Superficie 3D')).toBeInTheDocument();
    expect(grid.z).toEqual([[0,1],[1,2]]);
  });
  it('offre entrambe le viste affiancate', () => {
    render(<FunctionExplorer id="test" grid={grid} policy="2D_AND_3D_EQUAL" display="side-by-side"/>);
    expect(screen.getByText('Contorno 2D')).toBeInTheDocument();expect(screen.getByText('Superficie 3D')).toBeInTheDocument();
  });
  it('aggiorna la policy passando a una pagina esclusivamente 2D',()=>{
    const {rerender}=render(<FunctionExplorer id="a" grid={grid} policy="3D_PRIMARY"/>);
    expect(screen.getByText('Superficie 3D')).toBeInTheDocument();
    rerender(<FunctionExplorer id="b" grid={grid} policy="2D_ONLY"/>);
    expect(screen.getByText('Contorno 2D')).toBeInTheDocument();
    expect(screen.queryByText('Superficie 3D')).toBeNull();
  });
  it('sincronizza selezione fra consumer 2D e 3D', () => {
    function Consumer({name}:{name:string}) {const s=useLinkedSelection();return <button onClick={()=>s?.select('sample')}>{name}:{s?.selectedId}</button>;}
    render(<ProjectionLink><Consumer name="2D"/><Consumer name="3D"/></ProjectionLink>);
    fireEvent.click(screen.getByText('2D:'));expect(screen.getByText('3D:sample')).toBeInTheDocument();
  });
});
