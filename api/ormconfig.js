const path = require('path');
const { DataSource } = require('typeorm');

module.exports = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: 5432,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    entities: [path.join(__dirname, '../dist/**/*.entity{.js,.ts}')],
    migrations: ['dist/config/db/migrations/*.js'],
    cli: {
        entitiesDir: '../dist',
        migrationsDir: '../dist/config/db/migrations'
    }
});