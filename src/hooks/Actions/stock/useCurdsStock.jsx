import endPoints from "@/hooks/EndPoints/endPoints";
import queryKeys from "@/hooks/EndPoints/queryKeys";
import useGetData from "@/hooks/curdsHook/useGetData";

export const useGetAllStock = (params = {}) => {
  const { data, isPending, refetch, ...rest } = useGetData({
    url: endPoints.stockItems,
    params,
    queryKeys: [queryKeys.stockItems, params],
  });

  return {
    data,
    isPending,
    isError: rest.error,
    refetch,
  };
};

export const useGetStockById = (id) => {
  const { data, isPending, refetch, ...rest } = useGetData({
    url: `${endPoints.stockItems}/${id}`,
    queryKeys: [queryKeys.stockItems, id],
    enabled: !!id,
  });

  return {
    data,
    isPending,
    isError: rest.error,
    refetch,
  };
};
