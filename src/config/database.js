import { MongoClient } from 'mongodb';

// MongoDB configuration
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const MONGODB_DB = process.env.MONGODB_DB || 'cashpot';

let client;
let clientPromise;

if (!client) {
  client = new MongoClient(MONGODB_URI);
  clientPromise = client.connect();
}

export default clientPromise;

export const getDatabase = async () => {
  const client = await clientPromise;
  return client.db(MONGODB_DB);
};

export const getCollection = async (collectionName) => {
  const db = await getDatabase();
  return db.collection(collectionName);
};

