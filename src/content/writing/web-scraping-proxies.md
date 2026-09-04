---
title: "爬虫中代理的使用"
description: "说明采集程序使用正向代理的配置方式、信任边界、故障处理与合规要求。"
publishedAt: 2025-01-12
updatedAt: 2026-09-04
type: technical
tags: ["Python", "爬虫", "代理"]
draft: false
readingMinutes: 3
---

采集程序可能因为企业出口、网络隔离、地域测试或统一审计而需要正向代理。代理不是“隐身工具”：目标服务仍能通过账号、请求模式和其他信号识别客户端，代理本身也能观察你的流量。

> 不要使用代理绕过封禁、验证码、付费墙、地域限制或访问控制。只有在数据、账号和自动化行为都获得授权时再发送请求。

## Requests 配置

```python
import os
import requests

proxy_url = os.environ["HTTPS_PROXY"]

with requests.Session() as session:
    response = session.get(
        "https://example.com",
        proxies={"http": proxy_url, "https": proxy_url},
        timeout=(3.05, 15),
    )
    response.raise_for_status()
    print(response.status_code)
```

代理账号和密码应从环境变量或密钥服务读取。不要把它们硬编码进仓库。

## HTTPX 配置

当前 HTTPX 使用单数参数 `proxy`：

```python
import os
import httpx

with httpx.Client(proxy=os.environ["HTTPS_PROXY"], timeout=10.0) as client:
    response = client.get("https://example.com")
    response.raise_for_status()
```

多代理路由使用 `mounts`，不要沿用旧版本的 `proxies={...}` 写法。

## 信任边界

- HTTPS 代理通常能看到目标主机、连接时间和流量大小；安装代理提供的根证书后，它还可能解密内容。
- 来源不明的免费代理可能记录或修改流量，不应传输 Cookie、Token 和个人数据。
- TLS 证书错误应查明原因，不能简单设置 `verify=False`。
- 代理出口地址仍可能被限流；遵守服务端返回的 `Retry-After` 和速率要求。

## 可用性与重试

代理失败常见于连接超时、TLS 握手、407 认证失败和上游 5xx。重试应满足：

- 只重试临时错误。
- 设置最大次数和总时限。
- 使用指数退避与随机抖动。
- 不因换代理而重复提交非幂等请求。
- 记录代理节点、错误类型和请求 ID，但不记录凭据。

## 代理池

自建代理池要维护健康检查、容量、地域和凭据轮换。公开抓取任务更应该先降低并发、缓存结果并使用官方 API，而不是靠不断更换出口逃避限制。

## 参考

- [Requests 代理配置](https://requests.readthedocs.io/en/latest/user/advanced/#proxies)
- [HTTPX 代理配置](https://www.python-httpx.org/advanced/proxies/)
