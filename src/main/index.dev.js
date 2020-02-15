import { Menu, MenuItem, app } from "electron";
import electronDebug from "electron-debug";
import vueDevtools from "vue-devtools";
import { ELECTRON_RELAUNCH_CODE } from "../../.electron-nuxt/config";
import mainWinHandler from "./mainWindow";
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = "true";

electronDebug({
  showDevTools: false,
  devToolsMode: "right"
});

app.on("ready", () => {
  vueDevtools.install();
});

mainWinHandler.onCreated(browserWindow => {
  browserWindow.webContents.openDevTools();
});

// Require `main` process to boot app
import("./index");
