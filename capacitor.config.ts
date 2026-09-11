import type { CapacitorConfig } from '@capacitor/cli'

// appId is changeable until the first store submission; after that it is
// permanent on both stores. Derived from the personal GitHub handle for now.
const config: CapacitorConfig = {
  appId: 'com.alxnhfr.brewlab',
  appName: '15GRMS',
  webDir: 'dist',
  plugins: {
    SplashScreen: {
      launchShowDuration: 800,
      launchAutoHide: true,
      backgroundColor: '#FFF4F8',
      showSpinner: false,
    },
    LocalNotifications: {
      smallIcon: 'ic_stat_notify',
      iconColor: '#FF3E9A',
    },
  },
  ios: {
    // The app positions its own chrome against env(safe-area-inset-*), so iOS
    // must not add insets of its own on top.
    contentInset: 'never',
  },
}

export default config
