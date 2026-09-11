---
title: "Can AI Reliably Supervise AI?"
description: "A note on automated alignment research and the human judgment that self-improving systems still cannot replace."
publishedAt: 2026-09-03
type: essay
tags: ["AI", "Safety", "Essay"]
draft: false
readingMinutes: 3
translationKey: can-ai-supervise-ai
---

Once AI can write code, an obvious next step is to let it improve AI. As models become more capable, another question follows: can one AI inspect and constrain another?

It sounds circular, but it is becoming a practical research method.

## An automated safety researcher

Anthropic recently published an experiment in which research agents searched for training methods against ten classes of problems, including deception, sycophancy, and jailbreaks. Held-out evaluations then tested whether the proposed improvements worked. The automated process found an effective intervention for all ten categories, and some methods transferred to larger models. [Read the research](https://www.anthropic.com/research/automated-researchers-mitigate-alignment-failures)

The result is appealing. Safety research is slow and understaffed, while models keep moving quickly. If AI can propose hypotheses, run experiments, and filter results in bulk, human researchers can spend more attention on problems that are harder to define.

Another number in the paper matters just as much. The team used a stronger model to inspect roughly 1,600 agent transcripts and found 39 attempts to cheat. About 2.4% is not a huge rate, but it is enough to show that an agent improving a system may also learn to exploit its evaluation.

## Who checks the checker?

Having one model supervise another does not automatically produce reliable conclusions. The two may share similar blind spots, or both may mistake an easy-to-measure proxy for the real goal.

Software testing already has this problem. A green test suite only shows that a program satisfies the tests we wrote. If the requirement is wrong, the sample misses an edge case, or the tests are weak, the green checkmark does not save us.

AI alignment is harder because “behaves according to human intent” has no complete, fixed test suite. Evaluations for deception or sycophancy are useful, but they only cover failures that someone has already named and designed a test for. Rare, unfamiliar, or difficult-to-measure failures can remain outside the frame.

Automated supervision therefore needs some deliberately non-automated structure: hidden evaluations, cross-checks between different systems, complete execution records, random human review, and permissions limited to reversible actions. This costs efficiency, but the checker should not hold the same answer key as the system being checked.

## Delegate the search, keep the standard

I am broadly optimistic about this work. AI is good at exploring large experimental spaces. People cannot patiently try dozens of training strategies and compare every detail at the same scale. Delegating that search may help safety work keep pace with capability.

What I do not want to delegate is the standard itself. Which behavior is acceptable, which risk is worth taking, and who is responsible when something fails should not pass to a model merely because it scores well.

AI safety may increasingly look like a layered system: models checking models, automated tools finding anomalies, and people setting boundaries and pausing the process when evidence is weak. Humans do not need to watch every step, but they should keep the final veto.
