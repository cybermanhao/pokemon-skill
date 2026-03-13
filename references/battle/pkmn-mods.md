# @pkmn/mods - 自定义扩展

## 安装

```bash
npm install @pkmn/mods
```

## 概述

@pkmn/mods 提供修改和扩展 Pokemon 数据的能力，可添加自定义精灵、技能、特性等。

## 基础用法

### 应用现有 Mod

```typescript
import { Dex, ID, ModData } from '@pkmn/dex';

// 使用 Gen 7 SM 数据
const dex = Dex.mod('gen7sm' as ID, await import('@pkmn/mods/gen7sm') as ModData);
```

### 创建自定义 Mod

```typescript
import { Dex, ID, ModData } from '@pkmn/dex';
import { ModdedDex } from '@pkmn/mods';

// 创建自定义精灵
const customDex = Dex.mod('custom' as ID, {
  Species: {
    'MyPokemon': {
      num: 10000,
      name: 'MyPokemon',
      types: ['Fire', 'Dragon'],
      baseStats: { hp: 100, atk: 120, def: 90, spa: 110, spd: 85, spe: 95 },
      abilities: { '0': 'MyAbility' }
    }
  },
  Abilities: {
    'MyAbility': {
      num: 10000,
      name: 'MyAbility',
      desc: 'Custom ability description',
      shortDesc: 'Custom ability short description'
    }
  }
} as ModData);
```

### 修改现有数据

```typescript
const modifiedDex = Dex.mod('buffedcharizard' as ID, {
  Species: {
    'Charizard': {
      inherit: true,
      baseStats: { hp: 100, atk: 100, def: 100, spa: 150, spd: 100, spe: 120 }
    }
  }
} as ModData);
```

### 使用 ModdedDex 扩展

```typescript
import { Dex, ID, ModData, Ability, AbilityData } from '@pkmn/dex';
import { ModdedDex } from '@pkmn/mods';

const dex = Dex.mod('foo' as ID, {
  Abilities: {
    magicguard: { inherit: true, foo: 5 },
  },
} as ModData);

const modded = new ModdedDex<Ability & {foo?: number}, AbilityData & {foo?: number}>(dex);
console.log(modded.abilities.get('magicguard').foo); // 5
```

## 扩展类型

### 添加自定义技能

```typescript
const customDex = Dex.mod('custommoves' as ID, {
  Moves: {
    'CustomMove': {
      num: 10000,
      name: 'Custom Move',
      type: 'Fire',
      category: 'Special',
      basePower: 120,
      accuracy: 85,
      pp: 5,
      desc: 'A powerful custom move'
    }
  }
} as ModData);
```

### 添加自定义道具体

```typescript
const customDex = Dex.mod('customitems' as ID, {
  Items: {
    'CustomItem': {
      num: 10000,
      name: 'Custom Item',
      desc: 'A powerful custom item',
      shortDesc: 'Boosts special attack',
      onModifySpA: () => 1.2
    }
  }
} as ModData);
```

## 扩展阅读

- GitHub: https://github.com/pkmn/ps/tree/main/mods
