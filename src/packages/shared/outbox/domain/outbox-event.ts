export type EventForOutbox = {
  topic: string;
  payload: object;
};

export type EventInOutbox = EventForOutbox & { id: number };
