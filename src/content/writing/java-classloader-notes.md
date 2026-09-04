---
title: "Java高级：类加载器（ClassLoader）笔记"
description: "类加载器就是负责将.class 文件（实际存储到硬盘上的一些理文件）加载到内存中"
publishedAt: 2022-07-06
type: technical
tags: ["Java高级", "Java", "笔记"]
draft: false
readingMinutes: 4
---
### 1.什么是类加载器

类加载器就是负责将.class 文件（实际存储到硬盘上的一些理文件）加载到内存中

关于类加载时机，用到就加载，不用就不加载

### 2.类加载器的过程

> **图片暂缺：** 原笔记引用的本地图片资源未随文档保留，后续补充。


##### 加载：

- 通过**全限定名**（包名+类名），获取这个类，准备用流来传输
- 将这个类加载到内存中
- 加载完毕创建一个 class 对象

##### 链接

- 验证：看文件中信息是否虚拟机规范要求，有无安全隐患
- 准备：初始化静态变量
- 解析：类中使用了其他类，此时要找到对应的类

##### 初始化

静态变量赋值以及初始化其他资源

### 3.类加载的分类

- 启动类加载器（BootstrapClassLoader)：虚拟机内置的
- 平台类加载器（PlatformClassLoader）：负责加载 JDK 一些特殊模块
- 系统类加载器（SystemClassLoader）：负责加载用户类路径上所指定的类库

### 4.双亲委派模型

​ ClassLoader 的双亲委派模型中，各个 ClassLoader 之间的关系是通过组合关系来复用父加载器。当一个 ClassLoader 收到来类加载的请求，首先把该请求委派该父类 ClassLoader 处理，当父类 ClassLoader 无法处理时，才由当前类 ClassLoader 来处理。对于每个 ClassLoader 这个方式，也就是父类的优先于子类处理类加载的请求，那么也就是说任何一个请求第一次处理的便是最顶层的 Bootstrap ClassLoader(启动类加载器)。

```java
public class ClassLoaderDemo2 {
    public static void main(String[] args) {
        //获取系统类加载器getSystemClassLoader()
        ClassLoader systemClassLoader = ClassLoader.getSystemClassLoader();
        //获取系统类加载器的父加载器getParent()   ---平台类加载器
        ClassLoader classLoader1 = systemClassLoader.getParent();
        //获取系平台类加载器的父加载器getParent()   ---启动类加载器
        ClassLoader classLoader2 = classLoader1.getParent();

        System.out.println(systemClassLoader);
        //jdk.internal.loader.ClassLoaders$AppClassLoader@2437c6dc
        System.out.println(classLoader1);
        //jdk.internal.loader.ClassLoaders$PlatformClassLoader@880ec60
        System.out.println(classLoader2);
        //null
    }

```

### 5.类加载器常用方法

- static ClassLoader getSystemClassloader() 获取一个系统类加载器
- InputStream getResourceAsStream(String name) 加载某一个资源文件

```java
public class ClassLoaderDemo1 {
    public static void main(String[] args) throws IOException {
        //ClassLoader getSystemClassloader()  获取一个类加载器
        //InputStream getResourceAsStream(String name)   加载某一个资源文件

        //1.获取一个类加载器
        ClassLoader classLoader = ClassLoader.getSystemClassLoader();
        //2.利用加载器加载某一个资源文件
        //参数就是文件路径
        //返回值是字节流
        InputStream is = classLoader.getResourceAsStream("prop.properties");
        //创建properties对象
        Properties prop = new Properties();
        prop.load(is);
        System.out.println(prop);
        //这里打的就是prop.properties配置里面的内容
        //释放资源
        is.close();
    }
}
```
