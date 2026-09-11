export type SiteLocale = 'zh-CN' | 'en';

export const navigation = {
  'zh-CN': [
    { id: 'index', label: '索引', href: '/', icon: 'index' },
    { id: 'writing', label: '文章', href: '/writing/', icon: 'writing' },
    { id: 'reading', label: '阅读', href: '/reading/', icon: 'reading' },
    { id: 'projects', label: '项目', href: '/projects/', icon: 'projects' },
    { id: 'now', label: '现在', href: '/now/', icon: 'now' },
  ],
  en: [
    { id: 'index', label: 'Index', href: '/en/', icon: 'index' },
    { id: 'writing', label: 'Writing', href: '/en/writing/', icon: 'writing' },
    { id: 'reading', label: 'Reading', href: '/en/reading/', icon: 'reading' },
    { id: 'projects', label: 'Projects', href: '/en/projects/', icon: 'projects' },
    { id: 'now', label: 'Now', href: '/en/now/', icon: 'now' },
  ],
} as const;

export const layoutText = {
  'zh-CN': {
    skip: '跳到正文',
    homeLabel: '首页',
    navLabel: '主导航',
    mobileNavLabel: '移动端主导航',
    openMenu: '打开导航菜单',
    closeMenu: '关闭导航菜单',
    externalLinks: '站外链接',
    email: '发送邮件',
    rss: 'RSS 订阅',
    updated: '最后更新',
  },
  en: {
    skip: 'Skip to content',
    homeLabel: 'home',
    navLabel: 'Primary navigation',
    mobileNavLabel: 'Mobile navigation',
    openMenu: 'Open navigation menu',
    closeMenu: 'Close navigation menu',
    externalLinks: 'External links',
    email: 'Send email',
    rss: 'RSS feed',
    updated: 'Last updated',
  },
} as const;
