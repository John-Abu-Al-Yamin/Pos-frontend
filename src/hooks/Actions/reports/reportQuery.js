const EMPTY_SENTINELS = new Set(["", "all", "default"]);

export const cleanReportParams = (filters = {}) => {
  return Object.fromEntries(
    Object.entries(filters).filter(
      ([, value]) =>
        value !== undefined &&
        value !== null &&
        !EMPTY_SENTINELS.has(value),
    ),
  );
};

export const buildReportResult = ({ data, isPending, refetch, rest }) => ({
  data,
  isPending,
  isError: rest.isError,
  error: rest.error,
  refetch,
});
