export default {
  name: 'default',
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'postgres',
  schema: 'public',
  // Run migrations automatically,
  // you can disable this if you prefer running migration manually.
  migrationsRun: true,
  synchronize: false,
  logging: 'error',
  logger: 'file',
  entities: [__dirname + '/../../**/*.model{.ts,.js}'],
  migrations: [__dirname + '/../../migration/**/*{.ts,.js}'],
  cli: {
    migrationsDir: '/../../migrations',
  },
};
