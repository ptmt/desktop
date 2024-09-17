import React from "react";
import { Globe, Loader2 } from "lucide-react";
import { UrlBoxState, WidgetProps } from "../types";

export const UrlWidget: React.FC<WidgetProps & { widget: UrlBoxState }> = ({
  widget,
}) => {
  return (
    <div
      className={`bg-white shadow-md rounded-md p-4 transition-all duration-300 ease-in-out ${
        widget.isLoading ? "bg-blue-100" : ""
      } cursor-move`}
    >
      {/* ... rest of the UrlWidget implementation ... */}
    </div>
  );
};
