---
title: "Django 学习笔记"
description: "基于 Django 5.2 LTS，从虚拟环境、项目与应用讲到模型、视图、模板和管理后台。"
publishedAt: 2025-02-23
updatedAt: 2026-09-04
type: technical
tags: ["Python", "Django"]
draft: false
readingMinutes: 6
---

Django 是一个 Python Web 框架，内置 URL 路由、ORM、模板、表单、认证和管理后台。本文选择 **Django 5.2 LTS**：它不是当前功能版本中最新的一支，但安全支持期更长，适合长期维护的学习项目。

## 创建隔离环境

```bash
python -m venv .venv
source .venv/bin/activate       # Windows PowerShell: .venv\Scripts\Activate.ps1
python -m pip install -U pip
python -m pip install 'Django~=5.2.0'
python -m django --version
```

`~=5.2.0` 允许安装 5.2 系列的新补丁版本，但不会自动升级到 6.x。生产项目应使用锁文件记录完整依赖。

## 项目与应用

```bash
django-admin startproject config .
python manage.py startapp blog
python manage.py migrate
python manage.py runserver
```

- **项目**保存全局设置和根路由。
- **应用**负责一个相对独立的业务模块，例如博客、账号或支付。
- `manage.py` 是项目内的管理入口。

把应用加入 `config/settings.py`：

```python
INSTALLED_APPS = [
    # Django 内置应用……
    "blog",
]
```

## 定义模型

`blog/models.py`：

```python
from django.conf import settings
from django.db import models


class Post(models.Model):
    title = models.CharField(max_length=200)
    body = models.TextField()
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="posts",
    )
    published_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-published_at", "-created_at"]

    def __str__(self) -> str:
        return self.title
```

使用 `settings.AUTH_USER_MODEL`，不要在可复用应用中直接依赖内置 `User` 类。生成并执行迁移：

```bash
python manage.py makemigrations
python manage.py migrate
```

## 视图与路由

`blog/views.py`：

```python
from django.shortcuts import get_object_or_404, render

from .models import Post


def post_list(request):
    posts = Post.objects.filter(published_at__isnull=False)
    return render(request, "blog/post_list.html", {"posts": posts})


def post_detail(request, post_id: int):
    post = get_object_or_404(Post, id=post_id, published_at__isnull=False)
    return render(request, "blog/post_detail.html", {"post": post})
```

`blog/urls.py`：

```python
from django.urls import path

from . import views

app_name = "blog"

urlpatterns = [
    path("", views.post_list, name="post-list"),
    path("<int:post_id>/", views.post_detail, name="post-detail"),
]
```

在 `config/urls.py` 中挂载：

```python
from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("admin/", admin.site.urls),
    path("", include("blog.urls")),
]
```

## 模板

创建 `blog/templates/blog/post_list.html`：

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>文章</title>
  </head>
  <body>
    <main>
      <h1>文章</h1>
      {% for post in posts %}
        <article>
          <h2>
            <a href="{% url 'blog:post-detail' post.id %}">
              {{ post.title }}
            </a>
          </h2>
        </article>
      {% empty %}
        <p>还没有文章。</p>
      {% endfor %}
    </main>
  </body>
</html>
```

Django 模板默认会转义变量。只有内容确实经过可信清洗时，才能使用 `safe`，否则会引入 XSS。

## 管理后台

`blog/admin.py`：

```python
from django.contrib import admin

from .models import Post


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ("title", "author", "published_at", "updated_at")
    list_filter = ("published_at",)
    search_fields = ("title", "body")
```

```bash
python manage.py createsuperuser
python manage.py runserver
```

管理后台地址是 `http://127.0.0.1:8000/admin/`。

## 上线前检查

开发服务器不能用于生产。部署前至少要完成：

- 从环境变量或密钥服务读取 `SECRET_KEY`，并关闭 `DEBUG`。
- 配置 `ALLOWED_HOSTS`、HTTPS、安全 Cookie 和可信反向代理。
- 使用生产级 WSGI/ASGI 服务器，并单独处理静态文件。
- 执行 `python manage.py check --deploy`。
- 为数据库建立备份、迁移与回滚流程。
- 补充模型、视图权限和表单验证测试。

## 参考

- [Django 下载与支持版本](https://www.djangoproject.com/download/)
- [Django 5.2 教程](https://docs.djangoproject.com/en/5.2/intro/tutorial01/)
- [Django 部署检查清单](https://docs.djangoproject.com/en/5.2/howto/deployment/checklist/)
