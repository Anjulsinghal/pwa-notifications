export const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      });
      
      console.log('Service Worker registered with scope:', registration.scope);
      
      if ('periodicSync' in registration) {
        const tags = await (registration as any).periodicSync.getTags();
        if (!tags.includes('content-sync')) {
          try {
            await (registration as any).periodicSync.register('content-sync', {
              minInterval: 24 * 60 * 60 * 1000 
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

export const checkForUpdates = async () => {
  if ('serviceWorker' in navigator) {
    const registration = await navigator.serviceWorker.getRegistration();
    if (registration) {
      await registration.update();
    }
  }
};


