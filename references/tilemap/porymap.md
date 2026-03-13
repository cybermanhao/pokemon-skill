# Porymap - 地图编辑器

## 概述

Porymap 是专门为 Pokemon Gen 3 反汇编项目 (pokeemerald, pokefirered, pokeruby) 设计的可视化地图编辑器。

**GitHub**: https://github.com/huderlem/porymap

## 安装

### Windows/Mac

从 releases 页面下载预编译版本：
https://github.com/huderlem/porymap/releases

### Linux (源码编译)

```bash
# 安装 Qt
sudo apt install qt5-default

# 克隆并编译
git clone https://github.com/huderlem/porymap.git
cd porymap
qmake porymap.pro
make
```

## 功能

### 地图编辑

- 可视化编辑地图块
- 放置事件 (NPC、触发器、脚本)
- 编辑地图连接
- 设置地图属性

### Tileset 编辑

- 创建和修改 tileset
- 编辑图块属性 (可行走、可用、可滑行)
- 碰撞检测设置

### 事件管理

- NPC 事件
- 脚本触发器
- 隐藏道具
- 训练师
- 出口/入口

## 支持的项目

- pokeemerald
- pokefirered
- pokeruby

## 使用流程

### 1. 打开项目

```bash
./porymap /path/to/pokeemerald
```

### 2. 编辑地图

1. 选择地图文件
2. 使用工具栏编辑
3. 保存更改

### 3. 编辑 Tileset

1. 打开 tileset 编辑器
2. 导入新图块
3. 设置属性

## 数据结构

### 地图文件 (.json)

```json
{
  "id": 1,
  "name": "PALLET_TOWN",
  "layout_id": 1,
  "region_section": 0,
  "events": [],
  "connections": []
}
```

### Tileset 结构

```
tileset/
  1. 16x16 图块数组
  2. 碰撞属性
  3. 行为属性
```

## 与游戏数据集成

Porymap 编辑的数据会保存到反汇编项目的 maps/ 和 graphics/ 目录。

## 扩展阅读

- GitHub: https://github.com/huderlem/porymap
- 文档: https://github.com/huderlem/porymap#readme
- 地图脚本: https://github.com/huderlem/porymap#scripting
