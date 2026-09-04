---
title: "分布式微博爬虫与 API"
description: "复盘一个微博话题采集与查询 API 练习项目的架构、存储和任务流。"
publishedAt: 2025-03-14
updatedAt: 2026-09-04
type: technical
tags: ["Python", "爬虫", "API"]
draft: false
readingMinutes: 7
---
> **维护说明（2026-09）：** 这是一份历史架构练习。平台接口、页面结构和访问规则可能已经变化；实现前应优先使用官方 API，只采集已获授权的公开数据，并设置限速、删除与审计机制。

## 前言
WeiboScraper 是一个结合 Python 后端与网页采集的练习项目，目标是爬取微博公开的话题数据，存下来做简单分析，再通过API提供查询功能。

## 需求分析
### 目标需求
-  **爬取数据**：从微博抓取公开话题数据，包括热门话题、用户信息（ID、昵称）、帖子内容、发布时间和点赞数。
-  **数据存储**：存到数据库，方便后续处理和查询。
-  **API服务**：搭一个后端API，让用户能查爬到的数据，比如按话题或用户ID查询。
### 功能需求
- **爬虫**：支持多个话题的爬取，能翻页，抗封能力（后续会加代理，暂时没有）。
- **存储**：使用MongoDB存储数据，加话题字段区分来源。
- **API**：支持GET请求，按条件返回JSON。
## 技术方案
### 技术
- **Python**：核心语言，生态丰富。
- **Scrapy**：爬虫框架，高效解析网页。
- **Scrapy-Redis**：分布式扩展，用Redis做任务队列和去重。
- **MongoDB**：NoSQL数据库，存JSON格式数据。
- **FastAPI**：后端API框架，轻量、异步、自带文档。
### 流程
-  Redis塞初始URL → Scrapy爬取 → 数据存MongoDB。
- FastAPI连MongoDB → 响应用户请求。
## 核心代码
### 实现爬虫功能weibo.py
从Redis取URL，解析话题页，抓帖子，分页爬取，加异常处理。
```python
import scrapy
from scrapy_redis.spiders import RedisSpider
from WeiboScraper.items import WeiboItem
from urllib.parse import parse_qs, urlparse

class WeiboSpider(RedisSpider):
    name = 'weibo'
    allowed_domains = ['s.weibo.com']
    redis_key = 'weibo:start_urls'

    def parse(self, response):
        if response.status != 200:
            print(f"Error: {response.url} 返回 {response.status}")
            return
        print("URL:", response.url)
        topic = parse_qs(urlparse(response.url).query).get('q', ['unknown'])[0]
        posts = response.css('div.card-wrap')
        for post in posts:
            try:
                item = WeiboItem()
                item['user_id'] = post.css('a.name::attr(href)').get(default='unknown').split('/')[-1].split('?')[0]
                item['nickname'] = post.css('a.name::text').get(default='unknown')
                item['content'] = ''.join(post.css('p.txt::text').getall()).strip() or 'N/A'
                item['post_time'] = post.css('p.from a:first-child::text').get(default='N/A').strip()
                item['likes'] = post.css('span.woo-like-count::text').get(default='0')
                item['topic'] = topic
                yield item
            except Exception as e:
                print(f"解析错误: {e}")

        # 下一页
        next_page = response.css('a.next::attr(href)').get()
        if next_page:
            yield scrapy.Request(response.urljoin(next_page), callback=self.parse)
```
### 数据管道：pipelines.py
连接MongoDB，存数据，关闭连接。
```python
from pymongo import MongoClient

class WeiboScraperPipeline:
    def __init__(self):
        self.client = MongoClient('localhost', 27017, username='自己的', password='自己的')
        self.db = self.client['weibo_db']
        self.collection = self.db['posts']

    def process_item(self, item, spider):
        self.collection.insert_one(dict(item))
        return item

    def close_spider(self, spider):
        self.client.close()
```
### API：api.py
FastAPI提供俩端点，查帖子和用户数据。
```python
from fastapi import FastAPI
from pymongo import MongoClient
from pydantic import BaseModel
from typing import List, Optional

app = FastAPI()

client = MongoClient('localhost', 27017, username='admin', password='admin')
db = client['weibo_db']

class Post(BaseModel):
    user_id: str
    nickname: str
    content: str
    post_time: str
    likes: str
    topic: str

@app.get("/posts/", response_model=List[Post])
def get_posts(topic: Optional[str] = None, limit: int = 10):
    query = {'topic': topic} if topic else {}
    posts = list(db.posts.find(query).limit(limit))
    return [Post(**post) for post in posts]

@app.get("/posts/{user_id}", response_model=List[Post])
def get_user_posts(user_id: str, limit: int = 10):
    posts = list(db.posts.find({'user_id': user_id}).limit(limit))
    return [Post(**post) for post in posts]
```
### 配置：settings.py（部分）
配置分布式、限速、管道。
```python
# 加入redis
EDIS_HOST = 'localhost'
REDIS_PORT = 6379
SCHEDULER = "scrapy_redis.scheduler.Scheduler"
DUPEFILTER_CLASS = "scrapy_redis.dupefilter.RFPDupeFilter"
SCHEDULER_PERSIST = True
BOT_NAME = "WeiboScraper"
DOWNLOADER_MIDDLEWARES = {
    'scrapy.downloadermiddlewares.cookies.CookiesMiddleware': None,
}
SPIDER_MODULES = ["WeiboScraper.spiders"]
NEWSPIDER_MODULE = "WeiboScraper.spiders"
COOKIES_ENABLED = True
# 伪装浏览器
DEFAULT_REQUEST_HEADERS = {
    'User-Agent': '自己电脑的user-agent',
    'Accept': '浏览器自己F12查看添加',
    'Accept-Language': 'zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2',
    'Referer': 'https://s.weibo.com/',
    'Cookie': '登录以后自己的cookie'
}
# 下载延迟，防封
DOWNLOAD_DELAY = 2
CONCURRENT_REQUESTS = 8  # redis单机不能太高
# 开启Item Pipeline（存MongoDB用）
ITEM_PIPELINES = {
    'WeiboScraper.pipelines.WeiboScraperPipeline': 300,
}
TWISTED_REACTOR = "twisted.internet.asyncioreactor.AsyncioSelectorReactor"
FEED_EXPORT_ENCODING = "utf-8"
LOG_LEVEL = 'INFO'
```
## 结语
从零搭起来，解决了MongoDB数据库连接问题、数据不全以及出现登录问题、分布式单机等问题，最终实现了爬取、存储、分析和API服务全流程。下一步就是增加评论爬取、前端展示。
## 项目地址
https://github.com/Merthon/WeiboScraper
