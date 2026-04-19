import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function seed() {
  console.log('🌱 Начинаем заполнение базы...\n');

  // 1. Создаём админа
  const adminExists = await prisma.worker.findFirst({
    where: { email: 'admin@barbershop.ru' }
  });

  if (!adminExists) {
    const adminPassword = await bcrypt.hash('admin123', 10);
    await prisma.worker.create({
      data: {
        email: 'admin@barbershop.ru',
        password: adminPassword,
        name: 'Администратор',
        phone: '+79001234567',
        isAdmin: true,
      }
    });
    console.log('✅ Администратор создан (admin@barbershop.ru / admin123)');
  } else {
    console.log('ℹ️ Администратор уже существует');
  }

  // 2. Создаём мастера
  const masterExists = await prisma.worker.findFirst({
    where: { email: 'master@barbershop.ru' }
  });

  let masterId: string;

  if (!masterExists) {
    const masterPassword = await bcrypt.hash('master123', 10);
    const master = await prisma.worker.create({
      data: {
        email: 'master@barbershop.ru',
        password: masterPassword,
        name: 'Иван Мастер',
        phone: '+79007654321',
        isAdmin: false,
      }
    });
    masterId = master.id;
    console.log('✅ Мастер создан (master@barbershop.ru / master123)');
  } else {
    masterId = masterExists.id;
    console.log('ℹ️ Мастер уже существует');
  }

  // 3. Создаём услуги
  const services = [
    { name: 'Мужская стрижка', category: 'SALON', duration: 30, price: 1500 },
    { name: 'Стрижка бороды', category: 'SALON', duration: 20, price: 800 },
    { name: 'Детская стрижка', category: 'SALON', duration: 30, price: 1000 },
    { name: 'Маникюр мужской', category: 'MANICURE', duration: 45, price: 1200 },
    { name: 'Чистка лица', category: 'COSMETICS', duration: 60, price: 2000 },
  ];

  for (const s of services) {
    const exists = await prisma.service.findFirst({
      where: { name: s.name }
    });
    
    if (!exists) {
      await prisma.service.create({
        data: {
          name: s.name,
          category: s.category as any,
          duration: s.duration,
          price: s.price,
        }
      });
      console.log(`✅ Услуга создана: ${s.name}`);
    }
  }

  // 4. Связываем мастера со всеми услугами
  const allServices = await prisma.service.findMany();
  
  for (const service of allServices) {
    const linkExists = await prisma.workerService.findUnique({
      where: {
        workerId_serviceId: {
          workerId: masterId,
          serviceId: service.id,
        }
      }
    });

    if (!linkExists) {
      await prisma.workerService.create({
        data: {
          workerId: masterId,
          serviceId: service.id,
        }
      });
    }
  }
  console.log('✅ Мастер связан со всеми услугами');

  console.log('\n🎉 Seed успешно завершён!');
}

seed()
  .catch((e) => {
    console.error('❌ Ошибка:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
