import { useMutation, useQueryClient } from "@tanstack/react-query";
import { request } from "@/services/clientService";
import endPoints from "@/hooks/EndPoints/endPoints";
import queryKeys from "@/hooks/EndPoints/queryKeys";

export const OPENING_STOCK_TEMPLATE_TYPES = {
  mobile: "mobile",
  quantity: "quantity",
};

export const downloadOpeningStockTemplate = async (templateType) => {
  const response = await request({
    method: "GET",
    url: endPoints.openingStockTemplate,
    params: { template_type: templateType },
    responseType: "blob",
  });

  const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = blobUrl;
  link.download = templateType === OPENING_STOCK_TEMPLATE_TYPES.quantity
    ? "opening_stock_accessories_spare_parts_template.xlsx"
    : "opening_stock_mobile_template.xlsx";
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(blobUrl);
};

export const useImportOpeningStock = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [queryKeys.openingStockImport],
    mutationFn: ({ file, templateType, onUploadProgress }) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("template_type", templateType);

      return request({
        method: "POST",
        url: endPoints.openingStockImport,
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress,
      });
    },
    onSuccess: () => {
      const affectedKeys = [
        queryKeys.products,
        queryKeys.inventoryQuantities,
        queryKeys.inventoryItems,
        queryKeys.stockMovements,
        queryKeys.dashboard,
        queryKeys.posSales,
        queryKeys.reportsInventory,
        queryKeys.reportsProfitLoss,
      ];

      queryClient.invalidateQueries({
        predicate: (query) => affectedKeys.includes(query.queryKey[0]),
      });
    },
  });
};
