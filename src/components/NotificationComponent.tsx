import { useState } from 'react';

const NotificationComponent = () => {
  const [permission, setPermission] = useState(Notification.permission);
  const [message, setMessage] = useState('');
  const [notificationStatus, setNotificationStatus] = useState('');

  const requestPermission = async () => {
    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      
      if (result === 'granted') {
        setNotificationStatus('Permission granted! You can now receive notifications.');
      } else {
        setNotificationStatus('Permission denied for notifications.');
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      setNotificationStatus('Error requesting permission.');
    }
  };

  const sendNotification = () => {
    if (permission !== 'granted') {
      setNotificationStatus('You need to grant permission first.');
      return;
    }

    if (!message) {
      setNotificationStatus('Please enter a message.');
      return;
    }

    try {
      // Check if service worker is registered
      if ('serviceWorker' in navigator && 'PushManager' in window) {
        // First try to send via service worker
        navigator.serviceWorker.ready.then(registration => {
          registration.showNotification('PWA Notification', {
            body: message,
            icon: '/icon-192x192.png',
            badge: '/icon-192x192.png',
            // Removed vibrate property as it's not in the TypeScript definition
          });
          setNotificationStatus('Notification sent!');
          setMessage('');
        }).catch(err => {
          // If service worker push fails, fallback to regular notification
          throw err;
        });
      } else {
        // Fallback to regular notification
        new Notification('PWA Notification', {
          body: message,
          icon: '/icon-192x192.png'
        });
        setNotificationStatus('Notification sent!');
        setMessage('');
      }
    } catch (error) {
      console.error('Error sending notification:', error);
      setNotificationStatus('Error sending notification.');
    }
  };

  return (
    <div className="bg-gray-100 p-4 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Push Notifications</h2>
      
      {permission !== 'granted' && (
        <button 
          onClick={requestPermission}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
        >
          Request Notification Permission
        </button>
      )}
      
      {permission === 'granted' && (
        <div className="mb-4">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter notification message"
            className="w-full p-2 border border-gray-300 rounded mb-2"
          />
          <button 
            onClick={sendNotification}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Send Notification
          </button>
        </div>
      )}
      
      {notificationStatus && (
        <p className="text-sm text-gray-700 mt-2">{notificationStatus}</p>
      )}
    </div>
  );
};

export default NotificationComponent;