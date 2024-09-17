import { HelpCircle, Play, Plus, Settings, ZoomIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import React from "react";

export function Header(props: { zoom: number; onNewCanvas: () => void }) {
  return (
    <div className="absolute draglayer top-0 left-0 right-0 z-10 bg-gray-900 border-b border-gray-800">
      <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
        <div className="flex items-center space-x-2"></div>
        <div className="flex space-x-2 non-draggable">
          <div className="flex items-center space-x-2">
            <ZoomIn className="h-4 w-4 text-gray-300" />
            <span className="text-sm text-gray-300">
              {Math.round(props.zoom * 100)}%
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-300 hover:text-white hover:bg-gray-800"
            aria-label="Create new canvas"
            onClick={props.onNewCanvas}
          >
            <Plus className="h-4 w-4" />
            <span className="sr-only">New canvas</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-300 hover:text-white hover:bg-gray-800"
            aria-label="Play"
          >
            <Play className="h-4 w-4" />
            <span className="sr-only">Play</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-300 hover:text-white hover:bg-gray-800"
            aria-label="Settings"
          >
            <Settings className="h-4 w-4" />
            <span className="sr-only">Settings</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-300 hover:text-white hover:bg-gray-800"
            aria-label="Help"
          >
            <HelpCircle className="h-4 w-4" />
            <span className="sr-only">Help</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
