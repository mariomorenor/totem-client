<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
const Mousetrap = require("mousetrap");
const { ipcRenderer } = require("electron");

export default {
  mounted() {
    this.init();
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
.app{
  overflow: hidden;
}
body::-webkit-scrollbar {
  display: none;
}
</style>
