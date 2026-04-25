/**
 * Pokemon Cosplay Generation Pipeline — DRY-RUN
 *
 * Scenarios:
 *   A. Pikachu cosplaying another Pokemon
 *   B. Anime waifu wearing Pokemon-inspired outfit
 */

import * as fs from 'fs';
import * as path from 'path';

const DRY_RUN = true;  // Set false to call real Gemini API
const OUTPUT_DIR = path.resolve('output');
const ASSETS_DIR = path.resolve('assets');

// ─── Types ──────────────────────────────────────────────────────────────

type Part =
  | { text: string }
  | { inlineData: { data: string; mimeType: string } }
  | { fileData: { fileUri: string; mimeType: string } };

interface GenResult {
  imageBase64: string;
  thoughtSignature?: string;
  modelDescription?: string;
  seed: number;
}

interface JudgeOutput {
  scores: Record<string, { score: number; notes: string }>;
  converged: boolean;
  top_issues: Array<{ issue: string; fix: string }>;
  next_iteration_focus: string;
}

interface IterationRecord {
  round: number;
  prompt: string;
  judge: JudgeOutput;
  outputPath: string;
}

// ─── Helpers ────────────────────────────────────────────────────────────

function toBase64(filePath: string): string {
  return fs.readFileSync(filePath).toString('base64');
}

function saveImageFromBase64(name: string, b64: string): string {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  const p = path.join(OUTPUT_DIR, name);
  fs.writeFileSync(p, Buffer.from(b64, 'base64'));
  return p;
}

function partsToDigest(parts: Part[]): string {
  return parts
    .map((p, i) => {
      if ('text' in p) return `[${i}] text: "${p.text.slice(0, 60)}..."`;
      if ('inlineData' in p) return `[${i}] inlineData: ${p.inlineData.mimeType}`;
      if ('fileData' in p) return `[${i}] fileData: ${p.fileData.fileUri.slice(0, 40)}...`;
      return `[${i}] unknown`;
    })
    .join('\n  ');
}

// ─── Dry-run stubs ──────────────────────────────────────────────────────

async function dryRunGenerate(
  _model: string,
  parts: Part[],
  _config: any,
): Promise<GenResult> {
  console.log('\n[DRY-RUN generateContent]');
  console.log('  Parts:\n  ', partsToDigest(parts));

  // Return a 1x1 red PNG as fake image
  const fakeImageBase64 =
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==';
  return {
    imageBase64: fakeImageBase64,
    thoughtSignature: 'fake_sig_' + Math.random().toString(36).slice(2),
    modelDescription: 'DRY-RUN: generated placeholder image',
    seed: 42,
  };
}

async function dryRunJudge(_model: string, parts: Part[]): Promise<JudgeOutput> {
  console.log('\n[DRY-RUN judge]');
  console.log('  Parts:\n  ', partsToDigest(parts));

  // Simulate non-converged on first round, converged on second
  const round = globalJudgeRound++;
  const converged = round >= 1;
  return {
    scores: {
      identity_preservation: { score: converged ? 4 : 3, notes: 'Face mostly kept' },
      outfit_fidelity: { score: converged ? 4 : 2, notes: 'Colors need adjustment' },
      style_consistency: { score: converged ? 5 : 3, notes: 'Slightly inconsistent lighting' },
      overall: { score: converged ? 4 : 3, notes: 'Good base' },
    },
    converged,
    top_issues: converged
      ? []
      : [
          {
            issue: 'Outfit color mismatch with reference Pokemon',
            fix: 'Shift dominant clothing colors to match the reference palette more closely',
          },
        ],
    next_iteration_focus: converged ? 'None — converged' : 'Color palette alignment',
  };
}

let globalJudgeRound = 0;

// ─── Pipeline core ──────────────────────────────────────────────────────

