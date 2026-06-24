
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useState } from "react";
import { toast } from "sonner";
import putRequest from "../handleRequest/PutRequest";

const usePutData = (url, mutationKeys, invalidateQueryKey) => {
  
  const queryClient = useQueryClient();
  const [requestData, setRequestData] = useState(null);
  const [toastId, setToastId] = useState(null);

  const mutation = useMutation({
    mutationKey: mutationKeys,

    mutationFn: async ({ data, url: overrideUrl }) => {
      setRequestData(data);
      const finalUrl = overrideUrl || url;

      const loadingToast = toast.loading("جاري المعالجة...");
      setToastId(loadingToast);

      return putRequest(finalUrl, data);
    },

    onSuccess: (data, variables) => {
      const { disableSuccessToast, onSuccess: callOnSuccess } = variables || {};

      if (toastId) {
        toast.dismiss(toastId);
        setToastId(null);
      }

      const invalidateKeys = Array.isArray(invalidateQueryKey)
        ? invalidateQueryKey
        : [invalidateQueryKey];

      // invalidateKeys.forEach((key) => {
      //   queryClient.invalidateQueries({ queryKey: [key] });
      // });

      invalidateKeys.forEach((key) => {
        queryClient.invalidateQueries({
          predicate: (query) => query.queryKey[0] === key,
        });
      });

      if (!disableSuccessToast) {
        const successMessage = data?.data?.message || "Success!";
        toast.success(successMessage, {
          duration: 2000,
        });
      }

      if (typeof callOnSuccess === "function") {
        callOnSuccess(data);
      }
    },

    onError: (error, variables) => {
      const { disableErrorToast, onError: callOnError } = variables || {};

      if (toastId) {
        toast.dismiss(toastId);
        setToastId(null);
      }

      if (!disableErrorToast) {
        const errorData = error?.response?.data;

        if (errorData?.message) {
          if (typeof errorData.message === "object") {
            Object.entries(errorData.message).forEach(([field, message]) => {
              toast.error(message);
            });
          } else if (typeof errorData.message === "string") {
            toast.error(errorData.message);
          }
        } else {
          toast.error("حدث خطأ غير متوقع");
        }
      }

      if (typeof callOnError === "function") {
        callOnError(error);
      }
    },
  });

  return {
    requestData,
    ...mutation,
  };
};

export default usePutData;
