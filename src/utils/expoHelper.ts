
// Using a try-catch for Constants since it might not be available in web
let Constants: any = { expoVersion: null };
try {
  // Only import in an Expo environment
  if (typeof navigator !== 'undefined' && navigator.product === 'ReactNative') {
    Constants = require('expo-constants').default;
  }
} catch (error) {
  console.log('expo-constants is not available');
}

import { Platform } from './platform';

export const isExpo = (): boolean => {
  return Constants.expoVersion !== null;
};

export const getPlatformName = (): string => {
  return Platform.OS;
};

export const isRunningOnMobile = (): boolean => {
  return Platform.isMobile();
};
