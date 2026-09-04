---
title: "Requests 使用笔记"
description: "requests 是 Python 中最流行的 HTTP 请求库之一，简化了 HTTP 请求的发送和响应处理。"
publishedAt: 2025-01-06
updatedAt: 2025-01-14
type: technical
tags: ["Python", "爬虫"]
draft: false
readingMinutes: 5
---
`requests` 是 Python 中最流行的 HTTP 请求库之一，简化了 HTTP 请求的发送和响应处理。
### 1. 发送 GET 请求

`requests.get()` 用于发送 GET 请求。它从指定的 URL 获取数据。
```python
import requests

response = requests.get('https://httpbin.org/get')

# 获取响应内容
print(response.text)

# 获取 JSON 数据（如果有）
print(response.json())

# 查看响应状态码
print(response.status_code)

# 查看响应头
print(response.headers)
```
### 2. 发送 POST 请求
`requests.post()` 用于发送 POST 请求，通常用于向服务器提交数据。
```python
import requests

data = {'key': 'value'}
response = requests.post('https://httpbin.org/post', data=data)

print(response.text)
```
可以通过 `json` 参数发送 JSON 数据：
```python
import requests

json_data = {'name': 'John', 'age': 30}
response = requests.post('https://httpbin.org/post', json=json_data)

print(response.text)
```
### 3. 添加请求头
有时需要传递特定的请求头（比如 User-Agent 或 Authorization 等）。可以通过 `headers` 参数传递自定义的头信息。
```python
import requests

headers = {'User-Agent': 'my-app'}
response = requests.get('https://httpbin.org/headers', headers=headers)

print(response.json())
```
### 4. 发送带参数的请求
你可以通过 `params` 参数传递 URL 查询参数。
```python
import requests

params = {'search': 'python', 'page': 2}
response = requests.get('https://httpbin.org/get', params=params)

print(response.text)
```
### 5. 处理响应
- `response.text`：获取响应的内容，通常是字符串。
- `response.json()`：如果响应是 JSON 格式，可以直接调用该方法将其解析为 Python 对象。
- `response.status_code`：获取响应的 HTTP 状态码。
- `response.headers`：获取响应头，返回一个字典。
- `response.cookies`：获取响应的 cookies。
### 6. 处理异常
`requests` 会抛出异常，例如网络错误、超时等。可以使用 `try-except` 来捕获异常。
```python
import requests

try:
    response = requests.get('https://httpbin.org/delay/10', timeout=5)
    print(response.text)
except requests.exceptions.Timeout:
    print('请求超时')
except requests.exceptions.RequestException as e:
    print(f'请求发生错误: {e}')
```
### 7. 会话管理
`requests.Session()` 可以帮助你在多个请求之间保持会话（比如自动保存 cookies、持久化某些参数等）。
```python
import requests

session = requests.Session()

# 使用 session 发起请求
response = session.get('https://httpbin.org/cookies/set/sessioncookie/123456')
print(response.text)

# 在同一个 session 里发起请求
response = session.get('https://httpbin.org/cookies')
print(response.json())
```
### 8. 上传文件
可以使用 `files` 参数上传文件。
```python
import requests

files = {'file': open('example.txt', 'rb')}
response = requests.post('https://httpbin.org/post', files=files)

print(response.text)
files['file'].close()
```
### 9. 认证
`requests` 支持多种认证方式，如基本认证（Basic Auth）和 OAuth2。
```python
from requests.auth import HTTPBasicAuth

response = requests.get('https://httpbin.org/basic-auth/user/pass', auth=HTTPBasicAuth('user', 'pass'))
print(response.text)
```
### 10. 代理设置
如果你需要通过代理发送请求，可以使用 `proxies` 参数。
```python
import requests

proxies = {
    'http': 'http://10.10.1.10:3128',
    'https': 'https://10.10.1.10:1080',
}

response = requests.get('https://httpbin.org/ip', proxies=proxies)
print(response.json())
```
