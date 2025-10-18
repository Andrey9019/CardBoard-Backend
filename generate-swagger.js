const fs = require('fs')
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Card&Board API',
      version: '1.0.0',
      description: 'API для інтернет-магазину настільних ігор Card&Board',
    },
    servers: [{ url: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001' }],
  },
  apis: ['./src/app/api/**/route.ts'],
};

const specs = swaggerJsdoc(options);
fs.writeFileSync('./public/swagger.json', JSON.stringify(specs, null, 2));
