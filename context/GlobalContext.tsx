import { ReactNode, createContext, useContext, useState } from "react";

interface GlobalContextProps {
  loading: boolean;
  setLoading: (stake: boolean) => void;
}

const GlobalContext = createContext<GlobalContextProps | undefined>(undefined);

interface GlobalProviderProps {
  children: ReactNode;
}

export const GlobalProvider: React.FC<GlobalProviderProps> = ({ children }) => {
  const [loading, setLoading] = useState(false);

  return (
    <GlobalContext.Provider
      value={{
        loading,
        setLoading,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobalContext must be used within a GlobalProvider");
  }
  return context;
};
