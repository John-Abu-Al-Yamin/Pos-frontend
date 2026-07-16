import endPoints from "@/hooks/EndPoints/endPoints";
import queryKeys from "@/hooks/EndPoints/queryKeys";
import useDeleteData from "@/hooks/curdsHook/useDeleteData";
import useGetData from "@/hooks/curdsHook/useGetData";
import usePutData from "@/hooks/curdsHook/usePutData";
import usePostData from "@/hooks/curdsHook/usePostData";

/* Main Units*/

export const useGetAllPurchaseItems = (page = 1, per_page = 20) => {
  const { data, isPending, refetch, ...rest } = useGetData({
    url: endPoints.purchaseItems,
    params: { page, per_page },
    queryKeys: [queryKeys.purchaseItems, page, per_page],
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

export const useGetPurchaseItemsById = (id) => {
  const { data, isPending, refetch, ...rest } = useGetData({
    url: `${endPoints.purchaseItems}/${id}`,
    params: {
      id,
    },

    queryKeys: [queryKeys.purchaseItems, id],
  });

  return {
    data,
    isPending,
    isError: rest.error,
    refetch,
  };
};

export const useAddPurchaseItems = () => {
  const { mutate, data, error, isPending, isSuccess, isError } = usePostData(
    endPoints.purchaseItems,
    [queryKeys.addpurchaseItems],
    [queryKeys.purchaseItems, queryKeys.addpurchaseItems, queryKeys.purchaseHeaders],
  );

  return { mutate, data, error, isPending, isSuccess, isError };
};

export const useUpdatePurchaseItems = (id) => {
  const { mutate, data, error, isPending, isSuccess, isError } = usePutData(
    `${endPoints.purchaseItems}/${id}`,
    [queryKeys.purchaseItems, id],
    [queryKeys.purchaseItems, queryKeys.purchaseHeaders],
  );

  return { mutate, data, error, isPending, isSuccess, isError };
};

export const useDeletePurchaseItems = (headerId) => {
  const invalidateKeys = headerId
    ? [queryKeys.purchaseItems, queryKeys.deletePurchaseItems, queryKeys.purchaseHeaders]
    : [queryKeys.purchaseItems, queryKeys.deletePurchaseItems];

  const { mutate, data, error, isPending, isSuccess, isError } = useDeleteData(
    endPoints.purchaseItems,
    [queryKeys.deletePurchaseItems],
    invalidateKeys,
  );

  return { mutate, data, error, isPending, isSuccess, isError };
};

