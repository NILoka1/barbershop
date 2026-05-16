import {
  Button,
  Flex,
  Text,
  Container,
  Title,
  Paper,
  Group,
  ThemeIcon,
  Badge,
  Card,
  SimpleGrid,
} from "@mantine/core";
import { useNavigate } from "react-router-dom";
import {
  IconScissors,
  IconBrush,
  IconMassage,
  IconClock,
  IconPhone,
  IconMapPin,
} from "@tabler/icons-react";

export const HomePage = () => {
  const navigate = useNavigate();

  return (
    <Flex direction="column" mih="100vh">
      <Flex
        direction="column"
        align="center"
        justify="center"
        py={60}
        px="md"
        style={{
          background:
            "linear-gradient(135deg, var(--mantine-color-blue-6), var(--mantine-color-violet-6))",
          color: "white",
        }}
      >
        <Title order={1} size="h2" ta="center" mb="md" c="white">
          Барбершоп & Парикмахерская
        </Title>
        <Text size="lg" ta="center" maw={500} mb="xl" c="white" opacity={0.9}>
          Запишитесь онлайн в любое удобное время. Выберите услугу, дату и
          мастера за пару минут.
        </Text>
        <Button
          size="lg"
          variant="white"
          color="dark"
          onClick={() => navigate("/forclients")}
        >
          Записаться онлайн
        </Button>
      </Flex>

      <Container size="md" py={60}>
        <Title order={3} ta="center" mb="xl">
          Почему выбирают нас
        </Title>

        <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="lg">
          <Paper withBorder p="xl" radius="md" ta="center">
            <ThemeIcon variant="light" color="blue" size="xl" mb="md" mx="auto">
              <IconClock size={24} />
            </ThemeIcon>
            <Text fw={600} mb="xs">
              Удобная запись
            </Text>
            <Text size="sm" c="dimmed">
              Выберите удобное время и мастера онлайн. Без звонков и ожидания.
            </Text>
          </Paper>

          <Paper withBorder p="xl" radius="md" ta="center">
            <ThemeIcon
              variant="light"
              color="green"
              size="xl"
              mb="md"
              mx="auto"
            >
              <IconScissors size={24} />
            </ThemeIcon>
            <Text fw={600} mb="xs">
              Профессиональные мастера
            </Text>
            <Text size="sm" c="dimmed">
              Опытные барберы и стилисты с многолетним стажем.
            </Text>
          </Paper>

          <Paper withBorder p="xl" radius="md" ta="center">
            <ThemeIcon
              variant="light"
              color="violet"
              size="xl"
              mb="md"
              mx="auto"
            >
              <IconPhone size={24} />
            </ThemeIcon>
            <Text fw={600} mb="xs">
              Напоминания
            </Text>
            <Text size="sm" c="dimmed">
              Пришлём уведомление о записи, чтобы вы не забыли.
            </Text>
          </Paper>
        </SimpleGrid>
      </Container>

      <Container size="md" pb={60}>
        <Title order={3} ta="center" mb="xl">
          Наши услуги
        </Title>

        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
          <Card withBorder padding="lg" radius="md">
            <Group mb="sm">
              <ThemeIcon variant="light" color="blue" size="md">
                <IconScissors size={16} />
              </ThemeIcon>
              <Text fw={600}>Мужская стрижка</Text>
            </Group>
            <Group justify="space-between">
              <Badge variant="light" color="blue">
                30 мин
              </Badge>
              <Text fw={600}>от 1 500 ₽</Text>
            </Group>
          </Card>

          <Card withBorder padding="lg" radius="md">
            <Group mb="sm">
              <ThemeIcon variant="light" color="green" size="md">
                <IconBrush size={16} />
              </ThemeIcon>
              <Text fw={600}>Стрижка бороды</Text>
            </Group>
            <Group justify="space-between">
              <Badge variant="light" color="green">
                20 мин
              </Badge>
              <Text fw={600}>от 800 ₽</Text>
            </Group>
          </Card>

          <Card withBorder padding="lg" radius="md">
            <Group mb="sm">
              <ThemeIcon variant="light" color="violet" size="md">
                <IconMassage size={16} />
              </ThemeIcon>
              <Text fw={600}>Чистка лица</Text>
            </Group>
            <Group justify="space-between">
              <Badge variant="light" color="violet">
                60 мин
              </Badge>
              <Text fw={600}>от 2 000 ₽</Text>
            </Group>
          </Card>
        </SimpleGrid>
      </Container>

      <Container size="md" pb={60}>
        <Paper withBorder p="xl" radius="md">
          <Group justify="space-between" wrap="wrap">
            <Group gap="xs">
              <ThemeIcon variant="light" color="gray" size="sm">
                <IconMapPin size={14} />
              </ThemeIcon>
              <Text size="sm" c="dimmed">
                ул. Примерная, д. 1
              </Text>
            </Group>
            <Group gap="xs">
              <ThemeIcon variant="light" color="gray" size="sm">
                <IconPhone size={14} />
              </ThemeIcon>
              <Text size="sm" c="dimmed">
                +7 (999) 123-45-67
              </Text>
            </Group>
            <Button
              variant="subtle"
              size="xs"
              onClick={() => navigate("/login")}
            >
              Вход для сотрудников
            </Button>
          </Group>
        </Paper>
      </Container>
    </Flex>
  );
};
