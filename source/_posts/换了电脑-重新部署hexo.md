---
title: '换了电脑,重新部署hexo'
date: 2020-08-04 00:00:41
tags:
- 博客
- blog
- GitHub Pages站点404
categories: 
- 个人站点
---
问题: 换了电脑, 之前的源文件都没有了
结果: 本地配置上传的gitHub, 多终端更新
<!-- more -->
### 1.hexo原理
hexo d 上传部署到github的文件是 hexo 编译后的文件,是用来生成网页的,不包含源文件。 其他文件 ，包括我们写在source 里面的，和配置文件，主题文件，都没有上传到github
由于之前的源文件丢失, 之前写的笔记飞走了, 除非你自己去html站点负责, 太繁琐, 放弃

### 解决方案
在 github 当前仓库新建一个分支 hexo, 专门用来上传本地源文件(主题配置文件等). 然后在这个仓库的settings中，选择默认分支为hexo分支（这样每次同步的时候就不用指定分支，比较方便）
> 在_config.yml 配置文件中, 指定master分支, hexo d 生成的文件, 上传到 master 分支
```
deploy:
  type: git
  repo: git@github.com:zhang-stone/zhang-stone.github.io.git
  #master分支
  branch: master
```
缺点: 
每次写完需要先上传一下源文件
```
git add .
git commit –m "xxxx"
git push 
```
遇到的问题: 重新访问站点404
1. 查看gitHub仓库, 文件都上传了,没问题
2. 谷歌吗, 没有和我一样的问题, 查看官方文档(配置 GitHub Pages 站点的发布源: https://docs.github.com/cn/github/working-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)

 - 在 GitHub 上，导航到站点的仓库。
 - 在仓库名称下，单击  Settings（设置）
 - 在“GitHub Pages”下，使用 Source（源）下拉菜单选择发布源。
 - 发布源需要为master分支, 我的不知道什么时候设置成了 hexo 分支. 

20分钟之后, 访问 https://zhang-stone.github.io/, 成功加载. 

参考
https://www.zhihu.com/question/21193762/answer/489124966
https://xuanwo.io/2014/08/14/hexo-usual-problem/


