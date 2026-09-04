---
title: "RabbitMQ 安装"
description: "记录使用 Docker 启动 RabbitMQ 及其管理界面的基本配置。"
publishedAt: 2025-01-04
type: technical
tags: ["RabbitMQ", "Docker"]
draft: false
readingMinutes: 2
---
## 拉取 RabbitMQ 镜像
```shell
docker pull rabbitmq:management
```
`rabbitmq:management` 镜像包含 RabbitMQ 和一个基于浏览器的管理界面，推荐使用。
## 启动 RabbitMQ 容器
```shell
docker run -d --name rabbitmq \
  -p 5672:5672 \
  -p 15672:15672 \
  -v /Users/chenx/Workspace/rabbitmq-data:/var/lib/rabbitmq \
  rabbitmq:management
```
- `--name rabbitmq`：容器名称为 `rabbitmq`。
- `-p 5672:5672`：映射 AMQP 通信端口。
- `-p 15672:15672`：映射管理界面端口。
- `-v /Users/chenx/Workspace/rabbitmq-data:/var/lib/rabbitmq`：将 RabbitMQ 数据存储在指定路径下。
## 验证安装是否成功
##### **访问 RabbitMQ 管理界面：**
打开浏览器并访问 http://localhost:15672。
默认的用户名和密码是：
- **用户名**: `guest`
- **密码**: `guest`
## 使用 Docker 命令直接管理
可以通过 `docker exec` 在容器中直接执行 RabbitMQ 管理命令，无需进入容器交互式 shell。例如：
```shell
docker exec rabbitmq rabbitmqctl add_user <username> <password>
docker exec rabbitmq rabbitmqctl set_user_tags <username> administrator
docker exec rabbitmq rabbitmqctl set_permissions -p / <username> ".*" ".*" ".*"
```
## 注意事项
**删除默认用户**
- 在生产环境中，建议删除默认的 `guest` 用户以提高安全性：
```shell
rabbitmqctl delete_user guest
```
- **虚拟主机的权限管理**
  如果使用多个虚拟主机，需要单独为每个虚拟主机分配权限。
- **密码安全**
  使用强密码，并限制暴露的管理端口访问权限。
