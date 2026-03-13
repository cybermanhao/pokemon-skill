# 添加新道具

## 使用 @pkmn/mods

```typescript
import { Dex, ID, ModData } from '@pkmn/dex';

const customDex = Dex.mod('custom' as ID, {
  Items: {
    'MyItem': {
      num: 10000,
      name: 'My Item',
      desc: 'A powerful custom item.',       // 描述
      shortDesc: 'Boosts Sp. Atk by 50%.',  // 简短描述
      onModifySpA: (pokemon, source, target, move) => {
        return Math.floor(source.stats.spa * 1.5);
      },
      onTakeItem: (item, pokemon) => {
        return true;
      }
    }
  }
} as ModData);
```

## 道具数据结构

```typescript
interface ItemData {
  num: number;              // 唯一编号
  name: string;             // 名称
  desc?: string;            // 完整描述
  shortDesc?: string;       // 简短描述
  sprite?: string;          // 图片
  isNonstandard?: boolean;  // 是否非标准
  fling?: {
    basePower?: number;
    effect?: string;
  };
  // 触发器函数
  onStart?: (pokemon) => void;
  onModifyAtk?: (pokemon, source, target, move) => number | false;
  onModifySpA?: (pokemon, source, target, move) => number | false;
  onModifyDef?: (pokemon, source, target, move) => number | false;
  onModifySpD?: (pokemon, source, target, move) => number | false;
  onModifySpe?: (pokemon, source, target, move) => number | false;
  onAfterMove?: (pokemon, target, move) => void;
  onAfterHit?: (pokemon, target, move) => void;
  onDamagingHit?: (pokemon, target, move, damage) => void;
  onFaint?: (pokemon) => void;
  onAfterUse?: (pokemon) => void;
  onTryHit?: (pokemon, target, move) => boolean | void;
  onBasePower?: (pokemon, target, move, basePower) => number;
  onTakeItem?: (item, pokemon) => boolean;
}
```

## 道具类型示例

### 能力增强道具

```typescript
ChoiceScarf: {
  num: 10001,
  name: 'Choice Scarf',
  shortDesc: 'Boosts Speed by 50%, locks to one move.',
  onModifySpe: (pokemon) => {
    return Math.floor(pokemon.stats.spe * 1.5);
  }
}
```

### 属性增强道具

```typescript
LifeOrb: {
  num: 10002,
  name: 'Life Orb',
  shortDesc: 'Boosts move power by 30%, damages user by 10%.',
  onBasePower: (pokemon, target, move, basePower) => {
    return Math.floor(basePower * 1.3);
  },
  onAfterMove: (pokemon, target, move) => {
    pokemon.damage(Math.floor(pokemon.maxhp / 10));
  }
}
```

### 回复道具

```typescript
Leftovers: {
  num: 10003,
  name: 'Leftovers',
  shortDesc: 'Heals 1/16 HP each turn.',
  onResidual: (pokemon) => {
    pokemon.heal(Math.floor(pokemon.maxhp / 16));
  }
}
```

### Z 水晶

```typescript
FiriumZ: {
  num: 10004,
  name: 'Firium Z',
  shortDesc: 'Fire-type moves become Z-Moves.',
  onTryMove: (pokemon, target, move) => {
    if (move.type === 'Fire' && move.isZ) {
      move.isZ = false;
      move.isMax = true;
    }
  }
}
```

### 进化道具

```typescript
FireStone: {
  num: 10005,
  name: 'Fire Stone',
  shortDesc: 'Evolves certain Pokemon.',
  onEvolve: (pokemon) => {
    return pokemon.name === 'Charmander';
  }
}
```

### 场地道具

```typescript
TerrainExtender: {
  num: 10006,
  name: 'Electric Seed',
  shortDesc: 'Activates Electric Terrain when held.',
  onStart: (pokemon) => {
    if (pokemon.field.terrain === '') {
      pokemon.field.setTerrain('electricterrain');
    }
  }
}
```

### 力量道具

```typescript
PowerHerb: {
  num: 10007,
  name: 'Power Herb',
  shortDesc: 'Two-turn moves charge instantly.',
  onModifyMove: (pokemon, target, move) => {
    if (move.isTwoTurnMove) {
      move.isTwoTurnMove = false;
    }
  }
}
```
