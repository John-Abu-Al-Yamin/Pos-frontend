import endPoints from "@/hooks/EndPoints/endPoints";
import queryKeys from "@/hooks/EndPoints/queryKeys";
import useDeleteData from "@/hooks/curdsHook/useDeleteData";
import useGetData from "@/hooks/curdsHook/useGetData";
import usePutData from "@/hooks/curdsHook/usePutData";
import usePostData from "@/hooks/curdsHook/usePostData";

/* Main Units*/

export const useGetAllProducts = (page = 1, limit = 20, search, categoryId, isSerialized) => {
  const { data, isPending, refetch, ...rest } = useGetData({
    url: endPoints.products,
    params: { page, limit },
    queryKeys: [queryKeys.products, page, limit],
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

export const useGetproductById = (id) => {
  const { data, isPending, refetch, ...rest } = useGetData({
    url: `${endPoints.products}/${id}`,
    params: {
      id,
    },

    queryKeys: [queryKeys.products, id],
  });

  return {
    data,
    isPending,
    isError: rest.error,
    refetch,
  };
};

export const useAddProducts = () => {
  const { mutate, data, error, isPending, isSuccess, isError } = usePostData(
    endPoints.products,
    [queryKeys.addproducts],
    [queryKeys.products, queryKeys.addproducts],
  );

  return { mutate, data, error, isPending, isSuccess, isError };
};


export const useUpdateProducts = (id) => {
  const { mutate, data, error, isPending, isSuccess, isError } = usePutData(
    `${endPoints.products}/${id}`,
    [queryKeys.products, id],
    [queryKeys.products, queryKeys.dashboard],
  );

  return { mutate, data, error, isPending, isSuccess, isError };
};


export const useDeleteProducts = (id) => {
  const { mutate, data, error, isPending, isSuccess, isError } = useDeleteData(
    endPoints.products,
    [queryKeys.deleteproducts],
    [queryKeys.products, queryKeys.deleteproducts],
  );

  return { mutate, data, error, isPending, isSuccess, isError };
};