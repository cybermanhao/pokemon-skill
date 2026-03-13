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

## 扩展阅读

- 完整协议: [PROTOCOL.md](https://github.com/pkmn/ps/blob/main/sim/PROTOCOL.md)
- SIM-PROTOCOL: [SIM-PROTOCOL.md](https://github.com/pkmn/ps/blob/main/sim/SIM-PROTOCOL.md)
