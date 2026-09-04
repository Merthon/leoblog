---
title: "Selenium 使用笔记"
description: "Selenium 是一个强大的 Web 自动化测试工具，广泛用于自动化浏览器操作。"
publishedAt: 2025-01-12
type: technical
tags: ["Python", "爬虫"]
draft: false
readingMinutes: 4
---
Selenium 是一个强大的 Web 自动化测试工具，广泛用于自动化浏览器操作。它支持多种浏览器，并可以与编程语言如 Python、Java、C# 等配合使用。
## 安装
首先，你需要安装 Selenium 库。可以通过 pip 安装：
```python
pip install selenium
```
## 下载WebDriver
Selenium 需要使用 WebDriver 来驱动浏览器。不同的浏览器需要不同的 WebDriver
下载对应浏览器的 WebDriver，并确保 WebDriver 可执行文件在你的系统路径中。
## 基本使用
Selenium 的一个简单示例，展示如何使用 Python 驱动浏览器打开网页，查找元素并执行操作。
```python
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys

# 设置 WebDriver 路径（如果 WebDriver 不在 PATH 中）
driver = webdriver.Chrome(executable_path='/path/to/chromedriver')

# 打开网页
driver.get('https://www.google.com')

# 查找搜索框元素
search_box = driver.find_element(By.NAME, 'q')

# 向搜索框输入文本
search_box.send_keys('Selenium')

# 模拟按下 Enter 键
search_box.send_keys(Keys.RETURN)

# 等待一段时间，等待页面加载完成
driver.implicitly_wait(5)  # 等待最多 5 秒

# 获取页面标题并打印
print(driver.title)

# 关闭浏览器
driver.quit()
```
## 常用操作
1. 查找元素
- `find_element(By.ID, 'id')`：通过 ID 查找元素
- `find_element(By.NAME, 'name')`：通过名称查找元素
- `find_element(By.CLASS_NAME, 'class')`：通过类名查找元素
- `find_element(By.XPATH, 'xpath')`：通过 XPath 查找元素
- `find_element(By.CSS_SELECTOR, 'css_selector')`：通过 CSS 选择器查找元素
2. 元素操作
- `send_keys('text')`：向输入框中输入文本
- `click()`：点击元素
- `clear()`：清除输入框中的文本
3. 等待
- `driver.implicitly_wait(seconds)`：隐式等待，查找元素时如果没有立即找到，会等待指定的时间后再抛出异常。
- `WebDriverWait(driver, timeout).until(condition)`：显式等待，直到某个条件成立。
## 处理弹窗和切换窗口
### 处理 JavaScript 弹窗
```python
alert = driver.switch_to.alert
alert.accept()  # 接受弹窗
alert.dismiss()  # 关闭弹窗
```
### 切换窗口
```python
# 获取所有窗口句柄
windows = driver.window_handles

# 切换到新的窗口
driver.switch_to.window(windows[1])

# 切换回原来的窗口
driver.switch_to.window(windows[0])
```
## 使用 Headless 模式
Selenium 可以在不显示浏览器窗口的情况下运行，这被称为无头模式（Headless Mode）。对于大多数任务，尤其是爬虫，使用无头模式非常有用。
```python
from selenium.webdriver.chrome.options import Options

options = Options()
options.headless = True
driver = webdriver.Chrome(executable_path='/path/to/chromedriver', options=options)

# 继续执行其他操作
```

## WebDriver 管理器
如果不想手动下载 WebDriver，也可以使用 `webdriver_manager` 库自动下载 WebDriver：
```python
pip install webdriver-manager
```
然后在代码中使用：
```python
from webdriver_manager.chrome import ChromeDriverManager
from selenium import webdriver

driver = webdriver.Chrome(ChromeDriverManager().install())
```
这将自动下载并安装适合你浏览器版本的 WebDriver。
