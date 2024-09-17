import React from "react";
import { InputWidget } from "./widgets/InputWidget";
import { AnswerWidget } from "./widgets/AnswerWidget";
import { UrlWidget } from "./widgets/UrlWidget";
import { FileWidget } from "./widgets/FileWidget";
import { WidgetType, WidgetProps } from "./types";

export const Widget: React.FC<WidgetProps> = (props) => {
  switch (props.widget.type) {
    case "input":
      return <InputWidget {...props} widget={props.widget} />;
    case "answer":
      return <AnswerWidget {...props} widget={props.widget} />;
    case "url":
      return <UrlWidget {...props} widget={props.widget} />;
    case "file":
      return <FileWidget {...props} widget={props.widget} />;
    default:
      return null;
  }
};

// ... keep the existing type definitions here
