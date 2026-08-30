---
title: 知识库检索系统
description: 使用混合检索提升答案命中率。
status: building
stack: [Python, FastAPI, Milvus]
startedAt: 2026-06-15
updatedAt: 2026-07-30
problem: 在长文档中稳定找到与问题相关的证据片段。
decisions: [BM25 与向量混合检索, 重排, 答案引用]
---

这个项目用于验证混合检索在中文知识库中的效果。

## 当前状态

基础检索链路已经完成，正在补充评测集与重排策略。