async function generateSceneA(pokemonTarget: string): Promise<IterationRecord[]> {
  console.log('\n========== SCENE A: Pikachu cosplaying ' + pokemonTarget + ' ==========');

  const pikachuB64 = toBase64(path.join(ASSETS_DIR, 'pikachu.png'));
  const targetB64 = toBase64(path.join(ASSETS_DIR, `${pokemonTarget}.png`));

  const basePrompt = `A cosplay illustration where Pikachu wears ${pokemonTarget}'s signature colors, accessories, and key visual motifs, while clearly remaining Pikachu. Maintain cute expression, Pikachu body shape, and electric cheek marks.`;

  const parts: Part[] = [
    { inlineData: { data: targetB64, mimeType: 'image/png' } },
    { text: '⚠️ COSTUME REFERENCE — COPY ONLY: match colors, accessories, and motifs. Do NOT render this character as the subject.' },
    { inlineData: { data: pikachuB64, mimeType: 'image/png' } },
    { text: basePrompt },
  ];

  const history: IterationRecord[] = [];
  let lastThoughtSig: string | undefined;
  let lastImageBase64: string | undefined;

  for (let round = 0; round < 3; round++) {
    let genResult: GenResult;

    if (round === 0) {
      genResult = await (DRY_RUN
        ? dryRunGenerate('gemini-3.1-flash-image-preview', parts, {
            responseModalities: ['TEXT', 'IMAGE'],
            imageConfig: { aspectRatio: '1:1' },
            thinkingConfig: { thinkingLevel: 'MINIMAL' },
          })
        : (() => {
            throw new Error('Real API not implemented in this dry-run script');
          })());
    } else {
      const refineInstruction = history[round - 1].judge.top_issues[0]?.fix || 'Improve details';
      const turn0 = parts;
      const turn1: Part[] = [];
      if (lastThoughtSig) {
        turn1.push({ text: lastThoughtSig, thoughtSignature: lastThoughtSig } as any);
      }
      if (lastImageBase64) {
        turn1.push({ inlineData: { data: lastImageBase64, mimeType: 'image/png' }, thoughtSignature: lastThoughtSig } as any);
      }
      const turn2: Part[] = [{ text: refineInstruction }];

      genResult = await dryRunGenerate('gemini-3.1-flash-image-preview', [], {
        contents: [
          { role: 'user', parts: turn0 },
          { role: 'model', parts: turn1 },
          { role: 'user', parts: turn2 },
        ],
      });
    }

    const outPath = saveImageFromBase64(`sceneA_round${round}.png`, genResult.imageBase64);
    lastThoughtSig = genResult.thoughtSignature;
    lastImageBase64 = genResult.imageBase64;

    // Judge
    const judgePrompt = `Evaluate this generated image.

Scoring (1-5):
- pikachu_identity: Does it remain clearly Pikachu? (cheeks, ears, shape)
- cosplay_fidelity: Are ${pokemonTarget}'s colors/accessories accurately represented?
- style_consistency: Is the art style consistent?
- overall: Overall quality

Output JSON with: { scores: {...}, converged: boolean, top_issues: [{issue, fix}], next_iteration_focus: string }`;

    const judgeResult = await dryRunJudge('gemini-2.5-flash', [
      { inlineData: { data: genResult.imageBase64, mimeType: 'image/png' } },
      { text: judgePrompt },
    ]);

    history.push({ round, prompt: basePrompt, judge: judgeResult, outputPath: outPath });
    console.log(`[Scene A Round ${round}] converged=${judgeResult.converged} → ${outPath}`);

    if (judgeResult.converged) break;
  }

  return history;
}

async function generateSceneB(pokemonTarget: string): Promise<IterationRecord[]> {
  console.log('\n========== SCENE B: Waifu wearing ' + pokemonTarget + '-inspired outfit ==========');

  const waifuB64 = toBase64(path.join(ASSETS_DIR, 'waifu.jpg'));
  const targetB64 = toBase64(path.join(ASSETS_DIR, `${pokemonTarget}.png`));

  const basePrompt = `A full-body anime character illustration where the character wears a fashion outfit inspired by ${pokemonTarget}'s color palette, silhouette, and signature visual motifs. The character must remain the same person from the reference image (same face, hair, body type).`;

  const parts: Part[] = [
    { inlineData: { data: targetB64, mimeType: 'image/png' } },
    { text: '⚠️ DESIGN REFERENCE — COPY ONLY: match colors, shapes, and motifs. Do NOT replace the character.' },
    { inlineData: { data: waifuB64, mimeType: 'image/jpeg' } },
    { text: basePrompt },
  ];

  const history: IterationRecord[] = [];

  for (let round = 0; round < 3; round++) {
    const genResult = await dryRunGenerate('gemini-3.1-flash-image-preview', parts, {
      responseModalities: ['TEXT', 'IMAGE'],
      imageConfig: { aspectRatio: '1:1' },
      thinkingConfig: { thinkingLevel: 'MINIMAL' },
    });

    const outPath = saveImageFromBase64(`sceneB_round${round}.png`, genResult.imageBase64);

    const judgePrompt = `Evaluate this generated image.

Scoring (1-5):
- character_preservation: Same face, hair, body type from reference?
- pokemon_inspiration: ${pokemonTarget} colors/elements integrated well?
- outfit_coherence: Does the outfit look natural, not pasted-on?
- overall: Overall quality

Output JSON with: { scores: {...}, converged: boolean, top_issues: [{issue, fix}], next_iteration_focus: string }`;

    const judgeResult = await dryRunJudge('gemini-2.5-flash', [
      { inlineData: { data: genResult.imageBase64, mimeType: 'image/png' } },
      { text: judgePrompt },
    ]);

    history.push({ round, prompt: basePrompt, judge: judgeResult, outputPath: outPath });
    console.log(`[Scene B Round ${round}] converged=${judgeResult.converged} → ${outPath}`);

    if (judgeResult.converged) break;

    // Simple prompt append for dry-run
    const fix = judgeResult.top_issues[0]?.fix || 'Improve details';
    parts.push({ text: `Additional requirement: ${fix}` });
  }

  return history;
}

// ─── Main ───────────────────────────────────────────────────────────────

async function main() {
  const metaPath = path.join(ASSETS_DIR, 'meta.json');
  if (!fs.existsSync(metaPath)) {
    console.error('Run `pnpm tsx scripts/fetch-assets.ts --target=<pokemon>` first');
    process.exit(1);
  }
  const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
  const target = meta.targetPokemon;

  const resultA = await generateSceneA(target);
  const resultB = await generateSceneB(target);

  const report = {
    dryRun: true,
    targetPokemon: target,
    sceneA: resultA.map(r => ({
      round: r.round,
      output: path.basename(r.outputPath),
      converged: r.judge.converged,
      scores: r.judge.scores,
      next_focus: r.judge.next_iteration_focus,
    })),
    sceneB: resultB.map(r => ({
      round: r.round,
      output: path.basename(r.outputPath),
      converged: r.judge.converged,
      scores: r.judge.scores,
      next_focus: r.judge.next_iteration_focus,
    })),
  };

  const reportPath = path.join(OUTPUT_DIR, 'report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`\n[done] Report saved → ${reportPath}`);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
