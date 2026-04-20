import { useForm, zodResolver } from "@mantine/form";
import { loginSchema } from "shared";
import { useLoginMutation } from "../../api/auth/login";

export const useLogin = () => {
  const loginMutation = useLoginMutation();

  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },
    validate: zodResolver(loginSchema),
    validateInputOnBlur: true,
  });

  const handleSubmit = (values: typeof form.values) => {
    loginMutation.mutate(values);
  };

  return { form, handleSubmit };
};
