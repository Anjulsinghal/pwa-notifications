import { useState } from 'react';

type NotificationType = 'info' | 'success' | 'warning' | 'error';

interface NotificationConfig {
  title: string;
  body: string;
  icon: string;
  badge?: string;
  tag?: string;
}

const NotificationButtons = () => {
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>(
    Notification.permission
  );
  const [statusMessage, setStatusMessage] = useState<string>('');

  const requestPermission = async () => {
    try {
      const permission = await Notification.requestPermission();
      setPermissionStatus(permission);
      
      if (permission === 'granted') {
        setStatusMessage('Notification permission granted!');
      } else if (permission === 'denied') {
        setStatusMessage('Notification permission denied.');
      } else {
        setStatusMessage('Notification permission dismissed.');
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      setStatusMessage('Error requesting notification permission.');
    }
  };

  const checkPermission = async (): Promise<boolean> => {
    if (permissionStatus !== 'granted') {
      await requestPermission();
      return Notification.permission === 'granted';
    }
    return true;
  };

  const sendNotification = async (type: NotificationType) => {
    if (!(await checkPermission())) {
      return;
    }

    const notificationConfig = getNotificationConfig(type);
    
    try {
      if ('serviceWorker' in navigator && 'PushManager' in window) {
        const registration = await navigator.serviceWorker.ready;
        await registration.showNotification(notificationConfig.title, {
          body: notificationConfig.body,
          icon: notificationConfig.icon,
          badge: notificationConfig.badge || '/icon-192x192.png',
          tag: notificationConfig.tag || type,
          data: { type }
        });
        setStatusMessage(`${type.charAt(0).toUpperCase() + type.slice(1)} notification sent!`);
      } else {
        new Notification(notificationConfig.title, {
          body: notificationConfig.body,
          icon: notificationConfig.icon
        });
        setStatusMessage(`${type.charAt(0).toUpperCase() + type.slice(1)} notification sent!`);
      }
    } catch (error) {
      console.error('Error sending notification:', error);
      setStatusMessage(`Error sending ${type} notification.`);
    }
  };

  const getNotificationConfig = (type: NotificationType): NotificationConfig => {
    switch (type) {
      case 'info':
        return {
          title: 'Information',
          body: 'This is an informational notification.',
          icon: '/icon-192x192.png',
          tag: 'info-notification'
        };
      case 'success':
        return {
          title: 'Success!',
          body: 'Your action was completed successfully.',
          icon: '/icon-192x192.png',
          tag: 'success-notification'
        };
      case 'warning':
        return {
          title: 'Warning',
          body: 'This is a warning notification. Please take note.',
          icon: '/icon-192x192.png',
          tag: 'warning-notification'
        };
      case 'error':
        return {
          title: 'Error',
          body: 'An error occurred. Please try again.',
          icon: '/icon-192x192.png',
          tag: 'error-notification'
        };
      default:
        return {
          title: 'Notification',
          body: 'This is a notification.',
          icon: '/icon-192x192.png'
        };
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6 mb-6">
      <h2 className="text-xl font-bold mb-4">Notification Types</h2>
      
      {permissionStatus !== 'granted' && (
        <div className="mb-4">
          <button
            onClick={requestPermission}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition-colors"
          >
            Allow Notifications
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 mb-4">
        <button
          onClick={() => sendNotification('info')}
          className="bg-blue-100 hover:bg-blue-200 text-blue-800 font-medium py-2 px-4 rounded transition-colors"
          disabled={permissionStatus !== 'granted'}
        >
          Info
        </button>
        
        <button
          onClick={() => sendNotification('success')}
          className="bg-green-100 hover:bg-green-200 text-green-800 font-medium py-2 px-4 rounded transition-colors"
          disabled={permissionStatus !== 'granted'}
        >
          Success
        </button>
        
        <button
          onClick={() => sendNotification('warning')}
          className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 font-medium py-2 px-4 rounded transition-colors"
          disabled={permissionStatus !== 'granted'}
        >
          Warning
        </button>
        
        <button
          onClick={() => sendNotification('error')}
          className="bg-red-100 hover:bg-red-200 text-red-800 font-medium py-2 px-4 rounded transition-colors"
          disabled={permissionStatus !== 'granted'}
        >
          Error
        </button>
      </div>
      
      {statusMessage && (
        <div className="mt-4 text-sm text-gray-600">{statusMessage}</div>
      )}
    </div>
  );
};

export default NotificationButtons;