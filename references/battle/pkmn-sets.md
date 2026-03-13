# @pkmn/sets - 队伍解析

## 安装

```bash
npm install @pkmn/sets
```

## 概述

@pkmn/sets 提供 Pokemon Showdown 队伍字符串的解析和导出功能。

## 基础用法

### 解析队伍字符串

```typescript
import { Sets } from '@pkmn/sets';

const set = Sets.importSet(
`Tangrowth @ Assault Vest
Ability: Regenerator
EVs: 248 HP / 8 Def / 252 SpD
Sassy Nature
IVs: 30 Atk / 30 Def
- Giga Drain
- Knock Off
- Hidden Power [Ice]
- Earthquake`
);

console.log(set.name);        // 'Tangrowth'
console.log(set.item);        // 'Assault Vest'
console.log(set.ability);     // 'Regenerator'
console.log(set.evs);         // { hp: 248, def: 8, spd: 252 }
console.log(set.nature);      // 'Sassy'
console.log(set.moves);       // ['Giga Drain', 'Knock Off', 'Hidden Power Ice', 'Earthquake']
```

### 打包队伍 (用于传输)

```typescript
import { Sets } from '@pkmn/sets';
import { Dex } from '@pkmn/dex';

const dex = Dex.forGen(8);
const packed = Sets.pack({
  name: 'Charizard',
  species: 'Charizard',
  item: 'Choice Scarf',
  ability: 'Blaze',
  nature: 'Timid',
  evs: { spa: 252, spe: 252, hp: 6 },
  moves: ['Flamethrower', 'Fire Blast', 'Air Slash', 'Roost']
}, dex);

console.log(packed);
// 'Charizard|ChoiceScarf|Blaze|Flamethrower,FireBlast,AirSlash,Roost|Timid|252,,,252,6|||||'
```

### 解包队伍

```typescript
const unpacked = Sets.unpack(
  'Charizard|ChoiceScarf|Blaze|Flamethrower,FireBlast,AirSlash,Roost|Timid|252,,,252,6|||||',
  Dex.forGen(8)
);
```

### 生成队伍

```typescript
import { Sets } from '@pkmn/sets';

const teamString = Sets.exportTeam([
  { name: 'Charizard', species: 'Charizard', item: 'Choice Scarf', ability: 'Blaze', moves: ['Flamethrower'] },
  { name: 'Blastoise', species: 'Blastoise', item: 'Shell Armor', moves: ['Hydro Pump'] }
]);
```

## 数据格式

### 队伍对象结构

```typescript
interface PokemonSet {
  name?: string;
  species: string;
  item?: string;
  ability?: string;
  nature?: string;
  evs?: { hp?: number, atk?: number, def?: number, spa?: number, spd?: number, spe?: number };
  ivs?: { hp?: number, atk?: number, def?: number, spa?: number, spd?: number, spe?: number };
  moves?: string[];
  gender?: 'M' | 'F';
  level?: number;
  shiny?: boolean;
}
```

## 扩展阅读

- GitHub: https://github.com/pkmn/ps/tree/main/sets
