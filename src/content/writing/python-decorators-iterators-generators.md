---
title: "Python 装饰器、迭代器与生成器"
description: "装饰器是一种设计模式，它允许你在不修改函数或方法代码的前提下，动态地扩展函数或方法的功能。"
publishedAt: 2025-01-14
type: technical
tags: ["Python"]
draft: false
readingMinutes: 4
---
## 装饰器（Decorator
### 什么是装饰器？
装饰器是一种设计模式，它允许你在不修改函数或方法代码的前提下，动态地扩展函数或方法的功能。装饰器本质上是一个函数，它接收另一个函数作为参数，并返回一个新的函数，这个新函数包含了原函数的功能，并且可能添加了一些额外的行为。
装饰器常用于：
- **函数增强**：在不改变函数体的情况下，给函数添加额外的功能（如日志、验证等）。
- **代码复用**：将某些公共的功能（例如权限检查、缓存）提取出来并应用到多个函数。
### 工作原理
装饰器的工作方式是通过**闭包**。一个装饰器通常会返回一个封装原函数的新函数，这个新函数会在原函数执行前或执行后插入一些额外的操作。
```python
# 定义一个装饰器
def decorator(func):
    def wrapper():
        print("Before function call")
        func()
        print("After function call")
    return wrapper

# 应用装饰器
@decorator
def say_hello():
    print("Hello, World!")

# 调用装饰后的函数
say_hello()
```
### **工作过程：**
1. `@decorator` 语法是装饰器的简写，相当于 `say_hello = decorator(say_hello)`。
2. 当我们调用 `say_hello()` 时，实际调用的是装饰器返回的 `wrapper` 函数。
3. `wrapper` 函数在调用原始的 `say_hello()` 函数之前和之后分别添加了额外的操作。
### 装饰器常见用法：
- **日志记录**：在函数执行前后记录日志。
- **权限控制**：检查当前用户是否有权限执行某个操作。
- **性能监控**：测量函数的执行时间。

## 迭代器（Iterator）
### 什么是迭代器？
迭代器是一个对象，它遵循 **迭代协议**，可以逐个访问集合中的元素。要成为一个迭代器，必须实现以下两个方法：

- `__iter__()`：返回自身的迭代器对象。
- `__next__()`：返回集合中的下一个元素，如果没有元素了，就抛出 `StopIteration` 异常。
### 工作原理
迭代器的核心是 `__next__()` 方法，它每次调用时会返回集合中的下一个元素，直到没有元素可以返回为止。

在 Python 中，所有的可迭代对象（例如列表、元组、字典等）都隐式地实现了 `__iter__()` 方法，支持迭代。
```python
class MyIterator:
    def __init__(self, start, end):
        self.current = start
        self.end = end

    def __iter__(self):
        return self

    def __next__(self):
        if self.current > self.end:
            raise StopIteration
        self.current += 1
        return self.current - 1

# 创建迭代器对象
my_iter = MyIterator(1, 5)

# 使用 for 循环遍历迭代器
for num in my_iter:
    print(num)
```
**工作过程：**
1. `__iter__()` 返回当前对象本身，表示该对象是可迭代的。
2. `__next__()` 每次调用返回下一个数字，当 `self.current > self.end` 时抛出 `StopIteration`，表示迭代完成。
##### 迭代器与可迭代对象的区别：
- **可迭代对象（Iterable）**：实现了 `__iter__()` 方法的对象，可以用 `for` 循环遍历。
- **迭代器（Iterator）**：实现了 `__iter__()` 和 `__next__()` 方法的对象，支持逐个访问元素。

## 生成器（Generator）
##### 什么是生成器？
生成器是 Python 中的一种特殊类型的迭代器。生成器函数使用 `yield` 关键字生成一个迭代器对象。生成器是惰性求值的，只有在你请求一个元素时，它才会生成该元素。
与普通的迭代器不同，生成器函数的调用不会返回所有数据，而是返回一个生成器对象，这个对象会在需要时按需生成数据。
##### 工作原理
生成器函数定义时与普通函数类似，但在返回数据时使用 `yield` 关键字而不是 `return`。
- `yield` 每次返回一个值，并暂停函数的执行，保存当前状态。
- 下一次调用生成器时，从上次 `yield` 的地方继续执行。

```python
def my_generator(start, end):
    current = start
    while current <= end:
        yield current  # 暂停并返回当前值
        current += 1

# 创建生成器对象
gen = my_generator(1, 5)

# 使用 for 循环遍历生成器
for num in gen:
    print(num)
```
**工作过程：**
1. `yield current` 每次返回一个值，并暂停函数的执行。
2. 生成器对象 `gen` 是惰性生成的，直到 `for` 循环需要数据时才会生成并返回。
3. 每次调用 `next()` 时，从 `yield` 暂停的地方继续执行。

##### 生成器的优势：
- **节省内存**：生成器是惰性求值的，它不会将所有数据一次性加载到内存中。
- **性能优越**：生成器在处理大量数据时可以节省大量内存，因为数据是在需要时生成的。
##### 生成器与普通函数的区别：
- **普通函数**：返回的是一个值或对象，函数调用后会立即返回结果。
- **生成器函数**：使用 `yield` 返回生成的值，函数会暂停，直到再次调用时从暂停的位置继续执行。
