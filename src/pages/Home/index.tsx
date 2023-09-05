import DataSourceTable from '@/pages/DataSource/DataSourceList/DataSourceTable';
import GraphList from '@/pages/Graph/GraphList';
import {IconFont} from '@/utils/iconUtil';
import {history} from '@@/exports';
import {AppstoreOutlined, BarsOutlined, DeploymentUnitOutlined} from '@ant-design/icons';
import {useEmotionCss} from '@ant-design/use-emotion-css';
import {Card, Segmented} from 'antd';
import React, {useEffect, useState} from 'react';
import {InfoCard} from "@/pages/Home/components/InfoCard";

const Home: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string | number>('datasource');

  //todo: 初始化一些示例图数据，真实上线时应该删除
  useEffect(()=>{
    if(!localStorage.getItem('graphs')){
      const initialData = require('./initialData.json')
      localStorage.setItem('graphs', JSON.stringify(initialData))
    }
  })

  const liCss = useEmotionCss(() => {
    return {
      width: 68,
      height: 68,
      marginRight: 12,
      display: 'inline-block',
      borderRadius: 8,
      padding: 4,
      ':hover': {
        cursor: 'pointer',
        backgroundColor: 'rgb(220,229,250)',
      },
      div: {
        display: 'flex',
        justifyContent: 'center',
        margin: '3px 0',
      },
    };
  });

  return (
    <div style={{ width: '100%', maxWidth: 1120, margin: '0 auto' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
        <InfoCard
          index={1}
          title="选择数据源"
          desc={
            <ul style={{ listStyle: 'none', padding: 0, display: 'block' }}>
              <li className={liCss} onClick={()=>{history.push('/datasource/case')}}>
                <div>
                  <IconFont style={{ fontSize: 32 }} type="icon-xiazaiyangli-copy" />
                </div>
                <div>样例数据</div>
              </li>

              <li className={liCss} onClick={()=>{history.push('/datasource/create?tab=local')}}>
                <div>
                  <IconFont style={{ fontSize: 32 }} type="icon-yiguidangde-copy" />
                </div>
                <div>本地文件</div>
              </li>

              <li className={liCss} onClick={()=>{history.push('/datasource/create?tab=database')}}>
                <div>
                  <IconFont style={{ fontSize: 32 }} type="icon-neo4j-copy" />
                </div>
                <div>图数据库</div>
              </li>
            </ul>
          }
        />

        <InfoCard
          index={2}
          title="创建搜索图"
          desc={
            <ul style={{ listStyle: 'none', padding: 0, display: 'block' }}>
              <li onClick={()=>{
                history.push('/graph/create?tab=local')
              }} className={liCss}>
                <div>
                  <IconFont style={{ fontSize: 32 }} type="icon-yiguidangde-copy" />
                </div>
                <div>本地文件</div>
              </li>
              <li onClick={()=>{
                history.push('/graph/create?tab=edit')
              }} className={liCss}>
                <div>
                  <DeploymentUnitOutlined style={{ fontSize: 32 }} />
                </div>
                <div>手动编辑</div>
              </li>
            </ul>
          }
        />

        <InfoCard
          index={3}
          title="执行计算任务"
          desc={
            <ul style={{ listStyle: 'none', padding: 0, display: 'block' }}>
              <li className={liCss}>
                <div>
                  <IconFont style={{ fontSize: 32 }} type="icon-shujufenxi-copy" />
                </div>
                <div>数据分析</div>
              </li>
              <li className={liCss}>
                <div>
                  <IconFont style={{ fontSize: 32 }} type="icon-shujufenxi-liuliangfenxi" />
                </div>
                <div>子图搜索</div>
              </li>
              <li onClick={()=>{
                history.push('/dashboard')
              }} className={liCss}>
                <div>
                  <IconFont style={{ fontSize: 32 }} type="icon-jiankongkongzhiguanli" />
                </div>
                <div>平台监控</div>
              </li>
            </ul>
          }
        />
      </div>

      <Card
        style={{ marginTop: 12, boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.2)'}}
        bodyStyle={{ padding: '12px 0' }}
        title={
          <Segmented
            value={activeTab}
            onChange={setActiveTab}
            options={[
              {
                label: '我的数据',
                value: 'datasource',
                icon: <BarsOutlined />,
              },
              {
                label: '我的图',
                value: 'graph',
                icon: <AppstoreOutlined />,
              },
            ]}
          />
        }
      >
        {
          (activeTab === 'datasource' && (
            <DataSourceTable
              type='mine'
              onInspect={(targetDataSource) => {
                //进行页面跳转
                history.push(`/datasource/list?dataSourceId=${targetDataSource.id}`);
              }}
            />
          )) ||
          (activeTab === 'graph' && (
            <div style={{ padding: '0 24px' }}>
              <GraphList/>
            </div>
          ))
        }
      </Card>
    </div>
  );
};

export default Home;
