import { Button, Flex, PasswordInput, Stack, Text, TextInput } from "@mantine/core";
import { useLogin } from "./useLogin";

function LoginPage() {
  const {form, handleSubmit} = useLogin()
  

  return (
    <>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Flex justify={"center"} align={"center"} h="100vh">
          <Stack gap={5} w={300}>
            <TextInput label="email" {...form.getInputProps("email")} />
            <PasswordInput label="Пароль" {...form.getInputProps("password")} />
            <Button type="submit">
              <Text>Войти</Text>
            </Button>
          </Stack>
        </Flex>
      </form>
    </>
  );
}

export default LoginPage;
