---
title: "Commit 规范"
description: "用 Conventional Commits 组织提交标题、正文和破坏性变更说明。"
publishedAt: 2025-02-09
updatedAt: 2026-09-04
type: technical
tags: ["Git", "工程实践"]
draft: false
readingMinutes: 3
---

提交信息的目标是让后来的人快速回答两个问题：改了什么，为什么要改。本文采用 Conventional Commits 的基本格式，但团队约定永远优先于个人习惯。

## 基本格式

```text
<type>[optional scope][!]: <description>

[optional body]

[optional footer]
```

常用类型：

- `feat`：新增对用户可见的能力。
- `fix`：修复缺陷。
- `docs`：只改文档。
- `refactor`：不改变外部行为的结构调整。
- `perf`：性能优化。
- `test`：补充或修正测试。
- `build`：构建系统或外部依赖。
- `ci`：持续集成配置。
- `chore`：无法归入以上类型的维护工作。

`style` 只表示不影响语义的格式修改，不是 UI 样式功能。

## 示例

```text
feat(search): add keyboard navigation
fix(auth): reject expired refresh tokens
docs(readme): document local setup
refactor(storage): isolate cache adapter
```

标题使用祈使语气，直接描述变化。是否限制在 50 或 72 个字符取决于团队工具，不必为了机械凑长度牺牲准确性。

## 解释为什么

复杂修改在正文中说明背景、取舍和行为变化：

```text
fix(queue): prevent duplicate delivery after timeout

Keep the delivery record until the retry window expires. Removing it as
soon as the worker times out allowed a second worker to claim the same job.

Refs: #184
```

正文不需要复述 diff。代码已经说明“怎么改”，提交信息更适合记录当时的约束与原因。

## 破坏性变更

在类型后加 `!`，并在 footer 中解释迁移方法：

```text
feat(api)!: remove legacy token endpoint

BREAKING CHANGE: clients must use /oauth/token. Existing refresh tokens
remain valid until their original expiry time.
```

`BREAKING CHANGE` 不能只说“有破坏性变化”，要说明受影响对象、替代方案和迁移窗口。

## 提交粒度

一个好提交通常满足：

- 只处理一个明确问题。
- 能独立构建和测试。
- 不夹带无关格式化。
- 不包含密钥、生成物和调试日志。
- 回滚时不会顺带撤销无关功能。

如果标题里需要用“以及”连接两个互不相关的变化，通常应该拆成两个提交。

## 参考

- [Conventional Commits 1.0.0](https://www.conventionalcommits.org/zh-hans/v1.0.0/)
- [Git：提交变更](https://git-scm.com/book/zh/v2/Git-基础-记录每次更新到仓库)
