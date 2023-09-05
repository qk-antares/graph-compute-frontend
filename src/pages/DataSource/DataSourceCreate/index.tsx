import DataBase from '@/pages/DataSource/DataSourceCreate/DataBase';
import Local from '@/pages/DataSource/DataSourceCreate/Local';
import { IconFont } from '@/utils/iconUtil';
import { useEmotionCss } from '@ant-design/use-emotion-css';
import { Card, Tabs } from 'antd';
import React, {useEffect, useState} from 'react';
import {useNavigate} from "@@/exports";

const DataSourceCreate: React.FC = () => {
  const navigate = useNavigate();
  const urlSearchParams = new URLSearchParams(location.search);
  const [activeTab, setActiveTab] = useState<string>(()=>{
    return urlSearchParams.get('tab') || 'local'
  })

  //监听路径参数变化
  useEffect(() => {
    setActiveTab(urlSearchParams.get('tab') || 'local');
    console.log(urlSearchParams.get('tab') || 'local')
  }, [location.search]);

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
  const activeCss = useEmotionCss(() => {
    return {
      width: 68,
      height: 68,
      marginRight: 12,
      display: 'inline-block',
      borderRadius: 8,
      padding: 4,
      cursor: 'pointer',
      backgroundColor: 'rgb(220,229,250)',
      div: {
        display: 'flex',
        justifyContent: 'center',
        margin: '3px 0',
      },
    };
  });

  //切换tab时将query参数添加到路径上
  const changeTab = (newTab: string) => {
    //将搜索参数拼接到query上
    const params = new URLSearchParams({
      tab: newTab,
    });
    navigate({
      search: `?${params.toString()}`,
    });
  }

  return (
    <>
      <Card style={{ marginBottom: 12 }}>
        <label style={{ display: 'block', padding: '0px 0px 12px 0' }}>选择数据源类型</label>
        <ul style={{ listStyle: 'none', padding: 0, display: 'block', marginBottom: 0 }}>
          <li
            onClick={() => changeTab('local')}
            className={activeTab === 'local' ? activeCss : liCss}
          >
            <div>
              <IconFont style={{ fontSize: 32 }} type="icon-yiguidangde-copy" />
            </div>
            <div>本地文件</div>
          </li>

          <li
            onClick={() => changeTab('database')}
            className={activeTab === 'database' ? activeCss : liCss}
          >
            <div>
              <IconFont style={{ fontSize: 32 }} type="icon-neo4j-copy" />
            </div>
            <div>图数据库</div>
          </li>
        </ul>
      </Card>

      <Card>
        {(activeTab === 'local' && (
          <Tabs
            tabPosition="left"
            items={[
              {
                label: 'GraphJSON',
                key: 'GraphJSON',
                children: <Local />,
              },
            ]}
          />
        )) ||
          (activeTab === 'database' && (
            <Tabs
              tabPosition="left"
              items={[
                {
                  label: 'Neo4j',
                  key: 'Neo4j',
                  children: <DataBase />,
                },
              ]}
            />
          ))}
      </Card>
    </>
  );
};

export default DataSourceCreate;
