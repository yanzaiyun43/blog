export default {
  // 网站基础信息
  Title: '旧识桥',
  Site: 'https://167891.xyz',
  Subtitle: '什么都略懂一点，生活更多彩一些',
  Description: '旧识桥博客，涵盖技术分享与干货输出，Astro静态站搭建、Cloudflare CDN优化、开源阅读推荐、博客搭建等等，简约的界面，内容精炼又有料。博客也分享作者的生活、音乐和旅行的热爱。',
  Author: 'ailmel',
  Avatar: 'https://img.167891.xyz/v2/lEEu0hA.png',
  Motto: 'Cogito ergo sum.',
  Cover: '/assets/images/banner/072c12ec85d2d3b5.webp',
  Tips: '<p>欢迎光临我的博客 🎉</p><p>这里会分享我的日常和学习中的收集、整理及总结，希望能对你有所帮助:) 💖</p>',
  TypeWriteList: [
    '循此苦旅，终抵群星.',
    "Per aspera ad astra.",
  ],
  CreateTime: '2025-12-31',

  /* ======  顶部横幅（浏览器端随机）  ====== */
  HomeBanner: {
    enable: true,
    HomeHeight: '38.88rem',
    PageHeight: '28.88rem',
    // 仅给出数组，不在 Node 端随机
    images: [
      '1.png',
      '2.png'
    ]
  },

  // 主题色
  Theme: {
    "--vh-main-color": "#01C4B6",
    "--vh-font-color": "#34495e",
    "--vh-aside-width": "318px",
    "--vh-main-radius": "0.88rem",
    "--vh-main-max-width": "1458px",
  },

  // 导航
  Navs: [
    { text: '朋友', link: '/links', icon: 'Nav_friends' },
    { text: '圈子', link: '/friends', icon: 'Nav_rss' },
    { text: '动态', link: '/talking', icon: 'Nav_talking' },
    { text: '昔日', link: '/archives', icon: 'Nav_archives' },
    { text: '留言', link: '/message', icon: 'Nav_message' },
    { text: '关于', link: '/about', icon: 'Nav_about' },
  ],

  // 侧边栏个人链接
  WebSites: [
    { text: 'Github', link: 'https://github.com/yanzaiyun43', icon: 'WebSite_github' },
    { text: 'API', link: 'https://ailmel.dpdns.org/', icon: 'WebSite_api' },
    { text: '联系我', link: 'mailto:ailmel@163.com', icon: 'email' },
    { text: '海阔图床', link: 'https://img.167891.xyz/', icon: 'WebSite_img' },
  ],

  // 侧边栏开关
  AsideShow: {
    WebSitesShow: true,
    CategoriesShow: true,
    TagsShow: true,
    recommendArticleShow: true
  },

  // DNS 预解析
  DNSOptimization: [
    'https://i0.wp.com',
    'https://cn.cravatar.com',
    'https://analytics.vvhan.com',
    'https://vh-api.4ce.cn',
    'https://registry.npmmirror.com',
    'https://pagead2.googlesyndication.com'
  ],

  // 音乐接口
  vhMusicApi: 'https://vh-api.4ce.cn/blog/meting',

  // 评论
  Comment: {
    Twikoo: { enable: false, envId: '' },
    Waline: { enable: false, serverURL: '' }
  },

  // 广告
  GoogleAds: {
    // ad_Client: 'ca-pub-xxx',
    // asideAD_Slot: `...`,
    // articleAD_Slot: `...`
  },

  // 赞赏码
  Reward: {
    AliPay: '/assets/images/alipay.webp',
    WeChat: '/assets/images/wechat.webp'
  },

  // SEO 推送
  SeoPush: { enable: false, serverApi: '', paramsName: 'url' },

  // 滚动速度
  ScrollSpeed: 666
};
