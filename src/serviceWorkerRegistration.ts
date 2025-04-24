export const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      });
      
      console.log('Service Worker registered with scope:', registration.scope);
      
      // Setup periodic sync if available
      if ('periodicSync' in registration) {
        const tags = await (registration as any).periodicSync.getTags();
        if (!tags.includes('content-sync')) {
          try {
            await (registration as any).periodicSync.register('content-sync', {
              minInterval: 24 * 60 * 60 * 1000 // Once per day
            });
            console.log('Periodic sync registered');
          } catch (error) {
            console.log('Periodic sync registration failed:', error);
          }
        }
      }
      
      return registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }
};

// Check if service worker can be updated
export const checkForUpdates = async () => {
  if ('serviceWorker' in navigator) {
    const registration = await navigator.serviceWorker.getRegistration();
    if (registration) {
      await registration.update();
    }
  }
};

// File: public/sw.js
// This is the service worker file that will be copied to the dist folder

