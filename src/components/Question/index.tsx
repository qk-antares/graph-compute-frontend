import {message} from "antd";
import {IconFont} from "@/utils/iconUtil";

export const Question = () => {
  return (
    <div
      onClick={() => {
        message.info('待完善')
      }}
    >
      <IconFont style={{fontSize: 18}} type='icon-wendang'/>
    </div>
  );
};
