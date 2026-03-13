# Pokemon 开发辅助 Skill - 实现计划

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 创建完整的 pokemon-dev skill，包含战斗模拟、数据 API、扩展接口和地图数据的参考文档

**Architecture:** 使用 SKILL.md 作为主入口，references/ 目录下按功能分类存放参考文档

**Tech Stack:** Markdown 文档格式

---

## 文件结构

```
pokemon-dev/
├── SKILL.md
└── references/
    ├── battle/
    │   ├── pkmn-sim.md
    │   ├── pkmn-dex.md
    │   ├── pkmn-sets.md
    │   ├── pkmn-randoms.md
    │   ├── pkmn-mods.md
    │   └── smogon-calc.md
    ├── api/
    │   ├── pokeapi-rest.md
    │   └── pokeapi-graphql.md
    ├── extend/
    │   ├── pokemon.md
    │   ├── moves.md
    │   ├── abilities.md
    │   ├── items.md
    │   ├── types.md
    │   ├── weather.md
    │   └── conditions.md
    └── tilemap/
        ├── pokered.md
        └── porymap.md
```

---

## Chunk 1: 创建 SKILL.md 主文件

### Task 1: 创建 SKILL.md 主入口文件

**Files:**
- Create: `C:/code/pokemon-skill/SKILL.md`

- [ ] **Step 1: 创建 SKILL.md 主文件**

```markdown
---
name: pokemon-dev
description: Use when developing Pokemon games - provides documentation on battle simulation APIs (@pkmn/sim, @smogon/calc), data sources (PokéAPI), and how to extend with custom Pokemon, moves, abilities, items, types, weather, and map data.
---

# Pokemon 开发辅助 Skill

本 Skill 提供宝可梦游戏开发所需的开源项目和 API 参考文档。

## 目录

### 战斗模拟
- [pkmn/sim](references/battle/pkmn-sim.md) - 战斗模拟器
- [pkmn/dex](references/battle/pkmn-dex.md) - 统一数据层
- [pkmn/sets](references/battle/pkmn-sets.md) - 队伍解析
- [pkmn/randoms](references/battle/pkmn-randoms.md) - 随机队伍生成
- [pkmn/mods](references/battle/pkmn-mods.md) - 自定义扩展
- [smogon/calc](references/battle/smogon-calc.md) - 伤害计算

### 数据 API
- [PokéAPI REST](references/api/pokeapi-rest.md) - REST API
- [PokéAPI GraphQL](references/api/pokeapi-graphql.md) - GraphQL API

### 扩展接口
- [添加精灵](references/extend/pokemon.md)
- [添加技能](references/extend/moves.md)
- [添加特性](references/extend/abilities.md)
- [添加道具](references/extend/items.md)
- [添加属性](references/extend/types.md)
- [添加天气/地形](references/extend/weather.md)
- [添加状态/效果](references/extend/conditions.md)

### 地图数据
- [pret/pokered](references/tilemap/pokered.md) - 地图区块数据
- [Porymap](references/tilemap/porymap.md) - 地图编辑器

## 快速开始

### 安装依赖
```bash
npm install @pkmn/sim @pkmn/dex @pkmn/sets @pkmn/randoms @pkmn/mods @smogon/calc
```

### 基础示例：创建战斗
```typescript
import { BattleStreams } from '@pkmn/sim';

const streams = BattleStreams.getPlayerStreams(new BattleStreams.BattleStream());
// ...
```

## 库之间的协作

- @pkmn/dex 提供数据给 @pkmn/sim
- @pkmn/sets 依赖 @pkmn/dex 进行名称转换
- @pkmn/randoms 使用 @pkmn/sim 生成队伍
- @pkmn/mods 可修改 @pkmn/dex 中的任意数据
```

- [ ] **Step 2: 提交 SKILL.md**

```bash
git add SKILL.md
git commit -m "feat: create SKILL.md main entry point"
```

---

## Chunk 2: 战斗模拟文档 (第一部分)

### Task 2: 创建 pkmn-sim.md

**Files:**
- Create: `C:/code/pokemon-skill/references/battle/pkmn-sim.md`

- [ ] **Step 1: 写入 pkmn-sim.md 文档**

```markdown
# @pkmn/sim - 战斗模拟器

## 安装

```bash
npm install @pkmn/sim
```

## 概述

@pkmn/sim 是 Pokemon Showdown 战斗模拟器的模块化版本，提供完整的对战逻辑。

## 基础用法

### 创建战斗

```typescript
import { BattleStreams } from '@pkmn/sim';
import { Dex } from '@pkmn/dex';

// 创建玩家流
const streams = BattleStreams.getPlayerStreams(new BattleStreams.BattleStream());

// 创建精灵
const p1 = new Dex.forGen(8).species.get('Charizard');
const p2 = new Dex.forGen(8).species.get('Blastoise');

// 启动战斗
const spec = { formatid: 'gen8oubles' };
const p1spec = { name: 'Player 1', team: Teams.pack([{ species: 'Charizard' }]) };
const p2spec = { name: 'Player 2', team: Teams.pack([{ species: 'Blastoise' }]) };

// 写入开始指令
streams.omniscient.write(`>start ${JSON.stringify(spec)}`);
streams.omniscient.write(`>player p1 ${JSON.stringify(p1spec)}`);
streams.omniscient.write(`>player p2 ${JSON.stringify(p2spec)}`);
```

### 处理战斗回合

```typescript
// 读取战斗结果
const chunk = await streams.battle.read();
console.log(chunk);

// 执行技能
streams.p1.write(`>p1 move 1`); // 使用第一个技能
```

### 获取战斗结果

```typescript
const result = await streams.battle.end();
console.log(result);
```

## 核心 API

| API | 描述 |
|-----|------|
| BattleStreams.getPlayerStreams() | 创建玩家通信流 |
| BattleStreams.BattleStream() | 创建战斗流 |
| Dex.forGen(n) | 获取指定世代的数据 |

## 扩展阅读

- 完整协议: [PROTOCOL.md](https://github.com/pkmn/ps/blob/main/sim/PROTOCOL.md)
- SIM-PROTOCOL: [SIM-PROTOCOL.md](https://github.com/pkmn/ps/blob/main/sim/SIM-PROTOCOL.md)
```

- [ ] **Step 2: 提交 pkmn-sim.md**

```bash
git add references/battle/pkmn-sim.md
git commit -m "docs: add pkmn/sim documentation"
```

### Task 3: 创建 pkmn-dex.md

**Files:**
- Create: `C:/code/pokemon-skill/references/battle/pkmn-dex.md`

- [ ] **Step 1: 写入 pkmn-dex.md 文档**

```markdown
# @pkmn/dex - 统一数据层

## 安装

```bash
npm install @pkmn/dex
```

## 概述

@pkmn/dex 是 Pokemon Showdown 数据的统一接口，可查询精灵、技能、特性、道具体等数据。

## 基础用法

### 获取精灵数据

```typescript
import { Dex } from '@pkmn/dex';

const dex = Dex.forGen(8);
const charizard = dex.species.get('Charizard');

console.log(charizard.types);        // ['Fire', 'Flying']
console.log(charizard.baseStats);    // { hp: 78, atk: 84, def: 78, spa: 109, spd: 85, spe: 100 }
console.log(charizard.abilities);    // { '0': 'Blaze', 'H': 'Solar Power' }
```

### 获取技能数据

```typescript
const flamethrower = dex.moves.get('Flamethrower');
console.log(flamethrower.type);      // 'Fire'
console.log(flamethrower.basePower); // 90
console.log(flamethrower.accuracy);  // 100
console.log(flamethrower.category);  // 'Special'
```

### 获取特性数据

```typescript
const blaze = dex.abilities.get('Blaze');
console.log(blaze.desc);             // description
```

### 获取道具体数据

```typescript
const choiceSpecs = dex.items.get('Choice Specs');
console.log(choiceSpecs.desc);       // description
```

### 属性克制计算

```typescript
const fireType = dex.types.get('Fire');
console.log(fireType.damageTaken);   // { Fire: 1, Water: 2, Grass: 0, ... }

// 计算伤害倍数
console.log(dex.types.get('Fire').effectiveAgainst('Grass')); // 2
console.log(dex.types.get('Fire').effectiveAgainst('Water')); // 0.5
```

## 数据迭代

```typescript
// 遍历所有精灵
for (const pokemon of dex.species) {
  console.log(pokemon.name);
}

