# PokéAPI REST API

## 概述

PokéAPI 是免费的宝可梦数据 REST API，提供 48 个端点的完整数据。

**Base URL**: `https://pokeapi.co/api/v2/`

## 端点列表

| 端点 | 描述 |
|------|------|
| /pokemon/{id or name}/ | 精灵数据 |
| /move/{id or name}/ | 技能数据 |
| /ability/{id or name}/ | 特性数据 |
| /item/{id or name}/ | 道具数据 |
| /type/{id or name}/ | 属性数据 |
| /evolution-chain/{id}/ | 进化链 |
| /location/{id or name}/ | 地点 |
| /pokemon-species/{id or name}/ | 物种数据 |

## 基础用法

### 获取精灵数据

```typescript
const response = await fetch('https://pokeapi.co/api/v2/pokemon/charizard');
const data = await response.json();

console.log(data.name);           // 'charizard'
console.log(data.types);          // [{ type: { name: 'fire' } }, { type: { name: 'flying' } }]
console.log(data.stats);          // [{ stat: { name: 'hp' }, base_stat: 78 }, ...]
console.log(data.abilities);      // [{ ability: { name: 'blaze' } }, ...]
console.log(data.moves);          // [{ move: { name: 'flamethrower' } }, ...]
```

### 获取技能数据

```typescript
const response = await fetch('https://pokeapi.co/api/v2/move/thunderbolt');
const data = await response.json();

console.log(data.name);           // 'thunderbolt'
console.log(data.type);           // { name: 'electric' }
console.log(data.power);          // 90
console.log(data.accuracy);       // 100
console.log(data.category);       // { name: 'special' }
```

### 分页查询

```typescript
// 获取前 20 个精灵
const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=20');
const data = await response.json();

console.log(data.count);    // 1281
console.log(data.next);    // URL to next page
console.log(data.previous); // URL to previous page
console.log(data.results); // [{ name: 'bulbasaur', url: '...' }, ...]

// 获取第 2 页
const page2 = await fetch('https://pokeapi.co/api/v2/pokemon?limit=20&offset=20');
```

### 获取所有精灵

```typescript
async function getAllPokemon() {
  const allPokemon = [];
  let url = 'https://pokeapi.co/api/v2/pokemon?limit=1000';

  while (url) {
    const response = await fetch(url);
    const data = await response.json();
    allPokemon.push(...data.results);
    url = data.next;
  }

  return allPokemon;
}
```

## 数据结构

### Pokemon 响应结构

```typescript
interface PokemonResponse {
  id: number;
  name: string;
  base_experience: number;
  height: number;
  weight: number;
  types: Array<{ slot: number, type: { name: string, url: string } }>;
  stats: Array<{ base_stat: number, effort: number, stat: { name: string, url: string } }>;
  abilities: Array<{ is_hidden: boolean, slot: number, ability: { name: string, url: string } }>;
  moves: Array<{ move: { name: string, url: string }, version_group_details: any[] }>;
  sprites: {
    front_default: string;
    front_shiny: string;
    other: { 'official-artwork': { front_default: string } };
  };
}
```

## 缓存建议

- PokéAPI 是免费服务，请合理使用
- 建议缓存数据到本地
- 使用 `?limit=1000` 获取更多数据

## 扩展阅读

- 文档: https://pokeapi.co/docs/v2
- 完整端点列表: https://pokeapi.co/api/v2
