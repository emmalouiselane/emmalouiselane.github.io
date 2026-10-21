import type { APIRoute } from 'astro';
import { homeQuotes } from '../../lib/quotes';

export const prerender = true;

export const GET: APIRoute = () => new Response(
  JSON.stringify({ quotes: homeQuotes }),
  {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
  },
);
