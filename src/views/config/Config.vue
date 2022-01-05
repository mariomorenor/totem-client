<template>
  <div class="p-5">
    <b-field label="IP del Servidor" label-position="on-border">
      <b-input
        v-model="ip"
        placeholder="Ingresa la IP del Tótem Estación"
      ></b-input>
    </b-field>
    <b-field label="Puerto" label-position="on-border">
      <b-input v-model="port" placeholder="Ingresa el puerto"></b-input>
    </b-field>
    <b-field label="Webcam"  label-position="on-border">
      <b-select icon="video" placeholder="Seleccione una webcam" rounded>
        <template v-if="webcams.length > 0">
          <option
            v-for="webcam in webcams"
            :key="webcam.id"
            :value="webcam.deviceId"
          >
            {{ webcam.label }}
          </option>
        </template>
        <template>
          <option value="null" disabled>
            No existen Webcams Disponibles :'c
          </option>
        </template>
      </b-select>
    </b-field>
    <b-field label="Micrófono" label-position="on-border">
      <b-select icon="microphone-alt" placeholder="Seleccione un microfóno" rounded>
        <template v-if="microphones.length > 0">
          <option
            v-for="microphone in microphones"
            :key="microphone.id"
            :value="microphone.deviceId"
          >
            {{ microphone.label }}
          </option>
        </template>
        <template>
          <option value="null" disabled>
            No existen Micrófonos Disponibles :c
          </option>
        </template>
      </b-select>
    </b-field>
    <b-button @click="saveConfig()" icon-left="user" type="is-success mr-3">Guardar</b-button>
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
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.ip = storage.get("socket_ip");
      this.port = storage.get("socket_port");

      // get Devices
      this.webcams = [];
      this.microphones = [];
      navigator.mediaDevices.enumerateDevices().then(function (devices) {
        for (var i = 0; i < devices.length; i++) {
          var device = devices[i];
          console.log(device);
          if (device.kind === "videoinput") {
            this.webcams.push(device);
          }
          if (device.kind === "audioinput") {
            this.microphones.push(device);
          }
        }
      });
    },
    closeWindow() {
      window.close();
    },
    saveConfig() {
      storage.set("socket_ip", `${this.ip}`);
      storage.set("socket_port", `${this.port}`);
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
            ipcRenderer.send("reload-main-window");
            window.close();
          }
        });
    },
  },
};
</script>