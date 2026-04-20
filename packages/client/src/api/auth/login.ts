import { trpc } from "../../main";


export function useLoginMutation() {
  return trpc.auth.login.useMutation({
    onSuccess: (data) => {
      console.log("✅ Успешный вход:", data);
      localStorage.setItem("token", data.token);
      // Редирект на главную
    },
    onError: (error) => {
      console.error("❌ Ошибка входа:", error.message);
    },
  });
}