import G6 from '@antv/g6';
import { Card } from 'antd';
import React, { useEffect } from 'react';

const Demo02: React.FC = () => {
  const data = require('./example2.json');
  data.nodes = data.nodes.map((node: any) => {
    return { id: node.id, label: node.id };
  });

  useEffect(() => {
    const grid = new G6.Grid();

    const graph = new G6.Graph({
      container: 'mountNode', // String | HTMLElement，必须，在 Step 1 中创建的容器 id 或容器本身
      width: 800, // Number，必须，图的宽度
      height: 500, // Number，必须，图的高度

      // 节点在默认状态下的样式配置（style）和其他配置
      defaultNode: {
        size: 30, // 节点大小
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

      // 边在默认状态下的样式配置（style）和其他配置
      defaultEdge: {
        // 边样式配置
        style: {
          opacity: 0.6, // 边透明度
          stroke: 'grey', // 边描边颜色
        },
        // 边上的标签文本配置
        labelCfg: {
          autoRotate: true, // 边上的标签文本根据边的方向旋转
        },
      },

      // 节点不同状态下的样式集合
      nodeStateStyles: {
        // 鼠标 hover 上节点，即 hover 状态为 true 时的样式
        hover: {
          fill: 'lightsteelblue',
        },
        // 鼠标点击节点，即 click 状态为 true 时的样式
        click: {
          stroke: '#000',
          lineWidth: 3,
        },
      },
      // 边不同状态下的样式集合
      edgeStateStyles: {
        // 鼠标点击边，即 click 状态为 true 时的样式
        click: {
          stroke: 'steelblue',
        },
      },

      //配置布局
      layout: {
        type: 'force', // 指定为力导向布局
        preventOverlap: true, // 防止节点重叠
        linkDistance: 100, // 指定边距离为100
      },

      //图的交互
      modes: {
        default: ['drag-canvas', 'zoom-canvas', 'drag-node'], // 允许拖拽画布、放缩画布、拖拽节点
      },

      //插件
      plugins: [grid],
    });

    graph.data(data); // 读取 Step 2 中的数据源到图上
    graph.render(); // 渲染图

    //一些监听事件
    // 鼠标进入节点
    graph.on('node:mouseenter', (e) => {
      const nodeItem = e.item; // 获取鼠标进入的节点元素对象
      graph.setItemState(nodeItem, 'hover', true); // 设置当前节点的 hover 状态为 true
    });

    // 鼠标离开节点
    graph.on('node:mouseleave', (e) => {
      const nodeItem = e.item; // 获取鼠标离开的节点元素对象
      graph.setItemState(nodeItem, 'hover', false); // 设置当前节点的 hover 状态为 false
    });

    // 点击节点
    graph.on('node:click', (e) => {
      // 先将所有当前是 click 状态的节点置为非 click 状态
      const clickNodes = graph.findAllByState('node', 'click');
      clickNodes.forEach((cn) => {
        graph.setItemState(cn, 'click', false);
      });
      const nodeItem = e.item; // 获取被点击的节点元素对象
      graph.setItemState(nodeItem, 'click', true); // 设置当前节点的 click 状态为 true
    });

    // 点击边
    graph.on('edge:click', (e) => {
      // 先将所有当前是 click 状态的边置为非 click 状态
      const clickEdges = graph.findAllByState('edge', 'click');
      clickEdges.forEach((ce) => {
        graph.setItemState(ce, 'click', false);
      });
      const edgeItem = e.item; // 获取被点击的边元素对象
      graph.setItemState(edgeItem, 'click', true); // 设置当前边的 click 状态为 true
    });
  }, []);

  return (
    <Card>
      <div id="mountNode"></div>
    </Card>
  );
};

export default Demo02;
