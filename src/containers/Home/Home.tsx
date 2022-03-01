// @ts-nocheck
import { Input } from '@material-ui/core';
import { Button } from '@mui/material';
import React from 'react';
import SockJsClient from 'react-stomp';
import './Home.scss';

export const Home = () => {
  const clientRef = React.useRef();
  const [msg, setMsg] = React.useState();
  const [messages, setMessages] = React.useState([]);
  let onConnected = () => {
    console.log('Connected!!');
  };

  let onMessageReceived = (m) => {
    setMessages([...messages, m]);
  };

  const handleSubmit = () => {
    clientRef.current.sendMessage('/Messages', msg);
    setMsg('');
  };

  return (
    <div className="home">
      <Input
        placeholder="Input something"
        value={msg}
        onChange={(e) => {
          setMsg(e.target.value);
          console.log(msg);
        }}
      ></Input>
      <Button onClick={handleSubmit}>Submit</Button>
      <h4>Server response</h4>
      {messages.map((m, i) => (
        <div key={i}>{m}</div>
      ))}
         <SockJsClient
        url={process.env.REACT_APP_WEB_SOCKET_MESSAGES}
        topics={['/Messages']}
        onConnet={onConnected}
        onDisconnect={() => console.log('Disconnected')}
        onMessage={onMessageReceived}
        debug={true}
        ref={(client) => (clientRef.current = client)}
      />
    </div>
  );
};
