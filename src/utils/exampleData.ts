//示例数据的信息
import {message} from "antd";

export const exampleDataSource: DataSource.DataSource[] = [
  {
    id: 'ds_244fd8ec-92d6-424f-ab1e-898f50feffde',
    name: '测试数据集_400',
    url: '/json/400.json',
    createTime: '2023.07.25 15:39',
  },
  {
    id: 'ds_56b63437-43ae-4752-80f7-3e8261fa4eb3',
    name: '测试数据集_200',
    url: '/json/200.json',
    createTime: '2023.07.25 15:39',
  },
  {
    id: 'ds_0753704f-b009-4e90-8bd3-e9eb03d71038',
    name: '测试数据集_100',
    url: '/json/100.json',
    createTime: '2023.07.25 15:39',
  },
  {
    id: 'ds_5cc13ebb-ebb4-4113-8ead-51a4a4db3300',
    name: '测试数据集_50',
    url: '/json/50.json',
    createTime: '2023.07.25 15:39',
  },
  {
    id: 'ds_e8d0efbf-d839-4480-8540-aea2e0326066',
    name: '测试数据集_25',
    url: '/json/25.json',
    createTime: '2023.07.25 15:39',
  },
  {
    id: 'ds_e8d0efbf-d820-4480-8540-aea2e0326066',
    name: '随机生成的大分子',
    url: '/json/mock.json',
    createTime: '2023.07.28 15:39',
  },
  {
    id: 'ds_e8d0efbf-d820-4480-8540-aea2e0326088',
    name: '某分子',
    url: '/json/numerator.json',
    createTime: '2023.07.28 17:39',
  },
  {
    id: 'ds_e8d0efbf-d820-4480-8532-aea2e0326288',
    name: '社群数据集',
    url: '/json/cluster.json',
    createTime: '2023.07.28 17:39',
  }
]

export const getDataSourceById = (dataSourceId: string) => {
  for (let i = 0; i < exampleDataSource.length; i++) {
    if(dataSourceId === exampleDataSource[i].id){
      return exampleDataSource[i];
    }
  }
  return null;
}

//获取数据源对应的数据
export const getDataSourceData = async (url: string) => {
  return await fetch(url)
    .then((res) => res.json())
    .then((data) => {
      return data
    })
}

