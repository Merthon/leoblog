---
title: "Commit 规范"
description: "在开发中，使用一致的 Git commit 规范 可以帮助团队成员理解每个提交的目的和内容。"
publishedAt: 2025-02-09
type: technical
tags: ["Git"]
draft: false
readingMinutes: 2
---
在开发中，使用一致的 **Git commit 规范** 可以帮助团队成员理解每个提交的目的和内容。常见的 **commit 规范** 包括：

### 1. **常见的 Commit Message 格式**

一般采用 **简短** 但具有描述性的方式来撰写 commit 信息，通常使用以下格式：

php-template

复制编辑

`<类型>(<范围>): <描述>`

- `<类型>`：表示 commit 的类型，通常是以下之一：

    - `feat`: 新功能
    - `fix`: 修复问题
    - `docs`: 文档修改
    - `style`: 代码格式调整（不影响功能）
    - `refactor`: 代码重构
    - `perf`: 性能优化
    - `test`: 测试相关的修改
    - `chore`: 其他杂项修改（如构建工具、CI 配置等）
- `<范围>`（可选）：表示此次提交的影响范围，比如具体模块、功能名等。

- `<描述>`：简洁描述提交的内容，通常首字母小写，不超过 50 个字符，且避免使用句号。


### 2. **实例**

- `feat(user): add user authentication`
- `fix(auth): resolve login issue`
- `docs(readme): update installation instructions`
- `style(ui): format buttons on homepage`
- `refactor(core): optimize data processing logic`
- `perf(query): improve search performance`
- `test(api): add unit tests for user routes`
- `chore(deps): update dependency versions`

### 3. **消息模板**

一个常见的 commit 信息模板可以是：

php-template

复制编辑

`<类型>(<模块>): <简要描述>  详细描述（可选，解释为什么要进行这次修改）。`

例如：

pgsql

复制编辑

`feat(auth): add JWT authentication  Implemented JWT-based authentication to improve security and scalability of the user authentication process.`

### 4. **其他注意事项**

- **单一职责**：每次提交应尽量只包含一个功能的修改。
- **避免“大块提交”**：提交前确保你所提交的内容有清晰的目标，避免过大的提交。
- **分支管理**：通常会使用 **feature branches**（功能分支），每个功能或任务都对应一个独立的分支，以保证每个 commit 都是有意义的。

如果你的团队或项目有特定的 **commit 规范**，可以根据这些规则来调整自己的提交格式。
