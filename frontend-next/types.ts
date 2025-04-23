// Message types

/**
 * This will be Message that will handle chats and guess relative work
 */

export type ChatMessagePayload = {
  userName: string;
  data: {
    userName: string;
    message: string;
    time: Date;
  };
  type: string;
  isHidden: boolean;
};

export type CanvasPayload = {
  userName: string;
  data: {
    x: number;
    y: number;
    size: number;
    tool: string;
  };
  type: string;
  isHidden: boolean;
};
