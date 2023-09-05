declare namespace User {
  type LoginParams = {
    username: string;
    password: string;
  };

  type RegisterParams = {
    registerUsername: string;
    registerPassword: string;
  }

  type UserInfo = {
    uid: number;
    userRole: string;//用户角色
    username: string;
    avatar: string;
  };
}
