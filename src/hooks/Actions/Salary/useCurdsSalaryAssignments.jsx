import endPoints from "@/hooks/EndPoints/endPoints";
import queryKeys from "@/hooks/EndPoints/queryKeys";
import useGetData from "@/hooks/curdsHook/useGetData";
import usePostData from "@/hooks/curdsHook/usePostData";
import usePutData from "@/hooks/curdsHook/usePutData";
import useDeleteData from "@/hooks/curdsHook/useDeleteData";

export const useGetAllSalaryAssignments = (page = 1, per_page = 12, filters = {}) => {
  const params = {
    page,
    per_page,
    ...Object.fromEntries(
      Object.entries(filters).filter(([_, v]) => v !== undefined && v !== ""),
    ),
  };

  const { data, isPending, refetch, ...rest } = useGetData({
    url: endPoints.salaryAssignments,
    params,
    queryKeys: [queryKeys.salaryAssignments, page, per_page, JSON.stringify(filters)],
  });

  return { data, isPending, isError: rest.error, refetch, page, per_page };
};

export const useGetSalaryAssignmentById = (id) => {
  const { data, isPending, refetch, ...rest } = useGetData({
    url: `${endPoints.salaryAssignments}/${id}`,
    queryKeys: [queryKeys.salaryAssignments, id],
  });

  return { data, isPending, isError: rest.error, refetch };
};

export const useAddSalaryAssignment = () => {
  const { mutate, data, error, isPending, isSuccess, isError } = usePostData(
    endPoints.salaryAssignments,
    [queryKeys.addSalaryAssignments],
    [queryKeys.salaryAssignments, queryKeys.addSalaryAssignments],
  );

  return { mutate, data, error, isPending, isSuccess, isError };
};

export const useUpdateSalaryAssignment = () => {
  const { mutate, data, error, isPending, isSuccess, isError } = usePutData(
    endPoints.salaryAssignments,
    [queryKeys.updateSalaryAssignments],
    [queryKeys.salaryAssignments, queryKeys.updateSalaryAssignments],
  );

  return { mutate, data, error, isPending, isSuccess, isError };
};

export const useDeleteSalaryAssignment = () => {
  const { mutate, data, error, isPending, isSuccess, isError } = useDeleteData(
    endPoints.salaryAssignments,
    [queryKeys.deleteSalaryAssignments],
    [queryKeys.salaryAssignments, queryKeys.deleteSalaryAssignments],
  );

  return { mutate, data, error, isPending, isSuccess, isError };
};

export const useEndSalaryAssignment = () => {
  const { mutate: originalMutate, data, error, isPending, isSuccess, isError } = usePostData(
    endPoints.salaryAssignments,
    [queryKeys.salaryAssignments],
    [queryKeys.salaryAssignments],
  );

  const mutate = (id, endData, options) => {
    originalMutate(
      { url: `${endPoints.salaryAssignments}/${id}/end`, data: endData },
      options,
    );
  };

  return { mutate, data, error, isPending, isSuccess, isError };
};
