---
title: "BeautifulSoup 使用笔记"
description: "BeautifulSoup 是一个非常流行的 Python 库，用于从 HTML 或 XML 文档中提取数据。"
publishedAt: 2025-01-07
type: technical
tags: ["Python", "爬虫"]
draft: false
readingMinutes: 3
---
`BeautifulSoup` 是一个非常流行的 Python 库，用于从 HTML 或 XML 文档中提取数据。它常用于网页爬取（web scraping）项目中，特别是在处理不规则的网页结构时，具有很好的灵活性。它可以与 `requests` 或 `urllib` 配合使用来获取网页内容，然后用来解析和提取所需的数据。
基本用法
导入库并下载网页内容：
```python
import requests
from bs4 import BeautifulSoup

# 获取网页内容
url = 'http://example.com'
response = requests.get(url)

# 创建 BeautifulSoup 对象
soup = BeautifulSoup(response.content, 'html.parser')
```
查找元素：
1.通过标签名查找:
```python
# 获取第一个 <a> 标签
a_tag = soup.find('a')
print(a_tag)
```
2.**通过类名查找**：
```python
# 获取具有特定 class 的标签
div_tag = soup.find('div', class_='class-name')
print(div_tag)
```
3.**通过 id 查找**：
```python
# 获取 id 为 specific-id 的标签
element = soup.find(id='specific-id')
print(element)
```
查找多个元素：
```python
# 获取所有 <a> 标签
all_a_tags = soup.find_all('a')
for tag in all_a_tags:
    print(tag)
```
获取标签的属性：
```python
# 获取 <a> 标签的 href 属性
href = a_tag.get('href')
print(href)
```
提取标签的文本内容：
```python
# 获取 <a> 标签的文本
text = a_tag.get_text()
print(text)
```
使用 CSS 选择器查找元素：
```python
# 使用 CSS 选择器查找
selected = soup.select('div.class-name a')
for item in selected:
    print(item)
```
遍历父子关系：
```python
# 获取父元素
parent = a_tag.find_parent()

# 获取所有子元素
children = a_tag.find_all_next()
for child in children:
    print(child)
```
示例：爬取页面中的所有链接
```python
import requests
from bs4 import BeautifulSoup

# 获取网页内容
url = 'http://example.com'
response = requests.get(url)

# 创建 BeautifulSoup 对象
soup = BeautifulSoup(response.content, 'html.parser')

# 获取所有 <a> 标签的 href 属性
for a_tag in soup.find_all('a', href=True):
    print(a_tag['href'])
```
### 其他有用的功能

- **获取标签的属性并修改**：
```python
# 获取并修改属性
a_tag['href'] = 'http://new-url.com'
```
- **清除标签**：
```python
# 删除一个标签
a_tag.decompose()
```
