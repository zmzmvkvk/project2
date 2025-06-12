import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchTemplates,
  fetchTemplate,
  createTemplate,
  deleteTemplate,
} from "../api/templateApi";

export function useTemplates(category) {
  return useQuery({
    queryKey: ["templates", category],
    queryFn: () => fetchTemplates(category),
    select: (res) => res.data,
  });
}

export function useTemplate(id) {
  return useQuery({
    queryKey: ["template", id],
    queryFn: () => fetchTemplate(id),
    enabled: !!id,
    select: (res) => res.data,
  });
}

export function useCreateTemplate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries(["templates"]);
    },
  });
}

export function useDeleteTemplate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries(["templates"]);
    },
  });
}
