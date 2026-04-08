# 技能查询

## 查询技能数据

```
GET https://pokeapi.co/api/v2/move/{name}
```

名称用英文小写连字符：`flamethrower`, `thunder-wave`, `close-combat`。

关键响应字段：

```json
{
  "name": "flamethrower",
  "type": {"name": "fire"},
  "power": 90,
  "pp": 15,
  "accuracy": 100,
  "damage_class": {"name": "special"},
  "effect_entries": [{"effect": "Has a 10% chance to burn the target."}],
  "meta": {
    "ailment": {"name": "burn"},
    "ailment_chance": 10,
    "flinch_chance": 0,
    "stat_chance": 0
  }
}
```

## 查询精灵可学的技能

```
GET https://pokeapi.co/api/v2/pokemon/{name}
```

响应中 `moves` 字段列出该精灵可学的所有技能及学习方式（level-up / machine / egg / tutor）。

## 列出某属性的所有技能

```
GET https://pokeapi.co/api/v2/type/{type_name}
```

响应中 `moves` 字段包含该属性的所有技能列表。
