// src/components/ThemeToggle.tsx
import { ActionIcon, useMantineColorScheme } from '@mantine/core';
import { IconSun, IconMoon } from '@tabler/icons-react';

export function ThemeToggle() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === 'dark';

  return (
    <ActionIcon
      variant="outline"
      color={dark ? 'yellow' : 'blue'}
      onClick={toggleColorScheme}
      title="Переключить тему"
    >
      {dark ? <IconSun size={''} /> : <IconMoon size={18} />}
    </ActionIcon>
  );
}