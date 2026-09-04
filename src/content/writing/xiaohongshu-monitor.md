---
title: "用 Python 构建小红书用户动态监控系统"
description: "复盘一个小红书动态监控练习项目的模块划分、状态存储与任务调度。"
publishedAt: 2025-02-11
updatedAt: 2026-09-04
type: technical
tags: ["爬虫", "Python"]
draft: false
readingMinutes: 22
---
> **维护说明（2026-09）：** 这是一份历史练习项目复盘，不是可直接运行的成品。第三方平台接口、页面结构和自动化规则会变化；不要自动点赞、评论或规避访问限制，只处理已获授权的数据。

## 项目说明
该项目的目的是监控小红书用户的动态笔记，自动进行点赞和评论互动。通过配置灵活的参数，可以对不同的用户进行实时互动，同时利用大语言模型（LLM）生成个性化的高情商评论。该项目主要面向开发者，帮助他们实现自动化的社交互动，提高用户参与度和互动效果。
## 文件结构
本项目主要包含以下几个文件：
comment_generator.py：生成评论的模块。
config.py：配置文件，存储项目运行时的配置项。
db.py：数据库操作文件，负责笔记历史数据的存储与读取。
monitor.py：主程序文件，负责监控和执行互动操作。
wecom.py：与企业微信接口对接的模块，发送通知消息。
utils.py：工具模块，提供一些辅助功能。

## 代码和功能详情
### 配置文件config.py
该文件包含项目的配置信息，包括监控行为、LLM 配置等
```python
# 配置小红书，企业微信通知以及监控相关信息

# 小红书config
XHS_CONFIG = {
    "COOKIE": "登录后小红书的cookie"
}

# 这里使用企业微信 Webhook
# 机器人 Webhook 是最简单的方法，无需 API 认证，也没有 IP 限制
WECOM_CONFIG = {
    "WEBHOOK_URL": "自己获取的Webhook URL"
}
MONITOR_CONFIG = {
    "USER_ID_1": "被监控用户的小红书id",
    "USER_ID_2": "被监控用户的小红书id",
    "USER_ID_3": "被监控用户的小红书id",
    "USER_ID_4": "被监控用户的小红书id",
    "USER_ID_5": "被监控用户的小红书id",
    # "USER_ID": "被监控用户的小红书id",
    "CHECK_INTERVAL": 5,  # 检查笔记更新时间（秒）
    "ERROR_COUNT": 10,
    "AUTO_INTERACT": True,  # 是否开启自动互动
    "FALLBACK_COMMENTS": [  # 随机选择一条评论
        "太棒了！",
        "喜欢这篇笔记",
        "我来啦~",
        "路过~",
        "感谢分享",
        "期待更新~",
        "支持支持！"
    ],
    "LIKE_DELAY": 5,  # 点赞延迟(秒)
    "COMMENT_DELAY": 10,  # 评论延迟(秒)
}
# LLM配置
LLM_CONFIG = {
    "API_KEY": "OpenAI API Key",
    "API_BASE": "API代理地址",
    "MODEL": "gpt-3.5-turbo",
    "MAX_TOKENS": 150, # 生成的评论最大字数
    "TEMPERATURE": 0.7,
    "SYSTEM_PROMPT": """你是一个正在追求心仪女生的人，需要对她的小红书笔记进行评论。
请根据笔记内容生成一条甜蜜、真诚但不过分的评论。评论要：
1. 体现你在认真看她的内容
2. 表达适度的赞美和支持
3. 语气要自然、真诚
4. 避免过分讨好或低声下气
5. 根据内容类型（图文/视频）采用合适的表达
6. 字数控制在100字以内
7. 避免过于模板化的表达
8. 评论内容要符合小红书平台规则"""
}
```
该文件包含项目的配置信息，包括监控行为、LLM 配置等。主要的配置项有：
MONITOR_CONFIG: 包含是否开启自动互动（AUTO_INTERACT）、评论延迟（COMMENT_DELAY）、点赞延迟（LIKE_DELAY）等。
LLM_CONFIG: 包含用于生成评论的大语言模型的配置，如 API_KEY、API_BASE、MODEL、TEMPERATURE 等。

