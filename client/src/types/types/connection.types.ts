export type RequestDirectionType = "left" | "right";

export type ConnectionStatusType =
  | "none"
  | "interested"
  | "not-interested"
  | "accepted"
  | "rejected"
  | "blocked";

export type RelationshipType =
  | "incoming"
  | "outgoing"
  | "connected"
  | "blocked"
  | "none";

export type ConnectionDirectionType = "incoming" | "outgoing" | null;
