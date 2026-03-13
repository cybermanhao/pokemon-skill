# 添加新精灵

## 使用 @pkmn/mods

```typescript
import { Dex, ID, ModData } from '@pkmn/dex';

const customDex = Dex.mod('custom' as ID, {
  Species: {
    'MyPokemon': {
      num: 10000,           // 唯一编号
      name: 'MyPokemon',      // 名称
      types: ['Fire', 'Dragon'],  // 属性
      baseStats: {          // 基础种族值
        hp: 100,
        atk: 120,
        def: 90,
        spa: 110,
        spd: 85,
        spe: 95
      },
      baseStatsTotal: 590,
      abilities: {           // 特性
        '0': 'MyAbility',
        'H': 'MyHiddenAbility'
      },
      height: 17,            // 身高 (dm)
      weight: 905,          // 体重 (hg)
      color: 'red',          // 颜色
      genderRatio: { male: '0.5', female: '0.5' },  // 性别比例
      evYield: {             // 努力值分配
        hp: 0,
        atk: 2,
        def: 0,
        spa: 0,
        spd: 0,
        spe: 0
      },
      evos: ['EvolvedForm'], // 进化后
      prevo: 'BaseForm',     // 进化前
      otherFormes: ['MyPokemonMega'],  // 其他形态
      tiers: ['OU'],         // 对战分级
      gen: 9                 // 首次出现世代
    }
  }
} as ModData);
```

## 精灵数据结构

```typescript
interface SpeciesData {
  num: number;              // 唯一编号
  name: string;             // 名称
  types: string[];          // 属性数组
  baseStats: {              // 基础种族值
    hp: number;
    atk: number;
    def: number;
    spa: number;
    spd: number;
    spe: number;
  };
  abilities: {              // 特性
    '0': string;           // 普通特性
    '1'?: string;          // 第二特性
    'H'?: string;          // 隐藏特性
    S?: string;            // 特殊特性
  };
  height?: number;         // 身高 (dm)
  weight?: number;         // 体重 (hg)
  color?: string;          // 颜色
  genderRatio?: { male: string; female: string };
  evYield?: Stats;         // 努力值分配
  evos?: string[];        // 进化后
  prevo?: string;         // 进化前
  otherFormes?: string[];  // 其他形态
  tiers?: string[];       // 对战分级
  gen?: number;           // 世代
}
```

## 示例：添加御三家

```typescript
const customDex = Dex.mod('custom' as ID, {
  Species: {
    'Firestarter': {
      num: 10001,
      name: 'Firestarter',
      types: ['Fire'],
      baseStats: { hp: 80, atk: 95, def: 80, spa: 110, spd: 85, spe: 100 },
      abilities: { '0': 'Blaze', 'H': 'Flash Fire' },
      evYield: { hp: 0, atk: 0, def: 0, spa: 2, spd: 0, spe: 0 },
      evos: ['Flareon'],
      prevo: undefined,
      height: 10,
      weight: 82,
      color: 'red',
      tiers: ['NFE']
    }
  }
} as ModData);
```

## 进化链配置

```typescript
const customDex = Dex.mod('custom' as ID, {
  Species: {
    'Baby': {
      num: 10001,
      name: 'Baby',
      types: ['Fire'],
      baseStats: { hp: 50, atk: 60, def: 50, spa: 70, spd: 50, spe: 65 },
      evos: ['Adult'],
      prevo: undefined,
      height: 3,
      weight: 25,
      tiers: ['NFE']
    },
    'Adult': {
      num: 10002,
      name: 'Adult',
      types: ['Fire'],
      baseStats: { hp: 80, atk: 95, def: 80, spa: 110, spd: 85, spe: 100 },
      abilities: { '0': 'Blaze' },
      evos: ['Evolved'],
      prevo: 'Baby',
      height: 15,
      weight: 90,
      tiers: ['OU']
    }
  }
} as ModData);
```
