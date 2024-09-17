import React from "react";
import { Globe, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { AnswerState, WidgetProps } from "../types";

export const AnswerWidget: React.FC<WidgetProps & { widget: AnswerState }> = ({
  widget,
}) => {
  return (
    <div
      className={`bg-white shadow-md rounded-md p-4 transition-all duration-300 ease-in-out ${
        widget.isLoading ? "bg-blue-100" : ""
      } cursor-move`}
    >
      <div className="flex">
        <Globe className="h-5 w-5 mr-2" />
        <div className="text-sm font-medium max-w-[400px] break-words overflow-wrap-anywhere">
          <ReactMarkdown>{widget.content}</ReactMarkdown>
        </div>
      </div>
      {widget.isLoading ? (
        <div className="mt-2 flex items-center">
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
        </div>
      ) : null}
    </div>
  );
};
