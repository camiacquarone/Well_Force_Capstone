// models/prisma-client.js
const { PrismaClient } = require('@prisma/client'); // Go up one level (backend/) then into generated/prisma
const prisma = new PrismaClient();
module.exports = prisma;