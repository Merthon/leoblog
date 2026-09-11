---
title: "When AI Takes Over a Whole Piece of Work"
description: "What long-running agents change about delegation, verification, and the programmer’s role."
publishedAt: 2026-09-04
type: essay
tags: ["AI", "Agents", "Essay"]
draft: false
featured: false
readingMinutes: 3
translationKey: ai-agents-take-over-work
---

I used to give AI very small questions: explain an error, finish a function, compare two approaches. When the conversation ended, the work was still in my hands.

That boundary is changing. An agent can read a repository, run commands, edit files, and keep working from test results. What a person delegates is no longer a question. It is a piece of work.

## When tasks become longer

In an internal study, OpenAI reported that in May 2026 more than 70% of active users had delegated tasks to Codex that would take a person over an hour. A small group of the heaviest users ran many hours of agent work in parallel each day. The sample only covers OpenAI’s own teams, so it cannot represent every company, but the direction is clear: the unit of AI use is shifting from an answer to a delegation. [Read the study](https://openai.com/index/how-agents-are-transforming-work/)

Running longer does not mean working correctly. An agent can spend three hours executing an initial misunderstanding with impressive consistency. The longer the task, the more intermediate state it creates—and the less reason we have to trust a final message that simply says “done.”

This changes how I think about the programmer’s value. Implementation still matters, but another set of skills becomes scarce: defining the goal, designing the checks, and noticing mistakes before they become expensive.

## Verification becomes the main job

In scientific computing, AI is already helping researchers maintain legacy software, add tests, and implement experimental code. OpenAI’s research also suggests that verification is becoming the new bottleneck, and that it still depends on human judgment. [Read the report](https://openai.com/index/scientific-computing-agentic-ai/)

The same pattern appears in everyday development. “Optimize this project” rarely produces a stable outcome. Give the agent a performance baseline, test commands, protected boundaries, and acceptance criteria, and it starts to behave like a reliable collaborator.

I increasingly want these things ready before delegation:

- repeatable tests and checks;
- an explicit permission boundary and reversible history;
- clear points where the agent must stop and ask;
- output that explains evidence instead of merely claiming success.

They are less exciting than generated code, but they determine how far an agent can safely go.

## The work I want to keep

I do not mind handing more execution to AI. Repetitive migrations, research organization, and test coverage consume attention without always using much judgment. My concern is that someone who sees only final results may eventually lose the ability to tell a good result from a bad one.

The balance I want is simple: let AI carry more of the procedural weight while people keep direction, trade-offs, and acceptance. I do not need to type every line, but I should understand why the system works and be able to take over when it drifts.

Long-running agents may change less about typing speed than about how we describe work. Vague requirements used to frustrate colleagues. Soon they may send a tireless group of agents running in the wrong direction at once.
