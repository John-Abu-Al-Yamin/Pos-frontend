import endPoints from "@/hooks/EndPoints/endPoints";
import queryKeys from "@/hooks/EndPoints/queryKeys";
import useDeleteData from "@/hooks/curdsHook/useDeleteData";
import useGetData from "@/hooks/curdsHook/useGetData";
import usePutData from "@/hooks/curdsHook/usePutData";
import usePostData from "@/hooks/curdsHook/usePostData";

/* Main Units*/

export const useGetAllUsedPurchaseHeaders = (page = 1, per_page = 12, filters = {}) => {
  const params = {
    page,
    per_page,
    ...Object.fromEntries(
      Object.entries(filters).filter(([_, v]) => v !== undefined && v !== ""),
    ),
  };

  const { data, isPending, refetch, ...rest } = useGetData({
    url: endPoints.usedPurchaseHeaders,
    params,
    queryKeys: [queryKeys.usedPurchaseHeaders, page, per_page, JSON.stringify(filters)],
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

export const useGetUsedPurchaseHeadersById = (id) => {
  const { data, isPending, refetch, ...rest } = useGetData({
    url: `${endPoints.usedPurchaseHeaders}/${id}`,
    params: {
      id,
    },

    queryKeys: [queryKeys.usedPurchaseHeaders, id],
  });

  return {
    data,
    isPending,
    isError: rest.error,
    refetch,
  };
};

export const useAddUsedPurchaseHeaders = () => {
  const { mutate, data, error, isPending, isSuccess, isError } = usePostData(
    endPoints.usedPurchaseHeaders,
    [queryKeys.addUsedPurchaseHeaders],
    [queryKeys.usedPurchaseHeaders, queryKeys.addUsedPurchaseHeaders],
  );

  return { mutate, data, error, isPending, isSuccess, isError };
};

export const useUpdateUsedPurchaseHeaders = (id) => {
  const { mutate, data, error, isPending, isSuccess, isError } = usePutData(
    `${endPoints.usedPurchaseHeaders}/${id}`,
    [queryKeys.usedPurchaseHeaders, id],
    [queryKeys.usedPurchaseHeaders],
  );

  return { mutate, data, error, isPending, isSuccess, isError };
};

export const useDeleteUsedPurchaseHeaders = (id) => {
  const { mutate, data, error, isPending, isSuccess, isError } = useDeleteData(
    endPoints.usedPurchaseHeaders,
    [queryKeys.deleteUsedPurchaseHeaders],
    [queryKeys.usedPurchaseHeaders, queryKeys.deleteUsedPurchaseHeaders],
  );

  return { mutate, data, error, isPending, isSuccess, isError };
};

export const useCompleteUsedPurchaseHeaders = () => {
  const {
    mutate: originalMutate,
    data,
    error,
    isPending,
    isSuccess,
    isError,
  } = usePostData(
    endPoints.usedPurchaseHeaders,
    [queryKeys.usedPurchaseHeaders],
    [queryKeys.usedPurchaseHeaders],
  );

  const mutate = (id, options) => {
    originalMutate(
      { url: `${endPoints.usedPurchaseHeaders}/${id}/complete` },
      options,
    );
  };

  return { mutate, data, error, isPending, isSuccess, isError };
};
export const useCancelUsedPurchaseHeaders = () => {
  const {
    mutate: originalMutate,
    data,
    error,
    isPending,
    isSuccess,
    isError,
  } = usePostData(
    endPoints.usedPurchaseHeaders,
    [queryKeys.usedPurchaseHeaders],
    [queryKeys.usedPurchaseHeaders],
  );

  const mutate = (id, options) => {
    originalMutate(
      { url: `${endPoints.usedPurchaseHeaders}/${id}/cancel` },
      options,
    );
  };

  return { mutate, data, error, isPending, isSuccess, isError };
};
