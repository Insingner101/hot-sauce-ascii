import { ReactNode, createContext, useContext, useState } from "react";

export interface User {
  name: string;
  email: string;
  image: string;
  role: string;
}

interface GlobalContextProps {
  loading: boolean;
  setLoading: (loading: boolean) => void;

  sidebar: boolean;
  setSidebar: (sidebar: boolean) => void;

  user: User;
  setUser: (user: User) => void;
}

const GlobalContext = createContext<GlobalContextProps | undefined>(undefined);

interface GlobalProviderProps {
  children: ReactNode;
}

export const GlobalProvider: React.FC<GlobalProviderProps> = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [sidebar, setSidebar] = useState(false);
  const [user, setUser] = useState<User>({} as User);

  return (
    <GlobalContext.Provider
      value={{
        loading,
        setLoading,
        sidebar,
        setSidebar,
        user,
        setUser,
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
