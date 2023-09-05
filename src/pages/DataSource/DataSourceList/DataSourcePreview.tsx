import { AppstoreOutlined, BarsOutlined } from '@ant-design/icons';
import { useEmotionCss } from '@ant-design/use-emotion-css';
import G6 from '@antv/g6';
import {Breadcrumb, Col, Row, Segmented} from 'antd';
import React, { useEffect, useState } from 'react';
import ReactJson from 'react-json-view';
import {useNavigate} from "@@/exports";
import {insertCss} from "@antv/xflow";

type DataSourcePreviewProps = {
  type: 'mine' | 'case';
  dataSource: DataSource.DataSource;
  setDataSource: (newDataSource: DataSource.DataSource | null) => void;
}

const DataSourcePreview: React.FC<DataSourcePreviewProps> = ({type, dataSource, setDataSource}) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string | number>('graph');
  const [jsonData, setJsonData] = useState<any>()

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

  useEffect(() => {
    if (activeTab === 'graph') {
      const tooltip = new G6.Tooltip({
        offsetX: 15,
        offsetY: -15,
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

      const container = document.getElementById('mountNode');

      const grid = new G6.Grid();
      const graph = new G6.Graph({
        container: 'mountNode',
        width: 855,
        height: 420,

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
        //配置布局
        layout: {
          type: 'force', // 指定为力导向布局
        },

        //图的交互
        modes: {
          default: ['drag-canvas', 'zoom-canvas', 'drag-node', 'activate-relations'], // 允许拖拽画布、放缩画布、拖拽节点
        },

        //插件
        plugins: [grid, tooltip],
      });

      //获取json数据，这里直接获取示例数据了
      fetch(dataSource.url)
        .then(res => res.json())
        .then(graphJson => {
          //深拷贝
          setJsonData(JSON.parse(JSON.stringify(graphJson)));
          graph.data(graphJson); // 读取 Step 2 中的数据源到图上
          graph.render(); // 渲染图
        })
    }
  }, [activeTab]);

  const divCss = useEmotionCss(() => {
    return {
      maxHeight: 600,
      width: 879,
      overflow: 'auto',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2), 0 4px 8px rgba(0, 0, 0, 0.1)',
      padding: '12px',
      marginTop: '12px',
    };
  });

  return (
    <div style={{ padding: '0 24px' }}>
      <Row align='middle'>
        <Col flex='180px'>
          <Segmented
            value={activeTab}
            onChange={setActiveTab}
            options={[
              {
                label: '图模型',
                value: 'graph',
                icon: <BarsOutlined />,
              },
              {
                label: '数据',
                value: 'data',
                icon: <AppstoreOutlined />,
              },
            ]}
          />
        </Col>
        <Col flex='auto'>
          <Breadcrumb
            style={{float: 'right'}}
            items={[
              {
                title: <a onClick={()=>{
                  setDataSource(null)
                  //修改路径参数
                  const params = new URLSearchParams(window.location.search);
                  params.delete('dataSourceId');
                  navigate({
                    search: `?${params.toString()}`,
                  });

                }}>{type === 'mine' ? '我的数据' : '案例数据'}</a>,
              },
              {
                title: dataSource.id,
              },
            ]}
          />
        </Col>
      </Row>

      {activeTab === 'graph' ? <div className={divCss} id="mountNode"></div> : null}
      {activeTab === 'data' ? (
        <div className={divCss}>
          <ReactJson
            src={jsonData}
            shouldCollapse={field => {
              // @ts-ignore
              return field.depth > 2
            }}
            groupArraysAfterLength={10}
          />
        </div>
      ) : null}
    </div>
  );
};

export default DataSourcePreview;
