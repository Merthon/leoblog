---
title: "网络爬虫基础"
description: "从 URL、HTTP 语义和解析流程出发，整理合规、稳定的网页数据采集基础。"
publishedAt: 2025-01-04
updatedAt: 2026-09-04
type: technical
tags: ["Python", "爬虫", "HTTP"]
draft: false
readingMinutes: 4
---

网页采集的核心流程是：发送 HTTP 请求，检查响应，再从 HTML 或 JSON 中提取数据。真正困难的部分通常不是选择器，而是权限、限流、页面变化、失败恢复和数据质量。

> 只采集你有权访问的数据。开始前确认服务条款、`robots.txt`、版权、隐私与当地法律要求。登录、验证码和访问限制属于安全边界，不应绕过。

## URI 与 URL

URI 是资源标识符，URL 是同时描述访问位置和方式的一类 URI。常见 URL 结构可以写成：

```text
scheme://[userinfo@]host[:port]/path[?query][#fragment]
```

- `scheme`：协议，例如 `https`。
- `host`：域名或 IP 地址。
- `port`：可选端口。
- `path`：服务器上的资源路径。
- `query`：发送给服务器的查询参数。
- `fragment`：客户端片段标识，不会随普通 HTTP 请求发送给服务器。

不要把密码、Token 或个人信息放进 URL。URL 可能被浏览器历史、代理、服务器日志和分析系统记录。

## HTTP 与 HTTPS

HTTP 定义请求与响应的语义。HTTPS 是运行在 TLS 之上的 HTTP，能提供传输加密、完整性保护和服务端身份验证。

客户端建立 TLS 连接时会验证证书和主机名，并协商会话密钥。不要通过 `verify=False` 关闭证书验证来“修复”连接问题；应修复证书链、系统时间或可信 CA 配置。

## 请求组成

一个 HTTP 请求包括方法、目标地址、请求头和可选请求体。

常见方法：

- `GET`：读取资源，语义上安全且幂等。
- `HEAD`：只获取与 `GET` 相同的响应头语义，不返回响应内容。
- `POST`：提交数据或触发处理，通常不幂等。
- `PUT`：创建或完整替换目标资源，语义上幂等。
- `PATCH`：部分修改资源。
- `DELETE`：删除资源，语义上幂等不代表每次响应都相同。

“安全”和“幂等”是协议语义，不是权限保证。服务端实现错误时，`GET` 仍可能产生副作用。

常见请求头包括 `Accept`、`Content-Type`、`Authorization`、`Cookie` 和 `User-Agent`。不要伪造浏览器身份来规避访问控制；有公开 API 时优先使用 API。

## 响应组成

响应包含状态码、响应头和可选响应体：

- `2xx`：请求成功。
- `3xx`：重定向。
- `4xx`：客户端请求、认证或权限问题。
- `5xx`：服务端处理失败。

程序不能只检查有没有响应体。先判断状态码和 `Content-Type`，再决定按 JSON、HTML 或二进制解析。

## GET 与 POST 的常见误区

- POST 不会因为参数放在请求体里就自动安全；机密性来自 HTTPS。
- HTTP 没有规定统一的“POST 无长度限制”，服务器、网关和客户端都可以限制请求体大小。
- GET 通常可缓存，POST 在满足明确缓存条件时也可以缓存。
- 请求体不等于 JSON；格式由 `Content-Type` 描述。
- GET 请求体缺少通用语义和互操作性，不应依赖它传递业务数据。

## 采集流程

1. 优先寻找官方 API、导出功能或数据集。
2. 读取条款和 `robots.txt`，确定允许的路径与速率。
3. 设置清晰的 `User-Agent`、超时、并发上限和失败策略。
4. 检查状态码与内容类型，再解析 HTML 或 JSON。
5. 使用 CSS 选择器、XPath 或结构化数据提取字段。
6. 保存来源 URL、采集时间和解析版本，方便审计与重跑。
7. 去重、校验、监控失败率，并限制数据保留周期。

`robots.txt` 不是授权机制，也不是访问控制；遵守它只是合规检查的一部分。

## 并发模型

- 少量 I/O 请求：同步客户端最简单。
- 大量 I/O 请求：异步 I/O 或受控线程池可以减少等待。
- CPU 密集解析：进程池可能更合适。

并发越高，越容易触发限流并放大失败。先从小并发开始，观察 429、5xx、延迟和服务端要求，再调整。

## Session、Cookie 与代理

Session 通常把状态保存在服务端，浏览器只持有随机 Session ID Cookie。Cookie 也能保存偏好等客户端数据，不代表每个 Cookie 都是会话凭据。

代理分为正向代理和反向代理。采集程序使用正向代理时，代理能够观察连接元数据，HTTP 明文代理还能读取内容。不要把认证信息发送给来源不明的免费代理。

## 参考

- [RFC 9110：HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110)
- [RFC 9309：Robots Exclusion Protocol](https://www.rfc-editor.org/rfc/rfc9309)
