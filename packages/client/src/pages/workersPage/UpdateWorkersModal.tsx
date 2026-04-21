import { Button, Checkbox, Flex, Modal, Stack, TextInput } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { workersUpdate, type workersUpdateInput } from "shared";
import { useModalStore } from "../../stores/workerModalStore";

const UpdateWorkersModal = () => {
  const { isEditWorkerOpened, editingWorker, closeEditWorkerModal } = useModalStore();

  const handleUpdate = () => {
    closeEditWorkerModal()
  };

  const form = useForm<workersUpdateInput>({
    initialValues: editingWorker || {
      id: "",
      name: "",
      email: "",
      phone: "",
      isAdmin: false,
    },
    validate: zodResolver(workersUpdate),
  });

  if (!isEditWorkerOpened || !editingWorker) return null;

  return (
    <Modal
      key={editingWorker.id}
      opened={isEditWorkerOpened}
      onClose={closeEditWorkerModal}
      title={"Изменить работника"}
      centered
    >
      <form onSubmit={form.onSubmit(handleUpdate)}>
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

          <TextInput label="Телефон" min={0} {...form.getInputProps("phone")} />

          <Checkbox
            label="Администрирование"
            {...form.getInputProps("isAdmin", { type: "checkbox" })}
          />
          <Flex gap="md" justify="flex-end">
            <Button variant="subtle" onClick={closeEditWorkerModal}>
              Отмена
            </Button>
            <Button type="submit">{"Создать"}</Button>
          </Flex>
        </Stack>
      </form>
    </Modal>
  );
};

export default UpdateWorkersModal;
