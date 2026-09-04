---
title: "Linux 下 dpkg、APT、DNF 与 rpm 的区别"
description: "区分 Debian 与 RPM 系发行版中的底层包工具和依赖管理器，并整理常用命令。"
publishedAt: 2022-04-13
updatedAt: 2026-09-04
type: technical
tags: ["Linux", "命令"]
draft: false
readingMinutes: 3
---

Linux 发行版常见两套软件包生态：Debian/Ubuntu 使用 `.deb`，Fedora/RHEL 使用 `.rpm`。`dpkg` 与 `rpm` 负责本地软件包；APT 与 DNF 在它们之上处理仓库、下载和依赖。

## Debian 与 Ubuntu

### APT

日常交互优先使用 `apt`：

```bash
sudo apt update                 # 刷新软件包索引
apt list --upgradable           # 查看可升级项
sudo apt upgrade                # 升级当前发行版中的软件包
sudo apt install nginx          # 安装
sudo apt remove nginx           # 删除程序，保留部分配置
sudo apt purge nginx            # 同时删除包管理器维护的配置
sudo apt autoremove             # 清理不再需要的依赖
apt search nginx                # 搜索
apt show nginx                  # 查看信息
```

`apt update` 只更新**索引**，不会升级已安装软件，也不能写成 `apt update <package>`。只升级一个包可以执行：

```bash
sudo apt install --only-upgrade nginx
```

`apt` 的输出更适合人在终端阅读；非交互脚本使用稳定接口 `apt-get`，并提前设计错误处理，不要只加 `-y` 后忽略变更内容。

### dpkg

`dpkg` 直接操作本地 `.deb` 文件，不会主动从仓库下载依赖：

```bash
sudo dpkg -i package.deb
dpkg -l
dpkg -L package-name
dpkg -S /path/to/file
sudo dpkg -r package-name
sudo dpkg -P package-name
```

安装本地包时，通常更推荐让 APT 处理依赖：

```bash
sudo apt install ./package.deb
```

注意 `dpkg -r/-P` 接受的是**包名**，不是 `.deb` 文件名。

## Fedora 与 RHEL

### DNF

现代 Fedora 和较新的 RHEL 系发行版使用 DNF。部分系统保留 `yum` 命令作为兼容入口，但新笔记应优先写 DNF：

```bash
sudo dnf check-upgrade
sudo dnf upgrade
sudo dnf install nginx
sudo dnf remove nginx
dnf search nginx
dnf info nginx
sudo dnf clean all
```

安装本地 RPM 并解析依赖：

```bash
sudo dnf install ./package.rpm
```

### rpm

`rpm` 是底层工具，适合查询、校验或直接操作本地包：

```bash
sudo rpm -Uvh package.rpm
rpm -qa
rpm -qi package-name
rpm -ql package-name
rpm -qf /path/to/file
sudo rpm -e package-name
```

直接使用 `rpm` 安装时，需要自行处理缺失依赖。能使用发行版仓库或 DNF 时，不要手工下载一串 RPM。

## 选择原则

- 从仓库安装、升级和删除：使用 APT 或 DNF。
- 查询某个文件属于哪个包：使用 `dpkg -S` 或 `rpm -qf`。
- 检查本地包内容和元数据：使用 `dpkg` 或 `rpm`。
- 不要混用不同发行版的软件包，也不要从不可信来源安装包。
- 升级前查看变更列表；服务器应有快照、备份和回滚方案。

## 参考

- [Ubuntu 软件包管理](https://ubuntu.com/server/docs/package-management/)
- [DNF 命令参考](https://dnf.readthedocs.io/en/latest/command_ref.html)
