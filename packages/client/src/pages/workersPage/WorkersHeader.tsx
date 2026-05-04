import { Button, Flex, Title } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { TextInput } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import React from "react";

interface WorkersHeaderProps {
  query: string;
  setQuery: (query: string) => void;
  openCreateModal: () => void;
}

export const WorkersHeader = React.memo(
  ({ query, setQuery, openCreateModal }: WorkersHeaderProps) => {
    const isMobile = useMediaQuery("(max-width: 768px)");

    return (
      <Flex gap={10} justify="space-between" w="100%" align="flex-start">
        <Title order={2}>Мастера</Title>

        {!isMobile && (
          <TextInput
            placeholder="Поиск по мастерам..."
            leftSection={<IconSearch size={16} />}
            value={query}
            onChange={(e) => setQuery(e.currentTarget.value)}
            style={{ width: 250 }}
          />
        )}

        <Button onClick={openCreateModal}>Добавить мастера</Button>
      </Flex>
    );
  },
);
