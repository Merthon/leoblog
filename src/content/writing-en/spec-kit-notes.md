---
title: "Practical Notes on Spec Kit"
description: "What Spec Kit does, how to use it with Codex, and how specifications, plans, tasks, and code fit into everyday development."
publishedAt: 2026-10-19
type: technical
tags: ["AI Coding", "Spec Kit", "SDD", "Codex"]
draft: false
featured: true
readingMinutes: 8
translationKey: spec-kit-notes
---

My first question about Spec Kit was fairly simple: is this a development tool, or just a way to spend more time talking to an AI before it writes code?

The difference shows up in the repository. Spec Kit supplies a CLI, templates, scripts, and coding-agent integrations. Discussions become specifications, plans, and task lists that guide subsequent implementation.

These notes use Codex and an order-export feature as an example. Commands follow the official documentation available on October 19, 2026; syntax can vary by version, agent, and integration mode.

## Who does what

[Spec Kit](https://github.com/github/spec-kit) is GitHub's open-source toolkit for structured development processes. Its core supports Spec-Driven Development, or SDD, with optional bug-fixing and idea-assessment processes available separately.

It does not supply a new code-generation model or become a runtime dependency of the application. The coding agent still edits files and runs tools.

| Participant | Responsibility |
| --- | --- |
| Developer | Define the goal, resolve questions, approve trade-offs, review results |
| Spec Kit | Supply stage instructions, templates, scripts, and process structure |
| Coding agent | Read the repository, maintain artifacts, implement code, run checks |
| Tests and CI | Enforce executable rules and expose actual failures |

That final row matters. A specification saying “authorization is correct” does not establish that an export endpoint prevents unauthorized access.

## Install and initialize

The following uses the supported PyPI installation route. It requires Python 3.11 or later and an existing `uv` installation. Teams can pin a release using the [installation guide](https://github.github.io/spec-kit/installation.html) to avoid differences between developer environments.

Run these in a terminal:

```bash
uv tool install specify-cli
specify version

# Create a project with the Codex integration
specify init order-service --integration codex
cd order-service
```

Installing the `specify` executable and initializing a repository are separate operations.

For an existing project, save current work and create an adoption branch first. From its root:

```bash
specify init --here --force --integration codex
git diff
git status --short
```

The force flag can overwrite conflicting managed files. Review new, untracked files as well as the diff. Initialization does not reconstruct all existing requirements or rewrite the application; the [existing-project guide](https://github.github.io/spec-kit/guides/existing-projects.html) recommends starting with a bounded change.

These are usage examples. There is no need to copy Spec Kit's source repository into the application.

## Use it from Codex

The [Codex integration](https://github.github.io/spec-kit/reference/integrations.html) installs skills under `.agents/skills/` and uses `$speckit-<stage>`. Copilot's default `/speckit-<stage>` syntax and the dotted notation found in some references are not interchangeable in every host.

Open the target project in Codex and confirm that the skills are available. The examples below belong in the agent's conversation, not in a shell.

Establish project rules first:

```text
$speckit-constitution
Follow existing layering and code style. Avoid unnecessary dependencies.
Authorization changes require tests for both allowed and denied access.
Preserve existing API compatibility and run the repository's established checks.
```

Use principles the team actually intends to enforce. A template is not a reason to declare a sudden migration to microservices or mandatory TDD.

Then describe a feature:

```text
$speckit-specify
Add CSV export to order management.
Export only orders the current user may view, with date and status filters.
Scheduled exports are out of scope. Specify the feature without implementing it.
```

Before choosing a CSV library, settle the behavior: the current page or all matching results? Which columns? What happens when the export exceeds its limit?

```text
$speckit-clarify
Resolve export scope, row limits, columns, and failure behavior.
```

After reviewing the requirements, plan the implementation. Assuming the existing project uses Java:

```text
$speckit-plan
Keep the existing Spring Boot and PostgreSQL architecture.
Reuse authorization and order-query logic. Do not add a separate service.
Assess memory use for large results and CSV formula injection, and document handling.
```

These are example constraints, not technology requirements imposed by Spec Kit.

## Move from artifacts to code

Run the following stages individually, reviewing each result before continuing:

| Codex instruction | What to review |
| --- | --- |
| `$speckit-tasks` | Task ordering and necessary test work |
| `$speckit-analyze` | Conflicts or gaps across requirements, plans, and tasks |
| `$speckit-implement` | Code changes and actual check results |
| `$speckit-converge` | Work still missing from the implementation |

The [command reference](https://github.github.io/spec-kit/reference/agentic-sdd.html) distinguishes read-only consistency analysis from implementation. Convergence does not repair code itself: it appends missing tasks for another implementation pass. A requirements-quality checklist is not a test report.

For larger features, I would constrain the next implementation step:

```text
$speckit-implement
Implement only the export endpoint and authorization tests. Do not change the frontend.
Report changed files, tests run, and unverified behavior, then stop.
```

This leaves a manageable review: does the query apply the correct access restriction? Do tests attempt cross-user access? Does CSV generation load every matching order into memory? Those questions reveal more than a fully checked task list.

## What appears in the repository

After the relevant stages, a Codex-based project might look like this. The feature name and application directories are illustrative:

```text
order-service/
├── .agents/skills/            # Codex stage instructions
├── .specify/                 # Rules, templates, scripts, and process state
├── specs/
│   └── order-export/
│       ├── spec.md           # Intended behavior and boundaries
│       ├── plan.md           # Implementation approach
│       └── tasks.md          # Work items and progress
├── src/
└── tests/
```

Additional design artifacts may be generated. They accumulate through the workflow, rather than appearing as a complete specification at installation time.

The current [quickstart](https://github.github.io/spec-kit/quickstart.html) also describes active-feature tracking through `.specify/feature.json`. Switching Git branches alone does not select another feature for the workflow. Check the active directory when moving between features.

Markdown can be edited directly or through the agent. Conversation is not the only way to maintain these files.

## Conversation is the interface, not the entire record

With repository access, Codex can load a skill's instructions and use the relevant files and scripts. [OpenAI's skills documentation](https://learn.chatgpt.com/docs/build-skills) describes explicit invocation and task-based matching. For a particular workflow stage, I prefer naming the skill.

A chat environment without repository tools can help draft requirements, but the same text does not grant it access to local files. Installing Spec Kit also does not automatically route every future conversation through its process.

Keeping artifacts aligned takes deliberate work. If an export limit changes from 10,000 to 50,000 rows, updating a constant may not be enough. Revisit interface behavior, memory strategy, and test data where the new limit affects them.

The [spec-evolution guide](https://github.github.io/spec-kit/guides/evolving-specs.html) offers different maintenance models: retain historical feature records, maintain a living specification, or reconcile implementation discoveries back into the artifacts. Choose a convention so one developer does not mistake a historical document for the current contract.

I would review relevant documents alongside code. A new agent session should receive the feature directory, current task, and change boundaries rather than being expected to remember earlier conversations.

## When the process earns its cost

My preference is to use this workflow for authorization-sensitive changes, work spanning several modules, complex acceptance conditions, or features that require long-term handover. A typo fix or disposable experiment rarely needs the full sequence.

Incorrect requirements remain incorrect after templating. Agent self-review is not an independent security audit. Keep credentials and private customer data out of specifications, and inspect third-party extensions before running them.

For a first trial, choose one independently testable feature. Then ask whether early review reduced rework and whether the documents helped with the next change. If neither improved, shorten the process instead of adding more templates.
