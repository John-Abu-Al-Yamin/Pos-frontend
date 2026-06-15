import { request } from "@/services/clientService";

const putRequest = (url, data, token) => {
  return request(
    {
      method: "PUT",
      url: url,
      data,
    },
    token
  );
};

export default putRequest;
