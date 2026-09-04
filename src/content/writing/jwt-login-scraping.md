---
title: "基于 JWT 的模拟登录"
description: "在获得授权的 API 客户端中获取、使用和刷新 JWT，并说明令牌存储与验证边界。"
publishedAt: 2025-01-09
updatedAt: 2026-09-04
type: technical
tags: ["Python", "认证", "JWT"]
draft: false
readingMinutes: 4
---

JWT 是一种令牌格式，不等于完整的认证方案。常见 JWT 由 Header、Payload 和 Signature 三部分组成。Payload 默认只是 Base64URL 编码，**不是加密数据**，不要放密码、密钥或不必要的个人信息。

> 下面的客户端示例只用于你拥有或明确获准自动访问的 API。验证码、多因素认证和访问限制属于安全边界，不应绕过。

## 服务端必须验证什么

收到 JWT 后，服务端不能只解析 Payload，还要验证：

- 签名算法是否在明确的允许列表中；不能相信令牌自己声明的任意算法。
- 签名、过期时间 `exp`、生效时间 `nbf`。
- 签发方 `iss` 和受众 `aud` 是否与当前系统一致。
- 账号、会话或令牌是否已经撤销，尤其是高风险操作。

Access Token 应短期有效。Refresh Token 生命周期更长，需要轮换、撤销与重放检测。

## 浏览器中的存储

不要把 Session ID、Access Token 或 Refresh Token 长期放在 `localStorage` 或 `sessionStorage`；同源脚本一旦发生 XSS，就能直接读取这些值。浏览器应用通常更适合使用 `Secure`、`HttpOnly`、`SameSite` Cookie，或者由 BFF（Backend for Frontend）代管令牌。

如果使用 Cookie，仍需根据请求模型处理 CSRF。`SameSite` 是纵深防御，不替代所有 CSRF 防护。

## Python API 客户端示例

凭据从环境变量读取，令牌只保存在当前进程内：

```python
import os
import requests

BASE_URL = "https://api.example.com"
USERNAME = os.environ["APP_USERNAME"]
PASSWORD = os.environ["APP_PASSWORD"]
TIMEOUT = (3.05, 15)

with requests.Session() as session:
    login_response = session.post(
        f"{BASE_URL}/login",
        json={"username": USERNAME, "password": PASSWORD},
        timeout=TIMEOUT,
    )
    login_response.raise_for_status()

    payload = login_response.json()
    access_token = payload["access_token"]

    response = session.get(
        f"{BASE_URL}/profile",
        headers={"Authorization": f"Bearer {access_token}"},
        timeout=TIMEOUT,
    )
    response.raise_for_status()
    print(response.json())
```

不要打印令牌，也不要把令牌写进异常信息、URL 查询参数或公开日志。

## 刷新令牌

刷新接口和字段名由服务端决定。客户端应在收到明确的 401 响应后尝试刷新一次，成功后替换旧令牌；再次失败就回到登录流程，避免无限重试。

```python
def refresh_access_token(session: requests.Session, refresh_token: str) -> str:
    response = session.post(
        f"{BASE_URL}/token/refresh",
        json={"refresh_token": refresh_token},
        timeout=TIMEOUT,
    )
    response.raise_for_status()
    return response.json()["access_token"]
```

Refresh Token 比 Access Token 更敏感。真实系统应支持轮换，并在使用新令牌后立即废弃旧令牌。

## 参考

- [OWASP Session Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)
- [OWASP HTML5 Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/HTML5_Security_Cheat_Sheet.html)
