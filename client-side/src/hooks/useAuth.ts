import { useMutation, useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { UserProfile } from '../components/shared/AuthContext';

export const useAuth = () => {
  // 1. Verify registry details
  const verifyRegistryMutation = useMutation({
    mutationFn: async (payload: { matric_no: string; full_name: string }) => {
      const response = await api.post('/api/auth/verify-registry', payload);
      return response.data; // { email }
    },
  });

  // 2. Self-activation
  const activateMutation = useMutation({
    mutationFn: async (payload: { matric_no: string; full_name: string; email: string; password: string }) => {
      const response = await api.post('/api/auth/activate', payload);
      return response.data; // { token, user }
    },
  });

  // 3. User Login
  const loginMutation = useMutation({
    mutationFn: async (payload: { email: string; password: string }) => {
      const response = await api.post('/api/auth/login', payload);
      return response.data; // { token, user }
    },
  });

  // 4. Forgot Password request
  const forgotPasswordMutation = useMutation({
    mutationFn: async (payload: { email: string }) => {
      const response = await api.post('/api/auth/forgot-password', payload);
      return response.data;
    },
  });

  // 5. Reset Password validation
  const resetPasswordMutation = useMutation({
    mutationFn: async (payload: { token: string; new_password: string }) => {
      const response = await api.post('/api/auth/reset-password', payload);
      return response.data;
    },
  });

  return {
    verifyRegistry: verifyRegistryMutation,
    activate: activateMutation,
    login: loginMutation,
    forgotPassword: forgotPasswordMutation,
    resetPassword: resetPasswordMutation,
  };
};

// Hook to fetch authenticated profile details
export const useProfile = (options = {}) => {
  return useQuery<UserProfile>({
    queryKey: ['profile'],
    queryFn: async () => {
      const response = await api.get('/api/users/me');
      return response.data;
    },
    retry: false,
    ...options,
  });
};
