import type { CapacitorConfig } from '@capacitor/cli'

// appId is PERMANENT from the first store submission onward. "fifteengrams"
// rather than "15grms" because an Android package component may not start with
// a digit, which would otherwise force a different id on that platform.
const config: CapacitorConfig = {
  appId: 'com.alxnhfr.fifteengrams',
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