// 查询符合条件的精灵
const firePokemons = [...dex.species].filter(p => p.types.includes('Fire'));
```

## 世代处理

```typescript
const gen1 = Dex.forGen(1);  // 原始 151
const gen9 = Dex.forGen(9);  // 最新世代
```

## 扩展阅读

- GitHub: https://github.com/pkmn/ps/tree/main/dex
```

- [ ] **Step 2: 提交 pkmn-dex.md**

```bash
git add references/battle/pkmn-dex.md
git commit -m "docs: add pkmn/dex documentation"
```

### Task 4: 创建 pkmn-sets.md

**Files:**
- Create: `C:/code/pokemon-skill/references/battle/pkmn-sets.md`

- [ ] **Step 1: 写入 pkmn-sets.md 文档**

```markdown
# @pkmn/sets - 队伍解析

## 安装

```bash
npm install @pkmn/sets
```

## 概述

@pkmn/sets 提供 Pokemon Showdown 队伍字符串的解析和导出功能。

## 基础用法

### 解析队伍字符串

```typescript
import { Sets } from '@pkmn/sets';

const set = Sets.importSet(
`Tangrowth @ Assault Vest
Ability: Regenerator
EVs: 248 HP / 8 Def / 252 SpD
Sassy Nature
IVs: 30 Atk / 30 Def
- Giga Drain
- Knock Off
- Hidden Power [Ice]
- Earthquake`
);

console.log(set.name);        // 'Tangrowth'
console.log(set.item);        // 'Assault Vest'
console.log(set.ability);     // 'Regenerator'
console.log(set.evs);         // { hp: 248, def: 8, spd: 252 }
console.log(set.nature);      // 'Sassy'
console.log(set.moves);        // ['Giga Drain', 'Knock Off', 'Hidden Power Ice', 'Earthquake']
```

### 打包队伍 (用于传输)

```typescript
import { Sets } from '@pkmn/sets';
import { Dex } from '@pkmn/dex';

const dex = Dex.forGen(8);
const packed = Sets.pack({
  name: 'Charizard',
  species: 'Charizard',
  item: 'Choice Scarf',
  ability: 'Blaze',
  nature: 'Timid',
  evs: { spa: 252, spe: 252, hp: 6 },
  moves: ['Flamethrower', 'Fire Blast', 'Air Slash', 'Roost']
}, dex);

console.log(packed);
// 'Charizard|ChoiceScarf|Blaze|Flamethrower,FireBlast,AirSlash,Roost|Timid|252,,,252,6|||||'
```

### 解包队伍

```typescript
const unpacked = Sets.unpack(
  'Charizard|ChoiceScarf|Blaze|Flamethrower,FireBlast,AirSlash,Roost|Timid|252,,,252,6|||||',
  Dex.forGen(8)
);
```

### 生成队伍

```typescript
import { Sets } from '@pkmn/sets';

const teamString = Sets.exportTeam([
  { name: 'Charizard', species: 'Charizard', item: 'Choice Scarf', ability: 'Blaze', moves: ['Flamethrower'] },
  { name: 'Blastoise', species: 'Blastoise', item: 'Shell Armor', moves: ['Hydro Pump'] }
]);
```

## 数据格式

### 队伍对象结构

```typescript
interface PokemonSet {
  name?: string;
  species: string;
  item?: string;
  ability?: string;
  nature?: string;
  evs?: { hp?: number, atk?: number, def?: number, spa?: number, spd?: number, spe?: number };
  ivs?: { hp?: number, atk?: number, def?: number, spa?: number, spd?: number, spe?: number };
  moves?: string[];
  gender?: 'M' | 'F';
  level?: number;
  shiny?: boolean;
}
```

## 扩展阅读

- GitHub: https://github.com/pkmn/ps/tree/main/sets
```

- [ ] **Step 2: 提交 pkmn-sets.md**

```bash
git add references/battle/pkmn-sets.md
git commit -m "docs: add pkmn/sets documentation"
```

---

## Chunk 3: 战斗模拟文档 (第二部分)

### Task 5: 创建 pkmn-randoms.md

**Files:**
- Create: `C:/code/pokemon-skill/references/battle/pkmn-randoms.md`

- [ ] **Step 1: 写入 pkmn-randoms.md 文档**

```markdown
# @pkmn/randoms - 随机队伍生成

## 安装

```bash
npm install @pkmn/randoms
```

## 概述

@pkmn/randoms 提供 Pokemon Showdown Random Battle 格式的队伍生成功能。

## 基础用法

### 直接生成队伍

```typescript
import { TeamGenerators } from '@pkmn/randoms';

const generator = TeamGenerators.getTeamGenerator('gen8randombattle');
const team = generator.getTeam();

console.log(team);
// [
//   { species: 'Charizard', ability: 'Blaze', item: 'Choice Scarf', moves: ['Flamethrower', ...] },
//   { species: 'Blastoise', ability: 'Torrent', item: 'Leftovers', moves: ['Hydro Pump', ...] },
//   ...
// ]
```

### 与 @pkmn/sim 集成

```typescript
import { Teams } from '@pkmn/sim';
import { TeamGenerators } from '@pkmn/randoms';

// 设置队伍生成器
Teams.setGeneratorFactory(TeamGenerators);

// 生成队伍
const team = Teams.generate('gen1randombattle');
```

## 支持的模式

| 模式 ID | 描述 |
|---------|------|
| gen1randombattle | 第一世代随机对战 |
| gen2randombattle | 第二世代随机对战 |
| gen3randombattle | 第三世代随机对战 |
| gen4randombattle | 第四世代随机对战 |
| gen5randombattle | 第五世代随机对战 |
| gen6randombattle | 第六世代随机对战 |
| gen7randombattle | 第七世代随机对战 |
| gen8randombattle | 第八世代随机对战 |
| gen9randombattle | 第九世代随机对战 |

### 其他模式

```typescript
// 随机双打
const doubleTeam = TeamGenerators.getTeamGenerator('gen8randomdoublesbattle');

// 随机 Only 模式
const noLegendTeam = TeamGenerators.getTeamGenerator('gen8randombattlenofe');
```

## 队伍定制

```typescript
const generator = TeamGenerators.getTeamGenerator('gen8randombattle', {
  // 可以传入额外配置
});
```

## 扩展阅读

- GitHub: https://github.com/pkmn/ps/tree/main/randoms
```

- [ ] **Step 2: 提交 pkmn-randoms.md**

```bash
git add references/battle/pkmn-randoms.md
git commit -m "docs: add pkmn/randoms documentation"
```

### Task 6: 创建 pkmn-mods.md

**Files:**
- Create: `C:/code/pokemon-skill/references/battle/pkmn-mods.md`

- [ ] **Step 1: 写入 pkmn-mods.md 文档**

```markdown
# @pkmn/mods - 自定义扩展

## 安装

```bash
npm install @pkmn/mods
```

## 概述

@pkmn/mods 提供修改和扩展 Pokemon 数据的能力，可添加自定义精灵、技能、特性等。

## 基础用法

### 应用现有 Mod

```typescript
import { Dex, ID, ModData } from '@pkmn/dex';

// 使用 Gen 7 SM 数据
const dex = Dex.mod('gen7sm' as ID, await import('@pkmn/mods/gen7sm') as ModData);
```

### 创建自定义 Mod

```typescript
import { Dex, ID, ModData } from '@pkmn/dex';
import { ModdedDex } from '@pkmn/mods';

// 创建自定义精灵
const customDex = Dex.mod('custom' as ID, {
  Species: {
    'MyPokemon': {
      num: 10000,
      name: 'MyPokemon',
      types: ['Fire', 'Dragon'],
      baseStats: { hp: 100, atk: 120, def: 90, spa: 110, spd: 85, spe: 95 },
      abilities: { '0': 'MyAbility' }
    }
  },
  Abilities: {
    'MyAbility': {
      num: 10000,
      name: 'MyAbility',
      desc: 'Custom ability description',
      shortDesc: 'Custom ability short description'
    }
  }
} as ModData);
```

### 修改现有数据

```typescript
const modifiedDex = Dex.mod('buffedcharizard' as ID, {
  Species: {
    'Charizard': {
      inherit: true,
      baseStats: { hp: 100, atk: 100, def: 100, spa: 150, spd: 100, spe: 120 }
    }
  }
} as ModData);
```

### 使用 ModdedDex 扩展

```typescript
import { Dex, ID, ModData, Ability, AbilityData } from '@pkmn/dex';
import { ModdedDex } from '@pkmn/mods';

