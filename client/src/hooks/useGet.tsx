import { ENDPOINTS } from "@/constants/endpoints";
import { getAuthCookie } from "@/utils/authCookie";
import { http } from "@/utils/http";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useGet = <Res,>(endpoint: ENDPOINTS, keys: string[]) => {
  const { data, isLoading } = useQuery({
    queryKey: keys,
    queryFn: async (): Promise<Res> => {
      const token = getAuthCookie();
      const options = token
        ? {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        : undefined;
      const res = (await axios.get(http + endpoint, options)).data;
      return res.data;
    },
  });

  return { data, loading: isLoading };
};
