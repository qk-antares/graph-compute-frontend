import React from "react";
import {Card, Col, Row} from "antd";
import CPU from "@/pages/DashBoard/MonitorCard/CPU";
import Bandwidth from "@/pages/DashBoard/MonitorCard/Bandwidth";

const MonitorCard: React.FC = () => {
  return (
    <Card
      bodyStyle={{padding: 20}}
      style={{borderRadius: 0, boxShadow: '0 2px 4px 0 rgba(54,58,80,.32)'}}
    >
      <h3 style={{fontSize: 14, fontWeight: 700, padding: 0}}>平台监控</h3>

      <Row>
        <Col style={{padding: '0px 12px 0px 0px', height: 200, display: 'flex', flexDirection: 'column', justifyContent: 'space-around'}} span={12}>
          <div>
            <div style={{ marginBottom: '12px' }}>
              <h5 style={{fontWeight: 700 }}>CPU利用率（%）</h5>
            </div>
            <p style={{ fontSize: 12, marginBottom: '12px' }}>当前：2.833% 总量：2核</p>
            <CPU></CPU>
          </div>
        </Col>

        <Col style={{padding: '0px 0px 0px 12px', height: 200, display: 'flex', flexDirection: 'column', justifyContent: 'space-around'}} span={12}>
          <div>
            <div style={{ marginBottom: '12px' }}>
              <h5 style={{ fontWeight: 700 }}>内存使用量（MB）</h5>
            </div>
            <p style={{ fontSize: 12, marginBottom: '12px' }}>当前：3325.166MB 总量：4GB</p>
            <CPU></CPU>
          </div>
        </Col>
      </Row>

      <Row>
        <Col style={{padding: '0px 10px 0px 0px', height: 200, display: 'flex', flexDirection: 'column', justifyContent: 'space-around'}} span={12}>
          <div>
            <div style={{ marginBottom: '12px' }}>
              <h5 style={{fontWeight: 700 }}>带宽使用（Mbps）</h5>
            </div>
            <p style={{ fontSize: 12, marginBottom: '12px' }}>当前：0.02（入）0.018（出）</p>
            <Bandwidth/>
          </div>
        </Col>

        <Col style={{padding: '0px 0px 0px 10px', height: 200, display: 'flex', flexDirection: 'column', justifyContent: 'space-around'}} span={12}>
          <div>
            <div style={{ marginBottom: '12px' }}>
              <h5 style={{ fontWeight: 700 }}>系统盘IO（KB/s）</h5>
            </div>
            <p style={{ fontSize: 12, marginBottom: '12px' }}>当前：225.915（读）88.798（写）</p>
            <Bandwidth/>
          </div>
        </Col>
      </Row>
    </Card>
  )
}

export default MonitorCard
