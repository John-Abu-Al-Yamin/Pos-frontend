import endPoints from "@/hooks/EndPoints/endPoints";
import queryKeys from "@/hooks/EndPoints/queryKeys";
import useGetData from "@/hooks/curdsHook/useGetData";
import usePostData from "@/hooks/curdsHook/usePostData";

export const useGetAllReturns = (params = {}) => {
  const { data, isPending, refetch, ...rest } = useGetData({
    url: endPoints.returns,
    params,
    queryKeys: [queryKeys.returns, params],
  });

  return { data, isPending, isError: rest.error, refetch };
};

export const useGetReturnById = (id) => {
  const { data, isPending, refetch, ...rest } = useGetData({
    url: `${endPoints.returns}/${id}`,
    params: { id },
    queryKeys: [queryKeys.returns, id],
    enabled: !!id,
  });

  return {
    data,
    isPending,
    isError: rest.error,
    refetch,
  };
};

export const useGetSaleReturnable = (id) => {
  const { data, isPending, refetch, ...rest } = useGetData({
    url: `${endPoints.sales}/${id}/returnable`,
    params: { id },
    queryKeys: [queryKeys.sales, id, "returnable"],
    enabled: !!id,
  });

  return {
    data,
    isPending,
    isError: rest.error,
    refetch,
  };
};

export const useAddReturn = () => {
  const { mutate, data, error, isPending, isSuccess, isError } = usePostData(
    endPoints.returns,
    [queryKeys.addreturns],
    [queryKeys.returns, queryKeys.addreturns, queryKeys.sales],
  );

  return { mutate, data, error, isPending, isSuccess, isError };
};
