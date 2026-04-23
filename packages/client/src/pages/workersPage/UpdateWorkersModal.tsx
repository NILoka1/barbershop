import { Button, Checkbox, Flex, Modal, Stack, TextInput } from "@mantine/core";
import { useForm, schemaResolver } from "@mantine/form";
import { workersUpdate, type workersUpdateInput } from "shared";
import { useModalStore } from "../../stores/workerModalStore";
import { useUpdateWorker } from "../../api/workers/update";
import { useEffect } from "react";

const UpdateWorkersModal = () => {
  const { isEditWorkerOpened, editingWorker, closeEditWorkerModal } =
    useModalStore();

  const UpdateWorker = useUpdateWorker();
  const handleUpdate = (values: workersUpdateInput) => {
    UpdateWorker.mutate(values);
    closeEditWorkerModal();
  };

  const form = useForm<workersUpdateInput>({
    initialValues: editingWorker || {
      id: "",
      name: "",
      email: "",
      phone: "",
      isAdmin: false,
    },
    validate: schemaResolver(workersUpdate),
  });

  useEffect(() => {
    if (editingWorker) {
      form.setValues(editingWorker);
    }
  }, [editingWorker]);

  if (!isEditWorkerOpened || !editingWorker) return null;

  return (
    <Modal
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
