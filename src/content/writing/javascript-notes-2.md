---
title: "JavaScript 学习笔记（二）"
description: "理解函数表达式、回调与箭头函数，并区分箭头函数和普通函数的 this 语义。"
publishedAt: 2023-06-01
updatedAt: 2026-09-04
type: technical
tags: ["JavaScript"]
draft: false
readingMinutes: 3
---

JavaScript 函数可以赋值给变量、作为参数传递，也可以从另一个函数返回。这种“函数也是值”的特性，是回调、高阶函数和事件处理的基础。

## 回调函数

```js
function ask(question, onConfirm, onCancel) {
  if (window.confirm(question)) {
    onConfirm();
  } else {
    onCancel();
  }
}

function showConfirmed() {
  window.alert("You agreed.");
}

function showCanceled() {
  window.alert("You canceled the operation.");
}

ask("Do you agree?", showConfirmed, showCanceled);
```

`ask` 接收两个函数，并在得到结果后调用其中一个。传入函数时不要写括号：`showConfirmed` 表示函数本身，`showConfirmed()` 表示立即执行并传入返回值。

也可以直接传入匿名函数：

```js
ask(
  "Do you agree?",
  function () {
    window.alert("You agreed.");
  },
  function () {
    window.alert("You canceled the operation.");
  },
);
```

回调不一定是异步的。数组的 `map`、`filter` 也会同步调用回调。

## 箭头函数

只有一个表达式时，会隐式返回结果：

```js
const sum = (a, b) => a + b;
const double = (value) => value * 2;

console.log(sum(1, 2));
console.log(double(3));
```

使用花括号后，必须显式 `return`：

```js
const sum = (a, b) => {
  const result = a + b;
  return result;
};
```

返回对象字面量时需要圆括号，否则花括号会被解析成函数体：

```js
const createUser = (name) => ({ name, active: true });
```

## 箭头函数与 this

箭头函数没有自己的 `this`、`arguments` 和 `prototype`。它会捕获外层作用域的 `this`，适合数组处理和需要保留外层上下文的回调；需要动态 `this` 或作为构造函数时，使用普通函数。

```js
const counter = {
  value: 0,
  incrementLater() {
    setTimeout(() => {
      this.value += 1;
      console.log(this.value);
    }, 100);
  },
};

counter.incrementLater();
```

这里的箭头函数沿用 `incrementLater` 方法中的 `this`。如果把回调改成普通函数，`this` 的值会由调用方式决定。

## 异步回调的错误处理

`try...catch` 不能捕获未来某次回调里抛出的错误。现代异步 API 更常使用 Promise 与 `async/await`：

```js
async function loadProfile() {
  const response = await fetch("/api/profile");
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  return response.json();
}

try {
  const profile = await loadProfile();
  console.log(profile);
} catch (error) {
  console.error(error);
}
```

## 参考

- [MDN：函数](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Functions)
- [MDN：箭头函数表达式](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Functions/Arrow_functions)
