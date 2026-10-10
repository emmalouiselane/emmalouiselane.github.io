import { preview } from 'astro';

// Use the API so Astro's agent-aware CLI does not detach the test server.
const server = await preview({ server: { host: '127.0.0.1', port: 4321 } });
for (const signal of ['SIGINT', 'SIGTERM']) {
  process.once(signal, async () => {
    await server.stop();
    process.exit(0);
  });
}
