// src/components/EditServiceModal/EditServiceModal.tsx
import {
  Modal,
  TextInput,
  SegmentedControl,
  Button,
  Stack,
  Flex,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { categoryOptions, updateServiceSchema, type UpdateServiceInput } from "shared";
import { useUpdateServices } from "src/api/services/update";

interface EditServiceModalProps {
  opened: boolean;
  onClose: () => void;
  service: UpdateServiceInput;
}

export function EditServiceModal({
  opened,
  onClose,
  service,
}: EditServiceModalProps) {
  const UpdateServices = useUpdateServices();

  const form = useForm<UpdateServiceInput>({
    initialValues: service,
    validate: zodResolver(updateServiceSchema),
  });

  const handleSubmit = (values: UpdateServiceInput) => {
    UpdateServices.mutate(values);
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Редактировать услугу"
      centered
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <TextInput label="Название" {...form.getInputProps("name")} />

          <SegmentedControl
            data={categoryOptions}
            {...form.getInputProps("category")}
          />

          <TextInput
            type="number"
            label="Длительность (мин)"
            {...form.getInputProps("duration")}
          />
          <TextInput
            type="number"
            label="Цена (₽)"
            {...form.getInputProps("price")}
          />
          <TextInput label="Описание" {...form.getInputProps("description")} />

          <Flex gap="md" justify="flex-end">
            <Button variant="subtle" onClick={onClose}>
              Отмена
            </Button>
            <Button type="submit">Сохранить</Button>
          </Flex>
        </Stack>
      </form>
    </Modal>
  );
}
