"use client";

import useSWR from "swr";

interface UseConsultationsReturn {
  consultations: any[];
  isLoading: boolean;
  error: any;
  mutate: () => void;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useConsultations(): UseConsultationsReturn {
  const { data, error, isLoading, mutate } = useSWR(
    "/api/consultations",
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000,
    }
  );

  return {
    consultations: data?.consultations ?? [],
    isLoading,
    error,
    mutate,
  };
}
