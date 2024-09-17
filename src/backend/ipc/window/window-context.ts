import {
  WIN_MINIMIZE_CHANNEL,
  WIN_MAXIMIZE_CHANNEL,
  WIN_CLOSE_CHANNEL,
  AGENT_CHANNEL,
} from "./window-channels";

export function exposeWindowContext() {
  const { contextBridge, ipcRenderer } = window.require("electron");
  contextBridge.exposeInMainWorld("electronWindow", {
    minimize: () => ipcRenderer.invoke(WIN_MINIMIZE_CHANNEL),
    maximize: () => ipcRenderer.invoke(WIN_MAXIMIZE_CHANNEL),
    close: () => ipcRenderer.invoke(WIN_CLOSE_CHANNEL),
    agent: (message: string) => ipcRenderer.invoke(AGENT_CHANNEL, message),
    saveWidgets: (widgets: any) => ipcRenderer.invoke("save-widgets", widgets),
    loadWidgets: () => ipcRenderer.invoke("load-widgets"),
    saveCanvasState: (canvasState: any) =>
      ipcRenderer.invoke("save-canvas-state", canvasState),
    loadCanvasState: () => ipcRenderer.invoke("load-canvas-state"),
    sendMessage: (message: any) => ipcRenderer.invoke("send-message", message),
    onAgentResponse: (callback: (event: any, content: string) => void) =>
      ipcRenderer.on("agent-response", callback),
    onceAgentResponseEnd: (callback: () => void) =>
      ipcRenderer.once("agent-response-end", callback),
    onAgentError: (callback: (event: any, error: string) => void) =>
      ipcRenderer.on("agent-error", callback),
  });
}
