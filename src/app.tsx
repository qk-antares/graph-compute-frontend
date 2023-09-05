import type {Settings as LayoutSettings} from '@ant-design/pro-components';
import type {RunTimeLayoutConfig} from '@umijs/max';
import defaultSettings from '../config/defaultSettings';
import {requestConfig} from './requestConfig';
import RightContent from "@/components/RightContent";
import React from "react";
import Footer from "@/components/Footer";
import {getCurrentUser} from "@/services/user/api";
import {history} from '@umijs/max';


const loginPath = '/user/login';

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: User.UserInfo;
  loading?: boolean;
  fetchUserInfo?: () => Promise<User.UserInfo | undefined>;
}> {
  //获取用户信息，这是一个异步请求(只是一个方法，不会真正执行)
  const fetchUserInfo = async () => {
    try {
      const res = await getCurrentUser();
      return res.data;
    } catch (error) {
      history.push(loginPath);
    }
    return undefined;
  };

  const curPath = history.location.pathname;
  //只要不是登录或注册页，就要去拉取用户信息（但是为空这里也不跳转）
  if(curPath !== loginPath){
    const currentUser = await fetchUserInfo();
    return {
      fetchUserInfo,
      currentUser,
      settings: defaultSettings as Partial<LayoutSettings>,
    };
  }
  // 如果是登录页或注册页，只返回获取用户信息的方法
  return {
    fetchUserInfo,
    settings: defaultSettings as Partial<LayoutSettings>,
  };
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState }) => {
  return {
    rightContentRender: () => <RightContent/>,
    footerRender: () => <Footer/>,
    onPageChange: () => {
      // 必须要求登录的页面没有登录，重定向到 login
      if (!initialState?.currentUser) {
        history.push(loginPath);
      }
    },
    layoutBgImgList: [
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/D2LWSqNny4sAAAAAAAAAAAAAFl94AQBr',
        left: 85,
        bottom: 100,
        height: '303px',
      },
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/C2TWRpJpiC0AAAAAAAAAAAAAFl94AQBr',
        bottom: -68,
        right: -45,
        height: '303px',
      },
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/F6vSTbj8KpYAAAAAAAAAAAAAFl94AQBr',
        bottom: 0,
        left: 0,
        width: '331px',
      },
    ],
    menuHeaderRender: undefined,
    // 自定义 403 页面
    childrenRender: (children) => {
      return (
        <>
          {children}
        </>
      );
    },
    ...initialState?.settings,
  };
};

export const request = {
  ...requestConfig,
};
