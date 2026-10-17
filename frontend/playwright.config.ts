import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './browser-tests', workers: 1, timeout: 120000,
  expect: { timeout: 30000 },
  reporter: [['list'], ['json', { outputFile: 'test-reports/browser-results.json' }]],
  use: {
    baseURL: 'http://127.0.0.1:5173', viewport: { width: 1500, height: 1000 },
    headless: true, channel: 'chrome',
    launchOptions: { args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] },
    screenshot: 'only-on-failure', trace: 'retain-on-failure',
  },
  webServer: { command: 'npm run dev', url: 'http://127.0.0.1:5173', reuseExistingServer: true, timeout: 120000 },
});
