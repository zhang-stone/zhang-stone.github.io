# Stone Zhang's Blog

这是使用 Astro 和 React 构建的个人博客网站。

![astro version](https://img.shields.io/badge/astro-4.6-red)
![node version](https://img.shields.io/badge/node-18+-green)
![license](https://img.shields.io/badge/license-MIT-blue)

## ✨ 特性

- ✅ 基于 Astro 4.6 构建，具有优秀的性能表现
- ✅ 响应式设计，完美适配各种设备
- ✅ 支持明暗主题切换
- ✅ 支持代码语法高亮
- ✅ 支持评论系统 (Waline)
- ✅ 支持搜索功能 (Pagefind)
- ✅ SEO 友好，包含 sitemap 和 RSS 订阅
- ✅ 支持数学公式渲染 (KaTeX)
- ✅ 动画效果 (Framer Motion)
- ✅ 完整的文章管理系统

## 🛠️ 技术栈

- **框架**: [Astro](https://astro.build/) - 现代静态网站生成器
- **前端**: [React](https://reactjs.org/) - 组件化开发
- **样式**: [Tailwind CSS](https://tailwindcss.com/) - 实用优先的 CSS 框架
- **动画**: [Framer Motion](https://www.framer.com/motion/) - 流畅的动画效果
- **状态管理**: [Jotai](https://jotai.org/) - 原子化状态管理
- **评论系统**: [Waline](https://waline.js.org/) - 轻量级评论系统
- **搜索功能**: [Pagefind](https://pagefind.app/) - 静态搜索

## 🚀 快速开始

### 环境要求

- Node.js 18+
- pnpm (推荐)

### 安装依赖

```bash
pnpm install
```

### 开发

```bash
pnpm dev
```

访问 [http://localhost:4321](http://localhost:4321) 查看效果。

### 构建

```bash
pnpm build
```

### 预览

```bash
pnpm preview
```

## 📁 项目结构

```
├── public/                 # 静态资源
│   ├── fonts/             # 字体文件
│   └── favicon.ico        # 网站图标
├── src/
│   ├── components/        # React 组件
│   │   ├── header/        # 页头组件
│   │   ├── footer/        # 页脚组件
│   │   ├── post/          # 文章相关组件
│   │   └── ...
│   ├── content/           # 内容管理
│   │   ├── posts/         # 博客文章
│   │   ├── projects/      # 项目展示
│   │   └── friends/       # 友情链接
│   ├── layouts/           # 页面布局
│   ├── pages/             # 页面路由
│   ├── plugins/           # Markdown 插件
│   ├── store/             # 状态管理
│   ├── styles/            # 样式文件
│   ├── utils/             # 工具函数
│   └── config.json        # 网站配置
├── scripts/               # 脚本工具
│   ├── new-post.js        # 创建新文章
│   ├── new-project.js     # 创建新项目
│   └── new-friend.js      # 添加友链
└── ...
```

## ⚙️ 配置

网站的主要配置保存在 `src/config.json` 文件中，包括：

- **站点信息**: 网站标题、描述、关键词等
- **作者信息**: 姓名、头像、社交链接等
- **主题配色**: 支持自定义颜色主题
- **功能配置**: 评论系统、统计分析等

## 📝 内容管理

### 创建新文章

```bash
pnpm new-post
```

### 创建新项目

```bash
pnpm new-project
```

### 添加友情链接

```bash
pnpm new-friend
```

## 🎨 自定义主题

项目支持完全自定义的颜色主题，在 `config.json` 中修改 `color` 配置即可。

## 📜 可用脚本

| 命令               | 说明           |
| ------------------ | -------------- |
| `pnpm dev`         | 启动开发服务器 |
| `pnpm build`       | 构建生产版本   |
| `pnpm preview`     | 预览构建结果   |
| `pnpm lint`        | 格式化代码     |
| `pnpm new-post`    | 创建新文章     |
| `pnpm new-project` | 创建新项目     |
| `pnpm new-friend`  | 添加友情链接   |

## 📄 许可证

本项目基于 MIT 许可证开源。

## 🙏 致谢

本项目基于 [Gyoza](https://github.com/lxchapu/astro-gyoza) 主题开发。
