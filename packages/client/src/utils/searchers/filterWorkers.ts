import type { inferRouterOutputs } from '@trpc/server';
import type { AppRouter } from 'server';

type RouterOutput = inferRouterOutputs<AppRouter>;
type ServiceFromDB = RouterOutput['workers']['getAll'][number];

export function filterWorkers(
  services: ServiceFromDB[] | undefined,
  query: string
): ServiceFromDB[] {
  if (!services) return [];
  if (!query.trim()) return services;

  const normalizedQuery = query.toLowerCase().trim();
  
  return services.filter((service) => {
    return (
      service.name.toLowerCase().includes(normalizedQuery) ||
      service.email.toLowerCase().includes(normalizedQuery) ||
      service.phone?.toLowerCase().includes(normalizedQuery)
    );
  });
}