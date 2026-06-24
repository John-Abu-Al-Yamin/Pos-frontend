import endPoints from "@/hooks/EndPoints/endPoints";
import queryKeys from "@/hooks/EndPoints/queryKeys";
import useDeleteData from "@/hooks/curdsHook/useDeleteData";
import useGetData from "@/hooks/curdsHook/useGetData";
import usePutData from "@/hooks/curdsHook/usePutData";
import usePostData from "@/hooks/curdsHook/usePostData";

/* Main Units*/

export const useGetAllSuppliers = (page = 1, per_page = 20) => {
  const { data, isPending, refetch, ...rest } = useGetData({
    url: endPoints.suppliers,
    params: { page, per_page },
    queryKeys: [queryKeys.suppliers, page, per_page],
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