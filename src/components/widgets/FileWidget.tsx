import React from "react";
import { File, Loader2 } from "lucide-react";
import { FileBoxState, WidgetProps } from "../types";

export const FileWidget: React.FC<WidgetProps & { widget: FileBoxState }> = ({
  widget,
}) => {
  return (
    <div
      className={`bg-white shadow-md rounded-md p-4 transition-all duration-300 ease-in-out ${
        widget.isLoading ? "bg-blue-100" : ""
      } cursor-move`}
    >
      <div className="flex items-center">
        <File className="h-5 w-5 mr-2" />
        <span className="text-sm font-medium truncate max-w-[200px]">
          {widget.file.name}
        </span>
      </div>
      {widget.isLoading ? (
        <div className="mt-2 flex items-center">
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
          <span className="text-sm">Parsing file...</span>
        </div>
      ) : (
        <div className="mt-2 text-sm max-h-40 overflow-y-auto">
          <pre className="whitespace-pre-wrap">Parsed and added to context</pre>
        </div>
      )}
    </div>
  );
};
