---
title: "Django 学习笔记（三）：视图、模板与表单"
description: "继续完成 Django 投票应用，梳理视图、URL 路由、模板与表单处理。"
publishedAt: 2025-02-21
updatedAt: 2026-09-04
type: technical
tags: ["Python", "Django"]
draft: false
readingMinutes: 10
---
> **版本说明（2026-09）：** 本系列已按 Django 5.2 LTS 复核基础流程。内容源自入门阶段的学习记录；新项目请同时对照版本对应的官方教程。

从  2 结束的地方开始。继续开发 Web 投票应用程序，并将专注于创建公共界面 – “视图”。
## 概述
视图是 Django 应用程序中的一种 “类型” 网页，通常提供特定功能并具有特定模板。例如，在博客应用程序中，您可能有以下视图：
- Blog homepage （博客主页） – 显示最新的几个条目。
- 条目 “详细信息” 页面 – 单个条目的永久链接页面。
- Comment action （评论作） – 处理向给定条目发布评论
在我们的 poll 应用程序中，我们将有以下四个视图：
- 问题 “index” 页面 – 显示最新的几个问题。
- 问题 “详细信息” 页面） – 显示问题文本，没有结果，但有一个用于投票的表单。
- 问题 “results” 页面 – 显示特定问题的结果。
- Vote action （投票作） – 处理对特定问题中特定选项的投票。
在 Django 中，网页和其他内容由视图交付。每个视图都由一个 Python 函数（或方法，在基于类的视图的情况下）表示。Django 将通过检查请求的 URL 来选择一个视图（准确地说，是 URL 在域名后面的部分）。
## 编写更多视图
现在让我们向 polls/views.py 添加更多视图。这些观点略有不同，因为它们需要一个论点：
```python
def detail(request, question_id):
    return HttpResponse("You're looking at question %s." % question_id)


def results(request, question_id):
    response = "You're looking at the results of question %s."
    return HttpResponse(response % question_id)


def vote(request, question_id):
    return HttpResponse("You're voting on question %s." % question_id)
```
通过添加以下 `path()` 调用，将这些新视图连接到 polls.urls 模块中：
```python
from django.urls import path

from . import views

urlpatterns = [
    # ex: /polls/
    path("", views.index, name="index"),
    # ex: /polls/5/
    path("<int:question_id>/", views.detail, name="detail"),
    # ex: /polls/5/results/
    path("<int:question_id>/results/", views.results, name="results"),
    # ex: /polls/5/vote/
    path("<int:question_id>/vote/", views.vote, name="vote"),
]
```
## 编写实际执行作的视图
每个视图负责做以下两件事之一：返回一个包含所请求页面内容的 HttpResponse 对象，或者引发一个异常，比如 Http404。
视图可以从数据库中读取记录，也可以不读取记录。它可以使用 Django 等模板系统——或者第三方 Python 模板系统——也可以不使用。它可以生成 PDF 文件、输出 XML、动态创建 ZIP 文件，使用您想要的任何 Python 库，使用您想要的任何内容。
因为它很方便，让我们使用 Django 自己的数据库 API，我们在  2 中介绍过。这是对新 index（） 视图的一次尝试，该视图根据发布日期显示系统中最新的 5 个投票问题，用逗号分隔：
```python
from django.http import HttpResponse

from .models import Question


def index(request):
    latest_question_list = Question.objects.order_by("-pub_date")[:5]
    output = ", ".join([q.question_text for q in latest_question_list])
    return HttpResponse(output)
# Leave the rest of the views (detail, results, vote) unchanged
```
但是，这里有一个问题：页面的设计在视图中是硬编码的。如果要更改页面的外观，则必须编辑此 Python 代码。因此，让我们使用 Django 的模板系统，通过创建视图可以使用的模板，将设计与 Python 分开。
首先，在 polls 目录中创建一个名为 templates 的目录。Django 将在其中寻找模板。
项目的 TEMPLATES 设置描述了 Django 将如何加载和渲染模板。默认设置文件配置了一个 DjangoTemplates 后端，其 APP_DIRS 选项设置为 True。按照惯例，DjangoTemplates 在每个 INSTALLED_APPS 中查找一个 “templates” 子目录。
刚刚创建的 templates 目录中，创建另一个名为 polls 的目录，并在该目录中创建一个名为 index.html 的文件。换句话说，您的模板应为 polls/templates/polls/index.html。由于 app_directories 模板加载器的工作方式如上所述，你可以在 Django 中将此模板称为 polls/index.html。
```html
{% if latest_question_list %}
    <ul>
    {% for question in latest_question_list %}
        <li><a href="/polls/{{ question.id }}/">{{ question.question_text }}</a></li>
    {% endfor %}
    </ul>
{% else %}
    <p>No polls are available.</p>
{% endif %}
```
现在让我们在 `polls/views.py` 中更新我们的`索引`视图以使用模板：
```python
from django.http import HttpResponse
from django.template import loader

from .models import Question


def index(request):
    latest_question_list = Question.objects.order_by("-pub_date")[:5]
    template = loader.get_template("polls/index.html")
    context = {
        "latest_question_list": latest_question_list,
    }
    return HttpResponse(template.render(context, request))
```
该代码加载名为 polls/index.html 的模板，并向其传递一个上下文。上下文是将模板变量名称映射到 Python 对象的字典。
将浏览器指向 “/polls/” 来加载页面，您应该会看到一个项目符号列表，其中包含 Tutorial 2 中的 “What's up” 问题。该链接指向问题的详细信息页面。
### 快捷键：`render（）`
加载模板、填充上下文并使用渲染模板的结果返回 HttpResponse 对象是一个非常常见的习惯用语。Django 提供了一个快捷方式。这是完整的 index（） 视图，重写了:
```python
# polls/views.py
from django.shortcuts import render

from .models import Question


def index(request):
    latest_question_list = Question.objects.order_by("-pub_date")[:5]
    context = {"latest_question_list": latest_question_list}
    return render(request, "polls/index.html", context)
```
请注意，一旦我们在所有这些视图中完成了这些，我们就不再需要导入 loader 和 HttpResponse（如果你仍然有 detail、results 和 vote 的存根方法，你会想要保留 HttpResponse）。
render（） 函数将请求对象作为其第一个参数，将模板名称作为其第二个参数，将字典作为其可选的第三个参数。它返回使用给定上下文渲染的给定模板的 HttpResponse 对象。
## 引发 404 错误
现在，让我们处理问题详细信息视图 – 显示给定投票的问题文本的页面。这是视图：
```python
from django.http import Http404
from django.shortcuts import render

from .models import Question


# ...
def detail(request, question_id):
    try:
        question = Question.objects.get(pk=question_id)
    except Question.DoesNotExist:
        raise Http404("Question does not exist")
    return render(request, "polls/detail.html", {"question": question})
```
这里的新概念：如果不存在具有请求 ID 的问题，则视图会引发 Http404 异常。
### 快捷键：`get_object_or_404（）`
使用 get（） 并在对象不存在时引发 Http404 是一个非常常见的习惯用法。Django 提供了一个快捷方式。这是重写的 detail（） 视图：
```python
from django.shortcuts import get_object_or_404, render
from .models import Question
# ...
def detail(request, question_id):
    question = get_object_or_404(Question, pk=question_id)
    return render(request, "polls/detail.html", {"question": question})
```

