---
title: "Django 博客系统"
description: "Django 博客系统示例，该示例基于 Django 5.1.5（假设你已经安装了该版本）以及 MySQL 数据库。"
publishedAt: 2025-02-24
type: technical
tags: ["Django", "Python", "博客"]
draft: false
readingMinutes: 19
---
Django 博客系统示例，该示例基于 Django 5.1.5（假设你已经安装了该版本）以及 MySQL 数据库。整个示例会涵盖项目目录结构、详细的配置、模型、视图、URL 路由、表单、管理后台以及模板
## 项目目录结构
建议将项目组织为多个应用模块，这里我们用一个主项目（例如 `blog_project`）和一个博客应用（`blog`）一个用户管理(`accounts`)
`django-admin startproject blog_project`
`python manage.py startapp blog`
`python manage.py startapp accounts`
## 项目配置
下面是 `blog_project/settings.py` 中的主要配置，重点在于 MySQL 数据库配置以及一些常用配置项。
```python
import os
from pathlib import Path

# BASE_DIR 用于构建相对于项目根目录的路径
BASE_DIR = Path(__file__).resolve().parent.parent

# SECURITY WARNING: 请确保保密此密钥，在生产环境中使用环境变量管理
SECRET_KEY = 'your-secret-key-here'

# DEBUG 设置：生产环境下应设为 False
DEBUG = True
ALLOWED_HOSTS = ['localhost', '127.0.0.1']

# 应用注册：包含 Django 内置应用和我们自定义的 blog 应用
INSTALLED_APPS = [
'django.contrib.admin',
'django.contrib.auth',
'django.contrib.contenttypes',
'django.contrib.sessions',
'django.contrib.messages',
'django.contrib.staticfiles',
'blog', # 注册博客应用
'accounts',
]
MIDDLEWARE = [
'django.middleware.security.SecurityMiddleware',
'django.contrib.sessions.middleware.SessionMiddleware',
'django.middleware.common.CommonMiddleware',
'django.middleware.csrf.CsrfViewMiddleware', # CSRF 防护中间件
'django.contrib.auth.middleware.AuthenticationMiddleware',
'django.contrib.messages.middleware.MessageMiddleware',
'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'blog_project.urls'
# 模板配置：自动寻找各应用中的 templates 目录
TEMPLATES = [
{
'BACKEND': 'django.template.backends.django.DjangoTemplates',
'DIRS': [os.path.join(BASE_DIR, 'templates')], # 全局模板目录（可选）
'APP_DIRS': True, # 自动搜索各应用下的 templates 目录
'OPTIONS': {
'context_processors': [
'django.template.context_processors.debug',
'django.template.context_processors.request', # 使 request 对象在模板中可用
'django.contrib.auth.context_processors.auth',
'django.contrib.messages.context_processors.messages',
],
},
},
]

WSGI_APPLICATION = 'blog_project.wsgi.application'

# 数据库配置：使用 MySQL 数据库
DATABASES = {
'default': {
'ENGINE': 'django.db.backends.mysql', # 指定使用 MySQL 数据库引擎
'NAME': 'blog_db', # 数据库名称
'USER': 'root', # 数据库用户名
'PASSWORD': '你的数据库密码', # 数据库密码
'HOST': 'localhost', # 数据库服务器地址
'PORT': '3306', # 数据库端口
}
}
# 密码验证配置
AUTH_PASSWORD_VALIDATORS = [
{
'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
},
{
'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
},
{
'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
},
{
'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
},
]
# 国际化配置
LANGUAGE_CODE = 'zh-hans'
TIME_ZONE = 'Asia/Shanghai'
USE_I18N = True
USE_L10N = True
USE_TZ = True
# 静态文件配置（CSS、JavaScript、图片等）
STATIC_URL = '/static/'
# 默认主键字段类型
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
```
## 数据模型设计（models.py）
在 `blog/models.py` 中设计文章、分类以及评论的数据模型。
```python
from django.db import models

from django.contrib.auth.models import User


# 分类模型，用于对文章进行分类管理

class Category(models.Model):

name = models.CharField(max_length=100, unique=True, help_text="分类名称，必须唯一")

description = models.TextField(blank=True, null=True, help_text="分类描述，可选")


def __str__(self):

return self.name


# 文章模型，包含文章标题、作者、内容、分类、发布时间等字段

class Post(models.Model):

title = models.CharField(max_length=200, help_text="文章标题")

slug = models.SlugField(max_length=200, unique=True, help_text="文章唯一标识（用于 URL 中）")

author = models.ForeignKey(

User,

on_delete=models.CASCADE,

related_name='blog_posts',

help_text="文章作者，关联 Django 内置用户模型"

)

content = models.TextField(help_text="文章正文内容")

category = models.ForeignKey(

Category,

on_delete=models.SET_NULL,

null=True,

blank=True,

help_text="文章所属分类，可为空"

)

created = models.DateTimeField(auto_now_add=True, help_text="文章创建时间，自动记录")

updated = models.DateTimeField(auto_now=True, help_text="文章更新时间，自动更新")


class Meta:

ordering = ('-created',) # 默认按创建时间倒序排列

verbose_name = '文章'

verbose_name_plural = '文章列表'


def __str__(self):

return self.title


# 评论模型，用于对文章进行评论管理

class Comment(models.Model):

post = models.ForeignKey(

Post,

on_delete=models.CASCADE,

related_name='comments',

help_text="关联的文章"

)

author = models.CharField(max_length=80, help_text="评论作者名称")

email = models.EmailField(help_text="评论作者邮箱")

body = models.TextField(help_text="评论内容")

created = models.DateTimeField(auto_now_add=True, help_text="评论创建时间")

active = models.BooleanField(default=True, help_text="评论是否激活（过滤垃圾评论）")


class Meta:

ordering = ('created',)

verbose_name = '评论'

verbose_name_plural = '评论列表'


def __str__(self):

return f'Comment by {self.author} on {self.post}'
```
## 表单定义（forms.py）
使用 Django 的表单模块定义一个用于提交评论的表单。
```python
from django import forms
from .models import Comment


# 定义评论表单，基于 Comment 模型创建
class CommentForm(forms.ModelForm):
class Meta:
model = Comment
# 指定表单包含的字段
fields = ('author', 'email', 'body')
# 可添加字段的 widgets 或验证规则
widgets = {
'body': forms.Textarea(attrs={'rows': 4, 'placeholder': '请输入评论内容'}),
}
```
## 视图函数（views.py）
在 `blog/views.py` 中定义两个主要视图：
- **文章列表视图**：展示所有文章（可扩展为分页、分类筛选等）
- **文章详情视图**：展示单篇文章的详细内容，并处理评论表单提交
```python
from django.shortcuts import render, get_object_or_404

from .models import Post

from .forms import CommentForm


def post_list(request):

"""

文章列表视图：

- 获取所有文章（企业项目中可考虑只显示已发布文章）

- 渲染模板，并传递文章列表数据

"""

posts = Post.objects.all()

context = {

'posts': posts,

}

return render(request, 'blog/post_list.html', context)


def post_detail(request, slug):

"""

文章详情视图：

- 根据 slug 获取对应文章

- 处理评论表单提交（POST 请求）

- 获取文章所有激活状态的评论

- 渲染详情模板并传递文章、评论、以及评论表单数据

"""

post = get_object_or_404(Post, slug=slug)

comments = post.comments.filter(active=True)

new_comment = None


if request.method == 'POST':

# 如果是提交评论的表单

comment_form = CommentForm(data=request.POST)

if comment_form.is_valid():

# 生成 Comment 对象但暂不提交数据库

new_comment = comment_form.save(commit=False)

new_comment.post = post # 将评论与当前文章关联

new_comment.save() # 保存评论到数据库

else:

comment_form = CommentForm()


context = {

'post': post,

'comments': comments,

'new_comment': new_comment,

'comment_form': comment_form,

}

return render(request, 'blog/post_detail.html', context)
```
## URL 路由配置
### 应用级
在博客应用内部配置 URL 路由，定义文章列表和详情页的访问路径。
```python
from django.urls import path
from . import views

app_name = 'blog' # 设置命名空间，方便模板中反向解析 URL
urlpatterns = [
path('', views.post_list, name='post_list'), # 文章列表页，根路径

path('<slug:slug>/', views.post_detail, name='post_detail'), # 文章详情页，根据 slug 匹配

]
```
在用户管理应用内部配置 URL 路由，定义登陆和注册的访问路径。
```python
from django.urls import path
from django.contrib.auth import views as auth_views
from . import views

app_name = 'accounts'

urlpatterns = [
path('register/', views.register_view, name='register'),
path('login/', auth_views.LoginView.as_view(template_name='accounts/login.html'), name='login'),
path('logout/', auth_views.LogoutView.as_view(next_page='/'), name='logout'),
]
```
### 项目级 URL
在项目的主 URL 文件中包含博客应用的 URL 配置，同时也配置后台管理路径。
```python
from django.contrib import admin
from django.urls import path, include


urlpatterns = [
path('admin/', admin.site.urls), # 后台管理路径
path('', include('blog.urls', namespace='blog')), # 包含博客应用的 URL 路由
# 包含 accounts 应用的 URL，访问前缀为 accounts/
path('accounts/', include('accounts.urls', namespace='accounts')),

]
```
## 后台管理配置
为了方便管理文章、分类和评论，在 `blog/admin.py` 中进行注册，并添加定制化配置。
```python
from django.contrib import admin

from .models import Post, Category, Comment


# 定义文章后台管理显示配置

class PostAdmin(admin.ModelAdmin):

list_display = ('title', 'author', 'created', 'updated') # 后台列表页显示的字段

prepopulated_fields = {'slug': ('title',)} # 自动根据标题生成 slug


# 定义分类后台管理显示配置

class CategoryAdmin(admin.ModelAdmin):

list_display = ('name', 'description')


# 定义评论后台管理显示配置

class CommentAdmin(admin.ModelAdmin):

list_display = ('post', 'author', 'created', 'active')

list_filter = ('active', 'created')

search_fields = ('author', 'email', 'body')


# 注册模型到后台管理系统

admin.site.register(Post, PostAdmin)

admin.site.register(Category, CategoryAdmin)

admin.site.register(Comment, CommentAdmin)
```
 ## 模板示例
 ### 基础模板：base.html
 该模板定义了网站的基本页面结构（头部、尾部、导航等），其他模板都将继承该模板。
 ```html
 {% load static %}

<!DOCTYPE html>

<html lang="zh-CN">

<head>

<meta charset="UTF-8">

<title>{% block title %}我的博客{% endblock %}</title>

<!-- Bootstrap CSS -->

<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">

<!-- 自定义 CSS -->

<link rel="stylesheet" href="{% static 'blog/css/styles.css' %}">

</head>

<body>

<nav class="navbar navbar-expand-lg navbar-dark bg-dark">

<div class="container">

<a class="navbar-brand" href="{% url 'blog:post_list' %}">我的博客</a>

<button class="navbar-toggler" type="button" data-bs-toggle="collapse"

data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"

aria-expanded="false" aria-label="Toggle navigation">

<span class="navbar-toggler-icon"></span>

</button>
<div class="collapse navbar-collapse" id="navbarSupportedContent">
<ul class="navbar-nav ms-auto">
{% if request.user.is_authenticated %}
<li class="nav-item">
<a class="nav-link" href="{% url 'accounts:logout' %}">退出登录</a>
</li>
{% else %}
<li class="nav-item">
<a class="nav-link" href="{% url 'accounts:login' %}">登录</a>
</li>
<li class="nav-item">
<a class="nav-link" href="{% url 'accounts:register' %}">注册</a>
</li>
{% endif %}
</ul>
</div>
</div>
</nav>
<div class="container mt-4">
{% block content %}
{% endblock %}
</div>
<footer class="bg-dark text-white text-center py-3 mt-4">
<p class="mb-0">&copy; 2025 我的博客系统</p>
</footer>

<!-- Bootstrap JS -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
```
### 文章列表模板：post_list.html
展示所有文章的标题、摘要等，并提供链接跳转到详情页。
```html
{% extends "blog/base.html" %}
{% block title %}文章列表{% endblock %}
{% block content %}

<h2 class="mb-4">文章列表</h2>
<div class="row">
{% for post in posts %}
<div class="col-md-6">
<div class="card mb-3">
<div class="card-body">
<h3 class="card-title">
<a href="{% url 'blog:post_detail' post.slug %}" class="text-decoration-none">
{{ post.title }}
</a>
</h3>
<p class="card-subtitle text-muted">
作者：{{ post.author.username }} | 发布时间：{{ post.created|date:"Y-m-d H:i" }}
</p>
<p class="card-text mt-2">

<!-- 截取前 200 个字符作为摘要 -->
{{ post.content|truncatechars:200 }}
</p>
</div>
</div>
</div>
{% empty %}
<p>暂无文章。</p>
{% endfor %}
</div>
{% endblock %}
```
### 文章详情模板：post_detail.html
展示单篇文章的详细内容以及评论列表和评论表单。
```html
{% extends "blog/base.html" %}
{% block title %}{{ post.title }}{% endblock %}
{% block content %}

<!-- 文章详情卡片 -->
<div class="card mb-4">
<div class="card-body">
<h2 class="card-title">{{ post.title }}</h2>
<p class="card-subtitle text-muted mb-3">
作者：{{ post.author.username }} | 发布时间：{{ post.created|date:"Y-m-d H:i" }}
</p>
<div class="card-text">
{{ post.content|linebreaks }}
</div>
</div>
</div>
<!-- 评论列表 -->
<section id="comments" class="mb-4">
<h3>评论</h3>
{% for comment in comments %}
<div class="card mb-2">
<div class="card-body">
<p>
<strong>{{ comment.author }}</strong> 说：
</p>
<p>{{ comment.body|linebreaks }}</p>
<p class="text-muted">评论时间：{{ comment.created|date:"Y-m-d H:i" }}</p>
</div>
</div>
{% empty %}
<p>暂无评论，欢迎抢沙发！</p>
{% endfor %}
</section>
<!-- 评论表单 -->
<section id="add-comment">
<h3>添加评论</h3>
<form method="post">
{% csrf_token %}
{{ comment_form.as_p }}
<button type="submit" class="btn btn-primary">提交评论</button>
</form>
</section>
{% endblock %}
```
## Django 的静态文件功能
在你的 `blog` 应用下创建一个 `static/blog/css` 目录,在 `blog/static/blog/css/styles.css` 中编写一些基础样式，例如全局背景色、字体、文章卡片样式等：
```css
/* 全局基础样式 */
body {
font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
background-color: #f8f9fa; /* 淡灰背景 */
}
/* 让文章卡片与页面分离，显得更干净 */
.card {
margin-bottom: 1rem;
border-radius: 6px;
box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}
```
## 创建超级管理员
在完成以上配置后，运行以下命令即可创建超级管理员账号：
`python manage.py createsuperuser
系统会提示你输入用户名、邮箱（可选）和密码。创建成功后，你就可以通过http://127.0.0.1:8000/admin/ 进入 Django 后台管理系统，并使用超级管理员账号进行管理。
## 本地运行和测试
### 执行数据库迁移
```shell
python manage.py makemigrations
python manage.py migrate
```
### 启动
`python manage.py runserver
分别访问：
- 博客首页（例如：http://127.0.0.1:8000/）
- 用户注册页：http://127.0.0.1:8000/accounts/register/
- 用户登录页：http://127.0.0.1:8000/accounts/login/
## 具体效果图
> **图片暂缺：** 原笔记引用的本地图片资源未随文档保留，后续补充。
## 项目地址
https://github.com/Merthon/DjangoProject
