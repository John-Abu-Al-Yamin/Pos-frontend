import endPoints from "@/hooks/EndPoints/endPoints";
import queryKeys from "@/hooks/EndPoints/queryKeys";
import usePostData from "@/hooks/curdsHook/usePostData";

import { setAuthCookie } from "@/services/cookies";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const useLogin = () => {
  const [errorMsg, setErrorMsg] = useState(null);

  const navigate = useNavigate();

  const { mutate, data, error, isPending, isSuccess, isError } = usePostData(
    endPoints.login,
    [queryKeys.login],
    [queryKeys.login]
  );

  useEffect(() => {
    if (isSuccess && data) {
      // استخراج التوكن كسلسلة نصية من الاستجابة
      const apiToken = data?.data?.data?.token || data?.data?.token;

      console.log("login response", data?.data);
      console.log("apiToken", apiToken);

      if (typeof apiToken === "string" && apiToken.length > 0) {
        setAuthCookie(apiToken);
      }
    }

    if (isError && error) {
      const serverErr =
        error?.response?.data?.errors?.[0] ||
        error?.response?.data?.message ||
        error?.message ||
        "Login failed";
      setErrorMsg(serverErr);
    }
  }, [data, isSuccess, isError, error, navigate]);

  return {
    mutate,
    data,
    error,
    isPending,
    isSuccess,
    isError,
    errorMsg,
    setErrorMsg,
  };
};

export default useLogin;