const dex = Dex.mod('foo' as ID, {
  Abilities: {
    magicguard: { inherit: true, foo: 5 },
  },
} as ModData);

const modded = new ModdedDex<Ability & {foo?: number}, AbilityData & {foo?: number}>(dex);
console.log(modded.abilities.get('magicguard').foo); // 5
```

## 扩展类型

### 添加自定义技能

```typescript
const customDex = Dex.mod('custommoves' as ID, {
  Moves: {
    'CustomMove': {
      num: 10000,
      name: 'Custom Move',
      type: 'Fire',
      category: 'Special',
      basePower: 120,
      accuracy: 85,
      pp: 5,
      desc: 'A powerful custom move'
    }
  }
} as ModData);
```

### 添加自定义道具体

```typescript
const customDex = Dex.mod('customitems' as ID, {
  Items: {
    'CustomItem': {
      num: 10000,
      name: 'Custom Item',
      desc: 'A powerful custom item',
      shortDesc: 'Boosts special attack',
      onModifySpA: () => 1.2
    }
  }
} as ModData);
```

## 扩展阅读

- GitHub: https://github.com/pkmn/ps/tree/main/mods
```

- [ ] **Step 2: 提交 pkmn-mods.md**

```bash
git add references/battle/pkmn-mods.md
git commit -m "docs: add pkmn/mods documentation"
```

### Task 7: 创建 smogon-calc.md

**Files:**
- Create: `C:/code/pokemon-skill/references/battle/smogon-calc.md`

- [ ] **Step 1: 写入 smogon-calc.md 文档**

```markdown
# @smogon/calc - 伤害计算

## 安装

```bash
npm install @smogon/calc
```

## 概述

@smogon/calc 是 Pokemon Showdown 官方伤害计算器，支持所有世代的精确伤害计算。

## 基础用法

### 简单伤害计算

```typescript
import { calculate, Generations, Pokemon, Move } from '@smogon/calc';

const gen = 8;

// 创建攻击方
const attacker = new Pokemon(gen, 'Charizard', {
  item: 'Choice Specs',
  nature: 'Timid',
  evs: { spa: 252 }
});

// 创建防御方
const defender = new Pokemon(gen, 'Blastoise', {
  item: 'Leftovers',
  nature: 'Calm',
  evs: { hp: 252, spd: 252 }
});

// 创建技能
const move = new Move(gen, 'Flamethrower');

// 计算伤害
const result = calculate(gen, attacker, defender, move);

console.log(result.getDamage());        // 伤害数值
console.log(result.getDamageRange());   // 伤害区间 [min, max]
console.log(result.description());      // 伤害描述
```

### 完整参数示例

```typescript
const attacker = new Pokemon(gen, 'Charizard', {
  species: 'Charizard',
  item: 'Choice Specs',
  ability: 'Blaze',
  nature: 'Timid',
  evs: { hp: 0, atk: 0, def: 0, spa: 252, spd: 0, spe: 252 },
  ivs: { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 },
  level: 50,
  isDynamaxed: false,
  genders: 'M'
});

const defender = new Pokemon(gen, 'Blastoise', {
  species: 'Blastoise',
  item: 'Leftovers',
  ability: 'Torrent',
  nature: 'Calm',
  evs: { hp: 252, atk: 0, def: 0, spa: 0, spd: 252, spe: 0 },
  level: 50
});

// 创建带场地效果的技能
const move = new Move(gen, 'Flamethrower', {
  useTargetOffensive: false,
  isZ: false,
  isMax: false
});
```

### 场地效果

```typescript
import { Field } from '@smogon/calc';

const field = new Field({
  gameType: 'singles',
  terrain: 'Electric Terrain',
  weather: 'Sun',
  isMagicRoom: false,
  isWonderRoom: false
});

const result = calculate(gen, attacker, defender, move, field);
```

## 世代支持

```typescript
// Gen 1-9 都支持
const gen1Calc = calculate(1, p1, p2, move);
const gen9Calc = calculate(9, p1, p2, move);
```

## 伤害结果

```typescript
const result = calculate(gen, attacker, defender, move);

// 获取单次伤害
const damage = result.getDamage();

// 获取伤害区间
const [min, max] = result.getDamageRange();

// 获取暴击区间
const [critMin, critMax] = result.getCritDamage();

// 获取击杀概率
const koChance = result.getKOChance();

// 描述信息
console.log(result.desc());
// "0 Atk Charizard Choice Specs Flamethrower vs. 252 HP / 252+ SpD Blastoise: 90-107 (26.3 - 31.3%) -- guaranteed 4HKO after Leftovers recovery"
```

## 输出类型

| 方法 | 描述 |
|------|------|
| getDamage() | 单次伤害数值 |
| getDamageRange() | 伤害最小/最大值 |
| getCritDamage() | 暴击伤害区间 |
| getKOChance() | 击杀概率 |
| desc() | 人类可读的伤害描述 |

## 扩展阅读

- GitHub: https://github.com/smogon/damage-calc
- 在线演示: https://calc.pokemonshowdown.com
```

- [ ] **Step 2: 提交 smogon-calc.md**

```bash
git add references/battle/smogon-calc.md
git commit -m "docs: add smogon/calc documentation"
```

---

## Chunk 4: 数据 API 文档

### Task 8: 创建 pokeapi-rest.md

**Files:**
- Create: `C:/code/pokemon-skill/references/api/pokeapi-rest.md`

- [ ] **Step 1: 写入 pokeapi-rest.md 文档**

```markdown
# PokéAPI REST API

## 概述

PokéAPI 是免费的宝可梦数据 REST API，提供 48 个端点的完整数据。

**Base URL**: `https://pokeapi.co/api/v2/`

## 端点列表

| 端点 | 描述 |
|------|------|
| /pokemon/{id or name}/ | 精灵数据 |
| /move/{id or name}/ | 技能数据 |
| /ability/{id or name}/ | 特性数据 |
| /item/{id or name}/ | 道具数据 |
| /type/{id or name}/ | 属性数据 |
| /evolution-chain/{id}/ | 进化链 |
| /location/{id or name}/ | 地点 |
| /pokemon-species/{id or name}/ | 物种数据 |

## 基础用法

### 获取精灵数据

```typescript
const response = await fetch('https://pokeapi.co/api/v2/pokemon/charizard');
const data = await response.json();

console.log(data.name);           // 'charizard'
console.log(data.types);          // [{ type: { name: 'fire' } }, { type: { name: 'flying' } }]
console.log(data.stats);          // [{ stat: { name: 'hp' }, base_stat: 78 }, ...]
console.log(data.abilities);      // [{ ability: { name: 'blaze' } }, ...]
console.log(data.moves);          // [{ move: { name: 'flamethrower' } }, ...]
```

### 获取技能数据

```typescript
const response = await fetch('https://pokeapi.co/api/v2/move/thunderbolt');
const data = await response.json();

console.log(data.name);           // 'thunderbolt'
console.log(data.type);           // { name: 'electric' }
console.log(data.power);          // 90
console.log(data.accuracy);       // 100
console.log(data.category);       // { name: 'special' }
```

### 分页查询

```typescript
// 获取前 20 个精灵
const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=20');
const data = await response.json();

console.log(data.count);    // 1281
console.log(data.next);     // URL to next page
console.log(data.previous);  // URL to previous page
console.log(data.results);  // [{ name: 'bulbasaur', url: '...' }, ...]

// 获取第 2 页
const page2 = await fetch('https://pokeapi.co/api/v2/pokemon?limit=20&offset=20');
```

### 获取所有精灵

```typescript
async function getAllPokemon() {
  const allPokemon = [];
  let url = 'https://pokeapi.co/api/v2/pokemon?limit=1000';

  while (url) {
    const response = await fetch(url);
    const data = await response.json();
    allPokemon.push(...data.results);
    url = data.next;
  }

  return allPokemon;
}
```

## 数据结构

### Pokemon 响应结构

