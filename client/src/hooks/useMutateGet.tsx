import { useQueryClient } from "@tanstack/react-query";

export const useMutateGet = () => {
  const queryClient = useQueryClient();

  const setQueryData = <T,>(keys: string[], cb: (old: T) => T) => {
    queryClient.setQueryData(["tiendas"], (old: T) => cb(old));
  };

  return { setQueryData };
};
