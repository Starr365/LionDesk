import { useMutation, useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { UserProfile } from '../components/shared/AuthContext';

export interface VerifyRegistryPayload {
  matric_no: string;
  full_name: string;
}

export interface VerifyRegistryResponse {
  message: string;
}

export interface ActivatePayload {
  matric_no: string;
  full_name: string;
  email: string;
  password: string;
}

export interface ActivateResponse {
  message: string;
  token: string;
  user: UserProfile;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: UserProfile;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ForgotPasswordResponse {
  message: string;
}

export interface ResetPasswordPayload {
  token: string;
  new_password: string;
}

export interface ResetPasswordResponse {
  message: string;
}

export const useAuth = () => {
  // 1. Verify registry details
  const verifyRegistryMutation = useMutation<VerifyRegistryResponse, Error, VerifyRegistryPayload>({
    mutationFn: async (payload) => {
      const response = await api.post<VerifyRegistryResponse>('/api/auth/verify-registry', payload);
      return response.data;
    },
  });

  // 2. Self-activation
  const activateMutation = useMutation<ActivateResponse, Error, ActivatePayload>({
    mutationFn: async (payload) => {
      const response = await api.post<ActivateResponse>('/api/auth/activate', payload);
      return response.data;
    },
  });

  // 3. User Login
  const loginMutation = useMutation<LoginResponse, Error, LoginPayload>({
    mutationFn: async (payload) => {
      const response = await api.post<LoginResponse>('/api/auth/login', payload);
      return response.data;
    },
  });

  // 4. Forgot Password request
  const forgotPasswordMutation = useMutation<ForgotPasswordResponse, Error, ForgotPasswordPayload>({
    mutationFn: async (payload) => {
      const response = await api.post<ForgotPasswordResponse>('/api/auth/forgot-password', payload);
      return response.data;
    },
  });

  // 5. Reset Password validation
  const resetPasswordMutation = useMutation<ResetPasswordResponse, Error, ResetPasswordPayload>({
    mutationFn: async (payload) => {
      const response = await api.post<ResetPasswordResponse>('/api/auth/reset-password', payload);
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
      const response = await api.get<UserProfile>('/api/users/me');
      return response.data;
    },
    retry: false,
    ...options,
  });
};
