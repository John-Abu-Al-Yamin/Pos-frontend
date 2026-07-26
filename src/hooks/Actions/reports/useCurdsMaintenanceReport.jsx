import endPoints from "@/hooks/EndPoints/endPoints";
import queryKeys from "@/hooks/EndPoints/queryKeys";
import useGetData from "@/hooks/curdsHook/useGetData";
import { buildReportResult, cleanReportParams } from "./reportQuery";

export const useGetMaintenanceReport = (filters = {}) => {
  const params = cleanReportParams(filters);

  const { data, isPending, refetch, ...rest } = useGetData({
    url: endPoints.reportsMaintenance,
    params,
    queryKeys: [queryKeys.reportsMaintenance, JSON.stringify(filters)],
  });

  return buildReportResult({ data, isPending, refetch, rest });
};
