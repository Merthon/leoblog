---
title: "Django 学习笔记（二）：数据库、模型与管理后台"
description: "记录 Django 数据库配置、模型设计、迁移命令与管理后台的使用方法。"
publishedAt: 2025-02-21
type: technical
tags: ["Python", "Django"]
draft: false
readingMinutes: 8
---
1 结束的地方开始。我们将设置数据库，创建您的第一个模型，并快速介绍 Django 自动生成的管理站点。
## 数据库设置
打开 mysite/settings.py。它是一个普通的 Python 模块，带有代表 Django 设置的模块级变量。
在编辑 mysite/settings.py 时，将 TIME_ZONE 设置为您的时区。
注意文件顶部的 INSTALLED_APPS 设置。它包含此 Django 实例中激活的所有 Django 应用程序的名称。应用程序可以在多个项目中使用，您可以打包和分发它们，以供其他人在其项目中使用。
默认情况下，INSTALLED_APPS 包含以下应用程序，所有这些应用程序都附带在 Django 中：
-  `django.contrib.admin` – 管理站点。您很快就会使用它。
-  `django.contrib.auth` – 一个身份验证系统。
-  `django.contrib.contenttypes` – 内容类型的框架。
-  `django.contrib.sessions` – 会话框架。
-  `django.contrib.messages` – 一个消息传递框架
-  `django.contrib.staticfiles` – 用于管理静态文件的框架。
其中一些应用程序至少使用了一个数据库表，因此我们需要先在数据库中创建表，然后才能使用它们。为此，请运行以下命令：
`python manage.py migrate`
migrate 命令会查看 INSTALLED_APPS 设置，并根据 mysite/settings.py 文件中的数据库设置和应用程序附带的数据库迁移创建任何必要的数据库表

## 创建模型
现在，我们将定义您的模型 – 本质上是您的数据库布局，以及额外的元数据。
在我们的投票应用程序中，我们将创建两个模型：Question 和 Choice。Question 具有问题和发布日期。Choice 有两个字段：Choice 的文本和投票计数。每个 Choice 都与一个 Question 相关联。
这些概念由 Python 类表示。编辑 polls/models.py 文件，使其如下所示：
```python
from django.db import models

class Question(models.Model):
    question_text = models.CharField(max_length=200)
    pub_date = models.DateTimeField("date published")

class Choice(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    choice_text = models.CharField(max_length=200)
    votes = models.IntegerField(default=0)
```

在这里，每个模型都由一个子类化 django.db.models.Model 的类表示。每个模型都有许多类变量，每个类变量都表示模型中的一个数据库字段。每个字段都由 Field 类的一个实例表示，例如，CharField 用于字符字段，DateTimeField 用于日期时间。这告诉 Django 每个字段包含什么类型的数据。
每个 Field 实例的名称（例如 question_text 或 pub_date）是字段的名称，采用计算机友好的格式。您将在 Python 代码中使用此值，并且您的数据库将使用它作为列名。
您可以使用 Field 的可选第一个位置参数来指定人类可读的名称。它被用于 Django 的几个内省部分，它兼作文档。如果没有提供这个字段，Django 将使用机器可读的名称。在此示例中，我们只为 Question.pub_date 定义了一个人类可读的名称。对于此模型中的所有其他字段，字段的机器可读名称将足以作为其人类可读名称。
某些 Field 类具有必需的参数。例如，CharField 要求您为其设置一个 max_length。这不仅用于数据库架构，还用于验证，我们很快就会看到。
Field 还可以具有各种可选参数;在本例中，我们已将 votes 的默认值设置为 0。
最后，请注意，使用 ForeignKey 定义了一个关系。这告诉 Django 每个 Choice 都与一个 Question 相关。Django 支持所有常见的数据库关系：多对一、多对多和一对一。
## 激活模型
那一小段模型代码为 Django 提供了大量信息。有了它，Django 能够：
- 为此应用程序创建数据库架构（`CREATE TABLE` 语句）。
- 创建一个 Python 数据库访问 API，用于访问 `Question` 和 `Choice` 对象。
要将应用程序包含在我们的项目中，我们需要在 INSTALLED_APPS 设置中添加对其配置类的引用。PollsConfig 类位于 polls/apps.py 文件中，因此其虚线路径为 'polls.apps.PollsConfig'。编辑 mysite/settings.py 文件，并将该点路径添加到 INSTALLED_APPS 设置中。它看起来像这样：
```python
INSTALLED_APPS = [
    "polls.apps.PollsConfig",
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
]
```
现在 Django 知道要包含 `polls` 应用程序。让我们运行另一个命令：
`python manage.py makemigrations polls`
通过运行 makemigrations，你告诉 Django 你已经对你的模型做了一些更改（在本例中，你做了新的更改），并且你希望这些更改作为迁移存储。
有一个命令可以为您运行迁移并自动管理您的数据库架构 - 称为 migrate，我们稍后会介绍它 - 但首先，让我们看看该迁移将运行什么 SQL。sqlmigrate 命令获取迁移名称并返回其 SQL：
`python manage.py sqlmigrate polls 0001`
sqlmigrate 命令实际上并没有在你的数据库上运行迁移 - 相反，它会将其打印到屏幕上，以便你可以看到 Django 认为需要的 SQL。它对于检查 Django 将要做什么，或者如果你的数据库管理员需要 SQL 脚本来更改很有用。
如果您有兴趣，您还可以运行 python manage.py check;这将检查项目中的任何问题，而无需进行迁移或接触数据库。
现在，再次运行 `migrate`以在数据库中创建这些模型表
migrate 命令获取所有尚未应用的迁移（Django 使用数据库中一个名为 django_migrations 的特殊表来跟踪哪些迁移已应用），并针对你的数据库运行它们 - 本质上，将你对模型所做的更改与数据库中的架构同步。
模型更改的三步指南：
- 更改模型（`models.py`）。
- 运行 python manage.py makemigrations 为这些更改创建迁移.
- 运行 python manage.py migrate 以将这些更改应用于数据库。
## 使用API
 Django 为提供的免费 API。要调用 Python shell，请使用以下命令：
 `python manage.py shell`
 我们使用它来而不是简单地键入 “python”，因为 manage.py 设置了 DJANGO_SETTINGS_MODULE 环境变量，这会为 Django 提供 mysite/settings.py 文件的 Python 导入路径。
