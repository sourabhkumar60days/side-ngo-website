import { 
  useListOrders as useGeneratedListOrders,
  useCreateOrder as useGeneratedCreateOrder
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";

export function useOrders() {
  return useGeneratedListOrders();
}

export function useCreateOrder() {
  const queryClient = useQueryClient();
  const mutation = useGeneratedCreateOrder();
  
  return {
    ...mutation,
    mutateAsync: async (data: any) => {
      const result = await mutation.mutateAsync({ data });
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      return result;
    }
  };
}
