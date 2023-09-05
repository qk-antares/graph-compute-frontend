import Footer from '@/components/Footer';
import {LockOutlined, UserOutlined,} from '@ant-design/icons';
import {LoginForm, ProFormCheckbox, ProFormText,} from '@ant-design/pro-components';
import {useEmotionCss} from '@ant-design/use-emotion-css';
import {Helmet} from '@umijs/max';
import {message, Popover, Progress, Tabs} from 'antd';
import React, {useRef, useState} from 'react';
import {ProFormInstance} from "@ant-design/pro-form/lib";
import Settings from "../../../../config/defaultSettings";
import {login, register} from "@/services/user/api";


const passwordStatusMap = {
  ok: (
    <div>
      <span>强度：强</span>
    </div>
  ),
  pass: (
    <div>
      <span>强度：中</span>
    </div>
  ),
  poor: (
    <div>
      <span>强度：太短</span>
    </div>
  ),
};

const passwordProgressMap: {
  ok: 'success';
  pass: 'normal';
  poor: 'exception';
} = {
  ok: 'success',
  pass: 'normal',
  poor: 'exception',
};

const Login: React.FC = () => {
  const [tab, setTab] = useState<string>('login');
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [popover, setPopover] = useState<boolean>(false);


  const formRef = useRef<
    ProFormInstance<{
      username?: string;
      password?: string;

      registerUsername?: string;
      registerPassword?: string;
      confirm?: string;
    }>
  >();

  //获取密码等级
  const getPasswordStatus = () => {
    const value = formRef.current?.getFieldValue('registerPassword');
    if (value && value.length > 9) {
      return 'ok';
    }
    if (value && value.length > 5) {
      return 'pass';
    }
    return 'poor';
  };

  //检查确认密码
  const checkConfirm = (_: any, value: string) => {
    const promise = Promise;
    if (value && value !== formRef.current?.getFieldValue('registerPassword')) {
      return promise.reject('两次输入的密码不匹配!');
    }
    return promise.resolve();
  };

  //检查密码
  const checkPassword = (_: any, value: string) => {
    const promise = Promise;
    // 没有值的情况
    if (!value) {
      setModalVisible(false);
      return promise.reject('请输入密码!');
    }
    // 有值的情况
    if (!modalVisible) {
      setModalVisible(true);
    }
    setPopover(!popover);
    if (value.length < 6) {
      return promise.reject('密码至少为6个字符！');
    }
    return promise.resolve();
  };

  //渲染密码难度条
  const renderPasswordProgress = () => {
    const value = formRef.current?.getFieldValue('registerPassword');
    const passwordStatus = getPasswordStatus();
    return value && value.length ? (
      <div>
        <Progress
          status={passwordProgressMap[passwordStatus]}
          strokeWidth={6}
          percent={value.length * 10 > 100 ? 100 : value.length * 10}
          showInfo={false}
        />
      </div>
    ) : null;
  };

  //样式
  const containerClassName = useEmotionCss(() => {
    return {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'auto',
      backgroundImage:
        "url('https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/V-_oS6r-i7wAAAAAAAAAAAAAFl94AQBr')",
      backgroundSize: '100% 100%',
    };
  });

  //登录或注册
  const handleSubmit = async (values: any) => {
    console.log(values)

    switch (tab){
      case 'login':
        await login({
          username: values.username,
          password: values.password
        });

        break;
      case 'register':
        await register({
          registerUsername: values.registerUsername,
          registerPassword: values.registerPassword
        });break;
    }
  };


  return (
    <div className={containerClassName}>
      <Helmet>
        <title>{'登录'}-{Settings.title}</title>
      </Helmet>

      <div style={{flex: '1', padding: '32px 0',}}>
        <LoginForm
          formRef={formRef}
          contentStyle={{minWidth: 280, maxWidth: '75vw',}}
          logo={<img alt="logo" src="/logo.svg" />}
          title="图计算平台" subTitle={' '}
          initialValues={{autoLogin: true,}}
          onFinish={async (values) => {
            await handleSubmit(values as User.LoginParams);
          }}
          submitter={{
            searchConfig: {
              submitText: tab === 'login' ? '登录' : '注册', // 在这里设置提交按钮文字
            },
          }}
        >
          <Tabs
            activeKey={tab}
            onChange={setTab}
            centered
            items={[{key: 'login', label: '登录'}, {key: 'register', label: '注册'}]}
          />

          {
            tab === 'login' && (
              <>
                <ProFormText
                  name="username"
                  fieldProps={{size: 'large', prefix: <UserOutlined />,}}
                  placeholder={'用户名'}
                  rules={[
                    {
                      required: true,
                      message: '用户名是必填项！',
                    },
                  ]}
                />

                <ProFormText.Password
                  name="password"
                  fieldProps={{size: 'large', prefix: <LockOutlined />,}}
                  placeholder={'密码'}
                  rules={[
                    {
                      required: true,
                      message: '密码是必填项！',
                    },
                  ]}
                />

                <div style={{marginBottom: 24}}>
                  <ProFormCheckbox noStyle>
                    自动登录
                  </ProFormCheckbox>
                  <a onClick={()=>{message.info('功能待完善')}} style={{float: 'right',}}>忘记密码 ?</a>
                </div>
              </>
            ) ||
            tab === 'register' && (
              <>
                <ProFormText
                  name="registerUsername"
                  fieldProps={{size: 'large', prefix: <UserOutlined />,}}
                  placeholder={'用户名'}
                  rules={[
                    {
                      required: true,
                      message: '用户名是必填项！',
                    },
                  ]}
                />

                <Popover
                  getPopupContainer={(node) => {
                    if (node && node.parentNode) {
                      return node.parentNode as HTMLElement;
                    }
                    return node;
                  }}
                  content={
                    modalVisible && (
                      <div style={{ padding: '4px 0' }}>
                        {passwordStatusMap[getPasswordStatus()]}
                        {renderPasswordProgress()}
                        <div style={{ marginTop: 10 }}>
                          <span>请至少输入 6 个字符。请不要使用容易被猜到的密码。</span>
                        </div>
                      </div>
                    )
                  }
                  overlayStyle={{ width: 240 }}
                  placement="right"
                  open={modalVisible}
                >
                  <ProFormText.Password
                    name="registerPassword"
                    fieldProps={{
                      size: 'large',
                      prefix: <LockOutlined className={'prefixIcon'} />,
                    }}
                    placeholder={'密码至少6个字符'}
                    rules={[{validator: checkPassword}]}
                    required={true}
                  />
                </Popover>

                <ProFormText.Password
                  name="confirm"
                  fieldProps={{
                    size: 'large',
                    prefix: <LockOutlined className={'prefixIcon'} />,
                  }}
                  placeholder={'确认密码'}
                  rules={[{validator: checkConfirm}]}
                  required={true}
                />
              </>
            )
          }
        </LoginForm>
      </div>

      <Footer/>
    </div>
  );
};
export default Login;
