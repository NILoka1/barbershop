// src/utils/filterServices.ts
import { getCategoryLabel } from 'shared';
import type { inferRouterOutputs } from '@trpc/server';
import type { AppRouter } from 'server';

type RouterOutput = inferRouterOutputs<AppRouter>;
type ServiceFromDB = RouterOutput['services']['getAll'][number];

export function filterServices(
  services: ServiceFromDB[] | undefined,
  query: string
): ServiceFromDB[] {
  if (!services) return [];
  if (!query.trim()) return services;

  const normalizedQuery = query.toLowerCase().trim();
  
  return services.filter((service) => {
    return (
      service.name.toLowerCase().includes(normalizedQuery) ||
      getCategoryLabel(service.category).toLowerCase().includes(normalizedQuery) ||
      service.duration.toString().includes(normalizedQuery) ||
      String(service.price).includes(normalizedQuery) ||
      (service.description?.toLowerCase().includes(normalizedQuery) ?? false)
    );
  });
}