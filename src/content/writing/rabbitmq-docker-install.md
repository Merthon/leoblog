---
title: "RabbitMQ 安装"
description: "使用 Docker 启动 RabbitMQ 4 管理版，并配置本地端口、持久化卷和独立账号。"
publishedAt: 2025-01-04
updatedAt: 2026-09-04
type: technical
tags: ["RabbitMQ", "Docker"]
draft: false
readingMinutes: 2
---

> 本文按 RabbitMQ 4 官方管理镜像重新整理，适合本地开发环境。

## 准备账号

新建 `.env`，不要继续使用默认的 `guest/guest`：

```dotenv
RABBITMQ_DEFAULT_USER=app
RABBITMQ_DEFAULT_PASS=replace-with-a-strong-password
```

```bash
printf '%s\n' '.env' >> .gitignore
chmod 600 .env
```

## 创建容器

```bash
docker pull rabbitmq:4-management

docker run -d \
  --name rabbitmq \
  --restart unless-stopped \
  --env-file .env \
  -p 127.0.0.1:5672:5672 \
  -p 127.0.0.1:15672:15672 \
  -v rabbitmq-data:/var/lib/rabbitmq \
  rabbitmq:4-management
```

- `5672` 是 AMQP 端口。
- `15672` 是 Web 管理界面端口。
- 两个端口都只绑定到本机。

打开 `http://127.0.0.1:15672`，使用 `.env` 中的账号登录。

## 检查状态

```bash
docker ps --filter name=rabbitmq
docker logs --tail 50 rabbitmq
docker exec rabbitmq rabbitmq-diagnostics check_running
```

## 权限与上线注意事项

需要多个应用时，为每个应用创建独立用户和虚拟主机，并只授予必要权限。生产环境还要配置 TLS、备份、监控和网络访问控制，不应把管理端口直接暴露到公网。

```bash
docker exec rabbitmq rabbitmqctl add_vhost app
docker exec rabbitmq rabbitmqctl set_permissions -p app app '.*' '.*' '.*'
```

命令中的第一个 `app` 是虚拟主机，第二个 `app` 是用户名。

## 参考

- [RabbitMQ Docker 官方镜像](https://hub.docker.com/_/rabbitmq/)
