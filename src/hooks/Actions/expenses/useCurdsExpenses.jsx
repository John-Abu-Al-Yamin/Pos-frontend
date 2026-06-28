import endPoints from "@/hooks/EndPoints/endPoints";
import queryKeys from "@/hooks/EndPoints/queryKeys";
import useDeleteData from "@/hooks/curdsHook/useDeleteData";
import useGetData from "@/hooks/curdsHook/useGetData";
import usePutData from "@/hooks/curdsHook/usePutData";
import usePostData from "@/hooks/curdsHook/usePostData";

export const useGetAllExpenses = (params = {}) => {
  const { data, isPending, refetch, ...rest } = useGetData({
    url: endPoints.expenses,
    params: { page: 1, per_page: 10, ...params },
    queryKeys: [queryKeys.expenses, params],
  });

  return { data, isPending, isError: rest.error, refetch };
};

export const useGetExpenseSummary = () => {
  const { data, isPending, refetch, ...rest } = useGetData({
    url: endPoints.expenseSummary,
    params: { page: 1, per_page: 1 },
    queryKeys: [queryKeys.expenseSummary],
  });

  return { data, isPending, isError: rest.error, refetch };
};

export const useAddExpense = () => {
  const { mutate, data, error, isPending, isSuccess, isError } = usePostData(
    endPoints.expenses,
    [queryKeys.addExpenses],
    [queryKeys.expenses, queryKeys.addExpenses, queryKeys.expenseSummary, queryKeys.dashboard],
  );

  return { mutate, data, error, isPending, isSuccess, isError };
};

export const useUpdateExpense = (id) => {
  const { mutate, data, error, isPending, isSuccess, isError } = usePutData(
    `${endPoints.expenses}/${id}`,
    [queryKeys.expenses, id],
    [queryKeys.expenses, queryKeys.expenseSummary, queryKeys.dashboard],
  );

  return { mutate, data, error, isPending, isSuccess, isError };
};

export const useDeleteExpense = () => {
  const { mutate, data, error, isPending, isSuccess, isError } = useDeleteData(
    endPoints.expenses,
    [queryKeys.deleteExpenses],
    [queryKeys.expenses, queryKeys.deleteExpenses, queryKeys.expenseSummary, queryKeys.dashboard],
  );

  return { mutate, data, error, isPending, isSuccess, isError };
};
