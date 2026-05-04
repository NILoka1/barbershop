import { Button, Flex, Title } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { TextInput } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import React from "react";

interface ServicesHeaderProps {
  query: string;
  setQuery: (query: string) => void;
  openCreateModal: () => void;
}

export const ServicesHeader = React.memo(
  ({ query, setQuery, openCreateModal }: ServicesHeaderProps) => {
    const isMobile = useMediaQuery("(max-width: 768px)");

    return (
      <Flex justify="space-between" align="center">
        <Title order={2}>Услуги</Title>

        {!isMobile && (
          <TextInput
            placeholder="Поиск по услугам..."
            leftSection={<IconSearch size={16} />}
            value={query}
            onChange={(e) => setQuery(e.currentTarget.value)}
            style={{ width: 250 }}
          />
        )}

        <Button onClick={openCreateModal}>Добавить услугу</Button>
      </Flex>
    );
  },
);
