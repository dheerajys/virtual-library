import React, { createContext, useContext } from 'react';
import { AppBootConfig } from './types';
import { APP_CONTAINER_ID, initialBootConfig } from './consts';

const bootConfigData = document
  .getElementById(APP_CONTAINER_ID)
  ?.getAttribute('data-custom-props');

const bootConfig: AppBootConfig = bootConfigData
  ? (JSON.parse(bootConfigData) as AppBootConfig)
  : initialBootConfig;

const BootConfigContext = createContext<AppBootConfig>(bootConfig);

const BootConfigProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  return (
    <BootConfigContext.Provider value={bootConfig}>
      {children}
    </BootConfigContext.Provider>
  );
};

export const useBootConfig = () => {
  const config = useContext(BootConfigContext);
  return config;
};

export default BootConfigProvider;
