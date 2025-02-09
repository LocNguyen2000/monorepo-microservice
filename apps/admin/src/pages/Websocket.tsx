import { CheckCircleOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { FunctionComponent, useEffect, useRef, useState } from "react";

interface IWebSocketProps {
    url?: string
}

const WebSocketComponent: FunctionComponent<IWebSocketProps>= (props) => {
  const {url} = props

  console.log('Connecting to websocket URL', url);
  

  if (!url) return;
  const socket = useRef<WebSocket>(null);
  const [messages, setMessages] = useState([]);
  
  useEffect(() => {
    socket.current = new WebSocket(url)

    socket.current.onopen = () => {
      console.log("WebSocket connected");
      socket.current.send(JSON.stringify({ event: "message", data: "Hello from React" }));
    };

    socket.current.onmessage = (event) => {
      console.log("Message from server:", event.data);
      setMessages((prev) => [...prev, event.data]);
    };

    socket.current.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    socket.current.onclose = () => {
      console.log("WebSocket disconnected");
    };

    return () => {
      socket.current.close();
    };
  }, []);
  return (
    <div>Đồng bộ dữ liệu: {socket?.current?.readyState === WebSocket.OPEN ? 
        <CheckCircleOutlined size={12} style={{color: 'green'}}/> : 
        <ExclamationCircleOutlined size={12} style={{color: 'yellow'}}/> }
    </div>
  );
};

export default WebSocketComponent;
