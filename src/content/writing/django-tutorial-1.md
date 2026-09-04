---
title: "Django 学习笔记（一）：项目与应用"
description: "从创建项目、运行开发服务器到构建第一个应用，整理 Django 入门的基础流程。"
publishedAt: 2025-02-21
type: technical
tags: ["Python", "Django"]
draft: false
readingMinutes: 4
---
## 创建项目
建立一个 Django 项目 —— Django 实例的设置集合，包括数据库配置、Django 特定的选项和应用程序特定的设置。
`django-admin startproject mysite`
让我们看看startproject创建了什么：
```bash
djangotutorial/
    manage.py
    mysite/
        __init__.py
        settings.py
        urls.py
        asgi.py
        wsgi.py
```
- manage.py：一个命令行工具，让你以各种方式与这个 Django 项目交互。你可以在 django-admin 和 manage.py 中阅读有关 manage.py 的所有详细信息。
- mysite/：一个目录，该目录是项目的实际 Python 包。它的名称是导入其中任何内容（例如 mysite.urls）时需要使用的 Python 包名称。
- mysite/__init__.py：一个空文件，告诉 Python 这个目录应该被视为一个 Python 包。
- mysite/settings.py： 这个 Django 项目的设置/配置。Django 设置将告诉你所有关于设置是如何工作的。
- mysite/urls.py： 这个 Django 项目的 URL 声明;你的 Django 驱动的网站的 “目录”。
- mysite/urls.py： 这个 Django 项目的 URL 声明;你的 Django 驱动的网站的 “目录”。
- mysite/wsgi.py：与 WSGI 兼容的 Web 服务器为您的项目提供服务的入口点。

## 运行
`python manage.py runserver`
服务器正在运行，请使用 Web 浏览器访问http://120.0.0.1:8000/你会看到一个 “Congratulations！” 页面，火箭起飞了。成功了！

## 创建 Polls 应用程序
要创建应用程序，请确保您与 manage.py 位于同一目录中，然后键入以下命令：
`python manage.py startapp polls`
这将创建一个目录 `polls`，其布局如下：
```bash
polls/
    __init__.py
    admin.py
    apps.py
    migrations/
        __init__.py
    models.py
    tests.py
    views.py
```

### 编写视图
让我们编写第一个视图。打开文件 polls/views.py 并将以下 Python 代码放入其中：
```python
from django.http import HttpResponse

def index(request):
    return HttpResponse("Hello, world. You're at the polls index.")
```
这是 Django 中最基本的视图。要在浏览器中访问它，我们需要将其映射到一个 URL —— 为此，我们需要定义一个 URL 配置，或简称 “URLconf”。这些 URL 配置在每个 Django 应用程序中定义，它们是名为 urls.py 的 Python 文件。
要为 polls 应用程序定义一个 URLconf，请创建一个包含以下内容的 polls/urls.py 文件：
```python
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
]
```
下一步是在 mysite 项目中配置全局 URLconf 以包含 polls.urls 中定义的 URLconf。为此，请在 mysite/urls.py 中添加 django.urls.include 的导入，并在 urlpatterns 列表中插入一个 include（），这样你就有：
```python
from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("polls/", include("polls.urls")),
    path("admin/", admin.site.urls),
]
```
path（） 函数至少需要两个参数：route 和 view。include（） 函数允许引用其他 URLconf。每当 Django 遇到 include（） 时，它都会截断 URL 中匹配到该点的任何部分，并将剩余的字符串发送到包含的 URLconf 进行进一步处理。
include（） 背后的想法是让即插即用的 URL 变得容易。由于投票在它们自己的 URLconf （polls/urls.py） 中，它们可以放在 “/polls/” 或 “/fun_polls/” 下，或 “/content/polls/” 下，或任何其他路径根目录下，应用程序仍然可以工作。
现在已经将索引视图连接到 URLconf 中
在浏览器中转到http://120.0.0.1:8000/polls/您应该会看到文本“Hello， world.You're at the polls index.“，这是您在索引视图中定义的。
