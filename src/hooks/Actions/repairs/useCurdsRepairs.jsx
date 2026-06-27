import endPoints from "@/hooks/EndPoints/endPoints";
import queryKeys from "@/hooks/EndPoints/queryKeys";
import useGetData from "@/hooks/curdsHook/useGetData";
import usePostData from "@/hooks/curdsHook/usePostData";
import usePutData from "@/hooks/curdsHook/usePutData";
import useDeleteData from "@/hooks/curdsHook/useDeleteData";

export const useGetAllRepairs = (params = {}) => {
  const { data, isPending, refetch, ...rest } = useGetData({
    url: endPoints.repairs,
    params,
    queryKeys: [queryKeys.repairs, params],
  });
  return { data, isPending, isError: rest.error, refetch };
};

export const useGetRepairById = (id) => {
  const { data, isPending, refetch, ...rest } = useGetData({
    url: `${endPoints.repairs}/${id}`,
    params: { id },
    queryKeys: [queryKeys.repairs, id],
    enabled: !!id,
  });
  return { data, isPending, isError: rest.error, refetch };
};

export const useAddRepair = () => {
  const { mutate, data, error, isPending, isSuccess, isError } = usePostData(
    endPoints.repairs,
    [queryKeys.addRepairs],
    [queryKeys.repairs, queryKeys.addRepairs],
  );
  return { mutate, data, error, isPending, isSuccess, isError };
};

export const useUpdateRepair = (id) => {
  const { mutate, data, error, isPending, isSuccess, isError } = usePutData(
    `${endPoints.repairs}/${id}`,
    [queryKeys.updateRepairs],
    [queryKeys.repairs, queryKeys.updateRepairs],
  );
  return { mutate, data, error, isPending, isSuccess, isError };
};

export const useCompleteRepair = (id) => {
  const { mutate, data, error, isPending, isSuccess, isError } = usePutData(
    `${endPoints.repairs}/${id}/complete`,
    [queryKeys.repairs],
    [queryKeys.repairs],
  );
  return { mutate, data, error, isPending, isSuccess, isError };
};

export const useCancelRepair = (id) => {
  const { mutate, data, error, isPending, isSuccess, isError } = usePutData(
    `${endPoints.repairs}/${id}/cancel`,
    [queryKeys.repairs],
    [queryKeys.repairs],
  );
  return { mutate, data, error, isPending, isSuccess, isError };
};

export const useDeleteRepair = () => {
  const { mutate, data, error, isPending, isSuccess, isError } = useDeleteData(
    endPoints.repairs,
    [queryKeys.repairs],
    [queryKeys.repairs],
  );
  return { mutate, data, error, isPending, isSuccess, isError };
};
