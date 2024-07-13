import { ENDPOINTS } from "@/constants/endpoints";
import { ROUTES } from "@/constants/routes";
import { ApiResponse, SuccessResponse } from "@/types/apiResponse";
import { getAuthCookie } from "@/utils/authCookie";
import { http } from "@/utils/http";
import { toastError } from "@/utils/toasts";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";

type Method = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

interface Props<Res> {
  method?: Method;
  onSuccess?: (res: SuccessResponse<Res>) => void;
}

export const useRequest = <Res, Dto = undefined>(
  endpoint: ENDPOINTS,
  { method = "POST", onSuccess }: Props<Res>
) => {
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: async (dto?: Dto): ApiResponse<Res> => {
      const token = getAuthCookie();
      const options = token
        ? {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        : undefined;
      switch (method) {
        case "POST":
          return (await axios.post(http + endpoint, dto, options)).data;
        case "PUT":
          return (await axios.put(http + endpoint, dto, options)).data;
        case "PATCH":
          return (await axios.patch(http + endpoint, dto, options)).data;
        case "GET":
          return (await axios.get(http + endpoint, options)).data;
        case "DELETE":
          return (await axios.get(http + endpoint, options)).data;
      }
    },
    onSuccess: (res) => {
      if (res.status !== 200) return toastError(res.message);
      onSuccess?.(res);
    },
    onError: (e: AxiosError) => {
      if (!e.response) return console.error(e);
      const { status, statusText } = e.response;
      if (statusText) {
        toastError(statusText);
      }
      if (status === 401) {
        navigate(ROUTES.INDEX);
      }
    },
  });

  //* HANDLE ERRORS ON send CALL
  type SendFn = Dto extends undefined ? () => void : (dto: Dto) => void;
  const send: SendFn = ((dto?: Dto) => {
    mutation.mutate(dto);
  }) as SendFn;

  return {
    send,
    loading: mutation.isPending,
  };
};
