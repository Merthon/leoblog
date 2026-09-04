---
title: "Go Web 开发：Gin 框架笔记"
description: "以项目实践梳理 Gin 的路由、参数绑定、中间件、模板渲染与常见开发方式。"
publishedAt: 2025-07-28
type: technical
tags: ["Go", "Gin"]
draft: false
readingMinutes: 12
---
## Gin框架入门
> **作者：** Merthon Chen 2025-07-28
> **介绍：** 这是一篇系统的 Gin 框架入门教程，以项目驱动的方式，涵盖环境搭建、核心概念、路由、参数绑定、中间件、模板渲染等内容。

---

## 环境搭建与模块初始化

### 创建项目目录并初始化模块
```bash
mkdir myginapp && cd myginapp
# 使用你的 GitHub 地址或自定义模块名
go mod init github.com/merthon/myginapp
```
### 安装 Gin
```bash
go get github.com/gin-gonic/gin@latest
```
`go.mod` 与 `go.sum` 会自动更新。
### 快速示例
在 `main.go` 中：
```go
package main
import (
    "github.com/gin-gonic/gin"
)
func main() {
    r := gin.Default() // 默认包含 Logger 和 Recovery 中间件
    r.GET("/ping", func(c *gin.Context) {
        c.JSON(200, gin.H{"message": "pong"})
    })
    r.Run() // 监听 :8080
}
```
```bash
go run main.go
curl http://localhost:8080/ping
# 返回 {"message":"pong"}
```
Gin.Default()：创建引擎并注册了日志和 panic 恢复中间件。

---

## 项目结构与核心概念

### 目录结构
我们先在 `myginapp` 目录下创建以下文件夹和文件，形成一个清晰的分层：
```
myginapp/
├── main.go       # 程序入口
├── controllers/  # 业务逻辑（Handler）
├── routes/       # 路由注册
├── middlewares/  # 自定义中间件
├── models/       # 数据模型与存储
└── templates/    # HTML 模板
└── static/       # 静态资源
```
### 核心概念
1. **`gin.Default()`** 内部做了两件事：
    - 创建了一个 `gin.Engine` 实例
    - 注册了两个默认中间件：Logger 和 Recovery
2.  **`gin.Engine`**
    - Gin 框架的核心类型，包含路由树、已注册中间件和启动逻辑。
3.  **`HandlerFunc` 与 `Context`**
    - Handler 函数原型：`func(c *gin.Context)`
4.  `*gin.Context`：每个请求都会创建一个 `Context`，它封装了请求与响应的所有信息。
    常用方法：
    - `c.Param(key)` — 获取路径参数
    - `c.Query(key)` — 获取查询字符串
    - `c.PostForm(key)`— 获取表单字段
    - `c.JSON(code, obj)` — 发送 JSON
    - `c.HTML(code, tmpl, data)` — 渲染模板
比如：
创建 `controllers/ping.go`
```go
package controllers

import "github.com/gin-gonic/gin"

// Ping 处理 /ping 路由
func Ping(c *gin.Context) {
    c.JSON(200, gin.H{"message": "pong"})
}
```
创建 `routes/routes.go`
```go
package routes

import (
    "github.com/gin-gonic/gin"
    "github.com/yourusername/myginapp/controllers"
)

// SetupRouter 注册所有路由
func SetupRouter() *gin.Engine {
    r := gin.Default()
    // 可以在这里加全局中间件：r.Use(middlewares.Logger())
    api := r.Group("/api")
    {
        api.GET("/ping", controllers.Ping)
    }
    return r
}
```
修改main.go
```go
package main

import (
    "github.com/yourusername/myginapp/routes"
)

func main() {
    r := routes.SetupRouter()
    // r.Run(":8080") // 默认监听 0.0.0.0:8080
    r.Run() // 也可不传端口参数
}

```

---

## 路由详解与参数获取

