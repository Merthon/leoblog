---
title: "MySQL 数据库安装"
description: "使用 Docker 启动 MySQL 8.4，配置本地端口、持久化卷和非 root 业务账号。"
publishedAt: 2025-01-05
updatedAt: 2026-09-04
type: technical
tags: ["Docker", "MySQL"]
draft: false
readingMinutes: 2
---

> 本文按 MySQL 8.4 官方镜像重新整理。示例用于本地开发，并刻意避免 `latest` 标签和弱密码。

## 准备环境变量

新建 `.env`：

```dotenv
MYSQL_ROOT_PASSWORD=replace-with-a-strong-root-password
MYSQL_DATABASE=app
MYSQL_USER=app
MYSQL_PASSWORD=replace-with-a-strong-app-password
```

不要提交这个文件：

```bash
printf '%s\n' '.env' >> .gitignore
chmod 600 .env
```

## 创建容器

```bash
docker pull mysql:8.4

docker run -d \
  --name mysql \
  --restart unless-stopped \
  --env-file .env \
  -p 127.0.0.1:3306:3306 \
  -v mysql-data:/var/lib/mysql \
  mysql:8.4 \
  --character-set-server=utf8mb4 \
  --collation-server=utf8mb4_0900_ai_ci
```

- `mysql:8.4` 固定在 8.4 系列，更新补丁版本时不会意外跨越主版本。
- `127.0.0.1:3306:3306` 只允许本机访问。
- `mysql-data` 是 Docker 命名卷，删除容器后数据仍会保留。
- 业务应用应使用 `MYSQL_USER` 创建的普通账号，而不是 root。

## 检查与连接

```bash
docker ps --filter name=mysql
docker logs --tail 50 mysql
docker exec -it mysql mysql -u app -p app
```

最后一个 `app` 是数据库名。命令会交互式询问密码，避免密码出现在 Shell 历史中。

## 常用维护命令

```bash
# 停止与启动
docker stop mysql
docker start mysql

# 查看数据卷
docker volume inspect mysql-data

# 删除容器，但保留数据卷
docker rm -f mysql
```

生产环境还需要独立的备份、监控、最小权限账号和网络访问控制。不要把端口直接映射到 `0.0.0.0`。

## 参考

- [MySQL Docker 官方镜像](https://hub.docker.com/_/mysql)
