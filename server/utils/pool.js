const { Pool } = require('pg');

require('dotenv').config();

const db_url = process.env.DATABASE_URL || process.env.DB_URL;

const pool = new Pool({
    connectionString: db_url,
    ssl: {
        rejectUnauthorized: false
    }
});

module.exports = {
    query: (text, params) => pool.query(text, params)
}
