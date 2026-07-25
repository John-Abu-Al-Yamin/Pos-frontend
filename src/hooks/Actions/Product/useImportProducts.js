import { useMutation, useQueryClient } from "@tanstack/react-query";
import { request } from "@/services/clientService";
import endPoints from "@/hooks/EndPoints/endPoints";
import queryKeys from "@/hooks/EndPoints/queryKeys";

export const downloadProductImportTemplate = async () => {
  const response = await request({
    method: "GET",
    url: endPoints.productsImportTemplate,
    responseType: "blob",
  });

  const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = blobUrl;
  link.download = "product-import-template.xlsx";
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(blobUrl);
};

export const useImportProducts = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [queryKeys.importproducts],
    mutationFn: ({ file, onUploadProgress }) => {
      const formData = new FormData();
      formData.append("file", file);

      return request({
        method: "POST",
        url: endPoints.productsImport,
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === queryKeys.products,
      });
    },
  });
};

export const getImportStatus = async () => null;
