import DataSourcePreview from '@/pages/DataSource/DataSourceList/DataSourcePreview';
import DataSourceTable from '@/pages/DataSource/DataSourceList/DataSourceTable';
import {Card, message} from 'antd';
import React, {useState} from 'react';
import {useNavigate} from 'umi';
import {getDataSourceById} from "@/utils/exampleData";
import {history} from "@@/core/history";

const DataSourceCase: React.FC = () => {
  const navigate = useNavigate();
  const urlSearchParams = new URLSearchParams(location.search);
  const [targetDataSource, setTargetDataSource] = useState<DataSource.DataSource | null>(()=>{
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
  })

  return (
    <Card bodyStyle={{ padding: '24px 0' }}>
      {
        targetDataSource ?
          <DataSourcePreview
            type='case'
            dataSource={targetDataSource}
            setDataSource={setTargetDataSource}
          /> :
        <DataSourceTable
          type='case'
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

export default DataSourceCase;
