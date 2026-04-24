import { Button, Checkbox, Flex, Modal, Stack, TextInput } from "@mantine/core";
import { useForm, schemaResolver } from "@mantine/form";
import { workersUpdate, type workersUpdateInput } from "shared";
import { useUpdateWorker } from "src/api/workers/update";
import { useEffect } from "react";

interface UpdateWorkersModalProps {
  opened: boolean;
  onClose: () => void;
  editingWorker: workersUpdateInput | null;
}

const UpdateWorkersModal = ({ opened, onClose, editingWorker }: UpdateWorkersModalProps) => {

  const UpdateWorker = useUpdateWorker();
  const handleUpdate = (values: workersUpdateInput) => {
    UpdateWorker.mutate(values);
    onClose();
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


  return (
    <Modal
      opened={opened}
      onClose={onClose}
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
            <Button variant="subtle" onClick={onClose}>
              Отмена
            </Button>
            <Button type="submit">{"Обновить"}</Button>
          </Flex>
        </Stack>
      </form>
    </Modal>
  );
};

export default UpdateWorkersModal;