//下载示例数据
export const downloadCaseData = (dataSourceId: string)=>{
  const res = getDataSourceById(dataSourceId)
  if(!res){
    message.error('请求的数据源不存在')
    return;
  }
  // 发起请求获取example.json文件内容
  fetch(res.url).then((response) => {
    response.blob().then((data) => {
      // 创建Blob对象并触发下载
      const blob = new Blob([data], {type: 'application/json'});
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${res.id}.json`; // 设置下载的文件名为example.json
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    });
  })
}

//todo: 虚拟的计算任务信息，后续改成请求后端
export const exampleComputeLog: Compute.Log[] = [
  {
    name: '任务1',
    id: 't_dae5670b-52ef-441a-9ac5-465ccf222eb0',
    type: '编辑距离',
    entities: [
      {
        id: "2a0a7167-b956-4fea-9707-7cded7fde68c",
        name: "GA",
        type: 'graph'
      },
      {
        id: "1811ce15-2a97-4561-8c51-a6c69cf7de8a",
        name: "GB",
        type: 'graph'
      }
    ],
    startTime: '2023-07-30 21:33',
    status: '已完成',
    timeUse: 345,
  },
  {
    name: '毕业设计中的例子',
    id: 't_dae5670b-52ef-441a-9ac5-465ccf222tb0',
    type: '编辑距离',
    entities: [
      {
        id: "c7a08bc4-74d8-491e-82fa-1986a06705e3",
        name: "TA",
        type: 'graph'
      },
      {
        id: "6d50d931-2b24-4062-ae09-6be5d3535721",
        name: "TB",
        type: 'graph'
      }
    ],
    startTime: '2023-07-30 21:33',
    status: '已完成',
    timeUse: 14488,
  },
  {
    name: '任务2',
    id: 't_79472e97-e8ec-401e-9696-c53cc7f3d1f6',
    type: '模式匹配',
    entities: [
      {
        id: "ds_e8d0efbf-d820-4480-8540-aea2e0326088",
        name: "某分子",
        type: 'datasource'
      },
      {
        id: "a449b31f-1de4-4294-9037-c100e19d6565",
        name: "羧基",
        type: 'graph'
      }
    ],
    startTime: '2023-07-30 21:54',
    status: '已完成',
    timeUse: 897,
  },
  {
    name: '任务3',
    id: 't_79472e97-e8ec-401e-9695-c53cc7f3d1f7',
    type: 'PageRank',
    entities: [
      {
        id: "ds_0753704f-b009-4e90-8bd3-e9eb03d71038",
        name: "测试数据集_100",
        type: 'datasource'
      }
    ],
    startTime: '2023-07-30 22:24',
    status: '已完成',
    timeUse: 256,
  },
  {
    name: '任务4',
    id: 't_79472e97-e4ec-401e-9696-c53cc7f3d1f7',
    type: '社区发现',
    entities: [
      {
        id: "ds_e8d0efbf-d820-4480-8532-aea2e0326288",
        name: "社群数据集",
        type: 'datasource'
      }
    ],
    startTime: '2023-07-30 22:24',
    status: '已完成',
    timeUse: 431,
  },
  {
    name: '任务5',
    id: 't_79472e97-e8ec-401e-9696-c53cc7f3d1f7',
    type: '子图搜索',
    entities: [
      {
        id: "8a528506-f063-46eb-a1a9-ed1022fdb3ce",
        name: "测试数据集_400",
        type: 'datasource'
      },
      {
        id: "6d4538c1-de5c-4533-a912-f2d7d30d8fe9",
        name: "甲基苯",
        type: 'graph'
      }
    ],
    startTime: '2023-07-30 22:24',
    status: '计算中',
    timeUse: -1,
  }
]

//todo: 根据计算任务的id获取计算任务的信息，后续改成请求后端
export const getComputeLogById = (logId: string) => {
  for (let i = 0; i < exampleComputeLog.length; i++) {
    if(logId === exampleComputeLog[i].id){
      return exampleComputeLog[i];
    }
  }
  return null;
}

//todo: 根据实体id和实体类型获取实体信息，后续这里请求后端
export const getEntityData = (entity: any) => {
  if(entity.type === 'datasource'){
    return getDataSourceById(entity.id)
  } else if(entity.type === 'graph'){
    // 从localStorage中获取对象数组
    const storedGraphs = localStorage.getItem("graphs");

    if (storedGraphs) {
      let graphsArray = JSON.parse(storedGraphs);
      // 查找对应id的对象在数组中的索引
      const index = graphsArray.findIndex((item: Graph.Graph) => item.id === entity.id);
      return graphsArray[index]
    }
  }
  return null
}

//todo: 根据计算任务的id拿到计算结果，后续这里请求后端
export const getGEDComputeResult = (id: string) => {
  let cost: number, editPath: Compute.EditPath;

  switch (id){
    case 't_dae5670b-52ef-441a-9ac5-465ccf222eb0':
      cost = 5
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
      return {cost, editPath}
    case 't_dae5670b-52ef-441a-9ac5-465ccf222tb0':
      cost = 11
      editPath = {
        nodes: [
          ['node-c61724cb-b5d9-4f3b-aa17-8d73cb8f74da', 'node-67748761-bc56-431a-8b04-d96209a3dc4e'],
          ['node-0ee93926-70d3-4721-ac09-310b64d6f850', 'node-85a0d1be-ea66-454f-a8cf-89dbcb24aee4'],
          ['node-a9c93f15-38dc-4430-b84b-faced50a0921', 'node-3c75b982-7582-469d-bf01-f0f7650fd972'],
          ['node-f9537504-d4b8-43e6-9925-472de801bbae', 'node-35a6f58b-d166-4a45-922f-5b6bd4229063'],
          ['node-35a6502e-7616-475b-999f-12f242704676', null],
          ['node-ed1a2f91-43bd-40ca-b91e-ae85a0948919', 'node-bbcd756d-0947-41a1-a27c-6f6e0bbb42db'],
          ['node-0523e5e7-13df-4ee1-b9a9-f246406ff8b9', 'node-16d0cae0-cd3d-46d8-8ee1-131ab08cddab'],
          ['node-4c2d33e6-8325-4bfc-9c5b-283bca9d6180', 'node-b49f83e0-fbcb-43ee-8a2c-e47d81052c34'],
          ['node-362d1799-f5bd-4cbb-a520-f3e592dfee1d', 'node-eb093097-7cc2-4e59-824e-64d1c5e89ad5']
        ],
        edges: [
          [['node-c61724cb-b5d9-4f3b-aa17-8d73cb8f74da', 'node-0ee93926-70d3-4721-ac09-310b64d6f850'], ['node-85a0d1be-ea66-454f-a8cf-89dbcb24aee4', 'node-67748761-bc56-431a-8b04-d96209a3dc4e']],
          [['node-c61724cb-b5d9-4f3b-aa17-8d73cb8f74da', 'node-a9c93f15-38dc-4430-b84b-faced50a0921'], ['node-67748761-bc56-431a-8b04-d96209a3dc4e', 'node-3c75b982-7582-469d-bf01-f0f7650fd972']],
          [['node-c61724cb-b5d9-4f3b-aa17-8d73cb8f74da', 'node-f9537504-d4b8-43e6-9925-472de801bbae'], ['node-67748761-bc56-431a-8b04-d96209a3dc4e', 'node-35a6f58b-d166-4a45-922f-5b6bd4229063']],
          [['node-0ee93926-70d3-4721-ac09-310b64d6f850', 'node-35a6502e-7616-475b-999f-12f242704676'], null],
          [['node-f9537504-d4b8-43e6-9925-472de801bbae', 'node-ed1a2f91-43bd-40ca-b91e-ae85a0948919'], ['node-35a6f58b-d166-4a45-922f-5b6bd4229063', 'node-bbcd756d-0947-41a1-a27c-6f6e0bbb42db']],
          [['node-a9c93f15-38dc-4430-b84b-faced50a0921', 'node-0523e5e7-13df-4ee1-b9a9-f246406ff8b9'], null],
          [null, ['node-67748761-bc56-431a-8b04-d96209a3dc4e', 'node-16d0cae0-cd3d-46d8-8ee1-131ab08cddab']],
          [['node-a9c93f15-38dc-4430-b84b-faced50a0921', 'node-4c2d33e6-8325-4bfc-9c5b-283bca9d6180'], null],
          [['node-0523e5e7-13df-4ee1-b9a9-f246406ff8b9', 'node-4c2d33e6-8325-4bfc-9c5b-283bca9d6180'], ['node-16d0cae0-cd3d-46d8-8ee1-131ab08cddab', 'node-b49f83e0-fbcb-43ee-8a2c-e47d81052c34']],
          [['node-f9537504-d4b8-43e6-9925-472de801bbae', 'node-362d1799-f5bd-4cbb-a520-f3e592dfee1d'], null],
          [['node-362d1799-f5bd-4cbb-a520-f3e592dfee1d', 'node-ed1a2f91-43bd-40ca-b91e-ae85a0948919'], ['node-bbcd756d-0947-41a1-a27c-6f6e0bbb42db', 'node-eb093097-7cc2-4e59-824e-64d1c5e89ad5']],
          [null, ['node-b49f83e0-fbcb-43ee-8a2c-e47d81052c34', 'node-eb093097-7cc2-4e59-824e-64d1c5e89ad5']]
        ]
      }
      return {cost, editPath}
  }
}
