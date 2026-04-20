import { Button, Flex, Modal, Stack, TextInput } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { workersRegistrate, type workersRegistrateInput } from "shared";

interface AddWorkersModal {
  opened: boolean;
  onClose: () => void;
  handleSubmit: (values: workersRegistrateInput) => void;
  isLoading: boolean;
}

const AddWorkersModal = ({
  opened,
  onClose,
  handleSubmit,
  isLoading,
}: AddWorkersModal) => {
  const form = useForm<workersRegistrateInput>({
    initialValues: {
      name: "",
      email: "",
      password: "",
      phone: "",
    },
    validate: zodResolver(workersRegistrate),
  });

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={"Добавить работника"}
      centered
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <TextInput
            label="ФИО"
            placeholder="Иванов Иван Иванович"
            {...form.getInputProps("name")}
          />

          <TextInput
            placeholder="email@company.com"
            label="email"
            {...form.getInputProps("email")}
          />

          <TextInput
            min={6}
            max={180}
            label="Пароль"
            {...form.getInputProps("password")}
          />

          <TextInput label="Телефон" min={0} {...form.getInputProps("phone")} />

          <Flex gap="md" justify="flex-end">
            <Button variant="subtle" onClick={onClose}>
              Отмена
            </Button>
            <Button type="submit" loading={isLoading}>
              {"Создать"}
            </Button>
          </Flex>
        </Stack>
      </form>
    </Modal>
  );
};

export default AddWorkersModal;
