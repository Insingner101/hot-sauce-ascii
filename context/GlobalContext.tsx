import { ReactNode, createContext, useContext, useState } from "react";

interface GlobalContextProps {
  loading: boolean;
  setLoading: (loading: boolean) => void;

  sidebar: boolean;
  setSidebar: (sidebar: boolean) => void;
}

const GlobalContext = createContext<GlobalContextProps | undefined>(undefined);

interface GlobalProviderProps {
  children: ReactNode;
}

export const GlobalProvider: React.FC<GlobalProviderProps> = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [sidebar, setSidebar] = useState(false);

  return (
    <GlobalContext.Provider
      value={{
        loading,
        setLoading,
        sidebar,
        setSidebar
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
