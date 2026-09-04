---
title: "Go 语法复习（一）"
description: "复习 Go 程序入口、变量、常量、多返回值、指针与 defer 的基础语法。"
publishedAt: 2025-07-21
updatedAt: 2026-09-04
type: technical
tags: ["Go", "基础语法"]
draft: false
readingMinutes: 4
---

这篇笔记集中复习 Go 最容易混淆的基础语法。所有完整示例都可以用 `go run` 执行，并应先通过 `gofmt` 格式化。

## 程序入口

可执行程序使用 `package main`，并声明一个不带参数和返回值的 `main` 函数：

```go
package main

import "fmt"

func main() {
    fmt.Println("Hello, world")
}
```

```bash
go run .      # 编译并立即运行当前包
go build .    # 编译当前包，保留可执行文件
gofmt -w .    # 格式化当前目录中的 Go 文件
```

## 变量与零值

```go
package main

import "fmt"

var enabled bool // 包级变量，零值为 false

func main() {
    var count int        // 零值为 0
    name := "Leo"        // 短变量声明，只能在函数内使用
    width, height := 8, 6

    fmt.Println(enabled, count, name, width*height)
}
```

`:=` 至少要声明一个当前作用域中的新变量。只赋值、不声明时使用 `=`。

Go 常见零值包括：数值为 `0`，布尔值为 `false`，字符串为 `""`，指针、切片、映射、通道和函数为 `nil`。

## 常量与 iota

```go
package main

import "fmt"

type Status int

const (
    StatusUnknown Status = iota
    StatusReady
    StatusRunning
)

func main() {
    const width, height = 8, 6
    fmt.Println(width*height, StatusRunning)
}
```

常量可以是布尔值、字符串和数值。`iota` 在每个 `const` 声明块中从 0 开始递增，适合定义一组相关常量。

`unsafe.Sizeof` 返回变量本身占用的字节数，不包含它引用的底层数据，而且结果可能随目标架构变化。字符串内容长度使用 `len(s)`；它返回字节数，不是 Unicode 字符数。

## 多返回值与错误

```go
package main

import (
    "errors"
    "fmt"
)

func divide(a, b float64) (float64, error) {
    if b == 0 {
        return 0, errors.New("division by zero")
    }
    return a / b, nil
}

func main() {
    result, err := divide(10, 2)
    if err != nil {
        fmt.Println("error:", err)
        return
    }
    fmt.Println(result)
}
```

Go 通常把 `error` 作为最后一个返回值。调用方应在继续使用结果前检查错误。

## 值传递与指针

Go 的参数都是值传递。传入指针时，复制的是地址，因此函数可以修改地址指向的值：

```go
package main

import "fmt"

func swap(x, y *int) {
    *x, *y = *y, *x
}

func main() {
    a, b := 100, 200
    fmt.Printf("before: a=%d b=%d\n", a, b)

    swap(&a, &b)

    fmt.Printf("after:  a=%d b=%d\n", a, b)
    fmt.Printf("address of a: %p\n", &a)
}
```

指针能表达“函数需要修改调用方的值”，但不要为了避免复制而默认到处使用指针。切片、映射和通道本身已经是小型描述符，语义也与普通值不同。

## init 与 defer

一个包可以声明多个 `init` 函数，它们在包初始化阶段运行。业务代码通常更适合显式初始化，避免把复杂逻辑藏进 `init`。

`defer` 在当前函数返回前执行，多个 `defer` 按后进先出顺序运行：

```go
package main

import "fmt"

func demo() {
    defer fmt.Println("third")
    defer fmt.Println("second")
    fmt.Println("first")
}

func main() {
    demo()
}
```

输出顺序是 `first`、`second`、`third`。`defer` 常用于关闭文件、释放锁或记录函数结束，但仍要处理 `Close` 可能返回的错误。

## panic 与 recover

`panic` 表示程序无法在当前路径继续。普通业务错误优先返回 `error`。`recover` 只有在延迟函数中才能捕获当前 goroutine 的 panic，通常放在进程边界或框架中统一记录；不要用它代替正常错误处理。

## 参考

- [Go 语言规范](https://go.dev/ref/spec)
- [Effective Go](https://go.dev/doc/effective_go)
