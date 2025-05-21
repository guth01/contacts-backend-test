// Configuration settings for the application

const config = {
  // Base URL for the backend API
  apiUrl: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  
  // Auth related constants
  auth: {
    tokenStorageKey: 'authToken',
    userStorageKey: 'username',
  },
  
  // App settings
  app: {
    name: 'ContactsManager',
    version: '1.0.0',
  },
  
  // Feature flags
  features: {
    enableDarkMode: false,
    enableNotifications: false,
  },
};

export default config;