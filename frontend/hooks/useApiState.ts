"use client";

import {
  useCallback,
  useState,
} from "react";

import {
  ApiError,
} from "@/lib/api-error";

interface ApiState<T> {
  data: T | null;

  isLoading: boolean;

  error: ApiError | null;
}

export function useApiState<T>() {
  const [state, setState] =
    useState<ApiState<T>>({
      data: null,
      isLoading: false,
      error: null,
    });

  const execute = useCallback(
    async (
      request: () => Promise<T>
    ) => {
      setState({
        data: null,
        isLoading: true,
        error: null,
      });

      try {
        const data = await request();

        setState({
          data,
          isLoading: false,
          error: null,
        });

        return data;
      } catch (error) {
        const apiError =
          error instanceof ApiError
            ? error
            : new ApiError(
                "Something went wrong.",
                0,
                "UNKNOWN_ERROR"
              );

        setState({
          data: null,
          isLoading: false,
          error: apiError,
        });

        throw apiError;
      }
    },
    []
  );

  return {
    ...state,
    execute,
  };
}
