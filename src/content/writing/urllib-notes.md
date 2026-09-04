---
title: "urllib 使用笔记"
description: "整理 Python 标准库 urllib 的请求、参数编码、响应处理与异常捕获。"
publishedAt: 2025-01-07
updatedAt: 2026-09-04
type: technical
tags: ["Python", "爬虫"]
draft: false
readingMinutes: 6
---
### 1. `urllib` 库的基本模块
`urllib` 是 Python 标准库中用于处理 URL（Uniform Resource Locator）的模块，它提供了一系列功能来访问、解析、以及操作 URL。常见的用途包括发起 HTTP 请求、解析 URL、编码和解码查询字符串等。
`urllib` 库包含几个子模块，每个子模块提供不同的功能：
- `urllib.request`：用于打开和读取 URLs（发起 HTTP 请求）。
- `urllib.parse`：用于解析 URL。
- `urllib.error`：包含与请求相关的异常类。
- `urllib.robotparser`：用于解析 robots.txt 文件，确定网站允许哪些爬虫访问。
### 2. 主要功能
#### 2.1 发送 HTTP 请求 (`urllib.request`)
可以使用 `urllib.request` 模块来发送 GET 或 POST 请求。
- **GET 请求**：
```python
import urllib.request

url = 'https://www.example.com'
response = urllib.request.urlopen(url)
html = response.read()
print(html.decode('utf-8'))

```
**POST 请求**：
```python
import urllib.request
import urllib.parse

url = 'https://www.example.com/login'
data = {'username': 'user', 'password': 'pass'}
data = urllib.parse.urlencode(data).encode('utf-8')
request = urllib.request.Request(url, data=data)
response = urllib.request.urlopen(request)
html = response.read()
print(html.decode('utf-8'))
```
#### 2.2 URL 编码与解码 (`urllib.parse`)
URL 编码是指将特殊字符（如空格、中文等）转换为适合 URL 使用的格式。
- **URL 编码**：
```python
import urllib.parse

params = {'name': '张三', 'age': 20}
encoded_params = urllib.parse.urlencode(params)
print(encoded_params)
# 输出：name=%E5%BC%A0%E4%B8%89&age=20
```
**URL 解码**：
```python
encoded_params = 'name=%E5%BC%A0%E4%B8%89&age=20'
decoded_params = urllib.parse.parse_qs(encoded_params)
print(decoded_params)
# 输出：{'name': ['张三'], 'age': ['20']}
```
#### 2.3 URL 解析 (`urllib.parse`)
`urllib.parse` 模块提供了函数来解析 URL，将其分解为各个组件（例如协议、主机、路径等）。
```python
import urllib.parse

url = 'https://www.example.com/path/to/page?name=张三&age=20#section'
parsed_url = urllib.parse.urlparse(url)

print(parsed_url)
# 输出：ParseResult(scheme='https', netloc='www.example.com', path='/path/to/page', params='', query='name=%E5%BC%A0%E4%B8%89&age=20', fragment='section')
```
`urlparse()` 返回一个 `ParseResult` 对象，包含：
- `scheme`: 协议（如 HTTP、HTTPS）
- `netloc`: 主机名（如 `www.example.com`）
- `path`: URL 的路径部分
- `query`: 查询字符串
- `fragment`: 锚点
#### 2.4 合并 URL (`urllib.parse`)
`urllib.parse` 还提供了 `urljoin()` 函数，它可以根据基 URL 来拼接完整的 URL。
```python
import urllib.parse

base_url = 'https://www.example.com/path/'
relative_url = 'to/page'
full_url = urllib.parse.urljoin(base_url, relative_url)

print(full_url)
# 输出：https://www.example.com/path/to/page
```
#### 2.5 解析查询字符串 (`urllib.parse`)
可以使用 `parse_qs()` 和 `parse_qsl()` 来解析查询字符串。
- `parse_qs()` 会将查询字符串解析为字典，值是列表。
- `parse_qsl()` 会将查询字符串解析为元组的列表。
```python
import urllib.parse

query_string = 'name=张三&age=20&name=李四'
qs_dict = urllib.parse.parse_qs(query_string)
qs_list = urllib.parse.parse_qsl(query_string)

print(qs_dict)
# 输出：{'name': ['张三', '李四'], 'age': ['20']}
print(qs_list)
# 输出：[('name', '张三'), ('age', '20'), ('name', '李四')]
```
### 3. 常用异常 (`urllib.error`)
- **URLError**：表示 URL 请求过程中出现的错误。
- **HTTPError**：表示 HTTP 请求的错误（如 404 未找到、500 服务器错误等）。
```python
import urllib.request
from urllib.error import URLError, HTTPError

url = 'https://www.nonexistentwebsite.com'

try:
    response = urllib.request.urlopen(url)
except HTTPError as e:
    print(f'HTTPError: {e.code}')
except URLError as e:
    print(f'URLError: {e.reason}')
```
### 4. 使用 `urllib` 请求时的常见技巧
- 设置请求头（如模拟浏览器请求）：
```python
import urllib.request

url = 'https://www.example.com'
headers = {'User-Agent': 'Mozilla/5.0'}
req = urllib.request.Request(url, headers=headers)
response = urllib.request.urlopen(req)
html = response.read()
print(html.decode('utf-8'))
```
设置超时：
```python
import urllib.request

url = 'https://www.example.com'
try:
    response = urllib.request.urlopen(url, timeout=5)  # 5秒超时
    html = response.read()
    print(html.decode('utf-8'))
except urllib.error.URLError as e:
    print(f"请求失败: {e}")
```
- `urllib` 是处理 URL 操作的强大工具，提供了请求发送、URL 解析、编码解码、查询字符串处理等功能。
- 常用于发起 HTTP 请求、构造和解析 URL、管理 HTTP 头等操作。
