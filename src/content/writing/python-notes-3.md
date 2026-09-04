---
title: "Python 学习笔记（三）"
description: "整理 Python 模块、包、路径与安全的文件读写方式。"
publishedAt: 2024-12-28
updatedAt: 2026-09-04
type: technical
tags: ["Python", "笔记"]
draft: false
readingMinutes: 4
---

## 模块与导入

一个 `.py` 文件通常就是一个模块。把相关函数、类和常量放进模块，可以复用代码并隔离名称空间。

```python
# hello.py
def say(name: str) -> str:
    return f"Hello, {name}!"
```

```python
# main.py
import hello

print(hello.say("Leo"))
```

常见导入方式：

```python
import pathlib
import pathlib as paths
from pathlib import Path
```

一般不使用 `from module import *`，因为它会隐藏名称来源，也可能覆盖当前模块已有的名称。导入一个模块时，模块顶层代码会在当前进程的首次导入中执行，因此不要在顶层放置意外的网络请求或耗时任务。

## 包

包把多个模块组织在同一个命名空间下。传统包通常包含 `__init__.py`；现代 Python 也支持没有该文件的命名空间包，但普通项目保留它通常更直观。

```text
app/
├── __init__.py
├── models.py
└── services/
    ├── __init__.py
    └── users.py
```

对应的导入可以写成：

```python
from app.services.users import find_user
```

不要依赖某个特定版本名称的 `.pyc` 文件。Python 会自行管理 `__pycache__`，项目通常也不把它提交进 Git。

## 使用 `pathlib` 处理路径

`pathlib.Path` 比手工拼接 `/` 或 `\\` 更适合跨平台代码：

```python
from pathlib import Path

project_dir = Path(__file__).resolve().parent
data_file = project_dir / "data" / "notes.txt"

print(data_file.name)
print(data_file.parent)
print(data_file.exists())
```

相对路径默认相对于进程的当前工作目录，而不是当前源码文件。需要稳定定位项目资源时，应从 `__file__`、明确配置或应用资源 API 推导路径。

## 文本文件读写

使用 `with` 会在离开代码块时关闭文件，即使中途抛出异常也一样：

```python
from pathlib import Path

path = Path("notes.txt")

with path.open("r", encoding="utf-8") as file:
    content = file.read()
```

常见模式：

| 模式 | 含义 |
| --- | --- |
| `r` | 读取，文件必须存在 |
| `w` | 写入，文件存在时会清空 |
| `a` | 追加到文件末尾 |
| `x` | 新建并写入，文件已存在时失败 |
| `b` | 与其他模式组合，表示二进制模式 |

写入文本时显式声明编码：

```python
lines = ["第一行\n", "第二行\n"]

with path.open("w", encoding="utf-8", newline="") as file:
    file.writelines(lines)
```

`writelines()` 不会自动添加换行符。读取大文件时也不要无条件调用 `read()` 或 `readlines()` 把全部内容放入内存，可以逐行迭代：

```python
with path.open(encoding="utf-8") as file:
    for line in file:
        process(line.rstrip("\n"))
```

## 二进制文件与 JSON

图片、压缩包等二进制文件使用 `rb` / `wb`，读写值为 `bytes`。结构化数据不要依赖 `str(dict)`，使用明确格式：

```python
import json
from pathlib import Path

path = Path("profile.json")
profile = {"name": "Leo", "skills": ["Python", "Go"]}

with path.open("w", encoding="utf-8") as file:
    json.dump(profile, file, ensure_ascii=False, indent=2)
```

处理用户提供的路径时，应限制允许访问的目录，并警惕 `../` 路径穿越。反序列化不可信数据时不要使用 `pickle`。

## 参考

- [Python 模块](https://docs.python.org/3/tutorial/modules.html)
- [`pathlib` 文档](https://docs.python.org/3/library/pathlib.html)
- [文件对象与 `open()`](https://docs.python.org/3/library/functions.html#open)
