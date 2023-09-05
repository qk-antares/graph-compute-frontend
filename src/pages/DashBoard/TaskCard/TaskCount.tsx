import { Column } from '@ant-design/charts';
import React from 'react';
import {Col, Row} from "antd";

const TaskCount: React.FC = () => {

  function formatDateToString(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  function getRandomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function generateMockData() {
    const dataList = [];
    const date = new Date(); // 获取当前日期

    for (let i = 11; i >= 0; i--) {
      dataList.unshift({
        time: formatDateToString(date),
        count: getRandomInt(50, 100)
      });

      date.setDate(date.getDate() - 1); // 倒推前面的日期
    }

    return dataList;
  }

  const data = generateMockData();

  console.log(data);

  const config = {
    width: 640,
    height: 300,
    title: {
      visible: true,
      text: '基础柱状图',
    },
    forceFit: true,
    data,
    xField: 'time',
    yField: 'count',
    meta: {
      type: { alias: '日期' },
      sales: { alias: '完成任务数' },
    },
  };
  return (
    <Row>
      <Col span={15} style={{ padding: 10 }}>
        <Column {...config} />
      </Col>
      <Col span={9} style={{ padding: 10 }}>
        <h5>任务列表</h5>
      </Col>
    </Row>
  );
};

export default TaskCount;
