import { app } from "electron";
import path from "path";
import { promises as fs, constants } from "fs";
import { clone, merge } from "lodash";

const configFile = path.join(
  app.getPath("appData"),
  "httpie-desktop.config.json"
);
const defaultConfig = {
  connection: {
    dbtype: "sqljs"
  },
  sqljs: {
    location: path.join(app.getPath("appData"), "httpie-desktop.db.sqlite"),
    autoSave: true
  },
  mysql: {
    host: "localhost",
    port: 3306,
    database: "httpie-desktop",
    username: "",
    password: ""
  },
  autoRun: true,
  saveOnRun: true,
  binPath: "http"
};

class Config {
  constructor() {
    this.config = clone(defaultConfig);
    this.loadConfig();
  }
  async loadConfig() {
    try {
      const config = JSON.parse(await fs.readFile(configFile));
      merge(this.config, config);
    } catch (err) {
      console.error(err);
    }
  }
  async saveConfig() {
    try {
      await fs.writeFile(configFile, JSON.stringify(this.config));
    } catch (err) {
      console.error(err);
    }
  }
  async update(config) {
    merge(this.config, config);
  }
}

export default new Config();
