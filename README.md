## 图计算前端

git地址：[qk-antares/graph-compute-frontend (github.com)](https://github.com/qk-antares/graph-compute-frontend)

安装依赖：

```bash
npm install
```

或

```bash
yarn
```

运行项目：

```bash
npm start
```

### 技术选型

React + Ant Design Pro + AntV G6 + XFlow + Ant Design Charts

- React：前端开发框架，搭配TypeScript实现更规范开发

- Ant Design Pro：集成了Ant Design组件库和UmiJS，还提供了常见的后台管理页面模板，用于快速构建项目的大致结构
- AntV G6：用于可视化图
- XFlow：提供了图编辑功能
- Ant Design Charts：提供了各种图表，用于实现平台监控功能

----

### 框架总览

![image-20230905092104123](http://image.antares.cool/PicGo/Project/Graph/image-20230905092104123.png)

1. 用户管理
  - 用户注册登录
  - 用户个人信息管理
2. 平台监控
  - 展示平台硬件信息（有点写死的意味，或者后端写接口获取平台的硬件信息）
  - 监控硬件资源利用状况（**WebSocket每分钟推送硬件资源利用率，同时后端需要缓存过去60分钟的硬件利用状况**）
  - 监控计算任务状态和耗时（计算任务完成时WebSocket主动推动）
  - 统计平台完成的计算任务（例如数量的条形图、类型的饼图），请求计算任务的CRUD接口
3. 数据源管理

  - 导入数据源
    - 文件导入：为保证系统的安全性，文件上传到本地
    - 数据库导入：后端根据前端传来的数据库地址和密码等信息连接数据库，拿到数据库的数据信息后转成对应格式的文件，然后上传到云存储平台上
  - 数据源查看
    - 可视化图（难点：大数据源下可视化图时的节点坐标计算问题）
    - 查看图原始数据
  - 数据源其他管理（下载、删除、重命名），请求数据源的CRUD接口
4. 子图管理

  - 导入子图

    - 文件导入

    - 在线编辑和保存

  - 子图其他管理（下载、删除、重命名）
5. 计算任务管理

  - 创建并提交计算任务，可以用**消息队列**实现，实现任务创建提交和任务计算的解耦，同时可以实现对任务计算接口的限流（计算任务往往需要几秒到几分钟的计算时间，比较占用服务器资源，而用户可能会提交大量的计算任务，为了保证平台的正常运行，服务端最多同时处理若干个计算任务，其他的任务位于消息队列中）
  - 可视化计算结果
    - 编辑路径可视化
    - 相似子图模式可视化
    - PageRank可视化
    - 社群可视化
    - 其他可视化…

---

### 文件夹结构

```java
config
├── defaultSettings.ts	//主题级别的样式设置
└── routes.ts	//路由配置文件

public	//存储静态资源，例如图片、示例数据源文件

src
├── components	//Header和Footer涉及的组件
├── pages
|   ├── Compute	//计算任务相关的组件       
|   |   ├── ComputeCreate	//创建计算任务
|   |   └── ComputeList	//查看计算任务
|   |   	├── Cluster	//社群可视化组件
|   |   	├── ComputeLog
|   |   	├── GED	//编辑路径可视化
|   |   	├── Match	//相似子图模式可视化
|   |		└── PageRank	//PageRank可视化
|   |
|   ├── DashBoard	//监控页的相关组件
|   |   ├── InfoCard	//展示平台硬件信息的Card
|   |   ├── MonitorCard	//实时监控平台硬件状况的Card
|   |   └── TaskCard	//对计算任务进行统计的Card
|   |
|   ├── DataSource	//数据源管理的相关组件
|   |   ├── DataSourceCase	//示例数据源列表
|   |   ├── DataSourceCreate	//创建数据源
|   |   └── DataSourceList   //数据源列表和可视化
|   |
|   ├── Demo	//一些练习时的示例组件
|   |
|   ├── Graph	//子图管理的相关组件
|   |   ├── GraphCreate	//创建子图
|   |   |	└── EditGraph	//图编辑组件
|   |	|		├── config	//对于工具栏、节点右击、快捷键等的配置
|   |	|		└── Node	//自定义的基础节点组件
|   |   └── GraphList   //子图列表和可视化
|   |
|   ├── Home	//主页组件
|   |
|   └── User	//用户相关
|       └── Login   //登录和注册组件
|    
├── services	//对于前端类型和后端接口（地址，请求数据，请求方式）的配置
├── utils	//一些工具类，目前主要是返回虚拟的数据
└── requestConfig.ts	//请求拦截器配置，对发送的请求做前置处理，对接收的响应做前置判断
```

---

### 前端实体的数据结构

#### 图

图G（type GraphData）由nodes数组和edges数组两部分组成。其中每个node有id和label属性（[附：为什么node需要id和label两个属性](#jump1)），id用于唯一标识一个node，目前采用的是uuid，label是node的属性，代表node所属的类别；每条Edge有source和target属性，指向对应node的id：

```typescript
declare namespace Graph {
  type Node = {
    id: string;
    label: string;
    style?: any;
  };

  type Edge = {
    source: string;
    target: string;
    style?: any;
  };

  type Graph = {
    id: string;
    name: string;
    createTime: Date;
    graphData?: GraphData;
  };

  type GraphData = {
    nodes: Node[];
    edges: Edge[];
  };
}
```

[附：图的示例数据](#jump2)

#### 平台监控

```typescript
declare namespace DashBoard {
  type PlatformInfo = {
    ip: string;
    status: string;
    cpuCores: number;
    cpuDescription?: string;
    memory: number;
    memoryDescription?: string;
    storage: number;
    storageDescription?: string;
    bandWidth: number;
    bandWidthDescription?: string;
  };

  type HardwareStatus = {
    cpuUsage: number;
    memoryUsage: number;
    bandWidthIn: number;
    bandWidthOut: number;
    diskRead: number;
    diskWrite: number;
  }
}
```

---

#### 数据源

```typescript
declare namespace DataSource {
  type DataSource = {
 	id: string;
    name: string;
    url: string;
    createTime: Date;
    graphData?: Graph.GraphData;
  };
}
```

---

#### 计算任务

```typescript
declare namespace Compute {
  type Log = {
    id: string;
    name: string;
    type: string;
    entities: (DataSource.DataSource | Graph.Graph)[];
    startTime: Date;
    endTime: Date;
    status: string;
    timeUse: number;
  };

  // 编辑路径的计算结果
  type EditPath = {
    nodes: (string | null)[][];
    edges: (string[] | null)[][];
  }

  // 相似子图模式计算结果，是原图的一个子图
  type Match = {
    nodes: Graph.Node[];
    edges: Graph.Edge[];
  }

  // pageRank的计算结果是一个Map<string, number>，即节点id和节点分数的map
  
  // 社群计算结果（后期可以根据我们的需求更改）
  type ClusterEdge = {
    source: string;
    target: string;
    weight: number;
    count: number;
  }

  type ClusterNode = {
    id: string;
    clusterId: string;
  }

  type Cluster = {
    id: string;
    nodes: ClusterNode[];
    sumTot: number;
  }

  type ClusterResult = {
    clusterEdges: ClusterEdge[];
    clusters: Cluster[];
  }
}
```

编辑路径同样由nodes和edges两部分组成，分别代表节点编辑操作和边编辑操作。

```
type EditPath = {
    nodes: (string | null)[][];
    edges: (string[] | null)[][];
}
```

对于nodes：

- `['id1-1','id2-2']`代表将图1的id1-1节点替换成图2的id2-2节点（当节点的label相同时，cost=0，否则cost=1）
- `[null, 'id2-1']`代表在图1中插图2的id2-1节点（cost=1）
- `['id1-3', null]`代表删除图1的id1-3节点（cost=1）

对于edges：

- `[['id1-1','id1-2],['id2-1','id2-2']]`代表边替换（边替换的cost=0，因为目前不对边的类型区分）
- `[['id1-1','id1-2],null]`代表边删除（cost=1）
- `[null,['id2-1','id2-2']]`代表边添加（cost=1）

总的cost即为编辑距离GED

[附：编辑路径的示例数据](#jump3)

---

### 数据库设计（参考）

user

```
create table user
(
    uid         bigint auto_increment comment '主键'
        primary key,
    username    varchar(64)                                                                                           not null comment '用户名',
    password    varchar(64)                                                                                           not null comment '密码',
    user_role   varchar(16)  default 'user'                                                                           null comment '用户角色',
    avatar      varchar(256) default 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png' null comment '头像',
    create_time datetime     default CURRENT_TIMESTAMP                                                                null comment '创建时间',
    update_time datetime     default CURRENT_TIMESTAMP                                                                null comment '更新时间',
    is_delete   tinyint(1)   default 0                                                                                null comment '逻辑删除',
    constraint username
        unique (username)
);
```

data_source

```sql
create table data_source
(
    id          bigint auto_increment comment '主键'
        primary key,
    name        varchar(128) default ''                null comment '数据源名',
    create_time datetime     default CURRENT_TIMESTAMP null comment '创建时间',
    url         varchar(256)                           not null comment '数据源存储地址',
    is_delete   tinyint(1)   default 0                 not null comment '删除标志'
);
```

graph

```sql
create table graph
(
    id          bigint auto_increment comment '主键'
        primary key,
    name        varchar(128) default ''                null comment '子图名称',
    create_time datetime     default CURRENT_TIMESTAMP null comment '创建时间',
    graph_data  text                                   null comment '直接存储子图的JSON数据',
    is_delete   tinyint(1)   default 0                 not null comment '删除标志'
);
```

compute_task

```sql
create table compute_task
(
    id         bigint auto_increment comment '主键'
        primary key,
    name       varchar(128) default ''                null comment '任务名',
    type       varchar(16)  default ''                not null comment '任务类型',
    end_time   datetime                               null comment '任务结束时间',
    start_time datetime     default CURRENT_TIMESTAMP null comment '任务创建时间',
    status     varchar(16)  default 'running'         not null comment '任务状态',
    result     text                                   null comment '计算结果',
    time_use   int          default -1                null comment '计算耗时',
    is_delete  tinyint(1)   default 0                 not null comment '删除标志'
);
```

---

### 前端界面

#### 首页

主要是引导用户使用平台，展示数据集和子图信息

![image-20230804163208165](http://image.antares.cool/PicGo/Project/Graph/6e4a68eedde5814e1fa9355aa2c1f81f7f1489cb.png)

---

#### 监控页

这一部分只有页面，后续需要websocket与后端通信来拿到实时的平台信息

![image-20230804171109081](http://image.antares.cool/PicGo/Project/Graph/8398847eea37c314ea334b433bda1e2a0274b7cc.png)

![image-20230804171222646](http://image.antares.cool/PicGo/Project/Graph/8a6f4aa8337b1230415f6d0a004880d2e0702a29.png)

---

#### 数据集

查看数据列表和数据详细信息

![image-20230804163322785](http://image.antares.cool/PicGo/Project/Graph/50667a4397e14d305efdeecde60601ab61de5692.png)

![image-20230804163433672](http://image.antares.cool/PicGo/Project/Graph/c5778060f61e01fd71947347c3a93a1ad3f87a92.png)

![image-20230804163502687](http://image.antares.cool/PicGo/Project/Graph/204d73f0bd3e057a3c99f62dba30d1768d628d4c.png)

导入数据

![image-20230804163546882](http://image.antares.cool/PicGo/Project/Graph/50c96b1b5a04d93dc7789c5f7668cba8bdd9fd73.png)

![image-20230804163612557](http://image.antares.cool/PicGo/Project/Graph/234fbaadaee5a186a1c2cc32f869c7c8c7c542f9.png)

目前导入数据部分还有待与后端联动。本地文件上传后应该把文件保存到本地，而且后端要建立相应的表来存储数据源的id，createTime，url等信息；数据库导入主要还是后端建立连接后拿到数据库中的数据，进行一定的格式转换后和本地文件上传进行同样的操作

---

#### 子图

查看管理子图

![image-20230804164032253](http://image.antares.cool/PicGo/Project/Graph/bfb9c8a05aee7e73b6f3d004ed4de62112988912.png)

新建子图，可以从文件导入（和上面一样），或者在线编辑和保存子图：

节点以拖动方式加入图中，边则通过鼠标连接节点上的port，右侧面板可以编辑节点的label，鼠标右键可以选择删除节点/边，支持键盘快捷键

![image-20230804164326598](http://image.antares.cool/PicGo/Project/Graph/2bbd72208774007be1494a49241e736d483cab5a.png)

---

#### 计算任务

查看计算任务的信息

![image-20230804164715727](http://image.antares.cool/PicGo/Project/Graph/e9e039de97a29945155ddd47f40fe896ca1c3669.png)

##### 编辑路径可视化

![image-20230804164807747](http://image.antares.cool/PicGo/Project/Graph/2d9a94300b6f7ca7e45a0e846905942d73b26878.png)

使用一个轮播图来对编辑路径进行可视化，支持自动播放/翻页，每一步（添加、替换）操作的节点/边用红色标出。这一部分是根据mock数据利用js逻辑实现的，不是写死的，后面跟后端对接时，只要图和编辑路径的数据结构符合上面的规范，就能生成可视化结果。

![image-20230804165203881](http://image.antares.cool/PicGo/Project/Graph/f7e5bc46895a32528b818b3416ea7d3beeee4b0c.png)

##### 模式匹配（相似子图模式搜索）可视化

使用轮廓包裹将匹配结果展示出来，同样不是写死的，节点的颜色是根据大图的节点类型数使用一定算法生成的，可以很方便地跟后端对接，后端只需要返回被匹配的子图构成的数组就可以展示出来。

![image-20230804165446361](http://image.antares.cool/PicGo/Project/Graph/ca2741f094d846e57e9cf416433ca6aad7331086.png)

##### PageRank可视化

![image-20230804165925952](http://image.antares.cool/PicGo/Project/Graph/6e73770ffa33c1edfe4705ab49c048d33c850ad4.png)

后面考虑在面板右侧用一个横状条形图将PageRank排名前几的节点信息展示出来

---

##### 社群信息可视化

![image-20230804170531554](http://image.antares.cool/PicGo/Project/Graph/6123deb561a96bf9c421389cc4f0f521700d86a9.png)

---

### API文档

待完善

---

### 目前的问题

#### 可视化图时的节点坐标计算问题

目前前端的图可视化使用的是力导向布局，这是一种假设节点之间存在斥力，边之间存在拉力，然后实时计算节点坐标，并得到平衡状态时节点位置的方法。

然而，这种方法的计算开销很大，当数据源中的节点数达到千级别时，如果想对图数据进行可视化，必须使用静态布局，也就是节点的$(x, y)$坐标都是预先计算好的。

除了计算开销大的问题，节点坐标计算也决定了可视化计算结果的效果。以社群计算为例，如果同一社群的节点，其坐标分散于图的各个区域，则可视化效果很差；再如相似子图模式搜索，如果某个搜索结果的节点在图上的坐标分散，则其轮廓包裹会覆盖较大的区域，多个搜索结果的轮廓包裹会相互覆盖。

总之，目前存在一个如何计算节点坐标从而更好可视化的问题。解决方案有一个大致的方向，就是根据数据源本身的特征以及执行计算任务的结果进行坐标计算，例如社群计算结果可视化时，同一社群的节点的坐标应在同一区域。

---

#### 需求上的问题

- 平台可以完成哪些计算任务（例如计算编辑距离/路径，搜索相似子图模式）

- 平台是否要支持多个计算任务并行执行

- 我看了目前的图数据集，主要是Linux和AIDS

  对于Linux数据集，它的图较简单，是无向的、节点只有id和label（并且两者还相等）、边只有（id、source、target属性）。这种数据集就相当于图中的每个节点都是不同的，边只有连接信息没有属性，在编辑距离计算时，没有边的替换操作。

  这种类型的图可以执行编辑距离的计算，但是没有搜索相似模式子图的价值，因为图的节点各自不相同，且边也没有属性信息。

  ![image-20230905104611715](http://image.antares.cool/PicGo/Project/Graph/image-20230905104611715.png)

  ```xml
  <?xml version='1.0' encoding='utf-8'?>
  <gexf version="1.1" xmlns="http://www.gexf.net/1.1draft" xmlns:viz="http://www.gexf.net/1.1draft/viz" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.w3.org/2001/XMLSchema-instance">
    <graph defaultedgetype="undirected" mode="static">
      <nodes>
        <node id="0" label="0" />
        <node id="1" label="1" />
        <node id="2" label="2" />
        <node id="3" label="3" />
      </nodes>
      <edges>
        <edge id="0" source="0" target="1" />
        <edge id="1" source="0" target="3" />
        <edge id="2" source="1" target="2" />
      </edges>
    </graph>
  </gexf>
  ```

  对于AIDS数据集，它主要是一些化合物，是无向的，节点除了id、label属性（两者相等）还有其他的属性，边也是同理。这样的图实际上使用id和label来唯一定位节点，用节点上的属性来区分节点的类型，边除了连接信息也多了其他属性，这意味着边是可区分的，在计算编辑距离时需要考虑边的替换。

  这种类型的图可以计算编辑距离，也可以搜索相似模式的子图。

  ![image-20230905105641081](http://image.antares.cool/PicGo/Project/Graph/image-20230905105641081.png)

  ```xml
  <?xml version='1.0' encoding='utf-8'?>
  <gexf version="1.1" xmlns="http://www.gexf.net/1.1draft" xmlns:viz="http://www.gexf.net/1.1draft/viz" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.w3.org/2001/XMLSchema-instance">
    <graph defaultedgetype="undirected" mode="static">
      <attributes class="edge" mode="static">
        <attribute id="1" title="valence" type="long" />
      </attributes>
      <attributes class="node" mode="static">
        <attribute id="0" title="type" type="string" />
      </attributes>
      <nodes>
        <node id="3" label="3">
          <attvalues>
            <attvalue for="0" value="S" />
          </attvalues>
        </node>
        <node id="5" label="5">
          <attvalues>
            <attvalue for="0" value="C" />
          </attvalues>
        </node>
        <node id="1" label="1">
          <attvalues>
            <attvalue for="0" value="C" />
          </attvalues>
        </node>
        <node id="0" label="0">
          <attvalues>
            <attvalue for="0" value="S" />
          </attvalues>
        </node>
        <node id="4" label="4">
          <attvalues>
            <attvalue for="0" value="C" />
          </attvalues>
        </node>
        <node id="2" label="2">
          <attvalues>
            <attvalue for="0" value="N" />
          </attvalues>
        </node>
      </nodes>
      <edges>
        <edge id="4" source="3" target="5">
          <attvalues>
            <attvalue for="1" value="1" />
          </attvalues>
        </edge>
        <edge id="2" source="3" target="1">
          <attvalues>
            <attvalue for="1" value="1" />
          </attvalues>
        </edge>
        <edge id="5" source="5" target="4">
          <attvalues>
            <attvalue for="1" value="1" />
          </attvalues>
        </edge>
        <edge id="0" source="1" target="0">
          <attvalues>
            <attvalue for="1" value="2" />
          </attvalues>
        </edge>
        <edge id="1" source="1" target="2">
          <attvalues>
            <attvalue for="1" value="1" />
          </attvalues>
        </edge>
        <edge id="3" source="4" target="2">
          <attvalues>
            <attvalue for="1" value="1" />
          </attvalues>
        </edge>
      </edges>
    </graph>
  </gexf>
  ```

  对于老师之前举的人际关系的例子，例如A指导B，B是C的朋友...，这实际上是一种更复杂的图，除了边和节点拥有自己的属性，还可能是有向、多重边的图，这不仅是学长算法研究方面的挑战，对于前端可能也要进行一定的重构。

----

### 附录

#### <span id="jump1">为什么node需要id和label两个属性</span>

- 这是AntV G6和XFlow的要求。

- 这是为了**避免编辑路径的歧义**。以李蔺鹏学长毕设中的一个例子举例：

  ![image-20230804150513970](http://image.antares.cool/PicGo/Project/Graph/fde5170b5a878edc96fd0b171352643041b3ecc5.png)

  将G变换为D的编辑路径的前两步如下：

  ![image-20230804150616273](http://image.antares.cool/PicGo/Project/Graph/bc81bcb9785c4f5ed11b0ab8213ef1243b9eb9ca.png)

  ![image-20230804150633235](https://article.biliimg.com/bfs/article/609f32a38fb8e0a27df586492dd26229e3ed36cf.png)

  可以看到，前两步就是将**0=>1，然后1=>0**，如果节点之间不用id区分，而只用label去区分的话，第二步就存在问题：1=>0指的是哪个1变成0？因为此时图中是有两个1节点的，这就造成了歧义

- 进一步考虑编辑路径歧义，除了为节点添加id属性，还必须保证这个id的唯一性，这里的唯一指的是：对于**所有图的所有节点，不存在两个id一样的节点**。为什么要保证这一点？考虑G=>D的编辑路径中，向G中插入节点的操作，插入的节点同时复制了D中对应节点的id和label，如果id不唯一，则可能插入节点的id和图中已有节点的id重复，那么后续为这个节点建立边时依然会存在歧义

- 考虑到项目后续的拓展性。后续可能要支持有相同类型节点的图，甚至边也要分类型，就和邱子豪学长毕设中研究的对象一样（存在类型一样的节点，边也是分红色和黄色两种类型的）

  ![image-20230804152753386](http://image.antares.cool/PicGo/Project/Graph/f64e3536b7c929f6938f2e2c9bd3fb225cec832b.png)



#### <span id="jump2">图的示例数据</span>

下面是一个图的示例数据：

![image-20230804154406797](http://image.antares.cool/PicGo/Project/Graph/398644260771848826584a1897c82af3c8762267.png)

```json
{
  "nodes": [
    {
      "id": "node-bd7b7211-1788-4865-9f57-52f78fb63720",
      "label": "A"
    },
    {
      "id": "node-bac25780-9472-4b57-96ef-81cf69358384",
      "label": "B"
    },
    {
      "id": "node-5f241fa5-4035-4e75-8702-9ab7a18d424f",
      "label": "C"
    },
    {
      "id": "node-147cf91f-7c38-4815-b4f4-a208a622838e",
      "label": "D"
    },
    {
      "id": "node-ebc1515e-6056-41e3-aa91-c7a8ceb6e151",
      "label": "E"
    }
  ],
  "edges": [
    {
      "source": "node-bac25780-9472-4b57-96ef-81cf69358384",
      "target": "node-bd7b7211-1788-4865-9f57-52f78fb63720"
    },
    {
      "source": "node-5f241fa5-4035-4e75-8702-9ab7a18d424f",
      "target": "node-bac25780-9472-4b57-96ef-81cf69358384"
    },
    {
      "source": "node-147cf91f-7c38-4815-b4f4-a208a622838e",
      "target": "node-5f241fa5-4035-4e75-8702-9ab7a18d424f"
    },
    {
      "source": "node-147cf91f-7c38-4815-b4f4-a208a622838e",
      "target": "node-bd7b7211-1788-4865-9f57-52f78fb63720"
    },
    {
      "source": "node-5f241fa5-4035-4e75-8702-9ab7a18d424f",
      "target": "node-bd7b7211-1788-4865-9f57-52f78fb63720"
    },
    {
      "source": "node-147cf91f-7c38-4815-b4f4-a208a622838e",
      "target": "node-bac25780-9472-4b57-96ef-81cf69358384"
    },
    {
      "source": "node-147cf91f-7c38-4815-b4f4-a208a622838e",
      "target": "node-ebc1515e-6056-41e3-aa91-c7a8ceb6e151"
    }
  ]
}
```

---

#### <span id="jump3">编辑路径的示例数据</span>

下面是一个编辑路径的示例数据：

```typescript
editPath = {
    nodes: [
        ['node-bd7b7211-1788-4865-9f57-52f78fb63720', 'node-6fca3d49-45c2-4bc5-a507-df0f221eda6f'],
        ['node-bac25780-9472-4b57-96ef-81cf69358384', 'node-83654b04-ad11-4548-9d29-7f47609cd39e'],
        ['node-5f241fa5-4035-4e75-8702-9ab7a18d424f', 'node-c8a460c4-3500-44e8-bde3-e6508506dee7'],
        ['node-147cf91f-7c38-4815-b4f4-a208a622838e', 'node-fc7db4e9-a173-43b9-889a-0939cf6d90d9'],
        ['node-ebc1515e-6056-41e3-aa91-c7a8ceb6e151', null]
    ],
    edges: [
        [['node-bd7b7211-1788-4865-9f57-52f78fb63720', 'node-bac25780-9472-4b57-96ef-81cf69358384'], ['node-83654b04-ad11-4548-9d29-7f47609cd39e', 'node-6fca3d49-45c2-4bc5-a507-df0f221eda6f']],
        [['node-bd7b7211-1788-4865-9f57-52f78fb63720', 'node-5f241fa5-4035-4e75-8702-9ab7a18d424f'], null],
        [['node-bac25780-9472-4b57-96ef-81cf69358384', 'node-5f241fa5-4035-4e75-8702-9ab7a18d424f'], ['node-83654b04-ad11-4548-9d29-7f47609cd39e', 'node-c8a460c4-3500-44e8-bde3-e6508506dee7']],
        [['node-bd7b7211-1788-4865-9f57-52f78fb63720', 'node-147cf91f-7c38-4815-b4f4-a208a622838e'], null],
        [['node-bac25780-9472-4b57-96ef-81cf69358384', 'node-147cf91f-7c38-4815-b4f4-a208a622838e'], ['node-83654b04-ad11-4548-9d29-7f47609cd39e', 'node-fc7db4e9-a173-43b9-889a-0939cf6d90d9']],
        [['node-5f241fa5-4035-4e75-8702-9ab7a18d424f', 'node-147cf91f-7c38-4815-b4f4-a208a622838e'], ['node-c8a460c4-3500-44e8-bde3-e6508506dee7', 'node-fc7db4e9-a173-43b9-889a-0939cf6d90d9']],
        [['node-147cf91f-7c38-4815-b4f4-a208a622838e', 'node-ebc1515e-6056-41e3-aa91-c7a8ceb6e151'], null]
	]
}
```