```typescript
interface PokemonResponse {
  id: number;
  name: string;
  base_experience: number;
  height: number;
  weight: number;
  types: Array<{ slot: number, type: { name: string, url: string } }>;
  stats: Array<{ base_stat: number, effort: number, stat: { name: string, url: string } }>;
  abilities: Array<{ is_hidden: boolean, slot: number, ability: { name: string, url: string } }>;
  moves: Array<{ move: { name: string, url: string }, version_group_details: any[] }>;
  sprites: {
    front_default: string;
    front_shiny: string;
    other: { 'official-artwork': { front_default: string } };
  };
}
```

## 缓存建议

- PokéAPI 是免费服务，请合理使用
- 建议缓存数据到本地
- 使用 `?limit=1000` 获取更多数据

## 扩展阅读

- 文档: https://pokeapi.co/docs/v2
- 完整端点列表: https://pokeapi.co/api/v2
```

- [ ] **Step 2: 提交 pokeapi-rest.md**

```bash
git add references/api/pokeapi-rest.md
git commit -m "docs: add PokéAPI REST documentation"
```

### Task 9: 创建 pokeapi-graphql.md

**Files:**
- Create: `C:/code/pokemon-skill/references/api/pokeapi-graphql.md`

- [ ] **Step 1: 写入 pokeapi-graphql.md 文档**

```markdown
# PokéAPI GraphQL

## 概述

PokéAPI 提供 GraphQL 接口，可以更灵活地查询数据。

**Beta 端点**: `https://beta.pokeapi.co/graphql/v1beta`

## 基础用法

### 查询精灵

```graphql
query {
  pokemon_v2_pokemon(where: {name: {_eq: "charizard"}}) {
    id
    name
    pokemon_v2_pokemontypes {
      pokemon_v2_type {
        name
      }
    }
    pokemon_v2_pokemonstats {
      base_stat
      pokemon_v2_stat {
        name
      }
    }
  }
}
```

### 查询技能

```graphql
query {
  pokemon_v2_move(where: {name: {_eq: "flamethrower"}}) {
    id
    name
    type_id
    power
    accuracy
    pp
    pokemon_v2_movedamageclass {
      name
    }
  }
}
```

### 查询进化链

```graphql
query {
  pokemon_v2_evolutionchain(where: {id: {_eq: 2}}) {
    id
    pokemon_v2_evolutionchaindetails {
      min_level
      pokemon_v2_item {
        name
      }
      evolutiontrigger_id
    }
  }
}
```

### 分页查询

```graphql
query {
  pokemon_v2_pokemon(limit: 10, offset: 0) {
    id
    name
  }
}
```

## 主要类型

| 类型 | 描述 |
|------|------|
| pokemon_v2_pokemon | 精灵 |
| pokemon_v2_move | 技能 |
| pokemon_v2_ability | 特性 |
| pokemon_v2_item | 道具 |
| pokemon_v2_type | 属性 |
| pokemon_v2_evolutionchain | 进化链 |
| pokemon_v2_location | 地点 |

## 关系查询

```graphql
query {
  pokemon_v2_pokemon(where: {name: {_eq: "charizard"}}) {
    name
    pokemon_v2_pokemonsprites {
      sprites
    }
    pokemon_v2_pokemonabilities {
      pokemon_v2_ability {
        name
        pokemon_v2_abilityeffecttexts {
          short_effect
        }
      }
    }
  }
}
```

## 使用建议

- GraphQL API 仍在 beta 中
- 推荐在本地运行完整版本
- 使用 Hasura 引擎

## 扩展阅读

- GitHub: https://github.com/PokeAPI/pokeapi
- 完整 schema 需要本地运行查看
```

- [ ] **Step 2: 提交 pokeapi-graphql.md**

```bash
git add references/api/pokeapi-graphql.md
git commit -m "docs: add PokéAPI GraphQL documentation"
```

---

## Chunk 5: 扩展接口文档 (第一部分)

### Task 10: 创建 extend/pokemon.md

**Files:**
- Create: `C:/code/pokemon-skill/references/extend/pokemon.md`

- [ ] **Step 1: 写入 pokemon.md 文档**

```markdown
# 添加新精灵

## 使用 @pkmn/mods

```typescript
import { Dex, ID, ModData } from '@pkmn/dex';

const customDex = Dex.mod('custom' as ID, {
  Species: {
    'MyPokemon': {
      num: 10000,           // 唯一编号
      name: 'MyPokemon',      // 名称
      types: ['Fire', 'Dragon'],  // 属性
      baseStats: {          // 基础种族值
        hp: 100,
        atk: 120,
        def: 90,
        spa: 110,
        spd: 85,
        spe: 95
      },
      baseStatsTotal: 590,
      abilities: {           // 特性
        '0': 'MyAbility',
        'H': 'MyHiddenAbility'
      },
      height: 17,            // 身高 (dm)
      weight: 905,          // 体重 (hg)
      color: 'red',          // 颜色
      genderRatio: { male: '0.5', female: '0.5' },  // 性别比例
      evYield: {             // 努力值分配
        hp: 0,
        atk: 2,
        def: 0,
        spa: 0,
        spd: 0,
        spe: 0
      },
      evos: ['EvolvedForm'], // 进化后
      prevo: 'BaseForm',     // 进化前
      otherFormes: ['MyPokemonMega'],  // 其他形态
      tiers: ['OU'],         // 对战分级
      gen: 9                 // 首次出现世代
    }
  }
} as ModData);
```

## 精灵数据结构

```typescript
interface SpeciesData {
  num: number;              // 唯一编号
  name: string;             // 名称
  types: string[];          // 属性数组
  baseStats: {              // 基础种族值
    hp: number;
    atk: number;
    def: number;
    spa: number;
    spd: number;
    spe: number;
  };
  abilities: {              // 特性
    '0': string;           // 普通特性
    '1'?: string;          // 第二特性
    'H'?: string;          // 隐藏特性
    S?: string;            // 特殊特性
  };
  height?: number;         // 身高 (dm)
  weight?: number;         // 体重 (hg)
  color?: string;          // 颜色
  genderRatio?: { male: string; female: string };
  evYield?: Stats;         // 努力值分配
  evos?: string[];        // 进化后
  prevo?: string;         // 进化前
  otherFormes?: string[];  // 其他形态
  tiers?: string[];       // 对战分级
  gen?: number;           // 世代
}
```

## 示例：添加御三家

```typescript
const customDex = Dex.mod('custom' as ID, {
  Species: {
    'Firestarter': {
      num: 10001,
      name: 'Firestarter',
      types: ['Fire'],
      baseStats: { hp: 80, atk: 95, def: 80, spa: 110, spd: 85, spe: 100 },
      abilities: { '0': 'Blaze', 'H': 'Flash Fire' },
      evYield: { hp: 0, atk: 0, def: 0, spa: 2, spd: 0, spe: 0 },
      evos: ['Flareon'],
      prevo: undefined,
      height: 10,
      weight: 82,
      color: 'red',
      tiers: ['NFE']
    }
  }
} as ModData);
```

## 进化链配置

```typescript
const customDex = Dex.mod('custom' as ID, {
  Species: {
    'Baby': {
      num: 10001,
      name: 'Baby',
      types: ['Fire'],
      baseStats: { hp: 50, atk: 60, def: 50, spa: 70, spd: 50, spe: 65 },
      evos: ['Adult'],
      prevo: undefined,
      height: 3,
      weight: 25,
      tiers: ['NFE']
    },
    'Adult': {
      num: 10002,
      name: 'Adult',
      types: ['Fire'],
      baseStats: { hp: 80, atk: 95, def: 80, spa: 110, spd: 85, spe: 100 },
      abilities: { '0': 'Blaze' },
      evos: ['Evolved'],
      prevo: 'Baby',
      height: 15,
      weight: 90,
      tiers: ['OU']
    }
  }
} as ModData);
```
```

- [ ] **Step 2: 提交 extend/pokemon.md**

```bash
git add references/extend/pokemon.md
git commit -m "docs: add custom Pokemon extension guide"
```

### Task 11: 创建 extend/moves.md

**Files:**
- Create: `C:/code/pokemon-skill/references/extend/moves.md`

- [ ] **Step 1: 写入 moves.md 文档**

```markdown
# 添加新技能

## 使用 @pkmn/mods

