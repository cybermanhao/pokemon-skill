# 进化链查询

## 查询精灵的进化链

先通过 species 获取进化链 ID：

```
GET https://pokeapi.co/api/v2/pokemon-species/{name}
```

响应中 `evolution_chain.url` 指向进化链详情，再请求该 URL：

```
GET https://pokeapi.co/api/v2/evolution-chain/{id}
```

## 进化链响应结构

```json
{
  "chain": {
    "species": {"name": "gastly"},
    "evolves_to": [{
      "species": {"name": "haunter"},
      "evolution_details": [{
        "trigger": {"name": "level-up"},
        "min_level": 25
      }],
      "evolves_to": [{
        "species": {"name": "gengar"},
        "evolution_details": [{
          "trigger": {"name": "trade"}
        }]
      }]
    }]
  }
}
```

## evolution_details 中的进化条件字段

| 字段 | 含义 |
|------|------|
| `trigger` | 进化触发方式：`level-up`, `trade`, `use-item`, `shed` |
| `min_level` | 最低等级 |
| `item` | 所需道具（进化石等） |
| `held_item` | 携带道具 |
| `known_move` | 需掌握的技能 |
| `min_happiness` | 最低友好度 |
| `time_of_day` | 时间限制：`day` / `night` |
| `location` | 特定地点 |
| `gender` | 性别限制 |

不要猜测进化条件 — 直接查 API，条件组合因精灵而异。
