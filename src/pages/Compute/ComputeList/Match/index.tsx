import React, {useEffect, useState} from "react";
import {ComputeLogProps} from "@/pages/Compute/ComputeList/ComputeLog";
import {getDataSourceData, getEntityData} from "@/utils/exampleData";
import {Card} from "antd";
import {generateDistinctColors} from "@/utils/graphRender";
import G6 from "@antv/g6";

const Match: React.FC<ComputeLogProps> = ({computeLog})=>{
  const {name, type, timeUse, entities} = computeLog

  //首先去查询参与计算的实体的信息(entity1是数据源，entity2是一张小图)
  const [entity1, setEntity1] = useState<DataSource.DataSource>()
  const [entity2] = useState<Graph.Graph>(()=>getEntityData(entities[1]))
  const [graph, setGraph] = useState<any>()
  const [matches, setMatches] = useState<Compute.Match[]>([])

  useEffect(()=>{
    let dataSource = getEntityData(entities[0])
    getDataSourceData(dataSource.url).then(res => {
      dataSource.graphData = res
      setEntity1(dataSource)
    })
  }, [])

  //渲染大图 和 被匹配的小图
  const renderDataSourceAndPattern = (graphData: Graph.GraphData, pattern: Graph.GraphData)=>{
    //1.首先渲染大图
    const {nodes} = graphData
    //获取节点类型数量
    const uniqueLabels = new Set(nodes.map(node => node.label));
    const labelCount = uniqueLabels.size;
    //生成等数量的颜色
    const colors = generateDistinctColors(labelCount)
    const colorSets = G6.Util.getColorSetsBySubjectColors(colors, '#fff', 'default', '#777');
    console.log(colorSets)
    //建立节点类型和颜色之间的关系
    const colorMap = new Map<string, any>();
    let colorIndex = 0;
    for (const label of uniqueLabels) {
      colorMap.set(label, colorSets[colorIndex])
      colorIndex++;
    }

    const container = document.getElementById('container');
    const width = container?.scrollWidth || 500;
    const height = (container?.scrollHeight || 500) - 20;
    const graph = new G6.Graph({
      container: 'container',
      width,
      height,
      fitCenter: true,
      layout: {
        type: 'gForce',
        nodeStrength: 100,
        minMovement: 0.1,
      },
      modes: {
        default: ['drag-canvas', 'zoom-canvas'],
      },
    });

    const legendDataMap: any = {}

    //给节点和边一些样式
    graphData.nodes.forEach((node) => {
      const colorSet = colorMap.get(node.label)
      node.style = {
        fill: colorSet.mainFill,
        stroke: colorSet.mainStroke,
      }
      if (!legendDataMap[node.label]) {
        legendDataMap[node.label] = {
          shape: 'circle',
          r: 6,
          text: node.label,
          fill: colorSet.mainFill,
          stroke: colorSet.mainStroke,
        }
      }
    })
    graphData.edges.forEach((edge) => {
      const colorSet = colorSets[0];
      edge.style = {
        stroke: colorSet.mainStroke,
        lineWidth: 2,
        opacity: 0.3,
      }
    })
    graph.data(graphData);
    graph.render();
    setGraph(graph)

    //2. 然后渲染小图
    //同样给小图的节点和边一些样式
    pattern.nodes.forEach(node => {
      const colorSet = colorMap.get(node.label);
      node.style = {
        fill: colorSet.mainFill,
        stroke: colorSet.mainStroke,
      }
    });
    pattern.edges.forEach(edge => {
      const colorSet = colorSets[0];
      edge.style = {
        stroke: colorSet.mainStroke,
      }
    });

    const patternGraphWidth = Math.max(width / 5, 100);
    const patternGraphHeight = Math.max(height / 5, 100);
    //小图显示在同一个container的左上角
    const patternGraph = new G6.Graph({
      container: 'container',
      width: patternGraphWidth,
      height: patternGraphHeight,
      fitCenter: true,
      layout: {
        type: 'radial'
      }
    })
    patternGraph.data(pattern);
    patternGraph.render();

    //调整小图的位置，并添加上背景和描述
    const patternCanvas = patternGraph.get('canvas');
    const patternCanvasEl = patternCanvas.get('el');
    patternCanvasEl.style.position = 'absolute';
    patternCanvasEl.style.top = '59px';
    patternCanvasEl.style.left = '21px';
    patternCanvasEl.style.backgroundColor = '#eee';
    patternCanvasEl.style.opacity = 0.7;
    patternCanvas.addShape('text', {
      attrs: {
        text: '被匹配子图',
        x: patternGraphWidth - 100,
        y: patternGraphHeight - 10,
        fill: '#000',
        fontWeight: 500
      }
    })

    //节点类型说明
    const legendGroup = graph.get('canvas').addGroup({
      attrs: {
        opacity: 0.7
      }
    });
    const legendBack = legendGroup.addShape('rect', {
      attrs: {
        height: 10,
        width: 10,
        x: 5,
        y: -10,
        fill: '#eee'
      }
    })
    legendGroup.addShape('text', {
      attrs: {
        text: '节点类型',
        x: 20,
        y: 5,
        fill: '#000',
        fontWeight: 500
      }
    })

    Object.keys(legendDataMap).forEach((cluster, i) => {
      const lData = legendDataMap[cluster];
      legendGroup.addShape(lData.shape, {
        attrs: {
          x: 20,
          y: 20 + i * 25,
          x1: 13,
          x2: 28,
          y1: 20 + i * 25,
          y2: 20 + i * 25,
          ...lData
        }
      })
      legendGroup.addShape('text', {
        attrs: {
          x: 35,
          y: 20 + i * 25,
          text: lData.text,
          fill: '#000',
          textBaseline: 'middle'
        }
      })
    })
    const legendBBox = legendGroup.getBBox();
    legendBack.attr({
      width: legendBBox.width + 10,
      height: legendBBox.height + 10
    })
    legendGroup.setMatrix([1, 0, 0, 0, 1, 0, -10, patternGraphHeight + 40, 1])
  }

  useEffect(()=>{
    //数据已经就绪
    if(entity1 && entity1.graphData && entity2 && entity2.graphData){
      renderDataSourceAndPattern(entity1.graphData, entity2.graphData)

      //todo: 假设这里拿到了计算的结果
      const result: Compute.Match[] = [
        {
          nodes: [
            {
              id: "node-237bd16a-4508-4dd3-a027-fa7b4518bfba",
              label: "H"
            },
            {
              id: "node-07c03f85-b83d-4b29-8364-fb7cd5235d08",
              label: "C"
            },
            {
              id: "node-38bd823e-faa6-4240-b2a4-e7f7284e1405",
              label: "O"
            },
            {
              id: "node-7a8e2431-8df1-4f1d-a3ee-580e385adc3f",
              label: "O"
            }
          ],
          edges: [
            {
              source: "node-07c03f85-b83d-4b29-8364-fb7cd5235d08",
              target: "node-38bd823e-faa6-4240-b2a4-e7f7284e1405"
            },
            {
              source: "node-07c03f85-b83d-4b29-8364-fb7cd5235d08",
              target: "node-7a8e2431-8df1-4f1d-a3ee-580e385adc3f"
            },
            {
              source: "node-7a8e2431-8df1-4f1d-a3ee-580e385adc3f",
              target: "node-237bd16a-4508-4dd3-a027-fa7b4518bfba"
            }
          ]
        },
        {
          nodes: [
            {
              id: "node-54a76c54-2e66-4f27-8ccc-4bb480f816d6",
              label: "H"
            },
            {
              id: "node-688c862b-ef03-486e-9f64-ca93cc9dec90",
              label: "C"
            },
            {
              id: "node-6c4dd506-65a8-424b-bdef-717ed0608ed0",
              label: "O"
            },
            {
              id: "node-0f40bfe1-f4e8-4818-bdec-d7182ac7eda5",
              label: "O"
            }
          ],
          edges: [
            {
              source: "node-688c862b-ef03-486e-9f64-ca93cc9dec90",
              target: "node-6c4dd506-65a8-424b-bdef-717ed0608ed0"
            },
            {
              source: "node-688c862b-ef03-486e-9f64-ca93cc9dec90",
              target: "node-0f40bfe1-f4e8-4818-bdec-d7182ac7eda5"
            },
            {
              source: "node-0f40bfe1-f4e8-4818-bdec-d7182ac7eda5",
              target: "node-54a76c54-2e66-4f27-8ccc-4bb480f816d6"
            }
          ]
        }
      ]
      setMatches(result)
    }
  }, [entity1, entity2])

  useEffect(()=>{
    if(graph && matches){
      setInterval(()=>{
        matches.forEach((match, i) => {
          graph.createHull({
            id: `match-${i}`,
            members: match.nodes.map(node => node.id),
            style: {
              fill: '#008685'
            }
          })
        });
      }, 2000)
    }
  }, [graph, matches])

  return (<>
    <Card
      bodyStyle={{padding: 20}}
      style={{borderRadius: 0, height: '100%', boxShadow: '0 2px 4px 0 rgba(54,58,80,.32)'}}
    >
      <h3 style={{fontSize: 14, fontWeight: 700, padding: 0, marginBottom: 16}}>结果可视化</h3>

      <div id='container' style={{border: '1px solid grey'}}>

      </div>
    </Card>
  </>)
}

export default Match
