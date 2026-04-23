import { useForm,schemaResolver } from "@mantine/form";
import { loginSchema } from "shared";
import { useLoginMutation } from "../../api/auth/login";

export const useLogin = () => {
  const loginMutation = useLoginMutation();

  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },
    validate: schemaResolver(loginSchema, {sync: true}),
    validateInputOnBlur: true,
  });

  const handleSubmit = (values: typeof form.values) => {
    loginMutation.mutate(values);
  };

  return { form, handleSubmit };
};
