const { MongoClient } = require('mongodb');

// URL koneksi MongoDB
const uri = 'mongodb://localhost:27017';

// Opsi koneksi MongoDB
const options = {};

// Membuat koneksi ke MongoDB
async function connectToMongoDB() {
  const client = new MongoClient(uri, options);

  try {
    // Menghubungkan ke server MongoDB
    await client.connect();
    console.log('Connected to MongoDB');
    return client;
  } catch (error) {
    console.error('Error connecting to MongoDB', error);
    throw error;
  }
}

module.exports = connectToMongoDB;
