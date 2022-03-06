import { Client } from '@stomp/stompjs';
import React from 'react';

const currentUserKey = 'classroom@current_user';

export const useSocket = (channel: string, wsURL: string): string => {
  const client = React.useRef<Client | null>(null);
  const [isConnecting, setConnecting] = React.useState(false);
  const [lastMessage, setLastMessage] = React.useState<string>('');

  const handleConnect = () => {
    if (isConnecting) return;

    if (client.current) {
      client.current.unsubscribe(`/user/${channel}`);
    }

    client.current = new Client({
      brokerURL: wsURL,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: (frame) => {
        client.current?.publish({
          destination: `/${channel}`,
          body: JSON.stringify({
            channel: 'JOIN',
            data: {
              username: localStorage.getItem(currentUserKey),
              sender: localStorage.getItem('user_id') ?? (0 as number),
            },
          }),
        });

        client.current?.subscribe('/user/' + channel, (message) => {
          setLastMessage(message.body);
          console.log(message.body);
        });
        setConnecting(false);
      },
      debug: console.log,
      onStompError: console.error,
    });
    client.current.activate();
    setConnecting(true);
  };

  React.useEffect(() => {
    handleConnect();
    const disconnect = () => {
      if (client.current) {
        client.current.publish({
          destination: '/' + channel,
          body: JSON.stringify({
            channel: 'DISCONNECT',
            data: {
              username: localStorage.getItem(currentUserKey),
            },
          }),
        });
        client.current.deactivate();
      }
    };
    window.addEventListener('beforeunload', disconnect);
    return () => {
      window.removeEventListener('beforeunload', disconnect);
    };
  }, []);
  return lastMessage;
};
