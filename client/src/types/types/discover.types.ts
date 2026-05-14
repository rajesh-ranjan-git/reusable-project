export type SwipeDirectionType = "left" | "right" | "super";

export type ConnectMutationType = {
  targetId: string;
  direction: SwipeDirectionType;
};