### 路由类型
```go
r.GET("/home", handler)        // 静态路由
r.GET("/user/:id", handler)    // 动态路由，:id 为 Path 参数
r.GET("/files/*filepath", ...) // 通配符路由
```
### 路径参数
```go
func GetUser(c *gin.Context) {
    id := c.Param("id")
    c.JSON(200, gin.H{"user_id": id})
}
```
### 查询参数
```go
func Search(c *gin.Context) {
    q := c.Query("q")           // 空时返回 ""
    page := c.DefaultQuery("page", "1")
    c.JSON(200, gin.H{"q": q, "page": page})
}
```
### 表单与 JSON
```go
// 表单
func FormHandler(c *gin.Context) {
    user := c.PostForm("user")
    c.JSON(200, gin.H{"user": user})
}
// JSON
func JSONHandler(c *gin.Context) {
    var obj struct{ Name string `json:"name"` }
    if err := c.ShouldBindJSON(&obj); err != nil { ... }
    c.JSON(200, obj)
}
```
---

## 中间件：日志、Recovery、限流、鉴权
中间件其实就是一段函数，它在请求到达真正的 Handler 之前或之后执行，用于做统一处理，比如：
- 日志记录
- 鉴权验证
- 请求限流
- Panic 恢复
- Gin 的中间件签名为：`func(c *gin.Context)`
### 自定义 Logger
```go
func Logger() gin.HandlerFunc {
    return func(c *gin.Context) {
        start := time.Now()
        c.Next()
        latency := time.Since(start)
        log.Printf("%s %s %d %v", c.Request.Method, c.Request.URL.Path, c.Writer.Status(), latency)
    }
}
r.Use(Logger())
```
### Recovery & 限流
```go
r.Use(gin.Recovery())
// 基于 x/time/rate
r.Use(RateLimitMiddleware())
```
### 简易鉴权
对某些敏感接口（比如用户信息、修改、删除等）进行访问控制，仅允许携带有效 Token 的请求通过。
```go
func AuthRequired() gin.HandlerFunc {
    return func(c *gin.Context) {
        if c.GetHeader("Authorization") != "Bearer secrettoken" {
            c.AbortWithStatusJSON(401, gin.H{"error": "unauthorized"})
            return
        }
        c.Next()
    }
}
```

---

## 数据绑定与验证
在实际项目中，几乎所有的请求都会携带参数——路径参数、查询参数、表单字段或 JSON 体。我们希望把这些参数绑定到结构体，并在绑定时做校验，确保入参合法。
### 绑定原理与 ShouldBind
Gin 内部集成了 go-playground/validator 库。只需：
1. 定义带有 `binding` 标签的结构体
2. 在 handler 中调用 `c.ShouldBindXXX(&obj)` 或 `c.ShouldBind(&obj)`
Gin 会根据请求的 Content-Type 自动选择合适的绑定器：
- `application/json` → JSON 绑定
- `application/x-www-form-urlencoded` 或 `multipart/form-data` → 表单绑定
- URL Query 参数 → Query 绑定
- Path 参数 → Path 绑定
### 结构体绑定
```go
type Login struct {
    User string `json:"user" binding:"required"`
    Pass string `json:"pass" binding:"required"`
}
func LoginJSON(c *gin.Context) {
    var req Login
    if err := c.ShouldBindJSON(&req); err != nil { ... }
    c.JSON(200, req)
}
```
### 常用验证标签
- `required`, `omitempty`
- `min=`, `max=`
- `oneof=A B C`
- `uuid4`, `email`
### 分离 GET/POST 结构体
```go
type QueryInput struct { ID string `uri:"id"`; Q string `form:"q"` }
type PostInput  struct { Price float64 `json:"price"` }
```
避免在同一 struct 上混合不同场景校验。

---

## 模板渲染与静态文件服务

### 加载模板
```go
r.LoadHTMLGlob("templates/*")
```
### 渲染页面
```go
r.GET("/", func(c *gin.Context) {
    c.HTML(200, "index.html", gin.H{"Title": "首页"})
})
```
### 模板示例
**templates/index.html**：
```html
<!DOCTYPE html>
<html><head><title>{{ .Title }}</title></head>
<body><h1>{{ .Title }}</h1></body>
</html>
```
### 静态资源映射

