import { AppShell, Badge, Burger, Flex, NavLink } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Link, useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { trpc } from "src/api/client";

interface AppShProps {
  children: ReactNode;
}

interface NavItem {
  name: string;
  link: string;
  additional?: string;
}

export const AppSh = ({ children }: AppShProps) => {
  const [opened, { toggle }] = useDisclosure();
  const location = useLocation();

  const bookingToConfirm = trpc.booking.countBookingToConfirm.useQuery().data;

  const navList: NavItem[] = [
    { name: "Главная", link: "/workerDashbord" },
    { name: "Календарь смен", link: "/calendarShifts" },
    {
      name: "Ожидают",
      link: "/confirmBooking",
      additional: bookingToConfirm ? `${bookingToConfirm}` : undefined,
    },
    { name: "Смены", link: "/shifts" },
    { name: "Записи", link: "/booking" },
    { name: "Аналитика", link: "/analytics" },
  ];

  const isAdmin =
    trpc.auth.me.useQuery().data?.isAdmin ||
    localStorage.getItem("isAdmin") === "true";
  if (isAdmin) {
    navList.push(
      { name: "Клиенты", link: "/clients" },
      { name: "Мастера", link: "/workers" },
      { name: "Услуги", link: "/services" },
    );
  }

  return (
    <AppShell
      withBorder
      padding="md"
      header={{ height: 60 }}
      navbar={{
        width: 170,
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
                rightSection={
                  item.additional ? (
                    <Badge size="xs" variant="light" color="blue">
                      {item.additional}
                    </Badge>
                  ) : undefined
                }
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
