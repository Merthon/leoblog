---
title: "JDBC 学习笔记（二）"
description: "使用参数化查询、密码哈希与显式事务编写更安全的 JDBC 数据访问代码。"
publishedAt: 2022-07-27
updatedAt: 2026-09-04
type: technical
tags: ["MySQL", "Java", "JDBC", "安全"]
draft: false
readingMinutes: 5
---

这一篇处理 JDBC 中更容易出问题的部分：SQL 注入、密码验证、事务和异常边界。

## 参数化查询

不要把用户输入拼进 SQL：

```java
String unsafeSql = "SELECT * FROM users WHERE login_name = '" + loginName + "'";
```

攻击者可以构造特殊输入改变语句结构。正确做法是固定 SQL 结构，把数据绑定为参数：

```java
String sql = """
    SELECT id, login_name, password_hash
    FROM users
    WHERE login_name = ?
    """;

try (PreparedStatement statement = connection.prepareStatement(sql)) {
    statement.setString(1, loginName);

    try (ResultSet result = statement.executeQuery()) {
        if (result.next()) {
            String encodedHash = result.getString("password_hash");
            // 在应用层使用专用密码哈希库验证输入。
        }
    }
}
```

`PreparedStatement` 能保护**参数值**，但表名、列名和排序方向不能作为普通参数绑定。动态标识符必须来自代码中的允许列表，不能直接接受用户输入。

## 密码不能放进 WHERE 条件

下面这种查询即使使用了占位符，也代表数据库里保存的是可直接比较的密码：

```sql
SELECT * FROM users WHERE login_name = ? AND password = ?
```

正确流程是：

1. 只按规范化后的登录名查询用户。
2. 取出 `password_hash`。
3. 在应用层使用 Argon2id、scrypt 或兼容系统中的 bcrypt 验证。
4. 验证成功后再建立会话。

PreparedStatement 解决 SQL 注入，不解决密码存储。

## 显式事务

多个写操作必须一起成功或一起失败时，关闭自动提交：

```java
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;

public void transfer(Connection connection, long from, long to, long amount)
        throws SQLException {
    boolean originalAutoCommit = connection.getAutoCommit();
    connection.setAutoCommit(false);

    try {
        debit(connection, from, amount);
        credit(connection, to, amount);
        connection.commit();
    } catch (SQLException error) {
        try {
            connection.rollback();
        } catch (SQLException rollbackError) {
            error.addSuppressed(rollbackError);
        }
        throw error;
    } finally {
        connection.setAutoCommit(originalAutoCommit);
    }
}

private void debit(Connection connection, long id, long amount)
        throws SQLException {
    String sql = """
        UPDATE accounts
        SET balance = balance - ?
        WHERE id = ? AND balance >= ?
        """;

    try (PreparedStatement statement = connection.prepareStatement(sql)) {
        statement.setLong(1, amount);
        statement.setLong(2, id);
        statement.setLong(3, amount);
        if (statement.executeUpdate() != 1) {
            throw new SQLException("account missing or insufficient balance");
        }
    }
}
```

真实转账还需要锁、隔离级别、幂等键、金额单位和审计设计。示例只说明 JDBC 事务结构。

## 异常处理

- 不要只调用 `printStackTrace()` 后继续返回 `null`，这会把真正错误拖到更远的位置。
- 在数据访问边界记录 SQL 操作名称、请求 ID 和耗时，不记录密码、Token 或完整敏感参数。
- 回滚失败应作为 suppressed exception 保留。
- 把可恢复错误与编程错误分开，避免对所有 `SQLException` 无条件重试。

## 配置与资源

环境变量适合本地示例；生产环境使用密钥管理服务。应用通常注入 `DataSource`，由连接池统一管理 URL、凭据、连接超时和健康检查。

```properties
DB_URL=jdbc:mysql://127.0.0.1:3306/app
DB_USERNAME=app
DB_PASSWORD=replace-with-a-secret
```

`.env` 和本地 properties 文件应加入 `.gitignore`。仓库里只保留不含真实凭据的模板。

## 参考

- [Java JDBC Transactions](https://docs.oracle.com/javase/tutorial/jdbc/basics/transactions.html)
- [OWASP SQL Injection Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html)
- [OWASP Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)
