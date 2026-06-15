import getAuthToken from "@/services/cookies";

export const decodeToken = () => {
  const token = getAuthToken();
  if (!token) return null;

  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
};
