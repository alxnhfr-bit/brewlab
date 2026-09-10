import type { CapacitorConfig } from '@capacitor/cli'

// appId is changeable until the first store submission; after that it is
// permanent on both stores. Derived from the personal GitHub handle for now.
const config: CapacitorConfig = {
  appId: 'com.alxnhfr.brewlab',
  appName: 'Pourfect',
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
    contentInset: 'automatic',
  },
}

export default config
