# 道具查询

## 查询道具数据

```
GET https://pokeapi.co/api/v2/item/{name}
```

名称用英文小写连字符：`choice-specs`, `leftovers`, `life-orb`。

关键响应字段：

```json
{
  "name": "choice-specs",
  "category": {"name": "held-items"},
  "effect_entries": [{"effect": "Holder's special attack is 1.5x, but it can only use the first move it selects."}],
  "held_by_pokemon": [...]
}
```

## 按分类列出道具

```
GET https://pokeapi.co/api/v2/item-category/{name}
```

常用分类：`held-items`, `medicine`, `pokeballs`, `berries`, `evolution`。

## 查询携带某道具的精灵

道具响应中 `held_by_pokemon` 字段列出野生携带该道具的精灵及出现概率。

## 查询浆果效果

```
GET https://pokeapi.co/api/v2/berry/{name}
```

返回浆果的自然度、成熟时间、效果等。对应道具通过 `item` 字段关联。
