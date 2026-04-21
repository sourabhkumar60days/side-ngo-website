import { 
  useListTeamMembers as useGeneratedListTeamMembers, 
  useCreateTeamMember as useGeneratedCreateTeamMember,
  useUpdateTeamMember as useGeneratedUpdateTeamMember,
  useDeleteTeamMember as useGeneratedDeleteTeamMember
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";

export function useTeamMembers() {
  return useGeneratedListTeamMembers();
}

export function useCreateTeamMember() {
  const queryClient = useQueryClient();
  const mutation = useGeneratedCreateTeamMember();
  
  return {
    ...mutation,
    mutateAsync: async (data: any) => {
      const result = await mutation.mutateAsync({ data });
      queryClient.invalidateQueries({ queryKey: ["/api/team"] });
      return result;
    }
  };
}

export function useUpdateTeamMember() {
  const queryClient = useQueryClient();
  const mutation = useGeneratedUpdateTeamMember();
  
  return {
    ...mutation,
    mutateAsync: async ({ id, data }: { id: number, data: any }) => {
      const result = await mutation.mutateAsync({ id, data });
      queryClient.invalidateQueries({ queryKey: ["/api/team"] });
      return result;
    }
  };
}

export function useDeleteTeamMember() {
  const queryClient = useQueryClient();
  const mutation = useGeneratedDeleteTeamMember();
  
  return {
    ...mutation,
    mutateAsync: async (id: number) => {
      const result = await mutation.mutateAsync({ id });
      queryClient.invalidateQueries({ queryKey: ["/api/team"] });
      return result;
    }
  };
}
