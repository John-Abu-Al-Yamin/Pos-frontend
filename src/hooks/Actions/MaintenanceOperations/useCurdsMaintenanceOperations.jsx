import endPoints from "@/hooks/EndPoints/endPoints";
import queryKeys from "@/hooks/EndPoints/queryKeys";
import useDeleteData from "@/hooks/curdsHook/useDeleteData";
import useGetData from "@/hooks/curdsHook/useGetData";
import usePutData from "@/hooks/curdsHook/usePutData";
import usePostData from "@/hooks/curdsHook/usePostData";

export const useGetAllMaintenanceOperations = (headerId, page = 1, per_page = 50) => {
  const { data, isPending, refetch, ...rest } = useGetData({
    url: `${endPoints.maintenanceHeaders}/${headerId}/operations`,
    params: { page, per_page },
    queryKeys: [queryKeys.maintenanceOperations, headerId, page, per_page],
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

export const useGetMaintenanceOperationById = (headerId, operationId) => {
  const { data, isPending, refetch, ...rest } = useGetData({
    url: `${endPoints.maintenanceHeaders}/${headerId}/operations/${operationId}`,
    params: { id: operationId },
    queryKeys: [queryKeys.maintenanceOperations, headerId, operationId],
  });

  return {
    data,
    isPending,
    isError: rest.error,
    refetch,
  };
};

export const useAddMaintenanceOperations = () => {
  const { mutate, data, error, isPending, isSuccess, isError } = usePostData(
    endPoints.maintenanceHeaders,
    [queryKeys.addMaintenanceOperations],
    [queryKeys.maintenanceOperations, queryKeys.addMaintenanceOperations, queryKeys.maintenanceHeaders],
  );

  const mutateWithUrl = (options, config) => {
    const { headerId, ...rest } = options;
    mutate(
      { url: `${endPoints.maintenanceHeaders}/${headerId}/operations`, data: rest.data },
      config,
    );
  };

  return { mutate: mutateWithUrl, data, error, isPending, isSuccess, isError };
};

export const useUpdateMaintenanceOperations = (headerId, operationId) => {
  const { mutate, data, error, isPending, isSuccess, isError } = usePutData(
    `${endPoints.maintenanceHeaders}/${headerId}/operations/${operationId}`,
    [queryKeys.maintenanceOperations, headerId, operationId],
    [queryKeys.maintenanceOperations, queryKeys.maintenanceHeaders],
  );

  return { mutate, data, error, isPending, isSuccess, isError };
};

export const useDeleteMaintenanceOperations = (headerId) => {
  const invalidateKeys = headerId
    ? [queryKeys.maintenanceOperations, queryKeys.deleteMaintenanceOperations, queryKeys.maintenanceHeaders]
    : [queryKeys.maintenanceOperations, queryKeys.deleteMaintenanceOperations];

  const { mutate: originalMutate, data, error, isPending, isSuccess, isError } = useDeleteData(
    endPoints.maintenanceHeaders,
    [queryKeys.deleteMaintenanceOperations],
    invalidateKeys,
  );

  const mutate = (options, config) => {
    const { operationId, ...rest } = options;
    originalMutate(
      { url: `${endPoints.maintenanceHeaders}/${headerId}/operations/${operationId}`, ...rest },
      config,
    );
  };

  return { mutate, data, error, isPending, isSuccess, isError };
};
