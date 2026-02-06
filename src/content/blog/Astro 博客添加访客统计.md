---
title: Astro 博客添加访客统计教程
date: 2026-02-06 12:36:41
categories: Code
tags:
  - Astro
  - 代码实现
  - PHP
  - 访客统计

id: "Astro-visitor-records"
cover: ""
recommend: true
---

## 前言

> 很多 Astro 博客都想展示「访客数」，但纯静态站点无法直接记录数据，第三方统计又难以自定义展示。本教程使用用 PHP + MySQL 自建统计后端，搭配 Astro 前端实现「去重统计、30 天自动更新访客标识、页脚优雅展示」，步骤详细，新手也能跟着做。

## 一、方案说明

### 核心逻辑

1. **前端**：Astro 页脚生成唯一访客标识（visitorId），30 天自动更新，请求 PHP 接口获取统计数据；
2. **后端**：PHP 自动创建数据库和表，通过 visitorId/IP 去重，仅新访客计数；
3. **存储**：MySQL 持久化保存访客记录和总人数，支持直接访问查看统计页面（不计数）。

### 适用场景

- Astro 静态博客/站点
- 有 PHP + MySQL 环境（虚拟主机/云服务器均可）
- 想要自定义访客统计、不依赖第三方服务

## 二、后端搭建：PHP 统计接口

### 2.1 新建 PHP 接口文件

在你的 PHP 环境根目录（如 `public_html/`）新建 `visit.php` 文件，复制以下完整代码：

```
<?php
// 允许跨域（上线后替换为你的域名，如 https://你的博客域名）
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json; charset=utf-8');

// 数据库配置（修改为你的 MySQL 信息）
$db_host = 'localhost';
$db_name = 'astro_visits'; // 数据库名，可自定义
$db_user = 'root';        // 数据库用户名
$db_pass = '你的数据库密码'; // 数据库密码

// 自动初始化数据库和表
function initDB($pdo) {
    // 访客数表
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS total_visits (
            id INT PRIMARY KEY AUTO_INCREMENT,
            count INT DEFAULT 0
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ");

    // 已访问访客表（去重用）
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS visited (
            id INT PRIMARY KEY AUTO_INCREMENT,
            visitor_id VARCHAR(255) UNIQUE,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ");

    // 初始化总人数为 0
    $stmt = $pdo->query("SELECT COUNT(*) AS cnt FROM total_visits");
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    if ($row['cnt'] == 0) {
        $pdo->exec("INSERT INTO total_visits (count) VALUES (0)");
    }
}

try {
    // 连接数据库
    $pdo = new PDO(
        "mysql:host=$db_host;dbname=$db_name;charset=utf8mb4",
        $db_user,
        $db_pass,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );
    initDB($pdo);

    // 获取当前总人数
    $stmt = $pdo->query("SELECT count FROM total_visits LIMIT 1");
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    $total = $row['count'];

    // 显示统计页面
    if (!isset($_GET['api'])) {
        header('Content-Type: text/html; charset=utf-8');
        echo <<<HTML
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>访客统计</title>
    <style>
        body { font-family: sans-serif; max-width: 600px; margin: 2rem auto; padding: 0 1rem; }
        .card { padding: 2rem; border: 1px solid #eee; border-radius: 8px; }
        .count { font-size: 2.5rem; color: #2563eb; font-weight: bold; }
    </style>
</head>
<body>
    <div class="card">
        <h1>网站总访客统计</h1>
        <p>当前总访客数：<span class="count">$total</span></p>
        <p>✅ 数据库与表已自动创建，接口正常运行</p>
        <p>直接访问此页面不会增加计数</p>
    </div>
</body>
</html>
HTML;
        exit;
    }

    // API 模式：Astro 调用，统计访客
    $visitorId = $_GET['visitorId'] ?? $_SERVER['REMOTE_ADDR'];
    try {
        // 插入访客标识，重复则报错（不计数）
        $stmt = $pdo->prepare("INSERT INTO visited (visitor_id) VALUES (?)");
        $stmt->execute([$visitorId]);
        // 新访客：总人数 +1
        $pdo->exec("UPDATE total_visits SET count = count + 1");
        // 更新最新总人数
        $stmt = $pdo->query("SELECT count FROM total_visits LIMIT 1");
        $total = $stmt->fetch(PDO::FETCH_ASSOC)['count'];
    } catch (PDOException $e) {
        // 重复访客，不处理
    }

    // 返回 JSON 数据
    echo json_encode(['total' => $total, 'status' => 'ok']);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => '数据库错误', 'message' => $e->getMessage()]);
}
?>
```

