import endPoints from "@/hooks/EndPoints/endPoints";
import queryKeys from "@/hooks/EndPoints/queryKeys";
import useGetData from "@/hooks/curdsHook/useGetData";
import usePostData from "@/hooks/curdsHook/usePostData";

export const useGetAllSalesReturnHeaders = (page = 1, per_page = 12, filters = {}) => {
  const params = {
    page,
    per_page,
    ...Object.fromEntries(
      Object.entries(filters).filter(([_, v]) => v !== undefined && v !== ""),
    ),
  };

  const { data, isPending, refetch, ...rest } = useGetData({
    url: endPoints.salesReturns,
    params,
    queryKeys: [queryKeys.salesReturns, page, per_page, JSON.stringify(filters)],
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

export const useGetSalesReturnHeaderById = (id) => {
  const { data, isPending, refetch, ...rest } = useGetData({
    url: `${endPoints.salesReturns}/${id}`,
    params: { id },
    queryKeys: [queryKeys.salesReturns, id],
  });

  return {
    data,
    isPending,
    isError: rest.error,
    refetch,
  };
};

