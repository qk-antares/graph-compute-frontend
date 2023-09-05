import {request} from "@@/exports";

/** 获取当前的用户 GET */
export async function getCurrentUser(options?: { [key: string]: any }) {
  return request<Common.R>('/user/info', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 登录接口（账号密码登录） POST */
export async function login(body: User.LoginParams, options?: { [key: string]: any }) {
  return request<Common.R>('/user/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 注册接口（邮箱密码注册） POST */
export async function register(body: User.RegisterParams, options?: { [key: string]: any }) {
  return request<Common.R>('/user/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 退出登录接口 POST */
export async function outLogin(options?: { [key: string]: any }) {
  return request<Common.R>('/user/logout', {
    method: 'POST',
    ...(options || {}),
  });
}
