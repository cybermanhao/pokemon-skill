# 添加新状态/效果

## 使用 @pkmn/mods

### 添加新异常状态

```typescript
import { Dex, ID, ModData } from '@pkmn/dex';

const customDex = Dex.mod('custom' as ID, {
  Conditions: {
    'custompoison': {
      name: 'Custom Poison',
      type: 'Status',
      onStart: (target, source, effect) => {
        target.setStatus('custompoison');
        target.statusData.stage = 0;
      },
      onResidual: (target) => {
        target.damage(Math.floor(target.maxhp / 8));
      }
    }
  }
} as ModData);
```

## 状态类型

### 异常状态 (Status Conditions)

```typescript
// 烧伤
brn: {
  name: 'brn',
  onStart: (target) => {
    target.setStatus('brn');
    target.statusData.stage = 0;
  },
  onResidual: (target) => {
    target.damage(Math.floor(target.maxhp / 16));
  },
  onModifyAtk: (pokemon, source, target, move, stat) => {
    if (move.category === 'Physical') {
      return Math.floor(stat * 0.5);
    }
  }
}

// 冰冻
frz: {
  name: 'frz',
  onStart: (target) => {
    target.setStatus('frz');
  },
  onBeforeMove: (pokemon, target, move) => {
    if (move.category !== 'Status') {
      return false;  // 无法行动
    }
  }
}

// 睡眠
slp: {
  name: 'slp',
  onStart: (target) => {
    target.setStatus('slp');
    target.statusData.stage = random(1, 3);
  },
  onBeforeMove: (pokemon, target, move) => {
    if (move.category !== 'Status') {
      return false;
    }
  }
}

// 麻痹
par: {
  name: 'par',
  onStart: (target) => {
    target.setStatus('par');
  },
  onModifySpe: (pokemon, source, target, move, stat) => {
    return Math.floor(stat * 0.5);
  },
  onBeforeMove: (pokemon, target, move) => {
    if (random(4) === 0) {  // 25% 概率无法行动
      return false;
    }
  }
}

// 中毒
psn: {
  name: 'psn',
  onStart: (target) => {
    target.setStatus('psn');
  },
  onResidual: (target) => {
    target.damage(Math.floor(target.maxhp / 8));
  }
}
```

### 场地状态 (Field Conditions)

```typescript
// 隐形岩
stealthrock: {
  name: 'Stealth Rock',
  type: 'Rock',
  onStart: (side) => {
    side.addSideCondition('stealthrock');
  },
  onDamagingHit: (pokemon, source, move) => {
    const typeEffectiveness = pokemon.getTypeEffectiveness(move.type);
    pokemon.damage(Math.floor(pokemon.maxhp * 0.125 * typeEffectiveness));
  }
}

// 毒菱
toxicspikes: {
  name: 'Toxic Spikes',
  type: 'Poison',
  onStart: (side) => {
    side.addSideCondition('toxicspikes');
  },
  onEntryHazard: (pokemon) => {
    if (pokemon.hasType('Poison') || pokemon.hasType('Steel')) {
      return;  // 免疫
    }
    if (pokemon.side.conditions['toxicspikes']?.layers === 2) {
      pokemon.setStatus('tox');
    } else {
      pokemon.setStatus('psn');
    }
  }
}

// 黏黏网
stickyweb: {
  name: 'Sticky Web',
  type: 'Bug',
  onStart: (side) => {
    side.addSideCondition('stickyweb');
  },
  onAfterSwitchIn: (pokemon) => {
    pokemon.boosts.spe = -1;
  }
}
```

### 精灵状态 (Volatile Conditions)

```typescript
// 替身
substitute: {
  name: 'substitute',
  onStart: (pokemon) => {
    if (pokemon.hp > Math.floor(pokemon.maxhp / 4)) {
      pokemon.damage(Math.floor(pokemon.maxhp / 4));
      pokemon.addVolatile('substitute');
    }
  },
  onFaint: (pokemon) => {
    pokemon.removeVolatile('substitute');
  }
}

// 能力变化
boost: {
  name: 'boost',
  onAfterBoost: (pokemon, source, boost) => {
    // 处理能力变化
  }
}
```

## 完整示例：自定义状态

```typescript
Conditions: {
  'electrified': {
    name: 'Electrified',
    onStart: (target) => {
      target.addVolatile('electrified');
    },
    onHit: (target, source, move) => {
      if (move.category !== 'Status') {
        // 受到电属性攻击时麻痹
        source.setStatus('par');
      }
    },
    onEnd: (target) => {
      target.removeVolatile('electrified');
    }
  }
}
```

## 触发位置

| 位置 | 描述 |
|------|------|
| onStart | 状态开始时触发 |
| onResidual | 每回合结束时触发 |
| onEnd | 状态结束时触发 |
| onHit | 被技能击中时触发 |
| onAfterHit | 被技能击中后触发 |
| onModifyXXX | 修改属性时触发 |
| onBeforeMove | 行动前触发 |
