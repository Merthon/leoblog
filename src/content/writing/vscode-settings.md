---
title: "VS Code 使用配置"
description: "整理个人 VS Code 配置，覆盖 Git、编辑器外观、格式化及 Python、Go 和 Web 开发。"
publishedAt: 2025-08-04
updatedAt: 2026-09-04
type: technical
tags: ["工具", "配置", "VS Code"]
draft: false
readingMinutes: 8
---
> **维护说明（2026-09）：** 这是个人配置快照。VS Code 与扩展会持续调整设置项；复制前先确认对应扩展已安装，并让编辑器的设置校验提示决定哪些字段仍然有效。

VScode自用配置
```json
{

// ===================== 1. Git 相关 =====================

"git.autofetch": true,

"git.confirmSync": false,

"git.openRepositoryInParentFolders": "never",

"git-graph.graph.style": "rounded",

// ===================== 2. 资源管理器与文件操作 =====================

"explorer.confirmDelete": false,

"explorer.confirmDragAndDrop": false,

"files.autoSave": "afterDelay",

// ===================== 3. 主题与外观 =====================

"workbench.colorTheme": "Palenight (Mild Contrast)",

"workbench.iconTheme": "material-icon-theme",

"workbench.startupEditor": "none",

"workbench.editor.empty.hint": "hidden",

"workbench.list.smoothScrolling": true,

"workbench.colorCustomizations": {

"statusBar.background": "#005f87",

"statusBar.noFolderBackground": "#005f87",

"statusBar.debuggingBackground": "#005f87",

"statusBar.foreground": "#ffffff",

"statusBar.debuggingForeground": "#ffffff"

},

// ===================== 4. 编辑器字体与显示 =====================

"editor.fontSize": 19,

"editor.fontLigatures": true,

"editor.fontWeight": "normal",

"editor.fontFamily": "'Fira Code Retina', 'JetBrainsMonoMedium NF', 'Consolas', 'Droid Sans Mono', 'monospace', monospace, 'Droid Sans Fallback'",

"editor.lineNumbers": "relative",

"editor.minimap.autohide": true,

"editor.smoothScrolling": true,

"editor.cursorBlinking": "expand",

"editor.cursorSmoothCaretAnimation": "on",

"editor.wordWrap": "on",

"editor.tabCompletion": "on",

"editor.unicodeHighlight.ambiguousCharacters": false,

"editor.accessibilitySupport": "off",

"editor.hover.sticky": true,

"indentRainbow.colors": [

"rgba(64,64,64,0.1)",

"rgba(128,128,128,0.1)",

"rgba(192,192,192,0.1)",

"rgba(255,255,255,0.1)"

],

// ===================== 5. 编辑器格式化与自动化 =====================

"editor.formatOnSave": true,

"editor.formatOnPaste": true,

"editor.formatOnType": true,

"editor.autoClosingDelete": "always",

"editor.linkedEditing": true,

"editor.gotoLocation.multipleReferences": "gotoAndPeek",

"editor.inlineSuggest.suppressSuggestions": true,

"diffEditor.wordWrap": "on",

"diffEditor.ignoreTrimWhitespace": false,

// ===================== 6. 语言相关（Python） =====================

"[python]": {

"editor.defaultFormatter": "ms-python.python",

"editor.formatOnSave": true,

"editor.formatOnType": true,

"editor.wordBasedSuggestions": "off",

"diffEditor.ignoreTrimWhitespace": false,

"editor.defaultColorDecorators": "never"

},

"python.createEnvironment.trigger": "prompt",

"python.analysis.autoImportCompletions": true,

"autodocstring.docstringFormat": "google",

// ===================== 7. 语言相关（Go） =====================

"go.toolsManagement.autoUpdate": true,

"go.useLanguageServer": true,

"go.testFlags": ["-v"],

"[go]": {

"editor.formatOnSave": true,

"editor.codeActionsOnSave": {

"source.organizeImports": "explicit"

},

"editor.defaultFormatter": "golang.go"

},

"gopls": {

"ui.semanticTokens": true,

"usePlaceholders": false,

"completionDocumentation": true,

"completeUnimported": true,

"deepCompletion": true

},

// ===================== 8. 语言相关（Web 开发） =====================

"[html]": {

"editor.defaultFormatter": "esbenp.prettier-vscode",

"editor.formatOnSave": true

},

"[css]": {

"editor.defaultFormatter": "esbenp.prettier-vscode",

"editor.formatOnSave": true

},

"[javascript]": {

"editor.defaultFormatter": "esbenp.prettier-vscode",

"editor.formatOnSave": true

},

"[vue]": {

"editor.defaultFormatter": "esbenp.prettier-vscode",

"editor.formatOnSave": true

},

"liveServer.settings.donotShowInfoMsg": true,

"liveServer.settings.donotVerifyTags": true,

"auto-close-tag.enableAutoCloseTag": true,

// ===================== 9. 语言相关（Markdown） =====================

"[markdown]": {

"editor.defaultFormatter": "esbenp.prettier-vscode",

"editor.formatOnSave": true

},

"markdown-preview-enhanced.previewTheme": "github-light.css",

// ===================== 10. 语言相关（Beancount） =====================

"[beancount]": {

"editor.defaultFormatter": "Lencerf.beancount"

},

// ===================== 11. 终端与调试 =====================

"terminal.integrated.fontSize": 16,

"terminal.integrated.defaultProfile.osx": "zsh",

"terminal.integrated.automationProfile.osx": null,

"terminal.integrated.scrollback": 1000,

"workbench.settings.applyToAllProfiles": [

"terminal.integrated.defaultProfile.osx"

],

"debug.terminal.clearBeforeReusing": true,

"debug.internalConsoleOptions": "openOnSessionStart",

// ===================== 12. Docker 相关 =====================

// ===================== 13. LeetCode 相关 =====================

// ===================== 14. 其他插件 =====================

"code-runner.runInTerminal": true,

"code-runner.saveFileBeforeRun": true,

"code-runner.executorMap": {

"python": "python3 -u",

"go": "go run"

},

"rest-client.environmentVariables": {

"local": {

"host": "localhost",

"port": "8080"

}

},

"todo-tree.tree.showScanModeButton": true,

"todo-tree.general.tags": ["TODO", "FIXME", "BUG"],

"cSpell.enabled": true,

"cSpell.language": "en,zh-CN",

// ===================== 15. 其他杂项 =====================

"extensions.ignoreRecommendations": true,

"update.showReleaseNotes": false,

"security.workspace.trust.untrustedFiles": "open",

"editor.codeActionsOnSave": {

},

"workbench.secondarySideBar.defaultVisibility": "hidden"

}
```
