# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

这是一个基于 Astro + React + Tailwind CSS 构建的个人博客网站，使用 Gyoza 主题。项目使用 pnpm 作为包管理器，TypeScript 作为开发语言。

## 开发命令

### 常用命令

```bash
pnpm dev              # 启动开发服务器
pnpm build            # 构建生产版本（包含类型检查和 Pagefind 索引）
pnpm preview          # 预览构建结果
pnpm lint             # 运行 Prettier 格式化代码
```

### 内容创建脚本

```bash
pnpm new-post         # 创建新博客文章（交互式）
pnpm new-project      # 创建新项目条目（交互式）
pnpm new-friend       # 添加新友链（交互式）
```

## 核心架构

### Content Collections

项目使用 Astro Content Collections 管理内容，配置位于 `src/content/config.ts`：

- **posts** (`src/content/posts/`) - 博客文章 (Markdown)
  - 支持分类、标签、置顶、草稿等功能
  - 自动计算阅读时间

- **projects** (`src/content/projects/`) - 项目展示 (YAML)

- **friends** (`src/content/friends/`) - 友情链接 (YAML)

- **spec** (`src/content/spec/`) - 特殊页面如关于、友链页等 (Markdown)

### Markdown 处理管道

配置在 `astro.config.js` 中，包含自定义插件链：

**Remark 插件**（处理 Markdown AST）：

- `remarkMath` - 数学公式支持
- `remarkDirective` - 自定义指令
- `remarkEmbed` - 嵌入内容（如视频、代码片段）
- `remarkSpoiler` - 剧透标记
- `remarkReadingTime` - 计算阅读时间并注入到数据中

**Rehype 插件**（处理 HTML AST）：

- `rehypeHeadingIds` - 标题 ID
- `rehypeKatex` - 渲染数学公式
- `rehypeLink` - 链接处理（外部链接添加属性）
- `rehypeImage` - 图片处理（懒加载、占位符）
- `rehypeHeading` - 标题锚点处理
- `rehypeCodeBlock` - 代码块包装和元数据处理
- `rehypeCodeHighlight` - 代码高亮（基于 Shiki）
- `rehypeTableBlock` - 表格包装处理

所有自定义插件位于 `src/plugins/` 目录。

### 状态管理

使用 Jotai 进行全局状态管理，store 定义在 `src/store/`：

- `theme.ts` - 主题切换（亮/暗模式）
- `metaInfo.ts` - 页面元信息
- `scrollInfo.ts` - 滚动信息
- `modalStack.ts` - 模态框栈
- `viewport.ts` - 视口信息

### React 集成

- React 组件主要用于交互功能（如模态框、主题切换、评论等）
- 使用 Framer Motion 实现动画效果
- Provider 组件位于 `src/components/provider/Provider.tsx`，通过 Swup 的 morph 功能保持状态

### 页面转换

使用 Swup 实现页面间的平滑转换：

- 容器：`main` 元素
- Morph（保持不重载）：`[component-export="Provider"]`
- 转换动画 class：`swup-transition-*`

## 配置系统

### 站点配置 (src/config.json)

集中管理站点配置，包括：

- 站点基本信息（title, description, url）
- 作者信息
- 主题颜色（支持亮/暗模式的多组强调色）
- 导航菜单
- 评论系统（Waline）配置
- 分析工具（Google Analytics, Umami, Microsoft Clarity）

修改站点配置时应编辑此文件，而不是硬编码在组件中。

### Astro 配置 (astro.config.js)

- 站点 URL：`https://zhang-stone.github.io`
- 集成：Tailwind, React, Sitemap, Swup
- Markdown 处理：禁用默认语法高亮，使用自定义插件链
- Vite 配置：外部化 Pagefind

## 构建流程

构建命令 `pnpm build` 执行以下步骤：

1. `astro check` - TypeScript 类型检查
2. `astro build` - 构建 Astro 站点到 `dist/`
3. `pagefind --site dist` - 为构建的站点生成搜索索引

## Git 工作流

项目配置了 Git Hooks（通过 simple-git-hooks）：

- **pre-commit**: 运行 lint-staged，自动格式化暂存的文件
- **commit-msg**: 运行 commitlint，确保提交信息符合约定式提交规范

## 重要约定

### 文件组织

- 组件按功能分组（如 `post/`, `header/`, `footer/`, `provider/` 等）
- 每个功能模块通常包含 `index.ts` 导出文件
- React 组件使用 `.tsx`，Astro 组件使用 `.astro`

### 样式

- 使用 Tailwind CSS 作为主要样式方案
- 全局样式位于 `src/styles/`
- Markdown 样式在 `src/styles/markdown.css`
- 代码高亮主题在 `src/styles/shiki.css`

### 路由结构

- 主页：`src/pages/[...page].astro` - 分页文章列表
- 文章页：动态路由由 Astro Content Collections 自动生成
- 归档：`src/pages/archives.astro`
- 分类：`src/pages/categories/[category].astro`
- 标签：`src/pages/tags/[tag].astro` 和 `src/pages/tags/index.astro`
