---
title: "模拟登录基础"
description: "理解浏览器会话自动化中的 Cookie、Token、CSRF 与登录状态验证。"
publishedAt: 2025-01-09
updatedAt: 2026-09-04
type: technical
tags: ["Python", "认证", "自动化"]
draft: false
readingMinutes: 2
---

“模拟登录”更准确的说法是**自动化一个经过授权的客户端会话**。它不是一种通用技巧：不同系统可能使用服务端 Session、OAuth/OIDC、JWT、一次性验证码或硬件密钥，客户端必须遵循服务端公开的认证流程。

## 常见流程

1. 通过 HTTPS 获取登录页或调用登录 API。
2. 按协议提交凭据，并同时提交需要的 CSRF Token、设备信息或挑战结果。
3. 服务端验证身份，返回 Session Cookie 或短期令牌。
4. 客户端保存会话状态，并在后续请求中携带凭据。
5. 通过受保护接口验证登录结果，而不是只判断登录请求是否返回 200。
6. 到期后按协议刷新或重新认证，退出时主动撤销会话。

## Cookie 与 Token

- **Session Cookie**：Cookie 通常只保存一个随机会话标识，用户状态保存在服务端。
- **Bearer Token**：持有者即可使用，泄露后不需要密码也能请求接口，因此不能写进 URL 或日志。
- **JWT**：只是一种令牌格式。签名能防止内容被篡改，但 Payload 默认不加密。

## 安全检查

- 凭据从环境变量或密钥管理服务读取，不写死在源码里。
- 所有请求设置连接和读取超时，并检查 4xx/5xx 状态。
- 浏览器会话优先使用 `Secure`、`HttpOnly`、`SameSite` Cookie。
- 不在 `localStorage` 中长期保存会话标识或刷新令牌。
- 为登录接口设置限速、审计与异常登录提醒。
- 不绕过验证码、多因素认证、访问控制或站点的自动化限制。

## 选择合适的方法

自有系统优先提供明确、可测试的 API 或 OAuth/OIDC 流程，而不是让脚本解析登录页面。页面自动化更适合端到端测试；数据集成则应该使用服务端 API、专用账号和最小权限。

## 参考

- [OWASP Session Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)
- [OWASP HTML5 Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/HTML5_Security_Cheat_Sheet.html)