### 2.2 配置修改

1. **替换数据库信息**：`$db_host`、`$db_name`、`$db_user`、`$db_pass` 为你的 MySQL 实际参数；
2. **跨域优化**：上线后将 `header("Access-Control-Allow-Origin: *")` 将`*`改为你的 Astro 博客域名，提升安全性。

### 2.3 测试后端

1. **上传** `visit.php` **到 PHP 服务器**，访问 `https://你的接口域名/visit.php`；
2. **若显示「总访客统计页面」**，说明数据库创建成功、接口正常运行。

## 三、前端集成：Astro 页脚展示

### 3.1 准备工作

确保你的 Astro 项目有可以显示内容的组件如 `Footer.astro` 并为它引入相应的样式，我把它放在了页脚

### 3.2 调用代码

自行测试，在你需要显示的地方插入

```
---
import "./Footer.less"; //前置脚本，引入样式
---
<footer class="vh-footer">
  <main>
      <span> | 总访客：<span id="visitor-count">加载中...</span></span>
  </main>
</footer>

<!-- 总访客统计-->
<script is:inline>
  document.addEventListener('DOMContentLoaded', () => {
    const countEl = document.getElementById('visitor-count');
    if (!countEl) return;

    // 读取本地存储的访客标识和创建时间
    let visitorId = localStorage.getItem('visitorId');
    let createTime = localStorage.getItem('visitorId_create_time');
    const now = Date.now();
    const thirtyDays = 30 * 24 * 60 * 60 * 1000; // 30 天毫秒数，30为天数

    // 判断是否需要更新访客标识
    let needNew = !visitorId || !createTime || (now - parseInt(createTime, 10)) > thirtyDays;
    if (needNew) {
      visitorId = Math.random().toString(36).slice(2);
      createTime = now.toString();
      localStorage.setItem('visitorId', visitorId);
      localStorage.setItem('visitorId_create_time', createTime);
    }

    // 请求统计接口（替换为你的 PHP 接口地址）
    fetch(`https://你的接口域名/visit.php?api=1&visitorId=${visitorId}`)
      .then(res => res.json())
      .then(data => {
        countEl.textContent = data.total || '获取失败';
      })
      .catch(err => {
        countEl.textContent = '获取失败';
        console.error('统计接口错误：', err);
      });
  });
</script>
```

### 3.3 关键配置修改

**接口地址**：替换 `https://你的接口域名/visit.php` 为你实际的 PHP 接口地址；

## 四、常见问题解决

### 4.1 页脚显示「总访客：获取失败」

**原因**：跨域（CORS）拦截，或接口地址错误。

**解决**：

1. **检查** `visit.php` **顶部是否添加了跨域头**；
2. **确认接口地址正确**，可在浏览器直接访问接口验证；
3. **上线后将跨域头改为你的博客域名**，避免通配符 `*` 导致的安全问题。

### 4.2 直接访问接口会增加计数吗？

**不会**，代码中已做判断：直接访问 `visit.php` 仅显示统计页面，不计数；只有 Astro 前端带 `?api=1` 请求时才会统计。

### 4.3 不同设备/IP 如何统计？

- **默认**：优先用 `visitorId`（浏览器本地存储，30 天更新），不同设备/浏览器算新访客；
- **若想按 IP 统计**：修改 `visit.php` 中 `$visitorId = $_SERVER['REMOTE_ADDR'];`，同一 IP 仅算一次。

### 4.4 数据库占用空间大吗？

**可以忽略不计** 10 万条才十几 MB，无需担心存储问题。

## 五、总结

:::note{type="success"}
本教程通过「PHP 自建后端 + Astro 前端」实现了 Astro 静态博客的访客统计，核心优势：

1. **完全自主可控**，数据不依赖第三方；
2. **支持去重、自动更新访客标识**，统计更合理；
3. **页脚优雅展示**，不影响页面美观；
4. **自动建库建表**，新手无需手动操作 SQL。
:::

> 如果你的博客有更多统计需求（如今日访客、实时访问），可以基于本教程扩展数据库表和接口逻辑进行开发实现。
