import React, { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Loader2, RefreshCw, Link as LinkIcon } from "lucide-react";
import { InputState, WidgetProps } from "../types";

export const InputWidget: React.FC<WidgetProps & { widget: InputState }> = ({
  widget,
  onInputChange,
  onInputFocus,
  onInputBlur,
  onSendClick,
  textareaRef,
}) => {
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && e.metaKey) {
        e.preventDefault();
        onSendClick(widget.value);
      }
    },
    [onSendClick, widget.value]
  );

  return (
    <div
      className={`bg-white shadow-md rounded-md transition-all duration-300 ease-in-out ${
        widget.isLoading ? "bg-blue-100" : ""
      } ${widget.isFocused || widget.isLoading ? "w-96" : "w-64"} cursor-move ${
        widget.isRemoving ? "opacity-0 scale-95" : "opacity-100 scale-100"
      }`}
    >
      <div className="flex items-start p-2">
        <Textarea
          ref={textareaRef}
          className={`flex-grow bg-transparent border-none focus:ring-0 transition-all duration-300 ease-in-out ${
            widget.isFocused ? "h-32 text-sm" : "h-10 text-xs"
          } cursor-text resize-none`}
          placeholder="ask or generate..."
          value={widget.value}
          onChange={(e) => onInputChange(e.target.value)}
          onFocus={() => onInputFocus(widget.id)}
          onBlur={() => onInputBlur(widget.id)}
          onKeyDown={handleKeyDown}
          readOnly={widget.isLoading || widget.isAnswered}
          rows={1}
        />
        {widget.isFocused && !widget.isLoading && (
          <Button
            variant="ghost"
            size="sm"
            className="ml-2 cursor-pointer mt-1"
            onClick={() => onSendClick(widget.value)}
            disabled={!widget.value.trim()}
          >
            <Send className="h-5 w-5" />
            <span className="sr-only">Send</span>
          </Button>
        )}
        {widget.isLoading && (
          <div className="ml-2 mt-1">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
        )}
      </div>
      {widget.isFocused && !widget.isLoading && (
        <div className="flex justify-end p-2 space-x-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 cursor-pointer"
            aria-label="Refresh"
            onClick={() => onSendClick(widget.value)}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 cursor-pointer"
            aria-label="Connections"
          >
            <LinkIcon className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};
