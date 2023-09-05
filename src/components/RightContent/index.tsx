import '@umijs/max';
import {useEmotionCss} from "@ant-design/use-emotion-css";
import React from "react";
import {Question} from "@/components/Question";
import {Storage} from "@/components/Storage";
import {Github} from "@/components/Github";
import {Button, Popover, Space} from "antd";
import {history} from "@umijs/max";


const GlobalHeaderRight: React.FC = () => {
  const actionClassName = useEmotionCss(({ token }) => {
    return {
      display: 'flex',
      alignItems: 'center',
      height: '48px',
      marginLeft: 'auto',
      overflow: 'hidden',
      padding: '0 12px',
      gap: '0px',
      cursor: 'pointer',
      transition: 'all 0.3s',
      margin: '0px',
      borderRadius: token.borderRadius,
      '&:hover': {
        backgroundColor: token.colorBgTextHover,
      },
    };
  });

  return (
    <>
      <span className={actionClassName}>
        <Question/>
      </span>
      <span className={actionClassName}>
        <Storage/>
      </span>
      <Popover
        placement="bottomRight"
        content={<>
          <p style={{marginBottom: 8}}>开源不易，给个鼓励，加个 ⭐️ 吧</p>
          <Space>
            <Button size='small'>别烦我</Button>
            <Button onClick={()=>{
              window.open('https://github.com/Antares407/graph-compute-frontend', '_blank');
            }} size='small' type='primary'>这就去</Button>
          </Space>
        </>}
      >
        <span className={actionClassName}>
          <Github/>
        </span>
      </Popover>
    </>
  );
};
export default GlobalHeaderRight;
