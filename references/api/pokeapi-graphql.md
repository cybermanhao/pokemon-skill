# PokéAPI GraphQL

## 概述

PokéAPI 提供 GraphQL 接口，可以更灵活地查询数据。

**Beta 端点**: `https://beta.pokeapi.co/graphql/v1beta`

## 基础用法

### 查询精灵

```graphql
query {
  pokemon_v2_pokemon(where: {name: {_eq: "charizard"}}) {
    id
    name
    pokemon_v2_pokemontypes {
      pokemon_v2_type {
        name
      }
    }
    pokemon_v2_pokemonstats {
      base_stat
      pokemon_v2_stat {
        name
      }
    }
  }
}
```

### 查询技能

```graphql
query {
  pokemon_v2_move(where: {name: {_eq: "flamethrower"}}) {
    id
    name
    type_id
    power
    accuracy
    pp
    pokemon_v2_movedamageclass {
      name
    }
  }
}
```

### 查询进化链

```graphql
query {
  pokemon_v2_evolutionchain(where: {id: {_eq: 2}}) {
    id
    pokemon_v2_evolutionchaindetails {
      min_level
      pokemon_v2_item {
        name
      }
      evolutiontrigger_id
    }
  }
}
```

### 分页查询

```graphql
query {
  pokemon_v2_pokemon(limit: 10, offset: 0) {
    id
    name
  }
}
```

## 主要类型

| 类型 | 描述 |
|------|------|
| pokemon_v2_pokemon | 精灵 |
| pokemon_v2_move | 技能 |
| pokemon_v2_ability | 特性 |
| pokemon_v2_item | 道具 |
| pokemon_v2_type | 属性 |
| pokemon_v2_evolutionchain | 进化链 |
| pokemon_v2_location | 地点 |

## 关系查询

```graphql
query {
  pokemon_v2_pokemon(where: {name: {_eq: "charizard"}}) {
    name
    pokemon_v2_pokemonsprites {
      sprites
    }
    pokemon_v2_pokemonabilities {
      pokemon_v2_ability {
        name
        pokemon_v2_abilityeffecttexts {
          short_effect
        }
      }
    }
  }
}
```

## 使用建议

- GraphQL API 仍在 beta 中
- 推荐在本地运行完整版本
- 使用 Hasura 引擎

## 扩展阅读

- GitHub: https://github.com/PokeAPI/pokeapi
- 完整 schema 需要本地运行查看
