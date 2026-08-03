import endPoints from "@/hooks/EndPoints/endPoints";
import queryKeys from "@/hooks/EndPoints/queryKeys";
import useGetData from "@/hooks/curdsHook/useGetData";

export const useGetAllAuditLogs = (page = 1, per_page = 25, filters = {}) => {
  const params = {
    page,
    per_page,
    ...Object.fromEntries(
      Object.entries(filters).filter(([, v]) => v !== undefined && v !== ""),
    ),
  };

  const { data, isPending, refetch, ...rest } = useGetData({
    url: endPoints.auditLogs,
    params,
    queryKeys: [queryKeys.auditLogs, page, per_page, JSON.stringify(filters)],
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

export const useGetAuditLogById = (id) => {
  const { data, isPending, refetch, ...rest } = useGetData({
    url: `${endPoints.auditLogs}/${id}`,
    queryKeys: [queryKeys.auditLogsById, id],
  });

  return {
    data,
    isPending,
    isError: rest.error,
    refetch,
  };
};

export const useGetAuditLogStats = (filters = {}) => {
  const params = Object.fromEntries(
    Object.entries(filters).filter(([, v]) => v !== undefined && v !== ""),
  );

  const { data, isPending, refetch, ...rest } = useGetData({
    url: endPoints.auditLogsStats,
    params,
    queryKeys: [queryKeys.auditLogsStats, JSON.stringify(filters)],
  });

  return {
    data,
    isPending,
    isError: rest.error,
    refetch,
  };
};

export const useGetAuditLogFilters = () => {
  const { data, isPending, refetch, ...rest } = useGetData({
    url: endPoints.auditLogsFilters,
    queryKeys: [queryKeys.auditLogsFilters],
  });

  return {
    data,
    isPending,
    isError: rest.error,
    refetch,
  };
};

export const useGetAuditLogRelated = (id) => {
  const { data, isPending, refetch, ...rest } = useGetData({
    url: `${endPoints.auditLogsRelated}${id}/related`,
    queryKeys: [queryKeys.auditLogsRelated, id],
  });

  return {
    data,
    isPending,
    isError: rest.error,
    refetch,
  };
};