import endPoints from "@/hooks/EndPoints/endPoints";
import queryKeys from "@/hooks/EndPoints/queryKeys";
import useDeleteData from "@/hooks/curdsHook/useDeleteData";
import useGetData from "@/hooks/curdsHook/useGetData";
import usePostData from "@/hooks/curdsHook/usePostData";

export const useGetAllMarkupSettings = () => {
  const { data, isPending, refetch, ...rest } = useGetData({
    url: endPoints.markupSettings,
    queryKeys: [queryKeys.markupSettings],
  });
  return { data, isPending, isError: rest.error, refetch };
};

export const useAddMarkupSetting = () => {
  const { mutate, data, error, isPending, isSuccess, isError } = usePostData(
    endPoints.markupSettings,
    [queryKeys.addMarkupSettings],
    [queryKeys.markupSettings, queryKeys.addMarkupSettings],
  );
  return { mutate, data, error, isPending, isSuccess, isError };
};

export const useDeleteMarkupSetting = () => {
  const { mutate, data, error, isPending, isSuccess, isError } = useDeleteData(
    endPoints.markupSettings,
    [queryKeys.deleteMarkupSettings],
    [queryKeys.markupSettings, queryKeys.deleteMarkupSettings],
  );
  return { mutate, data, error, isPending, isSuccess, isError };
};
