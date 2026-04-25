/**
 * Run the Pokemon pipeline and load results into the gemini-imagen-patterns web-ui Demo mode.
 *
 * Usage:
 *   EXAMPLES_DIR=./assets pnpm tsx scripts/load-demo.ts
 *
 * This script:
 * 1. Runs scripts/pipeline.ts to generate rounds
 * 2. POSTs the report to the web-ui's /api/load-state endpoint
 */

import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

const WEB_UI_LOAD_STATE_URL = process.env.WEB_UI_URL || 'http://localhost:3001/api/load-state';
const REPORT_PATH = path.resolve('output/report.json');

async function main() {
  console.log('[load-demo] Running pipeline...');
  execSync('pnpm tsx scripts/pipeline.ts', { stdio: 'inherit' });

  if (!fs.existsSync(REPORT_PATH)) {
    console.error('[load-demo] report.json not found');
    process.exit(1);
  }

  const report = JSON.parse(fs.readFileSync(REPORT_PATH, 'utf8'));

  // Convert report to demo-state format expected by DemoView
  const toRounds = (scene: any[]) =>
    scene.map((r: any) => ({
      round: r.round,
      output: r.output,
      converged: r.converged,
      scores: r.scores,
      next_focus: r.next_focus,
    }));

  const demoState = {
    sceneA: toRounds(report.sceneA),
    sceneB: toRounds(report.sceneB),
  };

  const res = await fetch(WEB_UI_LOAD_STATE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(demoState),
  });

  if (!res.ok) {
    console.error(`[load-demo] Failed to POST demo state: ${res.status}`);
    process.exit(1);
  }

  console.log('[load-demo] Demo state loaded successfully');
  console.log(`[load-demo] Open http://localhost:5173/#demo to view`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
