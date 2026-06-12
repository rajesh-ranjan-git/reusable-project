"use client";

import { createContext, ReactNode, useContext } from "react";

type NetworkActionsContextType = {};

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
