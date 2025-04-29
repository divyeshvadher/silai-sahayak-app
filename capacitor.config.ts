
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.silaisahayak.app',
  appName: 'silai-sahayak-app',
  webDir: 'dist',
  server: {
    url: 'https://9075cffb-1db3-466a-9c1b-c2f94de710f9.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  android: {
    backgroundColor: "#FFFFFF"
  },
  ios: {
    backgroundColor: "#FFFFFF"
  }
};

export default config;
