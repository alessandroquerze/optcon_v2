import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { boundedPage, parsePageInput, PageProvider, usePageState } from './PageState';
function Consumers() {
  const s = usePageState();
  return <><output data-testid="pdf">{s.currentSourcePage}</output><output data-testid="companion">{s.currentSourcePage}</output>
    <button onClick={s.next}>Next</button><button onClick={s.previous}>Previous</button><button onClick={() => s.goToPage(12)}>Jump</button></>;
}
describe('single source of truth', () => {
  it.each([[0,1],[37,36],[-5,1],[12,12],[NaN,1]])('limita %s a %s', (value, expected) => expect(boundedPage(value,36)).toBe(expected));
  it('interpreta jump interi con bounds e rifiuta testo/decimali', () => {
    expect(parsePageInput('100',36)).toBe(36); expect(parsePageInput('0',36)).toBe(1);
    expect(parsePageInput('1.2',36)).toBeNull(); expect(parsePageInput('',36)).toBeNull();
  });
  it('sincronizza due consumer, Next, Previous e jump', () => {
    history.replaceState(null,'','#/study?page=1');
    render(<PageProvider pageCount={36}><Consumers/></PageProvider>);
    fireEvent.click(screen.getByText('Next'));
    expect(screen.getByTestId('pdf')).toHaveTextContent('2'); expect(screen.getByTestId('companion')).toHaveTextContent('2');
    fireEvent.click(screen.getByText('Previous')); expect(screen.getByTestId('pdf')).toHaveTextContent('1');
    fireEvent.click(screen.getByText('Jump')); expect(screen.getByTestId('companion')).toHaveTextContent('12');
  });
  it('non oltrepassa prima e ultima pagina', () => {
    history.replaceState(null,'','#/study?page=36');
    render(<PageProvider pageCount={36}><Consumers/></PageProvider>);
    fireEvent.click(screen.getByText('Next')); expect(screen.getByTestId('pdf')).toHaveTextContent('36');
  });
});
