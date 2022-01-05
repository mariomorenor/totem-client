module.exports = {
    pluginOptions: {
      electronBuilder: {
        nodeIntegration: true,
      },
    },
    pages: {
      index: {
        entry: "src/main.js",
        template: "public/index.html",
      },
      config: {
        entry: "src/views/config/config.js",
        template: "public/index.html",
      },
    },
  };