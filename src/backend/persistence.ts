import {app, ipcMain} from "electron";
import path from "path";
import fs from "fs";

const version = "v2"

function userDataLocation() {
    const userDataPath = app.getPath("userData");
    const storagePath = path.join(userDataPath, version);
    fs.mkdirSync(storagePath, {recursive: true});
    return storagePath
}

export function registerPersistenceListeners() {
    ipcMain.handle("save-widgets", (event, widgets) => {

        const filePath = path.join(userDataLocation(), "widgets.json");
        fs.writeFileSync(filePath, JSON.stringify(widgets), "utf-8");
    });
    ipcMain.handle("load-widgets", (event) => {
        const filePath = path.join(userDataLocation(), "widgets.json");
        try {
            const data = fs.readFileSync(filePath, "utf-8");
            return JSON.parse(data);
        } catch (error) {
            console.error("Error loading widgets:", error);
            return null;
        }
    });

    ipcMain.handle("save-canvas-state", async (_, canvasState) => {
        try {
            fs.writeFileSync(
                path.join(userDataLocation(), "canvasState.json"),
                JSON.stringify(canvasState)
            );
        } catch (error) {
            console.error("Failed to save canvas state:", error);
        }
    });

    ipcMain.handle("load-canvas-state", async () => {
        try {
            const data = fs.readFileSync(
                path.join(userDataLocation(), "canvasState.json"),
                "utf-8"
            );
            return JSON.parse(data);
        } catch (error) {
            console.error("Failed to load canvas state:", error);
            return null;
        }
    });
}