/**
 * Fetch test assets for Pokemon cosplay pipeline (dry-run compatible)
 *
 * Usage:
 *   pnpm tsx scripts/fetch-assets.ts --target gardevoir
 */

import * as fs from 'fs';
import * as path from 'path';

const TARGET_POKEMON = process.argv.find(a => a.startsWith('--target='))?.split('=')[1] || 'gardevoir';
const ASSETS_DIR = path.resolve('assets');

async function fetchJson(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${url}`);
  return res.json();
}

async function fetchBuffer(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${url}`);
  return Buffer.from(await res.arrayBuffer());
}

async function main() {
  fs.mkdirSync(ASSETS_DIR, { recursive: true });

  // 1. Fetch target Pokemon artwork
  const pokemonData = await fetchJson(`https://pokeapi.co/api/v2/pokemon/${TARGET_POKEMON}`);
  const pokemonImgUrl = pokemonData.sprites.other['official-artwork'].front_default;
  if (!pokemonImgUrl) throw new Error(`No official artwork for ${TARGET_POKEMON}`);

  const pokemonBuf = await fetchBuffer(pokemonImgUrl);
  const pokemonPath = path.join(ASSETS_DIR, `${TARGET_POKEMON}.png`);
  fs.writeFileSync(pokemonPath, pokemonBuf);
  console.log(`[asset] Pokemon: ${TARGET_POKEMON} → ${pokemonPath}`);

  // 2. Fetch Pikachu artwork
  const pikachuData = await fetchJson('https://pokeapi.co/api/v2/pokemon/pikachu');
  const pikachuImgUrl = pikachuData.sprites.other['official-artwork'].front_default;
  const pikachuBuf = await fetchBuffer(pikachuImgUrl);
  const pikachuPath = path.join(ASSETS_DIR, 'pikachu.png');
  fs.writeFileSync(pikachuPath, pikachuBuf);
  console.log(`[asset] Pikachu → ${pikachuPath}`);

  // 3. Fetch anime waifu image
  const waifuRes = await fetchJson('https://api.waifu.pics/sfw/waifu');
  const waifuImgUrl = waifuRes.url;
  if (!waifuImgUrl) throw new Error('No waifu image returned');
  const waifuBuf = await fetchBuffer(waifuImgUrl);
  const waifuPath = path.join(ASSETS_DIR, 'waifu.jpg');
  fs.writeFileSync(waifuPath, waifuBuf);
  console.log(`[asset] Waifu → ${waifuPath}`);

  // Save metadata
  const meta = {
    targetPokemon: TARGET_POKEMON,
    pokemonPath: `assets/${TARGET_POKEMON}.png`,
    pikachuPath: 'assets/pikachu.png',
    waifuPath: 'assets/waifu.jpg',
    fetchedAt: new Date().toISOString(),
  };
  fs.writeFileSync(path.join(ASSETS_DIR, 'meta.json'), JSON.stringify(meta, null, 2));
  console.log('[asset] Metadata saved → assets/meta.json');
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
