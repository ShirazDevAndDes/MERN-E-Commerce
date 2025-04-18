import {
  QueryObserverResult,
  RefetchOptions,
  RefetchQueryFilters,
  UseMutateFunction,
} from "react-query";

export type ReactQueryMutationType = UseMutateFunction<
  any,
  unknown,
  string | number,
  void
>;

export type ReactQueryRefetchType = (
  options?: RefetchOptions & RefetchQueryFilters
) => Promise<QueryObserverResult<object[], unknown>>;
