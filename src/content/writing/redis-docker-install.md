---
title: "Redis 安装"
description: "记录使用 Docker 拉取、启动并连接 Redis 的基本步骤。"
publishedAt: 2025-01-03
type: technical
tags: ["Redis", "Docker"]
draft: false
readingMinutes: 2
---
## 安装
运行以下命令从 Docker Hub 获取最新的 Redis 镜像：
```shell
docker pull redis:latest
```
## 创建 Redis 容器
```shell
docker run -d \
  --name redis \
  -p 6379:6379 \
  -v /Users/chenx/Workspace/redis-data:/data \
  redis:latest \
  redis-server --save 60 1 --loglevel warning
```
##### 参数解释：
- `-d`：以守护进程方式运行容器。
- `--name redis`：为容器指定名称为 `redis`。
- `-p 6379:6379`：将宿主机的 6379 端口映射到容器的 6379 端口。
- `-v /Users/chenx/Workspace/redis-data:/data`：将 Redis 的数据存储在指定目录中，方便持久化。
- `redis:latest`：使用最新的 Redis 镜像。
- `redis-server --save 60 1 --loglevel warning`：启动 Redis 服务器并配置保存和日志级别参数。
## 验证安装
```shell
docker ps
```
### 进入 Redis 容器使用 `redis-cli`
Redis 容器自带 `redis-cli` 工具，你可以直接进入容器运行：
```shell
docker exec -it redis sh
```
在容器内，运行以下命令：
```shell
redis-cli
```
你可以通过 `ping` 命令测试：
```shell
127.0.0.1:6379> ping
PONG
```
退出容器
exit