```typescript
import { Dex, ID, ModData } from '@pkmn/dex';

const customDex = Dex.mod('custom' as ID, {
  Moves: {
    'MyMove': {
      num: 10000,
      name: 'My Move',
      type: 'Fire',              // 技能属性
      category: 'Special',       // 物理/特殊/变化
      basePower: 120,            // 威力
      accuracy: 85,              // 命中率
      pp: 5,                     // PP
      maxPp: 8,                  // 最大 PP
      priority: 0,               // 优先级
      target: 'normal',          // 目标
      desc: 'A powerful custom move.',      // 描述
      shortDesc: 'High damage.', // 简短描述
      secondary: {
        chance: 30,
        status: 'brn'
      }
    }
  }
} as ModData);
```

## 技能数据结构

```typescript
interface MoveData {
  num: number;              // 唯一编号
  name: string;             // 名称
  type: string;             // 属性
  category: 'Physical' | 'Special' | 'Status';  // 分类
  basePower?: number;       // 威力
  accuracy?: number;        // 命中率
  pp?: number;              // PP
  maxPp?: number;           // 最大 PP
  priority?: number;        // 优先级
  target?: string;          // 目标
  desc?: string;            // 描述
  shortDesc?: string;       // 简短描述
  isZ?: boolean;           // Z技能
  isMax?: boolean;         // 极巨化
  no_ppBoosts?: boolean;   // 不受 PP 影响
  noSketch?: boolean;      // 不可画画
  recoil?: number[];       // 反弹伤害 [min, max]
  drain?: number[];        // 吸血 [attacker, defender]
  status?: string;         // 附加状态
  secondary?: {
    chance?: number;
    status?: string;
    volatileStatus?: string;
  };
}
```

## 技能类型示例

### 物理技能

```typescript
PhysicalAttack: {
  num: 10001,
  name: 'Flame Strike',
  type: 'Fire',
  category: 'Physical',
  basePower: 100,
  accuracy: 100,
  pp: 10,
  target: 'normal',
  desc: 'A fiery physical attack.',
  shortDesc: 'Strong fire attack.'
}
```

### 特殊技能

```typescript
SpecialAttack: {
  num: 10002,
  name: 'Inferno Blast',
  type: 'Fire',
  category: 'Special',
  basePower: 130,
  accuracy: 85,
  pp: 5,
  target: 'normal',
  desc: 'A powerful special fire attack that may burn.',
  shortDesc: 'High damage, may burn.',
  secondary: {
    chance: 30,
    status: 'brn'
  }
}
```

### 变化技能

```typescript
StatusMove: {
  num: 10003,
  name: 'Flame Wall',
  type: 'Fire',
  category: 'Status',
  pp: 20,
  target: 'allySide',
  desc: 'Creates a protective fire wall.',
  shortDesc: 'Sets up fire wall.',
  sideCondition: 'firewall'
}
```

### 优先技能

```typescript
PriorityMove: {
  num: 10004,
  name: 'Quick Strike',
  type: 'Normal',
  category: 'Physical',
  basePower: 40,
  accuracy: 100,
  pp: 30,
  priority: 1,
  target: 'normal',
  desc: 'A quick attack that strikes first.',
  shortDesc: 'High priority.'
}
```

### 变化天气技能

```typescript
WeatherMove: {
  num: 10005,
  name: 'Sunny Day',
  type: 'Fire',
  category: 'Status',
  pp: 5,
  target: 'entireField',
  desc: 'Summons intense sunlight.',
  shortDesc: 'Summons sun.',
  weather: 'sunnyday'
}
```

## 技能效果

### 附加异常状态

```typescript
BurnMove: {
  type: 'Fire',
  category: 'Physical',
  basePower: 70,
  secondary: {
    chance: 30,
    status: 'brn'  // 烧伤
  }
}
```

### 附加能力变化

```typescript
StatMove: {
  type: 'Normal',
  category: 'Status',
  boosts: {
    atk: 2
  }
}
```

### 吸血/反弹

```typescript
DrainMove: {
  type: 'Dark',
  category: 'Physical',
  basePower: 80,
  drain: [1, 2]  // 造成伤害的 50% 恢复自身
}

RecoilMove: {
  type: 'Fire',
  category: 'Special',
  basePower: 140,
  recoil: [1, 4]  // 伤害的 25% 作为反弹
}
```
```

- [ ] **Step 2: 提交 extend/moves.md**

```bash
git add references/extend/moves.md
git commit -m "docs: add custom move extension guide"
```

### Task 12: 创建 extend/abilities.md

**Files:**
- Create: `C:/code/pokemon-skill/references/extend/abilities.md`

- [ ] **Step 1: 写入 abilities.md 文档**

```markdown
# 添加新特性

## 使用 @pkmn/mods

```typescript
import { Dex, ID, ModData } from '@pkmn/dex';

const customDex = Dex.mod('custom' as ID, {
  Abilities: {
    'MyAbility': {
      num: 10000,
      name: 'My Ability',
      desc: 'A powerful custom ability.',      // 描述
      shortDesc: 'Boosts fire moves.',          // 简短描述
      onModifySpA: (pokemon, source, target) => {
        if (pokemon.hasType('Fire')) {
          return Math.floor(source.stats.spa * 1.5);
        }
      }
    }
  }
} as ModData);
```

## 特性数据结构

```typescript
interface AbilityData {
  num: number;              // 唯一编号
  name: string;             // 名称
  desc?: string;             // 完整描述
  shortDesc?: string;       // 简短描述
  rating?: number;          // 特性评级 (F 到 S)
  isNonstandard?: boolean;  // 是否非标准
  // 触发器函数
  onAfterUse?: (pokemon) => void;
  onAfterHit?: (pokemon, target, move) => void;
  onAfterMove?: (pokemon, target, move) => void;
  onBeforeMove?: (pokemon, target, move) => boolean | void;
  onDamagingHit?: (pokemon, target, move, damage) => void;
  onFaint?: (pokemon) => void;
  onHitField?: (target, source, move) => void;
  onModifyAccuracy?: (pokemon, target, move) => number;
  onModifyAtk?: (pokemon, source, target, move) => number | false;
  onModifyDef?: (pokemon, source, target, move) => number | false;
  onModifySpA?: (pokemon, source, target, move) => number | false;
  onModifySpD?: (pokemon, source, target, move) => number | false;
  onModifySpe?: (pokemon, source, target, move) => number | false;
  onModifyMove?: (pokemon, target, move) => void;
  onTryHit?: (pokemon, target, move) => boolean | void;
  onAfterSetStatus?: (pokemon, status) => void;
  onSetStatus?: (pokemon, status) => boolean | void;
  onWeatherChange?: (pokemon, weather) => void;
  onTerrainChange?: (pokemon, terrain) => void;
}
```

## 特性类型示例

### 属性增强特性

```typescript
FireBoost: {
  num: 10001,
  name: 'Fire Boost',
  shortDesc: 'Boosts Special Attack when using Fire moves.',
  onModifySpA: (pokemon, source, target, move) => {
    if (move?.type === 'Fire') {
      return Math.floor(source.stats.spa * 1.5);
    }
  }
}
```

### 天气特性

```typescript
Drought: {
  num: 10002,
  name: 'Drought',
  shortDesc: 'Summons sun upon entering battle.',
  onStart: (pokemon) => {
    pokemon.field.setWeather('sunnyday');
  }
}
```

### 受到攻击触发

```typescript
MagicGuard: {
  num: 10003,
  name: 'Magic Guard',
  shortDesc: 'Prevents indirect damage.',
  onDamage: (pokemon, damage, source, effect) => {
    if (effect.id !== 'direct') {
      return false;
    }
  }
}
```

### 击败触发

```typescript
Moxie: {
  num: 10004,
  name: 'Moxie',
  shortDesc: 'Boosts Attack after KO.',
  onAfterKill: (pokemon, target) => {
    pokemon.boosts.atk += 1;
  }
}
```

### 道具效果

```typescript
Unburden: {
  num: 10005,
  name: 'Unburden',
  shortDesc: 'Boosts Speed when item is consumed.',
  onAfterUse: (pokemon, item) => {
    if (item) {
      pokemon.addVolatile('unburden');
    }
  }
}
```

### 免疫特性

```typescript
WaterAbsorb: {
  num: 10006,
  name: 'Water Absorb',
  shortDesc: 'Immune to Water, heals instead.',
  onTryHit: (pokemon, target, move) => {
    if (move.type === 'Water') {
      pokemon.heal(pokemon.maxhp / 4);
      return null;
    }
  }
}
```

