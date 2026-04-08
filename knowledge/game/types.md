# 属性克制查询

## 查询单个属性的克制关系

```
GET https://pokeapi.co/api/v2/type/{name}
```

名称用英文小写：`fire`, `water`, `steel`, `psychic` 等。

响应中关键字段 `damage_relations`：

```json
{
  "damage_relations": {
    "double_damage_from": [...],   // 受到 ×2 伤害的攻击属性
    "half_damage_from": [...],     // 受到 ×0.5 伤害的攻击属性
    "no_damage_from": [...]        // 完全免疫的攻击属性
  }
}
```

## 计算双属性精灵的实际弱点

**不要直接查单个属性然后相加** — 需要对两个属性的 `damage_relations` 做乘积运算：

1. 查 `/type/{type1}` 和 `/type/{type2}`
2. 对每种攻击属性，将两个类型的倍率相乘：
   - double_damage_from → ×2
   - half_damage_from → ×0.5
   - no_damage_from → ×0
3. 最终倍率 = type1倍率 × type2倍率

示例（钢/超能力）：
- 地面攻击：钢 ×2 × 超能力 ×1 = **×2**（但见下方特性修正）

## 特性可以覆盖属性克制 — 必须检查

部分特性会改变属性有效性，纯属性计算结果可能是错的。查询精灵后，对每个特性调用：

```
GET https://pokeapi.co/api/v2/ability/{name}
```

检查 `effect_entries` 中是否包含免疫/修改伤害的描述（如 "immune to Ground", "negates damage from Fire"）。

**常见改变属性有效性的特性类型**（不要依赖枚举，直接查特性描述）：
- 免疫某属性（如浮空/Levitate）
- 吸收某属性回血
- 将某属性伤害减半

## 完整查询流程（以"X精灵有哪些弱点"为例）

1. `GET /pokemon/{name}` → 获取 `types[]` 和 `abilities[]`
2. 对每个 type，`GET /type/{type_name}` → 获取 `damage_relations`
3. 计算属性乘积得到基础弱点表
4. 对每个 ability，`GET /ability/{ability_name}` → 检查是否修改属性有效性
5. 用特性结果修正第3步的弱点表
