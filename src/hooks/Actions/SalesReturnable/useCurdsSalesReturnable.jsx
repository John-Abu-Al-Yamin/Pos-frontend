import endPoints from "@/hooks/EndPoints/endPoints";
import queryKeys from "@/hooks/EndPoints/queryKeys";
import useGetData from "@/hooks/curdsHook/useGetData";

export const useGetAllReturnableSales = (page = 1, per_page = 12, filters = {}) => {
  const params = {
    page,
    per_page,
    ...Object.fromEntries(
      Object.entries(filters).filter(([_, v]) => v !== undefined && v !== ""),
    ),
  };

  const { data, isPending, refetch, ...rest } = useGetData({
    url: endPoints.salesReturnable,
    params,
    queryKeys: [queryKeys.salesReturnable, page, per_page, JSON.stringify(filters)],
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

export const useGetReturnableSaleById = (id) => {
  const { data, isPending, refetch, ...rest } = useGetData({
    url: `${endPoints.salesReturnable}/${id}`,
    params: { id },
    queryKeys: [queryKeys.salesReturnable, id],
  });

  return {
    data,
    isPending,
    isError: rest.error,
    refetch,
  };
};
