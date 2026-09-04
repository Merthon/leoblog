---
title: "JDBC 学习笔记（一）"
description: "JDBC（Java DataBase Connectivity）java 数据库连接，是一种用于执行 SQL 语句的 Java API，可以为多种关系型数据库提供统一访问，由一组用 Jav……"
publishedAt: 2022-07-25
type: technical
tags: ["MySQL", "Java", "笔记"]
draft: false
readingMinutes: 4
---
## JDBC_01

#### 1. 概念和本质

JDBC（Java DataBase Connectivity）java 数据库连接，是一种用于执行 SQL 语句的 Java API，可以为多种关系型数据库提供统一访问，由一组用 Java 语言编写的类和接口组成的。本质上是 java 官方提供的一套规范（接口），用于快速实现不同关系型的数据库的连接。

#### 2. 功能类详解

##### 2.1 DriverManager

DriverManager：驱动管理对象

- 注册驱动(告诉程序该使用哪一个数据库驱动)

  - static void registerDriver(Driver driver)：注册与给定的驱动程序 DriverManager

  - 写代码使用：Class.forName("com.mysql.jdbc.Driver");

    ```java
    Class.forName("com.mysql.jdbc.Driver");
    ```

  - 通过查看源码发现：在 com.mysql.jdbc.Driver 类中存在静态代码块

    ```java
    static {
         try {        java.sql.DriverManager.registerDriver(new Driver());
             } catch (SQLException E) {                       throw new RuntimeException("Can't register driver!");
         }
     }
    ```

    (**注意：mysql5 之后的驱动 jar 包可以省略注册驱动的步骤。在 jar 包中，存在一个 java.sql.Driver 配置文件，文件中指定了 com.mysql.jdbc.Driver**)

  - 获取数据库连接(获取到数据库的连接并返回连接对象)

    - static Connection getConnection(String url, String user, String password);
      - 返回值：Connection 数据库连接对象
      - 参数
        - url：指定连接的路径。语法：jdbc:mysql://ip 地址(域名):端口号/数据库名称
        - user：用户名
        - password：密码

```java
Connection con = DriverManager.getConnection("jdbc:mysql://localhost:3306/db2", "root", "root");
```

##### 2.2 Connection

Connection：数据库连接对象

- 获取执行者对象
  - 获取普通执行者对象：Statement createStatement();
  - 获取预编译执行者对象：PreparedStatement prepareStatement(String sql);
- 管理事务
  - 开启事务：setAutoCommit(boolean autoCommit); 参数为 false，则开启事务。
  - 提交事务：commit();
  - 回滚事务：rollback();
- 释放资源
  - 立即将数据库连接对象释放：void close();

##### 2.3 Statement

Statement：执行 sql 语句的对象

- 执行 DML 语句：int executeUpdate(String sql);
  - 返回值 int：返回影响的行数。
  - 参数 sql：可以执行 insert、update、delete 语句。
- 执行 DQL 语句：ResultSet executeQuery(String sql);
  - 返回值 ResultSet：封装查询的结果。
  - 参数 sql：可以执行 select 语句。
- 释放资源
  - 立即将执行者对象释放：void close();

##### 2.4 ResultSet

ResultSet：结果集对象

- 判断结果集中是否还有数据：boolean next();
  - 有数据返回 true，并将索引向下移动一行
  - 没有数据返回 false
- 获取结果集中的数据：XXX getXxx("列名");
  - XXX 代表数据类型(要获取某列数据，这一列的数据类型)
  - 例如：String getString("name"); int getInt("age");
- 释放资源
  - 立即将结果集对象释放：void close();

#### 3. JDBC 案例实现

需求：查询一整张表的所有数据

```java
package com.testchen;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;

public class JDBCDemo01 {
    public static void main(String[] args) throws Exception{
        //1.导入jar包
        //2.注册驱动
        Class.forName("com.mysql.jdbc.Driver");

        //3.获取连接
        Connection con = DriverManager.getConnection(
                "jdbc:mysql://192.168.**.***:3306/db2",//主机地址，端口号，数据库名
                "root",  //数据库用户名
                "**********" //数据库密码
        );
        //4.获取执行者对象
        Statement stat = con.createStatement();
        //5.执行sql语句，并接受结果
        String sql = "SELECT * FROM USER";
        ResultSet rs = stat.executeQuery(sql);
        //6.处理结果
        while (rs.next()){
            System.out.println(rs.getInt("id") + "\t" + rs.getString("name"));
        }
        //7.释放资源
        con.close();
        stat.close();
        rs.close();
    }
}
```
