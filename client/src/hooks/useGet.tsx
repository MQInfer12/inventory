import { getAuthCookie } from "@/utils/authCookie";
import { getParamsStr } from "@/utils/getParamsStr";
import { http } from "@/utils/http";
import { toastError } from "@/utils/toasts";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useEffect } from "react";

interface Options {
  send?: boolean;
  params?: Record<string, string>;
  save?: boolean;
  alert?: boolean;
  onError?: () => void;
}

export const useGet = <Res,>(
  endpoint: string,
  keys: string[],
  options?: Options
) => {
  const thisOptions: Options = {
    params: options?.params,
    save: options?.save ?? true,
    send: options?.send ?? true,
    alert: options?.alert ?? true,
    onError: options?.onError,
  };

  let url = http + endpoint;
  if (thisOptions.params) {
    url += getParamsStr(thisOptions.params);
  }
  const queryClient = useQueryClient();
  const { data, isLoading, refetch } = useQuery({
    queryKey: keys,
    enabled: thisOptions.send,
    queryFn: async (): Promise<Res> => {
      const token = getAuthCookie();
      const options = token
        ? {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        : undefined;
      const res = (await axios.get(url, options)).data;
      if (res.status !== 200) {
        if (thisOptions.alert) {
          toastError(res.message);
        }
        thisOptions.onError?.();
      }
      return res.data;
    },
  });

  useEffect(() => {
    return () => {
      if (!thisOptions.save) {
        queryClient.removeQueries({ queryKey: keys });
      }
    };
  }, [JSON.stringify(keys)]);

  return { data, loading: isLoading, refetch };
};
