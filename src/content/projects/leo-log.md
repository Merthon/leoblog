---
title: leoblog
description: 用于长期保存写作、阅读记录与项目复盘的个人网站。
status: building
stack: [Astro, TypeScript, MDX]
startedAt: 2026-08-21
updatedAt: 2026-09-04
repository: https://github.com/Merthon/leoblog
problem: 如何长期保存写作、阅读记录与项目复盘。
decisions: [内容优先, 静态生成, 保持可迁移]
featured: true
relatedWriting: []
relatedReadings: []
---

leoblog 是这个网站本身，也是一次关于长期维护的实践。

## 目标

它不追求成为复杂的内容平台，只需要稳定承载文章、读书笔记、项目和当前状态。

## 关键取舍

- 使用 Astro 静态生成，默认不向浏览器发送不必要的 JavaScript。
- 内容保存在 Markdown 中，脱离框架仍然可读。
- 不引入数据库与 CMS，提交代码即可发布。
