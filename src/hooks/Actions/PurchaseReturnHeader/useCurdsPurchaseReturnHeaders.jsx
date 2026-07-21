import endPoints from "@/hooks/EndPoints/endPoints";
import queryKeys from "@/hooks/EndPoints/queryKeys";
import useGetData from "@/hooks/curdsHook/useGetData";
import usePostData from "@/hooks/curdsHook/usePostData";

export const useGetAllPurchaseReturnHeaders = (page = 1, per_page = 12, filters = {}) => {
  const params = {
    page,
    per_page,
    ...Object.fromEntries(
      Object.entries(filters).filter(([_, v]) => v !== undefined && v !== ""),
    ),
  };

  const { data, isPending, refetch, ...rest } = useGetData({
    url: endPoints.purchaseReturns,
    params,
    queryKeys: [queryKeys.purchaseReturnHeaders, page, per_page, JSON.stringify(filters)],
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

export const useGetPurchaseReturnHeaderById = (id) => {
  const { data, isPending, refetch, ...rest } = useGetData({
    url: `${endPoints.purchaseReturns}/${id}`,
    params: { id },
    queryKeys: [queryKeys.purchaseReturnHeaders, id],
  });

  return {
    data,
    isPending,
    isError: rest.error,
    refetch,
  };
};

export const useAddPurchaseReturnHeaders = () => {
  const { mutate, data, error, isPending, isSuccess, isError } = usePostData(
    endPoints.purchaseReturns,
    [queryKeys.addPurchaseReturnHeaders],
    [queryKeys.purchaseReturnHeaders, queryKeys.addPurchaseReturnHeaders],
  );

  return { mutate, data, error, isPending, isSuccess, isError };
};
