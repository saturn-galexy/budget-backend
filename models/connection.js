const mongoose = require('mongoose');

const connectionString = process.env.CONNECTION_STRING;

if (!connectionString) {
  console.error('❌ CONNECTION_STRING is undefined');
}

mongoose.connect(connectionString, { connectTimeoutMS: 2000 })
  .then(() => console.log('✅ Database connected'))
  .catch(error => console.error('❌ MongoDB connection error:', error.message));