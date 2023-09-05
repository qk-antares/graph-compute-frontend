import {message, Select} from "antd";
import {useState} from "react";

export const Storage = () => {
  const [storageType, setStorageType] = useState<string>('local')

  const handleChange = (value: string) => {
    if(value === 'cloud'){
      message.info('待后端功能完善！')
    }
  };

  return (
    <Select
      size='small'
      value={storageType}
      onChange={handleChange}
      options={[
        { value: 'local', label: '本地存储' },
        { value: 'cloud', label: '云端存储' },
      ]}
    />
  );
};
