---
title: "Parsel 使用笔记"
description: "parsel 是一个 Python 库，主要用于 HTML 和 XML 数据的解析，特别适用于 Web 爬虫的开发。"
publishedAt: 2025-01-10
type: technical
tags: ["Python", "爬虫"]
draft: false
readingMinutes: 3
---
`parsel` 是一个 Python 库，主要用于 HTML 和 XML 数据的解析，特别适用于 Web 爬虫的开发。它基于 `lxml` 和 `cssselect`，支持 CSS 选择器和 XPath 查询来提取网页数据。下面是一些基本的使用方法：
### 基本用法
 **从 HTML 字符串中提取数据**
 ```python
 from parsel import Selector

html = '''
<html>
    <head><title>My Page</title></head>
    <body>
        <h1>Welcome to My Page</h1>
        <p class="description">This is a test page.</p>
    </body>
</html>
'''

selector = Selector(text=html)

# 使用 CSS 选择器
title = selector.css('title::text').get()  # 获取 <title>标签的文本
print(title)  # 输出：My Page

# 使用 XPath 选择器
description = selector.xpath('//p[@class="description"]/text()').get()
print(description)  # 输出：This is a test page.
```
**从网页文件中提取数据** 如果你有一个 HTML 文件，想要提取其中的数据，可以这样做：
```python
with open('your_file.html', 'r', encoding='utf-8') as file:
    html = file.read()

selector = Selector(text=html)
heading = selector.css('h1::text').get()
print(heading)
```
**提取多个元素** `parsel` 支持返回多个匹配的元素：
```python
html = '''
<html>
    <body>
        <ul>
            <li>Item 1</li>
            <li>Item 2</li>
            <li>Item 3</li>
        </ul>
    </body>
</html>
'''

selector = Selector(text=html)
items = selector.css('li::text').getall()
print(items)  # 输出：['Item 1', 'Item 2', 'Item 3']
```
**解析链接** 可以用 `parsel` 提取链接（`<a>` 标签的 `href` 属性）：
```python
html = '''
<html>
    <body>
        <a href="https://example.com">Example</a>
    </body>
</html>
'''

selector = Selector(text=html)
link = selector.css('a::attr(href)').get()
print(link)  # 输出：https://example.com
```
### 常用方法总结
- `get()`：提取单个匹配项的文本。
- `getall()`：提取所有匹配项的文本。
- `css(selector)`：使用 CSS 选择器查找元素。
- `xpath(selector)`：使用 XPath 查找元素。
- `::text`：获取元素的文本内容。
- `::attr(attribute_name)`：获取元素的属性值。