### 变化天气/地形

```typescript
ElectricSurge: {
  num: 10007,
  name: 'Electric Surge',
  shortDesc: 'Sets Electric Terrain on entry.',
  onStart: (pokemon) => {
    pokemon.field.setTerrain('electricterrain');
  }
}
```
```

- [ ] **Step 2: 提交 extend/abilities.md**

```bash
git add references/extend/abilities.md
git commit -m "docs: add custom ability extension guide"
```

---

## Chunk 6: 扩展接口文档 (第二部分)

### Task 13: 创建 extend/items.md

**Files:**
- Create: `C:/code/pokemon-skill/references/extend/items.md`

- [ ] **Step 1: 写入 items.md 文档**

```markdown
# 添加新道具

## 使用 @pkmn/mods

```typescript
import { Dex, ID, ModData } from '@pkmn/dex';

const customDex = Dex.mod('custom' as ID, {
  Items: {
    'MyItem': {
      num: 10000,
      name: 'My Item',
      desc: 'A powerful custom item.',       // 描述
      shortDesc: 'Boosts Sp. Atk by 50%.',  // 简短描述
      onModifySpA: (pokemon, source, target, move) => {
        return Math.floor(source.stats.spa * 1.5);
      },
      onTakeItem: (item, pokemon) => {
        return true;
      }
    }
  }
} as ModData);
```

## 道具数据结构

```typescript
interface ItemData {
  num: number;              // 唯一编号
  name: string;             // 名称
  desc?: string;             // 完整描述
  shortDesc?: string;       // 简短描述
  sprite?: string;         // 图片
  isNonstandard?: boolean; // 是否非标准
  fling?: {
    basePower?: number;
    effect?: string;
  };
  // 触发器函数
  onStart?: (pokemon) => void;
  onModifyAtk?: (pokemon, source, target, move) => number | false;
  onModifySpA?: (pokemon, source, target, move) => number | false;
  onModifyDef?: (pokemon, source, target, move) => number | false;
  onModifySpD?: (pokemon, source, target, move) => number | false;
  onModifySpe?: (pokemon, source, target, move) => number | false;
  onAfterMove?: (pokemon, target, move) => void;
  onAfterHit?: (pokemon, target, move) => void;
  onDamagingHit?: (pokemon, target, move, damage) => void;
  onFaint?: (pokemon) => void;
  onAfterUse?: (pokemon) => void;
  onTryHit?: (pokemon, target, move) => boolean | void;
  onBasePower?: (pokemon, target, move, basePower) => number;
  onTakeItem?: (item, pokemon) => boolean;
}
```

## 道具类型示例

### 能力增强道具

```typescript
ChoiceScarf: {
  num: 10001,
  name: 'Choice Scarf',
  shortDesc: 'Boosts Speed by 50%, locks to one move.',
  onModifySpe: (pokemon) => {
    return Math.floor(pokemon.stats.spe * 1.5);
  }
}
```

### 属性增强道具

```typescript
LifeOrb: {
  num: 10002,
  name: 'Life Orb',
  shortDesc: 'Boosts move power by 30%, damages user by 10%.',
  onBasePower: (pokemon, target, move, basePower) => {
    return Math.floor(basePower * 1.3);
  },
  onAfterMove: (pokemon, target, move) => {
    pokemon.damage(Math.floor(pokemon.maxhp / 10));
  }
}
```

### 回复道具

```typescript
Leftovers: {
  num: 10003,
  name: 'Leftovers',
  shortDesc: 'Heals 1/16 HP each turn.',
  onResidual: (pokemon) => {
    pokemon.heal(Math.floor(pokemon.maxhp / 16));
  }
}
```

### Z 水晶

```typescript
FiriumZ: {
  num: 10004,
  name: 'Firium Z',
  shortDesc: 'Fire-type moves become Z-Moves.',
  onTryMove: (pokemon, target, move) => {
    if (move.type === 'Fire' && move.isZ) {
      move.isZ = false;
      move.isMax = true;
    }
  }
}
```

### 进化道具

```typescript
FireStone: {
  num: 10005,
  name: 'Fire Stone',
  shortDesc: 'Evolves certain Pokemon.',
  onEvolve: (pokemon) => {
    return pokemon.name === 'Charmander';
  }
}
```

### 场地道具

```typescript
TerrainExtender: {
  num: 10006,
  name: 'Electric Seed',
  shortDesc: 'Activates Electric Terrain when held.',
  onStart: (pokemon) => {
    if (pokemon.field.terrain === '') {
      pokemon.field.setTerrain('electricterrain');
    }
  }
}
```

### 力量道具

```typescript
PowerHerb: {
  num: 10007,
  name: 'Power Herb',
  shortDesc: 'Two-turn moves charge instantly.',
  onModifyMove: (pokemon, target, move) => {
    if (move.isTwoTurnMove) {
      move.isTwoTurnMove = false;
    }
  }
}
```
```

- [ ] **Step 2: 提交 extend/items.md**

```bash
git add references/extend/items.md
git commit -m "docs: add custom item extension guide"
```

### Task 14: 创建 extend/types.md

**Files:**
- Create: `C:/code/pokemon-skill/references/extend/types.md`

- [ ] **Step 1: 写入 types.md 文档**

```markdown
# 添加新属性

## 使用 @pkmn/mods

```typescript
import { Dex, ID, ModData } from '@pkmn/dex';

const customDex = Dex.mod('custom' as ID, {
  Types: {
    'Cosmic': {
      name: 'Cosmic',
      damageTaken: { '*': 1 },  // 被一切属性克制
      HPivs: { spe: 30 },
      colors: ['Purple']
    }
  },
  TypeChart: {
    // 定义克制关系
    Cosmic: {
      '*': 1,         // 被一切属性 2x
      ?????? 0.5,     // 抵抗 ??????
      ??????: 2       // 克制 ?????? 2x
    }
  }
} as ModData);
```

## 属性数据结构

```typescript
interface TypeData {
  name: string;             // 属性名称
  id?: string;             // 属性 ID
  damageTaken: {           // 受伤害倍率
    [key: string]: number; // 0=无效, 1=normal, 2=super, 0.5=resist
  };
  HPivs?: {                // HP 形态 IV
    [stat: string]: number;
  };
  colors?: string[];      // 显示颜色
}
```

## 克制关系图

```typescript
// 标准属性克制 (Fire 为例)
Fire: {
  Fire: 1,      // 被火 1x
  Water: 2,     // 被水 2x (克制)
  Grass: 0.5,   // 被草 0.5x (抵抗)
  Ice: 0.5,     // 被冰 0.5x
  Ground: 2,    // 被地面 2x
  Rock: 0.5,    // 被岩石 0.5x
  Bug: 0.5,     // 被虫 0.5x
  Steel: 0.5,   // 被钢 0.5x
  Dragon: 1,    // 被龙 1x
  Fairy: 0.5    // 被妖精 0.5x
}
```

## 添加新属性

```typescript
Cosmic: {
  name: 'Cosmic',
  damageTaken: {
    Cosmic: 1,
    Normal: 0.5,
    Fire: 0.5,
    Water: 0.5,
    Electric: 0.5,
    Grass: 0.5,
    Ice: 0.5,
    Fighting: 2,
    Poison: 0.5,
    Ground: 2,
    Flying: 0.5,
    Psychic: 0.5,
    Bug: 0.5,
    Rock: 2,
    Ghost: 0.5,
    Dragon: 0.5,
    Dark: 0.5,
    Steel: 2,
    Fairy: 0.5,
    Cosmic: 2
  }
}
```

## 在精灵中使用新属性

```typescript
Species: {
  'CosmicMon': {
    types: ['Cosmic', 'Psychic']
  }
}
```

## 在技能中使用新属性

```typescript
Moves: {
  'CosmicPower': {
    type: 'Cosmic'
  }
}
```
```

- [ ] **Step 2: 提交 extend/types.md**

```bash
git add references/extend/types.md
git commit -m "docs: add custom type extension guide"
```

### Task 15: 创建 extend/weather.md

**Files:**
- Create: `C:/code/pokemon-skill/references/extend/weather.md`

- [ ] **Step 1: 写入 weather.md 文档**

```markdown
# 添加新天气/地形

## 使用 @pkmn/mods

### 添加新天气

