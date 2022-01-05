import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import VueSocketIO from "vue-socket.io";

Vue.config.productionTip = false;

const Store = require("electron-store");
const storage = new Store();

let socket_port = storage.get("socket_port");
let socket_ip = storage.get("socket_ip");

Vue.use(
  new VueSocketIO({
    debug: true,
    connection: `http://${socket_ip}:${socket_port}`,
    // vuex: {
    //   store,
    //   actionPrefix: "SOCKET_",
    //   mutationPrefix: "SOCKET_",
    // },
  })
);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
