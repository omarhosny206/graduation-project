import swaggerJsdoc from 'swagger-jsdoc';

const swaggerOptions: swaggerJsdoc.Options = {
  definition: {
    host: 'localhost:8080',
    basePath: '/api',
    openapi: '3.0.0',
    info: {
      title: 'PASS REST API Docs',
      version: '1.0.0',
    },
  },
  apis: ['./swagger-api-doc/**/*.yaml'],
};

export const swaggerSpec = swaggerJsdoc(swaggerOptions);
