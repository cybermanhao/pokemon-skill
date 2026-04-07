# 伤害计算公式 - 参考 Pokemon Showdown

## 完整伤害公式

### Gen 6+ 标准伤害公式

```
伤害 = {
  ([(等级 × 2 / 5 + 2) × 威力 × A / 50] / D + 2) × STAB × 克制 × 道具 × 特性 × 伤害博享 × 混乱 × 其他
} × 随机数(0.85 ~ 1.0)
```

其中：
- `A` = 攻击方攻击力 (或特攻)
- `D` = 防御方防御力 (或特防)
- `STAB` = 同属性加成 (1.0 或 1.5)
- `克制` = 属性克制倍率 (0, 0.25, 0.5, 1, 2, 4)

### 代码实现

```typescript
function calculateDamage(
  level: number,
  basePower: number,
  attack: number,
  defense: number,
  modifiers: DamageModifiers
): number {
  // 基础伤害计算
  let damage = Math.floor(
    Math.floor(Math.floor(2 * level / 5 + 2) * basePower * attack / 50) / defense
  );
  
  // 加上 2
  damage = damage + 2;
  
  // 应用 STAB
  if (modifiers.stab === 1.5) {
    damage = Math.floor(damage * 1.5);
  }
  
  // 应用属性克制
  damage = Math.floor(damage * modifiers.typeEffectiveness);
  
  // 应用其他修正
  damage = Math.floor(damage * modifiers.items);
  damage = Math.floor(damage * modifiers.abilities);
  damage = Math.floor(damage * modifiers.other);
  
  // 随机数
  damage = Math.floor(damage * (100 - Math.floor(Math.random() * 16)) / 100);
  
  return Math.max(1, damage);
}
```

## 各世代差异

### Gen 1 伤害公式

```
伤害 = [(等级 × 2 / 5 + 威力 × A / 50) + 2] × STAB × 克制 × 随机数(217 ~ 255 / 255)
```

**关键差异**:
- 伤害计算过程不同 (无分步取整)
- 随机数范围 217-255/255
- HP计算使用 trunc

### Gen 2-5 伤害公式

```
伤害 = ([(等级 × 2 / 5 + 2) × 威力 × A / 50] / D + 2) × STAB × 克制 × 随机数(85 ~ 100 / 100)
```

### Gen 6+ 伤害公式

```
伤害 = ([(等级 × 2 / 5 + 2) × 威力 × A / 50] / D + 2) × STAB × 克制 × 道具 × 特性 × 伤害博享 × 混乱 × 其他 × 随机数
```

## 属性克制表

```typescript
const typeChart: Record<string, Record<string, number>> = {
  // 攻击方 -> 防御方 -> 倍率
  Normal: { Rock: 0.5, Steel: 0.5, Ghost: 0, Immune: 0 },
  Fire: { Fire: 0.5, Water: 0.5, Grass: 2, Ice: 2, Bug: 2, Rock: 0.5, Dragon: 0.5, Steel: 2 },
  Water: { Fire: 2, Water: 0.5, Grass: 0.5, Ground: 2, Rock: 2, Dragon: 0.5 },
  Electric: { Water: 2, Electric: 0.5, Grass: 0.5, Ground: 0, Flying: 2, Dragon: 0.5 },
  Grass: { Fire: 0.5, Water: 2, Grass: 0.5, Poison: 0.5, Ground: 2, Flying: 0.5, Bug: 0.5, Rock: 2, Dragon: 0.5, Steel: 0.5 },
  Ice: { Fire: 0.5, Water: 0.5, Grass: 2, Ice: 0.5, Ground: 2, Flying: 2, Dragon: 2, Steel: 0.5 },
  Fighting: { Normal: 2, Ice: 2, Poison: 0.5, Flying: 0.5, Psychic: 0.5, Bug: 0.5, Rock: 2, Ghost: 0, Dark: 2, Steel: 2 },
  Poison: { Grass: 2, Poison: 0.5, Ground: 0.5, Rock: 0.5, Ghost: 0, Steel: 0, Fairy: 0.5 },
  Ground: { Fire: 2, Electric: 2, Grass: 0.5, Poison: 2, Flying: 0, Bug: 0.5, Rock: 2, Steel: 2 },
  Flying: { Electric: 0.5, Grass: 2, Fighting: 2, Bug: 2, Rock: 0.5, Steel: 0.5 },
  Psychic: { Fighting: 2, Poison: 2, Psychic: 0.5, Dark: 0, Steel: 0.5 },
  Bug: { Fire: 0.5, Grass: 2, Fighting: 0.5, Poison: 0.5, Flying: 0.5, Psychic: 2, Ghost: 0.5, Dark: 2, Steel: 0.5, Fairy: 0.5 },
  Rock: { Fire: 2, Ice: 2, Fighting: 0.5, Ground: 0.5, Flying: 2, Bug: 2, Steel: 0.5 },
  Ghost: { Normal: 0, Psychic: 2, Ghost: 2, Dark: 0.5 },
  Dragon: { Dragon: 2, Steel: 0.5, Fairy: 0 },
  Dark: { Fighting: 0.5, Psychic: 2, Ghost: 2, Dark: 0.5, Fairy: 0.5 },
  Steel: { Fire: 0.5, Water: 0.5, Electric: 0.5, Ice: 2, Rock: 2, Steel: 0.5, Fairy: 2 },
  Fairy: { Fire: 0.5, Fighting: 2, Poison: 0.5, Dragon: 2, Dark: 2, Steel: 0.5 }
};
```

