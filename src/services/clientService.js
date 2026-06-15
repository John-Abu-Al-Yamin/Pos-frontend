import axios from "axios";
import getAuthToken from "./cookies";

const clientApi = axios.create({
  baseURL: "https://getsimt.com/api/v1",
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
