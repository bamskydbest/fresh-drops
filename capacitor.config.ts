import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.freshdrops.app',
  appName: 'FreshDrops',
  webDir: 'dist',  
  server: {
    url: 'https://freshdrops.netlify.app',
    cleartext: true,
    androidScheme: 'https'
  },
  android: {
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: true
  }
};

export default config;