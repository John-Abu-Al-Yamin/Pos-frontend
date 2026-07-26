import endPoints from "@/hooks/EndPoints/endPoints";
import queryKeys from "@/hooks/EndPoints/queryKeys";
import useGetData from "@/hooks/curdsHook/useGetData";
import { buildReportResult, cleanReportParams } from "./reportQuery";

export const useGetInventoryReport = (filters = {}) => {
  const params = cleanReportParams(filters);

  const { data, isPending, refetch, ...rest } = useGetData({
    url: endPoints.reportsInventory,
    params,
    queryKeys: [queryKeys.reportsInventory, JSON.stringify(filters)],
  });

  return buildReportResult({ data, isPending, refetch, rest });
};
