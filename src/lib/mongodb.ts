import { MongoClient } from "mongodb";

const uri = process.env.MONGO_URI;
const dbName = process.env.MONGO_DB || "pizzahub";

if (!uri) {
  throw new Error("MONGO_URI is missing.");
}

const options = {
  maxPoolSize: 10,
};

declare global {
  var mongoClient: MongoClient | undefined;
}

const client =
  globalThis.mongoClient ?? new MongoClient(uri, options);

if (process.env.NODE_ENV !== "production") {
  globalThis.mongoClient = client;
}

export const db = client.db(dbName);

export { client };