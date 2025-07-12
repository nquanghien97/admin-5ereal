import React, { createContext } from 'react';
import { notification } from 'antd';

export interface NotificationService {
  success: (message: string, description?: string) => void;
  error: (message: string, description?: string) => void;
  info: (message: string, description?: string) => void;
  warning: (message: string, description?: string) => void;
}
type NotificationType  = 'success' | 'error' | 'info' | 'warning'
// eslint-disable-next-line react-refresh/only-export-components
export const NotificationContext = createContext<NotificationService | null>(null);

export const NotificationProvider = ({ children } : { children: React.ReactNode}) => {
  const openNotification = (type: NotificationType, message: string, description?: string) => {
    notification[type]({ message, description, showProgress: true });
  };

  const notificationService = {
    success: (message: string, description?: string) => openNotification('success', message, description),
    error: (message: string, description?: string) => openNotification('error', message, description),
    info: (message: string, description?: string) => openNotification('info', message, description),
    warning: (message: string, description?: string) => openNotification('warning', message, description),
  };

  return (
    <NotificationContext.Provider value={notificationService}>
      {children}
    </NotificationContext.Provider>
  );
};