---
title: "MongoDB 数据库安装"
description: "记录使用 Docker 安装、配置并运行 MongoDB 的基本步骤。"
publishedAt: 2025-01-03
type: technical
tags: ["Docker", "MongoDB"]
draft: false
readingMinutes: 2
---
## 拉取 MongoDB 镜像
1. 打开终端，拉取官方 MongoDB Docker 镜像：
```shell
docker pull mongo
```
2. 如果需要特定版本的 MongoDB，可以指定版本号：
```shell
docker pull mongo:6.0
```
## 创建 MongoDB 容器
运行以下命令启动 MongoDB 容器：
```shell
docker run -d \
  --name mongodb \
  -p 27017:27017 \
  -v /path/to/mongodb/data:/data/db \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=yourpassword \
  mongo
```
- `--name mongodb`：指定容器名称。
- `-p 27017:27017`：将 MongoDB 的默认端口映射到主机端口。
- `-v /path/to/mongodb/data:/data/db`：将数据文件存储在主机路径中，替换 `/path/to/mongodb/data` 为实际路径（建议将路径指向你的工作目录）。
- `-e MONGO_INITDB_ROOT_USERNAME=admin` 和 `-e MONGO_INITDB_ROOT_PASSWORD=yourpassword`：设置 MongoDB 的管理员用户名和密码。
## 验证 MongoDB 容器状态
查看 MongoDB 容器是否运行成功：
```shell
docker ps
```
