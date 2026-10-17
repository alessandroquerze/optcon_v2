import { useEffect, useId, useState, type ReactNode } from 'react';
export type NumericDomain =
  | { min: number; max: number; step?: number; integer?: boolean }
  | { choices: readonly number[] };
export function validNumericValue(value: number, domain: NumericDomain): boolean {
  return Number.isFinite(value) && ('choices' in domain ? domain.choices.includes(value) :
    value >= domain.min && value <= domain.max && (!domain.integer || Number.isInteger(value)));
}
export interface ParameterControlProps {
  label: string; value: number; onChange: (value: number) => void;
  domain: NumericDomain; unit?: string; description?: string;
  displayLabel?: ReactNode;
}
export function ParameterControl({ label, value, onChange, domain, unit = '', description, displayLabel }: ParameterControlProps) {
  const id = useId();
  const [draft, setDraft] = useState(String(value));
  const [error, setError] = useState('');
  useEffect(() => { setDraft(String(value)); setError(''); }, [value]);
  const commit = (text: string) => {
    setDraft(text);
    const number = text.trim() === '' ? NaN : Number(text);
    if (!validNumericValue(number, domain)) {
      setError('Inserisci un valore finito nel dominio indicato.'); return;
    }
    setError(''); onChange(number);
  };
  return <div className="parameter-control">
    <label htmlFor={id}>{displayLabel ?? label} {unit && <span className="unit">[{unit}]</span>}</label>
    {'choices' in domain
      ? <select id={id} aria-label={label} value={value} onChange={e => {
        const next = Number(e.target.value);
        if (e.target.value !== '' && validNumericValue(next, domain)) onChange(next);
      }}>
        {domain.choices.map(x => <option key={x} value={x}>{x}</option>)}</select>
      : <div className="parameter-inputs">
        <input aria-label={label + ' slider'} type="range" min={domain.min} max={domain.max} step={domain.step ?? .01}
          value={value} onChange={e => { setError(''); onChange(Number(e.target.value)); }} />
        <input id={id} aria-label={label + ' valore'} inputMode="decimal" type="text" value={draft}
          aria-invalid={Boolean(error)} aria-describedby={id + '-description'}
          onChange={e => commit(e.target.value)} onBlur={() => { if (error) setDraft(String(value)); }} />
      </div>}
    <small id={id + '-description'}>{error || description || ('choices' in domain ? 'Valori discreti' : domain.min + ' … ' + domain.max)}</small>
  </div>;
}
