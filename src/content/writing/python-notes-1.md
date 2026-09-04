---
title: "Python 学习笔记（一）"
description: "整理 Python 的变量模型、基础类型、字符串与常用容器。"
publishedAt: 2024-12-26
updatedAt: 2026-09-04
type: technical
tags: ["Python", "笔记"]
draft: false
readingMinutes: 4
---

## 变量与对象

Python 是**动态类型、强类型**语言。变量不需要预先声明类型，但这不代表类型之间可以随意混算。更准确地说，变量名绑定到对象，而类型属于对象：

```python
count = 3        # count 绑定到 int 对象
count = "three"  # 随后可以绑定到 str 对象

# 3 + "4" 会抛出 TypeError，不会自动转换成同一类型
```

赋值默认不会复制对象。两个变量可以指向同一个可变对象：

```python
first = [1, 2]
second = first
second.append(3)

assert first == [1, 2, 3]
```

Python 没有强制常量语法。通常用全大写名称表达“不要修改”的约定，例如 `MAX_RETRIES = 3`。

## 数字类型

常用数字类型有整数 `int`、浮点数 `float` 和复数 `complex`。整数可以用不同进制书写：

```python
decimal = 42
binary = 0b101010
octal = 0o52
hexadecimal = 0x2A
readable = 1_000_000
```

`float` 使用二进制浮点表示，不适合直接处理需要精确十进制结果的金额。财务计算可考虑标准库中的 `decimal.Decimal`。

## 字符串

字符串 `str` 是不可变的 Unicode 文本序列。单引号与双引号没有语义差异，选择更少转义的一种即可：

```python
name = "Leo"
message = f"Hello, {name}!"
quote = "I'm learning Python."
multiline = """第一行
第二行"""
```

常用操作：

```python
text = "  Python Notes  "

text.strip()                   # "Python Notes"
text.lower()                   # "  python notes  "
text.replace("Notes", "101")
"Python" in text               # True
```

由于字符串不可变，这些方法返回新字符串，不会就地修改 `text`。

## 列表与元组

列表 `list` 是有序、可变的容器；元组 `tuple` 是有序、不可变的容器。二者都支持索引和切片：

```python
languages = ["Python", "Go", "JavaScript"]

languages[0]       # "Python"
languages[-1]      # "JavaScript"
languages[0:2]     # ["Python", "Go"]
languages.append("Rust")
languages.extend(["Java", "Kotlin"])
languages.insert(1, "C")
```

删除元素时，`pop()` 按索引删除并返回元素，`remove()` 删除第一个匹配值，`clear()` 清空列表：

```python
last = languages.pop()
languages.remove("C")
```

单元素元组必须保留逗号：

```python
single = ("Python",)
```

## 字典与集合

字典 `dict` 是键值映射。现代 Python 的字典会保留插入顺序，但应通过键而不是数字索引访问：

```python
profile = {"name": "Leo", "role": "developer"}

profile["name"]                     # 键不存在时抛出 KeyError
profile.get("location", "unknown") # 键不存在时返回默认值
profile["site"] = "example.com"
```

键必须可哈希，且在同一个字典中唯一。重复赋值会覆盖旧值。

集合 `set` 保存不重复的可哈希对象，适合成员判断、去重和集合运算。集合没有数字索引，也不承诺稳定的遍历顺序：

```python
tags = {"python", "web", "python"}
assert tags == {"python", "web"}

common = {"python", "go"} & {"python", "rust"}
```

## 容器选择

| 需求 | 类型 |
| --- | --- |
| 按位置保存、需要增删 | `list` |
| 固定的一组有序值 | `tuple` |
| 用唯一键查找值 | `dict` |
| 去重或快速成员判断 | `set` |

不要仅凭“底层内存是否连续”理解这些类型。写业务代码时，容器的语义、可变性和访问方式通常更重要。

## 参考

- [Python 数据模型](https://docs.python.org/3/reference/datamodel.html)
- [Python 内置类型](https://docs.python.org/3/library/stdtypes.html)
