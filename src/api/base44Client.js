import { createClient } from '@base44/sdk';
// import { getAccessToken } from '@base44/sdk/utils/auth-utils';

// Create a client without authentication for development
export const base44 = createClient({
  appId: "6884ea526a03104fa9ddda18", 
  requiresAuth: false // Disable authentication for development
});
