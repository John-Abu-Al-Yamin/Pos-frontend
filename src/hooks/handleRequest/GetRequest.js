import { request } from "@/services/clientService";

const getRequest = (url, token, options) => {
  return request(
    {
      method: "GET",
      url: url,
      ...options,
    },
    token
  );
};

export default getRequest;