还有一个 get_list_or_404（） 函数，其工作方式与 get_object_or_404（） 相同 - 不同之处在于使用 filter（） 而不是 get（）。如果列表为空，它会引发 Http404。
## 使用模板系统
回到我们的 poll 应用程序的 detail（） 视图。给定上下文变量问题，polls/detail.html 模板可能如下所示：
```html
<h1>{{ question.question_text }}</h1>
<ul>
{% for choice in question.choice_set.all %}
    <li>{{ choice.choice_text }}</li>
{% endfor %}
</ul>
```
模板系统使用点查找语法来访问变量属性。在 {{ question.question_text }} 的例子中，首先 Django 对对象 question 进行字典查找。如果失败，它会尝试属性查找 —— 在这种情况下，这很有效。如果属性查找失败，它将尝试列表索引查找。
方法调用发生在 {% for %} 循环中：question.choice_set.all 被解释为 Python 代码 question.choice_set.all（），它返回 Choice 对象的可迭代对象，适合在 {% for %} 标签中使用。
## 删除模板中的硬编码 URL
当我们在 polls/index.html 模板中编写问题的链接时，该链接部分被硬编码，如下所示：
`<li><a href="/polls/{{ question.id }}/">{{ question.question_text }}</a></li>`
这种硬编码、紧密耦合的方法的问题在于，在具有大量模板的项目中更改 URL 变得具有挑战性。但是，由于您在 polls.urls 模块的 `path()` 函数中定义了 name 参数，因此您可以使用 {% url %} 模板标签来消除对 url 配置中定义的特定 URL 路径的依赖：
`<li><a href="{% url 'detail' question.id %}">{{ question.question_text }}</a></li>`
## 命名空间 URL 名称
项目只有一个应用程序，即 polls。在实际的 Django 项目中，可能有 5 个、10 个、20 个或更多应用程序。Django 如何区分它们之间的 URL 名称？例如，polls 应用程序具有详细信息视图，博客的同一项目中的应用程序也可能具有详细信息视图。如何让 Django 知道在使用 {% url %} 模板标签时为 url 创建哪个应用视图呢？
答案是向你的 URLconf 添加命名空间。在 polls/urls.py 文件中，添加一个 app_name 来设置应用程序命名空间：
```python
from django.urls import path

from . import views

app_name = "polls"
urlpatterns = [
    path("", views.index, name="index"),
    path("<int:question_id>/", views.detail, name="detail"),
    path("<int:question_id>/results/", views.results, name="results"),
    path("<int:question_id>/vote/", views.vote, name="vote"),
]
```
现在将您的 `polls/index.html` 模板从：
```html
<li><a href="{% url 'detail' question.id %}">{{ question.question_text }}</a></li>
```
要指向 Namespaced Detail 视图：
```html
<li><a href="{% url 'polls:detail' question.id %}">{{ question.question_text }}</a></li>
```
