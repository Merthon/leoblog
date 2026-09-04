---
title: "JDBC 学习笔记（二）"
description: "记录 JDBC 配置文件、连接工具类、预编译语句与事务操作等实践。"
publishedAt: 2022-07-27
type: technical
tags: ["MySQL", "Java", "笔记"]
draft: false
readingMinutes: 6
---
#### 1. JDBC 工具类的抽取

##### 1.1 配置文件

在 src 下创建 config.properties 文件

```properties
driverClass=com.mysql.jdbc.Driver
url=jdbc:mysql://localhost:3306/db1
username=root
password=数据库密码
```

##### 1.2 工具类的抽取

对于 JDBC 工具类的抽取实现步骤有以下几步

- 1.私有构造方法
- 2.声明配置信息变量
- 3.提供静态代码块，读取配置文件信息为变量赋值，注册驱动
- 4.提供获取数据库连接的方法
- 5.提供释放资源的方法

##### 1.3 代码实现

```java
package com.xxxxxchen.JDBC02.utils;

import java.io.InputStream;
import java.sql.*;
import java.util.Properties;

/**
 * JDBC工具类
 *
 * @author KevinWilliams*/
public class JDBCUtils {
    /**1.私有化构造方法*/
    private JDBCUtils(){}

    /**2.声明所需要的配置变量*/
    private static String url;
    private static String username;
    private static String password;
    private static Connection con;
    /*3.提供静态代码块，读取配置文件信息为变量赋值，注册驱动*/
    static {
        try {
            //读取配置文件信息为变量赋值
            InputStream is = JDBCUtils.class.getClassLoader().getResourceAsStream("config.properties");
            Properties prop = new Properties();
            prop.load(is);

            //driverClass = prop.getProperty("driverClass");
            url = prop.getProperty("url");
            username = prop.getProperty("username");
            password = prop.getProperty("password");

            //注册驱动
            // Class.forName(driverClass);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    /**4.提供获取数据库连接的方法*/
    public static Connection getConnection(){
        try {
            con = DriverManager.getConnection(url,username,password);
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return con;
    }
    /**5.提供释放资源的方法*/
    public static void close(Connection con, Statement stat, ResultSet sr){
        if(con!= null){
            try {
                con.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
        if(stat!= null){
            try {
                stat.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
        if(sr!= null){
            try {
                sr.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
    }
    public static void close(Connection con, Statement stat){
        if(con!= null){
            try {
                con.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
        if(stat!= null){
            try {
                stat.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
    }
}
```

#### 2. SQL 注入攻击

##### 2.1 什么是 sql 注入攻击

就是利用 sql 语句的漏洞来进行对系统攻击，比如说在一个登录界面，输入一个错误的用户名或密码，也可以登录成功

##### 2.2 sql 注入攻击原理

- 按照正常道理来说，我们在密码处输入的所有内容，都应该认为是密码的组成
- 但是现在 Statement 对象在执行 sql 语句时，将一部分内容当做查询条件来执行了

##### 2.3 PreparedStatement 解决攻击

- PreparedStatement 的介绍

​ PreparedStatement 就是预编译 sql 语句的执行者对象。在执行 sql 语句之前，将 sql 语句进行提前编译。明确 sql 语句的格式后，就不会改变了。剩余的内容都会认为是参数！参数使用?作为占位符

- 为参数赋值的方法：setXxx(参数 1,参数 2);

​ 参数 1：?的位置编号(编号从 1 开始)

​ 参数 2：?的实际参数

- 执行 sql 语句的方法

​ 执行 insert、update、delete 语句：int executeUpdate();

​ 执行 select 语句：ResultSet executeQuery();

##### 2.4 使用 PreparedStatement

```java
/*
	 使用PreparedStatement的登录方法，解决注入攻击
*/
@Override
public User findByLoginNameAndPassword(String loginName, String password) {
    //定义必要信息
    Connection conn = null;
    PreparedStatement pstm = null;
    ResultSet rs = null;
    User user = null;
    try {
        //1.获取连接
        conn = JDBCUtils.getConnection();
        //2.创建操作SQL对象
        String sql = "SELECT * FROM user WHERE loginname=? AND password=?";
        pstm = conn.prepareStatement(sql);
        //3.设置参数
        pstm.setString(1,loginName);
        pstm.setString(2,password);
        System.out.println(sql);
        //4.执行sql语句，获取结果集
        rs = pstm.executeQuery();
        //5.获取结果集
        if (rs.next()) {
            //6.封装
            user = new User();
            user.setUid(rs.getString("uid"));
            user.setUcode(rs.getString("ucode"));
            user.setUsername(rs.getString("username"));
            user.setPassword(rs.getString("password"));
            user.setGender(rs.getString("gender"));
            user.setDutydate(rs.getDate("dutydate"));
            user.setBirthday(rs.getDate("birthday"));
            user.setLoginname(rs.getString("loginname"));
        }
        //7.返回
        return user;
    }catch (Exception e){
        throw new RuntimeException(e);
    }finally {
        JDBCUtils.close(conn,pstm,rs);
    }
}
```
