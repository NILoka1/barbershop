import { z } from 'zod';

// 👇 ОПРЕДЕЛЯЕМ ENUM ОТДЕЛЬНО
export const ServiceCategory = z.enum(['SALON', 'MANICURE', 'COSMETICS']);
export type ServiceCategory = z.infer<typeof ServiceCategory>;

// 👇 ИСПОЛЬЗУЕМ В СХЕМЕ
export const addServiceSchema = z.object({
  name: z.string().min(1, 'Название обязательно'),
  category: ServiceCategory,
  duration: z.number().min(5, 'Минимум 5 минут'),
  price: z.number().min(0, 'Цена не может быть отрицательной'),
  description: z.string().optional(),
});

export type AddServiceInput = z.infer<typeof addServiceSchema>;

export const categories = ServiceCategory.options;

const categoryLabels: Record<ServiceCategory, string> = {
  SALON: 'Парикмахерская',
  MANICURE: 'Маникюр',
  COSMETICS: 'Косметология',
};

export const getCategoryLabel = (category: ServiceCategory): string => {
  return categoryLabels[category];
};

export const categoryOptions = categories.map((cat) => ({
  value: cat,
  label: getCategoryLabel(cat),
}));
