import { Button, Flex, Title } from "@mantine/core";

import React from "react";
import dayjs from "dayjs";
import "dayjs/locale/ru";
dayjs.locale("ru");

interface ShiftHeaderProps {
  openDateModal: () => void;
  formatDate: () => string;
  openCreateModal: () => void;
}

export const ShiftsHeader = React.memo(
  ({ openDateModal, formatDate, openCreateModal }: ShiftHeaderProps) => {
    return (
      <Flex direction="row" justify="space-between" align="center" w="100%">
        <Title order={2}>Смены</Title>
        <Button onClick={openDateModal}>{formatDate()}</Button>
        <Button onClick={openCreateModal}>Добавить</Button>
      </Flex>
    );
  },
);
