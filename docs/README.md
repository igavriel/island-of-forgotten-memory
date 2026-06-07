# Documentation index

Lightweight project documentation for *Island of the Lost Memory*. The main project overview for lecturers and reviewers is in the [root README.md](../README.md).

## Core docs

| File | Purpose |
| --- | --- |
| [progress.md](progress.md) | Current status: what works, what is partial, what is missing, known limits, and the prototype goal |
| [decisions.md](decisions.md) | Locked-in design and technical decisions |
| [next-steps.md](next-steps.md) | Prioritized future work |
| [changelog.md](changelog.md) | Short, dated list of meaningful changes |

## Agentic development

Workflow used on this project: **Plan mode** (written plan) → **review** → **correction** → **Agent mode** (implementation) → **results review**. See the root [README.md](../README.md#agentic-development-workflow).

| File | Purpose |
| --- | --- |
| [../AGENTS.md](../AGENTS.md) | Instructions for AI agents (Cursor / Codex) working on this repo |
| `.cursor/rules/` | Always-on constraints (static site, RTL, workflow, commits) |
| `.cursor/skills/` | Task-specific implementation guides |

## Guides

| File | Purpose |
| --- | --- |
| [assets.md](assets.md) | How to add images, categories, and question data |
| [playtest.md](playtest.md) | Manual playtesting and balancing settings |
| [sailing-layout-krita.md](sailing-layout-krita.md) | Tuning `SAILING_LAYOUT` (percent positions for sea, island, ship, dock) |

## Workflow (for developers)

1. Before changing code: read `progress.md` and `next-steps.md`.
2. After a meaningful change: update `progress.md` and `changelog.md`.
3. If a decision changes: update `decisions.md`.
4. If future work changes: update `next-steps.md`.

Keep entries brief. Do not write long documentation.
