import React from "react";
import { trpc } from "src/api/client";
import { ClientsList } from "./ClientsList";

export const ClientsPage = () => {
  const clients = trpc.clients.getAll.useQuery().data;

  if (!clients) {
    return <div>Нет клиентов</div>;
  }

  return (
    <>
      <ClientsList clients={clients} />
    </>
  );
};
