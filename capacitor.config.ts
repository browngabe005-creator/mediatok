import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'org.mediatok.app',
  appName: 'MediaTok',
  webDir: 'public',
  bundledWebRuntime: false,
  backgroundColor: '#f6f7fc',
  ios: { contentInset: 'automatic' },
  android: { allowMixedContent: false },
};

export default config;
