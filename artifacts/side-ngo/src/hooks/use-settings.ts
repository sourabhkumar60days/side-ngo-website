import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

async function fetchSettings(): Promise<Record<string, string>> {
  const res = await fetch(`${BASE}/api/settings`);
  if (!res.ok) throw new Error("Failed to fetch settings");
  return res.json();
}

async function updateSettings(data: Record<string, string>): Promise<void> {
  const res = await fetch(`${BASE}/api/settings`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update settings");
}

export function useSettings() {
  return useQuery({ queryKey: ["settings"], queryFn: fetchSettings });
}

export function useUpdateSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: updateSettings,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["settings"] }),
  });
}
