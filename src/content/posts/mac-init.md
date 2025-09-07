---
title: M3 芯片 Mac 新机前端环境配置
date: 2024-12-23
category: 前端
summary: 新购 Apple M3 芯片 Mac 的前端开发环境配置记录，包括 Homebrew、Node.js、nvm 及 Oh My Zsh 安装与常见问题解决方案
tags: [Mac, 前端, 开发环境, Node.js, Homebrew]
---

## 背景

新购入 M3 芯片的 Mac，需要进行常用开发环境配置。以下记录安装步骤与遇到的问题。

---

## 1. Homebrew

**像 Mac 高手一样管理应用，从 Homebrew 开始**

### 安装

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### 添加环境变量

```bash
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zshrc
source ~/.zshrc
```

### 常用软件安装

```bash
brew install --cask iterm2
```

## 2. Node.js & NVM

推荐使用 nvm 来管理 Node.js 版本。

### 安装 nvm

```bash
brew install nvm
```

### 配置环境变量

shell 配置文件中添加环境变量，注意：路径需根据 Homebrew 实际安装位置调整：

1. 查看 brew 安装路径：

```bash
brew --prefix
```

2. 编辑shell 配置文件

```bash
vim ~/.zshrc
```

3. 添加以下内容

```bash
export NVM_DIR="$HOME/.nvm"
[ -s "/opt/homebrew/opt/nvm/nvm.sh" ] && \. "/opt/homebrew/opt/nvm/nvm.sh"
[ -s "/opt/homebrew/opt/nvm/etc/bash_completion.d/nvm" ] && \. "/opt/homebrew/opt/nvm/etc/bash_completion.d/nvm"
```

4. 保存并使配置生效：

```bash
source ~/.zshrc
```

## 3. Oh My Zsh

我这里安装后会覆盖原有的 `~/.zshrc`，需注意备份。

### 安装

```bash
sh -c "$(curl -fsSL https://install.ohmyz.sh/)"
```

### 修改主题

编辑 `~/.zshrc`：

```bash
ZSH_THEME="robbyrussell"
```

## 4. 自动切换 Node 版本

根据项目目录下的 `.nvmrc` 文件自动切换 Node 版本，在 `~/.zshrc` 添加以下内容（需放在 nvm 初始化之后）：

```bash
autoload -U add-zsh-hook

load-nvmrc() {
  local nvmrc_path
  nvmrc_path="$(nvm_find_nvmrc)"

  if [ -n "$nvmrc_path" ]; then
    local nvmrc_node_version
    nvmrc_node_version=$(nvm version "$(cat "${nvmrc_path}")")

    if [ "$nvmrc_node_version" = "N/A" ]; then
      nvm install
    elif [ "$nvmrc_node_version" != "$(nvm version)" ]; then
      nvm use
    fi
  elif [ -n "$(PWD=$OLDPWD nvm_find_nvmrc)" ] && [ "$(nvm version)" != "$(nvm version default)" ]; then
    echo "Reverting to nvm default version"
    nvm use default
  fi
}

add-zsh-hook chpwd load-nvmrc
load-nvmrc
```

## 5. 常见问题 & 解决方案

### 低版本 Node 在 M 系芯片下安装失败

参考 [nvm issue #2350](https://github.com/nvm-sh/nvm/issues/2350)

**解决方法：**

```bash
arch -x86_64 zsh
```

### 切换 Node 版本失败，提示 `env: node: Bad CPU type in executable`

安装 Rosetta：

```bash
softwareupdate --install-rosetta
```
