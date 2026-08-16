# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with this repository.

## 项目概述

这是一个基于 Astro + Tailwind CSS 的个人博客，使用 [AstroPaper](https://github.com/satnaing/astro-paper) v6 主题。包管理器为 pnpm，开发语言为 TypeScript。

## 开发命令

```bash
pnpm dev        # 启动开发服务器
pnpm build      # 类型检查、构建，并生成 Pagefind 搜索索引
pnpm preview    # 预览构建结果
pnpm format     # Prettier 格式化
pnpm lint       # ESLint
```

要求 Node.js >= 22.12.0。

## 核心架构

### 配置

站点配置集中在 `astro-paper.config.ts`（站点信息、分页、社交链接、搜索、编辑链接等）。运行时默认值在 `src/config.ts` 中合并。修改站点信息应编辑 `astro-paper.config.ts`，不要硬编码。

Astro 配置在 `astro.config.ts`：站点 URL 来自上述配置；集成 MDX、Sitemap；Markdown 使用 rehype-callouts 与 Shiki 双主题。

### Content Collections

配置位于 `src/content.config.ts`：

- **posts** (`src/content/posts/`) - 博客文章（Markdown / MDX）
  - 必填：`title`、`description`、`pubDatetime`
  - 可选：`tags`、`draft`、`featured`、`modDatetime`、`ogImage` 等
  - 子目录名会进入文章 URL；`_` 前缀目录不进入 URL
- **pages** (`src/content/pages/`) - 静态页如 About

### 路由

- `/` 首页
- `/posts`、`/posts/[slug]` 文章列表与详情
- `/tags`、`/tags/[tag]` 标签
- `/archives` 归档
- `/about` 关于
- `/search` Pagefind 搜索
- `/rss.xml` RSS

### 评论与分析

- Waline：`src/components/Waline.astro`，挂在文章页分享区下方
- Google Analytics：`src/layouts/Layout.astro` 中注入 gtag

### 构建流程

`pnpm build` 执行：

1. `astro check` - TypeScript 类型检查
2. `astro build` - 构建到 `dist/`
3. `pagefind --site dist` - 生成搜索索引
4. 将索引复制到 `public/pagefind/`

部署：GitHub Pages，工作流 `.github/workflows/deploy.yml`（`withastro/action`，Node 22）。
