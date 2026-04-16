import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.circleup.app',
  appName: 'Circleup',
  webDir: 'www',
  server: {
    url: 'https://notifications-d7fc6.web.app/',
    cleartext: false
  }
};

export default config;
