---
title: "Playwright 使用笔记"
description: "整理 Python Playwright 的安装、定位器、自动等待、浏览器上下文以及同步与异步 API。"
publishedAt: 2025-01-12
updatedAt: 2026-09-04
type: technical
tags: ["Python", "自动化测试"]
draft: false
readingMinutes: 3
---

Playwright 支持 Chromium、Firefox 和 WebKit，适合端到端测试以及经过授权的浏览器自动化。它自带自动等待机制，通常不需要手写固定延时。

## 安装

```bash
python -m pip install -U playwright
python -m playwright install chromium
```

只安装实际需要的浏览器，可以减少本地和 CI 的下载体积。Linux CI 缺少系统依赖时，可按官方说明使用 `install --with-deps`。

## 同步 API

```python
from playwright.sync_api import sync_playwright

with sync_playwright() as playwright:
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context(viewport={"width": 1440, "height": 900})
    page = context.new_page()

    page.goto("https://example.com", wait_until="domcontentloaded")
    print(page.title())
    page.screenshot(path="example.png", full_page=True)

    context.close()
    browser.close()
```

每个 `BrowserContext` 都有独立的 Cookie、缓存和存储状态，适合隔离不同测试用户。

## 使用定位器

优先使用角色、标签或测试 ID，而不是脆弱的 DOM 层级选择器：

```python
page.get_by_label("用户名").fill("leo")
page.get_by_role("button", name="登录").click()
page.get_by_test_id("profile-card").wait_for(state="visible")
```

Locator 会在操作前等待元素满足可见、稳定、可交互等条件。只有确实需要等待非元素事件时，再显式使用相应的等待 API。

## 异步 API

```python
import asyncio
from playwright.async_api import async_playwright

async def main() -> None:
    async with async_playwright() as playwright:
        browser = await playwright.chromium.launch()
        page = await browser.new_page()
        await page.goto("https://example.com")
        print(await page.title())
        await browser.close()

asyncio.run(main())
```

## 用于测试

官方推荐使用 Pytest 插件组织 Python 端到端测试：

```bash
python -m pip install -U pytest-playwright
python -m playwright install chromium
pytest
```

测试中使用 `expect(locator)` 断言，失败信息和自动等待都比裸 `assert` 更适合页面状态验证。

## 使用边界

自动化第三方网站前，应确认服务条款、账号权限、数据授权和请求频率。不要用浏览器自动化绕过验证码、登录保护或其他访问控制。

## 参考

- [Playwright Python 安装指南](https://playwright.dev/python/docs/intro)
- [Playwright Python API](https://playwright.dev/python/docs/api/class-playwright)
