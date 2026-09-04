---
title: "Nginx 使用及注意事项"
description: "整理 Nginx 静态文件、反向代理、HTTPS、配置检查与常见排障方法。"
publishedAt: 2025-08-25
updatedAt: 2026-09-04
type: technical
tags: ["服务器", "Nginx"]
draft: false
readingMinutes: 4
---

Nginx 常用于静态文件服务、TLS 终止和反向代理。配置不复杂，但代理头、超时和证书处理如果含糊，问题通常会留到上线后才暴露。

## 静态文件

```nginx
server {
    listen 80;
    server_name example.com;

    root /var/www/example;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }
}
```

`root` 指向只读发布目录。不要让 Web 服务用户对应用代码和静态资源拥有不必要的写权限。

## 反向代理

```nginx
upstream app_backend {
    server 127.0.0.1:8000;
    keepalive 16;
}

server {
    listen 80;
    server_name api.example.com;

    location / {
        proxy_pass http://app_backend;
        proxy_http_version 1.1;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        proxy_connect_timeout 5s;
        proxy_read_timeout 60s;
        proxy_send_timeout 60s;
    }
}
```

后端只有在请求确实来自可信反向代理时，才能信任 `X-Forwarded-*`。如果 Nginx 前面还有 CDN 或负载均衡器，需要明确可信代理地址并正确配置真实客户端 IP，不能直接相信任意客户端传来的头。

## HTTPS

```nginx
server {
    listen 80;
    server_name example.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name example.com;

    ssl_certificate     /etc/nginx/tls/fullchain.pem;
    ssl_certificate_key /etc/nginx/tls/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;

    root /var/www/example;
    index index.html;
}
```

私钥文件应限制读取权限。证书续期后需要平滑重载 Nginx。

HSTS 会让浏览器在有效期内强制使用 HTTPS。只有确认所有子域、证书和回滚方案都正确后再启用，尤其不要一开始就加入 `preload`。

## 检查与重载

```bash
sudo nginx -t && sudo systemctl reload nginx
sudo systemctl status nginx
sudo journalctl -u nginx --since today
```

把语法检查和重载写在同一条命令中，检查失败时不会执行后半段。重载会保留现有连接，比直接重启更适合常规配置更新。

## 日志与排障

- **404**：检查 `root`、`alias`、`try_files` 和文件权限。
- **413**：请求体超过 `client_max_body_size`，先确认业务确实需要更大限制。
- **499**：客户端在 Nginx 返回前断开，结合上游耗时判断。
- **502**：上游未监听、地址错误或连接失败。
- **504**：上游响应超时；先定位慢请求，不要只盲目增加超时。

访问日志可能包含 IP、URL 参数和用户标识。设置日志轮转和保留期限，避免记录令牌、密码等敏感信息。

## 性能配置

`worker_processes auto;` 通常是合理起点，但 `worker_connections`、缓存、压缩和缓冲区没有通用“最佳值”。先观察连接数、响应时间、磁盘 I/O 与上游瓶颈，再做调整。

启用压缩时注意代理层和应用层不要重复压缩：

```nginx
gzip on;
gzip_vary on;
gzip_types text/plain text/css application/json application/javascript image/svg+xml;
```

## 参考

- [Nginx 反向代理模块](https://nginx.org/en/docs/http/ngx_http_proxy_module.html)
- [Nginx HTTPS 配置](https://nginx.org/en/docs/http/configuring_https_servers.html)
