import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';

export interface Category {
  id: number;
  name: string;
  description: string;
  escalation_hours: number;
  is_active: boolean;
}

export const useCategories = () => {
  const queryClient = useQueryClient();

  const useCategoriesList = () =>
    useQuery<Category[]>({
      queryKey: ['categories'],
      queryFn: async () => {
        const response = await api.get('/api/admin/categories');
        return response.data;
      },
    });

  const createCategory = useMutation({
    mutationFn: async (payload: { name: string; description?: string; escalation_hours: number }) => {
      const response = await api.post('/api/admin/categories', payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });

  const updateCategory = useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: Partial<Omit<Category, 'id'>> }) => {
      const response = await api.patch(`/api/admin/categories/${id}`, payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });

  const deleteCategory = useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(`/api/admin/categories/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });

  return {
    useCategoriesList,
    createCategory,
    updateCategory,
    deleteCategory,
  };
};
