# 特性查询

## 查询特性数据

```
GET https://pokeapi.co/api/v2/ability/{name}
```

名称用英文小写连字符：`levitate`, `flash-fire`, `volt-absorb` 等。

关键响应字段：

```json
{
  "name": "levitate",
  "effect_entries": [
    {
      "effect": "Gives immunity to Ground-type moves...",
      "language": {"name": "en"}
    }
  ],
  "pokemon": [...]   // 拥有该特性的精灵列表
}
```

## 查询精灵的特性

通过 `/pokemon/{name}` 响应中的 `abilities` 字段获取：

```json
{
  "abilities": [
    {"ability": {"name": "levitate"}, "is_hidden": false, "slot": 1},
    {"ability": {"name": "heatproof"}, "is_hidden": false, "slot": 2}
  ]
}
```

`is_hidden: true` 表示隐藏特性，普通游玩较难获得。

## 特性描述是权威来源

不要依赖任何枚举列表来判断特性效果。拿到特性名后，直接查 `/ability/{name}` 读取 `effect_entries`，这是最准确的来源。

特性效果多样且版本间有变化，只有 API 响应才能保证准确性。
