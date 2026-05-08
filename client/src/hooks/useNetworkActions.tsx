"use client";

import { createContext, ReactNode, useContext } from "react";
import {
  ConnectionDirectionType,
  ConnectionStatusType,
  RequestDirectionType,
} from "@/types/types/connection.types";
import { UserProfileType } from "@/types/types/profile.types";

export type RelationshipOverrideType = Partial<{
  connectionStatus: ConnectionStatusType;
  connectionDirection: ConnectionDirectionType;
}>;

type NetworkActionsContextType = {
  connectionRequests: UserProfileType[];
  connections: UserProfileType[];
  relationshipOverrides: Record<string, RelationshipOverrideType>;
  onRequestAction: (
    userId: string,
    direction: RequestDirectionType,
  ) => Promise<boolean | void>;
  onConnectionAction: (
    profile: UserProfileType,
    status: ConnectionStatusType,
  ) => Promise<boolean | void>;
};

const NetworkActionsContext = createContext<NetworkActionsContextType | null>(
  null,
);

export const NetworkActionsProvider = ({
  children,
  value,
}: {
  children: ReactNode;
  value: NetworkActionsContextType;
}) => {
  return (
    <NetworkActionsContext.Provider value={value}>
      {children}
    </NetworkActionsContext.Provider>
  );
};

export const useNetworkActions = () => useContext(NetworkActionsContext);
