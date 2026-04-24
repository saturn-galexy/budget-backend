require('dotenv').config();

console.log(process.env.CONNECTION_STRING ? "OK" : "MISSING");