import endPoints from "@/hooks/EndPoints/endPoints";
import queryKeys from "@/hooks/EndPoints/queryKeys";
import useGetData from "@/hooks/curdsHook/useGetData";
import usePostData from "@/hooks/curdsHook/usePostData";

export const useGetAllSales = (page = 1, per_page = 10) => {
  const { data, isPending, refetch, ...rest } = useGetData({
    url: endPoints.sales,
    params: { page, per_page },
    queryKeys: [queryKeys.sales, page, per_page],
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

export const useGetSaleById = (id) => {
  const { data, isPending, refetch, ...rest } = useGetData({
    url: `${endPoints.sales}/${id}`,
    params: { id },
    queryKeys: [queryKeys.sales, id],
    enabled: !!id,
  });

  return {
    data,
    isPending,
    isError: rest.error,
    refetch,
  };
};

export const useAddSale = () => {
  const { mutate, data, error, isPending, isSuccess, isError } = usePostData(
    endPoints.sales,
    [queryKeys.addsales],
    [queryKeys.sales, queryKeys.addsales],
  );

  return { mutate, data, error, isPending, isSuccess, isError };
};

export const useGetAvailableStock = (params = {}) => {
  const { data, isPending, refetch, ...rest } = useGetData({
    url: `${endPoints.stockItems}/available`,
    params,
    queryKeys: [queryKeys.stockItems, "available", params],
  });

  return {
    data,
    isPending,
    isError: rest.error,
    refetch,
  };
};
