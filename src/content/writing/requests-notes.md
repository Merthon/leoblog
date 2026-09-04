---
title: "Requests 使用笔记"
description: "整理 Requests 的会话复用、超时、状态检查、JSON、文件上传和代理配置。"
publishedAt: 2025-01-06
updatedAt: 2026-09-04
type: technical
tags: ["Python", "HTTP"]
draft: false
readingMinutes: 4
---

Requests 提供简洁的同步 HTTP API。它默认**没有请求超时**，因此正式代码必须显式设置超时，并检查错误状态。

## 基本请求

```python
import requests

response = requests.get(
    "https://httpbin.org/get",
    params={"page": 2},
    timeout=(3.05, 15),
)
response.raise_for_status()

print(response.status_code)
print(response.headers.get("content-type"))
print(response.json())
```

`timeout=(3.05, 15)` 分别设置连接超时和读取超时。它不是整个下载任务的绝对截止时间。

## 复用 Session

同一服务有多次请求时复用 `Session`，可以保留 Cookie 和连接池：

```python
import requests

with requests.Session() as session:
    session.headers.update({"User-Agent": "leo-notes/1.0"})

    first = session.get("https://httpbin.org/cookies/set/theme/dark", timeout=10)
    first.raise_for_status()

    second = session.get("https://httpbin.org/cookies", timeout=10)
    second.raise_for_status()
    print(second.json())
```

User-Agent 应真实标识客户端。第三方服务如果提供格式要求或联系信息字段，应按其规范填写。

## 表单与 JSON

```python
form_response = requests.post(
    "https://httpbin.org/post",
    data={"name": "Leo"},
    timeout=10,
)
form_response.raise_for_status()

json_response = requests.post(
    "https://httpbin.org/post",
    json={"name": "Leo"},
    timeout=10,
)
json_response.raise_for_status()
```

`data=` 默认用于表单编码，`json=` 会序列化对象并设置 JSON 内容类型。

## 异常处理

```python
import requests

try:
    response = requests.get("https://httpbin.org/status/503", timeout=10)
    response.raise_for_status()
except requests.Timeout:
    print("请求超时")
except requests.HTTPError as error:
    print(f"HTTP 错误：{error.response.status_code}")
except requests.RequestException as error:
    print(f"网络错误：{error}")
```

不要无条件重试。401、403、404 等通常不是临时故障；429 和部分 5xx 可以按服务端要求，在有限次数内指数退避。

## 上传文件

```python
with open("example.txt", "rb") as file:
    response = requests.post(
        "https://httpbin.org/post",
        files={"file": ("example.txt", file, "text/plain")},
        timeout=30,
    )
    response.raise_for_status()
```

上下文管理器保证异常发生时文件仍会关闭。

## 认证信息

```python
import os
import requests

response = requests.get(
    "https://api.example.com/profile",
    headers={"Authorization": f"Bearer {os.environ['API_TOKEN']}"},
    timeout=10,
)
response.raise_for_status()
```

Token 不应出现在 URL、源码、截图或日志中。Basic Auth 也必须运行在 HTTPS 上。

## 代理

```python
proxies = {
    "http": "http://127.0.0.1:8080",
    "https": "http://127.0.0.1:8080",
}

response = requests.get(
    "https://httpbin.org/ip",
    proxies=proxies,
    timeout=10,
)
response.raise_for_status()
```

只使用可信代理。代理配置不应用来绕过访问控制、封禁或服务条款。

## 参考

- [Requests 快速入门](https://requests.readthedocs.io/en/latest/user/quickstart/)
- [Requests 高级用法](https://requests.readthedocs.io/en/latest/user/advanced/)
