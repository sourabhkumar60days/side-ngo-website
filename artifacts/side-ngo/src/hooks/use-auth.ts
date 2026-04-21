import { 
  useAdminMe as useGeneratedAdminMe,
  useAdminLogin as useGeneratedAdminLogin,
  useAdminLogout as useGeneratedAdminLogout
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";

export function useAuth() {
  const { data, isLoading, error } = useGeneratedAdminMe({
    query: {
      retry: false,
      staleTime: 5 * 60 * 1000,
    }
  });

  return {
    isAuthenticated: data?.authenticated ?? false,
    user: data?.username ? { username: data.username } : null,
    isLoading,
    error
  };
}

export function useLogin() {
  const queryClient = useQueryClient();
  const mutation = useGeneratedAdminLogin();
  
  return {
    ...mutation,
    mutateAsync: async (data: any) => {
      const result = await mutation.mutateAsync({ data });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/me"] });
      return result;
    }
  };
}

export function useLogout() {
  const queryClient = useQueryClient();
  const mutation = useGeneratedAdminLogout();
  
  return {
    ...mutation,
    mutateAsync: async () => {
      await mutation.mutateAsync();
      queryClient.setQueryData(["/api/admin/me"], { authenticated: false });
    }
  };
}
