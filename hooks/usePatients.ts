"use client";

import useSWR from "swr";

interface UsePatientsReturn {
  patients: any[];
  pagination: { total: number; page: number; pages: number } | undefined;
  isLoading: boolean;
  error: any;
  mutate: () => void;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function usePatients(search: string = "", page: number = 1): UsePatientsReturn {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: "10",
  });
  
  if (search) {
    queryParams.set("search", search);
  }

  const { data, error, isLoading, mutate } = useSWR(
    `/api/patients?${queryParams.toString()}`,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000,
    }
  );

  return {
    patients: data?.patients ?? [],
    pagination: data?.pagination,
    isLoading,
    error,
    mutate,
  };
}
