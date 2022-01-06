<template>
  <div class="px-5 py-5 app">
    <h1 class="mb-3">Configuración del Tótem</h1>
    <b-field label="IP del Servidor" label-position="on-border">
      <b-input
        v-model="ip"
        placeholder="Ingresa la IP del Tótem Estación"
      ></b-input>
    </b-field>
    <b-field label="Puerto" label-position="on-border">
      <b-input v-model="port" placeholder="Ingresa el puerto"></b-input>
    </b-field>
    <b-field label="Webcam" label-position="on-border">
      <b-select
        @change.native="previewWebcam({ webcam_selected })"
        v-model="webcam_selected"
        icon="video"
        placeholder="Seleccione una webcam"
        rounded
      >
        <template v-if="webcams.length > 0">
          <option
            v-for="webcam in webcams"
            :key="webcam.id"
            :value="webcam.deviceId"
          >
            {{ webcam.label }}
          </option>
        </template>
        <template v-else>
          <option value="null" disabled>
            No existen Webcams Disponibles :'c
          </option>
        </template>
      </b-select>
    </b-field>
    <b-field label="Micrófono" label-position="on-border">
      <b-select
      @change.native="previewSound({microphone_selected})"
        v-model="microphone_selected"
        icon="microphone-alt"
        placeholder="Seleccione un microfóno"
        rounded
      >
        <template v-if="microphones.length > 0">
          <option
            v-for="microphone in microphones"
            :key="microphone.id"
            :value="microphone.deviceId"
          >
            {{ microphone.label }}
          </option>
        </template>
        <template v-else>
          <option value="null" disabled>
            No existen Micrófonos Disponibles :c
          </option>
        </template>
      </b-select>
    </b-field>
    <video id="webcam_preview"></video>
    <audio id="sound_preview"></audio>
    <b-button @click="saveConfig()" icon-left="user" type="is-success mr-3"
      >Guardar</b-button
    >
    <b-button @click="closeWindow()" type="is-danger">Cancelar</b-button>
  </div>
</template>

<script>
import { ipcRenderer } from "electron";
const { BrowserWindow, dialog } = require("electron").remote;
const Store = require("electron-store");
const storage = new Store();

export default {
  data() {
    return {
      ip: "",
      port: "",
      webcams: [],
      microphones: [],
      webcam_selected: "",
      microphone_selected: "",
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.ip = storage.get("socket_ip");
      this.port = storage.get("socket_port");
      this.webcam_selected = storage.get("webcam_id");
      this.microphone_selected = storage.get("microphone_id");

      // get Devices
      this.webcams = [];
      this.microphones = [];
      let self = this;
      this.previewWebcam({
        video_id: this.webcam_selected,
      });
      this.previewSound({
        audio_id:this.microphone_selected
      })
      navigator.mediaDevices.enumerateDevices().then(function (devices) {
        for (var i = 0; i < devices.length; i++) {
          var device = devices[i];
          if (device.kind === "videoinput") {
            self.webcams.push(device);
          }
          if (device.kind === "audioinput") {
            self.microphones.push(device);
          }
        }
      });
    },
    closeWindow() {
      window.close();
    },
    previewWebcam({ video_id }) {
      navigator.mediaDevices
        .getUserMedia({
          video: {
            deviceId: video_id,
            audio: false,
          },
        })
        .then((preview) => {
          let video = document.getElementById("webcam_preview");
          video.srcObject = preview;
          video.play();
        });
    },
    previewSound({ audio_id }) {
      navigator.mediaDevices.getUserMedia({ audio: { deviceId: audio_id } }).then(stream=>{
        let audio = document.getElementById("sound_preview");
        audio.srcObject = stream;
        audio.play();
      });
    },
    saveConfig() {
      dialog
        .showMessageBox(BrowserWindow.getFocusedWindow(), {
          title: "Cambiando Configuración",
          message: "¿Está seguro de aplicar los cambios?",
          type: "warning",
          buttons: ["Aceptar", "Cancelar"],
          noLink: true,
        })
        .then(({ response }) => {
          if (response == 0) {
            storage.set("socket_ip", `${this.ip}`);
            storage.set("socket_port", `${this.port}`);
            storage.set("webcam_id", this.webcam_selected);
            storage.set("microphone_id", this.microphone_selected);
            ipcRenderer.send("reload-main-window");
            window.close();
          }
        });
    },
  },
};
</script>


<style lang="scss" >

body::-webkit-scrollbar {
  display: none;
}

body{
  user-select: none;
}
</style>