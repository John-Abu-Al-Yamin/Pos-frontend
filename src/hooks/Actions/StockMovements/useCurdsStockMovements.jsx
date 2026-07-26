import endPoints from "@/hooks/EndPoints/endPoints";
import queryKeys from "@/hooks/EndPoints/queryKeys";
import useGetData from "@/hooks/curdsHook/useGetData";

export const useGetAllStockMovements = (page = 1, per_page = 12, filters = {}) => {
  const params = {
    page,
    per_page,
    ...Object.fromEntries(
      Object.entries(filters).filter(([_, v]) => v !== undefined && v !== ""),
    ),
  };

  const { data, isPending, refetch, ...rest } = useGetData({
    url: endPoints.stockMovements,
    params,
    queryKeys: [queryKeys.stockMovements, page, per_page, JSON.stringify(filters)],
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

export const useGetStockMovementById = (id) => {
  const { data, isPending, refetch, ...rest } = useGetData({
    url: `${endPoints.stockMovements}/${id}`,
    queryKeys: [queryKeys.stockMovements, id],
  });

  return {
    data,
    isPending,
    isError: rest.error,
    refetch,
  };
};
