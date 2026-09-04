---
title: "Python 连接数据库"
description: "pymysql 是一个纯 Python 实现的 MySQL 客户端库，支持 Python 2 和 Python 3。"
publishedAt: 2025-03-11
type: technical
tags: ["Python", "数据库"]
draft: false
readingMinutes: 6
---
## pymysql
- **简介**
   pymysql 是一个纯 Python 实现的 MySQL 客户端库，支持 Python 2 和 Python 3。它是 MySQLdb 的替代品，提供了简单直接的方式来操作 MySQL 数据库。
- **安装**
   pip install pymysql
- **用法**
   1. 建立连接。
   2. 创建游标（支持普通游标或字典游标）。
   3. 执行 SQL（查询、插入、更新等）。
   4. 提交事务（对于写操作）。
   5. 关闭连接。
具体代码：
```python
import pymysql

# 建立连接
db = pymysql.connect(
    host="localhost",
    user="root",
    password="your_password",
    database="test_db",
    charset="utf8mb4"  # 支持中文等字符集
)
try:
    # 创建游标（可选：cursorclass=pymysql.cursors.DictCursor 返回字典格式）
    cursor = db.cursor()
    # 创建表
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(50),
            age INT
        )
    """)
    # 插入数据
    cursor.execute("INSERT INTO users (name, age) VALUES (%s, %s)", ("Alice", 25))
    db.commit()  # 提交事务
    # 查询数据
    cursor.execute("SELECT * FROM users WHERE age > %s", (20,))
    results = cursor.fetchall()
    for row in results:
        print(row)  # 输出元组：(1, 'Alice', 25)

except Exception as e:
    print(f"Error: {e}")
    db.rollback()  # 出错时回滚

finally:
    # 关闭游标和连接
    cursor.close()
    db.close()
```

## mysql-connector-python
- **简介**
   mysql-connector-python 是 MySQL 官方提供的 Python 连接库，由 Oracle 开发，纯 Python 实现，支持 Python 3。
- **安装**
  pip install mysql-connector-python
代码演示：
```python
import mysql.connector
from mysql.connector import Error

try:
    # 建立连接
    db = mysql.connector.connect(
        host="localhost",
        user="root",
        password="your_password",
        database="test_db",
        charset="utf8mb4"
    )
    # 创建游标（可选：buffered=True 预加载结果）
    cursor = db.cursor()
    # 创建表
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS employees (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(50),
            salary INT
        )
    """)
    # 插入数据（使用参数化查询）
    cursor.execute("INSERT INTO employees (name, salary) VALUES (%s, %s)", ("Bob", 50000))
    db.commit()
    # 查询数据
    cursor.execute("SELECT * FROM employees WHERE salary > %s", (40000,))
    results = cursor.fetchall()
    for row in results:
        print(row)  # 输出元组：(1, 'Bob', 50000)
except Error as e:
    print(f"Error: {e}")
    db.rollback()
finally:
    cursor.close()
    db.close()
```
- 连接池
代码展示：
```python
from mysql.connector import pooling

# 配置连接池
config = {
    "pool_name": "mypool",
    "pool_size": 5,
    "host": "localhost",
    "user": "root",
    "password": "your_password",
    "database": "test_db"
}
pool = pooling.MySQLConnectionPool(**config)
# 从池中获取连接
db = pool.get_connection()
cursor = db.cursor()
cursor.execute("SELECT * FROM employees")
print(cursor.fetchall())
cursor.close()
db.close()
```

## SQLAlchemy
- **简介**
  SQLAlchemy 是一个功能强大的 ORM（对象关系映射）库，支持 MySQL 等多种数据库，提供从低级 SQL 操作到高级 ORM 的多种方式。
- **安装**
  pip install sqlalchemy pymysql（需要 pymysql 作为 MySQL 驱动）。
- **用法**
  1. 创建引擎。
  2. 定义模型（表结构）。
  3. 创建会话。
  4. 执行增删改查。
代码展示：
```python
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# 创建引擎
engine = create_engine(
    "mysql+pymysql://root:your_password@localhost/test_db",
    echo=True  # 打印 SQL 日志，可选
)

# 定义基类
Base = declarative_base()

# 定义模型
class Student(Base):
    __tablename__ = "students"
    id = Column(Integer, primary_key=True)
    name = Column(String(50))
    grade = Column(Integer)

# 创建表
Base.metadata.create_all(engine)
# 创建会话
Session = sessionmaker(bind=engine)
session = Session()
try:
    # 插入数据
    new_student = Student(name="Charlie", grade=85)
    session.add(new_student)
    session.commit()
    # 查询数据
    students = session.query(Student).filter(Student.grade > 80).all()
    for student in students:
        print(student.id, student.name, student.grade)
    # 更新数据
    student = session.query(Student).filter_by(name="Charlie").first()
    student.grade = 90
    session.commit()
    # 删除数据
    session.delete(student)
    session.commit()
except Exception as e:
    print(f"Error: {e}")
    session.rollback()
finally:
    session.close()
```
