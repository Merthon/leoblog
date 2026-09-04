---
title: "Django 博客系统"
description: "用 Django 5.2 LTS 构建一个可发布、可管理并带权限边界的最小博客系统。"
publishedAt: 2025-02-24
updatedAt: 2026-09-04
type: technical
tags: ["Django", "Python", "博客"]
draft: false
readingMinutes: 10
---

这份示例用 **Django 5.2 LTS** 实现一个最小博客：后台管理文章，前台展示已发布内容。重点是项目结构、数据模型和权限边界，而不是堆叠功能。

> Django 当前还有更新的功能版本。这里选择 5.2 LTS，是为了获得持续到 2028 年的安全支持。开始项目前请再次查看官方支持版本表。

## 初始化项目

```bash
python -m venv .venv
source .venv/bin/activate
python -m pip install -U pip
python -m pip install 'Django~=5.2.0'

django-admin startproject config .
python manage.py startapp blog
```

目录保持简单：

```text
.
├── blog/
│   ├── admin.py
│   ├── models.py
│   ├── urls.py
│   └── views.py
├── config/
│   ├── settings.py
│   └── urls.py
├── templates/
└── manage.py
```

在 `config/settings.py` 中注册应用和全局模板目录：

```python
INSTALLED_APPS = [
    # Django 内置应用……
    "blog",
]

TEMPLATES[0]["DIRS"] = [BASE_DIR / "templates"]

LANGUAGE_CODE = "zh-hans"
TIME_ZONE = "Asia/Shanghai"
USE_I18N = True
USE_TZ = True
```

SQLite 足够支撑本地学习。切换到 MySQL 或 PostgreSQL 时，把连接信息放进环境变量，不要把密码提交到仓库。

## 数据模型

`blog/models.py`：

```python
from django.conf import settings
from django.db import models
from django.urls import reverse


class Category(models.Model):
    name = models.CharField(max_length=80, unique=True)
    slug = models.SlugField(max_length=80, unique=True)

    class Meta:
        verbose_name_plural = "categories"

    def __str__(self) -> str:
        return self.name


class Post(models.Model):
    class Status(models.TextChoices):
        DRAFT = "draft", "草稿"
        PUBLISHED = "published", "已发布"

    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=200, unique=True)
    body = models.TextField()
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="blog_posts",
    )
    category = models.ForeignKey(
        Category,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="posts",
    )
    status = models.CharField(
        max_length=16,
        choices=Status.choices,
        default=Status.DRAFT,
    )
    published_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-published_at", "-created_at"]
        indexes = [models.Index(fields=["status", "published_at"])]

    def __str__(self) -> str:
        return self.title

    def get_absolute_url(self) -> str:
        return reverse("blog:post-detail", kwargs={"slug": self.slug})
```

这里显式区分草稿和已发布内容。仅检查 `published_at` 是否为空不够清晰，也容易在以后扩展预约发布时出错。

```bash
python manage.py makemigrations
python manage.py migrate
```

## 查询与视图

`blog/views.py`：

```python
from django.db.models import QuerySet
from django.utils import timezone
from django.views.generic import DetailView, ListView

from .models import Post


def published_posts() -> QuerySet[Post]:
    return (
        Post.objects
        .filter(status=Post.Status.PUBLISHED, published_at__lte=timezone.now())
        .select_related("author", "category")
    )


class PostListView(ListView):
    template_name = "blog/post_list.html"
    context_object_name = "posts"
    paginate_by = 10

    def get_queryset(self):
        return published_posts()


class PostDetailView(DetailView):
    template_name = "blog/post_detail.html"
    context_object_name = "post"

    def get_queryset(self):
        return published_posts()
```

`select_related` 避免模板访问作者和分类时产生重复查询。两个公开视图共用同一个查询边界，草稿不会因为某个视图漏写过滤条件而泄露。

## URL 路由

`blog/urls.py`：

```python
from django.urls import path

from .views import PostDetailView, PostListView

app_name = "blog"

urlpatterns = [
    path("", PostListView.as_view(), name="post-list"),
    path("posts/<slug:slug>/", PostDetailView.as_view(), name="post-detail"),
]
```

`config/urls.py`：

```python
from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("admin/", admin.site.urls),
    path("", include("blog.urls")),
]
```

## 模板

`templates/blog/post_list.html`：

```html
{% extends "base.html" %}

{% block title %}文章{% endblock %}

{% block content %}
  <h1>文章</h1>
  {% for post in posts %}
    <article>
      <h2><a href="{{ post.get_absolute_url }}">{{ post.title }}</a></h2>
      <p>
        {{ post.published_at|date:"Y-m-d" }}
        {% if post.category %} · {{ post.category.name }}{% endif %}
      </p>
    </article>
  {% empty %}
    <p>还没有已发布文章。</p>
  {% endfor %}
{% endblock %}
```

`templates/blog/post_detail.html`：

```html
{% extends "base.html" %}

{% block title %}{{ post.title }}{% endblock %}

{% block content %}
  <article>
    <h1>{{ post.title }}</h1>
    <p>{{ post.published_at|date:"Y-m-d H:i" }}</p>
    <div>{{ post.body|linebreaks }}</div>
  </article>
{% endblock %}
```

模板变量默认转义。不要为了渲染富文本直接添加 `|safe`；富文本必须先经过可靠的服务端白名单清洗。

## 管理后台

`blog/admin.py`：

```python
from django.contrib import admin

from .models import Category, Post


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    prepopulated_fields = {"slug": ("name",)}


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ("title", "status", "author", "published_at", "updated_at")
    list_filter = ("status", "category", "published_at")
    search_fields = ("title", "body")
    prepopulated_fields = {"slug": ("title",)}
    autocomplete_fields = ("author",)
```

```bash
python manage.py createsuperuser
python manage.py runserver
```

访问 `http://127.0.0.1:8000/admin/` 创建分类和文章。

## 最小测试

至少验证草稿不会出现在公开页面：

```python
from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse
from django.utils import timezone

from .models import Post


class PostListTests(TestCase):
    def test_draft_is_not_public(self):
        user = get_user_model().objects.create_user(username="leo")
        Post.objects.create(
            title="草稿",
            slug="draft",
            body="未发布内容",
            author=user,
            status=Post.Status.DRAFT,
            published_at=timezone.now(),
        )

        response = self.client.get(reverse("blog:post-list"))
        self.assertNotContains(response, "草稿")
```

## 上线前

- `SECRET_KEY` 从环境或密钥服务读取，`DEBUG=False`。
- 配置 `ALLOWED_HOSTS`、HTTPS、安全 Cookie 和 CSRF 可信源。
- 运行 `python manage.py check --deploy`。
- 使用生产级 WSGI/ASGI 服务器，不使用 `runserver`。
- 为数据库、媒体文件和迁移建立备份与回滚流程。
- 编辑文章的接口必须验证登录状态、对象权限和 CSRF Token。

## 参考

- [Django 下载与支持版本](https://www.djangoproject.com/download/)
- [Django 5.2 模型文档](https://docs.djangoproject.com/en/5.2/topics/db/models/)
- [Django 5.2 通用显示视图](https://docs.djangoproject.com/en/5.2/ref/class-based-views/generic-display/)
- [Django 部署检查清单](https://docs.djangoproject.com/en/5.2/howto/deployment/checklist/)