<Question: Question object (1)>不是此对象的有用表示形式。让我们通过编辑 Question 模型（在 polls/models.py 文件中）并向 Question 和 Choice 添加 __str__（） 方法来解决这个问题：
```python
from django.db import models


class Question(models.Model):
    # ...
    def __str__(self):
        return self.question_text


class Choice(models.Model):
    # ...
    def __str__(self):
        return self.choice_text
```
向你的模型添加 __str__（） 方法很重要，不仅是为了你自己在处理交互式提示符时的方便，还因为对象的表示形式在整个 Django 自动生成的 admin 中被使用。
我们还向此模型添加一个自定义方法：
```python
import datetime
from django.db import models
from django.utils import timezone

class Question(models.Model):
    # ...
    def was_published_recently(self):
        return self.pub_date >= timezone.now() - datetime.timedelta(days=1)
```
添加了 import datetime 和 from django.utils import timezone，以分别引用 Python 的标准日期时间模块和 Django 的时区相关实用程序 django.utils.timezone。
并通过再次运行 python manage.py shell 来启动新的 Python 交互式 shell

## Django Admin 简介
### 创建 admin 用户
首先，我们需要创建一个可以登录到 admin 站点的用户。运行以下命令：
`python manage.py createsuperuser`
输入所需的用户名，然后按 Enter。
然后，系统将提示您输入所需的电子邮件地址
最后一步是输入您的密码。您将被要求输入密码两次，第二次作为第一次的确认。
### 启动开发服务器
`python manage.py runserver`
现在，打开一个 Web 浏览器并转到本地域上的“/admin/”——例如，http://127.0.0.1:8000/admin/。您应该会看到管理员的登录屏幕.
### 进入管理站点
现在，尝试使用您在上一步中创建的超级用户帐户登录。你应该看到 Django admin index 页面
您应该看到几种类型的可编辑内容：组和用户。它们由 Django 提供的身份验证框架 django.contrib.auth 提供。
### 应用程序在 admin 中可修改
它不会显示在 admin index 页面上。
还有一件事要做：我们需要告诉管理员 Question 对象有一个管理界面。为此，请打开 polls/admin.py 文件，并将其编辑为如下所示：
```python
from django.contrib import admin

from .models import Question

admin.site.register(Question)
```
### 探索免费的管理功能
现在我们已经注册了 Question，Django 知道它应该显示在 admin 索引页面上,
点击“问题”。现在你来到了 “change list” 页面的问题。此页面显示数据库中的所有问题，并允许您选择一个问题进行更改。我们之前创建了 “What's up？” 问题：
