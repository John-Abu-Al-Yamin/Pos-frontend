import endPoints from "@/hooks/EndPoints/endPoints";
import queryKeys from "@/hooks/EndPoints/queryKeys";
import useGetData from "@/hooks/curdsHook/useGetData";

export const useGetAllInventoryItems = (page = 1, per_page = 12, filters = {}) => {
  const params = {
    page,
    per_page,
    ...Object.fromEntries(
      Object.entries(filters).filter(([_, v]) => v !== undefined && v !== ""),
    ),
  };

  const { data, isPending, refetch, ...rest } = useGetData({
    url: endPoints.inventoryItems,
    params,
    queryKeys: [queryKeys.inventoryItems, page, per_page, JSON.stringify(filters)],
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

export const useGetInventoryItemById = (id) => {
  const { data, isPending, refetch, ...rest } = useGetData({
    url: `${endPoints.inventoryItems}/${id}`,
    queryKeys: [queryKeys.inventoryItems, id],
  });

  return {
    data,
    isPending,
    isError: rest.error,
    refetch,
  };
};
