# 宝可梦图鉴

## 概述

提供精灵的基础数据查询：编号、名称、属性、种族值、特性、身高体重等。

## 数据来源

- **PokéAPI**: `https://pokeapi.co/api/v2/pokemon/{name or id}`
- **PokemonDB**: `https://pokemondb.net/pokedex/{name}`

## 常用查询示例

### 查询皮卡丘数据

```
GET https://pokeapi.co/api/v2/pokemon/pikachu
```

返回字段说明：

| 字段 | 含义 | 示例 |
|------|------|------|
| id | 全国图鉴编号 | 25 |
| name | 英文名 | pikachu |
| types | 属性 | ['electric'] |
| base_stats | 种族值 HP/Atk/Def/SpA/SpD/Spe | 35/55/40/50/50/90 |
| height | 身高 (dm) | 4 |
| weight | 体重 (hg) | 60 |
| abilities | 特性 | ['static', 'lightning-rod'] |

## 种族值总览

| 分级 | 总和范围 | 代表精灵 |
|------|----------|----------|
| 神兽 | 600+ | 创世神(670) |
| 准神 | 580-600 | 烈咬陆鲨(600) |
| OU | 500-580 | 喷火龙(534) |
| UU | 450-500 | 君主蛇(505) |
| RU | 400-450 | 火焰马(450) |
| NU | <400 | 小约克(330) |

## 属性分布

| 属性 | 数量 |
|------|------|
| 普通 | 52 |
| 飞行 | 46 |
| 地面 | 35 |
| 水 | 32 |
| 火 | 32 |
| 草 | 32 |
| 电 | 31 |
| 格斗 | 30 |
| 虫 | 30 |

## 快速查询技巧

- 中文名查询：用 `-` 连接，如 `mr-mime` → `mr-mime`
- 形态查询：加 `-mega`、`-alola` 等后缀
- 查找属性：用 `type/{type}` 端点

## 常用工具

- [PokeAPI](https://pokeapi.co/) - REST API
- [PokeAPI GraphQL](https://github.com/mazerty/pokeapi-graphql) - GraphQL封装
- [PokemonDB](https://pokemondb.net/) - 图鉴网站