import React, {useEffect} from "react";
import {Col, Row} from "antd";
import {pageRank} from "@antv/algorithm";
import {renderGraph} from "@/utils/graphRender";

const PageRankDemo: React.FC = ()=>{
  const data = require('./100.json')

  useEffect(()=>{
    const width = document.getElementById('before')?.offsetWidth

    renderGraph('before', width, width, data, 'force')

    console.log(data)
    const rank = pageRank(data)

    const newData = {
      nodes: data.nodes.map((node: any, index: number) => {
        return {...node, size: 20+1000*rank[index]}
      }),
      edges: data.edges
    }

    renderGraph('after', width, width, newData, 'force')
  }, [])

  return <Row>
    <Col span={12}>
      <div id='before'>

      </div>
    </Col>
    <Col span={12}>
      <div id='after'>

      </div>

    </Col>
  </Row>
}

export default PageRankDemo
