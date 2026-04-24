import { Button, Flex, Modal, Stack, TextInput } from "@mantine/core";
import { useForm, schemaResolver } from "@mantine/form";
import { workersRegistrate, type workersRegistrateInput } from "shared";
import { useCreateWorkers } from "src/api/workers/create";

const AddWorkersModal = ({opened, onClose}: {opened: boolean, onClose: () => void}) => {

  const CreateWorkers = useCreateWorkers();

  const handleCreate = (values: workersRegistrateInput) => {
    CreateWorkers.mutate(values, {
      onSuccess: () => {
        onClose();
        form.reset();
      },
      onError: (error) => {
        form.setErrors({ email: error.message });
      },
    });
  };

  const form = useForm<workersRegistrateInput>({
    initialValues: {
      name: "",
      email: "",
      password: "",
      phone: "",
    },
    validate: schemaResolver(workersRegistrate),
  });

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={"Добавить работника"}
      centered
    >
      <form onSubmit={form.onSubmit(handleCreate)}>
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
            <Button type="submit">{"Создать"}</Button>
          </Flex>
        </Stack>
      </form>
    </Modal>
  );
};

export default AddWorkersModal;
