const Pool = require("pg").Pool;

const pool= new Pool(
    {
        user:"postgres",
        password:"8896",
        database:"code",
        host:"localhost",
        port:5432
    }
);

module.exports = pool