```typescript
import { Dex, ID, ModData } from '@pkmn/dex';

const customDex = Dex.mod('custom' as ID, {
  Conditions: {
    'myweather': {
      name: 'My Weather',
      duration: 5,
      onStart: (field) => {
        field.setWeather('myweather');
      },
      onResidual: (field) => {
        field.weatherData.duration--;
      },
      onEnd: (field) => {
        field.clearWeather();
      }
    }
  }
} as ModData);
```

### 添加新地形

```typescript
const customDex = Dex.mod('custom' as ID, {
  Conditions: {
    'myterrain': {
      name: 'My Terrain',
      duration: 8,
      onStart: (field) => {
        field.setTerrain('myterrain');
      },
      onResidual: (field) => {
        field.terrainData.duration--;
      },
      onEnd: (field) => {
        field.clearTerrain();
      }
    }
  }
} as ModData);
```

## 天气数据结构

```typescript
interface WeatherData {
  name: string;
  duration?: number;
  onStart?: (field, source) => void;
  onResidual?: (field) => void;
  onEnd?: (field) => void;
  onModifySpA?: (pokemon, source, target, move, stat) => number;
  onModifyAtk?: (pokemon, source, target, move, stat) => number;
  // ... 其他能力修改
}
```

## 天气效果示例

### 增强特定属性

```typescript
SunnyDay: {
  name: 'Sun',
  onStart: (field) => {
    field.setWeather('sunnyday');
  },
  onModifySpA: (pokemon, source, target, move, stat) => {
    if (move.type === 'Fire') {
      return Math.floor(stat * 1.5);
    }
    if (move.type === 'Water') {
      return Math.floor(stat * 0.5);
    }
  }
}
```

### 伤害效果

```typescript
Sandstorm: {
  name: 'Sandstorm',
  onStart: (field) => {
    field.setWeather('sandstorm');
  },
  onResidual: (field) => {
    for (const pokemon of field.active) {
      if (!pokemon.hasType('Rock') &&
          !pokemon.hasType('Ground') &&
          !pokemon.hasAbility('Sand Rush')) {
        pokemon.damage(Math.floor(pokemon.maxhp / 16));
      }
    }
  }
}
```

## 地形效果示例

### 属性增强地形

```typescript
ElectricTerrain: {
  name: 'Electric Terrain',
  onStart: (field) => {
    field.setTerrain('electricterrain');
  },
  onModifySpA: (pokemon, source, target, move, stat) => {
    if (pokemon.isGrounded() && move.type === 'Electric') {
      return Math.floor(stat * 1.5);
    }
  }
}
```

### 场地效果

```typescript
PsychicTerrain: {
  name: 'Psychic Terrain',
  onStart: (field) => {
    field.setTerrain('psychicterrain');
  },
  onTryMove: (pokemon, target, move) => {
    if (move.priority > 0 && !pokemon.hasAbility('Psychic Surge')) {
      return false;
    }
  }
}
```

## 技能触发天气

```typescript
RainDance: {
  name: 'Rain Dance',
  type: 'Water',
  category: 'Status',
  onHitField: (target, source) => {
    target.setWeather('raindance', source);
  }
}
```
```

- [ ] **Step 2: 提交 extend/weather.md**

```bash
git add references/extend/weather.md
git commit -m "docs: add custom weather/terrain extension guide"
```

### Task 16: 创建 extend/conditions.md

**Files:**
- Create: `C:/code/pokemon-skill/references/extend/conditions.md`

- [ ] **Step 1: 写入 conditions.md 文档**

```markdown
# 添加新状态/效果

## 使用 @pkmn/mods

### 添加新异常状态

```typescript
import { Dex, ID, ModData } from '@pkmn/dex';

const customDex = Dex.mod('custom' as ID, {
  Conditions: {
    'custompoison': {
      name: 'Custom Poison',
      type: 'Status',
      onStart: (target, source, effect) => {
        target.setStatus('custompoison');
        target.statusData.stage = 0;
      },
      onResidual: (target) => {
        target.damage(Math.floor(target.maxhp / 8));
      }
    }
  }
} as ModData);
```

## 状态类型

### 异常状态 (Status Conditions)

```typescript
// 烧伤
brn: {
  name: 'brn',
  onStart: (target) => {
    target.setStatus('brn');
    target.statusData.stage = 0;
  },
  onResidual: (target) => {
    target.damage(Math.floor(target.maxhp / 16));
  },
  onModifyAtk: (pokemon, source, target, move, stat) => {
    if (move.category === 'Physical') {
      return Math.floor(stat * 0.5);
    }
  }
}

// 冰冻
frz: {
  name: 'frz',
  onStart: (target) => {
    target.setStatus('frz');
  },
  onBeforeMove: (pokemon, target, move) => {
    if (move.category !== 'Status') {
      return false;  // 无法行动
    }
  }
}

// 睡眠
slp: {
  name: 'slp',
  onStart: (target) => {
    target.setStatus('slp');
    target.statusData.stage = random(1, 3);
  },
  onBeforeMove: (pokemon, target, move) => {
    if (move.category !== 'Status') {
      return false;
    }
  }
}

// 麻痹
par: {
  name: 'par',
  onStart: (target) => {
    target.setStatus('par');
  },
  onModifySpe: (pokemon, source, target, move, stat) => {
    return Math.floor(stat * 0.5);
  },
  onBeforeMove: (pokemon, target, move) => {
    if (random(4) === 0) {  // 25% 概率无法行动
      return false;
    }
  }
}

// 中毒
psn: {
  name: 'psn',
  onStart: (target) => {
    target.setStatus('psn');
  },
  onResidual: (target) => {
    target.damage(Math.floor(target.maxhp / 8));
  }
}
```

### 场地状态 (Field Conditions)

```typescript
// 隐形岩
stealthrock: {
  name: 'Stealth Rock',
  type: 'Rock',
  onStart: (side) => {
    side.addSideCondition('stealthrock');
  },
  onDamagingHit: (pokemon, source, move) => {
    const type Effectiveness = pokemon.getTypeEffectiveness(move.type);
    pokemon.damage(Math.floor(pokemon.maxhp * 0.125 * typeEffectiveness));
  }
}

// 毒菱
toxicspikes: {
  name: 'Toxic Spikes',
  type: 'Poison',
  onStart: (side) => {
    side.addSideCondition('toxicspikes');
  },
  onEntryHazard: (pokemon) => {
    if (pokemon.hasType('Poison') || pokemon.hasType('Steel')) {
      return;  // 免疫
    }
    if (pokemon.side.conditions['toxicspikes']?.layers === 2) {
      pokemon.setStatus('tox');
    } else {
      pokemon.setStatus('psn');
    }
  }
}

// 黏黏网
stickyweb: {
  name: 'Sticky Web',
  type: 'Bug',
  onStart: (side) => {
    side.addSideCondition('stickyweb');
  },
  onAfterSwitchIn: (pokemon) => {
    pokemon.boosts.spe = -1;
  }
}
```

### 精灵状态 (Volatile Conditions)

```typescript
// 替身
substitute: {
  name: 'substitute',
  onStart: (pokemon) => {
    if (pokemon.hp > Math.floor(pokemon.maxhp / 4)) {
      pokemon.damage(Math.floor(pokemon.maxhp / 4));
      pokemon.addVolatile('substitute');
    }
  },
  onFaint: (pokemon) => {
    pokemon.removeVolatile('substitute');
  }
}

// 能力变化
boost: {
  name: 'boost',
  onAfterBoost: (pokemon, source, boost) => {
    // 处理能力变化
  }
}
```

## 完整示例：自定义状态

```typescript
Conditions: {
  'electrified': {
    name: 'Electrified',
    onStart: (target) => {
      target.addVolatile('electrified');
    },
    onHit: (target, source, move) => {
      if (move.category !== 'Status') {
        // 受到电属性攻击时麻痹
        source.setStatus('par');
      }
    },
    onEnd: (target) => {
      target.removeVolatile('electrified');
    }
  }
}
```

## 触发位置

| 位置 | 描述 |
|------|------|
| onStart | 状态开始时触发 |
| onResidual | 每回合结束时触发 |
| onEnd | 状态结束时触发 |
| onHit | 被技能击中时触发 |
| onAfterHit | 被技能击中后触发 |
| onModifyXXX | 修改属性时触发 |
| onBeforeMove | 行动前触发 |
```
```

- [ ] **Step 2: 提交 extend/conditions.md**

