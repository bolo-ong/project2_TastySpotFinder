import axios from "apis";

export interface ReportResponse {
  message: string;
}

export const patchReportContent = async (
  contentType: "user" | "restaurantList" | "review",
  contentId: string
) => {
  try {
    const res = await axios.patch(
      "/api/report/patchReportContent",
      {
        contentType,
        contentId,
      },
      {
        withCredentials: true,
      }
    );
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
