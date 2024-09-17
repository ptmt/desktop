import React from "react";
import { InfiniteCanvas } from "@/components/infinite-canvas";
import { v4 as uuidv4 } from "uuid";
import { Onboarding } from "@/components/onboarding";

export default function HomePage() {
  const [canvasId, setCanvasId] = React.useState(() => {
    const savedCanvasId = localStorage.getItem("canvasId");
    return savedCanvasId || uuidv4();
  });

  React.useEffect(() => {
    localStorage.setItem("canvasId", canvasId);
  }, [canvasId]);

  const [showCanvasOnboarding, setShowCanvasOnboarding] = React.useState(() => {
    const savedOnboardingState = localStorage.getItem(
      `showCanvasOnboarding_${canvasId}`
    );
    return savedOnboardingState ? JSON.parse(savedOnboardingState) : true;
  });

  React.useEffect(() => {
    localStorage.setItem(
      `showCanvasOnboarding_${canvasId}`,
      JSON.stringify(showCanvasOnboarding)
    );
  }, [showCanvasOnboarding, canvasId]);

  return (
    <>
      {showCanvasOnboarding && (
        <Onboarding
          openFolder={() => {
            setShowCanvasOnboarding(false);
          }}
        />
      )}
      {!showCanvasOnboarding && (
        <InfiniteCanvas
          canvasId="canvasId"
          onNewCanvas={(newCanvasId) => {
            setShowCanvasOnboarding(true);
            setCanvasId(newCanvasId);
          }}
        />
      )}
    </>
  );
}
