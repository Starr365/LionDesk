import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';

export interface StaffUser {
  id: number;
  full_name: string;
  email: string;
  is_active: boolean;
  workload_count: number;
  category_id: number | null;
  category: string | null;
}

export interface RegistryRecord {
  id: number;
  matric_no: string;
  full_name: string;
  email: string;
  is_used: boolean;
}

export interface ReportsData {
  byCategory: { name: string; count: number }[];
  byStatus: { status: string; count: number }[];
  timeline: { date: string; count: number }[];
}

export const useStaff = () => {
  const queryClient = useQueryClient();

  const useStaffList = () =>
    useQuery<StaffUser[]>({
      queryKey: ['staff'],
      queryFn: async () => {
        const response = await api.get('/api/admin/staff');
        return response.data;
      },
    });

  const createStaff = useMutation({
    mutationFn: async (payload: { name: string; email: string; category_id: number }) => {
      const response = await api.post('/api/admin/staff', payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
    },
  });

  const toggleActiveState = useMutation({
    mutationFn: async (userId: number) => {
      const response = await api.patch(`/api/admin/users/${userId}/toggle-active`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });

  const resetPassword = useMutation({
    mutationFn: async ({ userId, password }: { userId: number; password: string }) => {
      const response = await api.post(`/api/admin/users/${userId}/reset-password`, { password });
      return response.data;
    },
  });

  const useRegistry = () =>
    useQuery<RegistryRecord[]>({
      queryKey: ['registry'],
      queryFn: async () => {
        const response = await api.get('/api/admin/registry');
        return response.data;
      },
    });

  const useReports = () =>
    useQuery<ReportsData>({
      queryKey: ['reports'],
      queryFn: async () => {
        const response = await api.get('/api/admin/reports');
        return response.data;
      },
    });

  return {
    useStaffList,
    createStaff,
    toggleActiveState,
    resetPassword,
    useRegistry,
    useReports,
  };
};
