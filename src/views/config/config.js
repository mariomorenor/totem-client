import Vue from "vue";
import App from "./Config.vue";

Vue.config.productionTip = false;

import Buefy from "buefy";
import "buefy/dist/buefy.min.css";

import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(fas);

Vue.component("fa", FontAwesomeIcon);

Vue.use(Buefy, {
  defaultIconPack: "fas",
  defaultIconComponent: "fa",
});


new Vue({
  render: (h) => h(App),
}).$mount("#app");
