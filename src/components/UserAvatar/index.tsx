import {Avatar, Dropdown, MenuProps, message} from 'antd';
import React, {useEffect, useState} from 'react';
import {LogoutOutlined, SettingOutlined, UserOutlined} from "@ant-design/icons";
import {outLogin} from "@/services/user/api";
import {history} from "@@/core/history";
import {useModel} from "@@/exports";

const UserAvatar: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const currentUser = initialState?.currentUser;
  const [items, setItems] = useState<MenuProps['items']>([]);

  useEffect(()=>{
    if(currentUser){
      setItems([
        {
          label: '退出',
          key: '3',
          icon: <LogoutOutlined />
        },
      ]);
    }
  }, [currentUser])

  const onClick: MenuProps['onClick'] = async ({key}) => {
    //如果点击的是退出，则要请求退出
    if (key === '3') {
      await outLogin();
      message.success('退出成功');
      history.push('/note');
      location.reload();
    }
  };

  return (
    <Dropdown menu={{ items, onClick }} placement="bottom">
      <a onClick={e => e.preventDefault()}>
        <Avatar
          src={<img src={currentUser?.avatar || 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png'}/>}
          style={{verticalAlign: 'top', marginTop: 12}}
        />
      </a>
    </Dropdown>
  );
};
export default UserAvatar;
