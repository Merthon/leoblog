---
title: "HTTPX 使用笔记"
description: "整理 HTTPX 的同步与异步客户端、超时、状态检查、代理和 HTTP/2 配置。"
publishedAt: 2025-01-05
updatedAt: 2026-09-04
type: technical
tags: ["Python", "HTTP"]
draft: false
readingMinutes: 4
---

HTTPX 同时提供同步与异步 API，并支持连接池、HTTP/2、流式响应和细粒度超时。一次性请求可以使用顶层函数；同一服务有多次请求时，应复用 `Client`。

## 安装

```bash
python -m pip install httpx
```

## 同步客户端

```python
import httpx

with httpx.Client(
    base_url="https://httpbin.org",
    timeout=httpx.Timeout(10.0, connect=3.0),
    follow_redirects=True,
) as client:
    response = client.get("/get", params={"page": 1})
    response.raise_for_status()
    print(response.json())
```

HTTPX 默认带有超时，但生产代码仍应显式配置符合业务需求的值。`raise_for_status()` 会把 4xx 和 5xx 响应转成异常，避免把失败页面当成正常数据处理。

## 发送 JSON 和文件

```python
with httpx.Client(timeout=10.0) as client:
    response = client.post(
        "https://httpbin.org/post",
        json={"name": "Leo"},
    )
    response.raise_for_status()
```

上传文件时用上下文管理器关闭文件句柄：

```python
with open("example.txt", "rb") as file:
    response = httpx.post(
        "https://httpbin.org/post",
        files={"file": ("example.txt", file, "text/plain")},
        timeout=30.0,
    )
    response.raise_for_status()
```

## 代理

旧版本示例常见的 `proxies={...}` 已不适用于当前 API。单一代理使用 `proxy`：

```python
with httpx.Client(proxy="http://127.0.0.1:8080") as client:
    response = client.get("https://example.com")
    response.raise_for_status()
```

按协议或域名分流时，使用 `mounts` 和 `HTTPTransport`。只应连接可信代理，因为代理能够观察请求元数据，错误配置还可能泄露凭据。

## 异步并发

复用一个 `AsyncClient`，不要为每个 URL 新建连接池：

```python
import asyncio
import httpx

URLS = [
    "https://httpbin.org/get?page=1",
    "https://httpbin.org/get?page=2",
    "https://httpbin.org/get?page=3",
]

async def fetch(client: httpx.AsyncClient, url: str) -> dict:
    response = await client.get(url)
    response.raise_for_status()
    return response.json()

async def main() -> None:
    limits = httpx.Limits(max_connections=10)
    async with httpx.AsyncClient(timeout=10.0, limits=limits) as client:
        results = await asyncio.gather(*(fetch(client, url) for url in URLS))
    print(results)

asyncio.run(main())
```

并发上限需要根据目标服务的限流规则调整，不是越大越好。

## HTTP/2

HTTP/2 依赖是可选安装项：

```bash
python -m pip install 'httpx[http2]'
```

```python
with httpx.Client(http2=True) as client:
    response = client.get("https://example.com")
    print(response.http_version)
```

启用 HTTP/2 不代表每次请求都会使用它；客户端和服务器协商后也可能回退到 HTTP/1.1。

## 参考

- [HTTPX Client](https://www.python-httpx.org/advanced/clients/)
- [HTTPX 代理配置](https://www.python-httpx.org/advanced/proxies/)
- [HTTPX HTTP/2 支持](https://www.python-httpx.org/http2/)
