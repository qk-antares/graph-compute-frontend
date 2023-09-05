import { Line } from '@ant-design/charts';
import React from 'react';

const Bandwidth: React.FC = () => {
  const generateBandwidthData = () => {
    const data = [];

    // 获取当前时间
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    // 计算过去1小时内的时间戳
    let hour = currentHour;
    let minute = currentMinute;
    for (let i = 0; i < 60; i++) {
      minute -= 1;
      if (minute < 0) {
        hour -= 1;
        minute = 59;
      }

      // 生成模拟数据
      const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      const outBandwidth = Number((Math.random() * 10).toFixed(3));
      const inBandwidth = Number((Math.random() * 10).toFixed(3));

      data.unshift({ time, value: outBandwidth, type: '出' }); // 将数据插入到数组的开头，确保数据按时间递增排序
      data.unshift({time, value: inBandwidth, type: '入'})
    }
    return data;
  };

  const data = generateBandwidthData();

  console.log(data)

  const config = {
    legend: false,
    seriesField: 'type',
    responsive: true,


    width: 242,
    height: 80,
    yAxis: {
      tickCount: 3
    },
    title: {
      visible: true,
      text: 'CPU利用率',
    },
    description: {
      visible: true,
      text: '用平滑的曲线代替折线\u3002',
    },
    forceFit: true,
    data,
    xField: 'time',
    yField: 'value',
    smooth: true,
  };

  // @ts-ignore
  return <Line {...config}/>;
};

export default Bandwidth;
