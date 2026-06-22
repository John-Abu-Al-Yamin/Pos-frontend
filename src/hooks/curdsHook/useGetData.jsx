import { useQuery } from "@tanstack/react-query";
import getRequest from "../handleRequest/GetRequest";

const useGetData = ({
  url = "",
  queryKeys = [],
  enabled = true,
  params = { page: 1, limit: 30 },
  other = {},
} = {}) => {
  const GetDataRequest = () => {
    return getRequest(url, null, { params: { ...params } });
  };

  const responses = useQuery({
    queryKey: [...queryKeys, params.page, params.limit],
    queryFn: GetDataRequest,
    enabled: typeof enabled === "function" ? enabled : !!enabled,
    staleTime: 0,
    cacheTime: 0,
    retry: 1,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchInterval: false,
    keepPreviousData: false,
    ...other,
  });

  return { ...responses };
};

export default useGetData;
