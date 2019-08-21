require('dotenv').config();

const pgp = require('pg-promise')({
    // Logs SQL queries to the console.
    query: (e) => console.log(e.query)
});
const db = pgp({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME
});
console.log(process.env.DB_HOST);
console.log(process.env.DB_PORT);
console.log(process.env.DB_NAME);
console.log('yay you did the thing. wow.');
module.exports = db;






