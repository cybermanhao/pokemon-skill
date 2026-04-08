---
name: pokemon-knowledge
description: Use when answering Pokemon questions about game data (stats, types, moves, evolution) or lore (characters, locations, story) for casual fans and researchers.
---

# Pokemon 知识查询 Skill

本 Skill 教你如何通过 PokéAPI 查询权威数据，**不提供静态答案**——Pokemon 数据复杂且有边缘情况，直接查 API 比依赖枚举更准确。

## 数据查询（游戏数据）

所有游戏数据通过 PokéAPI 查询，base URL：`https://pokeapi.co/api/v2/`

- [精灵图鉴](game/pokedex.md) - 种族值、属性、特性、形态
- [属性克制](game/types.md) - 单属性/双属性弱点计算，**含特性修正流程**
- [技能数据](game/moves.md) - 威力、PP、效果
- [特性查询](game/abilities.md) - 特性效果（权威来源，不要靠记忆）
- [道具查询](game/items.md) - 效果、分类
- [进化链](game/evolution.md) - 进化条件（条件多样，必须查 API）

## Lore 查询

Lore 内容（角色、剧情、地点、历史）不在 PokéAPI 覆盖范围内，直接查：

- **Bulbapedia**: https://bulbapedia.bulbagarden.net — 最权威的 wiki
- **Serebii**: https://serebii.net — 游戏/动画详细数据

## 重要原则

**遇到"X 精灵有哪些弱点/特性/进化条件"类问题，先查 API，不要依赖记忆。**

属性克制、特性效果、进化条件都有大量边缘情况，只有实时查询才能保证准确。
