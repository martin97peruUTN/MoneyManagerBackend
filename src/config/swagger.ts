import swaggerJsdoc from 'swagger-jsdoc';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Money Manager API',
    version: '1.0.0',
    description: 'API documentation for Money Manager Backend - A personal finance management system',
    contact: {
      name: 'API Support',
    },
  },
  servers: [
    {
      url: 'http://localhost:1234',
      description: 'Development server',
    },
    {
      url: 'https://money-manager-backend.onrender.com',
      description: 'Production server (Render)',
    },
    {
      url: 'https://money-manager-backend.vercel.app',
      description: 'Production server (Vercel)',
    },
  ],
  tags: [
    { name: 'Authentication' },
    { name: 'Admin' },
    { name: 'Users' },
    { name: 'Accounts' },
    { name: 'Currencies' },
    { name: 'Transaction Categories' },
    { name: 'Transactions' },
    { name: 'Transfers' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter JWT token obtained from /login endpoint',
      },
    },
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          username: { type: 'string', example: 'john_doe' },
          name: { type: 'string', example: 'John' },
          lastname: { type: 'string', example: 'Doe' },
          role: { type: 'string', example: 'User', enum: ['User', 'Admin'] },
        },
      },
      Account: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          name: { type: 'string', example: 'Savings Account' },
          balance: { type: 'number', format: 'float', example: 1500.50 },
          currencyId: { type: 'integer', example: 1 },
          userId: { type: 'integer', example: 1 },
        },
      },
      Transaction: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          amount: { type: 'number', format: 'float', example: 100.00 },
          comment: { type: 'string', nullable: true, example: 'Grocery shopping' },
          date: { type: 'string', format: 'date-time', example: '2024-01-15T10:30:00Z' },
          accountId: { type: 'integer', nullable: true, example: 1 },
          transactionCategoryId: { type: 'integer', example: 1 },
        },
      },
      TransactionCategory: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          name: { type: 'string', example: 'Groceries' },
          isExpense: { type: 'boolean', example: true },
          public: { type: 'boolean', example: false },
          userId: { type: 'integer', nullable: true, example: 1 },
        },
      },
      Currency: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          name: { type: 'string', example: 'US Dollar' },
          symbol: { type: 'string', example: '$' },
          code: { type: 'string', example: 'USD' },
        },
      },
      Transfer: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          amount: { type: 'number', format: 'float', example: 500.00 },
          destinyAmount: { type: 'number', format: 'float', example: 500.00 },
          comment: { type: 'string', nullable: true, example: 'Transfer to savings' },
          date: { type: 'string', format: 'date-time', example: '2024-01-15T10:30:00Z' },
          originAccountId: { type: 'integer', nullable: true, example: 1 },
          destinyAccountId: { type: 'integer', nullable: true, example: 2 },
        },
      },
      Error: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'Error message' },
        },
      },
      LoginRequest: {
        type: 'object',
        required: ['username', 'password'],
        properties: {
          username: { type: 'string', example: 'john_doe' },
          password: { type: 'string', example: 'password123' },
        },
      },
      LoginResponse: {
        type: 'string',
        description: 'JWT token',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
};

const options: swaggerJsdoc.Options = {
  definition: swaggerDefinition,
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
