// src/components/ServiceModal/ServiceModal.tsx
import { Modal, TextInput, NumberInput, Select, Button, Stack,Flex } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { addServiceSchema, type AddServiceInput, categoryOptions, type UpdateServiceInput } from 'shared';
import { useEffect } from "react";

interface ServiceModalProps {
  opened: boolean;
  onClose: () => void;
  service?: UpdateServiceInput|null;
  onSubmit: (values: AddServiceInput& {id?:string}) => void;
  isLoading?: boolean;
}

export function ServiceModal({ 
  opened, 
  onClose, 
  service, 
  onSubmit, 
  isLoading 
}: ServiceModalProps) {
  const form = useForm<AddServiceInput>({
    initialValues: {
      name: '',
      category: 'SALON',
      duration: 30,
      price: 0,
      description: '',
    },
    validate: zodResolver(addServiceSchema),
  });

  // 👇 Заполняем форму при редактировании
  useEffect(() => {
    if (service) {
      form.setValues({
        name: service.name,
        category: service.category as AddServiceInput['category'],
        duration: service.duration,
        price: Number(service.price),
        description: service.description || '',
      });
    } else {
      form.reset();
    }
  }, [service, opened]);

  const handleSubmit = (values: typeof form.values) => {
    onSubmit({ ...values, id: service?.id });
  };


  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={service ? 'Редактировать услугу' : 'Новая услуга'}
      centered
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <TextInput
            label="Название"
            placeholder="Мужская стрижка"
            {...form.getInputProps('name')}
          />
          
          <Select
            label="Категория"
            data={categoryOptions}
            {...form.getInputProps('category')}
          />
          
          <NumberInput
            label="Длительность (мин)"
            min={5}
            max={180}
            {...form.getInputProps('duration')}
          />
          
          <NumberInput
            label="Цена (₽)"
            min={0}
            decimalScale={0}
            {...form.getInputProps('price')}
          />
          
          <TextInput
            label="Описание"
            placeholder="Описание услуги"
            {...form.getInputProps('description')}
          />
          
          <Flex gap="md" justify="flex-end">
            <Button variant="subtle" onClick={onClose}>
              Отмена
            </Button>
            <Button type="submit" loading={isLoading}>
              {service ? 'Сохранить' : 'Создать'}
            </Button>
          </Flex>
        </Stack>
      </form>
    </Modal>
  );
}