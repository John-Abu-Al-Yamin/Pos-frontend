import { useAuthContext } from "@/context/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import patchRequest from "../handleRequest/PatchRequest";

const usePatchData = (url, mutationKeys, invalidateQueryKey) => {
  const { token } = useAuthContext();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: mutationKeys,
    mutationFn: async ({ data, url: overrideUrl }) => {
      const finalUrl = overrideUrl || url;
      return patchRequest(finalUrl, data, token);
    },
    onMutate: () => {
      const loadingToastId = toast.loading("جاري التعديل...");
      return { loadingToastId };
    },
    onSuccess: (data, variables, context) => {
      const successMessage = data?.data?.message || "تم التعديل بنجاح!";

      const invalidateKeys = Array.isArray(invalidateQueryKey)
        ? invalidateQueryKey
        : [invalidateQueryKey];

      invalidateKeys.forEach((key) => {
        queryClient.invalidateQueries({ queryKey: [key] });
      });

      const id = context?.loadingToastId;
      if (id) {
        toast.success(successMessage, { id, duration: 3000 });
      } else {
        toast.success(successMessage, { duration: 3000 });
      }
    },
    onError: (error, variables, context) => {
      const errors = error?.response?.data?.errors;
      const message = error?.response?.data?.message || "حدث خطأ ما";
      const toastId = context?.loadingToastId;

      if (errors && typeof errors === "object") {
        for (const key in errors) {
          if (errors[key]) {
            toast.error(errors[key], {
              duration: 2000,
              style: {
                borderRadius: "10px",
                color: "#fff",
                backgroundColor: "red",
              },
            });
          }
        }

        if (toastId) {
          toast.dismiss(toastId);
        }

        return;
      }

      if (toastId) {
        toast.error(message, { id: toastId, duration: 5000 });
      } else {
        toast.error(message, { duration: 5000 });
      }
    },
  });

  return { ...mutation };
};

export default usePatchData;
