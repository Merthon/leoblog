---
title: "Django 学习笔记"
description: "Django 是一个用 Python 写的 开源 Web 框架，它的作用是帮你快速构建网站或 Web 应用。"
publishedAt: 2025-02-23
type: technical
tags: ["Python", "Django"]
draft: false
readingMinutes: 7
---
## 什么是 Django？
Django 是一个用 Python 写的 **开源 Web 框架**，它的作用是帮你快速构建网站或 Web 应用。想象一下，你要盖一栋房子，如果每块砖、每扇门都自己造，那得多累啊！Django 就像一个“装修公司”，它提供了很多现成的工具（比如数据库操作、网页模板等），让你专注于设计房子的核心功能，而不是从头造工具。
Django 的口号是 **“不要重复发明轮子”**，意思是它已经把 Web 开发中常见的麻烦事都搞定了，你只要学会用这些工具就行。
## Django 的优点有哪些？
- **ORM（对象关系映射）**：可以用 Python 代码操作数据库，不用写复杂的 SQL。
- **自带管理后台**：Django 提供一个现成的界面，方便你管理数据（比如添加、删除、修改）。
- **灵活的 URL 路由**：能轻松把网页地址（URL）和功能代码连接起来。
- **模板系统**：让网页设计（HTML）和逻辑代码（Python）分开，维护更方便。
- **安全性强**：内置保护，防止黑客攻击（比如 SQL 注入、跨站脚本攻击）。
- **可扩展**：可以用插件或中间件增加功能，满足各种需求。
## Django
### 第一步：安装
我们先把 Django 装到你的电脑上。假设你已经会用 Python 和 pip（Python 的包管理工具），打开终端，输入：
`pip3 install django`
然后检查版本：
`django-admin --version`
### 第二步：创建一个 Django 项目
安装好后，我们来创建一个项目。项目就像一个网站的“大本营”，里面可以包含多个功能模块。运行下面这条命令：
`django-admin startproject myproject`
这会在当前目录下生成一个叫 myproject 的文件夹，里面是这样的结构：
- **manage.py**：一个命令行工具，用来管理项目。
- **myproject/**（子目录）：
    - **settings.py**：配置文件，设置数据库、时区等。
    - **urls.py**：URL 路由表，决定哪个地址显示什么内容。
    - **wsgi.py**：部署时用的文件（暂时不用管）。
现在，进入项目目录并启动服务器试试：
`cd myproject
`python manage.py runserver`
打开浏览器，访问http://127.0.0.1:8000/ 你会看到 Django 的欢迎页面，说明项目跑起来了！
### 第三步：创建你的第一个应用
在 Django 中，**项目**是一个大容器，里面可以有多个 **应用**（App）。每个应用负责一个独立功能，比如博客、商店等。我们创建一个叫 myapp 的应用：
`python manage.py startapp myapp`
这会生成一个 myapp 文件夹，结构如下：
- **models.py**：定义数据结构（相当于数据库表）。
- **views.py**：写处理逻辑的代码。
- **admin.py**：配置管理后台。
- **migrations/**：存放数据库变更记录。
创建应用后，要告诉项目有这个应用。打开 myproject/settings.py，找到 INSTALLED_APPS，添加 'myapp'：
```python
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    # ... 其他默认项
    'myapp',  # 添加这行
]
```
### 第四步：定义一个数据模型
假设我们要做一个简单的博客网站，先定义一个“文章”（Post）的模型。打开 myapp/models.py，写下：
```python
from django.db import models

class Post(models.Model):
    title = models.CharField(max_length=100)  # 标题，最多100个字符
    content = models.TextField()              # 正文，文本内容
    created_at = models.DateTimeField(auto_now_add=True)  # 创建时间，自动填入当前时间
```
这里，Post 是一个类，每个属性（title、content 等）对应数据库表的一列。models.CharField 是文本字段，models.TextField 是大段文本，auto_now_add=True 让时间自动生成。
#### 生成数据库表
模型定义好后，要让 Django 创建对应的数据库表。先运行：
`python manage.py makemigrations`
这会生成一个迁移文件，记录模型的变化。然后执行迁移：
`python manage.py migrate`
Django 会自动创建表（默认用 SQLite 数据库，存在 db.sqlite3 文件中）。
### 第五步：写一个简单的视图
视图（View）是处理网页请求的代码。打开 myapp/views.py，写一个简单的功能：
```python
from django.http import HttpResponse

def hello(request):
    return HttpResponse("Hello, world!")
```
这个视图接受请求，返回一句“Hello, world!”。
#### 配置 URL 路由
要让这个视图能被访问，得告诉 Django 哪个地址对应它。打开 myproject/urls.py，改成：
```python
from django.urls import path
from myapp import views

urlpatterns = [
    path('hello/', views.hello),  # 访问 /hello/ 时调用 hello 视图
]
```
重启服务器（python manage.py runserver），访问http://127.0.0.1:8000/hello/，你会看到“Hello, world!”。

### 第六步：使用模板系统
直接返回文字太简单，我们用模板做个漂亮的页面。在 myapp 下创建 templates 文件夹，再建一个 hello.html：
```html
<!DOCTYPE html>
<html>
<head>
    <title>Hello Page</title>
</head>
<body>
    <h1>Hello, {{ name }}!</h1>
</body>
</html>
```
{{ name }} 是模板变量，可以动态替换。修改 views.py：
```python
from django.shortcuts import render

def hello(request):
    return render(request, 'hello.html', {'name': 'world'})
```
告诉 Django 模板位置：在 myproject/settings.py 的 TEMPLATES 设置中，确保 'DIRS' 包含：
```python
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'myapp' / 'templates'],  # 添加这行
        'APP_DIRS': True,
        # ...
    },
]
```
再访问 /hello/，你会看到一个有标题的页面，显示“Hello, world!”。
### 第七步：试试管理后台
Django 自带的管理后台很强大，我们把 Post 模型加进去。打开 myapp/admin.py：
```python
from django.contrib import admin
from .models import Post

admin.site.register(Post)
```
创建管理员账号：
`python manage.py createsuperuser`
按提示输入用户名、邮箱、密码。启动服务器，访问http://127.0.0.1:8000/admin/，登录后就能添加、编辑文章了！
### 第八步：处理表单
我们再加个功能：让用户提交文章。创建 myapp/forms.py：
```python
from django import forms

class PostForm(forms.Form):
    title = forms.CharField(max_length=100)
    content = forms.CharField(widget=forms.Textarea)
```
在 views.py 中添加：
```python
from django.shortcuts import render, redirect
from .forms import PostForm
from .models import Post

def create_post(request):
    if request.method == 'POST':
        form = PostForm(request.POST)
        if form.is_valid():
            Post.objects.create(
                title=form.cleaned_data['title'],
                content=form.cleaned_data['content']
            )
            return redirect('/hello/')
    else:
        form = PostForm()
    return render(request, 'create_post.html', {'form': form})
```
创建模板 templates/create_post.html：
```html
<!DOCTYPE html>
<html>
<head>
    <title>Create Post</title>
</head>
<body>
    <h1>Create a Post</h1>
    <form method="post">
        {% csrf_token %}
        {{ form.as_p }}
        <button type="submit">Submit</button>
    </form>
</body>
</html>
```
在 urls.py 添加路由：
```python
urlpatterns = [
    path('hello/', views.hello),
    path('create/', views.create_post),
]
```
访问 /create/，填入标题和内容，提交后会在数据库存下来。
