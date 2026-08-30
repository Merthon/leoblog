# leo-log

一个程序员的阅读与构建记录。项目使用 Astro、TypeScript 和 Content Collections 构建，默认输出纯静态站点，计划通过 Vercel 与 Git 仓库自动部署。

## 技术栈

- Astro 7（静态输出）
- TypeScript strict
- Markdown / MDX
- Astro Content Collections
- 原生 CSS + Design Tokens
- RSS + Sitemap
- Vercel 静态部署

## 本地开发

```bash
pnpm install
pnpm dev
```

常用命令：

```bash
pnpm check   # 类型与 Astro 诊断
pnpm build   # 生成 dist/
pnpm preview # 预览静态产物
```

## 内容目录

```text
src/content/
├── writing/  # 技术文章、思考与随笔
├── reading/  # 读书笔记
└── projects/ # 项目记录
```

新增内容时复制同类 Markdown 文件，并填写 frontmatter。内容模型定义在 `src/content.config.ts`。

文章之间通过 frontmatter 中的 ID 建立关联：

```yaml
relatedReadings: [philosophy-of-software-design]
relatedProjects: [leo-log]
```

## 设计稿

最终设计参考已放在：

```text
docs/design/
├── desktop-v2/
└── mobile-v1/
```

设计变量位于 `src/styles/tokens.css`。

## 部署到 Vercel

初版确认后再创建 Git 仓库。仓库创建并推送后：

1. 在 Vercel 中选择 **Add New → Project**。
2. 导入 GitHub 仓库。
3. Framework Preset 选择 **Astro**（通常会自动识别）。
4. Build Command 使用 `pnpm build`。
5. Output Directory 使用 `dist`。
6. 添加环境变量：

   ```text
   SITE_URL=https://你的正式域名
   ```

7. 部署完成后，后续推送到生产分支会自动发布；其他分支和 Pull Request 会生成预览部署。

`SITE_URL` 会用于 canonical、RSS、robots.txt 和 sitemap。正式部署前务必替换示例联系人：

- `leo@example.com`
- `github.com/leo`

## 目录概览

```text
src/
├── components/
│   ├── content/
│   ├── layout/
│   └── ui/
├── content/
├── layouts/
├── lib/
├── pages/
└── styles/
```

当前项目尚未初始化 Git。
