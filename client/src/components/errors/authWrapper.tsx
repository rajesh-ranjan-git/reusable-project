"use client";

import { useToast } from "@/hooks/toast";
import { fetchMe } from "@/lib/actions/actions";
import { ApiResponse } from "@/lib/api/apiHandler";
import { ReactNodeProps } from "@/types/propTypes";
import { toTitleCase } from "@/utils/common.utils";
import { useEffect } from "react";

const AuthWrapper = ({ children }: ReactNodeProps) => {
  const { showToast } = useToast();

  const getMe = async () => {
    const response: ApiResponse = await fetchMe();

    if (response.success) {
      showToast({
        title: toTitleCase(response.status),
        message: response.message ?? "",
        variant: "success",
      });
    } else if (Number(response.statusCode) > 500) {
      showToast({
        title: toTitleCase(response.code),
        message: response.message ?? "",
        variant: "error",
      });
    }
  };

  useEffect(() => {
    getMe();
  }, []);
  return <>{children}</>;
};

export default AuthWrapper;
