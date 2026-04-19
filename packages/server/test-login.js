const { createTRPCProxyClient, httpBatchLink } = require('@trpc/client');
const superjson = require('superjson');

const client = createTRPCProxyClient({
  links: [httpBatchLink({ url: 'http://localhost:3001/trpc' })],
  transformer: superjson,
});

async function test() {
  try {
    const result = await client.auth.login.mutate({
      email: 'admin@barbershop.ru',
      password: 'admin123'
    });
    console.log('✅ Успех!', result);
  } catch (e) {
    console.error('❌ Ошибка:', e);
  }
}

test();
