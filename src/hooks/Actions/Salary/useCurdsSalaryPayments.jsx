import endPoints from "@/hooks/EndPoints/endPoints";
import queryKeys from "@/hooks/EndPoints/queryKeys";
import useGetData from "@/hooks/curdsHook/useGetData";
import usePostData from "@/hooks/curdsHook/usePostData";
import usePutData from "@/hooks/curdsHook/usePutData";

export const useGetAllSalaryPayments = (page = 1, per_page = 12, filters = {}) => {
  const params = {
    page,
    per_page,
    ...Object.fromEntries(
      Object.entries(filters).filter(([_, v]) => v !== undefined && v !== ""),
    ),
  };

  const { data, isPending, refetch, ...rest } = useGetData({
    url: endPoints.salaryPayments,
    params,
    queryKeys: [queryKeys.salaryPayments, page, per_page, JSON.stringify(filters)],
  });

  return { data, isPending, isError: rest.error, refetch, page, per_page };
};

export const useGetSalaryPaymentById = (id) => {
  const { data, isPending, refetch, ...rest } = useGetData({
    url: `${endPoints.salaryPayments}/${id}`,
    queryKeys: [queryKeys.salaryPayments, id],
  });

  return { data, isPending, isError: rest.error, refetch };
};

export const useAddSalaryPayment = () => {
  const { mutate, data, error, isPending, isSuccess, isError } = usePostData(
    endPoints.salaryPayments,
    [queryKeys.addSalaryPayments],
    [queryKeys.salaryPayments, queryKeys.addSalaryPayments],
  );

  return { mutate, data, error, isPending, isSuccess, isError };
};

export const useUpdateSalaryPayment = () => {
  const { mutate, data, error, isPending, isSuccess, isError } = usePutData(
    endPoints.salaryPayments,
    [queryKeys.updateSalaryPayments],
    [queryKeys.salaryPayments, queryKeys.updateSalaryPayments],
  );

  return { mutate, data, error, isPending, isSuccess, isError };
};

export const useConfirmSalaryPayment = () => {
  const { mutate: originalMutate, data, error, isPending, isSuccess, isError } = usePostData(
    endPoints.salaryPayments,
    [queryKeys.salaryPayments],
    [queryKeys.salaryPayments],
  );

  const mutate = (id, options) => {
    originalMutate({ url: `${endPoints.salaryPayments}/${id}/confirm` }, options);
  };

  return { mutate, data, error, isPending, isSuccess, isError };
};

export const useCancelSalaryPayment = () => {
  const { mutate: originalMutate, data, error, isPending, isSuccess, isError } = usePostData(
    endPoints.salaryPayments,
    [queryKeys.salaryPayments],
    [queryKeys.salaryPayments],
  );

  const mutate = (id, options) => {
    originalMutate({ url: `${endPoints.salaryPayments}/${id}/cancel` }, options);
  };

  return { mutate, data, error, isPending, isSuccess, isError };
};
