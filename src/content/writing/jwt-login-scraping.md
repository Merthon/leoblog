---
title: "基于 JWT 的模拟登录"
description: "JWT（JSON Web Token） 的模拟登录通常用于无状态认证系统，尤其是在 RESTful API 和现代 web 应用中，广泛用于替代传统的基于 Session 的身份验证机制。"
publishedAt: 2025-01-09
type: technical
tags: ["Python", "爬虫", "模拟登录"]
draft: false
readingMinutes: 6
---
**JWT（JSON Web Token）** 的模拟登录通常用于无状态认证系统，尤其是在 RESTful API 和现代 web 应用中，广泛用于替代传统的基于 Session 的身份验证机制。JWT 是一种轻量级的认证机制，通常由服务器在用户登录时生成，并作为认证凭据返回给客户端。客户端通过存储和发送 JWT 来进行后续的身份验证。
## JWT 的基本原理
WT 是由三部分组成的：

1. **Header**：指定 JWT 的类型（通常是 JWT）以及签名算法（如 HS256）。
2. **Payload**：包含声明（Claims），通常包括用户的基本信息（如 `user_id`）和过期时间（`exp`）。这些信息是未加密的，可以被任何人读取，但不能篡改。
3. **Signature**：使用密钥对 Header 和 Payload 进行签名，以防止数据被篡改。
##### WT 工作流程：

1. 用户使用用户名和密码发送请求进行登录。
2. 服务器验证用户信息后，生成一个包含用户信息的 JWT，并返回给客户端。
3. 客户端将 JWT 存储在本地（通常存储在 `localStorage` 或 `sessionStorage` 中，或者作为 HTTP cookie）。
4. 客户端在后续请求中将 JWT 放入请求头中，以便服务器验证该请求是否来自已认证的用户。
## 基于 JWT 的模拟登录实现步骤
主要步骤包括：

- 向登录接口发送用户名和密码请求。
- 服务器验证成功后返回 JWT。
- 将 JWT 存储并用于后续请求中的身份验证。
### 发送 POST 请求获取 JWT
首先，向服务器的登录 API 发送 POST 请求，提交用户名和密码。
```python
import requests

# 登录接口 URL
login_url = 'https://example.com/api/login'

# 用户名和密码
login_data = {
    'username': 'your_username',
    'password': 'your_password',
}

# 发送 POST 请求进行登录
response = requests.post(login_url, json=login_data)

# 检查登录是否成功
if response.ok:
    # 解析返回的 JSON 响应，提取 JWT
    token = response.json().get('token')
    print("登录成功，获取到的 JWT:", token)
else:
    print("登录失败")
```
### 使用 JWT 访问受保护的资源
一旦获取到 JWT，下一步是将其用于后续的身份验证。在每个请求中，JWT 会被放置在请求头的 `Authorization` 字段中。
```python
# 需要访问的受保护资源 URL
protected_url = 'https://example.com/api/protected_resource'

# 请求头包含 JWT
headers = {
    'Authorization': f'Bearer {token}',
}

# 发送 GET 请求，访问受保护的资源
protected_response = requests.get(protected_url, headers=headers)

# 打印受保护页面的内容
if protected_response.ok:
    print("成功访问受保护资源")
    print(protected_response.json())  # 假设返回的是 JSON 数据
else:
    print("访问受保护资源失败")
```
### 处理 JWT 过期
JWT 通常会设置过期时间（`exp`），如果 JWT 过期，服务器会拒绝请求。在这种情况下，客户端通常需要使用 **刷新 token（refresh token）** 来获取新的 JWT。
### 刷新 JWT（如果支持刷新 token）
如果服务器提供刷新功能，你可以通过刷新 token 获取新的 JWT。在刷新过程中，通常会提供一个刷新 token（通常是一个长期有效的 token），你可以使用它来获取新的 JWT。
```python
# 刷新 token 接口 URL
refresh_url = 'https://example.com/api/refresh_token'

# 发送请求刷新 JWT
refresh_data = {
    'refresh_token': 'your_refresh_token',
}
refresh_response = requests.post(refresh_url, json=refresh_data)

# 处理刷新结果
if refresh_response.ok:
    # 获取新的 JWT
    new_token = refresh_response.json().get('token')
    print("JWT 已刷新，新的 token:", new_token)
else:
    print("刷新 JWT 失败")
```

## demo
```python
import requests

# 登录接口 URL
login_url = 'https://example.com/api/login'
# 受保护资源接口 URL
protected_url = 'https://example.com/api/protected_resource'
# 刷新 token 接口 URL
refresh_url = 'https://example.com/api/refresh_token'

# 用户名和密码
login_data = {
    'username': 'your_username',
    'password': 'your_password',
}

# 发送 POST 请求进行登录，获取 JWT
response = requests.post(login_url, json=login_data)

if response.ok:
    token = response.json().get('token')
    print("登录成功，获取到的 JWT:", token)
else:
    print("登录失败")
    exit()

# 使用 JWT 访问受保护资源
headers = {
    'Authorization': f'Bearer {token}',
}
protected_response = requests.get(protected_url, headers=headers)

if protected_response.ok:
    print("成功访问受保护资源")
    print(protected_response.json())
else:
    print("访问受保护资源失败")

    # 如果遇到 JWT 过期，尝试刷新 JWT
    refresh_data = {
        'refresh_token': 'your_refresh_token',
    }
    refresh_response = requests.post(refresh_url, json=refresh_data)

    if refresh_response.ok:
        new_token = refresh_response.json().get('token')
        print("JWT 已刷新，新的 token:", new_token)

        # 使用新的 token 再次访问受保护资源
        headers['Authorization'] = f'Bearer {new_token}'
        protected_response = requests.get(protected_url, headers=headers)

        if protected_response.ok:
            print("成功访问受保护资源（刷新后）")
            print(protected_response.json())
        else:
            print("访问受保护资源失败（刷新后）")
    else:
        print("刷新 JWT 失败")
```
