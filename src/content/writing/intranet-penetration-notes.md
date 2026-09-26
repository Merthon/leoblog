---
title: "内网穿透笔记：从原理到安全落地"
description: "内网服务为什么无法直接访问，反向隧道如何工作，以及 SSH、FRP、Cloudflare Tunnel 与 Tailscale 应该怎么选。"
publishedAt: 2026-09-26
type: technical
tags: ["网络", "内网穿透", "FRP", "Tailscale", "Cloudflare"]
draft: false
featured: true
readingMinutes: 7
translationKey: intranet-penetration-notes
---

家里的 NAS、本机正在开发的网站，或者公司网络里的一台测试机，通常只有内网地址。外面的设备即使知道这个地址，也无法直接建立连接。内网穿透解决的就是这件事：让一个没有公网入口的服务，在可控范围内被外部访问。

它并不神秘。最常见的做法，是让内网机器主动连向一台公网服务器并保持隧道。外部请求先到公网入口，再沿着已经建立的连接返回内网。

```text
访问者 → 公网入口 → 加密隧道 → 内网机器 → localhost:3000
```

因为连接由内向外发起，家用路由器的 NAT 和大多数防火墙都会允许它通过。公网侧不需要主动找到内网机器，也不必在路由器上开放端口。

## “内网穿透”其实包含几种方案

这个词常被笼统使用，背后的网络模型并不完全一样。

- **反向隧道**：内网客户端连接公网中继，访问流量经中继转发。SSH `-R`、FRP 和 Cloudflare Tunnel 都属于这一类。
- **组网**：设备加入同一张虚拟私网，用虚拟 IP 互访。Tailscale 更接近这种模式；连接条件允许时会尽量直连，失败时使用中继。
- **端口映射**：路由器把公网端口转发到某台内网机器。链路最直接，但需要公网 IP 和路由器控制权，暴露面也更明显。
- **P2P 打洞**：双方借助协调服务器发现彼此，再尝试建立直连。它能降低中继开销，但受 NAT 类型和网络策略影响，不保证成功。

选工具前，先确定访问者是谁。只给自己的设备访问，与把网站开放给所有人，是两个安全模型。

## 临时调试：SSH 反向隧道

如果手里已有一台能 SSH 登录的 VPS，反向端口转发是最短路径。下面把内网机器的 `3000` 端口转到 VPS 的本地 `8080` 端口：

```bash
ssh -NT \
  -o ExitOnForwardFailure=yes \
  -o ServerAliveInterval=30 \
  -R 127.0.0.1:8080:127.0.0.1:3000 user@vps.example.com
```

此时只能在 VPS 上访问：

```bash
curl http://127.0.0.1:8080
```

