"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

import {
  InputState,
  Widget,
  WidgetBase,
  WidgetType,
} from "@/components/Widget";
import { Header } from "@/components/Header";
import {
  saveWidgets,
  loadWidgets,
  saveCanvasState,
  loadCanvasState,
} from "./storage";
import HoverWidgetControls from "@/components/HoverWidgetControls";

// New type definitions
type WidgetGroup = {
  id: string;
  widgets: WidgetType[];
  position: { x: number; y: number };
};

export function InfiniteCanvas({
  canvasId,
  onNewCanvas,
}: {
  canvasId: string;
  onNewCanvas: any;
}) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [widgetGroups, setWidgetGroups] = useState<WidgetGroup[]>([]);
  const [draggingGroup, setDraggingGroup] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const textareaRefs = useRef<{ [key: string]: HTMLTextAreaElement }>({});

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault();
      const scaleFactor = 0.05;
      const newZoom =
        e.deltaY > 0 ? zoom * (1 - scaleFactor) : zoom * (1 + scaleFactor);
      const zoomDiff = newZoom - zoom;

      // Calculate the mouse position relative to the canvas
      const rect = canvasRef.current!.getBoundingClientRect();
      const mouseX = (e.clientX - rect.left) / zoom;
      const mouseY = (e.clientY - rect.top) / zoom;

      // Calculate the new pan position
      const newPanX = pan.x - mouseX * zoomDiff;
      const newPanY = pan.y - mouseY * zoomDiff;

      setZoom(Math.max(0.1, Math.min(5, newZoom)));
      setPan({ x: newPanX, y: newPanY });
    },
    [zoom, pan]
  );

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.target === canvasRef.current) {
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (isDragging) {
        const dx = (e.clientX - dragStart.x) / zoom;
        const dy = (e.clientY - dragStart.y) / zoom;
        setPan((prevPan) => ({ x: prevPan.x + dx, y: prevPan.y + dy }));
        setDragStart({ x: e.clientX, y: e.clientY });
      } else if (draggingGroup) {
        const dx = (e.clientX - dragStart.x) / zoom;
        const dy = (e.clientY - dragStart.y) / zoom;
        setWidgetGroups((prevGroups) =>
          prevGroups.map((group) =>
            group.id === draggingGroup
              ? {
                  ...group,
                  position: {
                    x: group.position.x + dx,
                    y: group.position.y + dy,
                  },
                }
              : group
          )
        );
        setDragStart({ x: e.clientX, y: e.clientY });
      }
    },
    [isDragging, draggingGroup, dragStart, zoom]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setDraggingGroup(null);
  }, []);

  const handleCanvasClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / zoom - pan.x;
        const y = (e.clientY - rect.top) / zoom - pan.y;
        const newGroupId = uuidv4();
        const newGroup: WidgetGroup = {
          id: newGroupId,
          position: { x, y },
          widgets: [
            {
              id: Date.now().toString(),
              type: "input",
              position: { x: 0, y: 0 }, // Relative to group
              value: "",
              isFocused: true,
              isLoading: false,
              isRemoving: false,
              isAnswered: false,
              groupId: newGroupId,
            },
          ],
        };
        setWidgetGroups((prevGroups) => [...prevGroups, newGroup]);
      }
    },
    [zoom, pan]
  );

  const handleInputChange = useCallback(
    (groupId: string, widgetId: string, value: string) => {
      setWidgetGroups((prevGroups) =>
        prevGroups.map((group) =>
          group.id === groupId
            ? {
                ...group,
                widgets: group.widgets.map((widget) =>
                  widget.id === widgetId && widget.type === "input"
                    ? { ...widget, value }
                    : widget
                ),
              }
            : group
        )
      );
    },
    []
  );

  const handleInputFocus = useCallback((groupId: string, widgetId: string) => {
    setWidgetGroups((prevGroups) =>
      prevGroups.map((group) =>
        group.id === groupId
          ? {
              ...group,
              widgets: group.widgets.map((widget) =>
                widget.id === widgetId && widget.type === "input"
                  ? { ...widget, isFocused: true }
                  : widget
              ),
            }
          : group
      )
    );
  }, []);

  const handleInputBlur = useCallback((groupId: string, widgetId: string) => {
    // TODO: solve the problem that the input blurs faster than the message is sent
    // console.log("handle input blur");
    // setWidgetGroups((prevGroups) =>
    //   prevGroups.map((group) =>
    //     group.id === groupId
    //       ? {
    //           ...group,
    //           widgets: group.widgets.map((widget) =>
    //             widget.id === widgetId && widget.type === "input" && !widget.isLoading
    //               ? { ...widget, isFocused: false }
    //               : widget
    //           ),
    //         }
    //       : group
    //   )
    // );
  }, []);

  const handleSendClick = useCallback(
    async (groupId: string, widgetId: string, value: string) => {
      console.log(groupId, widgetId, value);
      setWidgetGroups((prevGroups) =>
        prevGroups.map((group) =>
          group.id === groupId
            ? {
                ...group,
                widgets: group.widgets.map((widget) =>
                  widget.id === widgetId && widget.type === "input"
                    ? { ...widget, isLoading: true, isFocused: false }
                    : widget
                ),
              }
            : group
        )
      );

      const group = widgetGroups.find((g) => g.id === groupId)!;

      let responseText = "";
      const responseWidget: WidgetType = {
        id: uuidv4(),
        type: "answer",
        position: { x: 0, y: group.widgets.length * 50 }, // Position below the last widget
        content: "",
        isLoading: true,
        groupId: groupId,
      };

      setWidgetGroups((prevGroups) =>
        prevGroups.map((g) =>
          g.id === groupId
            ? { ...g, widgets: [...g.widgets, responseWidget] }
            : g
        )
      );

      window.electronWindow.sendMessage({
        message: value,
        chatId: groupId,
      });

      window.electronWindow.onAgentResponse((_, content) => {
        responseText += content;
        setWidgetGroups((prevGroups) =>
          prevGroups.map((group) =>
            group.id === groupId
              ? {
                  ...group,
                  widgets: group.widgets.map((widget) =>
                    widget.id === responseWidget.id
                      ? { ...widget, content: responseText }
                      : widget
                  ),
                }
              : group
          )
        );
      });

      window.electronWindow.onceAgentResponseEnd(() => {
        setWidgetGroups((prevGroups) =>
          prevGroups.map((group) =>
            group.id === groupId
              ? {
                  ...group,
                  widgets: group.widgets.map((widget) =>
                    widget.id === responseWidget.id
                      ? { ...widget, isLoading: false }
                      : widget.id === widgetId
                        ? { ...widget, isLoading: false }
                        : widget
                  ),
                }
              : group
          )
        );
      });

      window.electronWindow.onAgentError((_, errorMessage) => {
        console.error("Agent error:", errorMessage);
        setWidgetGroups((prevGroups) =>
          prevGroups.map((group) =>
            group.id === groupId
              ? {
                  ...group,
                  widgets: group.widgets.map((widget) =>
                    widget.id === widgetId
                      ? { ...widget, isLoading: false }
                      : widget
                  ),
                }
              : group
          )
        );
      });
    },
    [widgetGroups]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const rect = canvasRef.current!.getBoundingClientRect();
      const x = (e.clientX - rect.left) / zoom - pan.x;
      const y = (e.clientY - rect.top) / zoom - pan.y;

      if (e.dataTransfer.types.includes("Files")) {
        const file = e.dataTransfer.files[0];
        if (file) {
          const newFileBox: WidgetType = {
            id: Date.now().toString(),
            type: "file",
            position: { x, y },
            file,
            content: "",
            isLoading: true,
          };
          const reader = new FileReader();
          reader.onload = (event) => {
            const fileContent = event.target?.result as string;
            setWidgetGroups((prevGroups) =>
              prevGroups.map((group) =>
                group.widgets.some((widget) => widget.id === newFileBox.id)
                  ? {
                      ...group,
                      widgets: group.widgets.map((widget) =>
                        widget.id === newFileBox.id
                          ? {
                              ...newFileBox,
                              content: fileContent,
                              isLoading: false,
                            }
                          : widget
                      ),
                    }
                  : group
              )
            );
          };
          reader.readAsText(file);
          setWidgetGroups((prevGroups) =>
            prevGroups.map((group) =>
              group.widgets.some((widget) => widget.id === newFileBox.id)
                ? group
                : { ...group, widgets: [...group.widgets, newFileBox] }
            )
          );
        }
      } else {
        const droppedText = e.dataTransfer.getData("text");
        try {
          new URL(droppedText);
          const newUrlBox: WidgetType = {
            id: Date.now().toString(),
            type: "url",
            position: { x, y },
            url: droppedText,
            isLoading: true,
          };
          setWidgetGroups((prevGroups) =>
            prevGroups.map((group) =>
              group.widgets.some((widget) => widget.id === newUrlBox.id)
                ? group
                : { ...group, widgets: [...group.widgets, newUrlBox] }
            )
          );
          setTimeout(() => {
            setWidgetGroups((prevGroups) =>
              prevGroups.map((group) =>
                group.widgets.some((widget) => widget.id === newUrlBox.id)
                  ? {
                      ...group,
                      widgets: group.widgets.map((widget) =>
                        widget.id === newUrlBox.id
                          ? { ...widget, isLoading: false }
                          : widget
                      ),
                    }
                  : group
              )
            );
          }, 3000);
        } catch {
          const newInput: WidgetType = {
            id: Date.now().toString(),
            type: "input",
            position: { x, y },
            value: droppedText,
            isFocused: true,
            isLoading: false,
            isRemoving: false,
          };
          setWidgetGroups((prevGroups) =>
            prevGroups.map((group) =>
              group.widgets.some((widget) => widget.id === newInput.id)
                ? group
                : { ...group, widgets: [...group.widgets, newInput] }
            )
          );
        }
      }
    },
    [zoom, pan]
  );

  const handleOutsideClick = useCallback((event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (!canvasRef.current?.contains(target) || target === canvasRef.current) {
      setWidgetGroups((prevGroups) =>
        prevGroups.map((group) => ({
          ...group,
          widgets: group.widgets.map((widget) =>
            widget.type === "input" &&
            (widget as InputState).value.trim() === ""
              ? { ...widget, isRemoving: true }
              : widget.type === "input"
                ? { ...widget, isFocused: false }
                : widget
          ),
        }))
      );
      setTimeout(() => {
        setWidgetGroups((prevGroups) =>
          prevGroups.map((group) => ({
            ...group,
            widgets: group.widgets.filter(
              (widget) =>
                !(
                  widget.type === "input" &&
                  (widget as InputState).value.trim() === "" &&
                  (widget as InputState).isRemoving
                )
            ),
          }))
        );
      }, 300); // Match this with the CSS transition duration
    }
  }, []);

  const handleDeleteWidget = useCallback(
    (targetWidget: WidgetType) => {
      setWidgetGroups((prevGroups) =>
        prevGroups.map((group) => ({
          ...group,
          widgets: group.widgets.filter(
            (widget) => !(widget.id == targetWidget.id)
          ),
        }))
      );

      setWidgetGroups((prevGroups) =>
        prevGroups.filter((group) => !(group.widgets.length == 0))
      );
    },
    [widgetGroups]
  );

  const createNewConnectedWidget = useCallback(
    (x: number, y: number, groupId: string) => {
      console.log("create new connected widget", x, y, groupId);
      const newWidget: WidgetType = {
        id: Date.now().toString(),
        type: "input",
        position: { x, y },
        value: "",
        isFocused: true,
        isLoading: false,
        isRemoving: false,
        isAnswered: false,
        groupId: groupId,
      };
      setWidgetGroups((prevGroups) =>
        prevGroups.map((group) =>
          group.id === groupId
            ? { ...group, widgets: [...group.widgets, newWidget] }
            : group
        )
      );
    },
    [widgetGroups]
  );

  const handleNewCanvas = useCallback(() => {
    const newCanvasId = uuidv4();
    // Clear the current canvas
    setWidgetGroups([]);
    setZoom(1);
    setPan({ x: 0, y: 0 });
    // Save the empty state for the new canvas
    saveWidgets([], newCanvasId);
    saveCanvasState({ zoom: 1, pan: { x: 0, y: 0 } }, newCanvasId);
    onNewCanvas(newCanvasId);
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [handleOutsideClick]);

  useEffect(() => {
    window.addEventListener("mouseup", handleMouseUp);
    return () => window.removeEventListener("mouseup", handleMouseUp);
  }, [handleMouseUp]);

  const gridSize = 50;
  const gridOpacity = Math.max(0.02, Math.min(0.1, 0.15 - zoom * 0.02));

  // Load widgets and canvas state on component mount
  useEffect(() => {
    loadWidgets(canvasId).then((storedWidgets) => {
      if (storedWidgets) {
        const newWidgetGroups = storedWidgets.map(
          (widgetGroup: WidgetGroup) => {
            return {
              ...widgetGroup,
              widgets: widgetGroup.widgets.map((widget: WidgetBase) => {
                if (widget.type === "input") {
                  return { ...widget, isLoading: false };
                } else return widget;
              }),
            };
          }
        );
        setWidgetGroups(newWidgetGroups);
      }
    });

    loadCanvasState(canvasId).then((canvasState) => {
      if (canvasState) {
        setZoom(canvasState.zoom);
        setPan(canvasState.pan);
      }
    });
  }, [canvasId]);

  // Save widgets and canvas state whenever they change
  useEffect(() => {
    saveWidgets(widgetGroups, canvasId);
    saveCanvasState({ zoom, pan }, canvasId);
  }, [widgetGroups, zoom, pan, canvasId]);

  return (
    <div className="w-full h-screen overflow-hidden bg-gray-50 relative">
      <Header zoom={zoom} onNewCanvas={handleNewCanvas} />
      <div
        className="w-full h-full cursor-default"
        style={{
          transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`,
          transformOrigin: "0 0",
          backgroundImage: `
            linear-gradient(to right, rgba(200,200,200,${gridOpacity}) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(200,200,200,${gridOpacity}) 1px, transparent 1px)
          `,
          backgroundSize: `${gridSize * zoom}px ${gridSize * zoom}px`,
        }}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onClick={handleCanvasClick}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        ref={canvasRef}
      >
        {widgetGroups.map((group) => (
          <div
            key={group.id}
            className="absolute"
            style={{
              left: `${group.position.x}px`,
              top: `${group.position.y}px`,
              transform: `scale(${1 / zoom})`,
              transformOrigin: "top left",
            }}
          >
            <div
              className="relative group"
              onMouseDown={(e) => {
                if (
                  !(e.target as HTMLElement).closest("textarea, button, svg")
                ) {
                  e.preventDefault();
                  setDraggingGroup(group.id);
                  setDragStart({ x: e.clientX, y: e.clientY });
                }
              }}
            >
              {group.widgets.map((widget, index) => (
                <div
                  className="my-2"
                  key={widget.id}
                  // style={{
                  //   position: "absolute",
                  //   left: `${widget.position.x}px`,
                  //   top: `${widget.position.y}px`,
                  // }}
                >
                  <Widget
                    widget={widget}
                    zoom={zoom}
                    onInputChange={(value) =>
                      handleInputChange(group.id, widget.id, value)
                    }
                    onInputFocus={() => handleInputFocus(group.id, widget.id)}
                    onInputBlur={() => handleInputBlur(group.id, widget.id)}
                    onSendClick={(value) =>
                      handleSendClick(group.id, widget.id, value)
                    }
                    textareaRef={(el) => {
                      if (el) textareaRefs.current[widget.id] = el;
                    }}
                  />
                  <HoverWidgetControls
                    handleDeleteWidget={handleDeleteWidget}
                    createNewWidget={createNewConnectedWidget}
                    widget={widget}
                    canvasRef={canvasRef}
                    zoom={zoom}
                    pan={pan}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
