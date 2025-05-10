module.exports = {
  apps: [{
    name: "headplane-server",
    script: "./build/headplane/server.js",
    env: {
      LOAD_ENV_FILE: "true"
    }
  }]
}
