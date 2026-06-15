import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import getRequest from "../handleRequest/GetRequest";

const useGetData = ({
  url = "",
  queryKeys = [],
  enabled = true,
  params = { page: 1, limit: 30 },
  other = {},
} = {}) => {
  const token = useSelector((state) => state.auth.token);

  const GetDataRequest = () => {
    return getRequest(url, token, {
      params: {
        ...params,
      },
    });
  };

  const responses = useQuery({
    queryKey: [...queryKeys, params.page, params.limit],
    queryFn: GetDataRequest,
    enabled: typeof enabled === "function" ? enabled : !!enabled,
    // staleTime: 1000 * 30,
    // cacheTime: 1000 * 60 * 10,
    // retry: 1,
    // refetchOnWindowFocus: true,
    // refetchOnMount: true,
    // refetchInterval: 1000 * 60 * 2,
    // keepPreviousData: true,
    staleTime: 0,
    cacheTime: 0,
    retry: 1,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchInterval: false,
    keepPreviousData: false,
    ...other,
  });

  // const updateParams = (newParams) => {
  //   setParamsState((prev) => ({ ...prev, ...newParams }));
  //   s.refetch();
  // };

  return { ...responses };
};

export default useGetData;
