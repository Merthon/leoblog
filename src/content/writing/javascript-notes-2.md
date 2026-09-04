---
title: "JavaScript 学习笔记（二）"
description: "JavaScript02 函数作为值来传递以及如何使用函数表达式 写一个包含三个参数的函数 ask(question, yes, no)： question 关于问题的文本 yes 当回答……"
publishedAt: 2023-06-01
type: technical
tags: []
draft: false
readingMinutes: 4
---
JavaScript02
## 函数（补漏）
### 回调函数
函数作为值来传递以及如何使用函数表达式
写一个包含三个参数的函数 `ask(question, yes, no)`：
`question`
关于问题的文本
`yes`
当回答为 “Yes” 时，要运行的脚本
`no`
当回答为 “No” 时，要运行的脚本
函数需要提出 `question`（问题），并根据用户的回答，调用 `yes()` 或 `no()`：
```
<script>
"use strict";
function ask(question, yes, no) {
  if (confirm(question)) yes()
  else no();
}
function showOk() {
  alert( "You agreed." );
}
function showCancel() {
  alert( "You canceled the execution." );
}
// 用法：函数 showOk 和 showCancel 被作为参数传入到 ask
ask("Do you agree?", showOk, showCancel);
</script>
```
`ask` 的两个参数值 `showOk` 和 `showCancel` 可以被称为 **回调函数** 或简称 **回调**。
主要思想是我们传递一个函数，并期望在稍后必要时将其“回调”。
使用函数表达式来编写一个等价的、更简洁的函数：
```
<script>
"use strict";
function ask(question, yes, no) {
  if (confirm(question)) yes()
  else no();
}
ask(
  "Do you agree?",
  function() { alert("You agreed."); },
  function() { alert("You canceled the execution."); }
);
</script>
```
直接在 `ask(...)` 调用内进行函数声明。这两个函数没有名字，所以叫 **匿名函数**。这样的函数在 `ask` 外无法访问（因为没有对它们分配变量）

### 箭头函数
创建函数还有另外一种非常简单的语法，并且这种方法通常比函数表达式更好。
它被称为“箭头函数”，因为它看起来像这样：
~~~
let func = (arg1, arg2, ..., argN) => expression;
~~~
这里创建了一个函数 `func`，它接受参数 `arg1..argN`，然后使用参数对右侧的 `expression` 求值并返回其结果。
换句话说，它是下面这段代码的更短的版本：
~~~
let func = function(arg1, arg2, ..., argN) {
     return expression;
 };
~~~
看一个具体的例子：
~~~
let sum = (a,b) => a + b;
/* 这个箭头函数是下面这个函数的更短的版本：
let sum = function(a, b) {
return a + b;
};
*/
alert( sum(1, 2) ); // 3
~~~
可以看到 `(a, b) => a + b` 表示一个函数接受两个名为 `a` 和 `b` 的参数。在执行时，它将对表达式 `a + b` 求值，并返回计算结果。
如果我们只有一个参数，还可以省略掉参数外的圆括号，使代码更短:
~~~
let double = n => n * 2;
// 差不多等同于：let double = function(n) { return n * 2 }
alert( double(3) ); // 6
~~~
如果没有参数，括号则是空的（但括号必须保留）：
~~~
let sayHi = () => alert("Hello!");
sayHi();
~~~
箭头函数可以像函数表达式一样使用。
~~~
let age = prompt("What is your age?", 18);
let welcome = (age < 18) ?
  () => alert('Hello!') :
  () => alert("Greetings!");
welcome();
~~~
### 多行的箭头函数
更复杂一点的函数，比如带有多行的表达式或语句。在这种情况下，我们可以使用花括号将它们括起来。主要区别在于，用花括号括起来之后，需要包含 `return` 才能返回值（就像常规函数一样）。
~~~
let sum = (a, b) => { // 花括号表示开始一个多行函数
let result = a + b; _return result; // 如果我们使用了花括号，那么我们需要一个显式的 “return”
};
alert( sum(1, 2) ); // 3
~~~
### 总结
箭头函数对于简单的操作很方便，特别是对于单行的函数。它具体有两种形式：
1.  不带花括号：`(...args) => expression` —— 右侧是一个表达式：函数计算表达式并返回其结果。如果只有一个参数，则可以省略括号，例如 `n => n*2`。
2.  带花括号：`(...args) => { body }` —— 花括号允许我们在函数中编写多个语句，但是我们需要显式地 `return` 来返回一些内容。
