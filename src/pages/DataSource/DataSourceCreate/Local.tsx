import { FileAddOutlined } from '@ant-design/icons';
import { Alert, Button, message, UploadProps } from 'antd';
import Dragger from 'antd/es/upload/Dragger';
import React, {useState} from 'react';
import {downloadCaseData} from "@/utils/exampleData";

const Local: React.FC = () => {
  const [jsonBlob, setJsonBlob] = useState();

  const props: UploadProps = {
    accept: "'application/json'",
    action: "http://upload.qiniup.com",
    multiple: false,
    maxCount: 1,
    name: 'file',
    onChange(info) {
      const { status } = info.file;
      if (status === 'done') {
        message.success(`${info.file.name} 文件上传成功`);
      } else if (status === 'error') {
        message.error(`${info.file.name} 文件上传失败`);
      }
    },

    beforeUpload: (file) => {
      message.info('后期搭配OSS实现上传')
      return false
    },
  };

  //文件上传
  const upload = async () => {
    //向后端请求OSS平台的token和key
    // const res = await policy();
    // if(res.code === 200){
    //
    // }
  }

  return (
    <>
      <Alert
        message="JSON 文件规范：点边数据必须放在同一个 JSON 文件中上传，nodes 表示点的集合，edges 表示边的集合"
        type="info"
        showIcon
        closable
        action={
          <Button
            size="small" type="primary"
            onClick={()=>downloadCaseData('ds_e8d0efbf-d839-4480-8540-aea2e0326066')}
          >
            下载示例数据
          </Button>
        }
      />
      <h4 style={{ marginTop: 10 }}>上传数据</h4>

      <Dragger {...props}>
        <p className="ant-upload-drag-icon">
          <FileAddOutlined />
        </p>
        <p className="ant-upload-hint">
          点击或将数据文件拖拽到这里上传，支持JSON格式
        </p>
      </Dragger>

      <div style={{ padding: '30px 0px 10px', display: 'flex', justifyContent: 'center' }}>
        <Button onClick={upload} type="primary" shape="round" disabled>
          进入下一步
        </Button>
      </div>
    </>
  );
};

export default Local;
