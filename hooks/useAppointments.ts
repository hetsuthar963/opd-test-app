"use client";

import useSWR from "swr";

interface UseAppointmentsReturn {
  appointments: any[];
  isLoading: boolean;
  error: any;
  mutate: () => void;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useAppointments(date: string): UseAppointmentsReturn {
  const { data, error, isLoading, mutate } = useSWR(
    `/api/appointments?date=${date}`,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000,
    }
  );

  return {
    appointments: data?.appointments ?? [],
    isLoading,
    error,
    mutate,
  };
}
