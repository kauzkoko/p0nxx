import OSC from "osc-js";

export const useOSC = () => {
  const osc = ref();
  const send = ref();
  const on = ref();
  const bang = ref();

  onMounted(() => {
    osc.value = new OSC();
    osc.value.open();
    console.log("osc client opened");
  });

  on.value = (address, callback) => {
    console.log("on called");
    osc.value.on(address, (message) => {
      callback(message);
    });
  };

  bang.value = (address) => {
    let message = new OSC.Message(address);
    osc.value.send(message);
  };

  send.value = (address, content) => {
    let message = new OSC.Message(address, content);
    osc.value.send(message);
  };

  return { osc, on, send, Message: OSC.Message, bang };
};
