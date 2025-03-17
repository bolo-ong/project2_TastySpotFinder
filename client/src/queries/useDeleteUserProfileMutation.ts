import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteUserProfile } from "apis/userAPI";
import { useToast } from "hooks";
import { useNavigate } from "react-router-dom";

export const useDeleteUserProfileMutation = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: deleteUserProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      showToast("프로필이 삭제되었습니다.", "success");
      navigate("/");
    },
    onError: () => {
      showToast("프로필 삭제에 실패했습니다.", "warning");
    },
  });
};