### 企业微信群机器人通知wecom.py
与企业微信接口对接的模块，发送通知消息。
```python
import time
import requests

class WecomMessage:
    def __init__(self, webhook_url: str):
        """
        初始化 WecomMessage 实例
        :param webhook_url: 企业微信机器人的 Webhook 地址
        """
        self.webhook_url = webhook_url
    def send_text(self, content: str):
        """
        发送文本消息
        :param content: 消息内容
        :return: 是否发送成功
        """
        try:
            message = {
                "msgtype": "text",
                "text": {
                    "content": content
                },
                "enable_duplicate_check": 1, # 启用重复消息检查
                "duplicate_check_interval": 1800 # 重复消息的检查间隔（单位：秒），这里设置为 30 分钟
            }
            # # 向 Webhook URL 发送 POST 请求，携带消息体
            response = requests.post(self.webhook_url, json=message, timeout=10)
            response.raise_for_status()
            result = response.json() # 解析返回的 JSON 响应

            # 如果返回的 errcode 为 0，则表示发送成功
            if result.get("errcode") == 0:
                print(f"群机器人消息发送成功")
                return True
            else:
                # 如果发送失败，记录错误信息并返回
                print(f"群消息机器人发送失败: {result}")
                return False

        except Exception as e:
            print(f"群机器人消息发送异常: {e}")
            return False

        finally:
            time.sleep(1.5)  #1.5 秒延时，防止频繁请求
```
`send_notification(message: str)`: 发送通知到企业微信。
`send_interaction_result(result: str)`: 发送互动结果（如成功点赞或评论）到企业微信。

### 数据库文件db.py
负责与数据库进行交互，存储用户笔记历史数据。
```python
import sqlite3
from datetime import datetime
from typing import Dict

class Database:
    def __init__(self, db_path: str = "notes.db"):
        """
        初始化数据库连接
        :param db_path: 数据库文件路径
        """
        self.db_path = db_path
        self.init_db()

    def init_db(self):
        """
        初始化数据库表
        """
        try:
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                cursor.execute('''
                    CREATE TABLE IF NOT EXISTS notes (
                        note_id TEXT PRIMARY KEY,
                        user_id TEXT NOT NULL,
                        title TEXT,
                        discovered_time TEXT NOT NULL,
                        type TEXT
                    )
                ''')
                conn.commit()
                print("数据库表初始化成功")
        except sqlite3.DatabaseError as e:
            print(f"数据库初始化失败: {e}")

    def add_note_if_not_exists(self, note_data: Dict) -> bool:
        """
        添加笔记记录
        :param note_data: 笔记数据字典，包含 note_id, user_id, title, type 等信息
        :return: 是否为新笔记
        """
        try:
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()

                # 检查笔记存在
                cursor.execute('SELECT note_id FROM notes WHERE note_id = ?',
                             (note_data.get('note_id'),))
                if cursor.fetchone():
                    return False  # 如果笔记存在，返回 False

                # 添加新的笔记
                cursor.execute('''
                    INSERT INTO notes (
                        note_id, user_id, title, discovered_time, type
                    ) VALUES (?, ?, ?, ?, ?)
                ''', (
                    note_data.get('note_id'),
                    note_data.get('user').get('user_id'),
                    note_data.get('display_title', '无标题'),
                    datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                    note_data.get('type', 'normal')
                ))
                conn.commit()
                return True
        except sqlite3.DatabaseError as e:
            print(f"插入笔记失败: {e}")
            return False

    def get_user_notes_count(self, user_id: str) -> int:
        """
        获取数据库中某用户的笔记数量
        :param user_id: 用户ID
        :return: 笔记数量
        """
        try:
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                cursor.execute("SELECT COUNT(*) FROM notes WHERE user_id = ?", (user_id,))
                count = cursor.fetchone()[0]
                print(f"用户 {user_id} 的笔记数量: {count}")
                return count or 0
        except sqlite3.DatabaseError as e:
            print(f"获取笔记数量失败: {e}")
            return 0

```
`get_history(user_id: str) -> list`: 获取指定用户的历史笔记数据。
`save_history(note: dict)`: 保存新的笔记数据到数据库。

