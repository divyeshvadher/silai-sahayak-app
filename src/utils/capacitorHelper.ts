
import { Capacitor } from '@capacitor/core';

export const isNativePlatform = (): boolean => {
  return Capacitor.isNativePlatform();
};

export const getPlatformName = (): string => {
  return Capacitor.getPlatform();
};

export const isRunningOnMobile = (): boolean => {
  const platform = getPlatformName();
  return platform === 'android' || platform === 'ios';
};
