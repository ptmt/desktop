// This allows TypeScript to pick up the magic constants that's auto-generated by Forge's Vite
// plugin that tells the Electron app where to look for the Vite-bundled app code (depending on
// whether you're running in development or production).
declare const MAIN_WINDOW_VITE_DEV_SERVER_URL: string;
declare const MAIN_WINDOW_VITE_NAME: string;

// Preload types
interface ThemeModeContext {
  toggle: () => Promise<boolean>;
  dark: () => Promise<void>;
  light: () => Promise<void>;
  system: () => Promise<boolean>;
  current: () => Promise<"dark" | "light" | "system">;
}
interface ElectronWindow {
  minimize: () => Promise<void>;
  maximize: () => Promise<void>;
  close: () => Promise<void>;
  agent: (prompt: string) => Promise<void>;
  saveWidgets: (widgets: any, canvasId: string) => Promise<void>;
  loadWidgets: (canvasId: string) => Promise<any>;
  saveCanvasState: (canvasState: any, canvasId: string) => Promise<void>;
  loadCanvasState: (canvasId: string) => Promise<any>;
  sendMessage: (message: any) => Promise<void>;
  onAgentResponse: (callback: (event: any, content: string) => void) => void;
  onceAgentResponseEnd: (callback: () => void) => void;
  onAgentError: (callback: (event: any, error: string) => void) => void;
}

declare interface Window {
  themeMode: ThemeModeContext;
  electronWindow: ElectronWindow;
}