### 工具模块utils.py
工具模块，提供一些辅助功能。
```python
from playwright.sync_api import sync_playwright
from time import sleep
import logging
import random

def xhs_sign(uri, data=None, a1="", web_session="", stealth_js_path="public/stealth.min.js"):
    """
    获取小红书签名参数
    :param uri: 请求的 URI
    :param data: 请求的数据
    :param a1: 用户的 cookies 信息
    :param web_session: 当前的 web 会话（暂未使用）
    :param stealth_js_path: stealth.js 的路径
    :return: 加密后的请求参数
    """
    retry_limit = 10  # 最大重试次数
    for attempt in range(retry_limit):
        try:
            with sync_playwright() as playwright:
                chromium = playwright.chromium

                browser = chromium.launch(headless=True)

                browser_context = browser.new_context()
                browser_context.add_init_script(path=stealth_js_path)  # 加载反爬虫脚本
                context_page = browser_context.new_page()
                context_page.goto("https://www.xiaohongshu.com")

                # 设置 cookies
                browser_context.add_cookies([
                    {'name': 'a1', 'value': a1, 'domain': ".xiaohongshu.com", 'path': "/"}
                ])
                context_page.reload()  # 刷新页面
                sleep(random.uniform(1, 2))  # 随机等待，模拟正常行为

                # 加密参数获取
                encrypt_params = context_page.evaluate("([url, data]) => window._webmsxyw(url, data)", [uri, data])

                # 返回加密后的签名参数
                return {
                    "x-s": encrypt_params["X-s"],
                    "x-t": str(encrypt_params["X-t"])
                }
        except Exception as e:
            logging.error(f"第 {attempt + 1} 次尝试失败: {e}")
            sleep(random.uniform(3, 5))  # 重试间隔随机化，避免频繁请求
    # 重试多次失败，抛出异常
    raise Exception("签名失败，重试次数达到上限")
```
`generate_sign(user_id: str)`: 生成用户的签名，用于标识该用户的唯一性。
`parse_note_data(note_data: dict)`: 解析从小红书获取的笔记数据，提取出关键信息。
### 自动点赞和评论comment_generator.py
这个模块负责根据指定的用户笔记内容，生成个性化的评论。评论内容由预先定义的模板和大语言模型（LLM）动态生成。
```python
import requests
import random
import logging
from config import LLM_CONFIG, MONITOR_CONFIG

# 设置日志记录
logging.basicConfig(level=logging.INFO)

class CommentGenerator:
    def __init__(self):
        self.api_key = LLM_CONFIG["API_KEY"]
        self.api_base = LLM_CONFIG["API_BASE"]
        self.model = LLM_CONFIG["MODEL"]

    def generate_comment(self, title: str, content: str) -> str:
        """
        根据笔记标题和内容生成评论
        """
        try:
            response = requests.post(
                f"{self.api_base}/chat/completions",
                headers={
                    "Authorization": f"Bearer {self.api_key}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": self.model,
                    "messages": [
                        {
                            "role": "system",
                            "content": LLM_CONFIG["SYSTEM_PROMPT"]
                        },
                        {
                            "role": "user",
                            "content": f"请根据以下笔记生成一条评论:\n标题: {title}\n内容: {content}"
                        }
                    ],
                    "max_tokens": LLM_CONFIG["MAX_TOKENS"],
                    "temperature": LLM_CONFIG["TEMPERATURE"]
                }
            )

            if response.status_code == 200:
                comment = response.json()["choices"][0]["message"]["content"].strip()
                logging.info("评论生成成功")
                return comment
            else:
                logging.error(f"API 请求失败: {response.status_code}")
                logging.error(f"错误信息: {response.text}")
                return self._get_fallback_comment()

        except requests.exceptions.RequestException as e:
            logging.error(f"生成评论失败: {e}")
            return self._get_fallback_comment()

    def _get_fallback_comment(self) -> str:
        """
        当 API 调用失败时的备用评论
        """
        fallback_comment = random.choice(MONITOR_CONFIG.get('FALLBACK_COMMENTS', []))
        logging.warning(f"使用备用评论: {fallback_comment}")
        return fallback_comment
```
`generate_comment(note: dict) -> str`: 根据用户的笔记内容生成个性化的评论。

