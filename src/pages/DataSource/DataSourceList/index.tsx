import DataSourcePreview from '@/pages/DataSource/DataSourceList/DataSourcePreview';
import DataSourceTable from '@/pages/DataSource/DataSourceList/DataSourceTable';
import {Card, message} from 'antd';
import React, {useEffect, useState} from 'react';
import {useLocation, useNavigate} from 'umi';
import {getDataSourceById} from "@/utils/exampleData";
import {history} from "@umijs/max";

const DataSourceList: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const urlSearchParams = new URLSearchParams(location.search);
  const [loading, setLoading] = useState(true)
  const [targetDataSource, setTargetDataSource] = useState<DataSource.DataSource | null>(null)

  const getTargetDataSource = ()=>{
    //根据路径中的参数查询，这里直接到本地查询了
    const dataSourceId = urlSearchParams.get('dataSourceId')
    if(dataSourceId){
      const result = getDataSourceById(dataSourceId)
      if(result){
        return result;
      } else {
        message.error('请求的数据源不存在')
        history.push('/home')
      }
    }
    return null;
  }

  //监听路径参数变化
  useEffect(() => {
    setTargetDataSource(getTargetDataSource)
    setLoading(false)
  }, [location.search]);

  return (
    <Card bodyStyle={{ padding: '24px 0' }} loading={loading}>
      {
        targetDataSource ?
        <DataSourcePreview
          type='mine'
          dataSource={targetDataSource}
          setDataSource={setTargetDataSource}
        /> :
        <DataSourceTable
          type='mine'
          onInspect={(targetDataSource) => {
            setTargetDataSource(targetDataSource)
            //将搜索参数拼接到query上
            const params = new URLSearchParams({
              dataSourceId: targetDataSource.id,
            });
            navigate({
              search: `?${params.toString()}`,
            });
          }}
        />
      }
    </Card>
  );
};

export default DataSourceList;
