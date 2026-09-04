---
title: "Linux 下 dpkg、apt-get、yum 与 rpm 的区别"
description: "rpm 是由 RedHat 开发的软年包管理方式，使用 rpm 我们可以方便的进行软件的安装，查询，卸载，升级等工作。"
publishedAt: 2022-04-13
type: technical
tags: ["笔记", "Linux", "命令"]
draft: false
readingMinutes: 4
---
### 1.Linux 派系

- RedHat 系列：RedHat，CentOS，Fedora 等
- Debian 系列：Debian，Ubuntu 等

### 2.RedHat 系列

#### rpm

rpm 是由 RedHat 开发的软年包管理方式，使用 rpm 我们可以方便的进行软件的安装，查询，卸载，升级等工作。常见的安装包格式 rpm 包，安装 rpm 的命令是”rpm -参数 安装包名“。如：

```
安装命令：

sudo rpm -ivh 安装包.rpm

卸载命令：

sudo rpm -e 安装包.rpm
```

但是 rpm 软件包之间的依赖性问题往往会很繁琐，尤其是软件由多个 rpm 包组成时，所以 yum 的优势就体现出来了。

#### yum

Yum（全称为 Yellow dog Updater, Modified）是一个在 Fedora 和 RedHat 以及 SUSE 中的 Shell 前端软件包管理器。基於 RPM 包管理，能够从指定的服务器自动下载 RPM 包并且安装，可以自动处理依赖性关系，并且一次安装所有依赖的软体包，无须繁琐地一次次下载、安装。yum 提供了查找、安装、删除某一个、一组甚至全部软件包的命令，而且命令简洁而又好记。弊端是必须联网，且源不出问题，yum 的源就相对脆弱一些。

```
yum [options] [command] [package ...]
```

##### 常用命令：

- 列出所有可更新的软件清单命令：**yum check-update**
- 更新所有软件命令：**yum update**
- 仅安装指定的软件命令：**yum install <package_name>**
- 仅更新指定的软件命令：**yum update <package_name>**
- 列出所有可安裝的软件清单命令：**yum list**
- 删除软件包命令：**yum remove <package_name>**
- 查找软件包命令：**yum search <keyword>**
- 清除缓存命令:
  - **yum clean packages**: 清除缓存目录下的软件包
  - **yum clean headers**: 清除缓存目录下的 headers
  - **yum clean oldheaders**: 清除缓存目录下旧的 headers
  - **yum clean, yum clean all (= yum clean packages; yum clean oldheaders)** :清除缓存目录下的软件包及旧的 headers

### 3.Debian 系列

#### dpkg

dpkg 是 Debian Package 的简写。为 Debian 专门开发的套件管理系统，方便软件的安装、更新及移除。所有源自 Debian 的 Linux 发行版都使用 dpkg，例如 Ubuntu、Knoppix 等。

常见的安装包格式 deb 包，安装 deb 包的命令是“dpkg -参数 安装包名”。如：

```
安装命令：

    Sudo dpkg –i 安装包.deb

卸载命令：

    Sudo dpkg –P 安装包.deb
```

#### apt

apt（Advanced Packaging Tool）是一个在 Debian 和 Ubuntu 中的 Shell 前端软件包管理器。apt 命令提供了查找、安装、升级、删除某一个、一组甚至全部软件包的命令，而且命令简洁而又好记。**apt 命令执行需要超级管理员权限(root).**

```
apt [options] [command] [package ...]
```

##### apt 常用命令

- 列出所有可更新的软件清单命令：**sudo apt update**

- 升级软件包：**sudo apt upgrade**

  列出可更新的软件包及版本信息：**apt list --upgradeable**

  升级软件包，升级前先删除需要更新软件包：**sudo apt full-upgrade**

- 安装指定的软件命令：**sudo apt install <package_name>**

  安装多个软件包：**sudo apt install <package_1> <package_2> <package_3>**

- 更新指定的软件命令：**sudo apt update <package_name>**

- 显示软件包具体信息,例如：版本号，安装大小，依赖关系等等：**sudo apt show <package_name>**

- 删除软件包命令：**sudo apt remove <package_name>**

- 清理不再使用的依赖和库文件: **sudo apt autoremove**

- 移除软件包及配置文件: **sudo apt purge <package_name>**

- 查找软件包命令： **sudo apt search <keyword>**

- 列出所有已安装的包：**apt list --installed**

- 列出所有已安装的包的版本信息：**apt list --all-versions**