### 主程序monitor.py
该文件是项目的核心，负责监控小红书用户的笔记更新并执行互动操作。
```python
from xhs import XhsClient
import time
from typing import List
from config import XHS_CONFIG, WECOM_CONFIG, MONITOR_CONFIG
from utils import xhs_sign
from db import Database
from wecom import WecomMessage
from comment_generator import CommentGenerator
import threading
from concurrent.futures import ThreadPoolExecutor

class XHSMonitor:
    def __init__(self, cookie: str, webhook_url: str):
        # 初始化小红书客户端，传入 Cookie 和签名
        self.client = XhsClient(cookie=cookie, sign=xhs_sign)
        self.wecom = WecomMessage(webhook_url)
        self.db = Database()
        self.error_count = 0
        self.comment_generator = CommentGenerator()
        self.lock = threading.Lock()  # 用于保护数据库等共享资源
        # 创建线程池，最大同时运行5个线程
        self.executor = ThreadPoolExecutor(max_workers=5)

    def send_error_notification(self, error_msg: str):
        """
        发送错误通知
        :param error_msg: 错误信息
        """
        time_str = time.strftime('%Y-%m-%d %H:%M:%S')
        content = (
            "小红书监控异常告警\n"
            f"错误信息：{error_msg}\n"
            f"告警时间：{time_str}"
        )
        self.wecom.send_text(content)

    def get_latest_notes(self, user_id: str) -> List[dict]:
        """
        获取用户最新笔记
        :param user_id: 用户ID
        :return: 笔记列表
        """
        try:
            # 请求获取用户笔记数据
            res_data = self.client.get_user_notes(user_id)
            self.error_count = 0
            return res_data.get('notes', [])

        except Exception as e:
            # 如果发生错误，记录日志并进行重试
            error_msg = str(e)
            print(f"获取用户笔记失败: {error_msg}")
            time.sleep(60)

            self.error_count += 1
            # 如果连续错误次数达到阈值，发送告警并终止程序
            if self.error_count >= MONITOR_CONFIG["ERROR_COUNT"]:
                self.send_error_notification(f"API 请求失败\n详细信息：{error_msg}")
                exit(-1)

            return []

    def like_note(self, note_id: str) -> bool:
        """
        点赞笔记
        :param note_id: 笔记ID
        :return: 是否成功
        """
        try:
            # 添加点赞延迟，防止操作过快
            time.sleep(MONITOR_CONFIG["LIKE_DELAY"])  # 添加延迟，避免操作过快
            self.client.like_note(note_id)
            print(f"点赞成功: {note_id}")
            return True
        except Exception as e:
            print(f"点赞失败: {e}")
            return False

    def get_note_detail(self, note_id: str, xsec: str) -> dict:
        """
        获取笔记详细信息
        :param note_id: 笔记ID
        :return: 笔记详细信息
        """
        try:
             # 请求笔记详情
            uri = '/api/sns/web/v1/feed'
            data = {"source_note_id": note_id, "image_formats": ["jpg", "webp", "avif"], "extra": {"need_body_topic": "1"}, "xsec_source": "pc_search", "xsec_token": xsec}
            res = self.client.post(uri, data=data)
            note_detail = res["items"][0]["note_card"]
            return note_detail
        except Exception as e:
            print(f"获取笔记详情失败: {e}")
            return {}

    def comment_note(self, note_id: str, note_data: dict) -> dict:
        """
        评论笔记
        :param note_id: 笔记ID
        :param note_data: 笔记数据
        :return: 评论结果
        """
        try:
            # 添加评论延迟，防止操作过快
            time.sleep(MONITOR_CONFIG["COMMENT_DELAY"])
            note_detail = self.get_note_detail(note_id, note_data.get('xsec_token', ''))
            title = note_detail.get('title', '')
            content = note_detail.get('desc', '')
            note_type = '视频' if note_detail.get('type') == 'video' else '图文'
            content = f"这是一个{note_type}笔记。{content}"
            comment = self.comment_generator.generate_comment(title, content)
            # 在评论生成成功后进行评论
            if comment:
                self.client.comment_note(note_id, comment)
                print(f"评论成功: {note_id} - {comment}")
                return { "comment_status": True, "comment_content": comment }
            else:
                print(f"评论生成失败，未进行评论: {note_id}")
                return { "comment_status": False, "comment_content": "" }
        except Exception as e:
            print(f"评论失败: {e}")
            return { "comment_status": False, "comment_content": "" }

    def interact_with_note(self, note_data: dict) -> dict:
        """
        与笔记互动（点赞+评论）
        :param note_data: 笔记数据
        :return: 互动结果
        """
        result = {
            "like_status": False,
            "comment_status": False,
            "comment_content": ""
        }

        if not MONITOR_CONFIG.get("AUTO_INTERACT"):
            return result

        note_id = note_data.get('note_id')
        if not note_id:
            return result
        # 执行点赞操作
        result["like_status"] = self.like_note(note_id)
        # 执行评论操作
        comment_result = self.comment_note(note_id, note_data)

        result["comment_status"] = comment_result["comment_status"]
        result["comment_content"] = comment_result["comment_content"]

        return result

    def send_note_notification(self, note_data: dict, interact_result: dict = None):
        """
        发送笔记通知
        :param note_data: 笔记数据
        :param interact_result: 互动结果
        """
        note_url = f"https://www.xiaohongshu.com/explore/{note_data.get('note_id')}"
        user_name = note_data.get('user', {}).get('nickname', '未知用户')
        title = note_data.get('display_title', '无标题')
        type = note_data.get('type', '未知类型')
        time_str = time.strftime('%Y-%m-%d %H:%M:%S')
        # 构造通知内容
        content = [
            "小红书用户发布新笔记",
            f"用户：{user_name}",
            f"标题：{title}",
            f"链接：{note_url}",
            f"类型：{type}",
        ]

        if interact_result and MONITOR_CONFIG.get("AUTO_INTERACT"):
            like_status = "成功" if interact_result["like_status"] else "失败"
            content.append(f"点赞：{like_status}")

            if interact_result["comment_status"]:
                content.append(f"评论：成功")
                content.append(f"评论内容：{interact_result['comment_content']}")
            else:
                content.append(f"评论：失败")

        content.append(f"监控时间：{time_str}")

        self.wecom.send_text("\n".join(content))

    def monitor_multiple_users(self, user_ids: List[str], interval: int):
        """
        同时监控多个用户动态
        :param user_ids: 用户ID列表
        :param interval: 检查间隔(秒)
        """
        print(f"开始监控多个用户: {user_ids}")

        # 提交每个用户的监控任务到线程池
        futures = [self.executor.submit(self.monitor_user, user_id, interval) for user_id in user_ids]

        # 等待所有任务完成
        for future in futures:
            future.result()  # 如果任务失败，会抛出异常

    def monitor_user(self, user_id: str, interval: int):
        """
        监控单个用户动态
        :param user_id: 用户ID
        :param interval: 检查间隔(秒)
        """
        print(f"开始监控用户: {user_id}")

        while True:
            try:
                latest_notes = self.get_latest_notes(user_id)

                # 使用锁来保护数据库操作
                with self.lock:
                    existing_notes = self.db.get_user_notes_count(user_id)
                    is_first_monitor = existing_notes == 0 and len(latest_notes) > 1

                    if is_first_monitor:
                        welcome_msg = (
                            f"欢迎使用小红书用户监控系统\n"
                            f"监控用户：{latest_notes[0].get('user', {}).get('nickname', user_id)}\n"
                            f"首次监控某用户时，不会对历史笔记进行自动点赞和评论，仅保存笔记记录\n"
                            f"以防止被系统以及用户发现"
                        )
                        self.wecom.send_text(welcome_msg)

                        for note in latest_notes:
                            self.db.add_note_if_not_exists(note)
                    else:
                        for note in latest_notes:
                            with self.lock:
                                if self.db.add_note_if_not_exists(note):
                                    print(f"发现新笔记: {note.get('display_title')}")
                                    interact_result = self.interact_with_note(note)
                                    self.send_note_notification(note, interact_result)

            except Exception as e:
                error_msg = str(e)
                print(f"监控过程发生错误: {error_msg}")

            time.sleep(interval)


def main():
    monitor = XHSMonitor(
        cookie=XHS_CONFIG["COOKIE"],
        webhook_url=WECOM_CONFIG["WEBHOOK_URL"]
    )

    # 假设你要监控5个用户
    user_ids = [
        MONITOR_CONFIG["USER_ID_1"],
        MONITOR_CONFIG["USER_ID_2"],
        MONITOR_CONFIG["USER_ID_3"],
        MONITOR_CONFIG["USER_ID_4"],
        MONITOR_CONFIG["USER_ID_5"]
    ]

    monitor.monitor_multiple_users(
        user_ids=user_ids,
        interval=MONITOR_CONFIG["CHECK_INTERVAL"]
    )


if __name__ == "__main__":
    main()
```
`start_monitoring(user_id: str)`: 开始监控某个用户的笔记动态。
`handle_interaction(note: dict)`: 根据笔记内容执行点赞或评论等操作。
`auto_interact(note: dict)`: 如果启用自动互动功能，自动进行点赞和评论。

### 运行程序
1. 配置环境：确保安装了所需的依赖库。
2. 配置文件：编辑 config.py，填写相关的 API 密钥和监控参数。
3. 启动监控：运行 monitor.py，开始监控指定用户的笔记。
`python monitor.py`

### 运行结果
> **图片暂缺：** 原笔记引用的本地图片资源未随文档保留，后续补充。

### 项目地址
https://github.com/Merthon/xhs-monitor
