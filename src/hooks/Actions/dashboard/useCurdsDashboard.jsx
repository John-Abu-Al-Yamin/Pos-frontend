import endPoints from "@/hooks/EndPoints/endPoints";
import queryKeys from "@/hooks/EndPoints/queryKeys";
import useGetData from "@/hooks/curdsHook/useGetData";
import { buildReportResult, cleanReportParams } from "../reports/reportQuery";

export const useGetDashboard = (filters = {}) => {
  const params = cleanReportParams(filters);

  const { data, isPending, refetch, ...rest } = useGetData({
    url: endPoints.dashboard,
    params,
    queryKeys: [queryKeys.dashboard, JSON.stringify(filters)],
  });

  return buildReportResult({ data, isPending, refetch, rest });
};
