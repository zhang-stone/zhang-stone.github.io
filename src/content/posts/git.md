---
title: Git 多身份配置实践：公司与个人项目的高效切换方案
date: 2025-05-26
tags: [git]
---

## 背景

公司代码仓库使用 GitLab，登录及提交需使用公司邮箱。然而在管理个人项目时，使用公司邮箱存在不便之处。为此，我通过路径隔离配置 Git，使个人项目在 GitHub 上使用单独的身份信息。

## 实现步骤：为 GitHub 配置独立身份

### 1. 生成 GitHub 专用 SSH 密钥

```bash
ssh-keygen -t rsa -b 4096 -C "zhangsan@gmail.com" -f ~/.ssh/id_rsa_github
```

此命令会在 `~/.ssh/` 目录下生成 `id_rsa_github` 和 `id_rsa_github.pub` 两个文件。

### 2. 配置 SSH 使用 GitHub 专用密钥

编辑或创建 `~/.ssh/config` 文件，添加以下内容：

```bash
Host github.com
  Hostname github.com
  AddKeysToAgent yes
  UseKeychain yes
  IdentityFile ~/.ssh/id_rsa_github
  User git
```

此配置确保连接 GitHub 时使用专属密钥。

### 3. 修改全局 Git 配置，按项目路径区分配置文件

在主配置文件 `~/.gitconfig` 中添加：

```bash
[includeIf "gitdir:~/dev/"]
    path = ~/dev/.gitconfig
```

表示当 Git 操作位于 `~/dev/` 目录下的项目时，使用 `~/dev/.gitconfig` 中的设置。

### 4. 配置个人项目专用 Git 信息

创建或编辑 `~/dev/.gitconfig`，添加个人身份信息：

```bash
[user]
    name = sanzhang
    email = zhangsan@gmail.com
```

这样配置后，公司项目依然使用默认设置（如 GitLab 账户），而个人项目（ dev 目录下）则使用个人邮箱，避免混淆，管理更高效。
