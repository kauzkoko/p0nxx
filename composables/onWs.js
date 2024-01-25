export const onWs = (cb) => {
  useWebSocket("ws://localhost:8081", {
    onMessage: (ws, { data }) => {
      let parsed = JSON.parse(data);
      cb(parsed);
    },
  });
};
