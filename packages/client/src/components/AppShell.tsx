import { AppShell, Burger, Button, Flex, NavLink } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
    { name: "Главная", link: "/workerDashbord" },
    { name: "Календарь смен", link: "/calendarShifts" },
    { name: "Смены", link: "/shifts" },
    { name: "Записи", link: "/booking" },
    { name: "Аналитика", link: "/analytics" },
    { name: "Клиенты", link: "/clients" },
    { name: "Мастера", link: "/workers" },
    { name: "Услуги", link: "/services" },
  ];

  return (
    <AppShell
      withBorder
      padding="md"
      header={{ height: 60 }}
      navbar={{
        width: 150,
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
            {navList.map((item) => (
              <NavLink
                key={item.link}
                component={Link}
                to={item.link}
                label={item.name}
                active={location.pathname === item.link}
                variant="filled"
                onClick={toggle}
              />
            ))}
          </Flex>

          <Flex>
            <ThemeToggle />
            <NavLink
              component={Link}
              to="/login"
              label="Выйти"
              variant="filled"
              color="red"
              onClick={() => {
                localStorage.removeItem("token");
              }}
            />
          </Flex>
        </Flex>
      </AppShell.Navbar>

      <AppShell.Main
        styles={{
          main: {
            height: "calc(100dvh - 60px)",
            overflow: "auto",
          },
        }}
      >
        {children}
      </AppShell.Main>
    </AppShell>
  );
};
