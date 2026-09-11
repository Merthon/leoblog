---
title: leoblog
description: A personal website for keeping writing, reading notes, and project retrospectives over the long term.
status: building
stack: [Astro, TypeScript, MDX]
startedAt: 2026-08-21
updatedAt: 2026-09-04
repository: https://github.com/Merthon/leoblog
problem: How can I keep writing, reading notes, and project retrospectives useful over time?
decisions: [Content first, Static generation, Portable by default]
featured: true
relatedWriting: []
relatedReadings: []
translationKey: leo-log
---

leoblog is this website itself, and an experiment in building something that can be maintained for years.

## Goal

It is not meant to become a complicated publishing platform. It only needs to hold essays, reading notes, projects, and a snapshot of what I am doing now.

## Key decisions

- Use Astro for static generation and send no unnecessary JavaScript to the browser.
- Keep content in Markdown so it remains readable outside the framework.
- Avoid a database and CMS. A Git push is enough to publish.
