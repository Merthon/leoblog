---
title: "基于 Session 与 Cookie 的模拟登录"
description: "在授权场景中使用 requests.Session、CSRF Token 和 Cookie 维持登录状态。"
publishedAt: 2025-01-09
updatedAt: 2026-09-04
type: technical
tags: ["Python", "认证", "Cookie"]
draft: false
readingMinutes: 3
---

浏览器登录后，服务端通常把 Session ID 放进 Cookie。客户端后续请求自动携带 Cookie，服务端再从会话存储中找到对应的登录状态。`requests.Session` 可以复用连接并管理 Cookie，适合自动化测试自有系统或调用明确授权的页面。

> 不要用这套流程绕过验证码、多因素认证或第三方网站的访问控制。账号、数据和请求频率都需要得到授权。

## 一个完整流程

下面假设登录表单中有名为 `csrf_token` 的隐藏字段。真实字段名和成功条件要以目标系统为准。

```python
import os
import requests
from bs4 import BeautifulSoup

BASE_URL = "https://example.com"
LOGIN_URL = f"{BASE_URL}/login"
PROFILE_URL = f"{BASE_URL}/profile"
TIMEOUT = (3.05, 15)

username = os.environ["APP_USERNAME"]
password = os.environ["APP_PASSWORD"]

with requests.Session() as session:
    login_page = session.get(LOGIN_URL, timeout=TIMEOUT)
    login_page.raise_for_status()

    soup = BeautifulSoup(login_page.text, "html.parser")
    token_field = soup.select_one('input[name="csrf_token"]')
    if token_field is None or not token_field.get("value"):
        raise RuntimeError("login page does not contain a CSRF token")

    login_response = session.post(
        LOGIN_URL,
        data={
            "username": username,
            "password": password,
            "csrf_token": token_field["value"],
        },
        timeout=TIMEOUT,
    )
    login_response.raise_for_status()

    profile = session.get(PROFILE_URL, timeout=TIMEOUT)
    profile.raise_for_status()

    if "登录" in profile.url or "请先登录" in profile.text:
        raise RuntimeError("authentication did not succeed")

    print(profile.text)
```

## 为什么不能只看状态码

很多登录失败页面仍会返回 `200 OK`，也可能经过重定向后落到登录页。判断是否成功，应检查服务端提供的明确结果，例如：

- 返回 JSON 中的认证状态。
- 跳转后的最终 URL。
- 受保护接口是否返回预期用户信息。
- 是否出现约定的会话 Cookie；Cookie 名不能靠猜。

页面上的中文提示只能作为最后手段，因为文案随时可能变化。

## Cookie 的安全属性

这些属性由服务端设置，客户端脚本无法补救错误的服务端设计：

- `Secure`：只通过 HTTPS 发送。
- `HttpOnly`：禁止前端 JavaScript 读取会话 Cookie。
- `SameSite=Strict` 或 `Lax`：降低跨站请求携带 Cookie 的机会。
- `__Host-` 前缀：要求 `Secure`、`Path=/` 且不能设置 `Domain`。

服务端还应在登录后更新 Session ID，在退出登录、超时或密码修改后使旧会话失效。

## 参考

- [Requests Session 文档](https://requests.readthedocs.io/en/latest/user/advanced/#session-objects)
- [OWASP Session Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)
