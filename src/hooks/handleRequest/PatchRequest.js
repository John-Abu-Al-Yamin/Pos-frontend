import { request } from "@/services/clientService";

const patchRequest = (url, data, token) => {
  return request(
    {
      method: "POST",
      url: url,
      data,
    },
    token
  );
};

export default patchRequest;
