---
title: "Ajax 数据爬取"
description: "分析浏览器中的 Ajax 请求，并用 Requests、Selenium 或 Scrapy 读取动态数据。"
publishedAt: 2025-01-11
updatedAt: 2026-09-04
type: technical
tags: ["Python"]
draft: false
readingMinutes: 5
---
Ajax 数据爬取是一个常见的任务，特别是当目标网站使用 JavaScript 动态加载数据时。通常，爬虫需要模拟浏览器的行为，去获取这些通过 Ajax 请求加载的内容。
## 什么是 Ajax 请求？
Ajax（Asynchronous JavaScript and XML）是指一种在不刷新页面的情况下，向服务器请求数据并更新页面的技术。它常用于单页应用（SPA）中，能够实现页面局部刷新，提高用户体验。
## Ajax 请求的工作原理
当你浏览一个网站时，如果页面没有完全刷新，而是动态加载数据，通常是通过 Ajax 实现的。以下是常见的流程：
- 浏览器通过 JavaScript 发送一个异步 HTTP 请求（如 GET 或 POST 请求）。
- 服务器响应数据，通常是 JSON 格式的内容。
- 浏览器接收到数据后，利用 JavaScript 动态更新页面中的内容。
## 如何爬取 Ajax 加载的数据？
### 分析网络请求
要抓取 Ajax 请求返回的数据，首先需要分析网页中的网络请求。你可以使用浏览器的开发者工具（DevTools）来捕获这些请求：

- 打开浏览器（例如 Chrome），右键点击页面选择“检查”或按 `F12` 键。
- 转到“Network”标签。
- 刷新页面并观察发出的网络请求，尤其是 `XHR`（XMLHttpRequest）类型的请求，这些通常是 Ajax 请求。
- 查看请求的 URL 和请求头信息，找出是否有相关的参数或者身份认证信息。
### 发送相同的请求
一旦你知道了 Ajax 请求的 URL、请求参数和请求头，你可以使用爬虫工具（如 `requests` 或 `Selenium`）模拟这些请求。

- 使用 **requests** 模拟请求：
```python
import requests

url = "https://example.com/ajax-data"
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36',
    # 其他请求头，可能包括 cookie 或 Authorization
}
params = {
    'key': 'value',  # 请求的查询参数
}

response = requests.get(url, headers=headers, params=params, timeout=10)
response.raise_for_status()
data = response.json()  # 如果返回的是 JSON 格式的数据
print(data)
```
- 使用 **Selenium** 动态加载数据：
```python
from selenium import webdriver
from selenium.webdriver.common.by import By

# 初始化 WebDriver（这里使用 Chrome）
driver = webdriver.Chrome()
driver.get("https://example.com")

# 等待 Ajax 请求完成（可以根据页面的某个元素来等待）
driver.implicitly_wait(10)  # 等待最多10秒

# 查找已加载的动态内容
content = driver.find_element(By.ID, 'ajax-content')
print(content.text)

driver.quit()
```
### 模拟 Cookie 和 Session
如果请求需要身份认证（比如需要登录），你需要模拟登录并获取有效的 Session 或 Cookie。你可以通过浏览器开发者工具查看这些 Cookie 信息，然后在爬虫请求中使用它们：
```python
cookies = {
    'sessionid': 'your-session-id',
    'csrftoken': 'your-csrf-token'
}
response = requests.get(url, headers=headers, cookies=cookies, timeout=10)
response.raise_for_status()
```
### 处理返回数据
Ajax 请求返回的数据通常是 JSON 格式，你可以使用 Python 的 `json` 模块进行解析：
```python
import json

data = json.loads(response.text)
# 或者直接使用 response.json() 方法
```
## 使用 Scrapy 爬取 Ajax 数据
Scrapy 是一个功能强大的爬虫框架，它也支持爬取 Ajax 请求返回的数据。你可以使用 `scrapy.Request` 模拟 Ajax 请求：
```python
import scrapy

class AjaxSpider(scrapy.Spider):
    name = 'ajax_spider'

    def start_requests(self):
        url = 'https://example.com/ajax-data'
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36',
            # 其他请求头
        }
        yield scrapy.Request(url, headers=headers, callback=self.parse)

    def parse(self, response):
        data = response.json()  # 获取 Ajax 返回的 JSON 数据
        # 处理数据
        for item in data['items']:
            yield {'title': item['title'], 'url': item['url']}
```
## 常见问题
- **访问限制**：遇到验证码、401、403 或 429 时，应停止请求并检查授权、服务条款和限流规则，不要通过代理或伪装绕过限制。
- **动态内容加载**：有些网站通过不断滚动或分页加载内容。你需要模拟滚动行为，或者发送带有分页参数的 Ajax 请求。
采集 Ajax 数据的关键是找到页面实际调用的公开接口，理解请求参数和响应结构，并在授权范围内稳定调用。
