import endPoints from "@/hooks/EndPoints/endPoints";
import queryKeys from "@/hooks/EndPoints/queryKeys";
import useGetData from "@/hooks/curdsHook/useGetData";
import usePostData from "@/hooks/curdsHook/usePostData";

export const useGetAllUsers = (page = 1, per_page = 20, filters = {}) => {
  const params = {
    page,
    per_page,
    ...Object.fromEntries(
      Object.entries(filters).filter(([_, v]) => v !== undefined && v !== ""),
    ),
  };

  const { data, isPending, refetch, ...rest } = useGetData({
    url: endPoints.users,
    params,
    queryKeys: [queryKeys.users, page, per_page, JSON.stringify(filters)],
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

export const useAddUser = () => {
  const { mutate, data, error, isPending, isSuccess, isError } = usePostData(
    endPoints.adminCreateUser,
    [queryKeys.addUsers],
    [queryKeys.users],
  );

  return { mutate, data, error, isPending, isSuccess, isError };
};
