import React, {useEffect} from "react";
import {Card} from "antd";
import G6 from "@antv/g6";
import {insertCss} from "@antv/xflow";

const HighLightDemo: React.FC = ()=>{

  insertCss(`
    .g6-component-tooltip {
      border: 1px solid #e2e2e2;
      border-radius: 4px;
      font-size: 12px;
      color: #000;
      background-color: rgba(255, 255, 255, 0.9);
      padding: 2px 4px;
      box-shadow: rgb(174, 174, 174) 0px 0px 10px;
    }
  `);

  useEffect(()=>{
    const tooltip = new G6.Tooltip({
      offsetX: 10,
      offsetY: 10,
      fixToNode: [1, 0.5],
      // 允许出现 tooltip 的 item 类型
      itemTypes: ['node'],
      // 自定义 tooltip 内容
      getContent: (e) => {
        const outDiv = document.createElement('div');
        outDiv.style.width = 'fit-content';
        outDiv.style.height = 'fit-content';
        const model = e?.item?.getModel();
        if (e?.item?.getType() === 'node') {
          outDiv.innerHTML = `${model?.label}`;
        }
        return outDiv;
      },
    });

    const container = document.getElementById('container');
    const width = container?.scrollWidth;
    const height = container?.scrollHeight || 500;
    const graph = new G6.Graph({
      container: 'container',
      width,
      height,
      layout: {
        type: 'force',
      },
      plugins: [tooltip],
      modes: {
        default: ['drag-canvas', 'activate-relations'],
      },
      defaultNode: {
        size: [10, 10],
        labelCfg: {
          style: {
            opacity: 0, // 将节点label的透明度设置为0，即不可见
          },
        },
      },
      defaultEdge: {
        style: {
          stroke: '#aaa',
          lineAppendWidth: 2,
          opacity: 0.3,
        },
      },
    });

    fetch('/json/200.json')
      .then((res) => res.json())
      .then((data) => {
        graph.data(data);
        graph.render();
      });

  }, [])

  return (
    <Card>
      <div id='container'>
      </div>
    </Card>

  )
}

export default HighLightDemo
