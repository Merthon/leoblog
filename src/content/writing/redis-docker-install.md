---
title: "Redis 安装"
description: "使用 Docker 启动 Redis 8，配置本地访问、AOF 持久化与数据卷。"
publishedAt: 2025-01-03
updatedAt: 2026-09-04
type: technical
tags: ["Redis", "Docker"]
draft: false
readingMinutes: 2
---

> 本文按 Redis 8 官方镜像重新整理。下面的无密码配置只适合绑定在本机的开发环境。

## 创建容器

```bash
docker pull redis:8

docker run -d \
  --name redis \
  --restart unless-stopped \
  -p 127.0.0.1:6379:6379 \
  -v redis-data:/data \
  redis:8 \
  redis-server --appendonly yes
```

- 使用 `redis:8` 固定主版本，避免 `latest` 带来的跨版本变化。
- 端口只绑定到 `127.0.0.1`，不会直接暴露给局域网或公网。
- `--appendonly yes` 开启 AOF 持久化；是否同时配置 RDB，应根据恢复目标决定。

## 验证连接

```bash
docker ps --filter name=redis
docker logs --tail 50 redis
docker exec -it redis redis-cli ping
```

正常响应是：

```text
PONG
```

## 生产环境注意事项

Redis 官方镜像为了方便容器网络访问，会关闭 protected mode。只要把端口映射到外部地址，就必须额外配置认证、TLS、网络访问控制和最小权限 ACL。不要只依赖一个简单密码保护公网 Redis。

数据卷也不是备份。上线前需要明确 RPO/RTO，验证快照或备份文件能否恢复。

## 参考

- [Redis Docker 官方镜像](https://hub.docker.com/_/redis)
