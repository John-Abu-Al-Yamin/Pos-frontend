import endPoints from "@/hooks/EndPoints/endPoints";
import queryKeys from "@/hooks/EndPoints/queryKeys";
import usePostData from "@/hooks/curdsHook/usePostData";
import usePutData from "@/hooks/curdsHook/usePutData";
import useDeleteData from "@/hooks/curdsHook/useDeleteData";

export const useAddSalaryPaymentItem = () => {
  const { mutate, data, error, isPending, isSuccess, isError } = usePostData(
    endPoints.salaryPaymentItems,
    [queryKeys.addSalaryPaymentItems],
    [queryKeys.salaryPayments, queryKeys.addSalaryPaymentItems],
  );

  const mutateWithPayment = (paymentId, payload, options) => {
    mutate(
      {
        url: `${endPoints.salaryPayments}/${paymentId}/items`,
        data: payload.data,
      },
      options,
    );
  };

  return { mutate: mutateWithPayment, data, error, isPending, isSuccess, isError };
};

export const useUpdateSalaryPaymentItem = () => {
  const { mutate: originalMutate, data, error, isPending, isSuccess, isError } = usePutData(
    endPoints.salaryPaymentItems,
    [queryKeys.updateSalaryPaymentItems],
    [queryKeys.salaryPayments, queryKeys.updateSalaryPaymentItems],
  );

  const mutate = (paymentId, itemId, payload, options) => {
    originalMutate(
      {
        url: `${endPoints.salaryPayments}/${paymentId}/items/${itemId}`,
        data: payload.data,
      },
      options,
    );
  };

  return { mutate, data, error, isPending, isSuccess, isError };
};

export const useDeleteSalaryPaymentItem = () => {
  const { mutate: originalMutate, ...rest } = useDeleteData(
    endPoints.salaryPaymentItems,
    [queryKeys.deleteSalaryPaymentItems],
    [queryKeys.salaryPayments, queryKeys.deleteSalaryPaymentItems],
  );

  const mutate = (paymentId, itemId, options) => {
    originalMutate(
      { url: `${endPoints.salaryPayments}/${paymentId}/items/${itemId}` },
      options,
    );
  };

  return { mutate, ...rest };
};
