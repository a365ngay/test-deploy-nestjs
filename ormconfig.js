module.exports = {
  type: process.env['TYPEORM_DRIVER'] || 'postgres',
  host: process.env['TYPEORM_HOST'] || 'postgresql-hoanghong.alwaysdata.net',
  port: parseInt(process.env['TYPEORM_PORT'] || '5432', 10),
  username: process.env['TYPEORM_USERNAME'] || 'hoanghong',
  password: process.env['TYPEORM_PASSWORD'] || 'Hong1996@1996',
  database: process.env['TYPEORM_DATABASE'] || 'hoanghong_fsel_manage',
  synchronize: !!JSON.parse(process.env['TYPEORM_SYNCHRONIZE'] || 'false'),
  logging: !!JSON.parse(process.env['TYPEORM_LOGGING'] || 'false'),
  entities: [__dirname + '/dist/**/*.entity.js'],
  migrations: [__dirname + '/dist/migration/**/*.js'],
  subscribers: ['dist/subscriber/**/*.js'],
  cli: {
    entitiesDir: 'src/**/*.entity{.ts,.js}',
    migrationsDir: 'src/migration',
    subscribersDir: 'src/subscriber',
  },
};
