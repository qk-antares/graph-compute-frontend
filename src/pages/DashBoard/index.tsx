import {Col, Row} from 'antd';
import React from 'react';
import InfoCard from "@/pages/DashBoard/InfoCard";
import MonitorCard from "@/pages/DashBoard/MonitorCard";
import TaskCard from "@/pages/DashBoard/TaskCard";

const DashBoard: React.FC = () => {

  return (
    <>
      <Row>
        <Col span={10} style={{ padding: '0 10px 10px 0' }}>
          <InfoCard/>
        </Col>

        <Col span={14} style={{ padding: '0  0 10px 10px'}}>
          <MonitorCard/>
        </Col>
      </Row>

      <TaskCard/>
    </>
  );
};
export default DashBoard;
