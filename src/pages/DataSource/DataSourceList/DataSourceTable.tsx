import {IconFont} from '@/utils/iconUtil';
import {ProColumns, ProTable} from '@ant-design/pro-components';
import {Button, message, Popconfirm, Tag, Tooltip} from 'antd';
import React, {useEffect, useState} from 'react';
import {downloadCaseData, exampleDataSource} from "@/utils/exampleData";

type DataSourceTableProps = {
  //类型mine或case
  type: string;
  onInspect: (targetDataSource: DataSource.DataSource) => void;
};

const DataSourceTable: React.FC<DataSourceTableProps> = ({type, onInspect }) => {
  const [data, setData] = useState<DataSource.DataSource[]>([]);

  useEffect(()=>{
    if(type === 'mine'){
      //todo: 请求后端的数据集数据
      //这里先用示例数据代替
      setData(exampleDataSource)
    } else {
      setData(exampleDataSource)
    }
  }, [])

  const downloadDataSource = (dataSourceId: string) => {
    //todo: 根据dataSourceId去请求OSS上的数据
    console.log("下载数据集: ",dataSourceId);

    //暂且下载示例数据
    downloadCaseData(dataSourceId);
  }

  const deleteDataSource = (dataSourceId: string) => {
    //todo: 移除数据库和OSS上的数据
    message.info('功能待完善')
    console.log("删除数据集: ", dataSourceId);
  }

  const columns: ProColumns<DataSource.DataSource>[] = [
    {
      title: '数据集名称',
      dataIndex: 'name',
      valueType: 'text',
      render: (dom) => {
        return <Tag color="#108ee9">{dom}</Tag>;
      },
    },
    {
      title: '数据集ID',
      dataIndex: 'id',
      valueType: 'text',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'text',
    },
    {
      title: '操作',
      render: (dom, entity) => {
        return (
          <>
            <Tooltip placement="top" title="图数据分析" color="blue">
              <Button
                onClick={()=>message.info('功能待完善')}
                type="text"
                icon={<IconFont type="icon-shujufenxi" />}>
              </Button>
            </Tooltip>
            <Tooltip placement="top" title="查看数据基本信息" color="gray">
              <Button
                onClick={() => onInspect(entity)}
                type="text"
                icon={<IconFont type="icon-graphql" />}>
              </Button>
            </Tooltip>
            <Button
              onClick={() => downloadDataSource(entity.id)}
              type="text"
              icon={<IconFont type="icon-xiazaidaoru" />}>
            </Button>
            {
              type === 'mine' &&
              <Popconfirm
                title="删除数据集"
                description="确定要删除该数据集？此操作不可撤销"
                onConfirm={()=>deleteDataSource(entity.id)}
                okText="是"
                cancelText="否"
              >
                <Button type="text" icon={<IconFont type="icon-trash" />}></Button>
              </Popconfirm>
            }
          </>
        );
      },
    },
  ];

  return (
    <ProTable<DataSource.DataSource, Common.PageParams>
      style={{ padding: 0 }}
      columns={columns}
      dataSource={data}
      options={false}
      search={false}
      rowKey="id"
    ></ProTable>
  );
};

export default DataSourceTable;
