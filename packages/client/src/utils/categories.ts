export const categoryLabels: Record<string, string> = {
  SALON: 'Парикмахерская',
  MANICURE: 'Маникюр',
  COSMETICS: 'Косметология',
};

export const getCategoryLabel = (category: string): string => {
  return categoryLabels[category] || category;
};