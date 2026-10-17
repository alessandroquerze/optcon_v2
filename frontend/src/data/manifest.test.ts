import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { parseManifest, studentNotices } from './manifest';
const raw = JSON.parse(readFileSync(resolve(process.cwd(), '../Data/introduction_companion_manifest.json'), 'utf8'));
describe('manifest F04.1 reale', () => {
  it('indicizza tutte le 36 pagine fisiche', () => {
    const repo = parseManifest(raw);
    expect(repo.pageCount).toBe(36);
    expect(repo.bySourcePage.size).toBe(36);
    expect(repo.getPage(36).source_page).toBe(36);
    expect(() => repo.getPage(0)).toThrow();
    expect([...repo.verticalSlicePages]).toEqual([2,8,12,16,17,27,30,34]);
  });
  it('legge modalità, semantica, camera e interattività F04.1', () => {
    const repo = parseManifest(raw);
    expect(repo.manifest.pages.filter(p => p.visualization.threeDRequirements.enabled)).toHaveLength(27);
    expect(repo.getPage(6).interaction.enabled).toBe(false);
    expect(repo.getPage(6).interaction.effective_enabled).toBe(true);
    expect(repo.getPage(27).visualization.visualizationSemantics.zAxis?.symbol).toBe('v_y');
    expect(repo.getPage(16).visualization.threeDRequirements.cameraControls).toContain('orbit');
  });
  it('rifiuta una pagina mancante', () => {
    const value = structuredClone(raw); value.pages.splice(10,1);
    expect(() => parseManifest(value)).toThrow();
  });
  it('rifiuta indici fisici duplicati', () => {
    const value = structuredClone(raw); value.pages[1].source_page=1;
    expect(() => parseManifest(value)).toThrow();
  });
  it('rifiuta 3D senza un terzo asse', () => {
    const value = structuredClone(raw); value.pages[15].visualization.visualizationSemantics.zAxis=null;
    expect(() => parseManifest(value)).toThrow();
  });
  it('proietta soltanto i campi UI autorizzati di F03', () => {
    const page = parseManifest(raw).getPage(16);
    const notes = studentNotices(page);
    expect(notes[0].text).toBe(page.source_warning.student_notices[0].text);
    expect(JSON.stringify(notes)).not.toContain('correction_reason');
    expect(JSON.stringify(notes)).not.toContain('source_expression');
    expect(studentNotices(parseManifest(raw).getPage(31))).toEqual([]);
  });
  it('rifiuta warning aggiunti a NO_WARNING', () => {
    const value = structuredClone(raw);
    value.pages[0].source_warning.student_notices=value.pages[15].source_warning.student_notices;
    expect(() => parseManifest(value)).toThrow();
  });
});
