import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { WidgetType } from "@/components/Widget";

export default function HoverWidgetControls(props: {
  handleDeleteWidget: (widget: WidgetType) => void;
  createNewWidget: (x: number, y: number, groupId: string) => void;
  canvasRef: React.RefObject<HTMLDivElement>;
  widget: WidgetType;
  zoom: number;
  pan: { x: number; y: number };
}) {
  const { handleDeleteWidget, createNewWidget, canvasRef, widget, zoom, pan } =
    props;

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="absolute -top-4 -right-4 h-8 w-8 p-1 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-100"
        onClick={(e) => {
          e.stopPropagation();
          handleDeleteWidget(widget);
        }}
        aria-label="Delete widget"
      >
        <Trash2 className="h-4 w-4 text-red-500" />
      </Button>
      <div
        className="absolute left-0 right-0 bottom-0 h-8 bg-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        aria-hidden="true"
      >
        <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-full mt-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 bg-white rounded-full shadow-md cursor-pointer hover:bg-gray-100 transition-colors duration-200"
            onClick={(e) => {
              e.stopPropagation();
              const rect = (e.target as HTMLElement).getBoundingClientRect();
              const x =
                (rect.left +
                  rect.width / 2 -
                  canvasRef.current!.getBoundingClientRect().left) /
                  zoom -
                pan.x;
              const y =
                (rect.bottom - canvasRef.current!.getBoundingClientRect().top) /
                  zoom -
                pan.y;
              createNewWidget(x, y, widget.groupId);
            }}
            aria-label="Add new widget"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </>
  );
}
