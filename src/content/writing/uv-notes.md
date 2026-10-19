---
title: "uv 使用笔记与常用命令"
description: "从安装 uv 到管理 Python 项目，整理依赖、虚拟环境、独立工具、锁文件，以及代理和镜像的常见问题。"
publishedAt: 2026-10-19T12:43:22+08:00
type: technical
tags: ["Python", "uv", "工具", "依赖管理"]
draft: false
featured: true
readingMinutes: 10
translationKey: uv-notes
---

接触 [Spec Kit](/writing/spec-kit-notes/) 时，安装命令里的 `uv tool install` 让我顺便补了一课：Python 工具和项目依赖，原来可以交给同一个工具管理，又不必装到同一个环境里。

[uv](https://docs.astral.sh/uv/) 是 Astral 开发、用 Rust 编写的 Python 包与项目管理工具。它可以安装 Python、创建虚拟环境、管理依赖，也能单独安装命令行工具。对我来说，先弄清“依赖装在哪里”，比记住几十个子命令更重要。

下面以 uv 0.13.1 和 macOS/Linux 的终端为例。Python 3.12 只是示例版本，实际应按项目要求选择。命令按场景使用，不需要从头到尾全部执行。

## 安装与检查

先检查电脑是否已有 uv：

```bash
command -v uv
uv --version
uvx --version
```

`command -v` 没有输出，表示当前 `PATH` 找不到它，不等于电脑任何目录都不存在这个文件。

macOS/Linux 可以使用[官方独立安装器](https://docs.astral.sh/uv/getting-started/installation/)。如果想先检查脚本，再运行：

```bash
curl -LsSf https://astral.sh/uv/install.sh -o uv-install.sh
less uv-install.sh
# 确认脚本内容后执行
sh uv-install.sh
```

安装器可能调整 Shell 配置，让命令进入 `PATH`。已有合适的路径配置、不希望它修改启动文件时，可以使用 `UV_NO_MODIFY_PATH=1`。安装完成后若找不到命令，按安装器提示刷新环境或重新打开终端。

macOS 已使用 Homebrew 的话，也可以选择：

```bash
brew install uv
```

两种方式选一种即可。我的旧版 macOS 在尝试 Homebrew 时提示需要连带升级多项编译依赖，因此最终用了独立安装器；不是所有 Mac 都会遇到这个情况。

升级也要对应安装来源：独立安装器使用 `uv self update`，Homebrew 使用 `brew upgrade uv`。不要把两套方式混着维护。

## 先分清三种使用方式

| 场景 | 主要命令 | 管理的对象 |
| --- | --- | --- |
| 长期开发一个 Python 项目 | `uv add`、`uv run`、`uv sync` | 项目配置、锁文件和项目环境 |
| 保留原来的 requirements 工作流 | `uv venv`、`uv pip install` | 指定或发现的虚拟环境 |
| 使用独立命令行工具 | `uv tool install`、`uvx` | 与项目分开的工具环境 |

最容易混淆的是 `uv add requests` 和 `uv pip install requests`。前者把依赖纳入项目管理；后者主要是往环境里装包。后者装成功，不代表 `pyproject.toml` 和 `uv.lock` 已经记录了它。

## 从一个小项目开始

先准备解释器并创建精简项目：

```bash
uv python install 3.12
uv init --bare --python 3.12 uv-demo
cd uv-demo
uv python pin 3.12
uv add requests
```

这里使用 `--bare`，避免依赖默认生成的应用目录结构。自己新建 `main.py`：

```python
import requests

response = requests.get("https://example.com", timeout=10)
response.raise_for_status()
print(response.status_code)
```

然后运行：

```bash
uv run main.py
```

在项目工作流中，通常不必先执行 `source .venv/bin/activate`。`uv run` 会使用项目环境，并按默认行为检查锁文件和依赖同步情况。[项目指南](https://docs.astral.sh/uv/guides/projects/)详细介绍了这些文件的关系：

| 文件或目录 | 用途 | 是否提交 Git |
| --- | --- | --- |
| `pyproject.toml` | 项目信息、Python 兼容范围、依赖声明 | 是 |
| `uv.lock` | 解析后的依赖版本和相关信息 | uv 管理的项目通常应提交 |
| `.python-version` | 本地开发采用的 Python 版本请求 | 团队统一版本时提交 |
| `.venv/` | 当前机器的虚拟环境 | 否 |

`uv.lock` 由工具维护，不建议手改。拉取别人的项目后，应在项目目录运行 `uv sync`，而不是复制对方的 `.venv`。

## Python 版本与依赖管理

解释器相关的常用命令：

```bash
uv python list --only-installed  # 查看已安装的 Python
uv python find 3.12              # 查找符合要求的解释器
uv python install 3.12           # 安装指定系列
uv python pin 3.12               # 记录当前目录的版本请求
uv run python --version         # 确认项目实际使用的版本
```

`.python-version` 不等于 `pyproject.toml` 中的 `requires-python`：前者用于选择开发解释器，后者声明项目支持的范围。切换版本前，要确认二者不冲突。uv 能发现已有 Python，也可能按需下载缺少的解释器；受限环境可用 `--no-python-downloads` 禁止自动下载。[Python 管理文档](https://docs.astral.sh/uv/guides/install-python/)

项目依赖则用下面这组命令：

```bash
uv add requests                  # 添加运行依赖
uv add 'requests>=2.32,<3'        # 明确版本范围
uv add --dev pytest ruff         # 添加开发依赖
uv remove requests               # 移除运行依赖
uv remove --dev ruff             # 移除开发依赖
uv tree                          # 查看依赖树
```

它们是独立操作示例，不是要求依次添加后又删除。[依赖管理文档](https://docs.astral.sh/uv/concepts/projects/dependencies/)说明了声明、依赖组与来源配置。项目里需要重复使用的测试和检查工具，放进开发依赖更容易统一版本：

```bash
uv run pytest
uv run ruff check .
```

## 锁文件 同步和升级

`uv lock` 负责解析并更新锁文件，`uv sync` 负责把环境同步到项目要求。默认同步也可能重新检查并更新锁文件；“同步”不等于“永远不改锁文件”。

```bash
uv lock                         # 生成或更新锁文件
uv lock --check                 # 检查锁文件是否与声明一致
uv sync --locked                # 不允许更新锁文件，过期则报错
uv run --locked pytest          # 按已确认的依赖执行测试
```

`--frozen` 也不更新锁文件，但会跳过它是否与项目声明一致的检查。CI 要防止声明和锁文件脱节时，通常更适合 `--locked`。两者都不意味着禁止联网。

要升级依赖，需要明确发起：

```bash
uv lock --upgrade-package requests
uv sync --locked

# 确实准备整体升级时，再使用这一组
uv lock --upgrade
uv sync --locked
```

升级受 `pyproject.toml` 中的版本约束限制。另一个容易踩的坑是：`uv sync` 默认做精确同步，可能删除环境里没有被项目选中依赖集合包含的包。临时手装的包因此消失，未必是故障。[锁定与同步文档](https://docs.astral.sh/uv/concepts/projects/sync/)

## 旧项目和独立脚本

只有 `requirements.txt` 的项目，不用立刻迁移：

```bash
uv venv --python 3.12
uv pip install -r requirements.txt
uv pip check
source .venv/bin/activate
python main.py
deactivate
```

这里假设已经退出其他激活的虚拟环境，在目标项目目录操作。`uv pip` 会按环境发现规则选择目标，不能只凭当前目录猜测安装位置。不要为了省事加 `--system` 去修改系统 Python。[环境使用说明](https://docs.astral.sh/uv/pip/environments/)

准备迁移时，可以在初始化并审阅项目配置后使用 `uv add -r requirements.txt`。原文件若包含大量传递依赖，导入后还需要整理，不能把一次导入当作完整的依赖设计。

单个脚本只需要临时依赖时，可以明确不使用当前项目：

```bash
uv run --no-project --with requests fetch.py
```

这会为运行提供 `requests`，不会把它添加为项目依赖。长期保存的独立脚本，也可以通过 `uv add --script fetch.py requests` 写入内联依赖声明，再用 `uv run fetch.py` 执行。[脚本指南](https://docs.astral.sh/uv/guides/scripts/)

## 安装独立工具与 uvx

安装 Spec Kit 的 CLI，就是这个场景：

```bash
uv tool install specify-cli
specify version
uv tool list
uv tool upgrade specify-cli
# 不再需要时才执行
uv tool uninstall specify-cli
```

工具包叫 `specify-cli`，提供的命令叫 `specify`。它使用独立环境，不要求当前业务项目也是 Python 项目。

只想运行一次，可以用 `uvx`：

```bash
uvx ruff check .
uvx --from specify-cli specify version
```

`uvx` 是 `uv tool run` 的别名。它仍可能下载工具、创建隔离环境并使用缓存，不是完全不落盘，也不是安全沙箱。工具照样可能读取或修改它有权限访问的文件。需要项目依赖的测试，应优先使用 `uv run pytest`，而不是默认隔离的 `uvx pytest`。[工具使用指南](https://docs.astral.sh/uv/guides/tools/)

## 代理与镜像 不必一开始就改

uv 默认使用 PyPI。网络正常时，先保持默认即可。

- **代理**改变访问路径，通常仍访问原下载站。
- **包镜像**改变包索引和下载来源。

uv 支持 `HTTP_PROXY`、`HTTPS_PROXY` 等环境变量。如果指向一个已停止运行的本地代理，下载就可能报连接拒绝。排查时先看错误究竟来自代理连接、DNS、TLS，还是包版本解析，不要一遇到失败就换源。[环境变量参考](https://docs.astral.sh/uv/reference/environment/)

需要单次指定索引时，可以这样写；此处仍是官方 PyPI，并没有换成第三方镜像：

```bash
uv sync --default-index https://pypi.org/simple
```

`--default-index` 替换默认索引；如果另有额外索引配置，它不会自动清除它们。包镜像也不会顺便解决 GitHub 源码、uv 自身或 Python 解释器的下载问题。[索引配置说明](https://docs.astral.sh/uv/concepts/indexes/)

还有两点值得记住：uv 不读取 `pip.conf` 或 `PIP_INDEX_URL` 等 pip 专用配置；`uv tool` 命令忽略项目级配置，读取用户级和系统级配置。给某个项目设了源，不代表独立工具安装也沿用它。[pip 兼容性](https://docs.astral.sh/uv/pip/compatibility/)和[配置文件说明](https://docs.astral.sh/uv/concepts/configuration-files/)

不要用关闭证书校验来掩盖网络问题，也不要把带凭据的私有源地址提交到仓库。

## 日常速查与排错

| 想做的事 | 命令 |
| --- | --- |
| 查看 uv 本身版本 | `uv --version` |
| 查看子命令帮助 | `uv help sync` |
| 给项目添加依赖 | `uv add 包名` |
| 运行项目脚本 | `uv run main.py` |
| 恢复项目环境并校验锁文件 | `uv sync --locked` |
| 查看当前解释器路径 | `uv run python -c "import sys; print(sys.executable)"` |
| 查看已装工具 | `uv tool list` |
| 查看缓存目录 | `uv cache dir` |
| 清理不再需要的缓存项 | `uv cache prune` |
| 清空 uv 缓存 | `uv cache clean` |

清缓存意味着以后可能重新下载；网络故障时，它不应该是第一步。[缓存说明](https://docs.astral.sh/uv/concepts/cache/)

遇到 `ModuleNotFoundError`，先确认依赖是否被声明，以及程序是不是通过项目环境运行。下载成功但构建失败，则要检查 Python 版本、平台是否有可用 wheel，以及是否缺少原生编译依赖。

我会先从 `uv add`、`uv run`、`uv sync` 和 `uv tool install` 这几个入口用起。新项目交给项目工作流，旧项目可以暂时保留 requirements，独立工具放到工具环境里，没必要为了采用 uv 一次性重整所有项目。
