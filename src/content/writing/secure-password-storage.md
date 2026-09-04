---
title: "用户密码的安全存储"
description: "说明密码哈希、盐、工作因子与算法选择，并给出 Go 中使用 bcrypt 的兼容示例。"
publishedAt: 2024-06-24
updatedAt: 2026-09-04
type: technical
tags: ["安全", "Go"]
draft: false
readingMinutes: 3
---

密码不应明文保存，也不应使用可逆加密后保存。认证系统通常保存**专用密码哈希**，登录时再用同一算法验证输入。

## 算法选择

新系统优先使用 **Argon2id**。如果环境不支持，可以考虑 scrypt；bcrypt 更适合已有系统的兼容与迁移。普通 SHA-256、MD5 等快速哈希不适合密码存储，因为攻击者可以低成本进行大量猜测。

每条密码记录需要独立随机盐。成熟的密码哈希库会自动生成盐，并把算法参数、盐和结果编码在同一个字符串中，不要自己拼接“盐值 + 密码”。

## 成本参数

密码哈希故意设计得比较慢。成本应根据服务器性能压测，在正常登录延迟和抗暴力破解能力之间取平衡，并支持以后逐步升级。验证旧哈希成功后，可以用新参数重新计算并保存。

OWASP 当前给出的 Argon2id 最低配置之一是 19 MiB 内存、2 次迭代、并行度 1。bcrypt 的工作因子至少为 10，并且多数实现只处理前 72 字节输入。

## Go 中的 bcrypt 示例

下面保留 bcrypt 作为兼容示例。Go 的 `bcrypt.DefaultCost` 当前为 10，盐由库自动生成并写入结果。

```go
package main

import (
    "errors"

    "golang.org/x/crypto/bcrypt"
)

func HashPassword(password string) (string, error) {
    if len([]byte(password)) > 72 {
        return "", errors.New("password exceeds bcrypt's 72-byte limit")
    }

    hash, err := bcrypt.GenerateFromPassword(
        []byte(password),
        bcrypt.DefaultCost,
    )
    if err != nil {
        return "", err
    }
    return string(hash), nil
}

func CheckPassword(password, encodedHash string) bool {
    err := bcrypt.CompareHashAndPassword(
        []byte(encodedHash),
        []byte(password),
    )
    return err == nil
}
```

不要在日志中打印原始密码、哈希或登录请求体。认证接口还需要登录限速、多因素认证、泄露密码检查和安全的重置流程；密码哈希只解决数据库泄露后的离线破解风险。

## 迁移旧哈希

数据库中应记录或识别哈希算法与参数。用户成功登录后，如果发现旧记录的算法或成本低于当前标准，就在本次请求中重新哈希。不要要求所有用户同时重置密码，也不要尝试“解密”旧哈希。

## 参考

- [OWASP Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)
- [Go bcrypt 文档](https://pkg.go.dev/golang.org/x/crypto/bcrypt)
