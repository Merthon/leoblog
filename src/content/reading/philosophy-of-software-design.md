---
title: 《软件设计的哲学》
author: John Ousterhout
status: finished
finishedAt: 2026-08-27
publishedAt: 2026-08-27
takeaway: 好的软件来自清晰的思考与持续的简化。
tags: [设计哲学]
relatedWriting: [how-to-write-complex-problems, software-boundaries]
relatedProjects: [leo-log]
---

复杂性不是代码数量，而是理解和修改系统时必须同时装进脑中的信息量。

## 深模块

好的模块用小接口隐藏大量实现细节。接口越简单，使用者需要承担的认知成本越低。

## 异常不是免费的

通过重新定义语义消除异常，往往比增加更多错误分支更有效。
