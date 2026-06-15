import { request } from "@/services/clientService";

const postRequest = (url, data, token) => {
  return request(
    {
      method: "POST",
      url: url,
      data,
    },
    token
  );
};

export default postRequest;
