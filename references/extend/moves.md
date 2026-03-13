# 添加新技能

## 使用 @pkmn/mods

```typescript
import { Dex, ID, ModData } from '@pkmn/dex';

const customDex = Dex.mod('custom' as ID, {
  Moves: {
    'MyMove': {
      num: 10000,
      name: 'My Move',
      type: 'Fire',              // 技能属性
      category: 'Special',       // 物理/特殊/变化
      basePower: 120,            // 威力
      accuracy: 85,              // 命中率
      pp: 5,                    // PP
      maxPp: 8,                 // 最大 PP
      priority: 0,               // 优先级
      target: 'normal',          // 目标
      desc: 'A powerful custom move.',      // 描述
      shortDesc: 'High damage.', // 简短描述
      secondary: {
        chance: 30,
        status: 'brn'
      }
    }
  }
} as ModData);
```

## 技能数据结构

```typescript
interface MoveData {
  num: number;              // 唯一编号
  name: string;             // 名称
  type: string;             // 属性
  category: 'Physical' | 'Special' | 'Status';  // 分类
  basePower?: number;       // 威力
  accuracy?: number;        // 命中率
  pp?: number;             // PP
  maxPp?: number;          // 最大 PP
  priority?: number;        // 优先级
  target?: string;          // 目标
  desc?: string;           // 描述
  shortDesc?: string;       // 简短描述
  isZ?: boolean;           // Z技能
  isMax?: boolean;         // 极巨化
  no_ppBoosts?: boolean;   // 不受 PP 影响
  noSketch?: boolean;      // 不可画画
  recoil?: number[];       // 反弹伤害 [min, max]
  drain?: number[];        // 吸血 [attacker, defender]
  status?: string;         // 附加状态
  secondary?: {
    chance?: number;
    status?: string;
    volatileStatus?: string;
  };
}
```

## 技能类型示例

### 物理技能

```typescript
PhysicalAttack: {
  num: 10001,
  name: 'Flame Strike',
  type: 'Fire',
  category: 'Physical',
  basePower: 100,
  accuracy: 100,
  pp: 10,
  target: 'normal',
  desc: 'A fiery physical attack.',
  shortDesc: 'Strong fire attack.'
}
```

### 特殊技能

```typescript
SpecialAttack: {
  num: 10002,
  name: 'Inferno Blast',
  type: 'Fire',
  category: 'Special',
  basePower: 130,
  accuracy: 85,
  pp: 5,
  target: 'normal',
  desc: 'A powerful special fire attack that may burn.',
  shortDesc: 'High damage, may burn.',
  secondary: {
    chance: 30,
    status: 'brn'
  }
}
```

### 变化技能

```typescript
StatusMove: {
  num: 10003,
  name: 'Flame Wall',
  type: 'Fire',
  category: 'Status',
  pp: 20,
  target: 'allySide',
  desc: 'Creates a protective fire wall.',
  shortDesc: 'Sets up fire wall.',
  sideCondition: 'firewall'
}
```

### 优先技能

```typescript
PriorityMove: {
  num: 10004,
  name: 'Quick Strike',
  type: 'Normal',
  category: 'Physical',
  basePower: 40,
  accuracy: 100,
  pp: 30,
  priority: 1,
  target: 'normal',
  desc: 'A quick attack that strikes first.',
  shortDesc: 'High priority.'
}
```

### 变化天气技能

```typescript
WeatherMove: {
  num: 10005,
  name: 'Sunny Day',
  type: 'Fire',
  category: 'Status',
  pp: 5,
  target: 'entireField',
  desc: 'Summons intense sunlight.',
  shortDesc: 'Summons sun.',
  weather: 'sunnyday'
}
```

## 技能效果

### 附加异常状态

```typescript
BurnMove: {
  type: 'Fire',
  category: 'Physical',
  basePower: 70,
  secondary: {
    chance: 30,
    status: 'brn'  // 烧伤
  }
}
```

### 附加能力变化

```typescript
StatMove: {
  type: 'Normal',
  category: 'Status',
  boosts: {
    atk: 2
  }
}
```

### 吸血/反弹

```typescript
DrainMove: {
  type: 'Dark',
  category: 'Physical',
  basePower: 80,
  drain: [1, 2]  // 造成伤害的 50% 恢复自身
}

RecoilMove: {
  type: 'Fire',
  category: 'Special',
  basePower: 140,
  recoil: [1, 4]  // 伤害的 25% 作为反弹
}
```
