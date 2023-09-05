import React, {useEffect, useState} from "react";
import {Card, Col, Row} from "antd";
import {pageRank} from "@antv/algorithm";
import {renderGraph} from "@/utils/graphRender";
import {ComputeLogProps} from "@/pages/Compute/ComputeList/ComputeLog";
import {getDataSourceData, getEntityData} from "@/utils/exampleData";

const PageRank: React.FC<ComputeLogProps> = ({computeLog})=>{
  const {name, type, timeUse, entities} = computeLog
  //首先去查询参与计算的实体的信息(entity1是计算PageRank的数据源)
  const [entity1, setEntity1] = useState<DataSource.DataSource>()

  useEffect(()=>{
    let dataSource = getEntityData(entities[0])
    getDataSourceData(dataSource.url).then(res => {
      dataSource.graphData = res
      setEntity1(dataSource)
    })
  }, [])

  useEffect(()=>{
    if(entity1 && entity1.graphData){
      const container = document.getElementById('container');
      const width = container?.scrollWidth || 500;
      const height = (container?.scrollHeight || 500) - 20;

      console.log(entity1.graphData)

      const rank = pageRank(entity1.graphData)

      console.log(rank)

      const newData = {
        nodes: entity1.graphData.nodes.map((node: any) => {
          return {...node, size: 20+1000*rank[node.id]}
        }),
        edges: entity1.graphData.edges
      }

      renderGraph('container', width, height, newData, 'force')
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

export default PageRank
