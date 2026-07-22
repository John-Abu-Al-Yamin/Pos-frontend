import endPoints from "@/hooks/EndPoints/endPoints";
import queryKeys from "@/hooks/EndPoints/queryKeys";
import useDeleteData from "@/hooks/curdsHook/useDeleteData";
import useGetData from "@/hooks/curdsHook/useGetData";
import usePutData from "@/hooks/curdsHook/usePutData";
import usePostData from "@/hooks/curdsHook/usePostData";

export const useGetAllMaintenanceUsedParts = (headerId, page = 1, per_page = 50) => {
  const { data, isPending, refetch, ...rest } = useGetData({
    url: `${endPoints.maintenanceHeaders}/${headerId}/used-parts`,
    params: { page, per_page },
    queryKeys: [queryKeys.maintenanceUsedParts, headerId, page, per_page],
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

export const useGetMaintenanceUsedPartById = (headerId, partId) => {
  const { data, isPending, refetch, ...rest } = useGetData({
    url: `${endPoints.maintenanceHeaders}/${headerId}/used-parts/${partId}`,
    params: { id: partId },
    queryKeys: [queryKeys.maintenanceUsedParts, headerId, partId],
  });

  return {
    data,
    isPending,
    isError: rest.error,
    refetch,
  };
};

export const useAddMaintenanceUsedParts = () => {
  const { mutate, data, error, isPending, isSuccess, isError } = usePostData(
    endPoints.maintenanceHeaders,
    [queryKeys.addMaintenanceUsedParts],
    [queryKeys.maintenanceUsedParts, queryKeys.addMaintenanceUsedParts, queryKeys.maintenanceHeaders],
  );

  const mutateWithUrl = (options, config) => {
    const { headerId, ...rest } = options;
    mutate(
      { url: `${endPoints.maintenanceHeaders}/${headerId}/used-parts`, data: rest.data },
      config,
    );
  };

  return { mutate: mutateWithUrl, data, error, isPending, isSuccess, isError };
};

export const useUpdateMaintenanceUsedParts = (headerId, partId) => {
  const { mutate, data, error, isPending, isSuccess, isError } = usePutData(
    `${endPoints.maintenanceHeaders}/${headerId}/used-parts/${partId}`,
    [queryKeys.maintenanceUsedParts, headerId, partId],
    [queryKeys.maintenanceUsedParts, queryKeys.maintenanceHeaders],
  );

  return { mutate, data, error, isPending, isSuccess, isError };
};

export const useDeleteMaintenanceUsedParts = (headerId) => {
  const invalidateKeys = headerId
    ? [queryKeys.maintenanceUsedParts, queryKeys.deleteMaintenanceUsedParts, queryKeys.maintenanceHeaders]
    : [queryKeys.maintenanceUsedParts, queryKeys.deleteMaintenanceUsedParts];

  const { mutate: originalMutate, data, error, isPending, isSuccess, isError } = useDeleteData(
    endPoints.maintenanceHeaders,
    [queryKeys.deleteMaintenanceUsedParts],
    invalidateKeys,
  );

  const mutate = (options, config) => {
    const { partId, ...rest } = options;
    originalMutate(
      { url: `${endPoints.maintenanceHeaders}/${headerId}/used-parts/${partId}`, ...rest },
      config,
    );
  };

  return { mutate, data, error, isPending, isSuccess, isError };
};
