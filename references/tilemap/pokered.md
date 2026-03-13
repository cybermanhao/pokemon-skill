# pret/pokered - 地图数据

## 概述

pret/pokered 是 Pokemon 红蓝版的反汇编项目，包含完整的游戏地图数据。

**GitHub**: https://github.com/pret/pokered

## 地图数据内容

### 城市

| 城市 | 文件 |
|------|------|
| Pallet Town | PalletTown.blk |
| Viridian City | ViridianCity.blk |
| Pewter City | PewterCity.blk |
| Cerulean City | CeruleanCity.blk |
| Lavender Town | LavenderTown.blk |
| Vermilion City | VermilionCity.blk |
| Celadon City | CeladonCity.blk |
| Fuchsia City | FuchsiaCity.blk |
| Saffron City | SaffronCity.blk |
| Cinnabar Island | CinnabarIsland.blk |

### 路线

- Route 1-25: 完整的路线数据
- 包含道路、入口、连接点

### 建筑

- Pokemon Center (所有城市)
- Pokemon Mart (所有城市)
- Gyms (8个道馆)
- Silph Co. (11层)
- Pokemon Tower
- Game Corner

### 洞穴

- Mt. Moon (3层)
- Diglett's Cave
- Rock Tunnel (2层)
- Victory Road (3层)
- Seafoam Islands (5层)
- Cerulean Cave (3层)
- Rocket Hideout (4层)

## 数据格式

### .blk 文件格式

`.blk` 文件是原始的 tilemap 数据，使用块索引格式：

```
每个字节 = 块索引
块大小 = 16x16 像素
```

### 解析示例

```typescript
// 读取 .blk 文件
const fs = require('fs');
const data = fs.readFileSync('CeladonCity.blk');

// 转换为 2D 数组
const width = 20;
const height = 20;
const map = [];
for (let y = 0; y < height; y++) {
  map[y] = [];
  for (let x = 0; x < width; x++) {
    map[y][x] = data[y * width + x];
  }
}
```

## 使用建议

### 转换为现代格式

1. 解析 .blk 文件
2. 映射到 tileset
3. 导出为 JSON/PNG

### 工具

- **Tilemap Studio**: 用于编辑 Game Boy tilemap
- **GBDK**: Game Boy 开发工具

## 扩展阅读

- GitHub: https://github.com/pret/pokered
- 地图目录: https://github.com/pret/pokered/tree/master/maps
