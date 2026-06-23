import endPoints from "@/hooks/EndPoints/endPoints";
import queryKeys from "@/hooks/EndPoints/queryKeys";
import useDeleteData from "@/hooks/curdsHook/useDeleteData";
import useGetData from "@/hooks/curdsHook/useGetData";
import usePutData from "@/hooks/curdsHook/usePutData";
import usePostData from "@/hooks/curdsHook/usePostData";

/* Main Units*/

export const useGetAllSuppliers = (page = 1, limit = 20) => {
  const { data, isPending, refetch, ...rest } = useGetData({
    url: endPoints.suppliers,
    params: { page, limit },
    queryKeys: [queryKeys.suppliers, page, limit],
  });

  return {
    data,
    isPending,
    isError: rest.error,
    refetch,
    page,
    limit,
  };
};

export const useGetSuppliersById = (id) => {
  const { data, isPending, refetch, ...rest } = useGetData({
    url: `${endPoints.suppliers}/${id}`,
    params: {
      id,
    },

    queryKeys: [queryKeys.suppliers, id],
  });

  return {
    data,
    isPending,
    isError: rest.error,
    refetch,
  };
};

export const useAddSuppliers = () => {
  const { mutate, data, error, isPending, isSuccess, isError } = usePostData(
    endPoints.suppliers,
    [queryKeys.addsuppliers],
    [queryKeys.suppliers, queryKeys.addsuppliers],
  );

  return { mutate, data, error, isPending, isSuccess, isError };
};


export const useUpdateSuppliers = (id) => {
  const { mutate, data, error, isPending, isSuccess, isError } = usePutData(
    `${endPoints.suppliers}/${id}`,
    [queryKeys.suppliers, id],
    [queryKeys.suppliers, ],
  );

  return { mutate, data, error, isPending, isSuccess, isError };
};


export const useDeleteSuppliers = (id) => {
  const { mutate, data, error, isPending, isSuccess, isError } = useDeleteData(
    endPoints.suppliers,
    [queryKeys.deletesuppliers],
    [queryKeys.suppliers, queryKeys.deletesuppliers],
  );

  return { mutate, data, error, isPending, isSuccess, isError };
};