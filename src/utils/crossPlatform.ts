
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
