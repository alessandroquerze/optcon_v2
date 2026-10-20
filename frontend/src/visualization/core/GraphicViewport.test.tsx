import { act,fireEvent,render,screen,waitFor } from '@testing-library/react';
import { beforeEach,afterEach,it,expect,vi } from 'vitest';
import { useRef } from 'react';
import { AutoGraphicFullscreen,GraphicViewport } from './GraphicViewport';
let full:Element|null=null;
const request=vi.fn(function(this:HTMLElement){full=this;document.dispatchEvent(new Event('fullscreenchange'));return Promise.resolve();});
const exit=vi.fn(()=>{full=null;document.dispatchEvent(new Event('fullscreenchange'));return Promise.resolve();});
beforeEach(()=>{
  full=null;request.mockClear();exit.mockClear();
  Object.defineProperty(document,'fullscreenElement',{configurable:true,get:()=>full});
  Object.defineProperty(document,'exitFullscreen',{configurable:true,value:exit});
  Object.defineProperty(HTMLElement.prototype,'requestFullscreen',{configurable:true,value:request});
  Object.defineProperty(HTMLElement.prototype,'showPopover',{configurable:true,value:vi.fn(function(this:HTMLElement){this.style.display='block';})});
  Object.defineProperty(HTMLElement.prototype,'hidePopover',{configurable:true,value:vi.fn(function(this:HTMLElement){this.style.removeProperty('display');})});
});
afterEach(()=>{document.body.style.overflow='';delete (HTMLElement.prototype as Partial<HTMLElement>).requestFullscreen;});
const open=()=>fireEvent.click(screen.getByRole('button',{name:'Apri a schermo intero: Test'}));
it('espande gli stessi nodi e ripristina ruolo, scroll e focus senza perdere i valori',async()=>{
  const {container}=render(<article className="companion-page" aria-label="Lezione"><GraphicViewport label="Test"><input aria-label="Parametro" defaultValue="7"/></GraphicViewport></article>);
  const field=screen.getByLabelText('Parametro'),trigger=screen.getByRole('button',{name:'Apri a schermo intero: Test'});
  trigger.focus();open();await screen.findByRole('dialog',{name:'Test — schermo intero'});
  expect(screen.getByLabelText('Parametro')).toBe(field);fireEvent.change(field,{target:{value:'9'}});
  fireEvent.click(screen.getByRole('button',{name:'Esci da schermo intero'}));
  await waitFor(()=>expect(screen.queryByRole('dialog')).toBeNull());
  expect(field).toHaveValue('9');expect(trigger).toHaveFocus();expect(container.querySelector('article')).toHaveAttribute('aria-label','Lezione');
  expect(document.body.style.overflow).toBe('');
});
it('reagisce anche all’uscita nativa del browser',async()=>{
  render(<GraphicViewport label="Test"><span>Grafico</span></GraphicViewport>);open();await screen.findByRole('dialog');
  await act(async()=>{full=null;document.dispatchEvent(new Event('fullscreenchange'));});
  expect(screen.queryByRole('dialog')).toBeNull();expect(screen.getByText('Grafico')).toBeVisible();
});
it('usa il top layer popover se la richiesta nativa è negata ed esce con Esc',async()=>{
  request.mockImplementationOnce(()=>Promise.reject(new Error('denied')));
  render(<GraphicViewport label="Test"><span>Grafico</span></GraphicViewport>);open();
  const dialog=await screen.findByRole('dialog');expect(dialog).toHaveAttribute('popover','manual');
  expect(dialog).toHaveAttribute('data-graphic-fullscreen','popover');
  fireEvent.keyDown(document,{key:'Escape'});await waitFor(()=>expect(screen.queryByRole('dialog')).toBeNull());
  expect(dialog).not.toHaveAttribute('popover');
});
it('una richiesta fallita non lascia overlay o scroll bloccati',async()=>{
  request.mockImplementationOnce(()=>Promise.reject(new Error('denied')));
  Object.defineProperty(HTMLElement.prototype,'showPopover',{configurable:true,value:undefined});
  render(<GraphicViewport label="Test"><span>Grafico</span></GraphicViewport>);open();
  expect(await screen.findByRole('status')).toHaveTextContent('non disponibile');
  expect(screen.queryByRole('dialog')).toBeNull();expect(document.body.style.overflow).toBe('');
});
it('rilascia il fullscreen quando il grafico viene smontato',async()=>{
  const {unmount}=render(<GraphicViewport label="Test"><span>Grafico</span></GraphicViewport>);open();await screen.findByRole('dialog');
  await act(async()=>unmount());expect(exit).toHaveBeenCalled();expect(document.body.style.overflow).toBe('');
});
it('annulla una richiesta ancora pendente se la pagina cambia',async()=>{
  let resolve!:()=>void;
  request.mockImplementationOnce(function(this:HTMLElement){const root=this;return new Promise<void>(done=>{resolve=()=>{full=root;done();};});});
  const {unmount}=render(<GraphicViewport label="Test"><span>Grafico</span></GraphicViewport>);open();unmount();
  await act(async()=>resolve());expect(exit).toHaveBeenCalled();expect(document.body.style.overflow).toBe('');
});
it('un gruppo combinato ha un solo ingresso fullscreen e conserva i grafici figli',()=>{
  render(<GraphicViewport label="Test"><GraphicViewport label="2D">Primo</GraphicViewport><GraphicViewport label="3D">Secondo</GraphicViewport></GraphicViewport>);
  expect(screen.getAllByRole('button',{name:/Apri a schermo intero/})).toHaveLength(1);
  expect(screen.getByText('Primo')).toBeVisible();expect(screen.getByText('Secondo')).toBeVisible();
});

function InlineDemo({version='a'}:{version?:string}){
  const scope=useRef<HTMLElement>(null);
  return <article ref={scope} className="companion-page">
    <div><svg key={version} role="img" aria-label={'Inline '+version} viewBox="0 0 100 100"/></div>
    <div className="js-plotly-plot"><svg role="img" aria-label="Plotly internal"/></div>
    <GraphicViewport label="Wrapped"><svg role="img" aria-label="Already wrapped"/></GraphicViewport>
    <AutoGraphicFullscreen scope={scope}/>
  </article>;
}
function mockResize(){
  vi.stubGlobal('ResizeObserver',class {observe(){}unobserve(){}disconnect(){}});
}
afterEach(()=>vi.unstubAllGlobals());
it('copre gli SVG inline ed esclude gli SVG interni o già coperti da un wrapper',async()=>{
  mockResize();render(<InlineDemo/>);
  const trigger=await screen.findByRole('button',{name:'Apri a schermo intero: Inline a'});
  expect(screen.getAllByRole('button',{name:/Apri a schermo intero/})).toHaveLength(2);
  fireEvent.click(trigger);await screen.findByRole('dialog');
  expect(screen.getByRole('img',{name:'Inline a'})).toHaveAttribute('data-fullscreen-target','true');
  fireEvent.keyDown(document,{key:'Escape'});await waitFor(()=>expect(screen.queryByRole('dialog')).toBeNull());
});
it('collega il comando al nuovo SVG quando un diagramma inline viene sostituito',async()=>{
  mockResize();const {rerender}=render(<InlineDemo/>);
  await screen.findByRole('button',{name:'Apri a schermo intero: Inline a'});
  rerender(<InlineDemo version="b"/>);
  fireEvent.click(await screen.findByRole('button',{name:'Apri a schermo intero: Inline b'}));
  await screen.findByRole('dialog');
  expect(screen.getByRole('img',{name:'Inline b'})).toHaveAttribute('data-fullscreen-target','true');
});
