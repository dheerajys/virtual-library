import { AppBootConfig } from './types';

export const PAGE_TITLE_ID = 'pageTitleHeaderText';
export const ZERO_WIDTH_SPACE = '‎';

export const APP_CONTAINER_ID = 'spaRootContainer';

export const NOTIFICATIONS = Object.freeze({
  delayMs: 10000,
  maxDispayed: 10,
});

export const initialBootConfig: AppBootConfig = {
  featureFlags: {
    F_EXAMPLE_FLAG: false,
  },
  apiBaseUrl: 'http://localhost:56357/api',
  appSpaBaseUrl: '',
};
