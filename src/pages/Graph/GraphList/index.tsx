import {DeleteOutlined, DownloadOutlined, EditOutlined, SettingOutlined} from '@ant-design/icons';
import {Card, Divider, Form, Input, List, message, Modal, Popconfirm} from 'antd';
import React, {useEffect, useState} from 'react';
import G6 from "@antv/g6";
import {downloadJson} from "@/utils/downloadUtil";
import moment from "moment";


const GraphList: React.FC = () => {
  const [data, setData] = useState<Graph.Graph[]>(()=>{
    return JSON.parse(localStorage.getItem('graphs') || '[]')
  })
  const [visible, setVisible] = useState(false)
  const [form] = Form.useForm();
  const [activeId, setActivateId] = useState<string | undefined>()

  // 渲染图
  const renderGraph = (id: string, graphData: Graph.GraphData | undefined)=>{
    const canvasWidth = document.getElementById(`${data[0].id}`)?.offsetWidth;
    const graph = new G6.Graph({
      container: id,
      width: canvasWidth,
      height: 214,

      fitCenter: true,

      // 节点在默认状态下的样式配置（style）和其他配置
      defaultNode: {
        size: 25, // 节点大小
        // 节点样式配置
        style: {
          fill: 'steelblue', // 节点填充色
          stroke: '#666', // 节点描边色
          lineWidth: 1, // 节点描边粗细
        },
        // 节点上的标签文本配置
        labelCfg: {
          // 节点上的标签文本样式配置
          style: {
            fill: '#fff', // 节点标签文字颜色
          },
        },
      },

      //配置布局
      layout: {
        type: 'radial',
        preventOverlap: true,
        nodeSize: 25,
        nodeSpacing: 50,
      },
    });

    // @ts-ignore
    graph.data(graphData);
    graph.render();
  }

  // 删除图
  const removeGraph = (id: string)=>{
    const storedGraphs = localStorage.getItem("graphs");
    if (storedGraphs) {
      let graphsArray = JSON.parse(storedGraphs);
      graphsArray = graphsArray.filter((item: Graph.Graph) => item.id !== id);
      // 将更新后的数组重新存回localStorage
      localStorage.setItem("graphs", JSON.stringify(graphsArray));
      console.log('更新后的图:', graphsArray);
      setData(graphsArray);
    }
  }

  //修改图的名称
  const handleOk = () => {
    // 从localStorage中获取对象数组
    const storedGraphs = localStorage.getItem("graphs");

    if (storedGraphs) {
      let graphsArray = JSON.parse(storedGraphs);
      // 查找对应id的对象在数组中的索引
      const indexToUpdate = graphsArray.findIndex((item: Graph.Graph) => item.id === activeId);

      if (indexToUpdate !== -1) {
        graphsArray[indexToUpdate].name = form.getFieldValue('name');
        // 将更新后的对象数组重新存回localStorage
        localStorage.setItem("graphs", JSON.stringify(graphsArray));
        setData(graphsArray)
      }
    }
    setVisible(false);
  };

  //下载图的数据
  const downloadGraph = (id: string) => {
    // 从localStorage中获取对象数组
    const storedGraphs = localStorage.getItem("graphs");

    if (storedGraphs) {
      let graphsArray = JSON.parse(storedGraphs);
      // 查找对应id的对象在数组中的索引
      const index = graphsArray.findIndex((item: Graph.Graph) => item.id === id);

      if (index !== -1) {
        downloadJson(graphsArray[index].graphData)
      }
    }
  }

  useEffect(()=>{
    data.forEach(graph => renderGraph(graph.id, graph.graphData))
  }, [])


  return (<>
    <List
      grid={{ gutter: 16, column: 3 }}
      dataSource={data}
      renderItem={(graph: Graph.Graph) => (
        <List.Item>
          <Card
            hoverable
            bodyStyle={{ padding: 2}}
            actions={[
              <EditOutlined onClick={()=>{message.info('功能待完善')}} key="edit" />,

              <SettingOutlined onClick={()=>{
                setVisible(true)
                setActivateId(graph.id)
              }} key="setting" />,

              <DownloadOutlined onClick={()=>downloadGraph(graph.id)} key='download'/>,

              <Popconfirm
                key='delete'
                title="删除图"
                description="确定要删除该图？此操作不可撤销"
                onConfirm={()=>removeGraph(graph.id)}
                okText="是"
                cancelText="否"
              >
                <DeleteOutlined />
              </Popconfirm>
            ]}
          >
            {/*这个div用于展示图*/}
            <div id={graph.id}></div>
            <div style={{ margin: '12px 12px 0 12px' }}>
              <p>{graph.name}</p>
              <p style={{ color: 'rgba(0, 0, 0, 0.45)' }}>{moment(graph.createTime).format('YYYY-MM-DD HH:mm:ss')}</p>
            </div>
          </Card>
        </List.Item>
      )}
    />

    <Modal title="设置图的名称" open={visible} onOk={handleOk} onCancel={()=>{
      setVisible(false)
      setActivateId(undefined)
    }}>
      <Divider style={{margin: '12px 0'}}/>
      <Form form={form}>
        <Form.Item label="名称" name="name" rules={[{ required: true, message: '请输入图的名称' }]}>
          <Input/>
        </Form.Item>
      </Form>
    </Modal>
  </>);
};

export default GraphList;
