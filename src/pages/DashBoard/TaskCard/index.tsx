import {Card, Col, Row, Tabs, TabsProps} from "antd";
import React from "react";
import TaskCount from "@/pages/DashBoard/TaskCard/TaskCount";

const TaskCard: React.FC = () => {
  const items: TabsProps['items'] = [
    {
      key: '1',
      label: `任务完成数`,
      children: <TaskCount/>,
    }
  ];

  const onChange = (key: string) => {
    console.log(key);
  };

  return (
    <Card
      bodyStyle={{padding: 20}}
      style={{marginTop: 10, borderRadius: 0, boxShadow: '0 2px 4px 0 rgba(54,58,80,.32)'}}
    >
      <Tabs defaultActiveKey="1" items={items} onChange={onChange}/>
    </Card>
  )
}

export default TaskCard
