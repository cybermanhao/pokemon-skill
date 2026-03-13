# @pkmn/dex - 统一数据层

## 安装

```bash
npm install @pkmn/dex
```

## 概述

@pkmn/dex 是 Pokemon Showdown 数据的统一接口，可查询精灵、技能、特性、道具体等数据。

## 基础用法

### 获取精灵数据

```typescript
import { Dex } from '@pkmn/dex';

const dex = Dex.forGen(8);
const charizard = dex.species.get('Charizard');

console.log(charizard.types);        // ['Fire', 'Flying']
console.log(charizard.baseStats);    // { hp: 78, atk: 84, def: 78, spa: 109, spd: 85, spe: 100 }
console.log(charizard.abilities);    // { '0': 'Blaze', 'H': 'Solar Power' }
```

### 获取技能数据

```typescript
const flamethrower = dex.moves.get('Flamethrower');
console.log(flamethrower.type);      // 'Fire'
console.log(flamethrower.basePower); // 90
console.log(flamethrower.accuracy);  // 100
console.log(flamethrower.category);  // 'Special'
```

### 获取特性数据

```typescript
const blaze = dex.abilities.get('Blaze');
console.log(blaze.desc);             // description
```

### 获取道具体数据

```typescript
const choiceSpecs = dex.items.get('Choice Specs');
console.log(choiceSpecs.desc);       // description
```

### 属性克制计算

```typescript
const fireType = dex.types.get('Fire');
console.log(fireType.damageTaken);   // { Fire: 1, Water: 2, Grass: 0, ... }

// 计算伤害倍数
console.log(dex.types.get('Fire').effectiveAgainst('Grass')); // 2
console.log(dex.types.get('Fire').effectiveAgainst('Water')); // 0.5
```

## 数据迭代

```typescript
// 遍历所有精灵
for (const pokemon of dex.species) {
  console.log(pokemon.name);
}

// 查询符合条件的精灵
const firePokemons = [...dex.species].filter(p => p.types.includes('Fire'));
```

## 世代处理

```typescript
const gen1 = Dex.forGen(1);  // 原始 151
const gen9 = Dex.forGen(9);  // 最新世代
```

## 扩展阅读

- GitHub: https://github.com/pkmn/ps/tree/main/dex
