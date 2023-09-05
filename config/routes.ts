export default [
  {
    path: '/home',
    name: '首页',
    icon: 'home',
    component: './Home',
  },
  {
    path: '/user',
    layout: false,
    routes: [
      { name: '登录', path: '/user/login', component: './User/Login' },
    ],
  },
  {
    path: '/dashboard',
    name: '监控页',
    icon: 'dashboard',
    component: './DashBoard',
  },
  {
    path: '/datasource',
    name: '数据集',
    icon: 'database',
    routes: [
      { path: '/datasource/list', name: '我的数据', component: './DataSource/DataSourceList' },
      { path: '/datasource/create', name: '导入数据', component: './DataSource/DataSourceCreate' },
      { path: '/datasource/case', name: '案例数据', component: './DataSource/DataSourceCase' },
    ],
  },
  {
    path: '/graph',
    name: '搜索图',
    icon: 'shareAlt',
    routes: [
      { path: '/graph/list', name: '我的图', component: './Graph/GraphList' },
      { path: '/graph/create', name: '导入图', component: './Graph/GraphCreate' },
    ],
  },
  {
    path: '/compute',
    name: '计算任务',
    icon: 'cluster',
    routes: [
      { path: '/compute/list', name: '任务记录', component: './Compute/ComputeList' },
      { path: '/compute/create', name: '新建计算任务', component: './Compute/ComputeCreate' },
    ],
  },
  {
    path: '/demo',
    name: 'demo',
    icon: 'smile',
    hideInMenu: true,
    routes: [
      { path: '/demo/demo01', name: 'demo01', component: './Demo/Demo01' },
      { path: '/demo/demo02', name: 'demo02', component: './Demo/Demo02' },
      { path: '/demo/tutorial', name: 'tutorial', component: './Demo/Tutorial' },
      { path: '/demo/edit', name: 'edit', component: './Demo/EditDemo' },
      { path: '/demo/highlight', name: 'highlight', component: './Demo/HighLightDemo' },
      { path: '/demo/match', name: 'match', component: './Demo/MatchDemo' },
      { path: '/demo/pageRank', name: 'pageRank', component: './Demo/PageRankDemo' },
      { path: '/demo/ged', name: 'ged', component: './Demo/GEDDemo' },
      { path: '/demo/cluster', name: 'cluster', component: './Demo/ClusterDemo' },
      { path: '/demo/websocket', name: 'websocket', component: './Demo/WebSocket'}
    ],
  },
  { path: '/', redirect: '/home' },
  { path: '*', layout: false, component: './404' },
];
