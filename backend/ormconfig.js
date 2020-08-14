require("dotenv").config();

module.exports = {
	type: "postgres",
	host: process.env.DB_HOST,
	port: parseInt(process.env.DB_PORT, 10) || 5432,
	username: process.env.DB_USER,
	password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  migrations: [
    "./src/database/migrations/*.ts"
  ],
  cli: {
    migrationsDir: "./src/database/migrations"
  }
};