import {
  closeWindow,
  maximizeWindow,
  minimizeWindow,
} from "@/components/window_helpers";
import React, { type ReactNode } from "react";

interface DragWindowRegionProps {
  title?: ReactNode;
}

export default function DragWindowRegion({ title }: DragWindowRegionProps) {
  return (
    <div className="flex w-screen items-stretch justify-between">
      <div className="draglayer w-full" />
    </div>
  );
}