## 能力值计算

### 能力值公式

```typescript
// HP 能力值
function calculateHP(level: number, base: number, iv: number, ev: number): number {
  return Math.floor(((2 * base + iv + Math.floor(ev / 4)) * level) / 100) + level + 10;
}

// 其他能力值
function calculateStat(level: number, base: number, iv: number, ev: number, nature: number): number {
  return Math.floor(((2 * base + iv + Math.floor(ev / 4)) * level) / 100) + 5) * nature;
}

// 性格修正
const natureTable: Record<string, [string, string]> = {
  Hardy: ['', ''],
  Lonely: ['atk', 'def'],
  Adamant: ['atk', 'spa'],
  Naughty: ['atk', 'spd'],
  Brave: ['atk', 'spe'],
  Bold: ['def', 'atk'],
  Docile: ['', ''],
  Impish: ['def', 'spa'],
  Lax: ['def', 'spd'],
  Relaxed: ['def', 'spe'],
  Modest: ['spa', 'atk'],
  Mild: ['spa', 'def'],
  Quiet: ['spa', 'spe'],
  Bashful: ['spa', 'spd'],
  Rash: ['spa', 'def'],
  Calm: ['spd', 'atk'],
  Gentle: ['spd', 'def'],
  Sassy: ['spd', 'spa'],
  Careful: ['spd', 'spa'],
  Quirky: ['spd', 'atk'],
  Timid: ['spe', 'atk'],
  Hasty: ['spe', 'def'],
  Jolly: ['spe', 'spa'],
  Naive: ['spe', 'spd'],
  Serious: ['spe', 'spa']
};
```

### 50级/100级能力值计算示例

```typescript
// 100级 Charizard 特攻
// base: 109, IV: 31, EV: 0, Nature: 1.1
const spa = Math.floor(((2 * 109 + 31 + 0) * 100 / 100) + 5) * 1.1;
// = Math.floor((218 + 31) * 100 / 100 + 5) * 1.1
// = Math.floor(249 * 100 / 100 + 5) * 1.1
// = Math.floor(249 + 5) * 1.1
// = Math.floor(254 * 1.1)
// = 279

// 50级 0 EV 31 IV
const spa50 = Math.floor(((2 * 109 + 31 + 0) * 50 / 100) + 5) * 1.1;
// = Math.floor(249 * 50 / 100 + 5) * 1.1
// = Math.floor(124.5 + 5) * 1.1
// = Math.floor(129.5 * 1.1)
// = 142
```

## STAB (Same Type Attack Bonus)

```typescript
function getSTAB(moveType: string, pokemonTypes: string[]): number {
  if (pokemonTypes.includes(moveType)) {
    return 1.5; // 同属性技能威力 × 1.5
  }
  return 1.0;
}

// 适应力特性 (Adaptability)
if (pokemon.hasAbility('adaptability') && isSTAB) {
  stab = 2.0; // 而非 1.5
}
```

## 暴击判定

### 暴击等级

```typescript
const critStages = {
  nozerospeed: -1,    // 谜之拟鸟
  fullhub: -1,         // 谜之水鸭
  quickclaw: 1,        // 顺发之爪
  lens: 1,             // 聚焦镜
  scope: 2,            // 目标镜
  razorclaw: 2,        // 锐利之爪
  starapt: 2,          // 星之愿/星星
  normal: 0            // 默认
};

function rollCriticalHit(critStage: number, gen: number): boolean {
  const critMultiplier = gen >= 6 ? 1.5 : 1;
  const critChance = Math.floor((critStage + 2) * critMultiplier) / 16;
  return Math.random() < critChance;
}

// Gen 6+: 暴击时伤害 × 1.5
// Gen 2-5: 暴击时伤害 × 2
```

### 暴击伤害加成

```typescript
if (isCriticalHit) {
  // Gen 6+: 伤害 × 1.5
  damage = Math.floor(damage * 1.5);
  
  // Gen 2-5: 伤害 × 2
  damage = Math.floor(damage * 2);
}
```

## 伤害修正 (Damage Modifiers)

### 道具修正

