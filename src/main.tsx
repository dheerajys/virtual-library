import React from 'react';
import ReactDOM from 'react-dom/client';
import makeMockServer from './server';
import App from './app/App';

// Only enable Mirage mock server if explicitly configured
const useMockServer = import.meta.env.VITE_USE_MOCK_SERVER === 'true';

if (process.env.NODE_ENV === 'development' && useMockServer) {
  // eslint-disable-next-line no-console
  console.log('🔧 Mirage mock server enabled');
  makeMockServer({ environment: 'development' });
} else if (process.env.NODE_ENV === 'development') {
  // eslint-disable-next-line no-console
  console.log('🌐 Using real API at:', import.meta.env.VITE_API_BASE_URL);
}

ReactDOM.createRoot(document.getElementById('spaRootContainer')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
