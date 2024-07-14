export const http = import.meta.env.VITE_HTTP;

export const getHttpImage = (src: string | null | undefined) => {
  if (!src) return undefined;
  return http.replace("api/", "") + "storage/" + src;
};
