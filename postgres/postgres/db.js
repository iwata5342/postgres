const Pool = require("pg").Pool;

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "test",
    password: "oasys2204",
    port: 5432,
});

module.exports = pool;
