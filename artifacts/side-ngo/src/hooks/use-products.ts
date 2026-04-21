import { 
  useListProducts as useGeneratedListProducts,
  useCreateProduct as useGeneratedCreateProduct,
  useUpdateProduct as useGeneratedUpdateProduct,
  useDeleteProduct as useGeneratedDeleteProduct,
  useListCategories as useGeneratedListCategories,
  useCreateCategory as useGeneratedCreateCategory,
  useUpdateCategory as useGeneratedUpdateCategory,
  useDeleteCategory as useGeneratedDeleteCategory
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";

export function useProducts(categoryId?: number) {
  return useGeneratedListProducts(categoryId ? { categoryId } : undefined);
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  const mutation = useGeneratedCreateProduct();
  return {
    ...mutation,
    mutateAsync: async (data: any) => {
      const result = await mutation.mutateAsync({ data });
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      return result;
    }
  };
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  const mutation = useGeneratedUpdateProduct();
  return {
    ...mutation,
    mutateAsync: async ({ id, data }: { id: number, data: any }) => {
      const result = await mutation.mutateAsync({ id, data });
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      return result;
    }
  };
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  const mutation = useGeneratedDeleteProduct();
  return {
    ...mutation,
    mutateAsync: async (id: number) => {
      const result = await mutation.mutateAsync({ id });
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      return result;
    }
  };
}

export function useCategories() {
  return useGeneratedListCategories();
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  const mutation = useGeneratedCreateCategory();
  return {
    ...mutation,
    mutateAsync: async (data: any) => {
      const result = await mutation.mutateAsync({ data });
      queryClient.invalidateQueries({ queryKey: ["/api/products/categories"] });
      return result;
    }
  };
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();
  const mutation = useGeneratedUpdateCategory();
  return {
    ...mutation,
    mutateAsync: async ({ id, data }: { id: number, data: any }) => {
      const result = await mutation.mutateAsync({ id, data });
      queryClient.invalidateQueries({ queryKey: ["/api/products/categories"] });
      return result;
    }
  };
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  const mutation = useGeneratedDeleteCategory();
  return {
    ...mutation,
    mutateAsync: async (id: number) => {
      const result = await mutation.mutateAsync({ id });
      queryClient.invalidateQueries({ queryKey: ["/api/products/categories"] });
      return result;
    }
  };
}
