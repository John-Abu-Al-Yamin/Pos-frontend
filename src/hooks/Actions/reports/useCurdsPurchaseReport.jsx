import endPoints from "@/hooks/EndPoints/endPoints";
import queryKeys from "@/hooks/EndPoints/queryKeys";
import useGetData from "@/hooks/curdsHook/useGetData";
import { buildReportResult, cleanReportParams } from "./reportQuery";

export const useGetPurchaseReport = (filters = {}) => {
  const params = cleanReportParams(filters);

  const { data, isPending, refetch, ...rest } = useGetData({
    url: endPoints.reportsPurchases,
    params,
    queryKeys: [queryKeys.reportsPurchases, JSON.stringify(filters)],
  });

  return buildReportResult({ data, isPending, refetch, rest });
};
