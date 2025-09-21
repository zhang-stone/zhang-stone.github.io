---
title: 不重装也能进系统：通过安装盘替换 Utilman 快速重置密码
date: 2025-09-21T13:50:47.027Z
tags: ['Windows', '系统维护', '密码重置']
comments: true
draft: false
---

## 背景

朋友的 Windows 电脑忘记密码，开不了机，让我帮忙看看。由于是本地账户，无法通过忘记密码找回。网上查了一圈之后，发现只能重装系统。问了一下 GPT，说是可以通过安装盘，进入命令行来实现重置密码。

![pV45ZuV.png](https://s21.ax1x.com/2025/09/21/pV45ZuV.png)

## 准备工作

### 1. 准备系统安装盘

我在拼多多买了 32G 的 U 盘，把 Windows 10 系统下载下来制作启动盘。

相关工具下载链接：

- 微软官方安装工具：https://www.microsoft.com/zh-cn/software-download
- Rufus 刻盘工具：https://rufus.ie
- Windows 系统镜像：https://next.itellyou.cn

### 2. 从 U 盘启动系统

1. 插入 Windows 10 安装 U 盘
2. 重启电脑进入安全模式
3. 选择从 U 盘启动

## 操作步骤

### 1. 进入修复模式

1. 在 Windows 安装界面，不要点击"立即安装"
2. 点击左下角的"修复计算机"
3. 依次选择：
   - 疑难解答
   - 高级选项
   - 命令提示符

### 2. 替换辅助工具为 CMD

> 这一步的目的是让登录界面能调出命令行

1. 首先找到系统盘（通常是 C 盘，但有时是 D 盘）
   - 输入 `c:` 回车，然后用 `dir` 命令查看是否有 Windows、Users 文件夹
   - 如果没有，依次尝试 `d:`, `e:` 直到找到真正的系统盘

2. 找到系统盘后，执行以下命令：

```cmd
cd Windows\System32
rename Utilman.exe Utilman_old.exe
copy cmd.exe Utilman.exe
```

![pV45Ej0.jpg](https://s21.ax1x.com/2025/09/21/pV45Ej0.jpg)

> 注意：上述操作是在 U 盘的系统环境中进行，请确保找到正确的系统盘后再执行命令。

![pV45eBT.jpg](https://s21.ax1x.com/2025/09/21/pV45eBT.jpg)

### 3. 重启并重置密码

1. 重启电脑，进入 Windows 登录界面
2. 点击右下角的辅助功能图标，此时会弹出命令提示符
3. 在命令提示符中执行：

   ```cmd
   net user
   ```

   这会列出所有账户名称

4. 找到要修改的用户名（例如 zhang），执行：

   ```cmd
   net user zhang 123456
   ```

   > 将 123456 替换为你想要设置的新密码

5. 看到"命令成功完成"提示后，返回登录界面即可使用新密码登录
