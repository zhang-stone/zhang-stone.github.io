---
title: nginx本地部署https
date: 2020-08-06 23:06:55
tags:
  - nginx
  - https
  - 前端
categories:
  - nginx
---

## 1 安装OpenSSL

先到http://slproweb.com/products/Win32OpenSSL.html 去下载OpenSSL（根据系统选择32位或者64位版本下载安装）。

<!-- more -->

然后安装在C:\OpenSSL-Win64下。

然后配置环境变量。在系统环境变量中添加环境变量：

变量名：OPENSSL_HOME

变量值：C:\OpenSSL-Win64\bin;

（变量值为OPENSSL安装位置下的bin目录）

并在Path变量结尾添加一条： %OPENSSL_HOME%

## 2 安装Nginx

到Nginx官网下载Nginx，我这里下载的是 nginx/Windows-1.12.0 这个版本。
把下载好的压缩包解压出来，拷贝其中的nginx-1.12.0目录到c:\下。并将文件夹名字修改为nginx。这样，Nginx就被安装到了c:\nginx目录下。
进入到C:\nginx目录下，双击nginx.exe文件即可启动服务器。在浏览器地址栏输入http://localhost，如果可以成功访问到Nginx的欢迎界面，则说明安装成功。

> 注意事项， 如果安装路径包含空格，如C:\Program Files (x86)\nginx, 在配置文件种需要

## 3 生成ssl证书

1. 首先在Nginx安装目录中创建ssl文件夹用于存放证书。比如我的文件目录为 C:\nginx\ssl
   在控制台中执行：
   cd C:\nginx\ssl
2. 创建密钥
   (window在cmd种执行)
   使用openssl工具生成一个RSA私钥

openssl genrsa -des3 -out server.key 2048

注意：生成私钥，需要提供一个至少4位，最多1023位的密码。

3. 生成CSR（证书签名请求）

openssl req -new -key server.key -out server.csr

说明：需要依次输入国家，地区，城市，组织，组织单位，Common Name和Email。其中Common Name，可以写自己的名字或者域名，如果要支持https，Common Name应该与域名保持一致，否则会引起浏览器警告。

可以将证书发送给证书颁发机构（CA），CA验证过请求者的身份之后，会出具签名证书，需要花钱。另外，如果只是内部或者测试需求，也可以使用OpenSSL实现自签名。

4. 删除密钥中的密码

openssl rsa -in server.key -out server.key

说明：如果不删除密码，在应用加载的时候会出现输入密码进行验证的情况，不方便自动化部署。

4、生成自签名证书

内部或者测试使用，只要忽略证书提醒就可以了。

openssl x509 -req -days 365 -in server.csr -signkey server.key -out server.crt

## 4 修改Nginx的nginx.conf配置文件

我的这个文件在C:\nginx\conf目录下。用任意一个编辑器（如Sublime Text之类）打开这个nginx.conf文件。

找到HTTPS server配置的那一段（即包含有listen 443 ssl配置那一段）。我们发现这段代码被注释掉了。所以，首先我们把该段代码前面的#server.server.key这两个文件的目录。并配置server_name为Common Name(生产证书填的)。修改后的该段配置如下：

```
server {
    listen       443 ssl;
    server_name  localhost;

    ssl_certificate      C://nginx//ssl//server.crt;  # 这个是证书的crt文件所在目录
    ssl_certificate_key  C://nginx//ssl//server.key;  # 这个是证书key文件所在目录
    # (window)所在路径有空格, 需要在"", 例如 "C://nginx//ssl//server.key"

    ssl_session_cache    shared:SSL:1m;
    ssl_session_timeout  5m;

    ssl_ciphers  HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers  on;

    location / {
      root   html;                  # 这个是指定一个项目所在目录
      index  index.html index.htm;  # 这个是指定首页的文件名
    }
}
```

注意一下那两个证书的文件路径的写法。

## 5 Nginx的常用操作

在继续后面的内容之前，先简单介绍下Windows命令行中操作Nginx的几个常用的语句：

nginx.exe # 启动Nginx
nginx.exe -s stop # 快速停止Nginx，可能并不保存相关信息
nginx.exe -s quit # 完整有序的停止Nginx，并保存相关信息
nginx.exe -s reload # 重新载入Nginx，当配置信息修改，需要重新载入这些配置时使用此命令。
nginx.exe -s reopen # 重新打开日志文件
nginx -v # 查看Nginx版本
因为修改了配置文件，所以需要退出控制台，并重新打开一个控制台。执行如下命令：
cd c:\nginx
nginx.exe -s quit
start nginx
即退出Nginx，然后再重新启动它。这时候，在浏览器地址栏输入(https://localhost)并回车。

这时候，你可能看到“您的连接不是私密连接”的提示，单击页面中的“高级”，并接着单击“继续前往m.test.com（不安全）”，就可以看到Nginx的欢迎界面了。说明https服务器已经配置成功了。
(https://localhost.com)
如果你只想用访问这个https服务器，那么下面的内容你就不用接着往下看了。但是，也许你可能还想要用一个别的域名,
例如(https//m.test.com)来访问这个服务器。那么怎么做呢？这就需要继续往下看了。
##6 修改hosts配置，实现域名映射
127.0.0.1 m.test.com
这样，你就可以通过(https://m.test.com)来访问配置好的https服务器了

#### tips

1. 尽量用管理员打开powershell去操作, 避免出现权限问题.
2. 用命令行去操作, 不要多次启动, 每次启动就多开一个进程

```
// window完整的看到所有的nginx进程的详细信息:
 tasklist /fi "imagename eq nginx.exe"
// 全部结束这些进程
 taskkill /fi "imagename eq nginx.exe" /f
```

4. 有报错,可以出logs/error.log查看nginx日志

- 在当前位置打开powershel
  ![avatar](https://res.cloudinary.com/dz79ynji8/image/upload/v1596909363/PowerShell_fgz3zj.jpg)
