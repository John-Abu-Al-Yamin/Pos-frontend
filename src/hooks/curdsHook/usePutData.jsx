
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Check, X } from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import putRequest from "../handleRequest/PutRequest";

const usePutData = (url, mutationKeys, invalidateQueryKey) => {
  const token = useSelector((state) => state.auth.token);
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

      return putRequest(finalUrl, data, token);
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
          icon: (
            <Check
              size={20}
              className="text-white bg-success-400 rounded-full"
            />
          ),
          style: {
            border: "1px solid #81D4A9",
            color: "#2E2E34",
            backgroundColor: "#D7F4E1",
            fontSize: "18px",
            fontWeight: "800",
            height: "20px",
            width: "512px",
            padding: "30px 20px",
            borderRadius: "12px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          },
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
              toast.error(message, {
                duration: 2000,
                icon: (
                  <X
                    size={20}
                    className="text-white bg-danger-500 rounded-full"
                  />
                ),
                style: {
                  border: "1px solid #FFA2A2",
                  color: "#2E2E34",
                  backgroundColor: "#FFE1E1",
                  fontSize: "18px",
                  fontWeight: "800",
                  height: "20px",
                  width: "512px",
                  padding: "30px 20px",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                },
              });
            });
          } else if (typeof errorData.message === "string") {
            toast.error(errorData.message, {
              duration: 2000,
              icon: (
                <X
                  size={20}
                  className="text-white bg-danger-500 rounded-full"
                />
              ),
              style: {
                border: "1px solid #FFA2A2",
                color: "#2E2E34",
                backgroundColor: "#FFE1E1",
                fontSize: "18px",
                fontWeight: "800",
                height: "20px",
                width: "512px",
                padding: "30px 20px",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              },
            });
          }
        } else {
          toast.error("حدث خطأ غير متوقع", {
            duration: 2000,
            style: {
              duration: 2000,
              icon: (
                <X
                  size={20}
                  className="text-white bg-danger-500 rounded-full"
                />
              ),
              style: {
                border: "1px solid #FFA2A2",
                color: "#2E2E34",
                backgroundColor: "#FFE1E1",
                fontSize: "18px",
                fontWeight: "800",
                height: "20px",
                width: "512px",
                padding: "30px 20px",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              },
            },
          });
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
