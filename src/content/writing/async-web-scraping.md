---
title: "异步爬虫"
description: "使用 asyncio 与 aiohttp 编写有超时、并发上限和错误处理的异步抓取程序。"
publishedAt: 2025-01-14
updatedAt: 2026-09-04
type: technical
tags: ["Python", "爬虫", "异步"]
draft: false
readingMinutes: 3
---

异步请求能在等待网络响应时运行其他任务，适合 I/O 密集型抓取。它不会让服务器响应更快，也不意味着并发越高越好；真正的上限通常来自目标站点的限流、网络连接数和本机资源。

> 只抓取你有权访问的数据，并遵守网站条款、`robots.txt`、版权与隐私要求。并发控制是基本礼貌，也是稳定运行的前提。

## 安装

`asyncio` 属于 Python 标准库，不需要通过 pip 安装。这里只安装 HTTP 客户端：

```bash
python -m pip install -U aiohttp
```

## 复用会话并设置超时

不要为每个 URL 创建一个 `ClientSession`。复用会话才能使用连接池：

```python
import asyncio
import aiohttp

URLS = [
    "https://example.com/",
    "https://example.org/",
    "https://example.net/",
]

async def fetch(
    session: aiohttp.ClientSession,
    semaphore: asyncio.Semaphore,
    url: str,
) -> str:
    async with semaphore:
        async with session.get(url) as response:
            response.raise_for_status()
            return await response.text()

async def main() -> None:
    timeout = aiohttp.ClientTimeout(total=20, connect=5)
    semaphore = asyncio.Semaphore(5)

    async with aiohttp.ClientSession(timeout=timeout) as session:
        results = await asyncio.gather(
            *(fetch(session, semaphore, url) for url in URLS),
            return_exceptions=True,
        )

    for url, result in zip(URLS, results, strict=True):
        if isinstance(result, Exception):
            print(f"{url}: {type(result).__name__}: {result}")
        else:
            print(f"{url}: {len(result)} bytes")

asyncio.run(main())
```

## 关键点

- `asyncio.Semaphore(5)` 把同时进行的请求限制为 5 个。
- `ClientTimeout` 防止连接或响应无限等待。
- `raise_for_status()` 不会把 404、500 等错误页当成有效数据。
- `return_exceptions=True` 让单个请求失败时仍能收集其他结果；之后必须逐个处理异常。
- 重试只适合临时错误，并应使用指数退避、随机抖动和最大次数。不要重试 401、403 等权限错误。

## 与 Scrapy 的关系

Scrapy 自带调度、去重、限速、重试和数据管道，更适合持续运行或规模较大的采集任务。`aiohttp` 更轻，适合 API 调用和结构简单的小型任务。不要为了“异步”而重复实现框架已经解决的问题。

## 参考

- [Python asyncio 文档](https://docs.python.org/3/library/asyncio.html)
- [aiohttp 客户端文档](https://docs.aiohttp.org/en/stable/client.html)
