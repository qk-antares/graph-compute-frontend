import {BookOutlined} from '@ant-design/icons';
import {Button, Card, Col, Form, Input, message, Row} from 'antd';
import React from 'react';

const DataBase: React.FC = () => {
  const [form] = Form.useForm();

  const connectDatabase = ()=>{
    message.info('功能待完善')
  }

  return (
    <>
      <Row align="middle">
        <Col span={12} style={{ display: 'flex', alignItems: 'center', placeContent: 'center' }}>
          <img
            width="250px"
            src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*X4I6QZIDjY8AAAAAAAAAAAAADmJ7AQ/original"
            alt=""
          />
        </Col>

        <Col span={12}>
          <h2>NEO4J DATABASE</h2>
          <p>
            Neo4j 拥有超过 950 家企业客户，是全球领先的可扩展图形技术提供商，为超过 75% 的财富 100
            强企业提供连接数据应用程序。
          </p>
          <p>
            <Button size="small" type="primary" icon={<BookOutlined/>}>
              使用文档
            </Button>
          </p>
        </Col>
      </Row>

      <Card>
        <Form layout="horizontal" form={form}>
          <Form.Item label="引擎地址">
            <Input placeholder="请输入图引擎地址" />
          </Form.Item>
          <Form.Item label="账号">
            <Input />
          </Form.Item>
          <Form.Item label="密码">
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button style={{ width: '100%' }} type="primary" onClick={()=>connectDatabase()}>
              开始连接
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </>
  );
};

export default DataBase;
