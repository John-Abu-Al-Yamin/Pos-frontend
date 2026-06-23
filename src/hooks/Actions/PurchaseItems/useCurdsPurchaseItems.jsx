import endPoints from "@/hooks/EndPoints/endPoints";
import queryKeys from "@/hooks/EndPoints/queryKeys";
import useDeleteData from "@/hooks/curdsHook/useDeleteData";
import useGetData from "@/hooks/curdsHook/useGetData";
import usePutData from "@/hooks/curdsHook/usePutData";
import usePostData from "@/hooks/curdsHook/usePostData";

/* Purchase Items */

export const useGetPurchaseItemById = (id) => {
  const { data, isPending, refetch, ...rest } = useGetData({
    url: `${endPoints.purchaseItems}/${id}`,
    queryKeys: [queryKeys.purchaseItems, id],
    enabled: !!id,
  });

  return {
    data,
    isPending,
    isError: rest.error,
    refetch,
  };
};

export const useGetAllPurchaseItems = (headerId, page = 1, limit = 50) => {
  const { data, isPending, refetch, ...rest } = useGetData({
    url: endPoints.purchaseItems,
    params: { purchase_header_id: headerId, page, limit },
    queryKeys: [queryKeys.purchaseItems, headerId, page, limit],
    enabled: !!headerId,
  });

  return {
    data,
    isPending,
    isError: rest.error,
    refetch,
  };
};

export const useAddPurchaseItem = () => {
  const { mutate, data, error, isPending, isSuccess, isError } = usePostData(
    endPoints.purchaseItems,
    [queryKeys.addpurchaseItems],
    [
      queryKeys.purchaseItems,
      queryKeys.addpurchaseItems,
      queryKeys.purchaseHeaders,
    ],
  );

  return { mutate, data, error, isPending, isSuccess, isError };
};

export const useUpdatePurchaseItem = (id) => {
  const { mutate, data, error, isPending, isSuccess, isError } = usePutData(
    `${endPoints.purchaseItems}/${id}`,
    [queryKeys.purchaseItems, id],
    [queryKeys.purchaseItems, queryKeys.purchaseHeaders],
  );

  return { mutate, data, error, isPending, isSuccess, isError };
};

export const useDeletePurchaseItem = (id) => {
  const { mutate, data, error, isPending, isSuccess, isError } = useDeleteData(
    endPoints.purchaseItems,
    [queryKeys.deletepurchaseItems],
    [
      queryKeys.purchaseItems,
      queryKeys.purchaseHeaders,
      queryKeys.deletepurchaseItems,
    ],
  );

  return { mutate, data, error, isPending, isSuccess, isError };
};
