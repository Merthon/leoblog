---
title: "Jev Does Not Write Answers. It Makes Decisions for Software"
description: "TypeSafe AI replaces generated prose with typed judgments. Here is what Jev is good for—and why its 'zero hallucinations' claim needs a careful reading."
publishedAt: 2026-09-21
type: technical
tags: ["AI", "Jev", "Agents", "Engineering"]
draft: false
featured: true
readingMinutes: 6
translationKey: jev-decision-model
---

For the past few years, AI models have kept getting better at producing language. TypeSafe AI's new model, Jev, moves in the opposite direction: it does not chat, write code, or generate explanations. It only makes judgments about questions whose answer space is defined in advance.

That sounds like less capability. It may also fill a missing layer in agent systems. Software often does not need another elegant paragraph. It needs to know which tool to call, where to route a message, or whether an action requires human confirmation.

## What Jev is

TypeSafe AI opened early access to Jev on September 15, 2026 and calls it the first public “System One Model.” The name borrows from the fast, intuitive System 1 described in *Thinking, Fast and Slow*. The emphasis is on focused judgments rather than extended reasoning. [Read the official announcement](https://typesafe.ai/blog/introducing-system-one-models-and-jev)

A Jev request contains a `state` to evaluate and a set of questions defined by the developer. The output is not an arbitrary string. It consists of typed values and probability distributions. The [official documentation](https://docs.typesafe.ai/introduction) exposes three question types:

- **Choice** selects one item from a fixed set;
- **Score** places the state on a developer-defined scale;
- **Noul** returns a probability from 0 to 1 for a yes-or-no statement.

For a support ticket, the state might contain a customer's message and account history. One request could ask which team owns the issue, how frustrated the customer appears, and whether the message is urgent. The questions are evaluated independently and in parallel. Ordinary code then decides whether to proceed, request confirmation, or route the case to a person. [Read the API quickstart](https://docs.typesafe.ai/introduction/quickstart)

The division of labor matters. The model handles fuzzy judgments that are awkward to express as rules; the program keeps control of the workflow.

## This is not merely JSON output

A general-purpose language model can also follow a JSON Schema, but it still generates tokens sequentially. Applications must account for missing fields, invalid enums, and malformed output. Jev constrains the output space to declared types and produces the judgments in parallel. TypeSafe therefore claims that the model cannot make type errors.

This is also where the pitch is easiest to misunderstand. **An output that cannot have the wrong shape can still contain the wrong judgment.**

TypeSafe uses the phrase “zero hallucinations,” but in a narrow sense: Jev cannot invent an undeclared option or suddenly return an unparseable essay. It can still route a billing complaint to technical support or assign excessive confidence to an unsafe action. The [official System One documentation](https://docs.typesafe.ai/concepts/system-one) says this directly: calibration is measured across groups of predictions and does not guarantee that any individual answer is correct.

Probabilities and confidence make those errors easier to manage. High-confidence cases can move automatically, the middle range can require confirmation, and low-confidence cases can go to a person or a stronger reasoning model. The threshold should also reflect risk. Opening the wrong screen and approving the wrong transfer should not share one confidence requirement. [Read the confidence guide](https://docs.typesafe.ai/confidence)

## Why agents may need a model that only decides

An agent loop contains fewer genuine writing tasks than it first appears. Many calls are routing decisions: choose a tool, choose a page element, check permission, remove irrelevant context, or select a cheap or powerful model. Using a general-purpose LLM for every small judgment accumulates latency and cost.

Early Jev projects are testing this split. Browser Use's [jev-ultrafast](https://github.com/browser-use/jev-ultrafast) gives Jev an indexed set of browser operations and elements to choose from. A small language model is called only when text must be entered. Its authors show a Google Flights search completing in about 7.1 seconds. That is a project demonstration, not a general benchmark, but the architecture is clear:

```text
code owns state and constraints
Jev handles frequent bounded judgments
a general model plans and writes
people handle low-confidence or high-risk cases
```

Jev is not a replacement for an LLM. It is closer to a decision layer that moves some branches out of long prompts and back into code.

## Treat the remarkable numbers as vendor claims

TypeSafe reports up to **193.6× faster execution and 444.6× lower cost** on its System One workflow evaluations, with typical latency between 70 and 500 milliseconds. It prices input at $0.042 per million tokens and does not charge for output. [Read the company's evaluation notes](https://typesafe.ai/blog/introducing-system-one-models-and-jev)

Those results are compelling, but they are still primarily the vendor's own measurements. The launch post acknowledges several limitations: the demonstration input favors Jev, the workflows were created by members of its model-capabilities team, the headline gains are likely near the high end of real-world results, and the long-term sustainability of the price has not yet been proven. Its workflow evaluation also uses the average prediction of GPT-6 Astra and Claude Fable as a reference rather than an entirely independent ground-truth label.

Jev remains in early access. It accepts text only and does not generate replies, code, or reasoning explanations. The public evidence is enough to show that the interface is unusual; it is not enough to establish reliability in every domain. A production team would still need to measure accuracy, calibration, and failure patterns on its own data.

## The question matters even if the model does not win

The most interesting part of Jev is not the arrival of another model. It challenges the habit of sending every AI task to one conversational system.

Future AI products may look more like mixed systems: deterministic rules remain in code, bounded judgments go to decision models, open-ended analysis and writing go to general models, and people take over when evidence is weak or consequences are high. Each layer has a narrower job and a clearer failure boundary.

If Jev's probabilities remain calibrated on real workloads, it could make some automation much faster and cheaper. Even if Jev itself does not become the dominant model, the idea behind it—decisions are not strings—is worth watching.
