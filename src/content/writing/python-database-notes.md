---
title: "Python 连接数据库"
description: "使用 PyMySQL 与 SQLAlchemy 2.x 连接 MySQL，处理参数化查询、事务、连接池和密钥配置。"
publishedAt: 2025-03-11
updatedAt: 2026-09-04
type: technical
tags: ["Python", "数据库", "MySQL"]
draft: false
readingMinutes: 5
---

Python 连接 MySQL 时，可以直接使用 DB-API 驱动，也可以在 SQLAlchemy 上使用连接池、SQL 表达式或 ORM。无论选哪一层，都要处理参数化查询、事务和连接生命周期。

## 准备连接信息

凭据从环境变量或密钥服务读取，不要拼进源码：

```bash
export DB_HOST=127.0.0.1
export DB_PORT=3306
export DB_NAME=app
export DB_USERNAME=app
export DB_PASSWORD='replace-with-a-secret'
```

应用账号只授予需要的库和操作权限，不要长期使用 root。

## PyMySQL

```bash
python -m pip install -U pymysql
```

```python
import os
import pymysql

connection = pymysql.connect(
    host=os.environ["DB_HOST"],
    port=int(os.getenv("DB_PORT", "3306")),
    user=os.environ["DB_USERNAME"],
    password=os.environ["DB_PASSWORD"],
    database=os.environ["DB_NAME"],
    charset="utf8mb4",
    autocommit=False,
    connect_timeout=5,
    read_timeout=15,
    write_timeout=15,
)

try:
    with connection.cursor() as cursor:
        cursor.execute(
            "INSERT INTO users (name, age) VALUES (%s, %s)",
            ("Alice", 25),
        )
        cursor.execute(
            "SELECT id, name, age FROM users WHERE age > %s",
            (20,),
        )
        for row in cursor.fetchall():
            print(row)
    connection.commit()
except Exception:
    connection.rollback()
    raise
finally:
    connection.close()
```

PyMySQL 的占位符是 `%s`，但参数仍应作为第二个参数传入。不要用字符串格式化、f-string 或 `%` 操作符拼 SQL。

## SQLAlchemy 2.x

```bash
python -m pip install -U sqlalchemy pymysql
```

`URL.create` 能正确处理密码中的 `@`、`:` 等特殊字符：

```python
import os
from sqlalchemy import URL, create_engine, text

url = URL.create(
    "mysql+pymysql",
    username=os.environ["DB_USERNAME"],
    password=os.environ["DB_PASSWORD"],
    host=os.environ["DB_HOST"],
    port=int(os.getenv("DB_PORT", "3306")),
    database=os.environ["DB_NAME"],
)

engine = create_engine(
    url,
    pool_size=5,
    max_overflow=5,
    pool_pre_ping=True,
    pool_recycle=1800,
)

with engine.begin() as connection:
    connection.execute(
        text("INSERT INTO users (name, age) VALUES (:name, :age)"),
        {"name": "Bob", "age": 28},
    )

with engine.connect() as connection:
    rows = connection.execute(
        text("SELECT id, name, age FROM users WHERE age > :age"),
        {"age": 20},
    )
    for row in rows:
        print(row.id, row.name, row.age)
```

`engine.begin()` 成功退出时提交，发生异常时回滚。`engine.connect()` 不会自动提交写操作。

## SQLAlchemy ORM

```python
from sqlalchemy import String, select
from sqlalchemy.orm import DeclarativeBase, Mapped, Session, mapped_column


class Base(DeclarativeBase):
    pass


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(80))
    age: Mapped[int]


with Session(engine) as session:
    session.add(User(name="Charlie", age=30))
    session.commit()

with Session(engine) as session:
    users = session.scalars(
        select(User).where(User.age > 20).order_by(User.id)
    ).all()
    for user in users:
        print(user.id, user.name, user.age)
```

这是 SQLAlchemy 2.x 的声明式映射与查询写法。旧教程中的 `sqlalchemy.ext.declarative.declarative_base()` 和 `session.query()` 仍可能出现在遗留项目中，但新代码优先使用 `DeclarativeBase`、`select()` 和 `Session` 上下文管理器。

## 连接池与事务

- 连接池大小要结合数据库最大连接数、应用实例数和查询耗时计算。
- `pool_pre_ping` 能在借出连接前检测部分失效连接，但不能替代失败重试设计。
- 事务尽量短，不要在事务中等待外部 HTTP 请求。
- 只重试明确的临时错误，并确认操作具备幂等性。
- 生产环境启用 TLS，并正确验证数据库证书。

## 参考

- [PyMySQL 文档](https://pymysql.readthedocs.io/en/latest/)
- [SQLAlchemy 2.0 Tutorial](https://docs.sqlalchemy.org/en/20/tutorial/)
- [SQLAlchemy ORM Quick Start](https://docs.sqlalchemy.org/en/20/orm/quickstart.html)
