import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { helmet } from 'elysia-helmet';
// import { rateLimit } from 'elysia-rate-limit';

export const securitySetup = (app: Elysia) =>
  app
    .use(cors(/* Options */))
    .use(
      helmet({
        // Modify CSP to enable Swagger UI with Helmet.js
        contentSecurityPolicy: {
          directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", 'unpkg.com'],
            styleSrc: ["'self'", 'unpkg.com'],
            imgSrc: ['data:'],
          },
        },
      })
    )
