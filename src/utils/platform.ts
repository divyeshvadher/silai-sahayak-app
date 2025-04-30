
// Platform detection utility
const isWeb = typeof document !== 'undefined';
const isMobile = !isWeb;

// Safe platform object that works in both web and mobile environments
export const Platform = {
  OS: isWeb ? 'web' : 'unknown', // In a real Expo app, this would be 'ios' or 'android'
  isWeb: () => isWeb,
  isMobile: () => isMobile,
};

// Placeholder for StatusBar component
export const StatusBar = ({ style }: { style?: 'auto' | 'light' | 'dark' }) => null;
