// prisma.config.js
export default {
  schema: './prisma/schema.prisma',
  seeds: {
    run: 'node prisma/seed.js'
  }
};
