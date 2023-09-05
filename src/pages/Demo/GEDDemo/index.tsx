import React, {useEffect, useState} from "react";
import {Card, Carousel, Col, Row} from "antd";
import {renderGraph} from "@/utils/graphRender";

const GEDDemo: React.FC = ()=>{
  const [editPath, setEditPath] = useState<any>()
  const [cost, setCost] = useState<number>(-1)
  let GAData = require('./GA.json')
  let GBData = require('./GB.json')

  useEffect(()=>{
    //假设这里拿到了编辑路径和编辑距离
    const returnEditPath = {
      nodes: [
        [1, 4], [2, 1], [3, 2], [4, 3], [5, null]
      ],
      edges: [
        [[1, 2], [1, 4]],
        [[1, 3], null],
        [[2, 3], [1, 2]],
        [[1, 4], null],
        [[2, 4], [1, 3]],
        [[3, 4], [2, 3]],
        [[4, 5], null]
      ]
    }
    const returnCost = 5
    setCost(returnCost)
    setEditPath(returnEditPath)

    renderGraph('GA', 400, 300, GAData, 'radial', true)
    renderGraph('GB', 400, 300, GBData, 'radial', true)
  }, [])

  useEffect(()=>{
    //构建GA GB节点map，方便后续操作
    const GAMap = new Map<string, string>()
    GAData.nodes.forEach((node) => {
      GAMap.set(node.id, node.label);
    });

    const GBMap = new Map<string, string>()
    GBData.nodes.forEach((node) => {
      GBMap.set(node.id, node.label);
    });

    if(cost !== -1){
      let curData = GAData;
      let index = 0;
      editPath.nodes.forEach(edit => {
        console.log(edit)
        //这次操作是添加节点
        if(!edit[0]){
          const addId = `B-${edit[1]}`
          const addLabel = GBMap.get(edit[1].toString())
          curData = {
            nodes: [...curData.nodes, {id: addId, label: addLabel}],
            edges: curData.edges
          }
          GAMap.set(addId, addLabel)
          renderGraph(`edit${index}`, 300, 214, curData, null, true)
          index++;
        }
        //这次操作是删除节点
        else if(!edit[1]){
          curData = {
            nodes: curData.nodes.map(node => {
              if(node.id !== edit[0].toString()){
                return node
              }
              return {...node, visible: false}
            }),
            edges: curData.edges
          }

          console.log(curData)

          renderGraph(`edit${index}`, 300, 214, curData, null, true)
          index++;
        }
        //这次操作是替换节点
        else {
          const labelA = GAMap.get(edit[0].toString())
          const labelB = GBMap.get(edit[1].toString())

          // console.log(GAMap)
          console.log(labelA, labelB)

          curData = {
            nodes: curData.nodes.map(node => {
              if(node.id !== edit[0].toString()){
                console.log('missed')
                return node
              }
              return {
                ...node,
                label: labelB,
                newId: `B-${edit[1]}`
              }
            }),
            edges: curData.edges
          }

          //label不相等才算做一次edit
          if(labelA !== labelB){
            console.log(curData)
            renderGraph(`edit${index}`, 300, 214, curData, null, true)
            index++;
          }
        }
      })

      editPath.edges.forEach(edit => {
        //添加边
        if(!edit[0]){
          curData = {
            nodes: curData.nodes,
            edges: [...curData.edges, {
              source: edit[1][0],
              target: edit[1][1]
            }]
          }
          console.log(curData)
          renderGraph(`edit${index}`, 300, 214, curData, null, true)
          index++;
        }
        //删除边
        else if(!edit[1]){
          curData = {
            nodes: curData.nodes,
            edges: curData.edges.filter(edge => {
              return !(edge.source === edit[0][0].toString() && edge.target === edit[0][1].toString())
            })
          }
          console.log(curData, index, `edit${index}`)
          renderGraph(`edit${index}`, 300, 214, curData, null, true)
          index++;
        }
      })
    }
  }, [editPath])

  return (
    <Card>
      <Row>
        <Col span={12}>
          <div style={{height: 300}} id='GA'></div>
        </Col>
        <Col span={12}>
          <div style={{height: 300}} id='GB'></div>
        </Col>
      </Row>


      <h3>编辑距离：{cost}</h3>

      <Carousel>
        {Array.from({ length: cost }).map((_, index)=>{
          return <div key={index}>
            <div
              style={{width: '100%', height: 214, background: "rgb(200, 200, 200)"}}
              id={`edit${index}`}
            >
            </div>
          </div>
        })}
      </Carousel>
    </Card>
  )
}

export default GEDDemo
