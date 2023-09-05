import G6 from '@antv/g6';
import React, {useEffect, useState} from "react";
import {louvain} from "@antv/algorithm";
import {ComputeLogProps} from "@/pages/Compute/ComputeList/ComputeLog";
import {getDataSourceData, getEntityData} from "@/utils/exampleData";
import {Card} from "antd";
import {generateDistinctColors} from "@/utils/graphRender";

const Cluster: React.FC<ComputeLogProps> = ({computeLog})=>{
  const {name, type, timeUse, entities} = computeLog
  //首先去查询参与计算的实体的信息(entity1是计算聚类的数据源)
  const [entity1, setEntity1] = useState<DataSource.DataSource>()

  useEffect(()=>{
    let dataSource = getEntityData(entities[0])
    console.log(dataSource)
    getDataSourceData(dataSource.url).then(res => {
      dataSource.graphData = res
      setEntity1(dataSource)
    })
  }, [])

  useEffect(()=>{
    if(entity1 && entity1.graphData){
      const container = document.getElementById('container');
      const width = container.scrollWidth;
      const height = (container.scrollHeight || 500) - 20;

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

      const graph = new G6.Graph({
        container: 'container',
        width,
        height,
        linkCenter: true,
        modes: {
          default: ['drag-canvas', 'drag-node', 'zoom-canvas'],
        },
        layout: {
          type: 'gForce',
          minMovement: 0.1,
        },
        //插件
        plugins: [tooltip],
      });
      graph.data(entity1.graphData);
      graph.render();

      const clusteredData = louvain(entity1.graphData, false);
      console.log(clusteredData)

      //生成等数量的颜色
      const colors = generateDistinctColors(clusteredData.clusters.length)
      const colorSets = G6.Util.getColorSetsBySubjectColors(colors, '#fff', 'default', '#777');

      clusteredData.clusters.forEach((cluster, i) => {
        const colorSet = colorSets[i % colorSets.length];
        cluster.nodes.forEach((node) => {
          const model = graph.findById(node.id).getModel();
          model.style.fill = colorSet.mainFill
          model.style.stroke = colorSet.mainStroke
        });
      });

      graph.refresh();
    }
  }, [entity1])


  return <>
    <Card
      bodyStyle={{padding: 20}}
      style={{borderRadius: 0, height: '100%', boxShadow: '0 2px 4px 0 rgba(54,58,80,.32)'}}
    >
      <h3 style={{fontSize: 14, fontWeight: 700, padding: 0, marginBottom: 16}}>结果可视化</h3>

      <div id='container' style={{border: '1px solid grey'}}>

      </div>
    </Card>
  </>
}

export default Cluster
