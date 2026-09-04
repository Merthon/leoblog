---
title: "Git 使用笔记"
description: "Git是一个开源的分布式版本控制系统，用于敏捷高效地处理任何项目。"
publishedAt: 2024-11-14
type: technical
tags: ["Git"]
draft: false
readingMinutes: 2
---
## Git笔记

#### 1.概述

  Git是一个开源的分布式版本控制系统，用于敏捷高效地处理任何项目。

#### 2.配置

###### 2.1 用户信息配置

```bash
$ git config --global user.name "名称"
$ git config --global user.email 邮箱
```

  如果用了**--global**选项，那么配置文件就在用户主目录下，以后所有项目就会默认使用这里配置的用户信息。

  新的设定保存在~/.gitconfig文件里

###### 2.2 查看配置

``` bash
$ git config --list
```


#### 3.Git工作流程

+ 克隆Git资源作为工作目录。
+ 在克隆的资源上添加或者修改文件。
+ 如果其他人修改了你可以更新资源。
+ 在提交前查看修改。
+ 提交
+ 修改完成后，如果发现错误，可以撤回提交再次修改并提交。

#### 4. 工作区，暂存区，版本库

+ 工作区：就是在自己电脑看的见的目录
+ 暂存区：英文叫stage或index，一般存放在.git目录中的index（.git/index）中，也叫索引。
+ 版本库：隐藏目录.git，是Git的版本库。

#### 5.实际操作

##### 5.1 初始化仓库

要使用git进行版本控制，必须初始化仓库。

```bash
git init
```

  初始化成功之后就会在执行git init命令的目录下生成一个.git目录，这个目录存储着管理当前目录内容所需要的仓库数据。在git中我们把这个内容叫做：***附属于该仓库的工作树***

##### 5.2 查看仓库状态

工作树和仓库在被操作的过程中，状态是不断发生变化的，随时查看状态

``` bash
git status
```

##### 5.3 暂存区添加文件

  要想让文件成为Git仓库的管理对象，就需要将其加入暂存区中，暂存区是提交之前的一个临时区域。

``` bash
git add .
```

##### 5.4 保存仓库历史记录

``` bash
git commit
```

git commit可以将当前暂存区的文件实际保存到仓库的历史记录中

``` bash
git commit -m "frist commit"
```

-m参数后的"frist commit"叫做提交信息，是对这个提交的概述。(*提交信息要有意义！)

##### 5.4 提交日志

  ``` bash
  git log
  ```

可以看以往仓库中提交的日志

##### 5.5 查看更改差别

``` bash
git diff
```

git diff命令可以查看工作树，暂存区，最新提交的差别。

在执行git commit命令之前先执行git diff HEAD命令，查看本次提交与上次提交有什么差别，等确认之后在提交。（HEAD是指向当前分支中最新的一次提交的指针）5.6

##### 5.6 推送至Github

~~~ bash
git push -u origin master
~~~
