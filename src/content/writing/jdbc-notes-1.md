---
title: "JDBC 学习笔记（一）"
description: "理解 JDBC 的 Connection、PreparedStatement、ResultSet 与资源生命周期。"
publishedAt: 2022-07-25
updatedAt: 2026-09-04
type: technical
tags: ["MySQL", "Java", "JDBC"]
draft: false
readingMinutes: 4
---

JDBC 是 Java 访问关系型数据库的标准 API。数据库厂商提供驱动实现，业务代码通过统一的 `java.sql` 接口建立连接、执行参数化 SQL 并读取结果。

## 驱动与连接

JDBC 4 之后，合规驱动可以通过 Service Provider 机制自动注册。使用当前 MySQL Connector/J 时，通常不再需要手写 `Class.forName("com.mysql.jdbc.Driver")`；旧类名也已经换成 `com.mysql.cj.jdbc.Driver`。

连接信息不要写死在源码：

```java
String url = System.getenv("DB_URL");
String username = System.getenv("DB_USERNAME");
String password = System.getenv("DB_PASSWORD");

if (url == null || username == null || password == null) {
    throw new IllegalStateException("database environment variables are missing");
}
```

一个本地连接 URL 可能是：

```text
jdbc:mysql://127.0.0.1:3306/app?useUnicode=true&characterEncoding=utf8
```

TLS、时区和证书参数应按部署环境明确配置，不要为了消除报错直接关闭证书验证。

## 核心接口

- `Connection`：数据库会话和事务边界。
- `PreparedStatement`：带参数的预编译语句，避免把数据拼接进 SQL。
- `ResultSet`：查询结果游标。
- `DataSource`：连接来源的抽象；服务端程序通常通过连接池获取连接。

## 查询示例

`try-with-resources` 会按逆序关闭 `ResultSet`、语句和连接：

```java
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public final class FindUser {
    private static final String SQL = """
        SELECT id, display_name
        FROM users
        WHERE id = ?
        """;

    public static void main(String[] args) throws SQLException {
        String url = System.getenv("DB_URL");
        String username = System.getenv("DB_USERNAME");
        String password = System.getenv("DB_PASSWORD");

        try (
            Connection connection = DriverManager.getConnection(url, username, password);
            PreparedStatement statement = connection.prepareStatement(SQL)
        ) {
            statement.setLong(1, 42L);

            try (ResultSet result = statement.executeQuery()) {
                while (result.next()) {
                    long id = result.getLong("id");
                    String displayName = result.getString("display_name");
                    System.out.printf("%d %s%n", id, displayName);
                }
            }
        }
    }
}
```

列名比数字下标更易读。大型结果集还要考虑分页、流式读取和数据库驱动的 fetch size 行为。

## 更新数据

```java
String sql = "UPDATE users SET display_name = ? WHERE id = ?";

try (PreparedStatement statement = connection.prepareStatement(sql)) {
    statement.setString(1, "Leo");
    statement.setLong(2, 42L);

    int affectedRows = statement.executeUpdate();
    if (affectedRows != 1) {
        throw new SQLException("unexpected affected row count: " + affectedRows);
    }
}
```

检查影响行数可以发现条件写错、记录不存在或数据异常。

## 连接池

`DriverManager` 适合小示例。Web 服务应使用 `DataSource` 和连接池，限制最大连接数、获取连接超时和空闲时间。连接池返回的 `Connection.close()` 通常是把连接归还池中，因此仍然必须及时关闭。

连接池大小应根据数据库容量、实例数量和查询耗时压测，不是越大越好。

## 参考

- [Java JDBC Basics](https://docs.oracle.com/javase/tutorial/jdbc/basics/)
- [MySQL Connector/J Developer Guide](https://dev.mysql.com/doc/connector-j/en/)
