---
title: "Selenium 使用笔记"
description: "使用 Selenium 4 驱动浏览器，整理自动管理驱动、元素定位、显式等待和无头模式。"
publishedAt: 2025-01-12
updatedAt: 2026-09-04
type: technical
tags: ["Python", "自动化测试"]
draft: false
readingMinutes: 4
---

Selenium WebDriver 适合浏览器端到端测试，也能用于经过授权的网页自动化。现代 Selenium 已内置 Selenium Manager，通常不需要手动下载 ChromeDriver。

## 安装

```bash
python -m pip install -U selenium
```

## 基本示例

```python
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait

options = webdriver.ChromeOptions()
driver = webdriver.Chrome(options=options)

try:
    driver.get("https://www.selenium.dev/selenium/web/web-form.html")

    text_box = WebDriverWait(driver, 10).until(
        EC.visibility_of_element_located((By.NAME, "my-text"))
    )
    text_box.send_keys("Selenium")
    driver.find_element(By.CSS_SELECTOR, "button").click()

    message = WebDriverWait(driver, 10).until(
        EC.visibility_of_element_located((By.ID, "message"))
    )
    print(message.text)
finally:
    driver.quit()
```

`webdriver.Chrome()` 会在没有显式提供驱动时调用 Selenium Manager。旧写法 `webdriver.Chrome(executable_path=...)` 已经不适合 Selenium 4 的当前 API。

## 定位元素

优先使用稳定、表达语义的属性：

```python
driver.find_element(By.ID, "submit")
driver.find_element(By.NAME, "email")
driver.find_element(By.CSS_SELECTOR, '[data-testid="save"]')
driver.find_element(By.XPATH, '//button[normalize-space()="保存"]')
```

XPath 很强，但依赖层级很深的 XPath 容易随页面结构变化而失效。

## 等待策略

显式等待只作用于具体条件，比到处添加固定 `sleep()` 更稳定：

```python
button = WebDriverWait(driver, 10).until(
    EC.element_to_be_clickable((By.ID, "submit"))
)
button.click()
```

不要混用很长的隐式等待和显式等待，否则实际超时时间会变得难以判断。

## 无头模式

```python
from selenium import webdriver

options = webdriver.ChromeOptions()
options.add_argument("--headless=new")
options.add_argument("--window-size=1440,900")

driver = webdriver.Chrome(options=options)
try:
    driver.get("https://example.com")
    print(driver.title)
finally:
    driver.quit()
```

在 CI 中仍要保存失败截图和浏览器日志。无头模式与真实桌面环境可能存在字体、窗口尺寸或权限差异。

## 使用边界

自动化第三方网站前，应确认服务条款、账号权限、数据授权和请求频率。验证码和访问限制属于站点的安全边界，不应尝试绕过。

## 参考

- [Selenium WebDriver 入门](https://www.selenium.dev/documentation/webdriver/getting_started/)
- [Selenium Manager](https://www.selenium.dev/documentation/selenium_manager/)
