import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { patchReportContent, ReportResponse } from "apis/report";
import { useToast } from "hooks/useToast";

export interface Params {
  contentType: "user" | "restaurantList" | "review";
  contentId: string;
}

interface ErrorResponse {
  message: string;
}

export const usePatchReportContentMutation = () => {
  const { showToast } = useToast();

  return useMutation<ReportResponse, AxiosError<ErrorResponse>, Params>(
    ({ contentType, contentId }) => patchReportContent(contentType, contentId),
    {
      onError: (error) => {
        const errorMessage = error.response?.data?.message || error.message;
        showToast(errorMessage, "warning");
      },
      onSuccess: (data) => {
        data.message === "이미 신고하신 콘텐츠입니다."
          ? showToast(data.message, "info")
          : showToast(data.message, "success");
      },
    }
  );
};
