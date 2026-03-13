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
