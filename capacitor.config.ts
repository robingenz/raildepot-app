import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'dev.ionstarter.angularsqlite.demo',
  appName: 'angular-sqlite-starter',
  webDir: 'www',
  server: {
    androidScheme: 'https',
  },
  plugins: {
    CapacitorSQLite: {
      iosDatabaseLocation: 'Library/CapacitorDatabase',
      iosIsEncryption: false,
      androidIsEncryption: false,
    },
    LiveUpdate: {
      appId: 'a89c8f9a-7c7e-4867-9db2-68c5795bd4b4',
      autoDeleteBundles: true,
      enabled: true,
    },
    SplashScreen: {
      launchAutoHide: false,
      showSpinner: false,
    },
  },
};

export default config;
