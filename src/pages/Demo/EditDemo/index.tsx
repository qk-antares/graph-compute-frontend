import {useMenuConfig} from '@/pages/Demo/EditDemo/config/menu-config';
import {
  CanvasContextMenu,
  CanvasNodePortTooltip,
  CanvasScaleToolbar,
  CanvasToolbar,
  FlowchartCanvas,
  FlowchartExtension,
  FlowchartFormPanel,
  FlowchartNodePanel,
  KeyBindings,
  uuidv4,
  XFlow,
} from '@antv/xflow';
import '@antv/xflow/dist/index.css';
import React, {useState} from 'react';
import './index.less';
import {useToolbarConfig} from './config/toolbar-config';
import {useCmdConfig} from "@/pages/Demo/EditDemo/config/cmd-config";
import {DndNode} from "@/pages/Demo/EditDemo/Node/DndNode";
import {useKeybindingConfig} from "@/pages/Demo/EditDemo/config/keybinding-config";
import {Divider, Form, Input, message, Modal} from "antd";
import {history} from "@umijs/max";

const XFlowDemo: React.FC = () => {
  const toolbarConfig = useToolbarConfig();
  const menuConfig = useMenuConfig();
  const commandConfig = useCmdConfig();
  const keybindingConfig = useKeybindingConfig();
  const [visible, setVisible] = useState(false);
  const [graphData, setGraphData] = useState<any>()
  const [form] = Form.useForm();

  const handleOk = () => {
    //创建一张新的图
    let newGraph: Graph.Graph = {
      id: uuidv4(),
      name: form.getFieldValue('name'),
      createTime: new Date(),
      graphData
    }
    //保存到localStorage
    let graphs = JSON.parse(localStorage.getItem('graphs') || '[]');
    console.log(graphs)
    graphs.unshift(newGraph)
    localStorage.setItem('graphs', JSON.stringify(graphs));

    message.success('创建成功')
    history.push('/graph/list')

    setVisible(false);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  return (
    <div className="container">
      {/*@ts-ignore*/}
      <XFlow meta={{
        flowId: 'edit',
        setVisible,
        setGraphData
      }} commandConfig={commandConfig} className="xflow-workspace">
        <FlowchartExtension/>

        {/*节点面板*/}
        <FlowchartNodePanel
          showOfficial={false}
          showHeader={false}
          defaultActiveKey={['node']}
          registerNode={{
            title: '基本节点',
            key: 'node',
            nodes: [
              {
                component: DndNode,
                popover: () => <div>基本节点</div>,
                name: 'custom-node-indicator',
                width: 36,
                height: 36,
                label: '',
              },
            ],
          }}
          position={{ width: 162, top: 40, bottom: 0, left: 0 }}
        />

        {/*顶部工具栏，只有一个保存按钮*/}
        <CanvasToolbar
          className="xflow-workspace-toolbar-top"
          layout="horizontal"
          config={toolbarConfig}
          position={{ top: 0, left: 0, right: 0, bottom: 0 }}
        />

        {/*@ts-ignore*/}
        <FlowchartCanvas
          config={{connecting: {multi: false, router: 'normal'}}}
          position={{ top: 40, left: 0, right: 0, bottom: 0 }}
        >
          {/*顶部的缩放工具栏*/}
          <CanvasScaleToolbar
            layout="horizontal"
            position={{ top: -40, right: 0 }}
            style={{
              width: 150,
              left: 'auto',
              height: 39,
            }}
          />

          {/*对元素鼠标右键的面板*/}
          <CanvasContextMenu config={menuConfig} />

          <CanvasNodePortTooltip />
        </FlowchartCanvas>

        {/*右边的配置面板*/}
        <FlowchartFormPanel show={true} position={{ width: 200, top: 40, bottom: 0, right: 0 }} />

        {/*绑定快捷键*/}
        <KeyBindings config={keybindingConfig} />
      </XFlow>

      <Modal title="设置图的名称" open={visible} onOk={handleOk} onCancel={handleCancel}>
        <Divider style={{margin: '12px 0'}}/>
        <Form form={form}>
          <Form.Item label="名称" name="name" rules={[{ required: true, message: '请输入图的名称' }]}>
            <Input/>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default XFlowDemo;
