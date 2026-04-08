# 精灵图鉴查询

## 查询精灵基础数据

```
GET https://pokeapi.co/api/v2/pokemon/{name or id}
```

名称用英文小写：`pikachu`, `bronzong`, `charizard`。特殊形态加后缀：`charizard-mega-x`, `meowth-alola`。

关键响应字段：

```json
{
  "id": 437,
  "name": "bronzong",
  "types": [
    {"slot": 1, "type": {"name": "steel"}},
    {"slot": 2, "type": {"name": "psychic"}}
  ],
  "abilities": [
    {"ability": {"name": "levitate"}, "is_hidden": false},
    {"ability": {"name": "heatproof"}, "is_hidden": false}
  ],
  "stats": [
    {"base_stat": 67, "stat": {"name": "hp"}},
    {"base_stat": 89, "stat": {"name": "attack"}},
    ...
  ],
  "height": 13,
  "weight": 1870
}
```

## 查询精灵的详细描述（图鉴文本）

```
GET https://pokeapi.co/api/v2/pokemon-species/{name or id}
```

返回图鉴条目、蛋组、孵化步数、性别比例、基础友好度等。

## 列出某属性的所有精灵

```
GET https://pokeapi.co/api/v2/type/{type_name}
```

响应中 `pokemon` 字段包含该属性的所有精灵列表。

## 搜索技巧

- 不确定英文名：先查 `/pokemon-species?limit=1000` 获取全列表，或用 PokemonDB 搜中文名对应的英文名
- 地区形态：`-alola`, `-galar`, `-hisui`, `-paldea` 后缀
- 巨化/特殊形态：`-mega`, `-mega-x`, `-mega-y`, `-primal`, `-origin`