```go
r.Static("/static", "./static")
```

在 HTML 中引用： `<link href="/static/css/style.css">`

---

## 完整示例：用户管理 CRUD

### 模型：`models/user.go`
先在 `models/user.go` 中定义 `User` 结构体，并实现对这个切片的增删改查：

```go
package models

import (
    "errors"
    "github.com/google/uuid"
)

// 用户模型
type User struct {
    ID    string `json:"id"`
    Name  string `json:"name" binding:"required,max=100"`
    Email string `json:"email" binding:"required,email"`
}

// 内存“数据库”
var users = make([]User, 0)

// ErrNotFound 用户不存在错误
var ErrNotFound = errors.New("user not found")

// CreateUser 新建用户，生成 UUID 并返回
func CreateUser(u User) User {
    u.ID = uuid.NewString()
    users = append(users, u)
    return u
}

// GetAllUsers 返回所有用户
func GetAllUsers() []User {
    return users
}

// GetUserByID 根据 ID 查找用户
func GetUserByID(id string) (User, error) {
    for _, u := range users {
        if u.ID == id {
            return u, nil
        }
    }
    return User{}, ErrNotFound
}

// UpdateUser 更新指定 ID 的用户信息
func UpdateUser(id string, input User) (User, error) {
    for i, u := range users {
        if u.ID == id {
            users[i].Name = input.Name
            users[i].Email = input.Email
            return users[i], nil
        }
    }
    return User{}, ErrNotFound
}

// DeleteUser 从切片中删除指定 ID 的用户
func DeleteUser(id string) error {
    for i, u := range users {
        if u.ID == id {
            users = append(users[:i], users[i+1:]...)
            return nil
        }
    }
    return ErrNotFound
}

```
### 控制器：`controllers/user.go`
在 `controllers/user.go` 中，实现五个 Handler，负责接收 HTTP 请求、调用 `models` 包，并返回 JSON 响应。
```go
package controllers

import (
    "net/http"

    "github.com/gin-gonic/gin"
    "github.com/merthon/myginapp/models"
)

// ListUsers GET /api/users
func ListUsers(c *gin.Context) {
    users := models.GetAllUsers()
    c.JSON(http.StatusOK, users)
}

// GetUser GET /api/users/:id
func GetUser(c *gin.Context) {
    id := c.Param("id")
    user, err := models.GetUserByID(id)
    if err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
        return
    }
    c.JSON(http.StatusOK, user)
}

// CreateUser POST /api/users
func CreateUser(c *gin.Context) {
    var input models.User
    if err := c.ShouldBindJSON(&input); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
    user := models.CreateUser(input)
    c.JSON(http.StatusCreated, user)
}

// UpdateUser PUT /api/users/:id
func UpdateUser(c *gin.Context) {
    id := c.Param("id")
    var input models.User
    if err := c.ShouldBindJSON(&input); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
    user, err := models.UpdateUser(id, input)
    if err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
        return
    }
    c.JSON(http.StatusOK, user)
}

// DeleteUser DELETE /api/users/:id
func DeleteUser(c *gin.Context) {
    id := c.Param("id")
    if err := models.DeleteUser(id); err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
        return
    }
    c.Status(http.StatusNoContent)
}
```
### 路由：`routes/routes.go`
在 `routes/routes.go` 中，注册所有用户管理相关的路由，将请求映射到我们在 controllers 中实现的函数。
```go
r := gin.Default()
api := r.Group("/api")
{
    api.GET("/users", ListUsers)
    api.GET("/users/:id", GetUser)
    api.POST("/users", CreateUser)
    api.PUT("/users/:id", UpdateUser)
    api.DELETE("/users/:id", DeleteUser)
}
```
---
## 项目地址
https://github.com/Merthon/Go-projects
