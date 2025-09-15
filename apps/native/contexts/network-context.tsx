import NetInfo from "@react-native-community/netinfo";
import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { NetworkManager } from "@/lib/storage";

interface NetworkContextType {
  isOnline: boolean;
  isConnected: boolean;
  connectionType: string | null;
}

const NetworkContext = createContext<NetworkContextType | undefined>(undefined);

export const useNetwork = () => {
  const context = useContext(NetworkContext);
  if (context === undefined) {
    throw new Error("useNetwork must be used within a NetworkProvider");
  }
  return context;
};

interface NetworkProviderProps {
  children: React.ReactNode;
}

export const NetworkProvider: React.FC<NetworkProviderProps> = ({
  children,
}) => {
  const [isOnline, setIsOnline] = useState(true);
  const [isConnected, setIsConnected] = useState(true);
  const [connectionType, setConnectionType] = useState<string | null>(null);

  useEffect(() => {
    const networkManager = NetworkManager.getInstance();

    const unsubscribe = NetInfo.addEventListener((state) => {
      const online = state.isConnected && state.isInternetReachable;
      const connected = state.isConnected;
      const type = state.type;

      setIsOnline(online ?? false);
      setIsConnected(connected ?? false);
      setConnectionType(type);

      // Update network manager
      networkManager.setOnlineStatus(online ?? false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const value: NetworkContextType = {
    isOnline,
    isConnected,
    connectionType,
  };

  return (
    <NetworkContext.Provider value={value}>{children}</NetworkContext.Provider>
  );
};
