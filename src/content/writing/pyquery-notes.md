---
title: "pyquery 使用笔记"
description: "使用 pyquery 以类 jQuery 语法解析 HTML、选择元素并读取属性。"
publishedAt: 2025-01-11
updatedAt: 2026-09-04
type: technical
tags: ["Python"]
draft: false
readingMinutes: 3
---
`pyquery` 是一个用于网页抓取和解析的 Python 库，提供了一种类似 jQuery 的语法。它可以帮助你方便地选择 HTML 元素并进行操作。下面是 `pyquery` 的基本用法：
基本用法
解析 HTML 字符串：
```python
from pyquery import PyQuery as pq

# HTML 示例
html = """
<html>
    <body>
        <div class="content">
            <p>这是第一段内容</p>
            <p>这是第二段内容</p>
        </div>
        <a href="http://example.com">链接1</a>
        <a href="http://example.org">链接2</a>
    </body>
</html>
"""

# 解析 HTML 字符串
doc = pq(html)

# 获取所有 <p> 标签中的文本
print(doc('p').text())  # 输出：这是第一段内容这是第二段内容

# 获取所有链接
for link in doc('a'):
    print(pq(link).attr('href'))  # 输出链接的 href 属性
```
解析 HTML 文件
```python
from pyquery import PyQuery as pq

# 解析本地 HTML 文件
doc = pq(filename="example.html")

# 获取 <h1> 标签内容
print(doc('h1').text())
```
#### 选择元素

使用 CSS 选择器来选择 HTML 元素，就像 jQuery 一样：
```python
# 获取所有的 div 标签
divs = doc('div')

# 获取 class 为 content 的 div
content_div = doc('.content')

# 获取 id 为 specific 的元素
specific_element = doc('#specific')
```
获取和修改元素属性
```python
# 获取链接的 href 属性
link = doc('a')
print(link.attr('href'))  # 获取链接地址

# 修改元素的属性
doc('a').attr('href', 'http://newexample.com')
print(doc('a').attr('href'))  # 输出新的链接地址
```
遍历元素
```python
# 遍历所有的 <a> 标签
for a in doc('a'):
    print(pq(a).text(), pq(a).attr('href'))
```
使用 `pyquery` 进行网页抓取
```python
import requests
from pyquery import PyQuery as pq

# 发送请求获取网页内容
response = requests.get('https://example.com', timeout=10)
response.raise_for_status()
html = response.text

# 解析网页
doc = pq(html)

# 获取页面中所有的链接
for link in doc('a'):
    print(pq(link).text(), pq(link).attr('href'))
```
