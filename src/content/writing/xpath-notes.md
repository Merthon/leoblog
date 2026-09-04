---
title: "XPath 使用笔记"
description: "XPath（XML Path Language）是一种用于在XML文档中查找和筛选信息的语言，它常用于爬虫开发中，帮助我们定位网页中的元素。"
publishedAt: 2025-01-12
type: technical
tags: ["XPath"]
draft: false
readingMinutes: 4
---
XPath（XML Path Language）是一种用于在XML文档中查找和筛选信息的语言，它常用于爬虫开发中，帮助我们定位网页中的元素。XPath 是 W3C 标准，它支持路径表达式来选择 XML 或 HTML 文档中的节点。
## 基本语法
XPath 通过路径表达式来查找节点，基本的语法规则如下：
- `/`：从根节点开始选取。
- `//`：选取文档中所有符合条件的节点，而不考虑它们的位置。
- `.`：当前节点。
- `..`：父节点。
- `@`：选择属性。
#### 常见的 XPath 表达式
1. **选择根节点**：
    - `/`: 选取文档的根节点。
    - 例如：`/html` 选取 `<html>` 元素。
2. **选择某个子节点**：
    - `/parent/child`: 选取父节点下的子节点。
    - 例如：`/html/body/div` 选取 `<div>` 元素。
3. **选择所有子节点**：
    - `/parent/*`: 选取父节点下的所有子节点。
    - 例如：`/html/body/*` 选取 `<body>` 下的所有子元素。
4. **选择所有符合条件的节点（不管位置）**：
    - `//element`: 在整个文档中查找所有的 `element` 节点。
    - 例如：`//div` 选取所有的 `<div>` 元素。
5. **选择属性**：
    - `@attribute`: 选取某个节点的属性。
    - 例如：`//a/@href` 选取所有 `<a>` 标签的 `href` 属性。
6. **选择带特定属性的节点**：
    - `//element[@attribute='value']`: 选择属性为特定值的元素。
    - 例如：`//a[@class='link']` 选取所有 `class` 为 `link` 的 `<a>` 标签。
7. **使用逻辑运算符**：
    - `and`: 用于多个条件的组合。
    - `or`: 或者关系。
    - 例如：`//a[@class='link' and @href]` 选取所有 `class` 为 `link` 并且有 `href` 属性的 `<a>` 标签。
8. **选择文本内容**：
    - `text()`: 选取文本内容。
    - 例如：`//h1/text()` 选取所有 `<h1>` 标签中的文本。
9. **选择特定位置的元素**：
    - `[index]`: 用来选择特定位置的元素，索引从 1 开始。
    - 例如：`//ul/li[1]` 选取第一个 `<li>` 元素。
    - `last()`: 选择最后一个元素。
    - 例如：`//ul/li[last()]` 选取最后一个 `<li>` 元素。
实例：
```html
<html>
  <body>
    <h1>Example Title</h1>
    <div class="content">
      <p>First paragraph.</p>
      <p class="special">Second paragraph.</p>
      <p>Third paragraph.</p>
    </div>
    <a href="http://example.com">Link</a>
  </body>
</html>
```
选取所有的 `<p>` 标签：`//p`
选取具有 `class='special'` 的 `<p>` 标签：`//p[@class='special']`
选取 `<h1>` 中的文本内容：`//h1/text()`
选取 `<a>` 标签的 `href` 属性：`//a/@href`
选取 `div` 标签中的第一个 `<p>` 标签：`//div/p[1]`
### 在 Python 中使用 XPath
在 Python 中，常用的库有 `lxml` 和 `BeautifulSoup`，其中 `lxml` 提供了对 XPath 的支持。
使用 `lxml` 库
```python
from lxml import html

# 假设你已经获得了网页内容，并将其作为字符串
page_content = """
<html>
  <body>
    <h1>Example Title</h1>
    <div class="content">
      <p>First paragraph.</p>
      <p class="special">Second paragraph.</p>
      <p>Third paragraph.</p>
    </div>
    <a href="http://example.com">Link</a>
  </body>
</html>
"""

tree = html.fromstring(page_content)

# 使用 XPath 获取所有 <p> 标签的文本
p_texts = tree.xpath('//p/text()')
print(p_texts)  # 输出：['First paragraph.', 'Second paragraph.', 'Third paragraph.']

# 使用 XPath 获取 class 为 'special' 的 <p> 标签的文本
special_p = tree.xpath("//p[@class='special']/text()")
print(special_p)  # 输出：['Second paragraph.']

# 使用 XPath 获取 <a> 标签的 href 属性
href = tree.xpath('//a/@href')
print(href)  # 输出：['http://example.com']

```
