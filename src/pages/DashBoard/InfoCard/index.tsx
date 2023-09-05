import {Badge, Card, Col, Row, Typography} from "antd";
import React from "react";

const InfoCard: React.FC = () => {
  const { Paragraph } = Typography;

  return (
    <Card
      bodyStyle={{padding: 20}}
      style={{borderRadius: 0, height: '100%', boxShadow: '0 2px 4px 0 rgba(54,58,80,.32)'}}
    >
      <h3 style={{fontSize: 14, fontWeight: 700, padding: 0, marginBottom: 16}}>服务器信息</h3>

      <Row style={{padding: '6px 0'}}>
        <Col style={{fontSize: 12, color: 'rgba(0,0,0,.4)'}} flex='80px'>
          服务器IP
        </Col>
        <Col flex='auto'>
          <Paragraph style={{fontSize: 12, color: 'rgba(0,0,0,.9)'}} copyable>1.116.132.238</Paragraph>
        </Col>
      </Row>

      <Row style={{padding: '6px 0', marginBottom: 12}}>
        <Col style={{fontSize: 12, color: 'rgba(0,0,0,.4)'}} flex='80px'>
          运行状态
        </Col>
        <Col style={{display: 'flex', alignItems: 'center'}} flex='auto'>
          <Badge status="processing"/>
          <span style={{marginLeft: 8, fontSize: 12, color: 'rgba(0,0,0,.9)'}} >
            运行中
          </span>
        </Col>
      </Row>

      <Row style={{padding: '6px 0'}}>
        <Col style={{fontSize: 12, color: 'rgba(0,0,0,.4)'}} flex='80px'>
          硬件规格
        </Col>
        <Col style={{display: 'flex', alignItems: 'center'}} flex='auto'>
          <ul style={{fontSize: 12, padding: 0, listStyle: 'none', color: 'rgba(0,0,0,.9)'}}>
            <li>CPU - 2核 内存 - 4GB</li>
            <li>系统盘 - SSD云硬盘 60GB</li>
            <li>流量包 - 1000GB/月（带宽：6Mbps）</li>
          </ul>
        </Col>
      </Row>

      <Row>
        <Col span={12}>

        </Col>
        <Col span={12}>

        </Col>
      </Row>
    </Card>
  )
}

export default InfoCard
