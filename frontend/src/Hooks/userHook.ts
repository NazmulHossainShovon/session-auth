import { useMutation, useQuery } from '@tanstack/react-query';
import { People, User } from '../Types/types';
import apiClient from '../ApiClient';

export const useSignupMutation = () =>
  useMutation({
    mutationFn: async (userInfo: {
      name: string;
      email: string;
      password: string;
      image: string;
    }) => {
      const res = await apiClient.post<{ user: User; token: string }>(
        'api/users/signup',
        userInfo,
        {
          withCredentials: true,
        }
      );
      return res.data;
    },
  });

export const useSigninMutation = () =>
  useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      const res = await apiClient.post<{ user: User; token: string }>(
        'api/users/signin',
        {
          email,
          password,
        },
        {
          withCredentials: true,
        }
      );
      return res.data;
    },
  });

export const useGetUserInfo = (userName: string | undefined) =>
  useQuery({
    queryKey: ['user', userName],
    queryFn: async () => {
      const res = await apiClient.get<User>('api/users', {
        params: { userName },
        withCredentials: true,
      });
      return res.data;
    },
  });

export const useSearchUsers = (query: string) =>
  useQuery({
    queryKey: [query],
    queryFn: async () => {
      const res = await apiClient.get<People[]>('api/search', {
        params: { query },
        withCredentials: true,
      });
      return res.data;
    },
  });

export const useSendFriendRequest = () => {
  return useMutation({
    mutationFn: async ({
      sender,
      receiver,
    }: {
      sender: string;
      receiver: string | undefined;
    }) => {
      const res = await apiClient.put<User>(
        'api/users/friendRequest',
        {
          sender,
          receiver,
        },
        { withCredentials: true }
      );
      return res.data;
    },
  });
};

export const useCancelFriendRequest = () => {
  return useMutation({
    mutationFn: async ({
      sender,
      receiver,
    }: {
      sender: string | undefined;
      receiver: string | undefined;
    }) => {
      const res = await apiClient.put<{ receiver: any; sender: any }>(
        'api/users/cancelRequest',
        {
          sender,
          receiver,
        },
        { withCredentials: true }
      );
      return res.data;
    },
  });
};

export const useAcceptFriendRequest = () => {
  return useMutation({
    mutationFn: async ({
      sender,
      receiver,
    }: {
      sender: string | undefined;
      receiver: string;
    }) => {
      const res = await apiClient.put<User>(
        'api/users/acceptRequest',
        {
          sender,
          receiver,
        },
        { withCredentials: true }
      );
      return res.data;
    },
  });
};

export const useUnfriend = () => {
  return useMutation({
    mutationFn: async ({
      user1,
      user2,
    }: {
      user1: string;
      user2: string | undefined;
    }) => {
      const res = await apiClient.put(
        'api/users/unfriend',
        {
          user1,
          user2,
        },
        { withCredentials: true }
      );
      return res.data;
    },
  });
};
