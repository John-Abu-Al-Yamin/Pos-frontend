import endPoints from "@/hooks/EndPoints/endPoints";
import queryKeys from "@/hooks/EndPoints/queryKeys";
import useDeleteData from "@/hooks/curdsHook/useDeleteData";
import useGetData from "@/hooks/curdsHook/useGetData";
// import usePatchData from "@/hooks/curdsHook/usePatchData";
import usePutData from "@/hooks/curdsHook/usePutData";

import usePostData from "@/hooks/curdsHook/usePostData";

/* Main Units*/

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
    endPoints.users,
    [queryKeys.addUsers],
    [queryKeys.users, queryKeys.addUsers, queryKeys.profile]
  );

  return { mutate, data, error, isPending, isSuccess, isError };
};

export const useDeleteUser = () => {
  const { mutate, data, error, isPending, isSuccess, isError } = useDeleteData(
    endPoints.users,
    [queryKeys.deleteUsers],
    [queryKeys.users, queryKeys.deleteUsers, queryKeys.profile]
  );

  return { mutate, data, error, isPending, isSuccess, isError };
};

export const useUpdateUser = () => {
  const { mutate, data, error, isPending, isSuccess, isError } = usePutData(
    endPoints.users,
    [queryKeys.updateUsers],
    [queryKeys.users, queryKeys.updateUsers, queryKeys.profile]
  );

  return { mutate, data, error, isPending, isSuccess, isError };
};
