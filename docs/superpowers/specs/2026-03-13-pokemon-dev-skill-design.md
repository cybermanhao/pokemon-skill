# Pokemon 开发辅助 Skill - 设计文档

## 1. 项目概述

### 项目名称
**pokemon-dev** - 宝可梦游戏开发辅助 Skill

### 核心功能
- 战斗模拟 API 使用文档 (@pkmn/sim, @smogon/calc)
- 数据源使用文档 (PokéAPI, @pkmn/dex)
- 队伍处理文档 (@pkmn/sets, @pkmn/randoms)
- 扩展接口文档 (自定义精灵、技能、特性、道具、属性、天气、状态等)
- 地图数据使用文档 (tilemap)

### 目标用户
- 开发宝可梦相关游戏的 AI 开发者
- 需要使用开源数据源和 API 的项目

---

## 2. 技术架构

### Skill 结构
```
pokemon-dev/
├── SKILL.md                    # 主入口：总览 + 索引
└── references/
    ├── battle/
    │   ├── pkmn-sim.md         # @pkmn/sim 战斗模拟
    │   ├── pkmn-dex.md         # @pkmn/dex 数据层
    │   ├── pkmn-sets.md        # @pkmn/sets 队伍解析
    │   ├── pkmn-randoms.md    # @pkmn/randoms 随机队伍
    │   ├── pkmn-mods.md        # @pkmn/mods 自定义扩展
    │   └── smogon-calc.md      # @smogon/calc 伤害计算
    ├── api/
    │   ├── pokeapi-rest.md     # PokéAPI REST API
    │   └── pokeapi-graphql.md # PokéAPI GraphQL
    ├── extend/
    │   ├── pokemon.md          # 添加新精灵
    │   ├── moves.md            # 添加新技能
    │   ├── abilities.md        # 添加新特性
    │   ├── items.md            # 添加新道具
    │   ├── types.md            # 添加新属性
    │   ├── weather.md          # 添加新天气/地形
    │   └── conditions.md       # 添加新状态/效果
    └── tilemap/
        ├── pokered.md          # pret/pokered 地图数据
        └── porymap.md          # Porymap 地图编辑器
```

### 文档内容标准
每个 reference 文档包含：
- **安装**: npm install 命令和依赖
- **基础用法**: 核心 API 调用示例
- **数据类型**: 返回的数据结构说明
- **扩展方法**: 如何添加自定义数据
- **示例**: 完整可运行的代码示例

---

## 3. 功能模块

### 3.1 战斗模拟 (battle/)

#### @pkmn/sim
- 创建对战场地和流
- 处理战斗流程和回合
- 获取战斗结果和日志

#### @pkmn/dex
- 查询精灵/技能/特性/道具数据
- 属性克制计算
- 数据迭代和检索

#### @pkmn/sets
- 解析队伍字符串
- 导出队伍格式
- 队伍打包/解包

#### @pkmn/randoms
- 随机队伍生成
- 支持多种对战模式

#### @pkmn/mods
- 添加自定义精灵
- 添加自定义技能
- 添加自定义特性
- 修改现有数据

#### @smogon/calc
- 精确伤害计算
- 伤害区间输出
- 多世代支持

### 3.2 数据 API (api/)

#### PokéAPI REST
- 48个端点概览
- 分页和过滤
- 缓存策略

#### PokéAPI GraphQL
- GraphQL 端点
- 查询示例
- 数据关系

### 3.3 扩展接口 (extend/)

#### 添加新精灵
- 数据结构定义
- 基础属性设置
- 进化链配置

#### 添加新技能
- 技能效果定义
- 威力/命中/PP
- 特殊效果

#### 添加新特性
- 特性效果实现
- 触发条件

#### 添加新道具
- 道具效果
- 携带限制

#### 添加新属性
- 自定义属性类型
- 属性克制关系

#### 添加新天气/地形
- 天气效果实现
- 地形效果实现

#### 添加新状态/效果
- 异常状态 (中毒、烧伤等)
- 场地效果 (陷阱、障碍物)

### 3.4 地图数据 (tilemap/)

#### pret/pokered
- 地图区块数据 (.blk)
- 城市/路线/建筑地图
- 数据格式解析

#### Porymap
- 地图编辑器使用
- tileset 编辑
- 事件管理

---

## 4. 库之间的协作

- @pkmn/dex 提供数据给 @pkmn/sim
- @pkmn/sets 依赖 @pkmn/dex 进行名称转换
- @pkmn/randoms 使用 @pkmn/sim 生成队伍
- @pkmn/mods 可修改 @pkmn/dex 中的任意数据

### 世代处理

- 支持 Gen 1-9 各世代数据
- 世代通过 ID 区分 (gen1, gen2, ... gen9)

---

## 5. 验证清单

- [ ] SKILL.md 主文件结构完整，包含导航提示
- [ ] 每个 reference 文档包含安装、用法、数据类型、扩展方法、示例
- [ ] 代码示例可直接运行
- [ ] 扩展接口文档完整覆盖精灵、技能、特性、道具、属性、天气、状态
- [ ] 包含 tilemap/ 地图数据文档
- [ ] 包含世代处理指导
- [ ] 包含库之间的协作说明
