import React from 'react';
import { PvsDesignSystemProvider, PvsThemeOptions } from 'pvs-design-system';

const themeOptions: PvsThemeOptions = {
  typography: {
    htmlFontSize: 10,
  },
  spacing: (factor: number) => `${(0.8 * factor).toFixed(3)}rem`,
};

const ThemeProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <PvsDesignSystemProvider themeOptions={themeOptions}>
      {children}
    </PvsDesignSystemProvider>
  );
};

export default ThemeProvider;
