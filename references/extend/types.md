# 添加新属性

## 使用 @pkmn/mods

```typescript
import { Dex, ID, ModData } from '@pkmn/dex';

const customDex = Dex.mod('custom' as ID, {
  Types: {
    'Cosmic': {
      name: 'Cosmic',
      damageTaken: { '*': 1 },  // 被一切属性克制
      HPivs: { spe: 30 },
      colors: ['Purple']
    }
  },
  TypeChart: {
    // 定义克制关系
    Cosmic: {
      '*': 1,         // 被一切属性 2x
      Cosmic: 1,
      Normal: 0.5,
      Fire: 0.5,
      Water: 0.5,
      Electric: 0.5,
      Grass: 0.5,
      Ice: 0.5,
      Fighting: 2,
      Poison: 0.5,
      Ground: 2,
      Flying: 0.5,
      Psychic: 0.5,
      Bug: 0.5,
      Rock: 2,
      Ghost: 0.5,
      Dragon: 0.5,
      Dark: 0.5,
      Steel: 2,
      Fairy: 0.5
    }
  }
} as ModData);
```

## 属性数据结构

```typescript
interface TypeData {
  name: string;             // 属性名称
  id?: string;              // 属性 ID
  damageTaken: {            // 受伤害倍率
    [key: string]: number; // 0=无效, 1=normal, 2=super, 0.5=resist
  };
  HPivs?: {                 // HP 形态 IV
    [stat: string]: number;
  };
  colors?: string[];        // 显示颜色
}
```

## 克制关系图

```typescript
// 标准属性克制 (Fire 为例)
Fire: {
  Fire: 1,      // 被火 1x
  Water: 2,     // 被水 2x (克制)
  Grass: 0.5,   // 被草 0.5x (抵抗)
  Ice: 0.5,     // 被冰 0.5x
  Ground: 2,    // 被地面 2x
  Rock: 0.5,   // 被岩石 0.5x
  Bug: 0.5,     // 被虫 0.5x
  Steel: 0.5,   // 被钢 0.5x
  Dragon: 1,   // 被龙 1x
  Fairy: 0.5    // 被妖精 0.5x
}
```

## 添加新属性

```typescript
Cosmic: {
  name: 'Cosmic',
  damageTaken: {
    Cosmic: 1,
    Normal: 0.5,
    Fire: 0.5,
    Water: 0.5,
    Electric: 0.5,
    Grass: 0.5,
    Ice: 0.5,
    Fighting: 2,
    Poison: 0.5,
    Ground: 2,
    Flying: 0.5,
    Psychic: 0.5,
    Bug: 0.5,
    Rock: 2,
    Ghost: 0.5,
    Dragon: 0.5,
    Dark: 0.5,
    Steel: 2,
    Fairy: 0.5,
    Cosmic: 2
  }
}
```

## 在精灵中使用新属性

```typescript
Species: {
  'CosmicMon': {
    types: ['Cosmic', 'Psychic']
  }
}
```

## 在技能中使用新属性

```typescript
Moves: {
  'CosmicPower': {
    type: 'Cosmic'
  }
}
```
