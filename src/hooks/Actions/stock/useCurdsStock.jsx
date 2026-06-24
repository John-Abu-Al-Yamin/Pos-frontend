import endPoints from "@/hooks/EndPoints/endPoints";
import queryKeys from "@/hooks/EndPoints/queryKeys";
import useGetData from "@/hooks/curdsHook/useGetData";

export const useGetAllStock = (page = 1, per_page = 10) => {
  const { data, isPending, refetch, ...rest } = useGetData({
    url: endPoints.stockItems,
    params: { page, per_page },
    queryKeys: [queryKeys.stockItems],
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
