import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.circleup.app',
  appName: 'CircleUp',
  webDir: 'www',
  server: {
    url: 'https://trycircleup.web.app/',
    cleartext: false
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0,
      launchAutoHide: false,
      backgroundColor: "#ff0000",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
      androidSpinnerStyle: "large",
      spinnerColor: "#999999"
    },
    FirebaseAuthentication: {
      skipNativeAuth: true,
      providers: ["google.com"],
    },
  }
};

export default config;
