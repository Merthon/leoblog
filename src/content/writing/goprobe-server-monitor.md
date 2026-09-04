---
title: "GoProbe：用 Go 构建轻量级服务器探针"
description: "GoProbe 是一个使用 Go 编写的简易服务器探针，目标是通过 Web 界面实时展示服务器状态，包括系统信息、内存使用、磁盘使用和运行时信息等，适合作为个人服务器状态面板或学习 Gol……"
publishedAt: 2025-07-28
type: technical
tags: ["Go", "练习项目"]
draft: false
readingMinutes: 5
---
## GoProbe：用 Go 构建的轻量级服务器探针
- 项目地址：https://github.com/Merthon/Go-projects
- 技术栈：Go 1.23 + HTML 模板继承 + 标准库
- 功能：系统信息收集 / 内存磁盘监控 / 客户端信息展示

## 介绍
GoProbe 是一个使用 Go 编写的简易服务器探针，目标是通过 Web 界面实时展示服务器状态，包括系统信息、内存使用、磁盘使用和运行时信息等，适合作为个人服务器状态面板或学习 Golang 项目的结构化开发入门。

## 项目结构
```csharp
goprobe/
├── go.mod
├── main.go
├── probe/
│   ├── system.go     # 收集操作系统、CPU、主机信息
│   ├── memory.go     # 收集内存使用情况
│   └── disk.go       # 收集磁盘容量和使用率
├── templates/
│   ├── base.html     # 公共布局模板
│   └── index.html    # 内容模板
└── static/
    └── (CSS 或图片资源)
```
## 功能实现
### 系统信息收集（probe/system.go）
收集操作系统、架构、Go版本、主机名、CPU核心数、进程 PID 等运行环境信息。
```go
package probe

import (
	"os"
	"runtime"
)

//SystemInfo 封装服务器基础信息
type SystemInfo struct {
	OS string  //操作系统
	Arch string //架构
	GoVersion string //Go版本
	NumCPU int //CPU核心数
	Hostname string //主机名
	ProcessID int //当前进程
}

// GetSystemInfo 获取系统信息
func GetSystemInfo() (*SystemInfo, error) {
	hostname, err := os.Hostname()
	if err != nil {
		return nil, err
	}
	info := &SystemInfo{
		OS:        runtime.GOOS,
		Arch:      runtime.GOARCH,
		GoVersion: runtime.Version(),
		NumCPU:    runtime.NumCPU(),
		Hostname:  hostname,
		ProcessID: os.Getpid(),
	}

	return info, nil
}
```
### 内存使用监控（probe/memory.go）
- 当前分配内存
- 总共分配量
- 系统申请内存
- GC 执行次数
```go
package probe

import (
	"os"
	"runtime"
)

//SystemInfo 封装服务器基础信息
type SystemInfo struct {
	OS string  //操作系统
	Arch string //架构
	GoVersion string //Go版本
	NumCPU int //CPU核心数
	Hostname string //主机名
	ProcessID int //当前进程
}

// GetSystemInfo 获取系统信息
func GetSystemInfo() (*SystemInfo, error) {
	hostname, err := os.Hostname()
	if err != nil {
		return nil, err
	}
	info := &SystemInfo{
		OS:        runtime.GOOS,
		Arch:      runtime.GOARCH,
		GoVersion: runtime.Version(),
		NumCPU:    runtime.NumCPU(),
		Hostname:  hostname,
		ProcessID: os.Getpid(),
	}

	return info, nil
}
```
### 磁盘使用监控（probe/disk.go）
- 总容量 / 已使用 / 可用容量
```go
package probe

import (
	"os"
	"runtime"
)

//SystemInfo 封装服务器基础信息
type SystemInfo struct {
	OS string  //操作系统
	Arch string //架构
	GoVersion string //Go版本
	NumCPU int //CPU核心数
	Hostname string //主机名
	ProcessID int //当前进程
}

// GetSystemInfo 获取系统信息
func GetSystemInfo() (*SystemInfo, error) {
	hostname, err := os.Hostname()
	if err != nil {
		return nil, err
	}
	info := &SystemInfo{
		OS:        runtime.GOOS,
		Arch:      runtime.GOARCH,
		GoVersion: runtime.Version(),
		NumCPU:    runtime.NumCPU(),
		Hostname:  hostname,
		ProcessID: os.Getpid(),
	}

	return info, nil
}
```
### 路由管理：router.go
```go
package probe

import (
	"os"
	"runtime"
)

//SystemInfo 封装服务器基础信息
type SystemInfo struct {
	OS string  //操作系统
	Arch string //架构
	GoVersion string //Go版本
	NumCPU int //CPU核心数
	Hostname string //主机名
	ProcessID int //当前进程
}

// GetSystemInfo 获取系统信息
func GetSystemInfo() (*SystemInfo, error) {
	hostname, err := os.Hostname()
	if err != nil {
		return nil, err
	}
	info := &SystemInfo{
		OS:        runtime.GOOS,
		Arch:      runtime.GOARCH,
		GoVersion: runtime.Version(),
		NumCPU:    runtime.NumCPU(),
		Hostname:  hostname,
		ProcessID: os.Getpid(),
	}

	return info, nil
}
```
### 程序主入口：main.go
```go
package probe

import (
	"os"
	"runtime"
)

//SystemInfo 封装服务器基础信息
type SystemInfo struct {
	OS string  //操作系统
	Arch string //架构
	GoVersion string //Go版本
	NumCPU int //CPU核心数
	Hostname string //主机名
	ProcessID int //当前进程
}

// GetSystemInfo 获取系统信息
func GetSystemInfo() (*SystemInfo, error) {
	hostname, err := os.Hostname()
	if err != nil {
		return nil, err
	}
	info := &SystemInfo{
		OS:        runtime.GOOS,
		Arch:      runtime.GOARCH,
		GoVersion: runtime.Version(),
		NumCPU:    runtime.NumCPU(),
		Hostname:  hostname,
		ProcessID: os.Getpid(),
	}

	return info, nil
}
```
### 启动方式
```bash
go run main.go
```
