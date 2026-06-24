import endPoints from "@/hooks/EndPoints/endPoints";
import queryKeys from "@/hooks/EndPoints/queryKeys";
import useDeleteData from "@/hooks/curdsHook/useDeleteData";
import useGetData from "@/hooks/curdsHook/useGetData";
import usePutData from "@/hooks/curdsHook/usePutData";
import usePostData from "@/hooks/curdsHook/usePostData";

/* Main Units*/

export const useGetAllCategories = (page = 1, per_page = 20) => {
  const { data, isPending, refetch, ...rest } = useGetData({
    url: endPoints.categories,
    params: { page, per_page },
    queryKeys: [queryKeys.categories, page, per_page],
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

export const useGetCategoriesById = (id) => {
  const { data, isPending, refetch, ...rest } = useGetData({
    url: `${endPoints.categories}/${id}`,
    params: {
      id,
    },

    queryKeys: [queryKeys.categories, id],
  });

  return {
    data,
    isPending,
    isError: rest.error,
    refetch,
  };
};

export const useAddCategories = () => {
  const { mutate, data, error, isPending, isSuccess, isError } = usePostData(
    endPoints.categories,
    [queryKeys.addcategories],
    [queryKeys.categories, queryKeys.addcategories],
  );

  return { mutate, data, error, isPending, isSuccess, isError };
};


export const useUpdateCategories = (id) => {
  const { mutate, data, error, isPending, isSuccess, isError } = usePutData(
    `${endPoints.categories}/${id}`,
    [queryKeys.categories, id],
    [queryKeys.categories, ],
  );

  return { mutate, data, error, isPending, isSuccess, isError };
};


export const useDeleteCategories = (id) => {
  const { mutate, data, error, isPending, isSuccess, isError } = useDeleteData(
    endPoints.categories,
    [queryKeys.deleteCategories],
    [queryKeys.categories, queryKeys.deleteCategories],
  );

  return { mutate, data, error, isPending, isSuccess, isError };
};