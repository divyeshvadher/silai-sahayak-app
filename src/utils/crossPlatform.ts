
// Utility to handle cross-platform imports and functionality
export const isPlatformWeb = () => typeof document !== 'undefined';

export const isPlatformMobile = () => !isPlatformWeb();

// Safe way to require packages that might only be available in specific environments
export function safeRequire(packageName: string) {
  try {
    return require(packageName);
  } catch (e) {
    console.warn(`Package ${packageName} is not available in this environment`);
    return null;
  }
}

// Helper for conditional imports
export async function importIfAvailable(packageName: string) {
  try {
    return await import(packageName);
  } catch (e) {
    console.warn(`Dynamic import of ${packageName} failed`);
    return null;
  }
}

// Get safe storage for auth persistence
export function getAuthStorage() {
  if (isPlatformWeb()) {
    return localStorage;
  } else {
    // For mobile environments, you might want to use a more appropriate storage
    // This is a placeholder - in a real app you'd use AsyncStorage or equivalent
    return {
      getItem: (key: string) => null,
      setItem: (key: string, value: string) => {},
      removeItem: (key: string) => {},
    };
  }
}
