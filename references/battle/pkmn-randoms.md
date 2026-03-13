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
