export interface WidgetBase {
  id: string;
  type: string;
  position: { x: number; y: number };
  groupId: string;
}

export interface InputState extends WidgetBase {
  type: "input";
  value: string;
  isFocused: boolean;
  isLoading: boolean;
  isRemoving: boolean;
  isAnswered: boolean;
}

export interface AnswerState extends WidgetBase {
  type: "answer";
  content: string;
  isLoading: boolean;
}

export interface UrlBoxState extends WidgetBase {
  type: "url";
  url: string;
  isLoading: boolean;
}

export interface FileBoxState extends WidgetBase {
  type: "file";
  file: File;
  content: string;
  isLoading: boolean;
}

export type WidgetType = InputState | UrlBoxState | FileBoxState | AnswerState;

export interface WidgetProps {
  widget: WidgetType;
  zoom: number;
  onInputChange: (value: string) => void;
  onInputFocus: (id: string) => void;
  onInputBlur: (id: string) => void;
  onSendClick: (value: string) => void;
  textareaRef: (el: HTMLTextAreaElement | null) => void;
}
