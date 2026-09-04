---
title: "MySQL 数据库安装"
description: "记录在 Docker 环境中安装 MySQL、配置端口与持久化数据的方法。"
publishedAt: 2025-01-05
type: technical
tags: ["Docker", "MySQL"]
draft: false
readingMinutes: 3
---
## 1.安装
首先，确保你在 OrbStack 上安装了 Docker，然后拉取 MySQL 镜像。
1. 打开 OrbStack，进入终端。
2. 执行以下命令来拉取 MySQL 镜像：
```shell
docker pull mysql:latest
```
这会从 Docker Hub 拉取最新版的 MySQL 镜像。
## 2.启动
接下来，我们可以启动一个 MySQL 容器并配置它。运行以下命令：
```shell
docker run --name mysql-container -e MYSQL_ROOT_PASSWORD=root -p 3306:3306 -d mysql:latest

```
解释：
- `--name mysql-container`：指定容器的名字为 `mysql-container`。
- `-e MYSQL_ROOT_PASSWORD=root`：设置 MySQL 的 root 用户密码为 `root`（你可以换成更强的密码）。
- `-p 3306:3306`：将容器的 3306 端口映射到本机的 3306 端口，方便你从外部连接。
- `-d mysql:latest`：在后台运行 MySQL 容器，使用最新版的 MySQL 镜像
## 3.检查
你可以用以下命令检查容器是否启动成功：
```shell
docker ps
```
如果一切正常，你会看到类似如下的输出，表示 MySQL 容器正在运行：
```shell
CONTAINER ID   IMAGE            COMMAND                  CREATED         STATUS         PORTS                    NAMES
abcd1234efgh   mysql:latest     "docker-entrypoint.s…"   5 seconds ago   Up 3 seconds   0.0.0.0:3306->3306/tcp   mysql-container

```
## 4.进入 MySQL 容器并连接数据库
接下来，进入容器并连接 MySQL。
1. 运行以下命令进入容器：
```shell
docker exec -it mysql-container mysql -u root -p
```
2. 系统会提示你输入密码，输入你在第 2 步中设置的密码（这里是 `root`）。
3. 进入 MySQL 后，你可以开始创建数据库或执行其他 SQL 操作。例如，创建一个数据库：
```sql
CREATE DATABASE mydatabase;
```
## 5.使用 MySQL 客户端连接（可选）

如果你希望从本机的 MySQL 客户端连接到容器中的 MySQL 数据库，可以使用如下命令：
```shell
mysql -h 127.0.0.1 -P 3306 -u root -p
```
## 6.持久化存储
1. 在本机创建一个目录用于存储 MySQL 数据：
```shell
mkdir -p /path/to/local/mysql-data
```
2. 启动 MySQL 容器时，使用 `-v` 参数将本地目录挂载到容器中：
```shell
docker run --name mysql-container -e MYSQL_ROOT_PASSWORD=root -p 3306:3306 -v /Users/chenx/Workspace/OrbStack_data/mysql-data:/var/lib/mysql -d mysql:latest
```
这样，数据库的数据就会保存在本机的 `/path/to/local/mysql-data` 目录下，容器删除后数据不会丢失。
/Users/chenx/Workspace/OrbStack_data/mysql-data
