/**
 * Context for managing Virtual Library manage mode state
 */

import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  ReactNode,
} from 'react';

interface ManageModeContextType {
  isManageMode: boolean;
  toggleManageMode: () => void;
  enableManageMode: () => void;
  disableManageMode: () => void;
}

const ManageModeContext = createContext<ManageModeContextType | undefined>(
  undefined
);

interface ManageModeProviderProps {
  children: ReactNode;
}

export const ManageModeProvider: React.FC<ManageModeProviderProps> = ({
  children,
}) => {
  const [isManageMode, setIsManageMode] = useState(false);

  const toggleManageMode = () => {
    setIsManageMode((prev) => !prev);
  };

  const enableManageMode = () => {
    setIsManageMode(true);
  };

  const disableManageMode = () => {
    setIsManageMode(false);
  };

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(
    () => ({
      isManageMode,
      toggleManageMode,
      enableManageMode,
      disableManageMode,
    }),
    [isManageMode]
  );

  return (
    <ManageModeContext.Provider value={value}>
      {children}
    </ManageModeContext.Provider>
  );
};

export const useManageMode = () => {
  const context = useContext(ManageModeContext);
  if (!context) {
    throw new Error('useManageMode must be used within ManageModeProvider');
  }
  return context;
};
