export async function saveWidgets(widgets: any, canvasId: string) {
  await window.electronWindow.saveWidgets(widgets, canvasId);
}
export async function loadWidgets(canvasId: string): Promise<any> {
  return await window.electronWindow.loadWidgets(canvasId);
}

interface CanvasState {
  zoom: number;
  pan: { x: number; y: number };
}

export const saveCanvasState = async (
  canvasState: CanvasState,
  canvasId: string
) => {
  try {
    await window.electronWindow.saveCanvasState(canvasState, canvasId);
  } catch (error) {
    console.error("Failed to save canvas state:", error);
  }
};

export const loadCanvasState = async (
  canvasId: string
): Promise<CanvasState | null> => {
  try {
    const canvasState = await window.electronWindow.loadCanvasState(canvasId);
    return canvasState;
  } catch (error) {
    console.error("Failed to load canvas state:", error);
    return null;
  }
};
