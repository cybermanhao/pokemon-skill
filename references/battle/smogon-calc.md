# @smogon/calc - 伤害计算

## 安装

```bash
npm install @smogon/calc
```

## 概述

@smogon/calc 是 Pokemon Showdown 官方伤害计算器，支持所有世代的精确伤害计算。

## 基础用法

### 简单伤害计算

```typescript
import { calculate, Generations, Pokemon, Move } from '@smogon/calc';

const gen = 8;

// 创建攻击方
const attacker = new Pokemon(gen, 'Charizard', {
  item: 'Choice Specs',
  nature: 'Timid',
  evs: { spa: 252 }
});

// 创建防御方
const defender = new Pokemon(gen, 'Blastoise', {
  item: 'Leftovers',
  nature: 'Calm',
  evs: { hp: 252, spd: 252 }
});

// 创建技能
const move = new Move(gen, 'Flamethrower');

// 计算伤害
const result = calculate(gen, attacker, defender, move);

console.log(result.getDamage());        // 伤害数值
console.log(result.getDamageRange());   // 伤害区间 [min, max]
console.log(result.description());      // 伤害描述
```

### 完整参数示例

```typescript
const attacker = new Pokemon(gen, 'Charizard', {
  species: 'Charizard',
  item: 'Choice Specs',
  ability: 'Blaze',
  nature: 'Timid',
  evs: { hp: 0, atk: 0, def: 0, spa: 252, spd: 0, spe: 252 },
  ivs: { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 },
  level: 50,
  isDynamaxed: false,
  genders: 'M'
});

const defender = new Pokemon(gen, 'Blastoise', {
  species: 'Blastoise',
  item: 'Leftovers',
  ability: 'Torrent',
  nature: 'Calm',
  evs: { hp: 252, atk: 0, def: 0, spa: 0, spd: 252, spe: 0 },
  level: 50
});

// 创建带场地效果的技能
const move = new Move(gen, 'Flamethrower', {
  useTargetOffensive: false,
  isZ: false,
  isMax: false
});
```

### 场地效果

```typescript
import { Field } from '@smogon/calc';

const field = new Field({
  gameType: 'singles',
  terrain: 'Electric Terrain',
  weather: 'Sun',
  isMagicRoom: false,
  isWonderRoom: false
});

const result = calculate(gen, attacker, defender, move, field);
```

## 世代支持

```typescript
// Gen 1-9 都支持
const gen1Calc = calculate(1, p1, p2, move);
const gen9Calc = calculate(9, p1, p2, move);
```

## 伤害结果

```typescript
const result = calculate(gen, attacker, defender, move);

// 获取单次伤害
const damage = result.getDamage();

// 获取伤害区间
const [min, max] = result.getDamageRange();

// 获取暴击区间
const [critMin, critMax] = result.getCritDamage();

// 获取击杀概率
const koChance = result.getKOChance();

// 描述信息
console.log(result.desc());
// "0 Atk Charizard Choice Specs Flamethrower vs. 252 HP / 252+ SpD Blastoise: 90-107 (26.3 - 31.3%) -- guaranteed 4HKO after Leftovers recovery"
```

## 输出类型

| 方法 | 描述 |
|------|------|
| getDamage() | 单次伤害数值 |
| getDamageRange() | 伤害最小/最大值 |
| getCritDamage() | 暴击伤害区间 |
| getKOChance() | 击杀概率 |
| desc() | 人类可读的伤害描述 |

## 扩展阅读

- GitHub: https://github.com/smogon/damage-calc
- 在线演示: https://calc.pokemonshowdown.com
