import axios from "axios";
import getAuthToken from "./cookies";

const clientApi = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
});

export const request = async (options) => {
  const token = getAuthToken();
  console.log(options);

  try {
    const res = await clientApi.request({
      ...options,
      headers: {
        ...options.headers,
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    return res;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error;
    } else {
      throw new Error("Unexpected error");
    }
  }
};
