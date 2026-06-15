import Cookies from "js-cookie";

const TOKEN_NAME = "Realestate_TOKEN";

const setAuthCookie = (token) => {
  Cookies.set(TOKEN_NAME, token);
};

const getAuthToken = () => {
  return Cookies.get(TOKEN_NAME) || "";
};

const checkAuthToken = () => {
  return !!getAuthToken();
};

const removeAuthToken = () => {
  Cookies.remove(TOKEN_NAME);
};

export default getAuthToken;
export { checkAuthToken, removeAuthToken, setAuthCookie };
