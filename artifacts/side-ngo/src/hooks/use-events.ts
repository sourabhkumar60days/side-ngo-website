import { 
  useListEvents as useGeneratedListEvents, 
  useCreateEvent as useGeneratedCreateEvent,
  useUpdateEvent as useGeneratedUpdateEvent,
  useDeleteEvent as useGeneratedDeleteEvent,
  useGetEvent as useGeneratedGetEvent
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";

export function useEvents() {
  return useGeneratedListEvents();
}

export function useEvent(id: number) {
  return useGeneratedGetEvent(id, { query: { enabled: !!id } });
}

export function useCreateEvent() {
  const queryClient = useQueryClient();
  const mutation = useGeneratedCreateEvent();
  
  return {
    ...mutation,
    mutateAsync: async (data: any) => {
      const result = await mutation.mutateAsync({ data });
      queryClient.invalidateQueries({ queryKey: ["/api/events"] });
      return result;
    }
  };
}

export function useUpdateEvent() {
  const queryClient = useQueryClient();
  const mutation = useGeneratedUpdateEvent();
  
  return {
    ...mutation,
    mutateAsync: async ({ id, data }: { id: number, data: any }) => {
      const result = await mutation.mutateAsync({ id, data });
      queryClient.invalidateQueries({ queryKey: ["/api/events"] });
      queryClient.invalidateQueries({ queryKey: [`/api/events/${id}`] });
      return result;
    }
  };
}

export function useDeleteEvent() {
  const queryClient = useQueryClient();
  const mutation = useGeneratedDeleteEvent();
  
  return {
    ...mutation,
    mutateAsync: async (id: number) => {
      const result = await mutation.mutateAsync({ id });
      queryClient.invalidateQueries({ queryKey: ["/api/events"] });
      return result;
    }
  };
}
