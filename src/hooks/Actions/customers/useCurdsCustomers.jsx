import endPoints from "@/hooks/EndPoints/endPoints";
import queryKeys from "@/hooks/EndPoints/queryKeys";
import useDeleteData from "@/hooks/curdsHook/useDeleteData";
import useGetData from "@/hooks/curdsHook/useGetData";
import usePutData from "@/hooks/curdsHook/usePutData";
import usePostData from "@/hooks/curdsHook/usePostData";

export const useGetAllCustomers = (page = 1, per_page = 20) => {
  const { data, isPending, refetch, ...rest } = useGetData({
    url: endPoints.customers,
    params: { page, per_page },
    queryKeys: [queryKeys.customers, page, per_page],
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

export const useGetCustomersById = (id) => {
  const { data, isPending, refetch, ...rest } = useGetData({
    url: `${endPoints.customers}/${id}`,
    params: { id },
    queryKeys: [queryKeys.customers, id],
  });

  return {
    data,
    isPending,
    isError: rest.error,
    refetch,
  };
};

export const useAddCustomers = () => {
  const { mutate, data, error, isPending, isSuccess, isError } = usePostData(
    endPoints.customers,
    [queryKeys.addcustomers],
    [queryKeys.customers, queryKeys.addcustomers],
  );

  return { mutate, data, error, isPending, isSuccess, isError };
};

export const useDeleteCustomers = () => {
  const { mutate, data, error, isPending, isSuccess, isError } = useDeleteData(
    endPoints.customers,
    [queryKeys.deletecustomers],
    [queryKeys.customers, queryKeys.deletecustomers],
  );

  return { mutate, data, error, isPending, isSuccess, isError };
};
