import { defineConfig } from '@playwright/test';
import base from './playwright.config';
process.env.STUDY_SCREENSHOT_DIR='../Docs/fullscreen_assets';
export default defineConfig({...base,outputDir:'test-results-fullscreen',
  reporter:[['list'],['json',{outputFile:process.env.FULLSCREEN_REPORT??'test-reports/fullscreen-browser.json'}]],
});
