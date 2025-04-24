# Progressive Web App (PWA) Demo with React + TypeScript

A modern Progressive Web App demonstrating key PWA features including offline support, push notifications, and installability.

## 📌 Live Demo

[Live Demo Link](https://pwa-notifications-sigma.vercel.app/)

## 📂 GitHub Repository

[Repository Link](https://github.com/Anjulsinghal/pwa-notifications)

## ✨ Features

- **Service Worker** for offline support
- **Push Notifications** with multiple types (Info, Success, Warning, Error)
- **Installable** as a standalone application
- **Responsive Design** with Tailwind CSS
- **TypeScript** for type safety
- **Vite** for fast development and optimized builds

## 📱 Installation

The "Install App" button will only appear when:
1. The app is accessed via HTTPS (deployed site)
2. The user hasn't already installed the app
3. The app meets PWA criteria (has a valid manifest, registered service worker, etc.)

> **Note:** The install option will not appear in localhost development environments. To test the installation feature, please use the deployed version.

## 🚀 Getting Started

### Prerequisites

- Node.js 16.x or higher
- npm 7.x or higher

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/Anjulsinghal/pwa-notifications
cd pwa-notifications
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

### Production Build

1. Create a production build:
```bash
npm run build
```

2. Preview the production build locally:
```bash
npm run preview
```

## 📁 Project Structure

```
pwa-notifications/
├── public/
│   └── sw.js                  # Service worker implementation
├── src/
│   ├── components/
│   │   ├── Notification.tsx             # Basic notification component
│   │   └── NotificationButtons.tsx      # Multi-type notification buttons
│   ├── App.tsx                # Main application component
│   ├── main.tsx               # Application entry point
│   ├── index.css              # Global styles with Tailwind
│   └── serviceWorkerRegistration.ts     # Service worker registration
├── index.html                 # HTML template
├── vite.config.ts             # Vite configuration
├── tailwind.config.js         # Tailwind CSS configuration
├── tsconfig.json              # TypeScript configuration
└── package.json               # Project dependencies and scripts
```

## 🔧 How It Works

### Service Worker

The service worker (`sw.js`) handles:
- Caching static assets for offline use
- Intercepting network requests
- Managing push notifications
- Background sync operations

### Notifications

The app demonstrates two ways to implement notifications:
1. **Basic Notifications**: Text-based notifications with the original component
2. **Typed Notifications**: Four different notification types (Info, Success, Warning, Error)

### Installation

The PWA can be installed on supported devices and browsers. The installation prompt is handled by the browser, and our app provides a custom "Install App" button when the conditions are met.
![Screenshot from 2025-04-24 18-57-52](https://github.com/user-attachments/assets/f53bf480-9be2-47bc-a040-13673c092212)
![Screenshot from 2025-04-24 18-57-38](https://github.com/user-attachments/assets/3ec71e3c-73a5-42c8-9e45-b77a5d8a61ef)
![Screenshot from 2025-04-24 18-57-25](https://github.com/user-attachments/assets/728de43d-ca0c-4570-a742-eb26ca411df0)
![Screenshot from 2025-04-24 18-57-12](https://github.com/user-attachments/assets/8459c210-48b4-470f-b864-d8d8bc6cfe07)



