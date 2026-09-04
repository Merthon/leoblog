---
title: "Go 语法复习（一）"
description: "复习 Go 程序结构、变量、数据类型、流程控制及常用基础语法。"
publishedAt: 2025-07-21
type: technical
tags: ["Go", "基础语法"]
draft: false
readingMinutes: 5
---
## 一个简单的mian函数
```go
package main

import "fmt"

func main() {
     fmt.Println("Hello World")
}
```
go run: 是指直接编译go语言并执行应用程序，一步完成
go build: 先编译，后执行

## 变量的声明
##### 单个变量
声明变量一般是使用关键字var
- 第一种： 制定变量类型，声明后若不赋值，使用默认值0
   var v_name v_type
   v_name = value
- 第二种：根据值自行判定来变量类型
   var v_name = value
- 第三种：省去var，使用 := 来
   v_name := value
###### 多变量声明
示例代码：
```go
package main

import "fmt"

var x, y int
var (  //这种分解的写法，一般用于声明全局变量
       a int
       b bool
)

var c, d int = 1, 2
var e, f = 123, "merthon"
// 不带声明格式的只能在函数体里面实现

func mian() {
       g, h := 123, "这种在func函数体里实现"
       fmt.Println(a, b, c, d, e, f, g, h)

       _, value := 7, 5 //7的赋值被废弃，_不具备读特性
       fmt.Println(value) //5
}
```
## 常量
常量是一个简单值的标识符，在程序运行时，不会被修改的值
常量的数据类型只可以是布尔型，数字型，和字符串型
定义格式：
```go
const indentifier [type] = value
```
可以省去类型说明符[type]
- 显式类型定义
- 隐式类型定义
```go
package main

import "fmt"

func main() {
    const LENGTH = 10
    const WIDTH = 5
    var area int
    const a, b, c = 1, false, "str"

    area = LENGTH * WIDTH
	fmt.Printf("面积为：%d\n", area)
	println(a, b, c)
}
```

常量还可以拿来做枚举
```go
const (
    Unknow = 0
    Female = 1
    Male = 2
)
```
常量可以用len(),cap(), unsafe.Sizeof()常量计算表达式的值，常量表达式中，函数必须是内置函数，否则编译不过：
```go
package main

import "unsafe"
const (
    a = "abc"
    b = len(a)
    c = unsafe.Sizeof(a)
)

func main() {
    println(a, b, c)
}
//输出结果为abc, 3, 16
```
unsafe.Sizeof(a)输出是16，字符串类型在go里面是个结构，包含指向底层数组的指针和长度，这两部分每部分都是8个字节，所以字符串大小为16个字节。
## 函数
##### 函数返回多个值
Go函数可以返回多个值，例如：
```go
package main

import "fmt"

func swap(x, y string) (string, string) {
    return y, x
}

func main() {
    a, b = swap("Mahesh", "Kumer")
    fmt.println(a, b)
}
//Kumer Mahesh
```
##### init函数与import
init函数：可以在package main中，也可以在其他的package中，同一个中可以出现多次。
main函数：只能在package main中。
##### 函数参数
函数如果使用参数，该变量可以称为函数的形参，就像是定义在函数体里的局部变量。
调用函数，可以使用2种方式来传递参数：
###### 值传递
值传递是指在调用函数的时候将实际参数复制一份传递到函数中，这样在函数中如果对参数进行修改，将不会影响到实际参数。
默认情况，Go使用的就是值传递，在调用过程中不会影响到实际参数。
```go
func swap(x, y int) int {
    var temp int

    temp = x //保存x
    x = y  //将y赋值给x
    y = temp //将temp 赋值给y

    return temp
}
```
使用值传递：
```go
package main

import "fmt"

func main() {
    var a int = 100
    var b int = 200

    fmt.printf("交换前a：%d\n", a)
    fmt.printf("交换前b：%d\n", b)

    swap(a, b)

    fmt.printf("交换后a：%d\n", a)
    fmt.printf("交换后b：%d\n", b)
}
```
###### 引用传递（指针传递）
###### 指针
Go语言的取地址符是& ，放到一个变量之前使用就会返回相应变量的内存地址。
```go
package main

import "fmt"

func main() {
    var a int = 10

    fmt.printf("变量的地址：%d\n"， &a)
}
//变量的地址：10818a220
```
引用传递是指在调用函数时将实际参数的地址传递到函数中，那么函数中对参数所进行的修改，将影响到实际参数。
引用传递指针参数传递到函数内，比如：
```go
func swap(x *int, y *int){
    var temp int

    temp = *x //保存x地址上的值
    *x = *y  //将y赋值给x
    *y = temp //将temp 赋值给y

    return temp
```
使用引用传递：
```go
package main

import "fmt"

func main() {
    var a int = 100
    var b int = 200

    fmt.printf("交换前a：%d\n", a)
    fmt.printf("交换前b：%d\n", b)

    /*
    &a 指向a指针，a变量的地址
    &b 指向b指针，b变量的地址
    */
    swap(&a, &b)

    fmt.printf("交换后a：%d\n", a)
    fmt.printf("交换后b：%d\n", b)
}
```
## defer
defer被用于预定对一个函数的调用，可以把这类被defer语句调用的函数称为延迟函数。
defer的作用：
- 释放占用的资源
- 捕捉处理异常
- 输出日志
如果一个函数中有多个defer语句，会以后进先出的顺序执行。
```go
func Demo() {
    defer fmt.Println("1")
    defer fmt.Println("2")
    defer fmt.Println("3")
    defer fmt.Println("4")
    defer fmt.Println("5")
}

func main() {
    Demo()
}
```
###### recover错误拦截
