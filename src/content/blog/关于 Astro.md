---
title: 关于 Astro
date: 2026-02-05 08:18:17
categories: 教程
tags:
  - Astro

id: "About-Astro"
cover: "https://bing.img.run/rand.php"
recommend: true
top: true
---

> Astro 是专为**内容型网站**设计的静态站点生成器（SSG），用最少的 JavaScript 交付最快的页面。

**优势**：

- 🚀 **岛屿架构**：只在需要交互的地方加载 JS（比如评论区），首页零 JS！
- 🌐 **多框架自由**：React/Vue/Svelte 组件可混用，老项目平滑迁移
- 📱 **天生 SEO 友好**：纯 HTML 输出，搜索引擎秒收录（博客/文档站神器）

💡 适合你吗？ 
✅ 合适：博客、作品集、企业官网、文档站、营销落地页

❌ 不适合：复杂后台系统、实时聊天应用

---

## ⚙️ 环境准备（2分钟搞定）

1. **检查 Node 版本**（终端执行）：

```
node -v
```

2. **要求：Node.js 18.14.0+**（推荐 LTS 20.x）

3. **无需全局安装 Astro**！
（现代工具链已淘汰 `npm install -g`，放心~）

---

## 🚀 三步创建项目

:::note{type="success"}
# 1. 执行创建命令（自动引导）
```
npm create astro@latest
```
# 2. 按提示操作（推荐选择）：
#   📁 项目名：**my-site**
#   🎨 模板：**Just the basics（纯 Astro）**
#   📦 安装依赖：**Yes**

# 3. 进入项目 & 启动
```
cd my-site
npm run dev
```
:::

✅ 浏览器打开 `http://localhost:4321` → 看到欢迎页即成功！

---

## 📂 项目结构精讲（只记这 4 个！）

```
my-site/
├── src/
│   ├── pages/       ← **页面放这里！**（index.astro = 首页）
│   ├── components/  ← **组件放这里**（可复用 UI）
│   └── layouts/     ← 布局模板（如博客统一头尾）
├── public/          ← 静态资源（favicon.ico 直接丢这儿）
├── astro.config.mjs ← 配置文件（路由/集成等）
└── package.json     ← 脚本命令看这里
```

💡 **关键认知**：
`pages/` 下的 `.astro` 文件 = 自动路由！
`about.astro` → 访问 `/about`，无需手动配路由！

---

## ✍️ 创建第一个页面

### 步骤 1：修改首页

打开 `src/pages/index.astro`，替换为：

```
---
// 前置脚本（可选）
const city = "上海青浦";
const now = new Date().toLocaleDateString('zh-CN');
---

<html lang="zh-CN">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width" />
    <title>我的 Astro 首页</title>
  </head>
  <body class="bg-gray-50 text-center py-12">
    <h1 class="text-4xl font-bold text-indigo-700 mb-4">✨ Hello Astro!</h1>
    <p class="text-xl text-gray-700">📍 从 {city} 发来的问候</p>
    <p class="mt-2 text-gray-500">📅 今天是 {now}</p>
    
    <!-- 引入自定义组件（下一步创建） -->
    <Counter />
  </body>
</html>

<!-- 内联组件：无需单独文件 -->
<Counter>
  <script>
    let count = 0;
    function increment() { count++; }
  </script>
  
  <button 
    onclick={increment} 
    class="mt-6 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
  >
    点击计数：{count}
  </button>
</Counter>
```

### 步骤 2：保存 → 浏览器自动热更新！

（修改即生效，体验丝滑）

---

## 🌐 运行与构建（部署前必看）

| 命令 | 作用 | 适用场景 |
| ------ |------ |------ |
| `npm run dev` | **启动开发服务器** | 本地编写调试 |
| `npm run build` | **生成静态文件** | 部署前执行 |
| `npm run preview` | 预览构建结果 | 检查部署效果 |

✅ **构建后**：
所有文件输出到 `dist/` 目录 → 直接拖到 Vercel/Netlify/GitHub Pages 即可上线！

---

## 💡 新手问题

| 问题 | 10 秒解决 |
| ------ |------ |
| **样式不生效？** | Astro 默认作用域隔离！在组件内写 `<style>` 即可（见上文 Counter 示例） |
| **热更新失效？** | 删除 `node_modules/.vite` 缓存 → 重启 `npm run dev` |
| **想用 Tailwind？** | 参考我上篇教程 👉 Astro 集成 Tailwind CSS 详细指南 |
| **中文乱码？** | 确保文件保存为 **UTF-8 编码**（VS Code 右下角可切换） |

---

## 🌱 下一步行动建议

1. **今天**：把 `index.astro` 里的城市名改成你的所在城市
2. **明天**：在 `pages/` 新建 `blog.astro`，体验自动路由
3. **进阶**：
    - 添加 Markdown 博客（`src/content/blog/`）
    - 集成 Tailwind 美化页面
    - 部署到 GitHub Pages

---

**Astro 的哲学很简单：内容为王，技术隐形。**
你不需要成为框架专家，也能做出高性能网站。
**现在，去创造属于你的网站吧** 
