import { ROUTES } from "@/constants/routes";
import { ApiResponse, SuccessResponse } from "@/types/apiResponse";
import { getAuthCookie } from "@/utils/authCookie";
import { http } from "@/utils/http";
import { toastError } from "@/utils/toasts";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

type Method = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

interface Props<Res> {
  method?: Method;
  onSuccess?: (res: SuccessResponse<Res>) => void;
}

export const useRequest = <Res, Dto = undefined>(
  endpoint: string,
  { method = "POST", onSuccess }: Props<Res>
) => {
  const navigate = useNavigate();
  const [current, setCurrent] = useState<Dto | null>(null);

  const mutation = useMutation({
    mutationFn: async (dto?: Dto): ApiResponse<Res> => {
      setCurrent(dto || null);
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
          return (
            await axios.get(http + endpoint + (dto ? String(dto) : ""), options)
          ).data;
        case "DELETE":
          return (
            await axios.delete(
              http + endpoint + (dto ? String(dto) : ""),
              options
            )
          ).data;
      }
    },
    onSuccess: (res) => {
      if (res.status !== 200) return toastError(res.message);
      setCurrent(null);
      onSuccess?.(res);
    },
    onError: (e: AxiosError) => {
      setCurrent(null);
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
  type SendFn = Dto extends undefined
    ? (concat?: string) => void
    : (param: Dto) => void;
  const send: SendFn = ((param?: Dto) => {
    mutation.mutate(param);
  }) as SendFn;

  return {
    send,
    loading: mutation.isPending,
    current,
  };
};
