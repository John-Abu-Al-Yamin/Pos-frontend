import endPoints from "@/hooks/EndPoints/endPoints";
import queryKeys from "@/hooks/EndPoints/queryKeys";
import useDeleteData from "@/hooks/curdsHook/useDeleteData";
import useGetData from "@/hooks/curdsHook/useGetData";
import usePostData from "@/hooks/curdsHook/usePostData";

export const useGetAllBrands = () => {
  const { data, isPending, refetch, ...rest } = useGetData({
    url: endPoints.brands,
    queryKeys: [queryKeys.brands],
  });
  return { data, isPending, isError: rest.error, refetch };
};

export const useAddBrands = () => {
  const { mutate, data, error, isPending, isSuccess, isError } = usePostData(
    endPoints.brands,
    [queryKeys.addbrands],
    [queryKeys.brands, queryKeys.addbrands],
  );
  return { mutate, data, error, isPending, isSuccess, isError };
};

export const useDeleteBrands = () => {
  const { mutate, data, error, isPending, isSuccess, isError } = useDeleteData(
    endPoints.brands,
    [queryKeys.deletebrands],
    [queryKeys.brands, queryKeys.deletebrands],
  );
  return { mutate, data, error, isPending, isSuccess, isError };
};
