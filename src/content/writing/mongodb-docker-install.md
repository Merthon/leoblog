---
title: "MongoDB 数据库安装"
description: "使用 Docker 启动 MongoDB 8.0，并配置本地端口、持久化卷与管理员凭据。"
publishedAt: 2025-01-03
updatedAt: 2026-09-04
type: technical
tags: ["Docker", "MongoDB"]
draft: false
readingMinutes: 2
---

> 本文按 MongoDB 8.0 官方镜像重新整理。示例面向本地开发，不应直接作为生产环境配置。

## 准备环境变量

不要把密码直接写进命令或提交到 Git。新建 `.env`：

```dotenv
MONGO_INITDB_ROOT_USERNAME=admin
MONGO_INITDB_ROOT_PASSWORD=replace-with-a-strong-password
```

将 `.env` 加入 `.gitignore`，并限制文件权限：

```bash
printf '%s\n' '.env' >> .gitignore
chmod 600 .env
```

## 创建容器

使用明确的主版本标签，避免 `latest` 在下次启动时带来意外升级：

```bash
docker pull mongo:8.0

docker run -d \
  --name mongodb \
  --restart unless-stopped \
  --env-file .env \
  -p 127.0.0.1:27017:27017 \
  -v mongodb-data:/data/db \
  mongo:8.0
```

这里使用 Docker 命名卷保存数据，并把端口绑定到 `127.0.0.1`。其他主机无法直接访问，更适合本地开发。

## 验证状态

```bash
docker ps --filter name=mongodb
docker logs --tail 50 mongodb
docker exec -it mongodb mongosh \
  -u "$MONGO_INITDB_ROOT_USERNAME" \
  -p "$MONGO_INITDB_ROOT_PASSWORD" \
  --authenticationDatabase admin
```

如果环境变量只存在于 `.env`，先在当前 Shell 中加载，或者直接填写对应值。不要把真实密码复制到公开日志和截图里。

## 生产环境注意事项

- 不要把数据库端口直接暴露到公网。
- 使用专用业务账号，不要让应用长期使用 root 管理员。
- 为数据卷建立备份与恢复演练；Docker 卷不是备份。
- 升级主版本前先阅读兼容性说明，并在备份数据上验证。

## 参考

- [Mongo Docker 官方镜像](https://hub.docker.com/_/mongo)