这是我更推荐的默认方式。不要急着把远端监听地址改成 `0.0.0.0`；可以让 VPS 上的 Caddy 或 Nginx 代理到 `127.0.0.1:8080`，再由它处理 HTTPS、身份验证和访问日志。OpenSSH 的 [`-R` 参数](https://man.openbsd.org/ssh)负责远端监听和回程转发，公网是否可直接连接还会受到服务器 `GatewayPorts` 配置的限制。

SSH 隧道适合临时预览、远程排障和应急访问。长期运行还要处理断线重连、进程守护与密钥轮换，这时专用工具通常更省心。

## 自建入口：FRP

[FRP](https://gofrp.org/en/docs/overview/) 由公网服务器上的 `frps` 和内网机器上的 `frpc` 组成。它支持 TCP、UDP、HTTP 和 HTTPS，适合手里有 VPS、希望自己掌握入口与域名的场景。

最小 TCP 配置可以这样写：

```toml
# frps.toml，运行在 VPS
bindPort = 7000
auth.token = "replace-with-a-long-random-token"
```

```toml
# frpc.toml，运行在内网机器
serverAddr = "vps.example.com"
serverPort = 7000
auth.token = "replace-with-a-long-random-token"

[[proxies]]
name = "local-web"
type = "tcp"
localIP = "127.0.0.1"
localPort = 3000
remotePort = 6000
```

`frps` 会在 VPS 的 `6000` 端口接收连接，再转给本地服务。正式使用时，认证令牌应从权限为 `600` 的独立文件读取，而不是提交进仓库；[FRP 官方认证文档](https://gofrp.org/en/docs/features/common/authentication/)已经支持 `tokenSource`。还要用云防火墙限制入口，并按需配置 TLS 身份校验。

FRP 的优势是控制力强，代价是服务器、证书、升级、监控与防护都归自己负责。它不是“装好就自动安全”。

## 公网 Web 服务：Cloudflare Tunnel

Cloudflare Tunnel 在内网运行 `cloudflared`，由它主动建立到 Cloudflare 的出站连接。[官方文档](https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/)将其描述为 outbound-only 模型，因此源站不需要开放入站端口。

本地调试可以用一条命令生成临时地址：

```bash
cloudflared tunnel --url http://localhost:3000
```

它会返回一个随机的 `trycloudflare.com` 域名。不过 [Quick Tunnel 文档](https://developers.cloudflare.com/tunnel/get-started/)明确把它定位为测试功能，并限制并发，也不支持 SSE。正式环境应创建命名隧道、绑定自己的域名，再叠加 Access 策略，而不是把临时地址当作长期部署方案。

它很适合网站、Webhook 和内部管理页。需要接受的交换条件也很明确：域名与入口依赖 Cloudflare，流量会经过其网络，非 HTTP 协议的访问方式也更受约束。

## 私有访问：Tailscale Serve

如果只是想从自己的笔记本、手机或几位成员的设备访问 NAS 与开发服务，我会优先考虑虚拟组网，而不是把服务发布到公网。

设备都加入同一个 tailnet 后，可以用 [Tailscale Serve](https://tailscale.com/docs/features/tailscale-serve) 把本地端口提供给这张私有网络：

```bash
tailscale serve 3000
```

访问控制规则会继续生效，外部互联网无法直接访问这个地址。如果确实需要分享给没有加入 tailnet 的人，可以改用：

```bash
tailscale funnel 3000
```

[Funnel](https://tailscale.com/docs/features/tailscale-funnel) 会把服务公开到互联网，目前仍是 beta，并有固定入口端口、域名和带宽方面的限制。`Serve` 是私有共享，`Funnel` 是公开发布，不能因为命令只差一个单词就混用。

## 我会怎么选

| 需求 | 选择 | 原因 |
| --- | --- | --- |
| 临时从外面看一下本地页面 | SSH `-R` | 已有 VPS 时几分钟可用，退出即关闭 |
| 多个 TCP/UDP 服务，入口完全自控 | FRP | 协议灵活，适合长期自建 |
| 对外发布网站或接收 Webhook | Cloudflare Tunnel | 域名、HTTPS 与访问策略整合方便 |
| 只允许自己的设备或团队访问 | Tailscale Serve | 服务不进入公共互联网 |
| 临时把页面分享给任何人 | Tailscale Funnel 或 Quick Tunnel | 配置少，但要接受平台限制 |

生产服务如果已经适合部署到云端，就直接部署。内网穿透更适合开发预览、家庭服务、设备维护，以及无法迁移的内部应用，不应该成为逃避正常部署和安全设计的捷径。

## 上线前的安全清单

穿透成功只说明网络通了，离“可以放心使用”还差几步。

1. **让源服务只监听 `127.0.0.1`。** Docker 端口也尽量写成 `127.0.0.1:3000:3000`，避免同一局域网绕过隧道入口直连。
2. **在公网入口增加身份验证。** 管理后台、数据库、Redis 和 Docker API 不应裸露；优先使用 SSO、短期凭证或 VPN 访问。
3. **全程加密并校验身份。** “用了隧道”不等于每一段链路都正确验证了对端证书。
4. **限制来源与速率。** 防火墙、访问策略和限流要靠近公网入口，减少扫描与暴力尝试。
5. **保存必要日志。** 记录入口访问、认证失败和隧道上下线，但不要把令牌、Cookie 与请求正文无差别写进日志。
6. **配置自动重连，也配置关闭方式。** 临时分享结束后立即停掉入口；长期服务则交给 systemd 或其他进程管理器。

排错时沿链路逐段检查：本地端口是否监听、隧道客户端是否在线、公网入口是否开放、DNS 是否指向正确位置、代理使用的是 HTTP 还是原始 TCP。大多数问题都发生在其中一段协议或监听地址配错，而不是“穿透工具突然失效”。

我更喜欢把内网穿透看成一条临时铺设的网络路径。路径越方便，越要明确谁能走、能走到哪里，以及什么时候拆掉。
