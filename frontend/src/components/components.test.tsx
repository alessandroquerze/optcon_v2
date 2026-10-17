import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ParameterControl, validNumericValue } from './ParameterControl';
import { CompanionPage, EquationCard, SourceWarnings } from './CompanionPage';
import { StateInputTimeline } from './DataViews';
const note = { issue_id:'test',component:'WarningBanner' as const,text:'⚠ Test breve',color:'red' as const,adjacent_to:'formula',visible_when:'locale' };
describe('componenti riusabili', () => {
  it('renderizza KaTeX e la rappresentazione MathML', () => {
    const {container}=render(<EquationCard latex={'x^2+\\frac12'}/>);
    expect(container.querySelector('.katex')).toBeInTheDocument();
    expect(container.querySelector('math')?.isConnected).toBe(true);
  });
  it('segnala una formula non valida senza nascondere l’errore', () => {
    render(<EquationCard latex={'\\frac{'}/>);
    expect(screen.getByRole('alert')).toHaveTextContent('Formula non renderizzabile');
  });
  it('mostra solo warning pertinenti, senza motivazioni editoriali', () => {
    render(<><SourceWarnings notices={[note]} anchor="altro"/><SourceWarnings notices={[note]} anchor="formula"/></>);
    expect(screen.getAllByRole('note')).toHaveLength(1); expect(screen.getByRole('note')).toHaveTextContent('Test breve');
  });
  it('NO_WARNING non produce UI', () => {
    const {container}=render(<SourceWarnings notices={[]} anchor="formula"/>);
    expect(container).toBeEmptyDOMElement();
  });
  it('accetta input fuori dalla griglia slider, ma nel dominio', () => {
    function Control() { const [v,setV]=useState(1); return <><ParameterControl label="Peso" value={v} onChange={setV} domain={{min:0,max:5,step:.1}}/><output>{v}</output></>; }
    render(<Control/>);
    fireEvent.change(screen.getByLabelText('Peso valore'),{target:{value:'4.905'}});
    expect(screen.getByRole('status')).toHaveTextContent('4.905');
    expect(screen.getByRole('slider')).toHaveValue('4.905');
    fireEvent.change(screen.getByRole('slider'),{target:{value:'2'}});
    expect(screen.getByLabelText('Peso valore')).toHaveValue('2');
  });
  it('rifiuta valori infiniti, fuori dominio e non interi', () => {
    expect(validNumericValue(Infinity,{min:0,max:5})).toBe(false);
    expect(validNumericValue(6,{min:0,max:5})).toBe(false);
    expect(validNumericValue(.5,{min:0,max:5,integer:true})).toBe(false);
    const change=vi.fn(); render(<ParameterControl label="Numero" value={1} onChange={change} domain={{min:0,max:5}}/>);
    fireEvent.change(screen.getByLabelText('Numero valore'),{target:{value:'NaN'}});
    expect(change).not.toHaveBeenCalled(); expect(screen.getByLabelText('Numero valore')).toHaveAttribute('aria-invalid','true');
  });
  it('gestisce parametri discreti', () => {
    const change=vi.fn();render(<ParameterControl label="Passo" value={.1} onChange={change} domain={{choices:[.1,.2]}}/>);
    fireEvent.change(screen.getByRole('combobox'),{target:{value:'0.2'}});expect(change).toHaveBeenCalledWith(.2);
  });
  it('compone blocchi nell’ordine dell’archetipo senza contenuto di pagina hardcoded', () => {
    const {container}=render(<CompanionPage archetype="COMPARISON" blockOrder={['HEADER','FORMULA','TAKEAWAY']} blocks={{HEADER:'Titolo',FORMULA:'Formula',TAKEAWAY:'Idea'}}/>);
    expect(container.textContent).toBe('TitoloFormulaIdea');
  });
  it('timeline T=1 include x0,x1 e solo u0', () => {
    render(<StateInputTimeline states={['x0','x1']} inputs={['u0']}/>);
    expect(screen.getByLabelText('Timeline stato ingresso')).toHaveTextContent('x0u0 →x1');
    expect(screen.queryByText('u1')).toBeNull();
  });
});
