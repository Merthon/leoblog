---
title: "异步爬虫"
description: "异步爬虫是通过异步编程技术来提升爬虫性能的一种方式。"
publishedAt: 2025-01-14
type: technical
tags: ["爬虫"]
draft: false
readingMinutes: 4
---
异步爬虫是通过异步编程技术来提升爬虫性能的一种方式。与传统的同步爬虫不同，异步爬虫能够在等待某些操作（如请求响应）时进行其他任务，从而避免了不必要的等待时间，提高了爬虫的效率。
## 同步与异步的区别
- **同步爬虫**：在执行过程中，每发出一次请求，程序会等待该请求的响应完成后才能继续执行下一个任务。由于请求-响应时间不稳定，导致整个爬虫的运行效率较低。
- **异步爬虫**：通过非阻塞的方式发送请求。当请求发出后，程序并不会等待响应，而是继续执行其他任务。只有当响应返回时，程序才会处理相应的结果。这样能显著减少因等待请求响应而造成的空闲时间。
## 异步爬虫的工作原理
异步爬虫的核心思想是利用事件循环（Event Loop）和协程（Coroutine）来实现非阻塞的任务调度。异步编程的主要优势是可以在同一线程中并行处理多个I/O密集型任务（如网络请求），从而大幅提高性能。
在异步爬虫中，我们通常使用 `asyncio` 库（Python 3.7+）或者一些框架（如 `Scrapy` 的异步爬虫功能）来管理异步请求。
##### 使用 `asyncio` 和 `aiohttp`
`aiohttp` 是一个支持异步 HTTP 请求的库，可以与 `asyncio` 配合使用，进行非阻塞的网络请求。
### 基本实现步骤：
```python
pip install aiohttp asyncio
```

```python
import aiohttp
import asyncio

# 异步请求函数
async def fetch(url):
    async with aiohttp.ClientSession() as session:
        async with session.get(url) as response:
            return await response.text()

# 异步爬虫主函数
async def main():
    url = 'http://example.com'
    html = await fetch(url)
    print(html)

# 运行异步爬虫
if __name__ == "__main__":
    asyncio.run(main())
```
- `async` 定义异步函数，`await` 用于挂起当前任务直到异步操作完成。
- `aiohttp.ClientSession` 用于创建 HTTP 请求的会话，`session.get(url)` 用于发送 GET 请求，`await response.text()` 用于获取响应的 HTML 内容。
- `asyncio.run(main())` 启动异步事件循环，执行 `main()` 函数。
### 并发发送多个请求：
```python
import aiohttp
import asyncio

async def fetch(url):
    async with aiohttp.ClientSession() as session:
        async with session.get(url) as response:
            return await response.text()

async def main():
    urls = ['http://example.com', 'http://example.org', 'http://example.net']
    tasks = [fetch(url) for url in urls]
    results = await asyncio.gather(*tasks)
    for result in results:
        print(result)

if __name__ == "__main__":
    asyncio.run(main())
```
- `asyncio.gather(*tasks)` 用于并发执行多个任务，将多个异步任务打包成一个任务集合并发运行。
- `tasks` 列表存储了对多个 URL 的请求任务，通过 `await asyncio.gather(*tasks)` 同时启动多个请求。
## 异步爬虫的优点
- **高效的 I/O 操作**：异步爬虫能够处理大量的网络请求，而不必因为等待响应而浪费时间，极大提高了爬虫的效率。
- **资源占用低**：相比多线程和多进程，异步爬虫的资源占用更少，可以在单线程中完成大量任务。
- **提高爬虫速度**：尤其在抓取大量数据时，异步爬虫能够显著提高速度。
## Scrapy 异步爬虫
Scrapy 本身是一个异步爬虫框架，底层基于 Twisted 库，它通过事件驱动模型来处理多个请求。Scrapy 的异步功能非常强大，爬虫中的请求和回调（callback）都会自动异步执行。
1. 创建项目
```python
scrapy startproject myspider
cd myspider
```
2. 编写spider
```python
import scrapy

class MySpider(scrapy.Spider):
    name = 'myspider'
    start_urls = ['http://example.com', 'http://example.org']

    def parse(self, response):
        title = response.xpath('//title/text()').get()
        print(title)
```
#### Scrapy 异步的实现：
- Scrapy 使用 Twisted 的异步网络库来发送 HTTP 请求。请求和响应的处理是异步进行的，Scrapy 会自动调度回调函数来处理响应。
