---
name: pokemon-knowledge
description: Use when answering Pokemon questions about game data (stats, types, moves, evolution) or lore (characters, locations, story) for casual fans and researchers.
---

# Pokemon 知识查询 Skill

本 Skill 提供宝可梦游戏数据和lore知识的查询辅助，面向普通爱好者和研究人员。

## 目录

### 游戏数据
- [图鉴查询](knowledge/game/pokedex.md) - 精灵种族值、属性
- [属性相克](knowledge/game/types.md) - 属性克制关系表
- [技能查询](knowledge/game/moves.md) - 技能威力、PP、效果
- [特性查询](knowledge/game/abilities.md) - 特性效果说明
- [道具查询](knowledge/game/items.md) - 道具效果
- [进化链](knowledge/game/evolution.md) - 进化条件与路线

### 游戏lore
- [角色设定](knowledge/lore/characters.md) - 动画/游戏角色
- [地点设定](knowledge/lore/locations.md) - 地区、地点
- [世界观](knowledge/lore/history.md) - 历史、传说

## 快速查询

### 常用数据源

| 类型 | 来源 | URL |
|------|------|-----|
| 图鉴数据 | PokéAPI | https://pokeapi.co/api/v2/ |
| 属性克制 | Smogon | https://smogon.com/dex/ |
| 技能数据 | PokemonDB | https://pokemondb.net/move |

### 示例查询

**查询精灵基础信息**:
```
GET https://pokeapi.co/api/v2/pokemon/pikachu
```

**查询属性克制**:
```
GET https://pokeapi.co/api/v2/type/fire
```

## 回答规范

- 使用中文优先，简明概要
- 关键数据（种族值、属性克制）用表格呈现
- lore内容需注明来源
- 复杂问题可建议进一步查询

## 知识来源优先级

1. PokéAPI（权威游戏数据）
2. Bulbapedia（详细设定）
3. Serebii（对战数据）