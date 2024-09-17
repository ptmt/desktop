import { app, BrowserWindow } from "electron";
import { addThemeEventListeners } from "./theme/theme-listeners";
import { addWindowEventListeners } from "./window/window-listeners";
import { ipcMain } from "electron";
import { registerPersistenceListeners } from "@/backend/persistence"

const fs = require("fs");
const path = require("path");

export default function registerListeners(mainWindow: BrowserWindow) {
  addWindowEventListeners(mainWindow);
  addThemeEventListeners();
  registerPersistenceListeners();
}


