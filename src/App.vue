<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
const Mousetrap = require("mousetrap");
const { ipcRenderer } = require("electron");
const loudness = require("loudness");
export default {
  mounted() {
    this.init();
  },
  sockets: {
    changeVolume(vol) {
      console.log("simon posi", vol);
      loudness.setVolume(vol);
    },
  },
  methods: {
    init() {
      Mousetrap.bind("alt+c", () => {
        ipcRenderer.send("show-config-window");
      });
    },
  },
};
</script>

<style>
.app::-webkit-scrollbar {
  display: none;
}
.app {
  overflow: hidden;
}
body::-webkit-scrollbar {
  display: none;
}
</style>
