---
title: 使用 Serv00 免费虚拟主机部署 Astro 博客
date: 2026-02-10 18:39:24
categories: 教程
tags:
  - Astro
  - 搭建博客
  - Serv00

id: "Astro-blog-Serv00"
cover: ""
recommend: true
---
> 在虚拟主机上更新博客好麻烦的，已经转到Vercel了

## 一、Serv00 免费主机

**官方网站：** https://www.serv00.com/

截至本文发布，Serv00 还未开放新的主机注册，页面提示：The server user limit has been reached. Registering a new account is currently not possible.（已达到服务器用户限制，暂无法注册新账号），已有账号可正常使用。

**账号登录面板：** https://panel7.serv00.com/

## 二、面板创建网站步骤

1. **登录 Serv00 面板**，找到 WWW websites 选项并点击
2. **点击 Add new website**（添加新网站）
3. **在 Domain 栏输入你的域名**（主域名/子域名均可），无域名可使用 Serv00 提供的免费子域名（具体规则可查阅官方说明）（主要是我把免费子域名给忘了🤔）
4. **展开 Advanced settings**（高级设置）
    - **Website type：** 选择 nodejs
    - **Node.js binary：** 可选 v18 v20 v22 推荐选择 v20 或 v22 
    - **Environment：** 保持默认 production 即可
5. **保存**

## 三、SSH 连接部署 Astro 博客

我使用的主题模版来自[韩小韩博客](https://www.vvhan.com/)  

开源地址：https://github.com/uxiaohan/vhAstro-Theme

创建完成后，通过 SSH 连接服务器，依次执行以下命令：

### 1. 进入域名根目录

```
cd ~/domains/你的域名
```

### 2. 拉取 Astro 博客主题模板

```
npm create astro@latest -- --template uxiaohan/vhAstro-Theme astro-blog --yes
```

### 3. 进入项目目录

```
cd astro-blog
```

### 4. 安装项目依赖

```
npm install
```

### 5. 构建生成静态文件（dist）

```
npm run build
```

## 四、部署文件到网站目录

Serv00 上 Node.js 站点的默认运行目录为：
`~/domains/你的域名/public_nodejs/public`

我们需要将构建好的 `dist` 静态文件，复制到该目录：

### 1. 清空目标目录（避免旧文件冲突）

```
rm -rf ~/domains/你的域名/public_nodejs/public/*
```

### 2. 复制打包好的博客文件

```
cp -rf dist/* ~/domains/你的域名/public_nodejs/public/
```

### 3. 修复权限（没有问题可忽略）

```
chmod -R 755 ~/domains/你的域名/public_nodejs/public
find ~/domains/你的域名/public_nodejs/public -type f -exec chmod 644 {} \;
```

## 五、部署完成

执行完以上所有命令，直接访问你的域名，即可正常打开 Astro 博客。

**提示：** 请将教程中的"你的域名"替换为实际创建的域名，如 `example.serv00.com`。

> 最后补充一点：在传统虚拟主机上手动更新静态博客，步骤较多、操作繁琐，长期维护并不方便。
如果你只是想专注写博客，更推荐使用 Vercel 或 Cloudflare Pages 这类平台，配合 GitHub 即可实现自动构建、一键部署，省心又稳定。