// clerkConfig.js
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import * as SecureStore from 'expo-secure-store';

export const clerkConfig = {
    secureSessionStorage: SecureStore,
    createOpenIdClient: AuthSession,
    browserImplementation: WebBrowser,
};
