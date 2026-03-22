import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.connections.app',
  appName: 'connections-app',
  webDir: 'www',
  server: {
    url: 'https://notifications-d7fc6.web.app/',
    cleartext: false
  }
};

export default config;
