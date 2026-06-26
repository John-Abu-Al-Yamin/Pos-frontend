import endPoints from "@/hooks/EndPoints/endPoints";
import queryKeys from "@/hooks/EndPoints/queryKeys";
import useGetData from "@/hooks/curdsHook/useGetData";

export const useGetDashboardData = (params = {}) => {
  const { data, isPending, refetch, ...rest } = useGetData({
    url: endPoints.dashboard,
    params: { ...params, page: 1, per_page: 1 },
    queryKeys: [queryKeys.dashboard, params],
  });

  return {
    data,
    isPending,
    isError: rest.error,
    refetch,
  };
};

export const useGetProductsPerformance = (params = {}) => {
  const { data, isPending, refetch, ...rest } = useGetData({
    url: endPoints.productsPerformance,
    params: { ...params, page: 1, per_page: 1 },
    queryKeys: [queryKeys.productsPerformance, params],
  });

  return {
    data,
    isPending,
    isError: rest.error,
    refetch,
  };
};
