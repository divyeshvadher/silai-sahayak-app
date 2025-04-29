
import Constants from 'expo-constants';
import { Platform } from 'react-native';

export const isExpo = (): boolean => {
  return Constants.expoVersion !== null;
};

export const getPlatformName = (): string => {
  return Platform.OS;
};

export const isRunningOnMobile = (): boolean => {
  const platform = getPlatformName();
  return platform === 'android' || platform === 'ios';
};
