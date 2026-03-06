import React, { Suspense } from 'react';
import { RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import { NotificationsStack } from 'pvs-design-system';
import { store } from 'store';
import ThemeProvider from 'theme/ThemeProvider';
import router from './router';
import { NOTIFICATIONS } from './consts';
import './app.css';

const App: React.FC = () => (
  <Provider store={store}>
    <ThemeProvider>
      <NotificationsStack
        maxDisplayed={NOTIFICATIONS.maxDispayed}
        autoHideDuration={NOTIFICATIONS.delayMs}
      />
      <Suspense fallback={<div>Loading...</div>}>
        <RouterProvider router={router} />
      </Suspense>
    </ThemeProvider>
  </Provider>
);

export default App;
