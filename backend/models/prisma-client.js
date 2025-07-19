// models/prisma-client.js
const { PrismaClient } = require('../generated/prisma'); // Go up one level (backend/) then into generated/prisma
const prisma = new PrismaClient();
module.exports = prisma;