```bash
git add references/extend/conditions.md
git commit -m "docs: add custom status/condition extension guide"
```

---

## Chunk 7: 地图数据文档

### Task 17: 创建 tilemap/pokered.md

**Files:**
- Create: `C:/code/pokemon-skill/references/tilemap/pokered.md`

- [ ] **Step 1: 写入 pokered.md 文档**

```markdown
# pret/pokered - 地图数据

## 概述

pret/pokered 是 Pokemon 红蓝版的反汇编项目，包含完整的游戏地图数据。

**GitHub**: https://github.com/pret/pokered

## 地图数据内容

### 城市

| 城市 | 文件 |
|------|------|
| Pallet Town | PalletTown.blk |
| Viridian City | ViridianCity.blk |
| Pewter City | PewterCity.blk |
| Cerulean City | CeruleanCity.blk |
| Lavender Town | LavenderTown.blk |
| Vermilion City | VermilionCity.blk |
| Celadon City | CeladonCity.blk |
| Fuchsia City | FuchsiaCity.blk |
| Saffron City | SaffronCity.blk |
| Cinnabar Island | CinnabarIsland.blk |

### 路线

- Route 1-25: 完整的路线数据
- 包含道路、入口、连接点

### 建筑

- Pokemon Center (所有城市)
- Pokemon Mart (所有城市)
- Gyms (8个道馆)
- Silph Co. (11层)
- Pokemon Tower
- Game Corner

### 洞穴

- Mt. Moon (3层)
- Diglett's Cave
- Rock Tunnel (2层)
- Victory Road (3层)
- Seafoam Islands (5层)
- Cerulean Cave (3层)
- Rocket Hideout (4层)

## 数据格式

### .blk 文件格式

`.blk` 文件是原始的 tilemap 数据，使用块索引格式：

```
每个字节 = 块索引
块大小 = 16x16 像素
```

### 解析示例

```typescript
// 读取 .blk 文件
const fs = require('fs');
const data = fs.readFileSync('CeladonCity.blk');

// 转换为 2D 数组
const width = 20;
const height = 20;
const map = [];
for (let y = 0; y < height; y++) {
  map[y] = [];
  for (let x = 0; x < width; x++) {
    map[y][x] = data[y * width + x];
  }
}
```

## 使用建议

### 转换为现代格式

1. 解析 .blk 文件
2. 映射到 tileset
3. 导出为 JSON/PNG

### 工具

- **Tilemap Studio**: 用于编辑 Game Boy tilemap
- **GBDK**: Game Boy 开发工具

## 扩展阅读

- GitHub: https://github.com/pret/pokered
- 地图目录: https://github.com/pret/pokered/tree/master/maps
```

- [ ] **Step 2: 提交 tilemap/pokered.md**

```bash
git add references/tilemap/pokered.md
git commit -m "docs: add pret/pokered tilemap documentation"
```

### Task 18: 创建 tilemap/porymap.md

**Files:**
- Create: `C:/code/pokemon-skill/references/tilemap/porymap.md`

- [ ] **Step 1: 写入 porymap.md 文档**

```markdown
# Porymap - 地图编辑器

## 概述

Porymap 是专门为 Pokemon Gen 3 反汇编项目 (pokeemerald, pokefirered, pokeruby) 设计的可视化地图编辑器。

**GitHub**: https://github.com/huderlem/porymap

## 安装

### Windows/Mac

从 releases 页面下载预编译版本：
https://github.com/huderlem/porymap/releases

### Linux (源码编译)

```bash
# 安装 Qt
sudo apt install qt5-default

# 克隆并编译
git clone https://github.com/huderlem/porymap.git
cd porymap
qmake porymap.pro
make
```

## 功能

### 地图编辑

- 可视化编辑地图块
- 放置事件 (NPC、触发器、脚本)
- 编辑地图连接
- 设置地图属性

### Tileset 编辑

- 创建和修改 tileset
- 编辑图块属性 (可行走、可用、可滑行)
- 碰撞检测设置

### 事件管理

- NPC 事件
- 脚本触发器
- 隐藏道具
- 训练师
- 出口/入口

## 支持的项目

- pokeemerald
- pokefirered
- pokeruby

## 使用流程

### 1. 打开项目

```bash
./porymap /path/to/pokeemerald
```

### 2. 编辑地图

1. 选择地图文件
2. 使用工具栏编辑
3. 保存更改

### 3. 编辑 Tileset

1. 打开 tileset 编辑器
2. 导入新图块
3. 设置属性

## 数据结构

### 地图文件 (.json)

```json
{
  "id": 1,
  "name": "PALLET_TOWN",
  "layout_id": 1,
  "region_section": 0,
  "events": [],
  "connections": []
}
```

### Tileset 结构

```
tileset/
  1. 16x16 图块数组
  2. 碰撞属性
  3. 行为属性
```

## 与游戏数据集成

Porymap 编辑的数据会保存到反汇编项目的 maps/ 和 graphics/ 目录。

## 扩展阅读

- GitHub: https://github.com/huderlem/porymap
- 文档: https://github.com/huderlem/porymap#readme
- 地图脚本: https://github.com/huderlem/porymap#scripting
```

- [ ] **Step 2: 提交 tilemap/porymap.md**

```bash
git add references/tilemap/porymap.md
git commit -m "docs: add Porymap documentation"
```

---

### Task 19: 添加集成示例文档

**Files:**
- Modify: `C:/code/pokemon-skill/references/battle/pkmn-sim.md`

- [ ] **Step 1: 在 pkmn-sim.md 添加集成示例**

在 pkmn-sim.md 末尾添加以下内容：

```markdown
## 完整示例：战斗流程

以下示例展示如何结合多个库实现完整的战斗流程：

```typescript
import { BattleStreams, Teams } from '@pkmn/sim';
import { Dex } from '@pkmn/dex';
import { TeamGenerators } from '@pkmn/randoms';
import { calculate } from '@smogon/calc';
import { Sets } from '@pkmn/sets';

// 1. 生成随机队伍
const gen = 8;
Teams.setGeneratorFactory(TeamGenerators);
const team1 = Teams.generate('gen8randombattle');
const team2 = Teams.generate('gen8randombattle');

// 2. 准备队伍字符串
const team1Str = Sets.exportTeam(team1);
const team2Str = Sets.exportTeam(team2);

// 3. 创建战斗流
const streams = BattleStreams.getPlayerStreams(new BattleStreams.BattleStream());
const spec = { formatid: 'gen8oubles' };

// 4. 启动战斗
streams.omniscient.write(`>start ${JSON.stringify(spec)}`);
streams.omniscient.write(`>player p1 ${JSON.stringify({ name: 'Player 1', team: team1Str })}`);
streams.omniscient.write(`>player p2 ${JSON.stringify({ name: 'Player 2', team: team2Str })}`);

// 5. 使用 @smogon/calc 预计算伤害 (示例)
const dex = Dex.forGen(gen);
const attacker = new Pokemon(gen, 'Charizard', {
  item: 'Choice Specs',
  nature: 'Timid',
  evs: { spa: 252 }
});
const defender = new Pokemon(gen, 'Blastoise', { item: 'Leftovers', evs: { hp: 252 } });
const move = new Move(gen, 'Flamethrower');
const damageResult = calculate(gen, attacker, defender, move);
console.log(damageResult.desc());

// 6. 执行战斗
async function runBattle() {
  let turn = 0;
  while (turn < 100) {
    const result = await streams.battle.read();
    if (result?.trim()) {
      console.log(result);
    }
    if (result?.includes('win') || result?.includes('tie')) {
      break;
    }
    turn++;
  }
}
runBattle();
```
```

- [ ] **Step 2: 提交更新**

```bash
git add references/battle/pkmn-sim.md
git commit -m "docs: add integration example"
```

---

## Chunk 8: 最终整理

### Task 20: 验证和测试

- [ ] **Step 1: 验证所有文件已创建**

```bash
find . -name "*.md" | sort
```

- [ ] **Step 2: 验证 SKILL.md 链接正确**

检查所有 reference 链接是否有效。

- [ ] **Step 3: 最终提交**

```bash
git add .
git commit -m "feat: complete pokemon-dev skill documentation"
```

---

**Plan complete and saved to `docs/superpowers/plans/2026-03-13-pokemon-dev-skill-plan.md`. Ready to execute?**
