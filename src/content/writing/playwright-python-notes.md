---
title: "Playwright 使用笔记"
description: "整理 Python Playwright 的安装、浏览器操作、元素定位与常见自动化用法。"
publishedAt: 2025-01-12
type: technical
tags: ["Python", "爬虫"]
draft: false
readingMinutes: 5
---
安装 Playwright
```python
pip install playwright
```
安装 Playwright 后，还需要下载浏览器的依赖：
```python
playwright install
```
## 启动浏览器
```python
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    # 启动 Chromium 浏览器
    browser = p.chromium.launch(headless=False)  # headless=False 表示显示浏览器
    page = browser.new_page()

    # 访问网页
    page.goto('https://example.com')

    # 截图保存到文件
    page.screenshot(path='example.png')

    # 关闭浏览器
    browser.close()
```
## 与页面交互
Playwright 提供了许多方法来模拟用户的浏览器操作，如点击、填写表单、获取文本等。
### 点击按钮
```python
page.click('button#submit')  # 点击指定的按钮
```
### 填写表单
```python
page.fill('input[name="username"]', 'myUsername')  # 填写用户名字段
```
### 获取文本
```python
text = page.text_content('h1')  # 获取 <h1> 标签中的文本
print(text)
```
### 截图
```python
page.screenshot(path='screenshot.png')  # 截取页面截图并保存为文件
```
## 等待元素加载
在页面加载或交互时，可能需要等待某个元素出现，可以使用 `wait_for_selector` 方法：
```python
page.wait_for_selector('div#content')  # 等待页面中出现指定的元素
```
## 使用异步版本
Playwright 提供了同步和异步两种 API。上面展示的是同步 API，你也可以使用异步 API 来执行相同的操作，下面是使用异步方式的示例：
```python
from playwright.async_api import async_playwright
import asyncio

async def run():
    async with async_playwright() as p:
        # 启动 Chromium 浏览器
        browser = await p.chromium.launch(headless=False)
        page = await browser.new_page()

        # 访问网页
        await page.goto('https://example.com')

        # 截图保存到文件
        await page.screenshot(path='example.png')

        # 关闭浏览器
        await browser.close()

# 运行异步函数
asyncio.run(run())
```
## 切换浏览器上下文
Playwright 支持在同一个浏览器实例中创建多个浏览器上下文，这样每个上下文都像是一个独立的浏览器会话。你可以通过这种方式模拟不同的用户行为。
```python
with sync_playwright() as p:
    browser = p.chromium.launch()

    # 创建多个浏览器上下文
    context1 = browser.new_context()
    context2 = browser.new_context()

    # 在不同的上下文中创建不同的页面
    page1 = context1.new_page()
    page2 = context2.new_page()

    page1.goto('https://example.com')
    page2.goto('https://example.org')

    browser.close()
```
## 捕获和处理错误
Playwright 允许你在脚本中捕获和处理错误，避免脚本因为页面元素找不到或者操作失败而崩溃。
```python
try:
    page.click('button#nonexistent')  # 点击不存在的按钮
except Exception as e:
    print(f"Error occurred: {e}")
```
## 使用 Playwright 配合爬虫
用 Playwright 编写爬虫来抓取动态加载的页面内容。例如，抓取页面的标题：
```python
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    page.goto('https://example.com')

    # 获取页面的标题
    title = page.title()
    print(f"Page Title: {title}")

    browser.close()
```
## 浏览器控制：页面控制和网络操作
Playwright 还支持对浏览器进行更深层次的控制，例如修改浏览器的网络条件、模拟网络请求等：
```python
# 修改网络条件，模拟断网
context = browser.new_context(
    offline=True  # 设置浏览器离线模式
)

# 进行其他操作...
```
## 运行 Playwright 自动化测试
```python
from playwright.sync_api import sync_playwright

def test_example():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto('https://example.com')

        assert page.title() == 'Example Domain'  # 验证页面标题

        browser.close()

# 运行测试
test_example()
```
