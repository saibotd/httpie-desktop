import path from "path";
import BrowserWinHandler from "./BrowserWinHandler";
import Menu from "electron-create-menu";
import ipc from "./ipc";
import Config from "./Config";
import Database from "./Database";
import routes from "./routes";
const isDev = process.env.NODE_ENV === "development";

const INDEX_PATH = path.join(__dirname, "..", "renderer", "index.html");
const DEV_SERVER_URL = process.env.DEV_SERVER_URL; // eslint-disable-line prefer-destructuring

const winHandler = new BrowserWinHandler({
  title: "HTTPie",
  backgroundColor: "#111",
  height: 600,
  width: 1000,
  icon: path.join(__dirname, "../../", "build/icons/512x512.png")
});

winHandler.onCreated(async browserWindow => {
  await Config.loadConfig();
  const connection = await Database(Config.config);
  routes(connection);
  if (isDev) browserWindow.loadURL(DEV_SERVER_URL);
  else browserWindow.loadFile(INDEX_PATH);
  Menu((defaultMenu, separator) => {
    defaultMenu[1].submenu = [
      {
        label: "Projects",
        click: () => ipc.callRenderer(browserWindow, "get:projects")
      },
      {
        label: "Settings",
        click: () => ipc.callRenderer(browserWindow, "get:settings")
      }
    ].concat(defaultMenu[1].submenu);

    return defaultMenu;
  });
});

export default winHandler;
