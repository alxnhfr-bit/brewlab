import type { CapacitorConfig } from '@capacitor/cli'

// appId is changeable until the first store submission; after that it is
// permanent on both stores. Derived from the personal GitHub handle for now.
const config: CapacitorConfig = {
  appId: 'com.alxnhfr.brewlab',
  appName: 'BrewLab',
  webDir: 'dist',
  plugins: {
    SplashScreen: {
      launchShowDuration: 800,
      launchAutoHide: true,
      backgroundColor: '#F5F5F3',
      showSpinner: false,
    },
    LocalNotifications: {
      smallIcon: 'ic_stat_notify',
      iconColor: '#4A6B5D',
    },
  },
  ios: {
    contentInset: 'automatic',
  },
}

export default config
