import React, {useEffect, useState} from "react";
import {ProColumns, ProTable} from "@ant-design/pro-components";
import {Badge, Button, message, Popconfirm, Skeleton, Tag, Tooltip} from "antd";
import {IconFont} from "@/utils/iconUtil";
import {exampleComputeLog, getComputeLogById} from "@/utils/exampleData";
import {CheckOutlined, DatabaseOutlined, ShareAltOutlined} from "@ant-design/icons";
import {history} from "@@/core/history";
import ComputeLog from "@/pages/Compute/ComputeList/ComputeLog";
import {useNavigate} from "@@/exports";

const ComputeList: React.FC = () => {
  const navigate = useNavigate();
  const urlSearchParams = new URLSearchParams(location.search);
  const [data, setData] = useState<Compute.Log[]>([]);
  const [loading, setLoading] = useState(true)
  const [targetLog, setTargetLog] = useState<Compute.Log | null>(null)

  const getTargetLog = ()=>{
    //根据路径中的参数查询，这里直接到本地查询了
    const targetLogId = urlSearchParams.get('targetLogId')
    if(targetLogId){
      const result = getComputeLogById(targetLogId)
      if(result){
        return result;
      } else {
        message.error('请求的计算任务不存在')
        history.push('/home')
      }
    }
    return null;
  }

  //监听路径参数变化
  useEffect(() => {
    setTargetLog(getTargetLog)
    setLoading(false)
  }, [location.search]);

  //查看某个计算任务的结果
  const viewLog = (computeLog: Compute.Log)=>{
    setTargetLog(computeLog)
    //将搜索参数拼接到query上
    const params = new URLSearchParams({
      targetLogId: computeLog.id,
    });
    navigate({
      search: `?${params.toString()}`,
    });
  }

  const columns: ProColumns<Compute.Log>[] = [
    {
      title: '任务名称',
      dataIndex: 'name',
      valueType: 'text',
      render: (dom) => {
        return <Tag color="#108ee9">{dom}</Tag>;
      },
    },
    {
      title: '任务类型',
      dataIndex: 'type',
      valueType: 'text',
    },
    {
      title: '参与实体',
      dataIndex: 'entities',
      valueType: 'text',
      render: (dom, entity) => {
        return <>
          <Tag icon={entity.entities[0].type === 'graph' ? <ShareAltOutlined/> : <DatabaseOutlined/>}>{entity.entities[0].name}</Tag>
          {
            entity.entities[1] ?
              <Tag icon={entity.entities[1].type === 'graph' ? <ShareAltOutlined/> : <DatabaseOutlined/>}>{entity.entities[1].name}</Tag>
              : null
          }
        </>;
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'text',
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueType: 'text',
      render: (dom, entity) => {
        if(entity.status === '已完成'){
          return <Tag icon={<CheckOutlined />} color="#87d068">{dom}</Tag>;
        } else if (entity.status === '计算中'){
          return <>
            <Badge status="processing" />
            <span style={{marginLeft: 8}}>
              计算中
            </span>
          </>
        }
      },
    },
    {
      title: '计算耗时',
      dataIndex: 'timeUse',
      render: (dom, entity) => {
        if(entity.timeUse > 0){
          return `${entity.timeUse}ms`
        } else {
          return '-'
        }
      },
    },
    {
      title: '操作',
      render: (dom, entity) => {
        return (
          <>
            <Tooltip placement="top" title="查看结果" color="blue">
              <Button onClick={()=>viewLog(entity)} type="text" icon={<IconFont type="icon-shujufenxi" />}></Button>
            </Tooltip>
            <Popconfirm
              title="删除数据集"
              description="确定要删除该数据集？此操作不可撤销"
              okText="是"
              cancelText="否"
            >
              <Button type="text" icon={<IconFont type="icon-trash" />}></Button>
            </Popconfirm>
          </>
        );
      },
    },
  ];

  useEffect(()=>{
    setData(exampleComputeLog)
  }, [])



  return (
    loading ?
      <Skeleton/> :
      <>{
        targetLog ? <ComputeLog computeLog={targetLog}></ComputeLog> :
          <ProTable<Compute.Log, Common.PageParams>
            loading={loading}
            style={{ padding: 0 }}
            columns={columns}
            dataSource={data}
            options={false}
            search={false}
            rowKey="id"
          ></ProTable>
      }</>
  )
}

export default ComputeList
