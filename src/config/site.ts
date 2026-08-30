export const SITE = {
  displayName: 'Leo',
  logoText: 'LEO',
  titleSuffix: 'Personal Log',
  role: '开发者',
  tagline: '一个开发人员的阅读与构建记录',
  intro: '我喜欢把复杂的问题拆开，也喜欢通过写作检查自己的判断。这个网站记录我读过的书、做过的项目，以及一些还没有想明白的事情。',
  description: '一个开发者的阅读、写作与项目构建记录。',
  locale: 'zh-CN',
  timezone: 'Asia/Shanghai',
  contact: {
    email: 'imchenxing42@gmail.com',
    githubUsername: 'Merthon',
    githubUrl: 'https://github.com/Merthon',
    extraLink: {
      label: 'X',
      url: 'https://x.com/merthon42',
    },
  },
  now: {
    updatedAt: '2026-08-30',
    updateRhythm: '通常在周末更新',
    doing: ['完善网站', '整理过去的读书笔记'],
    reading: [] as string[],
    focuses: ['AI前沿知识', '知识管理'],
    plans: ['完成第一版网站', '写完项目复盘'],
    aboutSite: '它不是作品陈列柜，而是一份持续维护的个人记录。',
    principles: ['内容属于自己', '链接长期有效', '设计保持克制'],
  },
  project: {
    name: 'leoblog',
    status: '正在构建',
    repositoryUrl: 'git@github.com:Merthon/leoblog.git',
    description: '用于长期保存写作、阅读记录与项目复盘的个人网站。',
  },
} as const;

export const SITE_TITLE = `${SITE.displayName} / ${SITE.titleSuffix}`;
export const DISPLAY_UPDATED_AT = SITE.now.updatedAt.replaceAll('-', '.');

const withDoingPrefix = (item: string) => item.startsWith('正在') ? item : `正在${item}`;
const withReadingPrefix = (item: string) => item.startsWith('正在') ? item : `正在读${item}`;

export const CURRENT_STATUS = [
  ...SITE.now.doing.map((item, index) => ({ text: withDoingPrefix(item), current: index === 0 })),
  ...SITE.now.reading.map((item) => ({ text: withReadingPrefix(item), current: false })),
  ...(SITE.now.updateRhythm ? [{ text: SITE.now.updateRhythm, current: false }] : []),
].slice(0, 3);
