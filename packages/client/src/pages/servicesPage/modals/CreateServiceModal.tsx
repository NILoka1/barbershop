// src/components/CreateServiceModal/CreateServiceModal.tsx
import {
  Modal,
  TextInput,
  Button,
  Stack,
  Flex,
  SegmentedControl,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import {
  addServiceSchema,
  type AddServiceInput,
  categoryOptions,
} from "shared";
import { useCreateServices } from "src/api/services/create";

interface CreateServiceModalProps {
  opened: boolean;
  onClose: () => void;
}

export function CreateServiceModal({
  opened,
  onClose,
}: CreateServiceModalProps) {
  const CreateServices = useCreateServices();

  const form = useForm<AddServiceInput>({
    initialValues: {
      name: "",
      category: "SALON",
      duration: 30,
      price: 0,
      description: "",
    },
    validate: zodResolver(addServiceSchema),
  });

  const handleSubmit = (values: AddServiceInput) => {
    CreateServices.mutate(values);
    onClose();
    form.reset();
  };

  return (
    <Modal opened={opened} onClose={onClose} title="Новая услуга" centered>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <TextInput
            label="Название"
            placeholder="Мужская стрижка"
            {...form.getInputProps("name")}
          />
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
          <TextInput
            label="Описание"
            placeholder="Описание услуги"
            {...form.getInputProps("description")}
          />
          <Flex gap="md" justify="flex-end">
            <Button variant="subtle" onClick={onClose}>
              Отмена
            </Button>
            <Button type="submit">Создать</Button>
          </Flex>
        </Stack>
      </form>
    </Modal>
  );
}
