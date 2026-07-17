import endPoints from "@/hooks/EndPoints/endPoints";
import queryKeys from "@/hooks/EndPoints/queryKeys";
import useDeleteData from "@/hooks/curdsHook/useDeleteData";
import useGetData from "@/hooks/curdsHook/useGetData";
import usePutData from "@/hooks/curdsHook/usePutData";
import usePostData from "@/hooks/curdsHook/usePostData";

/* Main Units*/

export const useGetAllUsedPurchaseItems = (purchaseId, page = 1, per_page = 20) => {
  const { data, isPending, refetch, ...rest } = useGetData({
    url: `${endPoints.usedPurchaseHeaders}/${purchaseId}/items`,
    params: { page, per_page },
    queryKeys: [queryKeys.usedPurchaseItems, purchaseId, page, per_page],
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

export const useGetUsedPurchaseItemsById = (purchaseId, itemId) => {
  const { data, isPending, refetch, ...rest } = useGetData({
    url: `${endPoints.usedPurchaseHeaders}/${purchaseId}/items/${itemId}`,
    params: {
      id: itemId,
    },

    queryKeys: [queryKeys.usedPurchaseItems, purchaseId, itemId],
  });

  return {
    data,
    isPending,
    isError: rest.error,
    refetch,
  };
};

export const useAddUsedPurchaseItems = () => {
  const { mutate, data, error, isPending, isSuccess, isError } = usePostData(
    endPoints.usedPurchaseHeaders,
    [queryKeys.addUsedPurchaseItems],
    [queryKeys.usedPurchaseItems, queryKeys.addUsedPurchaseItems, queryKeys.usedPurchaseHeaders],
  );

  const mutateWithUrl = (options, config) => {
    const { purchaseId, ...rest } = options;
    mutate(
      { url: `${endPoints.usedPurchaseHeaders}/${purchaseId}/items`, data: rest.data },
      config,
    );
  };

  return { mutate: mutateWithUrl, data, error, isPending, isSuccess, isError };
};

export const useUpdateUsedPurchaseItems = (purchaseId, itemId) => {
  const { mutate, data, error, isPending, isSuccess, isError } = usePutData(
    `${endPoints.usedPurchaseHeaders}/${purchaseId}/items/${itemId}`,
    [queryKeys.usedPurchaseItems, purchaseId, itemId],
    [queryKeys.usedPurchaseItems, queryKeys.usedPurchaseHeaders],
  );

  return { mutate, data, error, isPending, isSuccess, isError };
};

export const useDeleteUsedPurchaseItems = (purchaseId) => {
  const invalidateKeys = purchaseId
    ? [queryKeys.usedPurchaseItems, queryKeys.deleteUsedPurchaseItems, queryKeys.usedPurchaseHeaders]
    : [queryKeys.usedPurchaseItems, queryKeys.deleteUsedPurchaseItems];

  const { mutate: originalMutate, data, error, isPending, isSuccess, isError } = useDeleteData(
    endPoints.usedPurchaseHeaders,
    [queryKeys.deleteUsedPurchaseItems],
    invalidateKeys,
  );

  const mutate = (options, config) => {
    const { itemId, ...rest } = options;
    originalMutate(
      { url: `${endPoints.usedPurchaseHeaders}/${purchaseId}/items/${itemId}`, ...rest },
      config,
    );
  };

  return { mutate, data, error, isPending, isSuccess, isError };
};
