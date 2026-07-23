import endPoints from "@/hooks/EndPoints/endPoints";
import queryKeys from "@/hooks/EndPoints/queryKeys";
import useDeleteData from "@/hooks/curdsHook/useDeleteData";
import useGetData from "@/hooks/curdsHook/useGetData";
import usePutData from "@/hooks/curdsHook/usePutData";
import usePostData from "@/hooks/curdsHook/usePostData";

export const useGetAllExpenses = (page = 1, per_page = 12, filters = {}) => {
  const params = {
    page,
    per_page,
    ...Object.fromEntries(
      Object.entries(filters).filter(([_, v]) => v !== undefined && v !== ""),
    ),
  };

  const { data, isPending, refetch, ...rest } = useGetData({
    url: endPoints.expenses,
    params,
    queryKeys: [queryKeys.expenses, page, per_page, JSON.stringify(filters)],
  });

  return {
    data,
    isPending,
    isError: rest.error,
    refetch,
    page,
    per_page,
  };
};

export const useGetExpenseById = (id) => {
  const { data, isPending, refetch, ...rest } = useGetData({
    url: `${endPoints.expenses}/${id}`,
    queryKeys: [queryKeys.expenses, id],
  });

  return {
    data,
    isPending,
    isError: rest.error,
    refetch,
  };
};

export const useDeleteExpenses = () => {
  const { mutate, data, error, isPending, isSuccess, isError } = useDeleteData(
    endPoints.expenses,
    [queryKeys.deleteExpenses],
    [queryKeys.expenses, queryKeys.deleteExpenses],
  );

  return { mutate, data, error, isPending, isSuccess, isError };
};

export const useAddExpenses = () => {
  const { mutate, data, error, isPending, isSuccess, isError } = usePostData(
    endPoints.expenses,
    [queryKeys.addExpenses],
    [queryKeys.expenses, queryKeys.addExpenses],
  );

  return { mutate, data, error, isPending, isSuccess, isError };
};

export const usePayExpense = () => {
  const {
    mutate: originalMutate,
    data,
    error,
    isPending,
    isSuccess,
    isError,
  } = usePostData(
    endPoints.expenses,
    [queryKeys.expenses],
    [queryKeys.expenses],
  );

  const mutate = (id, options) => {
    originalMutate(
      { url: `${endPoints.expenses}/${id}/pay` },
      options,
    );
  };

  return { mutate, data, error, isPending, isSuccess, isError };
};

export const useCancelExpense = () => {
  const {
    mutate: originalMutate,
    data,
    error,
    isPending,
    isSuccess,
    isError,
  } = usePostData(
    endPoints.expenses,
    [queryKeys.expenses],
    [queryKeys.expenses],
  );

  const mutate = (id, options) => {
    originalMutate(
      { url: `${endPoints.expenses}/${id}/cancel` },
      options,
    );
  };

  return { mutate, data, error, isPending, isSuccess, isError };
};
