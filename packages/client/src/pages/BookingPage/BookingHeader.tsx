import { Button, Flex, Title } from "@mantine/core";
import React, { memo } from "react";

interface BookingHeaderProps {
  openDateModal: () => void;
  formatDate: () => string;
  openCreateModal: () => void;
}

export default memo(function BookingHeader({
  openDateModal,
  formatDate,
  openCreateModal
}: BookingHeaderProps) {
  return (
    <Flex direction="row" justify="space-between" align="center" w="100%">
      <Title order={2}>Записи</Title>
      <Button onClick={openDateModal}>{formatDate()}</Button>
      <Button onClick={openCreateModal} >Добавить</Button>
    </Flex>
  );
});
