import endPoints from "@/hooks/EndPoints/endPoints";
import queryKeys from "@/hooks/EndPoints/queryKeys";
import useDeleteData from "@/hooks/curdsHook/useDeleteData";
import useGetData from "@/hooks/curdsHook/useGetData";
import usePutData from "@/hooks/curdsHook/usePutData";
import usePostData from "@/hooks/curdsHook/usePostData";

/* Main Units*/

export const useGetAllPurchaseHeaders = (page = 1, per_page = 20) => {
  const { data, isPending, refetch, ...rest } = useGetData({
    url: endPoints.purchaseHeaders,
    params: { page, per_page },
    queryKeys: [queryKeys.purchaseHeaders],
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

export const useGetPurchaseHeadersById = (id) => {
  const { data, isPending, refetch, ...rest } = useGetData({
    url: `${endPoints.purchaseHeaders}/${id}`,
    params: {
      id,
    },

    queryKeys: [queryKeys.purchaseHeaders, id],
  });

  return {
    data,
    isPending,
    isError: rest.error,
    refetch,
  };
};

export const useAddPurchaseHeaders = () => {
  const { mutate, data, error, isPending, isSuccess, isError } = usePostData(
    endPoints.purchaseHeaders,
    [queryKeys.addPurchaseHeaders],
    [queryKeys.purchaseHeaders, queryKeys.addPurchaseHeaders],
  );

  return { mutate, data, error, isPending, isSuccess, isError };
};


export const useUpdatePurchaseHeaders = (id) => {
  const { mutate, data, error, isPending, isSuccess, isError } = usePutData(
    `${endPoints.purchaseHeaders}/${id}`,
    [queryKeys.purchaseHeaders, id],
    [queryKeys.purchaseHeaders],
  );

  return { mutate, data, error, isPending, isSuccess, isError };
};


export const useDeletePurchaseHeaders = () => {
  const { mutate, data, error, isPending, isSuccess, isError } = useDeleteData(
    endPoints.purchaseHeaders,
    [queryKeys.deletePurchaseHeaders],
    [queryKeys.purchaseHeaders, queryKeys.deletePurchaseHeaders],
  );

  return { mutate, data, error, isPending, isSuccess, isError };
};