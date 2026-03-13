# 添加新特性

## 使用 @pkmn/mods

```typescript
import { Dex, ID, ModData } from '@pkmn/dex';

const customDex = Dex.mod('custom' as ID, {
  Abilities: {
    'MyAbility': {
      num: 10000,
      name: 'My Ability',
      desc: 'A powerful custom ability.',      // 描述
      shortDesc: 'Boosts fire moves.',        // 简短描述
      onModifySpA: (pokemon, source, target) => {
        if (pokemon.hasType('Fire')) {
          return Math.floor(source.stats.spa * 1.5);
        }
      }
    }
  }
} as ModData);
```

## 特性数据结构

```typescript
interface AbilityData {
  num: number;              // 唯一编号
  name: string;             // 名称
  desc?: string;            // 完整描述
  shortDesc?: string;       // 简短描述
  rating?: number;          // 特性评级 (F 到 S)
  isNonstandard?: boolean;  // 是否非标准
  // 触发器函数
  onAfterUse?: (pokemon) => void;
  onAfterHit?: (pokemon, target, move) => void;
  onAfterMove?: (pokemon, target, move) => void;
  onBeforeMove?: (pokemon, target, move) => boolean | void;
  onDamagingHit?: (pokemon, target, move, damage) => void;
  onFaint?: (pokemon) => void;
  onHitField?: (target, source, move) => void;
  onModifyAccuracy?: (pokemon, target, move) => number;
  onModifyAtk?: (pokemon, source, target, move) => number | false;
  onModifyDef?: (pokemon, source, target, move) => number | false;
  onModifySpA?: (pokemon, source, target, move) => number | false;
  onModifySpD?: (pokemon, source, target, move) => number | false;
  onModifySpe?: (pokemon, source, target, move) => number | false;
  onModifyMove?: (pokemon, target, move) => void;
  onTryHit?: (pokemon, target, move) => boolean | void;
  onAfterSetStatus?: (pokemon, status) => void;
  onSetStatus?: (pokemon, status) => boolean | void;
  onWeatherChange?: (pokemon, weather) => void;
  onTerrainChange?: (pokemon, terrain) => void;
}
```

## 特性类型示例

### 属性增强特性

```typescript
FireBoost: {
  num: 10001,
  name: 'Fire Boost',
  shortDesc: 'Boosts Special Attack when using Fire moves.',
  onModifySpA: (pokemon, source, target, move) => {
    if (move?.type === 'Fire') {
      return Math.floor(source.stats.spa * 1.5);
    }
  }
}
```

### 天气特性

```typescript
Drought: {
  num: 10002,
  name: 'Drought',
  shortDesc: 'Summons sun upon entering battle.',
  onStart: (pokemon) => {
    pokemon.field.setWeather('sunnyday');
  }
}
```

### 受到攻击触发

```typescript
MagicGuard: {
  num: 10003,
  name: 'Magic Guard',
  shortDesc: 'Prevents indirect damage.',
  onDamage: (pokemon, damage, source, effect) => {
    if (effect.id !== 'direct') {
      return false;
    }
  }
}
```

### 击败触发

```typescript
Moxie: {
  num: 10004,
  name: 'Moxie',
  shortDesc: 'Boosts Attack after KO.',
  onAfterKill: (pokemon, target) => {
    pokemon.boosts.atk += 1;
  }
}
```

### 道具效果

```typescript
Unburden: {
  num: 10005,
  name: 'Unburden',
  shortDesc: 'Boosts Speed when item is consumed.',
  onAfterUse: (pokemon, item) => {
    if (item) {
      pokemon.addVolatile('unburden');
    }
  }
}
```

### 免疫特性

```typescript
WaterAbsorb: {
  num: 10006,
  name: 'Water Absorb',
  shortDesc: 'Immune to Water, heals instead.',
  onTryHit: (pokemon, target, move) => {
    if (move.type === 'Water') {
      pokemon.heal(pokemon.maxhp / 4);
      return null;
    }
  }
}
```

### 变化天气/地形

```typescript
ElectricSurge: {
  num: 10007,
  name: 'Electric Surge',
  shortDesc: 'Sets Electric Terrain on entry.',
  onStart: (pokemon) => {
    pokemon.field.setTerrain('electricterrain');
  }
}
```
