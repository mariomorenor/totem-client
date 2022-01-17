<template>
  <div class="home">
    <video
      id="video-promocion"
      autoplay
      muted
      loop
      :src="'file://' + videos[0]"
    ></video>
    <video v-show="callInProgress" id="streaming"></video>
  </div>
</template>

<script>
const { app } = require("@electron/remote");
const fs = require("fs");
const path = require("path");
const Store = require("electron-store");
const storage = new Store();
const Mousetrap = require("mousetrap");
const loudness = require("loudness");
loudness.setVolume(10)
// eslint-disable-next-line no-undef
var peerJS = new Peer();
export default {
  name: "Home",
  data() {
    return {
      videos: [],
      estado: "promocion",
      nombre: "",
      webcam: "",
      microphone: "",
      peer_id: "",
      callInProgress: false,
      call: "",
      volume: 0,
    };
  },
  sockets: {
    stop_streaming() {
      this.call.close();
      this.callInProgress = false;
    },
    reconnect() {
      this.getDiscovered();
    },
    reloadTotem() {
      window.location.reload();
    },
  },
  beforeMount() {
    loudness.getVolume().then((vol) => {
      this.volume = vol;
    });
    this.init();
  },
  mounted() {
    this.getDiscovered();
  },
  methods: {
    init() {
      this.nombre = storage.get("nombre");
      this.webcam = storage.get("webcam_id");
      this.microphone = storage.get("microphone_id");
      this.getVideos();
      this.ready();

      Mousetrap.bind(
        "enter",
        () => {
          if (!this.callInProgress) {
            this.$socket.emit("callServer", {
              nombre: this.nombre,
              socket_id: this.$socket.id,
            });
          }
        },
        "keyup"
      );
    },
    getVideos() {
      let videosPath = app.getPath("videos");
      this.videos = fs
        .readdirSync(videosPath)
        .filter((v) => path.extname(v) == ".mp4")
        .map((v) => path.join(videosPath, v));
    },
    getDiscovered() {
      setTimeout(() => {
        this.peer_id = peerJS.id;
        this.$socket.emit("nuevo-totem", {
          nombre: this.nombre,
          estado: this.estado,
          socket_id: this.$socket.id,
          peer_id: peerJS.id,
          videos: this.videos,
          callInProgress: this.callInProgress,
          lost_call: false,
          volume: this.volume,
        });
      }, 1000);
    },
    ready() {
      let self = this;
      peerJS.on("call", (call) => {
        navigator.mediaDevices
          .getUserMedia({
            video: {
              deviceId: self.webcam,
            },
            audio: {
              deviceId: self.microphone,
            },
          })
          .then((stream) => {
            call.answer(stream);
            self.call = call.on("stream", (remoteStream) => {
              let remoteVideo = document.getElementById("streaming");
              remoteVideo.srcObject = remoteStream;
              remoteVideo.play();
              self.callInProgress = true;
            });
          });
      });
    },
  },
};
</script>

<style lang="scss">
body {
  margin: 0;
  overflow: hidden;
  background: black;
}

#video-promocion {
  width: 100vw;
  height: 100vh;
  position: fixed;
  object-fit: fill;
}

#streaming {
  width: 100vw;
  height: 100vh;
  position: fixed;
  object-fit: fill;
  z-index: 1000;
}
</style>