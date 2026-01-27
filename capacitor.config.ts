import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.freshdrops.app',
  appName: 'FreshDrops',
  webDir: 'build', 
  server: {
    url: 'https://freshdrops.netlify.app', 
    cleartext: true, 
  },
};

export default config;