```typescript
const itemModifiers = {
  'Life Orb': 1.3,
  'Expert Belt': 1.2,
  'Metronome': 1.0, // 连续使用同一技能时增加
  'Choice Band': 1.5,
  'Choice Specs': 1.5,
  'Choice Scarf': 1.5,
  'Weakness Policy': 1.2, // 被克制属性击中时
  'Assault Vest': 1.5,
};
```

### 特性修正

```typescript
const abilityModifiers = {
  'Reckless': 1.2,      // 搏命/起死回生
  'Iron Fist': 1.2,     // 铁拳 (拳击类技能)
  'Blaze': 1.5,         // 猛火
  'Torrent': 1.5,       // 激流
  'Overgrow': 1.5,      // 茂盛
  'Swarm': 1.5,         // 虫之预感
  'Protean': 1.5,       // 变幻自如
  'Libero': 1.5,        // 自由者
  'Technician': 1.5,    // 技术高手 (威力 ≤ 60)
  'Sheer Force': 1.3,  // 强行 (无附加效果)
  'Strong Jaw': 1.5,   // 强壮颚 (咬类技能)
  'Mega Launcher': 1.5, // 超级发射器 (波动类)
  'Tough Claws': 1.3,  // 硬爪 (接触类)
};
```

## 伤害区间 (Damage Rolls)

```typescript
function getDamageRange(
  level: number,
  basePower: number,
  attack: number,
  defense: number,
  modifiers: DamageModifiers
): [number, number] {
  // 随机数范围 85-100
  const minDamage = calculateDamage(level, basePower, attack, defense, {
    ...modifiers,
    random: 0.85
  });
  
  const maxDamage = calculateDamage(level, basePower, attack, defense, {
    ...modifiers,
    random: 1.0
  });
  
  return [minDamage, maxDamage];
}

// 示例: 0 Atk Charizard Flamethrower vs. 252 HP Blastoise
// 结果: 90-107 (26.3 - 31.3%) -- guaranteed 4HKO after Leftovers recovery
```

## 关键判定函数

### 命中率判定

```typescript
function calculateAccuracy(
  accuracy: number,
  stages: number,
  ability: string,
  item: string
): number {
  let hitChance = accuracy;
  
  // 能力阶级
  if (stages !== 0) {
    const multiplier = stages > 0
      ? (stages + 3) / 3
      : 3 / (3 - stages);
    hitChance = Math.floor(hitChance * multiplier);
  }
  
  // 特性修正
  if (ability === 'Compound Eyes') {
    hitChance = Math.floor(hitChance * 1.3);
  }
  if (ability === 'Hustle') {
    hitChance = Math.floor(hitChance * 0.8);
  }
  
  // 道具修正
  if (item === 'Wide Lens') {
    hitChance = Math.floor(hitChance * 1.1);
  }
  
  return Math.min(hitChance, 100);
}

// 最终命中判定
function rollHit(moveAccuracy: number, attacker: Pokemon, defender: Pokemon): boolean {
  const accuracy = calculateAccuracy(
    moveAccuracy,
    attacker.boosts.accuracy - defender.boosts.evasion,
    attacker.ability,
    attacker.item
  );
  
  return Math.random() * 100 < accuracy;
}
```

## @smogon/calc 完整示例

```typescript
import { calculate, Generations, Pokemon, Move, Field } from '@smogon/calc';

const gen = Generations.get(8);

// 攻击方
const attacker = new Pokemon(gen, 'Charizard', {
  item: 'Life Orb',
  nature: 'Timid',
  evs: { spa: 252, spe: 252, hp: 6 },
  ivs: { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 },
  level: 100,
  ability: 'Blaze'
});

// 防御方
const defender = new Pokemon(gen, 'Blastoise', {
  item: 'Leftovers',
  nature: 'Bold',
  evs: { hp: 252, def: 252, spa: 0 },
  ivs: { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 },
  level: 100
});

// 技能
const move = new Move(gen, 'Flamethrower');

// 场地
const field = new Field({
  gameType: 'singles',
  weather: 'Sun',
  terrain: ''
});

// 计算
const result = calculate(gen, attacker, defender, move, field);

console.log(result.desc());
// "0 SpA Charizard Life Orb Blaze Flamethrower vs. 252 HP / 252+ Def Blastoise: 
//  117-138 (28.7 - 33.8%) -- 10.9% chance to 3HKO after Stealth Rock"

console.log(result.getDamageRange());
// [117, 138]

console.log(result.getKOChance());
// { '0': 0, '25': 0, '50': 0, '75': 0, '100': 0.109 }
```

## 扩展阅读

- @smogon/calc 源码: https://github.com/smogon/damage-calc
- Pokemon Showdown 伤害计算: https://github.com/smogon/pokemon-showdown/blob/master/sim/battle.js
- 各世代伤害公式: https://pokemon.fandom.com/wiki/Damage
