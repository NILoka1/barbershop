import { useNavigate } from "react-router-dom";
import { trpc } from "../../main";
export function useLoginMutation() {
  const nav = useNavigate();

  return trpc.auth.login.useMutation({
    onSuccess: (data) => {
      console.log("✅ Успешный вход:", data);
      localStorage.setItem("token", data.token);
      nav('/workerDashbord')
    },
    onError: (error) => {
      console.error("❌ Ошибка входа:", error.message);
    },
  });
}
