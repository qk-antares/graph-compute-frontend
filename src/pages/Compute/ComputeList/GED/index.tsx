import React, {useEffect, useState} from "react";
import {getEntityData, getGEDComputeResult} from "@/utils/exampleData";
import {Card, Col, Row, Tag} from "antd";
import {renderGraph} from "@/utils/graphRender";
import {
  CaretRightOutlined,
  DatabaseOutlined,
  PauseOutlined,
  ShareAltOutlined,
  StepBackwardOutlined,
  StepForwardOutlined
} from "@ant-design/icons";
import {useEmotionCss} from "@ant-design/use-emotion-css";
import {ComputeLogProps} from "@/pages/Compute/ComputeList/ComputeLog";

const GED: React.FC<ComputeLogProps> = ({computeLog})=>{
  const {id, name, type, timeUse, entities} = computeLog

  //首先去查询参与计算的实体的信息
  const [entity1] = useState<Graph.Graph>(()=>getEntityData(entities[0]))
  const [entity2] = useState<Graph.Graph>(()=>getEntityData(entities[1]))
  const [editPath, setEditPath] = useState<Compute.EditPath>()
  const [cost, setCost] = useState<number>(-1)
  const [canvasWidth, setCanvasWidth] = useState<number | undefined>()
  const canvasHeight = 214
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  //拿到计算的结果
  useEffect(()=>{
    //数据已经就绪
    if(entity1 !== null && entity2 !== null){
      //todo: 假设这里拿到了编辑路径和编辑距离，后续应该去请求后端拿到计算结果
      const res = getGEDComputeResult(id)
      // @ts-ignore
      setCost(res.cost)
      // @ts-ignore
      setEditPath(res.editPath)

      const width = document.getElementById('GA')?.offsetWidth
      setCanvasWidth(width);
      renderGraph('GA', width, canvasHeight, entity1.graphData, 'radial', true)
      renderGraph('GB', width, canvasHeight, entity2.graphData, 'radial', true)
    }
  }, [entity1, entity2])

  //对编辑路径进行可视化
  useEffect(()=>{
    if(editPath){
      //1. 首先构建一些辅助变量
      //构建GA GB节点map，方便后续操作
      const GAMap = new Map<string, string>()
      entity1.graphData?.nodes.forEach((node) => {
        GAMap.set(node.id, node.label);
      });

      const GBMap = new Map<string, string>()
      entity2.graphData?.nodes.forEach((node) => {
        GBMap.set(node.id, node.label);
      });

      //存储由于节点替换产生的节点Id映射
      const nodeMap = new Map<string, string>()

      //curData存储当前应当渲染到画布上的数据，index是当前编辑的步数
      let curData = entity1.graphData;
      let index = 0;

      //2. 首先对节点进行编辑
      editPath.nodes.forEach(edit => {
        console.log(edit)
        //这次操作是添加节点
        if(!edit[0]){
          const addId = edit[1]
          // @ts-ignore
          const addLabel = GBMap.get(edit[1])
          curData = {
            // @ts-ignore
            nodes: [...curData.nodes, {id: addId, label: addLabel, style: {fill: 'rgb(253, 237, 237)', stroke: '#e72a2a'}}],
            edges: curData?.edges || []
          }
          // @ts-ignore
          GAMap.set(addId, addLabel)
          renderGraph(`edit${index}`, canvasWidth, canvasHeight, curData, null, true)
          index++;
        }
        //这次操作是删除节点
        else if(!edit[1]){
          curData = {
            // @ts-ignore
            nodes: curData.nodes.map(node => {
              return node.id !== edit[0] ? node : {...node, visible: false}
            }),
            edges: curData?.edges || []
          }
          console.log(curData)
          renderGraph(`edit${index}`, canvasWidth, canvasHeight, curData, null, true)
          index++;
        }
        //这次操作是替换节点
        else {
          const labelA = GAMap.get(edit[0])
          const labelB = GBMap.get(edit[1])
          //存储节点替换产生的映射
          nodeMap.set(edit[1], edit[0])

          console.log(labelA, labelB)

          //label不相等才算做一次edit
          if(labelA !== labelB){
            curData = {
              // @ts-ignore
              nodes: curData.nodes.map(node => {
                return node.id !== edit[0] ? node : {
                  ...node,
                  label: labelB,
                  style: {fill: 'rgb(253, 237, 237)', stroke: '#e72a2a'}
                }
              }),
              edges: curData?.edges || []
            }

            console.log(curData)
            renderGraph(`edit${index}`, canvasWidth, canvasHeight, curData, null, true)
            index++;
          }
        }
      })

      //3. 然后对边进行编辑
      editPath.edges.forEach(edit => {
        //添加边
        if(!edit[0]){
          //添加的这条边在图上的真实source和target
          // @ts-ignore
          let source = nodeMap.has(edit[1][0]) ? nodeMap.get(edit[1][0]) : edit[1][0]
          // @ts-ignore
          let target = nodeMap.has(edit[1][1]) ? nodeMap.get(edit[1][1]) : edit[1][1]

          curData = {
            // @ts-ignore
            nodes: curData.nodes,
            // @ts-ignore
            edges: [...curData.edges, {source: source, target: target, style: {stroke: '#e72a2a'}}]
          }
          console.log(curData)
          renderGraph(`edit${index}`, canvasWidth, canvasHeight, curData, null, true)
          index++;
        }
        //删除边
        else if(!edit[1]){
          curData = {
            // @ts-ignore
            nodes: curData.nodes,
            // @ts-ignore
            edges: curData.edges.filter(edge => {
              // @ts-ignore
              return !(edge.source === edit[0][0] && edge.target === edit[0][1] || edge.source === edit[0][1] && edge.target === edit[0][0])
            })
          }
          console.log(curData, index, `edit${index}`)
          renderGraph(`edit${index}`, canvasWidth, canvasHeight, curData, null, true)
          index++;
        }
      })
    }
  }, [editPath])

  const handleNextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % cost);
  };

  const handlePrevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + cost) % cost);
  };

  const handlePlayPause = () => {
    setIsPlaying((prevState) => !prevState);
  };

  //开始或暂停播放
  useEffect(() => {
    let interval: NodeJS.Timer;
    //每3s切换下一页
    if (isPlaying) {
      interval = setInterval(() => {
        handleNextSlide();
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const iconCss = useEmotionCss(()=>{
    return {
      color: 'white',
      fontSize: 18,
      ':hover': {
        cursor: 'pointer'
      }
    }
  })

  return <>
    <Card
      bodyStyle={{padding: 20}}
      style={{borderRadius: 0, height: '100%', boxShadow: '0 2px 4px 0 rgba(54,58,80,.32)'}}
    >
      <h3 style={{fontSize: 14, fontWeight: 700, padding: 0, marginBottom: 16}}>计算结果信息</h3>

      <Row style={{padding: '6px 0'}}>
        <Col style={{fontSize: 12, color: 'rgba(0,0,0,.4)'}} flex='80px'>
          任务名
        </Col>
        <Col style={{fontSize: 12, color: 'rgba(0,0,0,.9)'}} flex='auto'>
          {name}
        </Col>
      </Row>

      <Row style={{padding: '6px 0'}}>
        <Col style={{fontSize: 12, color: 'rgba(0,0,0,.4)'}} flex='80px'>
          任务类型
        </Col>
        <Col style={{fontSize: 12, color: 'rgba(0,0,0,.9)'}} flex='auto'>
          {type}
        </Col>
      </Row>

      <Row style={{padding: '6px 0'}}>
        <Col style={{fontSize: 12, color: 'rgba(0,0,0,.4)'}} flex='80px'>
          参与实体
        </Col>
        <Col style={{fontSize: 12, color: 'rgba(0,0,0,.9)'}} flex='auto'>
          <Tag icon={entities[0].type === 'graph' ? <ShareAltOutlined/> : <DatabaseOutlined/>}>{entities[0].name}</Tag>
          <Tag icon={entities[1].type === 'graph' ? <ShareAltOutlined/> : <DatabaseOutlined/>}>{entities[1].name}</Tag>
        </Col>
      </Row>

      <Row style={{padding: '6px 0'}}>
        <Col style={{fontSize: 12, color: 'rgba(0,0,0,.4)'}} flex='80px'>
          计算耗时
        </Col>
        <Col style={{fontSize: 12, color: 'rgba(0,0,0,.9)'}} flex='auto'>
          {timeUse}ms
        </Col>
      </Row>

      <Row style={{padding: '6px 0'}}>
        <Col style={{fontSize: 12, color: 'rgba(0,0,0,.4)'}} flex='80px'>
          编辑距离
        </Col>
        <Col style={{fontSize: 12, color: 'rgba(0,0,0,.9)'}} flex='auto'>
          {cost}
        </Col>
      </Row>
    </Card>

    <Card
      bodyStyle={{padding: 20}}
      style={{marginTop: 20, borderRadius: 0, height: '100%', boxShadow: '0 2px 4px 0 rgba(54,58,80,.32)'}}
    >
      <h3 style={{fontSize: 14, fontWeight: 700, padding: 0, marginBottom: 16}}>结果可视化</h3>

      <Row>
        <Col span={8}>
          <div style={{border: '1px solid grey'}}>
            <div style={{height: 214}} id='GA'></div>
            <div style={{height: 30, width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>原始图</div>
          </div>
        </Col>

        <Col span={8}>
          <div style={{ width: '100%', overflow: 'hidden', position: 'relative', border: '1px solid grey'}}>
            <div
              style={{
                display: 'flex',
                transition: 'transform 0.5s',
                transform: `translateX(-${currentIndex * 100}%)`,
              }}
            >
              {Array.from({ length: cost }).map((_, index)=>
                <div key={index} style={{width: '100%', height: 214}} id={`edit${index}`}></div>)}
            </div>

            <div style={{padding: '4px 5px', backgroundColor: 'black'}}>
              {
                isPlaying ? <PauseOutlined onClick={handlePlayPause} className={iconCss}/>
                  : <CaretRightOutlined onClick={handlePlayPause} className={iconCss}/>
              }

              <span style={{float: 'right'}}>
              <StepBackwardOutlined className={iconCss} onClick={handlePrevSlide}/>
              <span style={{margin: '0 20px', color: 'white'}}>
                {currentIndex+1} / {cost}
              </span>
              <StepForwardOutlined className={iconCss} onClick={handleNextSlide}/>
            </span>
            </div>
          </div>
        </Col>

        <Col span={8}>
          <div style={{border: '1px solid grey'}}>
            <div style={{height: 214}} id='GB'></div>
            <div style={{height: 30, width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>目标图</div>
          </div>
        </Col>
      </Row>
    </Card>
  </>
}

export default GED
