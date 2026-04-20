import { AppShell, Burger, Flex, NavLink } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Link, useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import { ThemeToggle } from "./ThemeToggle";

interface AppShProps {
  children: ReactNode;
}

interface NavItem {
  name: string;
  link: string;
}

export const AppSh = ({ children }: AppShProps) => {
  const [opened, { toggle }] = useDisclosure();
  const location = useLocation();
  
  const navList: NavItem[] = [
    { name: 'Главная', link: '/workerDashbord' },
    { name: 'Услуги', link: '/services' },
    { name: 'Смены', link: '/shifts' },
    { name: 'Записи', link: '/bookings' },
    { name: 'Мастера', link: '/workers' },
  ];

  return (
    <AppShell
      withBorder
      padding="md"
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: "sm",
        collapsed: { mobile: !opened },
      }}
    >
      <AppShell.Header>
        <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
      </AppShell.Header>

      <AppShell.Navbar>
        <Flex p="sm" h="100%" direction="column" justify="space-between">
          <Flex direction="column" gap="xs">
            {/* 👇 МАПИНГ СПИСКА */}
            {navList.map((item) => (
              <NavLink
                key={item.link}
                component={Link}
                to={item.link}
                label={item.name}
                active={location.pathname === item.link}
                variant="filled"
              />
            ))}
          </Flex>
          
          <Flex>
            <ThemeToggle />
          </Flex>
        </Flex>
      </AppShell.Navbar>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
};