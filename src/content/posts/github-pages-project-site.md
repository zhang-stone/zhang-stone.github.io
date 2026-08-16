---
title: 给 Vite SPA 单独开一个 GitHub Pages 项目站点
pubDatetime: 2026-08-16
description: 博客已经占用 GitHub 用户站点后，把另一个 Vite 应用部署到 /仓库名/ 路径，并处理 base、前端路由和刷新 404。
tags: [GitHub Pages, Vite, 部署, 前端]
draft: false
---

## 背景

个人博客已经通过 GitHub Pages 部署在 [zhang-stone.github.io](https://zhang-stone.github.io/)，对应仓库为 `zhang-stone.github.io`。

另外还有一个独立的工具项目 [dev-toolbox](https://github.com/zhang-stone/dev-toolbox)：基于 Vite + React 开发的纯前端应用（无后端）。打包后生成静态资源，包含 Markdown 格式化与 cURL 转代码两个页面，并使用 `history.pushState` 在 `/md` 与 `/curl` 路径之间进行切换。

现在的目标是将该工具项目独立上线部署，**不与博客仓库合并，也不参与博客的构建流程**。部署后的预期访问路径如下：

- **主站博客**：`https://zhang-stone.github.io/`
- **工具站点**：`https://zhang-stone.github.io/dev-toolbox/`

<!-- more -->

### 关于 GitHub Pages 的站点类型

GitHub Pages 支持两类站点：

1. **用户 / 组织站点**（User Site）：仓库名必须固定为 `{username}.github.io`，每个账号限设 1 个（已用于主站博客）。
2. **项目站点**（Project Site）：任意仓库均可开启，每个仓库限设 1 个，默认访问路径为 `https://{username}.github.io/{仓库名}/`。

因此，主博客占用用户站点后，并不影响 `dev-toolbox` 仓库单独开启项目站点。GitHub Pages 会根据 URL 路径自动分流：以 `/dev-toolbox/` 开头的请求交由工具项目响应，其余请求继续指向博客。

---

## 实现步骤

如果在二级路径下直接部署未经配置的 Vite SPA，通常会遇到两大问题：**静态资源引用路径报错导致页面白屏**，以及**刷面刷新时因找不到文件抛出 404**。

以下是完整的配置与部署步骤：

### 步骤 1：配置 Vite 基础路径（base）

Vite 默认的打包路径 `base` 为 `/`。直接打包会导致生成的 HTML 引入根路径资源：

```html
<script src="/assets/index-xxxxx.js"></script>
```

由于项目部署在子路径 `/dev-toolbox/` 下，浏览器会向域名根节点请求该资源，导致找不到静态文件而白屏。

需要在 `vite.config.ts` 中明确指定 `base`：

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // 配置项目部署的子路径（注意前后斜杠）
  base: "/dev-toolbox/",
  server: {
    open: "/dev-toolbox/",
  },
});
```

设置后，打包出的静态资源引用路径会自动调整为 `/dev-toolbox/assets/...`。

同时，检查 `index.html` 中的静态资源引用，避免写死首斜杠：

```html
<!-- 使用 Vite 变量占位符，保持与 base 配置一致 -->
<link rel="icon" type="image/svg+xml" href="%BASE_URL%favicon.svg" />
```

---

### 步骤 2：改造前端路由，适配 BASE_URL

如果前端路由写死根路径跳转（如 `/curl`），在项目站点访问时会导致页面跳转跳出子路径（跳转至博客主站的 `/curl`）。

需要使用 Vite 提供的环境变量 `import.meta.env.BASE_URL` 动态拼接和剥离前缀：

```ts
const BASE = import.meta.env.BASE_URL;

// 移除路径中的 base 前缀，提取相对路由
function stripBase(pathname: string, base: string) {
  const basePath = base.replace(/\/+$/, "");
  if (!basePath) return pathname || "/";
  if (pathname === basePath || pathname === `${basePath}/`) return "/";
  if (pathname.startsWith(`${basePath}/`)) {
    return pathname.slice(basePath.length) || "/";
  }
  return pathname;
}

// 自动为路由加上 base 前缀
function withBase(path: string, base: string) {
  const basePath = base.replace(/\/+$/, "");
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${basePath}${normalized}`;
}
```

路由逻辑调整为：

- **路由读取**：先通过 `stripBase(window.location.pathname, BASE)` 提取出相对路径（如 `/md` 或 `/curl`），再匹配渲染组件。
- **路径跳转**：通过 `history.pushState(null, "", withBase("/curl", BASE))` 写入完整路径 `/dev-toolbox/curl`。

---

### 步骤 3：处理 SPA 页面刷新 404 与路由回退

GitHub Pages 本质是静态文件服务器，不支持重定向回退到 `index.html`（HTML5 History 模式常见的服务端 Rewrite 机制）。直接刷新 `https://zhang-stone.github.io/dev-toolbox/curl` 时，服务器因找不到 `/curl` 目录或文件会返回 404。

为解决此问题，可以在构建完成后复制多份 `index.html` 到对应的路由目录，并将 `404.html` 也指向 `index.html`：

在 `package.json` 中配置 `postbuild` 钩子：

```json
{
  "scripts": {
    "build": "tsc -b && vite build",
    "postbuild": "cp dist/index.html dist/404.html && mkdir -p dist/md dist/curl && cp dist/index.html dist/md/index.html && cp dist/index.html dist/curl/index.html"
  }
}
```

构建生成的目录结构如下：

```text
dist/
├── index.html        # 首页入口
├── 404.html          # 未匹配路径回退入口
├── md/
│   └── index.html    # /dev-toolbox/md 路径刷新入口
├── curl/
│   └── index.html    # /dev-toolbox/curl 路径刷新入口
├── assets/           # 静态资源文件
└── favicon.svg
```

由于 JS/CSS 资源均已采用绝对路径 `/dev-toolbox/assets/...` 加载，无论访问哪个层级的 `index.html`，都能正确加载应用并由前端路由响应。

---

### 步骤 4：配置 GitHub Actions 部署工作流

在项目 `.github/workflows/deploy.yml` 中建立自动化构建与部署工作流：

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: |
          npm ci
          npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

---

### 步骤 5：开启仓库 Pages 功能并完成部署

代码推送至 `main` 分支后，如果仓库尚未开启 GitHub Pages 的 Actions 部署源，Actions 的 Deploy 步骤会提示如下错误：

```text
Failed to create deployment (status: 404)
Ensure GitHub Pages has been enabled
```

解决方法：进入仓库 **Settings** → **Pages** → **Build and deployment**，将 **Source** 切换为 **GitHub Actions**（或通过 GitHub CLI 执行命令）：

```bash
gh api --method POST repos/<owner>/<repo>/pages -f build_type=workflow
```

配置完成后，重新运行失败的工作流即可完成部署。

---

## 验证结果

部署完成后，即可通过子路径正常访问工具应用：

- **工具主页**：[https://zhang-stone.github.io/dev-toolbox/](https://zhang-stone.github.io/dev-toolbox/)
- **Markdown 页面**：[https://zhang-stone.github.io/dev-toolbox/md](https://zhang-stone.github.io/dev-toolbox/md)
- **cURL 页面**：[https://zhang-stone.github.io/dev-toolbox/curl](https://zhang-stone.github.io/dev-toolbox/curl)

本地开发时，也可通过 `npm run build && npm run preview` 进行构建预览，确认静态资源路径与刷新路由均工作正常。
