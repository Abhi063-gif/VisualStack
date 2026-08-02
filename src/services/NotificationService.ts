import toast from 'react-hot-toast';
import type { IService } from '../core/container/ServiceContainer';

export class NotificationService implements IService {
  public name = 'NotificationService';

  public success(message: string): void {
    toast.success(message, {
      style: {
        background: '#1a1d24',
        color: '#f3f4f6',
        border: '1px solid #363c4e',
      },
    });
  }

  public error(message: string): void {
    toast.error(message, {
      style: {
        background: '#1a1d24',
        color: '#ef4444',
        border: '1px solid #ef4444',
      },
    });
  }

  public info(message: string): void {
    toast(message, {
      icon: 'ℹ️',
      style: {
        background: '#1a1d24',
        color: '#f3f4f6',
        border: '1px solid #363c4e',
      },
    });
  }
}

export const notificationService = new NotificationService();
