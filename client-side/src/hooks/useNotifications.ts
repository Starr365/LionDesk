import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';

export interface Notification {
  id: number;
  user_id: number;
  type: 'confirmation' | 'status_update' | 'escalation' | 'reminder' | 'reopen';
  title: string;
  message: string | null;
  is_read: boolean;
  ticket_id: number | null;
  created_at: string;
}

export const useNotifications = () => {
  const queryClient = useQueryClient();

  const useNotificationsList = () =>
    useQuery<Notification[]>({
      queryKey: ['notifications'],
      queryFn: async () => {
        const response = await api.get('/api/notifications');
        return response.data;
      },
    });

  const markRead = useMutation({
    mutationFn: async (id: number) => {
      const response = await api.patch(`/api/notifications/${id}/read`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  return {
    useNotificationsList,
    markRead,
  };
};
