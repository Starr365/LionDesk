import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';

export interface Comment {
  id: number;
  ticket_id: number;
  author_id: number;
  author_name: string;
  author_role: 'student' | 'staff' | 'admin';
  text: string;
  created_at: string;
}

export interface Ticket {
  id: number;
  ticket_ref: string;
  title: string;
  description: string;
  category_id: number;
  category_name?: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed' | 'escalated' | 'reopened';
  student_id: number;
  student_name?: string;
  student_email?: string;
  student_matric?: string;
  staff_id?: number | null;
  staff_name?: string | null;
  resolution_notes?: string | null;
  feedback?: string | null;
  reopen_reason?: string | null;
  created_at: string;
  updated_at: string;
  resolved_at?: string | null;
  closed_at?: string | null;
  comments?: Comment[];
}

export const useTickets = () => {
  const queryClient = useQueryClient();

  // Queries
  const useMyTickets = () =>
    useQuery<Ticket[]>({
      queryKey: ['tickets', 'my'],
      queryFn: async () => {
        const response = await api.get('/api/tickets/my');
        return response.data;
      },
    });

  const useAssignedTickets = () =>
    useQuery<Ticket[]>({
      queryKey: ['tickets', 'assigned'],
      queryFn: async () => {
        const response = await api.get('/api/tickets/assigned');
        return response.data;
      },
    });

  const useAllTickets = (filters: { status?: string; category_id?: number } = {}) =>
    useQuery<Ticket[]>({
      queryKey: ['tickets', 'all', filters],
      queryFn: async () => {
        const response = await api.get('/api/tickets', { params: filters });
        return response.data;
      },
    });

  const useTicketDetails = (id: string | number) =>
    useQuery<Ticket>({
      queryKey: ['tickets', 'detail', id],
      queryFn: async () => {
        const response = await api.get(`/api/tickets/${id}`);
        return response.data;
      },
      enabled: !!id,
    });

  // Mutations
  const createTicket = useMutation({
    mutationFn: async (payload: { title: string; description: string; category_id: number }) => {
      const response = await api.post('/api/tickets', payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status, resolution_notes }: { id: number | string; status: string; resolution_notes?: string }) => {
      const response = await api.patch(`/api/tickets/${id}/status`, { status, resolution_notes });
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      queryClient.invalidateQueries({ queryKey: ['tickets', 'detail', variables.id] });
    },
  });

  const addComment = useMutation({
    mutationFn: async ({ id, text }: { id: number | string; text: string }) => {
      const response = await api.post(`/api/tickets/${id}/comments`, { text });
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tickets', 'detail', variables.id] });
    },
  });

  const reopenTicket = useMutation({
    mutationFn: async ({ id, reason }: { id: number | string; reason: string }) => {
      const response = await api.post(`/api/tickets/${id}/reopen`, { reason });
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      queryClient.invalidateQueries({ queryKey: ['tickets', 'detail', variables.id] });
    },
  });

  const submitFeedback = useMutation({
    mutationFn: async ({ id, feedback }: { id: number | string; feedback: string }) => {
      const response = await api.post(`/api/tickets/${id}/feedback`, { feedback });
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      queryClient.invalidateQueries({ queryKey: ['tickets', 'detail', variables.id] });
    },
  });

  const reassignTicket = useMutation({
    mutationFn: async ({ id, staff_id }: { id: number | string; staff_id: number }) => {
      const response = await api.patch(`/api/tickets/${id}/assign`, { staff_id });
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      queryClient.invalidateQueries({ queryKey: ['tickets', 'detail', variables.id] });
    },
  });

  return {
    useMyTickets,
    useAssignedTickets,
    useAllTickets,
    useTicketDetails,
    createTicket,
    updateStatus,
    addComment,
    reopenTicket,
    submitFeedback,
    reassignTicket,
  };
};
