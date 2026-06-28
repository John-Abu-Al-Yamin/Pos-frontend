import endPoints from "@/hooks/EndPoints/endPoints";
import queryKeys from "@/hooks/EndPoints/queryKeys";
import useDeleteData from "@/hooks/curdsHook/useDeleteData";
import useGetData from "@/hooks/curdsHook/useGetData";
import usePostData from "@/hooks/curdsHook/usePostData";

export const useGetAllInventoryAdjustments = (params = {}) => {
  const { data, isPending, refetch, ...rest } = useGetData({
    url: endPoints.inventoryAdjustments,
    params: { page: 1, per_page: 10, ...params },
    queryKeys: [queryKeys.inventoryAdjustments, params],
  });

  return { data, isPending, isError: rest.error, refetch };
};

export const useGetInventoryAdjustmentsSummary = () => {
  const { data, isPending, refetch, ...rest } = useGetData({
    url: endPoints.inventoryAdjustmentsSummary,
    params: { page: 1, per_page: 1 },
    queryKeys: [queryKeys.inventoryAdjustmentsSummary],
  });

  return { data, isPending, isError: rest.error, refetch };
};

export const useAddInventoryAdjustment = () => {
  const { mutate, data, error, isPending, isSuccess, isError } = usePostData(
    endPoints.inventoryAdjustments,
    [queryKeys.addInventoryAdjustments],
    [
      queryKeys.inventoryAdjustments,
      queryKeys.addInventoryAdjustments,
      queryKeys.inventoryAdjustmentsSummary,
      queryKeys.stockItems,
    ],
  );

  return { mutate, data, error, isPending, isSuccess, isError };
};

export const useDeleteInventoryAdjustment = () => {
  const { mutate, data, error, isPending, isSuccess, isError } = useDeleteData(
    endPoints.inventoryAdjustments,
    [queryKeys.deleteInventoryAdjustments],
    [
      queryKeys.inventoryAdjustments,
      queryKeys.deleteInventoryAdjustments,
      queryKeys.inventoryAdjustmentsSummary,
      queryKeys.stockItems,
    ],
  );

  return { mutate, data, error, isPending, isSuccess, isError };
};
