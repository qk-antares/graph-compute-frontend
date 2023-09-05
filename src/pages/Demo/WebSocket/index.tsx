import React, { useEffect, useState } from "react";
import { Stomp } from "@stomp/stompjs";

const WebSocket = () => {
  const [hardwareStatus, setHardwareStatus] = useState({});

  useEffect(() => {
    const stompClient = Stomp.client("ws://localhost:8123/hardware-status");

    stompClient.connect({}, () => {
      stompClient.subscribe("/topic/hardware-status", message => {
        console.log(message)
        const newHardwareStatus = JSON.parse(message.body);
        setHardwareStatus(newHardwareStatus);
      });
    });

    return () => {
      stompClient.disconnect();
    };
  }, []);

  return (
    <div>

    </div>
  );
};

export default WebSocket;
