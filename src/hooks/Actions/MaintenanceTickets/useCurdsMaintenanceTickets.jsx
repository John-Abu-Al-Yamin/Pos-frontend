import endPoints from "@/hooks/EndPoints/endPoints";
import queryKeys from "@/hooks/EndPoints/queryKeys";
import useDeleteData from "@/hooks/curdsHook/useDeleteData";
import useGetData from "@/hooks/curdsHook/useGetData";
import usePutData from "@/hooks/curdsHook/usePutData";
import usePostData from "@/hooks/curdsHook/usePostData";

export const useGetAllMaintenanceTickets = (page = 1, per_page = 12, filters = {}) => {
  const params = {
    page,
    per_page,
    ...Object.fromEntries(
      Object.entries(filters).filter(([_, v]) => v !== undefined && v !== ""),
    ),
  };

  const { data, isPending, refetch, ...rest } = useGetData({
    url: endPoints.maintenanceHeaders,
    params,
    queryKeys: [queryKeys.maintenanceHeaders, page, per_page, JSON.stringify(filters)],
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

export const useGetMaintenanceTicketById = (id) => {
  const { data, isPending, refetch, ...rest } = useGetData({
    url: `${endPoints.maintenanceHeaders}/${id}`,
    params: { id },
    queryKeys: [queryKeys.maintenanceHeaders, id],
  });

  return {
    data,
    isPending,
    isError: rest.error,
    refetch,
  };
};

export const useAddMaintenanceTickets = () => {
  const { mutate, data, error, isPending, isSuccess, isError } = usePostData(
    endPoints.maintenanceTickets,
    [queryKeys.addMaintenanceHeaders],
    [queryKeys.maintenanceHeaders, queryKeys.addMaintenanceHeaders],
  );

  return { mutate, data, error, isPending, isSuccess, isError };
};

export const useUpdateMaintenanceTickets = (id) => {
  const { mutate, data, error, isPending, isSuccess, isError } = usePutData(
    `${endPoints.maintenanceHeaders}/${id}`,
    [queryKeys.maintenanceHeaders, id],
    [queryKeys.maintenanceHeaders],
  );

  return { mutate, data, error, isPending, isSuccess, isError };
};

export const useDeleteMaintenanceTickets = () => {
  const { mutate, data, error, isPending, isSuccess, isError } = useDeleteData(
    endPoints.maintenanceHeaders,
    [queryKeys.deleteMaintenanceHeaders],
    [queryKeys.maintenanceHeaders, queryKeys.deleteMaintenanceHeaders],
  );

  return { mutate, data, error, isPending, isSuccess, isError };
};

export const useUpdateMaintenanceStatus = () => {
  const {
    mutate: originalMutate,
    data,
    error,
    isPending,
    isSuccess,
    isError,
  } = usePostData(
    endPoints.maintenanceHeaders,
    [queryKeys.maintenanceHeaders],
    [queryKeys.maintenanceHeaders],
  );

  const mutate = (id, status, options, paidAmount) => {
    const data = { status };
    if (paidAmount !== undefined && paidAmount !== null) {
      data.paid_amount = paidAmount;
    }
    originalMutate(
      { url: `${endPoints.maintenanceHeaders}/${id}/status`, data },
      options,
    );
  };

  return { mutate, data, error, isPending, isSuccess, isError };
};
