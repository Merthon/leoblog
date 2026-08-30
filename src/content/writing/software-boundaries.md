---
title: 软件设计中的边界感
description: 好的设计不是追求万能，而是清楚知道不做什么。
publishedAt: 2026-08-12
type: technical
tags: [技术, 设计]
readingMinutes: 10
relatedReadings: [philosophy-of-software-design]
---

边界感让系统更可控，也让团队更高效。

## 先明确职责

模块的价值不在于封装了多少代码，而在于隐藏了多少不必要的复杂性。一个边界应该让调用者少知道一些，而不是换一种方式知道全部。

## 拒绝万能抽象

抽象不是越通用越好。只有当变化方向已经被真实案例证明时，额外的扩展点才有意义。
