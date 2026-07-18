import endPoints from "@/hooks/EndPoints/endPoints";
import queryKeys from "@/hooks/EndPoints/queryKeys";
import useGetData from "@/hooks/curdsHook/useGetData";
import usePostData from "@/hooks/curdsHook/usePostData";

export const useGetAllPosItems = (searchQuery = "", filterType = "all") => {
  const params = { type: filterType };
  if (searchQuery) {
    params.query = searchQuery;
  }

  const { data, isPending, refetch, ...rest } = useGetData({
    url: endPoints.posSales,
    params,
    queryKeys: [queryKeys.posSales, searchQuery, filterType],
  });

  return {
    data,
    isPending,
    isError: rest.error,
    refetch,
  };
};

export const usePosCheckout = () => {
  const { mutate, data, error, isPending, isSuccess, isError } = usePostData(
    endPoints.posCheckout,
    [queryKeys.posCheckout],
    [queryKeys.posCheckout, queryKeys.posSales, queryKeys.salesHeaders],
  );

  return { mutate, data, error, isPending, isSuccess, isError };
};
