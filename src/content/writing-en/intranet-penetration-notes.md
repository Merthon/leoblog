---
title: "Exposing Private Services Without Losing Control"
description: "How reverse tunnels work, how SSH, FRP, Cloudflare Tunnel, and Tailscale differ, and what to secure before exposing a private service."
publishedAt: 2026-09-26
type: technical
tags: ["Networking", "Tunneling", "FRP", "Tailscale", "Cloudflare"]
draft: false
featured: true
readingMinutes: 8
translationKey: intranet-penetration-notes
---

A NAS at home, a web app running on a laptop, or a test machine inside an office network usually has only a private address. A device on the wider internet cannot initiate a connection to it. What Chinese developers often call “intranet penetration” solves that routing problem: it makes a service without a public entry point reachable within a controlled scope.

The most common design is straightforward. The private machine initiates and maintains a connection to a public relay. External requests reach that relay first, then travel back through the established tunnel.

```text
visitor → public entry point → encrypted tunnel → private machine → localhost:3000
```

Because the connection starts from the inside, a home NAT gateway and most firewalls allow it as outbound traffic. The public side does not need to discover the private machine or open a port on its router.

## One term, several network models

“Intranet penetration” is an umbrella term. The implementations do not all work the same way.

- **Reverse tunnels** connect a private client to a public relay and carry incoming traffic back over that connection. SSH `-R`, FRP, and Cloudflare Tunnel follow this model.
- **Overlay networks** place authenticated devices on one virtual private network. Tailscale fits here; it attempts direct connections when possible and falls back to relays when necessary.
- **Port forwarding** maps a public router port to one private host. It is direct, but requires a public IP and control over the router, and creates a visible attack surface.
- **Peer-to-peer hole punching** uses a coordination service to help two peers attempt a direct path. It can avoid relay costs, but success depends on NAT and network policy.

Before choosing a tool, decide who needs access. Sharing with your own devices and publishing a website to everyone require different security models.

## Fast temporary access with SSH

If you already have a VPS that accepts SSH connections, remote port forwarding is the shortest route. This command forwards port `8080` on the VPS loopback interface to port `3000` on the private machine:

```bash
ssh -NT \
  -o ExitOnForwardFailure=yes \
  -o ServerAliveInterval=30 \
  -R 127.0.0.1:8080:127.0.0.1:3000 user@vps.example.com
```

The service is now reachable only from the VPS:

```bash
curl http://127.0.0.1:8080
```

That is a safer default than immediately binding the remote port to `0.0.0.0`. Caddy or Nginx on the VPS can proxy to `127.0.0.1:8080` and handle TLS, authentication, and access logs. OpenSSH documents remote listeners under the [`-R` option](https://man.openbsd.org/ssh); whether a listener can be public also depends on the server's `GatewayPorts` setting.

SSH tunnels work well for previews, debugging, and emergency access. A long-running tunnel also needs reconnection, process supervision, and key rotation, where a dedicated tool is usually easier to operate.

## A self-hosted gateway with FRP

[FRP](https://gofrp.org/en/docs/overview/) consists of `frps` on a public server and `frpc` on the private machine. It supports TCP, UDP, HTTP, and HTTPS, making it a practical choice when you own a VPS and want control over the gateway and domains.

A minimal TCP setup looks like this:

```toml
# frps.toml on the VPS
bindPort = 7000
auth.token = "replace-with-a-long-random-token"
```

```toml
# frpc.toml on the private machine
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

`frps` accepts connections on VPS port `6000` and forwards them to the local service. In production, load credentials from a separate file with mode `600` instead of committing them. The [FRP authentication guide](https://gofrp.org/en/docs/features/common/authentication/) documents `tokenSource` for this purpose. Restrict the public port with a cloud firewall and configure TLS identity verification where appropriate.

FRP provides control at the cost of responsibility. Server patching, certificates, upgrades, monitoring, and edge protection remain your job.

## Public web applications with Cloudflare Tunnel

Cloudflare Tunnel runs `cloudflared` inside the private network. The daemon establishes outbound connections to Cloudflare, so the origin does not need an inbound port. Cloudflare describes this as an [outbound-only connection model](https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/).

For a local test, one command creates a temporary URL:

```bash
cloudflared tunnel --url http://localhost:3000
```

It returns a random `trycloudflare.com` hostname. The [Quick Tunnel documentation](https://developers.cloudflare.com/tunnel/get-started/) explicitly positions this mode for testing, applies a concurrent-request limit, and does not support SSE. A production service should use a named tunnel, a controlled domain, and an Access policy rather than treating the temporary URL as deployment.

This model works well for web apps, webhooks, and internal dashboards. The trade-off is equally clear: the domain and entry point depend on Cloudflare, traffic crosses its network, and non-HTTP protocols require a different client-side flow.

## Private access with Tailscale Serve

When only your laptop, phone, or a few team devices need access to a NAS or development service, I would prefer an overlay network over publishing the service.

After the devices join the same tailnet, [Tailscale Serve](https://tailscale.com/docs/features/tailscale-serve) can make a local port available inside that private network:

```bash
tailscale serve 3000
```

Tailnet access-control rules still apply, and the service is not directly reachable from the public internet. If someone outside the tailnet must access it, use:

```bash
tailscale funnel 3000
```

[Funnel](https://tailscale.com/docs/features/tailscale-funnel) publishes the service to the internet. It is still in beta and has constraints around public ports, hostnames, and bandwidth. Serve is private sharing; Funnel is public exposure. Similar commands do not imply the same risk.

## A practical selection guide

| Requirement | Pick | Why |
| --- | --- | --- |
| Preview a local page for a few minutes | SSH `-R` | Minimal setup when a VPS already exists |
| Run several self-managed TCP or UDP services | FRP | Flexible protocols and full gateway control |
| Publish a web app or receive webhooks | Cloudflare Tunnel | Convenient integration with domains, TLS, and access policy |
| Limit access to your devices or team | Tailscale Serve | The service stays outside the public internet |
| Temporarily share a page with anyone | Tailscale Funnel or Quick Tunnel | Little setup, with platform limits |

If a production application already belongs in a cloud deployment, deploy it normally. Tunnels are most useful for previews, home services, device maintenance, and internal applications that cannot move. They should not replace ordinary deployment and security design by default.

## Security checks before exposure

A working tunnel proves only that packets can travel. It does not prove that the service is safe.

1. **Bind the origin to `127.0.0.1`.** For Docker, prefer a mapping such as `127.0.0.1:3000:3000` so devices on the local network cannot bypass the tunnel entry point.
2. **Authenticate at the public edge.** Never expose admin panels, databases, Redis, or the Docker API without a strong access layer. Prefer SSO, short-lived credentials, or private-network access.
3. **Encrypt every relevant hop and verify identity.** A tunnel alone does not guarantee that both endpoints validate the expected certificate or key.
4. **Restrict sources and request rates.** Apply firewall rules, access policy, and rate limits close to the public entry point.
5. **Keep useful logs, not every secret.** Record access, failed authentication, and tunnel state without indiscriminately logging tokens, cookies, or request bodies.
6. **Plan both reconnection and shutdown.** Supervise persistent clients with systemd or another service manager, and remove temporary exposure as soon as sharing ends.

Troubleshoot one hop at a time: confirm the local process is listening, the tunnel client is connected, the public listener is allowed, DNS points to the right place, and both sides agree on HTTP versus raw TCP. Most failures are a wrong bind address or protocol on one hop, not a mysterious failure of the tunneling tool.

I treat a tunnel as a temporary network path. The easier it is to create, the more explicit I want to be about who can use it, what it reaches, and when it disappears.
