---
title: "Python 学习笔记（二）"
description: "整理 Python 的流程控制、函数、类与异常处理。"
publishedAt: 2024-12-27
updatedAt: 2026-09-04
type: technical
tags: ["Python", "笔记"]
draft: false
readingMinutes: 4
---

## 流程控制

Python 用缩进划分代码块，惯例是每级四个空格：

```python
age = int(input("请输入年龄："))

if age < 18:
    print("未成年")
elif age < 60:
    print("成年人")
else:
    print("老年人")
```

条件会根据对象的真值判断。`None`、数值零以及空字符串、空容器通常为假，其余对象通常为真。判断空容器时，优先写 `if items:`，而不是 `if len(items) > 0:`。

`pass` 是不执行任何操作的占位语句。`assert` 用于表达开发阶段应当成立的不变量，不要把它当成用户输入校验：以优化模式运行 Python 时，断言可能被移除。

## 循环

`for` 遍历的是**可迭代对象**，不只限于所谓“序列”：

```python
for index, language in enumerate(["Python", "Go"], start=1):
    print(index, language)
```

`break` 终止当前循环，`continue` 跳过本轮剩余语句。循环后的 `else` 只在循环自然结束时执行；如果由 `break` 退出，则不会执行：

```python
for item in items:
    if item.id == target_id:
        result = item
        break
else:
    result = None
```

## 函数与参数

函数用 `def` 定义，类型标注用于文档、编辑器和静态检查，不会自动做运行时校验：

```python
def greet(name: str, prefix: str = "Hello") -> str:
    return f"{prefix}, {name}!"
```

Python 的参数传递可以理解为**对象共享传递**：形参会绑定到实参所指向的对象。修改传入的可变对象会被调用方观察到；给形参重新赋值则不会改变调用方的变量绑定。

```python
def append_item(items: list[str]) -> None:
    items.append("new")  # 修改同一个列表

def replace_items(items: list[str]) -> None:
    items = ["new"]      # 只改变局部名称的绑定
```

避免把可变对象作为默认参数，因为默认值只在函数定义时创建一次：

```python
def add_item(item: str, items: list[str] | None = None) -> list[str]:
    if items is None:
        items = []
    items.append(item)
    return items
```

小型、一次性的表达式可以写成 `lambda`，但复杂逻辑用具名函数更清楚。`lambda` 不会因为“用完即释放”而带来特别的性能优势。

## 作用域

名称解析通常遵循 LEGB 顺序：Local、Enclosing、Global、Built-in。函数内部赋值默认创建局部名称；确实需要修改模块级名称时可使用 `global`，修改外层函数名称时可使用 `nonlocal`。业务代码一般更适合通过参数和返回值传递状态，减少隐式全局状态。

## 类与对象

类用于组织状态和行为。实例方法的第一个参数按惯例命名为 `self`：

```python
class User:
    species = "human"  # 类属性，由实例共享

    def __init__(self, name: str) -> None:
        self.name = name  # 实例属性

    @property
    def display_name(self) -> str:
        return self.name.strip().title()
```

继承时，`super()` 会依照方法解析顺序（MRO）继续调用，不等同于“只调用第一个直接父类”。Python 的多态也不强制要求继承；只要对象支持所需操作，调用方就可以使用它，这通常称为鸭子类型。

## 异常处理

只捕获能够处理的具体异常，并让 `try` 块保持尽量小：

```python
try:
    port = int(raw_port)
except ValueError as exc:
    raise ValueError("端口必须是整数") from exc
else:
    start_server(port)
finally:
    release_temporary_resource()
```

- `except`：处理匹配的异常；
- `else`：仅在 `try` 没有抛出异常时执行；
- `finally`：无论是否发生异常都会执行，适合必要的清理；
- `raise`：抛出新异常；不带参数的 `raise` 可在 `except` 中重新抛出当前异常。

文件、网络连接等资源优先使用上下文管理器 `with`，比手写 `finally` 更清楚。

## 参考

- [Python 控制流](https://docs.python.org/3/tutorial/controlflow.html)
- [Python 类](https://docs.python.org/3/tutorial/classes.html)
- [Python 错误与异常](https://docs.python.org/3/tutorial/errors.html)
