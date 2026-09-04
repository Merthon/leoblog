---
title: "HTTPX 使用笔记"
description: "httpx 是一个用于 Python 的高性能 HTTP 客户端库，支持异步操作，是 requests 的现代替代品，功能更强大，特别适合处理异步任务和 HTTP/2。"
publishedAt: 2025-01-05
type: technical
tags: ["Python", "爬虫"]
draft: false
readingMinutes: 4
---
`httpx` 是一个用于 Python 的高性能 HTTP 客户端库，支持异步操作，是 `requests` 的现代替代品，功能更强大，特别适合处理异步任务和 HTTP/2。
### **基本用法**
#### **1. 同步请求**
`httpx` 的用法类似 `requests`，可以轻松发起同步 HTTP 请求。
```python
import httpx

response = httpx.get('https://jsonplaceholder.typicode.com/posts/1')
print(response.status_code)  # 状态码
print(response.json())       # 返回 JSON 数据
```
支持的基本方法：
- `httpx.get(url, ...)`
- `httpx.post(url, ...)`
- `httpx.put(url, ...)`
- `httpx.delete(url, ...)`
#### **2. 异步请求**
`httpx` 支持异步操作，通过 `async` 和 `await` 发起请求。
```python
import httpx
import asyncio

async def fetch_data():
    async with httpx.AsyncClient() as client:
        response = await client.get('https://jsonplaceholder.typicode.com/posts/1')
        print(response.json())

asyncio.run(fetch_data())
```
### **高级用法**

#### **1. 设置超时**
```python
response = httpx.get('https://example.com', timeout=10.0)
```
2.设置自定义 Headers
```python
headers = {'User-Agent': 'MyApp/1.0'}
response = httpx.get('https://example.com', headers=headers)
```
3.发送 JSON 数据
```python
payload = {"key": "value"}
response = httpx.post('https://httpbin.org/post', json=payload)
print(response.json())
```
4.使用代理
```python
proxies = {
    "http": "http://127.0.0.1:8080",
    "https": "http://127.0.0.1:8080",
}
response = httpx.get('https://example.com', proxies=proxies)
```
5.处理 Cookies
```python
cookies = {"session_id": "123456"}
response = httpx.get('https://example.com', cookies=cookies)
```
6.发送文件
```python
files = {'file': ('example.txt', open('example.txt', 'rb'))}
response = httpx.post('https://httpbin.org/post', files=files)
```
### **异步并发请求**

利用 `httpx.AsyncClient` 和 `asyncio.gather` 实现高效并发：
```python
import httpx
import asyncio

async def fetch(url):
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        return response.json()

async def main():
    urls = [
        'https://jsonplaceholder.typicode.com/posts/1',
        'https://jsonplaceholder.typicode.com/posts/2',
        'https://jsonplaceholder.typicode.com/posts/3',
    ]
    results = await asyncio.gather(*(fetch(url) for url in urls))
    print(results)

asyncio.run(main())
```
### **HTTP/2 支持**

`httpx` 支持 HTTP/2，无需额外设置：
```python
async with httpx.AsyncClient(http2=True) as client:
    response = await client.get('https://http2.pro/')
    print(response.http_version)  # 应显示 'HTTP/2'
```
