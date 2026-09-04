---
title: "Git 使用笔记"
description: "整理 Git 的工作区、暂存区、提交、分支与远程协作常用命令。"
publishedAt: 2024-11-14
updatedAt: 2026-09-04
type: technical
tags: ["Git"]
draft: false
readingMinutes: 3
---

Git 是分布式版本控制系统。每次提交保存的是项目状态和父提交关系，不只是一个“修改文件列表”。理解工作区、暂存区和提交，比背命令更重要。

## 初始配置

```bash
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
git config --global init.defaultBranch main
git config --list --show-origin
```

`--global` 写入当前用户配置。公司与个人身份不同时，可以在具体仓库中省略 `--global`，覆盖用户名和邮箱。

## 三个区域

- **工作区**：磁盘上正在编辑的文件。
- **暂存区**：下一次提交准备包含的快照，也叫 index。
- **版本库**：`.git` 中保存的对象、引用和历史。

```bash
git status --short
git diff             # 工作区与暂存区
git diff --staged    # 暂存区与 HEAD
git log --oneline --decorate --graph
```

提交前同时看 `git diff` 与 `git diff --staged`，可以避免漏提交或误提交。

## 创建一次提交

```bash
git add path/to/file
git diff --staged
git commit -m "feat: add article search"
```

`git add .` 会暂存当前目录下所有变化，方便但范围较大。混合修改较多时，使用明确路径或 `git add -p` 分块选择。

提交应该是可解释、可验证的最小完整变化。不要把密钥、`.env`、构建产物和临时日志提交进仓库。

## 分支

```bash
git switch -c feature/search
git branch --show-current
git switch main
git merge --no-ff feature/search
```

`git switch` 专门切换分支，语义比承担多种职责的 `git checkout` 更清楚。

## 远程仓库

```bash
git remote -v
git fetch origin
git pull --ff-only
git push -u origin main
```

- `fetch` 只下载远程引用，不修改工作区。
- `pull` 等于获取后再整合；`--ff-only` 可以避免意外生成合并提交。
- 第一次推送使用 `-u` 建立上游关系，以后直接 `git push`。

默认分支不一定叫 `main`。执行推送前用 `git branch --show-current` 和 `git remote -v` 确认目标。

## 撤销时先判断是否共享

```bash
git restore path/to/file          # 丢弃未暂存修改
git restore --staged path/to/file # 取消暂存，保留工作区修改
git commit --amend                # 修改尚未共享的最近提交
git revert <commit>               # 用新提交撤销已共享提交
```

`restore` 和 `reset --hard` 都可能丢失未保存内容，执行前先看 `git status` 和 diff。已经推送给他人使用的历史优先 `revert`，不要随意强制改写。

## 参考

- [Pro Git](https://git-scm.com/book/zh/v2)
- [Git 命令参考](https://git-scm.com/docs)
