# 添加新天气/地形

## 使用 @pkmn/mods

### 添加新天气

```typescript
import { Dex, ID, ModData } from '@pkmn/dex';

const customDex = Dex.mod('custom' as ID, {
  Conditions: {
    'myweather': {
      name: 'My Weather',
      duration: 5,
      onStart: (field) => {
        field.setWeather('myweather');
      },
      onResidual: (field) => {
        field.weatherData.duration--;
      },
      onEnd: (field) => {
        field.clearWeather();
      }
    }
  }
} as ModData);
```

### 添加新地形

```typescript
const customDex = Dex.mod('custom' as ID, {
  Conditions: {
    'myterrain': {
      name: 'My Terrain',
      duration: 8,
      onStart: (field) => {
        field.setTerrain('myterrain');
      },
      onResidual: (field) => {
        field.terrainData.duration--;
      },
      onEnd: (field) => {
        field.clearTerrain();
      }
    }
  }
} as ModData);
```

## 天气数据结构

```typescript
interface WeatherData {
  name: string;
  duration?: number;
  onStart?: (field, source) => void;
  onResidual?: (field) => void;
  onEnd?: (field) => void;
  onModifySpA?: (pokemon, source, target, move, stat) => number;
  onModifyAtk?: (pokemon, source, target, move, stat) => number;
  // ... 其他能力修改
}
```

## 天气效果示例

### 增强特定属性

```typescript
SunnyDay: {
  name: 'Sun',
  onStart: (field) => {
    field.setWeather('sunnyday');
  },
  onModifySpA: (pokemon, source, target, move, stat) => {
    if (move.type === 'Fire') {
      return Math.floor(stat * 1.5);
    }
    if (move.type === 'Water') {
      return Math.floor(stat * 0.5);
    }
  }
}
```

### 伤害效果

```typescript
Sandstorm: {
  name: 'Sandstorm',
  onStart: (field) => {
    field.setWeather('sandstorm');
  },
  onResidual: (field) => {
    for (const pokemon of field.active) {
      if (!pokemon.hasType('Rock') &&
          !pokemon.hasType('Ground') &&
          !pokemon.hasAbility('Sand Rush')) {
        pokemon.damage(Math.floor(pokemon.maxhp / 16));
      }
    }
  }
}
```

## 地形效果示例

### 属性增强地形

```typescript
ElectricTerrain: {
  name: 'Electric Terrain',
  onStart: (field) => {
    field.setTerrain('electricterrain');
  },
  onModifySpA: (pokemon, source, target, move, stat) => {
    if (pokemon.isGrounded() && move.type === 'Electric') {
      return Math.floor(stat * 1.5);
    }
  }
}
```

### 场地效果

```typescript
PsychicTerrain: {
  name: 'Psychic Terrain',
  onStart: (field) => {
    field.setTerrain('psychicterrain');
  },
  onTryMove: (pokemon, target, move) => {
    if (move.priority > 0 && !pokemon.hasAbility('Psychic Surge')) {
      return false;
    }
  }
}
```

## 技能触发天气

```typescript
RainDance: {
  name: 'Rain Dance',
  type: 'Water',
  category: 'Status',
  onHitField: (target, source) => {
    target.setWeather('raindance', source);
  }
}
```
