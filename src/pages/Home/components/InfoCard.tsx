import React from "react";
import {Card, theme} from "antd";

export const InfoCard: React.FC<{
  title: string;
  index: number;
  desc: any;
}> = ({ title, index, desc }) => {
  const { useToken } = theme;
  const { token } = useToken();

  return (
    <Card style={{boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.2)',flex: 1,}}>
      <div style={{display: 'flex',gap: '4px', alignItems: 'center',}}>
        <div
          style={{
            width: 48,
            height: 48,
            lineHeight: '22px',
            backgroundSize: '100%',
            textAlign: 'center',
            padding: '8px 16px 16px 12px',
            color: '#FFF',
            fontWeight: 'bold',
            backgroundImage:
              "url('https://gw.alipayobjects.com/zos/bmw-prod/daaf8d50-8e6d-4251-905d-676a24ddfa12.svg')",
          }}
        >
          {index}
        </div>
        <div style={{fontSize: '16px', color: token.colorText, paddingBottom: 8}}>
          {title}
        </div>
      </div>
      <div style={{fontSize: '14px', color: token.colorTextSecondary, textAlign: 'justify', lineHeight: '22px',}}>
        {desc}
      </div>
    </Card>
  );
};
