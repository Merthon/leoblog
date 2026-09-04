---
title: "基于 Session 与 Cookie 的模拟登录"
description: "通过浏览器登录某个网站时，服务器会创建一个 Session，并通过 Cookie 存储在客户端（即浏览器）中。"
publishedAt: 2025-01-09
type: technical
tags: ["Python", "爬虫", "模拟登录"]
draft: false
readingMinutes: 4
---
## 原理
通过浏览器登录某个网站时，服务器会创建一个 **Session**，并通过 **Cookie** 存储在客户端（即浏览器）中。每当你访问网站时，浏览器会自动将这些 Cookie 包含在请求中，告知服务器你是一个已经登录的用户，从而获得相应的权限。
在爬虫中模拟登录时，我们需要使用 `requests.Session()` 来维护会话（Session），并通过 `requests.Session().cookies` 来保存和使用 Cookie，以便后续请求能够模拟登录后的行为。
## 步骤
1. 发送 GET 请求获取登录页面
我们需要发送 GET 请求获取登录页面。这是为了获取可能包含的隐藏字段（如 CSRF token）以及初始的 Cookie。
```python
import requests

# 登录页面的 URL
login_url = 'https://example.com/login'

# 创建一个会话对象
session = requests.Session()

# 发送 GET 请求获取登录页面
response = session.get(login_url)

# 打印返回的 HTML 内容，查看页面结构，特别是是否有 CSRF token 等
print(response.text)
```
2. 解析页面中的隐藏字段（例如 CSRF token）
多网站会使用 CSRF token 来防止跨站请求伪造，登录请求中必须包含正确的 CSRF token。我们需要从登录页面中提取这个 token。

这里使用 `BeautifulSoup` 来解析 HTML 页面并提取隐藏字段。
```python
from bs4 import BeautifulSoup

# 解析 HTML 页面
soup = BeautifulSoup(response.text, 'html.parser')

# 假设 CSRF token 存储在一个名为 csrf_token 的 input 标签中
csrf_token = soup.find('input', {'name': 'csrf_token'})['value']
```
3. 构建登录请求的表单数据
我们已经从页面中获取到了 CSRF token，现在我们可以构造一个包含用户名、密码和 CSRF token 的字典作为表单数据。
```python
# 构造登录表单数据
login_data = {
    'username': 'your_username',
    'password': 'your_password',
    'csrf_token': csrf_token,  # 包含 CSRF token
}
```
4. 发送 POST 请求提交登录表单
使用 `requests.Session()` 提交 POST 请求登录，并使用 `session` 对象保持会话，以便后续请求能够带上登录状态。
```python
# 发送 POST 请求进行登录
login_response = session.post(login_url, data=login_data)

# 检查登录是否成功
if login_response.ok:
    print("登录成功")
else:
    print("登录失败")
```
5. 访问需要身份认证的页面
登录成功后，我们就可以使用 `session` 对象继续发送请求，访问需要登录权限的页面。由于 `session` 会自动管理 Cookie，所有后续请求会自动带上登录信息（如 `session_id`）。
```python
# 登录成功后访问受保护的页面
protected_url = 'https://example.com/protected_page'
protected_page = session.get(protected_url)

# 打印受保护页面的内容
print(protected_page.text)
```
## demo
```python
import requests
from bs4 import BeautifulSoup

# 登录页面 URL
login_url = 'https://example.com/login'
# 受保护页面 URL
protected_url = 'https://example.com/protected_page'

# 创建一个会话对象
session = requests.Session()

# 发送 GET 请求获取登录页面
response = session.get(login_url)
if not response.ok:
    print("无法访问登录页面")
    exit()

# 解析页面，提取 CSRF token
soup = BeautifulSoup(response.text, 'html.parser')
csrf_token = soup.find('input', {'name': 'csrf_token'})['value']

# 构造登录表单数据
login_data = {
    'username': 'your_username',
    'password': 'your_password',
    'csrf_token': csrf_token,
}

# 发送 POST 请求进行登录
login_response = session.post(login_url, data=login_data)
if login_response.ok:
    print("登录成功")
else:
    print("登录失败")
    exit()

# 登录成功后，访问受保护页面
protected_page = session.get(protected_url)
if protected_page.ok:
    print("成功访问受保护的页面")
    print(protected_page.text)
else:
    print("访问受保护页面失败")
```
