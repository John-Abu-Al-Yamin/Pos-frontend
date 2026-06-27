import { useQuery, keepPreviousData } from "@tanstack/react-query";
import getRequest from "@/hooks/handleRequest/GetRequest";
import endPoints from "@/hooks/EndPoints/endPoints";

export const useSearchProducts = (search = "", enabled = true) => {
  const params = {
    search: search || undefined,
    per_page: 20,
  };

  const query = useQuery({
    queryKey: ["products", "search", search],
    queryFn: () => getRequest(endPoints.products, null, { params }),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
    retry: 1,
    enabled,
  });

  return {
    products: query.data?.data?.data ?? [],
    isPending: query.isPending,
    isFetching: query.isFetching,
    isError: query.error,
  };
};
