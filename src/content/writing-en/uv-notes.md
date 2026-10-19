---
title: "Practical uv Notes and Common Commands"
description: "Installing uv, managing Python projects and tools, understanding lockfiles, and troubleshooting proxies, indexes, and environments."
publishedAt: 2026-10-19T12:43:22+08:00
type: technical
tags: ["Python", "uv", "Tools", "Dependencies"]
draft: false
featured: true
readingMinutes: 10
translationKey: uv-notes
---

The `uv tool install` command in [Spec Kit's setup](/en/writing/spec-kit-notes/) led me to another useful distinction: one tool can manage Python projects and command-line applications without putting their dependencies in the same environment.

[uv](https://docs.astral.sh/uv/) is Astral's Python package and project manager, written in Rust. It manages interpreters, virtual environments, dependencies, and standalone tools. Understanding where a package is installed matters more than memorizing every subcommand.

These examples use uv 0.13.1 and a macOS/Linux shell. Python 3.12 is an example, not a universal recommendation. Commands are grouped by purpose; do not execute the entire article as one script.

## Installation and verification

Check for an existing installation:

```bash
command -v uv
uv --version
uvx --version
```

An empty result from `command -v` means the executable is not on the current `PATH`, not that it cannot exist elsewhere.

On macOS or Linux, download and inspect the [official standalone installer](https://docs.astral.sh/uv/getting-started/installation/) before executing it:

```bash
curl -LsSf https://astral.sh/uv/install.sh -o uv-install.sh
less uv-install.sh
# Run after reviewing the script
sh uv-install.sh
```

The installer may update shell startup files for `PATH`. Set `UV_NO_MODIFY_PATH=1` if the path is already configured and those edits are unwanted. Follow its environment instructions or reopen the terminal if the command is not found afterward.

Homebrew users can alternatively run:

```bash
brew install uv
```

Choose one installation route. On my older macOS system, Homebrew proposed upgrading several build dependencies, so I used the standalone installer instead. That is not a problem every Mac will encounter.

Keep upgrades consistent with the installation method: `uv self update` for the standalone installer, or `brew upgrade uv` for Homebrew.

## Three workflows to keep separate

| Use case | Main commands | What they manage |
| --- | --- | --- |
| Ongoing Python project | `uv add`, `uv run`, `uv sync` | Project declarations, lockfile, and environment |
| Existing requirements workflow | `uv venv`, `uv pip install` | A selected or discovered virtual environment |
| Standalone CLI application | `uv tool install`, `uvx` | An environment separate from the project |

`uv add requests` declares a project dependency. `uv pip install requests` installs into an environment; it does not establish that the package has been recorded in `pyproject.toml` and `uv.lock`.

## Start with a small project

Prepare an interpreter and a minimal project:

```bash
uv python install 3.12
uv init --bare --python 3.12 uv-demo
cd uv-demo
uv python pin 3.12
uv add requests
```

Using `--bare` avoids relying on the default application scaffold. Create `main.py` yourself:

```python
import requests

response = requests.get("https://example.com", timeout=10)
response.raise_for_status()
print(response.status_code)
```

Run it with:

```bash
uv run main.py
```

Normally, project commands do not require manual virtual-environment activation. `uv run` uses the project environment and, by default, checks locking and synchronization. The [project guide](https://docs.astral.sh/uv/guides/projects/) explains the associated files:

| File or directory | Purpose | Version control |
| --- | --- | --- |
| `pyproject.toml` | Metadata, compatible Python range, dependency declarations | Commit |
| `uv.lock` | Resolved dependency versions and related information | Normally commit for uv-managed projects |
| `.python-version` | Development interpreter request | Commit when sharing the choice with the team |
| `.venv/` | Machine-local virtual environment | Ignore |

Let uv maintain the lockfile. After cloning a project, synchronize its environment rather than copying someone else's `.venv`.

## Python versions and dependencies

Common interpreter operations:

```bash
uv python list --only-installed  # List installed interpreters
uv python find 3.12              # Locate a matching interpreter
uv python install 3.12           # Install the requested series
uv python pin 3.12               # Record the local version request
uv run python --version         # Verify the project's interpreter
```

`.python-version` selects a development interpreter; `requires-python` in `pyproject.toml` declares compatibility. Check both before changing versions. uv can discover existing Python installations and download missing interpreters on demand. Use `--no-python-downloads` when automatic downloads are inappropriate. See [Python management](https://docs.astral.sh/uv/guides/install-python/).

Project dependency operations:

```bash
uv add requests                  # Runtime dependency
uv add 'requests>=2.32,<3'        # Explicit version range
uv add --dev pytest ruff         # Development dependencies
uv remove requests              # Remove a runtime dependency
uv remove --dev ruff             # Remove a development dependency
uv tree                         # Inspect the dependency tree
```

These are separate examples, not instructions to add and immediately remove everything. The [dependency guide](https://docs.astral.sh/uv/concepts/projects/dependencies/) covers declarations, groups, and sources. Keep recurring test and lint tools in development dependencies to share their versions:

```bash
uv run pytest
uv run ruff check .
```

## Locking, synchronization, and upgrades

Locking resolves dependencies; synchronization installs the selected project requirements. Default synchronization can update the lockfile when declarations require it.

```bash
uv lock                         # Generate or update the lockfile
uv lock --check                 # Check agreement with project metadata
uv sync --locked                # Fail rather than update an outdated lockfile
uv run --locked pytest          # Run tests with the reviewed dependency set
```

`--frozen` also avoids lockfile updates, but skips the freshness check. For CI that must catch disagreement between declarations and the lockfile, `--locked` is usually a better fit. Neither option means offline mode.

Request upgrades explicitly:

```bash
uv lock --upgrade-package requests
uv sync --locked

# Use only when deliberately upgrading the full dependency set
uv lock --upgrade
uv sync --locked
```

Upgrades still respect declared constraints. Also, `uv sync` is exact by default: it can remove packages outside the selected project dependency set. Losing a manually installed package during synchronization is not necessarily a bug. See [locking and syncing](https://docs.astral.sh/uv/concepts/projects/sync/).

## Existing projects and standalone scripts

A requirements-based project need not migrate immediately:

```bash
uv venv --python 3.12
uv pip install -r requirements.txt
uv pip check
source .venv/bin/activate
python main.py
deactivate
```

This assumes other virtual environments have been deactivated and commands run in the target project. Environment discovery matters; the current directory alone does not prove where `uv pip` will install. Avoid using `--system` merely to bypass environment setup. See [environment selection](https://docs.astral.sh/uv/pip/environments/).

When ready to migrate, initialize and review project metadata, then consider `uv add -r requirements.txt`. A file containing every transitive dependency may need cleanup rather than being treated as a finished dependency design.

For a script requiring a temporary dependency, explicitly bypass the surrounding project:

```bash
uv run --no-project --with requests fetch.py
```

This supplies `requests` without declaring it as a project dependency. For a reusable standalone script, `uv add --script fetch.py requests` records inline dependency metadata; subsequent runs can use `uv run fetch.py`. See [script support](https://docs.astral.sh/uv/guides/scripts/).

## Standalone tools and uvx

Spec Kit's CLI is a standalone-tool example:

```bash
uv tool install specify-cli
specify version
uv tool list
uv tool upgrade specify-cli
# Only when removing the tool
uv tool uninstall specify-cli
```

The package is `specify-cli`; the executable it provides is `specify`. Its environment is separate from the application, which need not be written in Python.

For an occasional invocation:

```bash
uvx ruff check .
uvx --from specify-cli specify version
```

`uvx` aliases `uv tool run`. It may download packages, create isolated environments, and cache them. Isolation is not a security sandbox: the executed tool can still access files allowed by its operating-system permissions. Prefer `uv run pytest` for tests that need project dependencies. See [using tools](https://docs.astral.sh/uv/guides/tools/).

## Proxies and package mirrors

uv defaults to PyPI. If downloads work, there is no need to change it immediately.

A proxy changes the network path. A mirror changes the package index or download source. uv supports `HTTP_PROXY` and `HTTPS_PROXY`; stale settings pointing to a stopped local proxy can produce connection-refused errors. Distinguish those from DNS, TLS, or dependency-resolution failures before changing configuration. See [environment variables](https://docs.astral.sh/uv/reference/environment/).

An index can be selected for one invocation. This example still uses official PyPI, not a third-party mirror:

```bash
uv sync --default-index https://pypi.org/simple
```

The option replaces the default index, not every separately configured additional index. A package mirror also does not redirect GitHub sources, uv updates, or Python interpreter downloads. See [index configuration](https://docs.astral.sh/uv/concepts/indexes/).

Two configuration distinctions matter: uv does not read pip-specific `pip.conf` or `PIP_INDEX_URL`, and `uv tool` ignores project configuration in favor of user and system configuration. A project's index setting therefore need not apply to tool installation. See [pip compatibility](https://docs.astral.sh/uv/pip/compatibility/) and [configuration files](https://docs.astral.sh/uv/concepts/configuration-files/).

Do not disable certificate validation to hide a network problem, or commit private-index credentials.

## Quick reference and troubleshooting

| Task | Command |
| --- | --- |
| Show uv's version | `uv --version` |
| Read subcommand help | `uv help sync` |
| Add a project dependency | `uv add PACKAGE` |
| Run a project script | `uv run main.py` |
| Restore the environment and validate the lockfile | `uv sync --locked` |
| Print the project interpreter path | `uv run python -c "import sys; print(sys.executable)"` |
| List installed tools | `uv tool list` |
| Locate the cache | `uv cache dir` |
| Prune unused cache entries | `uv cache prune` |
| Clear the uv cache | `uv cache clean` |

Cache removal can force later downloads. It should not be the first reaction to a network failure. See [cache management](https://docs.astral.sh/uv/concepts/cache/).

For `ModuleNotFoundError`, check both the dependency declaration and the interpreter actually running the program. If downloads succeed but builds fail, check Python compatibility, wheel availability for the platform, and native build requirements.

I would start with `uv add`, `uv run`, `uv sync`, and `uv tool install`. New projects can use the project workflow, older ones can keep requirements files, and standalone tools can remain separate. Adopting uv does not require reorganizing every repository at once.
