import { Elysia } from 'elysia';
import 'dotenv/config';

const app = new Elysia()
  .get('/health', () => ({ ok: true }))
  .listen({ hostname: '0.0.0.0', port: Number(process.env.PORT ?? 3001) });

console.log(`API running at http://${app.server?.hostname}:${app.server?.port}`);
