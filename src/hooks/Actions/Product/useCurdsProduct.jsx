import endPoints from "@/hooks/EndPoints/endPoints";
import queryKeys from "@/hooks/EndPoints/queryKeys";
import useDeleteData from "@/hooks/curdsHook/useDeleteData";
import useGetData from "@/hooks/curdsHook/useGetData";
import usePostData from "@/hooks/curdsHook/usePostData";

export const useGetAllProducts = (page = 1, per_page = 20, filters = {}) => {
  const { search, category_id, brand_id, type } = filters;
  const params = { page, per_page };
  if (search) params.search = search;
  if (category_id) params.category_id = category_id;
  if (brand_id) params.brand_id = brand_id;
  if (type) params.type = type;

  const { data, isPending, refetch, ...rest } = useGetData({
    url: endPoints.products,
    params,
    queryKeys: [queryKeys.products, page, per_page, params],
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

export const useAddProducts = () => {
  const { mutate, data, error, isPending, isSuccess, isError } = usePostData(
    endPoints.products,
    [queryKeys.addproducts],
    [queryKeys.products, queryKeys.addproducts],
  );

  return { mutate, data, error, isPending, isSuccess, isError };
};

export const useDeleteProducts = () => {
  const { mutate, data, error, isPending, isSuccess, isError } = useDeleteData(
    endPoints.products,
    [queryKeys.deleteproducts],
    [queryKeys.products, queryKeys.deleteproducts],
  );

  return { mutate, data, error, isPending, isSuccess, isError };
};
